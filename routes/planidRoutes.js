"use strict"

const 
	express = require("express"),
	router = express.Router(),		
	mongoose = require("mongoose"),
	moment = require("moment-timezone"),
	//MEUS MÓDULOS
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

// bruxaria do mongoDB. se pretendem trabalhar com outra base de dados, apenas ignorem solenemente...
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

router.post('/planid/salvar', async (req, res) => {
  // O usuário está sendo buscado no banco de dados, uma vez que o planid foi desacoplado do sistema do CCS e não existe, nesta versão simplificada, módulo de autenticação...
  const user = await Contato.findById(JSON.parse(req.body.user));
  let incompleto = false;
  const planid = JSON.parse(req.body.dados);
  const dados = Object.entries(planid);
  for (let i = 0; i < dados.length; i++) {
    if (
      dados[i][0] !== 'atividadesComplementaresEnsinoDescricao' && 
      dados[i][0] !== 'atividadesComplementaresPesquisaDescricao' &&
      dados[i][0] !== 'atividadesCoopIntDescricao' &&
      dados[i][0] !== 'comentariosGerais'
      ) {
        for (let j = 0; j < dados[i][1].length; j++) {
          if (!dados[i][1][j] || dados[i][1][j] === 'Selecione uma opção:') {
            incompleto = true;
            break;
          }
        }
    }
  }
  if (req.body.finalizado === 'true' && incompleto) {
    return res.json({err: 'Todos os dados do planid devem ser preenchidos com dados válidos, antes de enviá-lo. Favor preencher ou remover os campos indicados.'});
  }    
  planid.semestre = planid.semestre[0];
  planid.autor = planid.autor[0];
  
  let obj;
  if (req.body.idPlanid) {
    obj = await Planid.findById(req.body.idPlanid);
    const doc = Object.entries(obj._doc);
    for (let i = 0; i < doc.length; i++) {
      if (planid[doc[i][0]] && Array.isArray(doc[i][1])) {
        //se a propriedade é array, é um campo do formulário e deve ser sobrescrito. Caso contrário, é campo extra-formulário e não deve ser sobrescrito (baaaaad-practice!!);
        obj[doc[i][0]] = planid[doc[i][0]];
      } else if (Array.isArray(doc[i][1])) {
        obj[doc[i][0]] = [];
      }
    } 
    if (req.body.finalizado === 'true') {
      obj.enviado = true;
    }
    
    obj.comentariosGerais = planid.comentariosGerais;    
    obj.dataDeEdicao = moment().valueOf();
    await obj.save();
  } else {
    const userPlanids = await Planid
      .find({_id: {$in: user.planids}})
      .select('semestre');
    for (let i = 0; i < userPlanids.length; i++) {
      
      if (userPlanids[i].semestre === planid.semestre) {
        return res.json({err: `Operação nao realizada. Detectamos planids duplicados no semestre ${planid.semestre}. Favor contactar a <a href='https://www.ccs.ufrj.br/fale-conosco?form=reportar-problema'>Assessoria de Desenvolvimento Web</a> e informar o ocorrido.`})
      }
    }
    obj =  await Planid.create(planid);    
  }
  if (obj) {      
    if (req.body.finalizado === 'true') {
      let msg = `
        <h2>Prezado(a) ${user.nome.toUpperCase()}, </h2>
        <p>Confirmamos, por meio deste, o recebimento de seu planid referente ao semestre ${planid.semestre} às ${moment().tz("America/Sao_Paulo").format('HH:mm[h] [do dia] DD [de] MMMM [de] YYYY')}. Guarde este comprovante para futuras conferências.</p>
        <p>Atenciosamente,</p>	
        <p>
          Assessoria de Desenvolvimento Web do CCS<br>
          Centro de Ciências da Saúde da UFRJ
        </p>	
      `;
      const mailOpts = {
        from: `'PLANIDS CCS' <${process.env.USERMAIL}>`,
        to: user.email,
        replyTo: [user.email],
        subject: 'Gerenciamento de PLANIDS',
        html: mailHTML(msg),
      };
      nodeMailer.sendMail(mailOpts);  
    } 
    user.planids = user.planids ? [...user.planids.filter(planid => planid.toString() !== obj._id.toString()), obj._id] : [obj._id];
    await user.save();
    res.json({sucesso: obj}) 
  } else {
    res.status(500).json({err: 'houve um erro ao salvar o planid'})
  } 
});

router.get('/homologar', async (req, res) => {
	let unidadeHomologacao;
	const user = await Contato.findById("5d1d00ac7bde400ed9e8f93e");
	if (!user.unidadePreenchimentoPlanid) {
		unidadeHomologacao = user.unidadeLotacao;
	} else  {
		unidadeHomologacao = user.unidadePreenchimentoPlanid === 'unidadeLocalizacao' ? user.unidadeLocalizacao : user.unidadeLotacao;
	}
	res.render('planidHomologacao', {
		unidade: unidadeHomologacao,
		tipoUnidadeHomologacao: user.unidadePreenchimentoPlanid || 'unidadeLotacao',
		homologador: user.nome,
		consolidaPlanid: user.consolidaPlanid,
	});
});

router.get('/consolidar', (req, res) => {
	res.render('planidConsolidacao', res.routeData);
});

router.get('/consulta-publica', (req, res) => {
	res.render('planidConsultaPublica', res.routeData);
});

router.get('/recuperar-planid', async (req, res) => {
	const query = req.query.query ? JSON.parse(req.query.query) : {};
	if (query._id) {
		query._id = mongoose.Types.ObjectId(query._id) 
	} 

	const aggregate = aggregateArr(query);
	if (req.query.countOnly) {
		aggregate.push({$count: 'novasMensagensQuant'});
	}
	const	
		collation = { locale: "pt", strength: 1 },					
		planids = await Planid
			.aggregate(aggregate)				
			.collation(collation);

	res.json(planids ? planids : { err: 'Planid não encontrado' })
});

router.get('/recuperar-disciplinas', async (req, res) => {
	const disciplinas = await Disciplina.find({ $or:[{unidade: req.query.unidade}, {unidade: ''} ] });
	res.json(disciplinas);
});

router.get('/recuperar-disciplina', async (req, res) => {
	const disciplina = await Disciplina.find({ nivel: req.query.nivel, $text: {$search: req.query.string} });
	res.json(disciplina);
});

router.get('/print', (req, res) => {	
	res.render('planidPrint', res.routeData);	
});

/////////////////////////////////////////////
//////////////// POST ROUTES ////////////////
/////////////////////////////////////////////

router.post('/editar-planid', async (req, res) => {
	const body = JSON.parse(req.body.data);
	body.dataDeEdicao = new Date().getTime();
	Planid.updateOne({_id: body._id}, {$set: body}, (err, item) => {
		if (err) {
			res.json({err: `Erro ao editar o item "${body.nomeInsumo}"`})
		} else {
			res.json({sucesso: `atualizado o item "${body.nomeInsumo} ${body.especificacao}"`});
		}		
	});
});

router.post('/enviar-mensagens-docentes', async (req, res) => {
	const semestre = req.body.semestre;
	const autores = req.body.autor ? [req.body.autor] : JSON.parse(req.body.autores);
	let contatos;
	let emails;
	const grupoDocentes = req.body.grupoDocentes;
	let msg = `
		<h2>Prezado(a) docente,</h2>
		<p>Há uma nova mensagem de <strong>${'nome do gerente aqui (req.user.nome, se houvesse registro da sessão)'}</strong> <<a href='mailto:email@gerentelogado.com.br'>email@gerentelogado.com.br</a>>, gestor(a) dos planids de sua Unidade:</p>	
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
		from: `'PLANIDS CCS' <${`req.user.email`}>`,
		bcc: [emails],
		replyTo: 'req.user.email',
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
