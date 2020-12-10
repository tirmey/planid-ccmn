"use strict"
const express = require("express"),
			router = express.Router(),
			bodyParser = require("body-parser"),			
			mongoose = require("mongoose"),
			//MEUS MÓDULOS
			{ 
				jaAutenticado,
				recuperaPlanid,
				homologaPlanid,
				consolidaPlanid,
				routeData,
				criarLogErro,
				mensagens,
			} = require("../myModules/rotinasServidor"),
			{ 
				smtpTrans: nodeMailer, 
				mailHTML, 
				mailButton, 
				mensagem: mensagemNodemailer 
			} = require("../myModules/nodeMailer"),	
			//MODELOS
			Disciplina = require("../models/modeloDisciplina"),
			Contato = require("../models/modeloContato"),
			Planid = require("../models/modeloPlanid");

 
//////////////////////////////////////////
//////////////// HELPERS /////////////////
//////////////////////////////////////////

const aggregateArr = query => [
	{$lookup: {
			from: "contatos",
			localField: "autor",
			foreignField: "_id",
			as: "autor"
	}},
	{$unwind: "$autor"},
	{$match: query},					
	{$project: {'autor.grupos': 0, 'autor.mensagens': 0, 'autor.ultimoAcesso': 0, 'autor.mdm': 0, 'autor.senha': 0, 'autor.manutencao': 0, 'autor.permissoes': 0, 'autor.mensagensGerais': 0, 'autor.endereco': 0, 'autor.reservasEspacos': 0, 'autor.bloco': 0, 'autor.cargos': 0, 'autor.notifServicos': 0, 'autor.planids': 0, 'autor.setor': 0, 'autor.telefones': 0, 'autor.categoria': 0, 'autor.tipoIdentificacao': 0 }}
];

/////////////////////////////////////////////
//////////////// GET ROUTES /////////////////
/////////////////////////////////////////////

router.get('/homologar', jaAutenticado, homologaPlanid, routeData, (req, res) => {
	let unidadeHomologacao;
	if (!req.user.unidadePreenchimentoPlanid) {
		unidadeHomologacao = req.user.unidadeLotacao;
	} else  {
		unidadeHomologacao = req.user.unidadePreenchimentoPlanid === 'unidadeLocalizacao' ? req.user.unidadeLocalizacao : req.user.unidadeLotacao;
	}
	res.routeData.unidade = unidadeHomologacao;
	res.routeData.tipoUnidadeHomologacao = req.user.unidadePreenchimentoPlanid || 'unidadeLotacao';
	res.routeData.homologador = req.user.nome;
	res.routeData.consolidaPlanid = req.user.permissoes.consolidaPlanid;
	res.render('planidHomologacao', res.routeData);
});

router.get('/consolidar', jaAutenticado, consolidaPlanid, routeData, (req, res) => {
	res.render('planidConsolidacao', res.routeData);
});

router.get('/consulta-publica', routeData, (req, res) => {
	res.render('planidConsultaPublica', res.routeData);
});


router.get('/recuperar-planid', routeData, async (req, res) => {
	const query = req.query.query ? JSON.parse(req.query.query) : {},	
				collation = { locale: "pt", strength: 1 };		
	if (query._id) {
		query._id = mongoose.Types.ObjectId(query._id) 
	}
	const planid = await Planid
		.aggregate(aggregateArr(query))				
		.collation(collation);
	res.json(planid ? planid : { err: 'Planid não encontrado' })
});

router.get('/recuperar-planid-homologacao', jaAutenticado, recuperaPlanid, routeData, async (req, res) => {
	const query = req.query.query ? JSON.parse(req.query.query) : {};
	if (query._id) {
		query._id = mongoose.Types.ObjectId(query._id) 
	} 

	const aggregate = aggregateArr(query);
	if (req.query.countOnly) {
		aggregate.push({$count: 'novasMensagensQuant'});
	}
	const	collation = { locale: "pt", strength: 1 },					
				planids = await Planid
				.aggregate(aggregate)				
				.collation(collation);
	res.json(planids ? planids : { err: 'Planid não encontrado' })
});


router.get("/acompanhar/:userId/:id", async (req, res) => {
	if (!req.user) {
		return res.json({err: 'É necessário realizar login para consultar planids.'});
	}
	const obj = await Planid.findById(req.params.id).populate({path: 'autor', options:{select: 'nome'}}).select('autor.nome eventos semestre');
	if (!obj) {
		res.json({err: 'Objeto não localizado no banco de dados.'})
	} else if (req.user._id.toString() !== req.params.userId) {
		res.json({err: 'Código do chamado ou usuário não identificado'});
	} else {
		res.json(obj);
	}
});

router.get('/recuperar-disciplinas', jaAutenticado, async (req, res) => {
	const disciplinas = await Disciplina.find({ $or:[{unidade: req.query.unidade}, {unidade: ''} ] });
	res.json(disciplinas);
});

router.get('/recuperar-disciplina', jaAutenticado, async (req, res) => {
	const disciplina = await Disciplina.find({ nivel: req.query.nivel, $text: {$search: req.query.string} });
	res.json(disciplina);
});

router.get('/print', routeData, (req, res) => {	
	res.render('planidPrint', res.routeData);	
});

/////////////////////////////////////////////
//////////////// POST ROUTES ////////////////
/////////////////////////////////////////////

router.post('/editar-planid', jaAutenticado, homologaPlanid, routeData, async (req, res) => {
	const body = JSON.parse(req.body.data);
	body.dataDeEdicao = new Date().getTime();
	Planid.updateOne({_id: body._id}, {$set: body}, (err, item) => {
		if (err) {
			criarLogErro(`erro ao editar novo item >>> ${err}`);
			res.json({err: `Erro ao editar o item "${body.nomeInsumo}"`})
		} else {
			res.json({sucesso: `atualizado o item "${body.nomeInsumo} ${body.especificacao}"`});
		}		
	});
});

router.post('/enviar-mensagens-docentes', jaAutenticado, homologaPlanid, routeData, async (req, res) => {
	const semestre = req.body.semestre;
	const autores = req.body.autor ? [req.body.autor] : JSON.parse(req.body.autores);
	let contatos;
	let emails;
	const grupoDocentes = req.body.grupoDocentes;
	let msg = `
		<h2>Prezado(a) docente,</h2>
		<p>Há uma nova mensagem de <strong>${req.user.nome.toUpperCase()}</strong> <<a href='mailto:${req.user.email}'>${req.user.email}</a>>, gestor(a) dos planids de sua Unidade:</p>	
		<hr>	 			 
		${mensagemNodemailer(req.body.mensagem, 'Mensagem:')}		
	`;
	
	if (grupoDocentes === 'arrayNaoPreenchidos') {
		msg += `Para iniciar o preenchimento de seu planid referente ao semestre ${req.body.semestre}, acesse: <a href='https://www.ccs.ufrj.br/users/dashboard?dashboard-system=MEUS%20PLANIDS'>MEUS PLANIDS</a>.`;
		contatos = await Contato.find({_id: {$in: autores}}).select('nome email mensagens');	
		emails = contatos.map(c => c.email);	
		for (let i = 0; i < contatos.length; i++) {
			contatos[i].mensagens.push({
				titulo: `Gerenciamento de PLANIDS`,
				texto: msg,
				data: new Date().getTime(),
			});		
			await contatos[i].save();
		}
	} else if (grupoDocentes === 'arrayEnviados' || grupoDocentes === 'arrayNaoEnviados') {		
		if (req.body.autores) {
			contatos = await Contato
				.find({_id: {$in: autores}})
				.select('nome email planids')	
				.populate({path: 'planids', options:{select: 'eventos semestre'}});
			emails = contatos.map(c => c.email);
			for (let i = 0; i < contatos.length; i++) {
				const planid = contatos[i].planids.find(planid => planid.semestre === semestre);			
				planid.eventos.push({
					emissor: 'gerente',
					texto: req.body.mensagem,
					data: new Date().getTime(),
				});	
				await planid.save();
			}
			msg += `Para responder esta mensagem, <a href='https://www.ccs.ufrj.br/users/dashboard?dashboard-system=MEUS%20PLANIDS'>acesse seus planids</a> e clique sobre o ícone "mensagens" do planid ${req.body.semestre}.`;
		} else if (req.body.autor) {
			const planid = await Planid.findById(req.body.planid).populate({path:'autor', select: 'email'});
			emails = [planid.autor.email];
			planid.eventos.push({
				emissor: 'gerente',
				texto: req.body.mensagem,
				data: new Date().getTime(),
			});	
			await planid.save();			
			msg += `
				<p>Para responder esta mensagem, clique no botão abaixo:</p>
				${mailButton('responder mensagem', `https://www.ccs.ufrj.br/acompanhar-eventos/planid/${req.body.autor}/${req.body.planid}`)}
				<p>Caso nada aconteça ao clicar no botão, copie e cole o seguinte endereço na barra de endereço de seu navegador:</p>
				<p>https://www.ccs.ufrj.br/acompanhar-eventos/planid/${req.body.autor}/${req.body.planid}</p>
			`;
		}				
	}

	const mailOpts = {
		from: `'PLANIDS CCS' <${req.user.email}>`,
		bcc: [emails],
		replyTo: req.user.email,
		subject: 'Gerenciamento de PLANIDS',
		html: mailHTML(msg),
	};
	nodeMailer.sendMail(mailOpts);  
	res.json('ok');
});

router.get("/recuperar-docentes", (req, res) => {		
  const query = req.query.query ? JSON.parse(req.query.query) : [];
	var queryObject = { $and: [{...query}, {categoria: 'docente'}, {'planids.semestre': req.query.semestre}, {'planids.enviado': true}]};
	Contato
		.aggregate([
			{$lookup: {
					from: "planids",
					localField: "planids",
					foreignField: "_id",
					as: "planids",
			}},
			{$unwind: "$planids"},
			{$project: {nome: 1, categoria: 1, unidadePreenchimentoPlanid: 1, unidadeLotacao: 1, unidadeLocalizacao: 1, 'planids._id': 1, 'planids.enviado': 1, 'planids.semestre': 1 }},
			{$match: queryObject},					
		])	
		.sort({ nome: 1 })
		.collation({ locale: "pt", strength: 1 })
		.exec(function (err, contatos) {
		if (err) {
			console.log('err: >>>>>> ', err);
			return res.end("erro");
		}
		return res.json(contatos);
	});	
});

module.exports = router;
