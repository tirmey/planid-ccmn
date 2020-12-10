'strict mode'
const express = require("express"),
	    router = express.Router(),
      moment = require("moment-timezone"),
      bcrypt = require('bcrypt'),
      // MEUS MÓDULOS
      { urlEncoded, 
        crypto,
        criarLogErro,
        jaAutenticado,
        routeData,
        gerenteSistema,
        recuperarContatos,
        editarContatos,
        mensagens,
       } = require('../myModules/rotinasServidor'),       
      { smtpTrans: nodeMailer, mailHTML, mailButton } = require("../myModules/nodeMailer"),
      { textoCamelCase } = require('../myModules/arquivos'),
      // MEUS MODELOS
      Contato = require("../models/modeloContato"),
      Planid = require("../models/modeloPlanid");
//VARIÁVEIS
const mensagensNovoUsuario = [`Usuário já cadastrado. Realize login ou solicite a recuperação de sua senha. Em caso de dúvidas, contate-nos através da <a href="https://www.ccs.ufrj.br/central-atendimento" target="_blank">Central de Atendimento</a>`]
 
  
//////////////////////////////////////////////
///////////////// ROTAS GET //////////////////
//////////////////////////////////////////////

router.get("/cadastro", routeData, (req, res) => {
  res.render("usersNovoUsuario", res.routeData);  
});

router.post("/cadastro", urlEncoded, routeData, async (req, res) => {
  const contato = await Contato.findOne({email: req.body.email});
  if (contato) {
    return res.render('erro', 
    {mensagem: `<h2>${mensagensNovoUsuario[0]}</h2>`})
  }
  const email = crypto(req.body.email, 'encriptar');
  const nome = crypto(req.body.nome, 'encriptar');
  const mensagemEmail = `
    <div class="mensagem">
      <h2 style="font-size: 1.2rem;"> Prezado(a) ${req.body.nome.split(" ")[0]},</h2>
      <h2 style="font-size: 1.2rem;">Recebemos uma solicitação de cadastramento no portal do CCS. Para confirmar esta solicitação, clique no botão abaixo.</h2>
      ${mailButton('confirmar cadastramento', `https://www.ccs.ufrj.br/users/cadastro/novo-usuario/${nome}/${email}`)} 
      <p>*Caso nada aconteça ao clicar no botão, copie e cole o seguinte link na barra de endereços de seu navegador:</p>
      <span>https://www.ccs.ufrj.br/users/cadastro/novo-usuario/${nome}/${email}</span>
    </div>            
  `;
  const mensagemSucesso = `
    <h2>Pedido de cadastramento recebido. Para concluir o processo, siga as instruções constantes na mensagem enviada para o endereço de e-mail ${req.body.email}. Caso não encontre nossa mensagem em sua caixa de entrada, pedimos que verifique se esta não foi encaminhada para a caixa de spams.</h2>
  `;  
  const mailOpts = {
    from: `'Webdev - Decania CCS' <${process.env.USERMAIL}>`,
    to: req.body.email,
    subject: 'Cadastro de usuário | portal do CCS',
    html: mailHTML(mensagemEmail)
  };  
  nodeMailer.sendMail(mailOpts, function (err, response) {
    if (err) {
      res.routeData.mensagem = mensagens[2];
      res.status(500).render("erro", res.routeData);
    } else {
      res.routeData.mensagem = mensagemSucesso;
      res.render("sucesso", res.routeData);  
    }
  });
});

router.get("/cadastro/novo-usuario/:nome/:email", routeData, async (req, res) => {
  res.routeData.nome = crypto(req.params.nome, 'decriptar');
  res.routeData.email = crypto(req.params.email, 'decriptar');
  res.render("usersCadastro", res.routeData);
});

//rota para localizar contato específico via ajax
router.get("/recuperarContatoPorId", jaAutenticado, async (req, res) => {	
  const populate = req.query.populate ? req.query.populate : '';
  const select = req.query.select || '';
  const contato = await Contato.findById(req.query.id).select(select).populate(populate);
	contato ? res.json(contato) : res.end(contato);
});

//rota para localizar contatos via ajax
router.get("/recuperarContatos", jaAutenticado, recuperarContatos, (req, res) => {
  const query = req.query.query ? JSON.parse(req.query.query) : [];
  const populate = req.query.populate ? JSON.parse(req.query.populate) : '';
  const exibir = req.query.exibir ? JSON.parse(req.query.exibir) : '';  
  const queryObject = query.length ? { $and: query} : {};
	if (query.length) {
    Contato
      .find(queryObject)
      .collation({ locale: "en" })
      .populate(populate)
      .select(exibir)
      .sort({ nome: 1 })
      .exec(function (err, contatos) {
			if (err) {
        console.log('err: >>>>>> ', err);
				res.end("erro");
			} else {
				res.json(contatos);
			}
		});
	} else {
		res.json({err: 'Informe os termos e/ou autorizações para realizar a busca'});
	}
});

//localizar contatos
router.get("/localizar", routeData, jaAutenticado, gerenteSistema, (req, res) => {
	res.render("contatos_localizar", res.routeData);
});

//editar contatos GET
router.get("/editar/:id", routeData, jaAutenticado, gerenteSistema, (req, res) => {
  res.routeData.id = req.params.id,
	res.render("contatos_editar", res.routeData);
});

router.post("/cadastro/novo-usuario/", urlEncoded, routeData, async (req, res) => {  
  let user = await Contato.findOne({identificacao: req.body.identificacao});  
  if (user) {
    res.render('erro', {
      mensagem: `<h2>${mensagensNovoUsuario[0]}</h2>`,
      csrfToken: req.csrfToken()
    }); 
  } else {
    let tipoIdentificacao;
    switch (req.body.categoria) {
      case 'estudante':
        tipoIdentificacao = 'dre';
        break;    
      case 'docente':
      case 'tecnico':      
        tipoIdentificacao = 'siape';
        break;
      default:
        tipoIdentificacao = 'cpf';
        break;
    }
    let senha, telefones = [];

    if (req.body.telefones) {      
      if (Array.isArray(req.body.telefones)) {
        for (let i = 0; i < req.body.telefones.length; i++) {
          telefones.push({tipo: req.body.telefonesTipo[i], numero: req.body.telefones[i]});
        }
      } else {
        telefones = [{tipo: req.body.telefonesTipo, numero: req.body.telefones}];
      }
    }
    senha = await bcrypt.hash(req.body.senha, 12);
    const msgText = `
      <h3>Prezado(a) ${req.body.nome},</h3>
      <p>Agradecemos pelo seu cadastramento no portal do CCS. A partir de agora, nossos sistemas estarão disponíveis. Uma <a href='https://www.ccs.ufrj.br/users/dashboard'>área exclusiva do usuário</a> estará à disposição para o gerencimento de seus dados, serviços e mensagens. Sugerimos que guarde esta mensagem para conferências futuras.</p>
      <p>Lembramos que, para acessar os sistemas do CCS, é necessário realizar login no portal, informando sua identificação (<strong>${tipoIdentificacao.toUpperCase()}: ${req.body.identificacao}</strong>) e a senha indicada no formulário de cadastramento.</p>
      <p>Caso deseje, poderá registrar críticas e sugestões através de nossa <a href='https://www.ccs.ufrj.br/fale-conosco'>Central de atendimento</a>, ou pelo e-mail <a href='mailto: webdev@ccsdecania.ufrj.br'>webdev@ccsdecania.ufrj.br</a>.</p>
      <p>Cordialmente,</p>
      <p><strong>Assessoria de Desenvolvimento Web</strong></p>
      <p>Centro de Ciências da Saúde da UFRJ</p>
    `;
    mensagem = {
      titulo: "Bem vindo!",
      texto: msgText,
      data: new Date().getTime()
    }

    const newContact = {
      nome: req.body.nome,
      email: req.body.email,     
      telefones,   
      categoria: req.body.categoria,
      identificacao: textoCamelCase(req.body.identificacao),
      tipoIdentificacao,
      unidadeLotacao: req.body.unidadeLotacao,
      unidadeLocalizacao: req.body.unidadeLocalizacao,
      setor: req.body.setor,
      endereco: req.body.endereco,
      bloco: req.body.bloco,
      departamento: req.body.departamento,
      titulacao: req.body.titulacao,
      classe: req.body.classe,
      regime: req.body.regime,
      vinculo: req.body.vinculo,
      nivelCurso: req.body.nivelCurso,
      programaPG: req.body.programaPG,
      cursoPG: req.body.cursoPG,
      cursoGrad: req.body.cursoGrad,
      unidadeEstagio: req.body.unidadeEstagio,
      ultimoAcesso: [new Date().getTime()],
      senha,
      permissoes: {reservarAuditorios:false},
      mensagens: [mensagem],
      notifServicos: {
        email: true,
        site: true
      },
      mensagensGerais: {
          email: true,
          site: true
      },
    };

    if (req.body.categoria === 'docente') {
      newContact.unidadePreenchimentoPlanid = req.body.unidadePreenchimentoPlanid ? req.body.unidadePreenchimentoPlanid : 'unidadeLotacao';
    };

    Contato.create(newContact)
      .then(user => {
        if (user.categoria !== 'docente') {
          user.planids = undefined;
          user.save();
        }
        
        var mailOpts = {
          from: `'Assessoria de Desenvolvimento Web do CCS - UFRJ' <${process.env.USERMAIL}>`,
          to: [req.body.email],
          subject: "Portal do CCS - cadastro efetuado",
          html: mailHTML(msgText)
        };

        nodeMailer.sendMail(mailOpts, function (error, response) {
          if (error) {
            res.status(500).render("erro", { mensagem: mensagens[2] });
          } else {          
            res.routeData.mensagem = `
              <h2>Prezado ${req.body.nome},</h2>
              <h2>Concluímos a crição de seu cadastro no portal do CCS. Para acessar a área de usuário, efetue login e clique em "meu perfil", nas opções de usuário.</h2>`;
            res.render('sucesso', res.routeData);
          }
        });         
      })
      .catch(err => {
        res.render('erro', {
          mensagem: `${mensagens[2]} = ${err}`
        }); 
      });
  }  
});

// edicao de contatos (dashboard)
router.post('/cadastro/editar-usuario', jaAutenticado, async (req, res) => {
  const body = JSON.parse(req.body.elements);
  if (req.body.novoEmail) {
    const emailExistente = await Contato.count({email: req.body.novoEmail});
    if (emailExistente) {
      return res.json({err: 'Email vinculado a outro cadastro. As alterações não foram salvas'});
    }
  }
  if (body.categoria) {
    criarLogErro(`Esse aqui tentou burlar o sistema: ${req.user.identificacao}`);
    res.routeData.mensagem = `<p>Obrigado por atualizar seus dados cadastrais.</p>`;
    return res.render("sucesso", res.routeData);
  }
  let camposProibidos = ['nome', 'categoria', 'identificacao', 'dataIngresso', '_csrf', 'unidadeLotacao', 'unidadeLocalizacao', 'unidadePreenchimentoPlanid'];
  if (req.user.categoria === 'estudante') {
    camposProibidos = [...camposProibidos, 'unidadeLotacao', 'nivelCurso', 'programaPG', 'cursoPG', 'cursoGrad'];
  }
  for (let i = 0; i < camposProibidos.length; i++) {
    if(body[camposProibidos[i]]) {
      delete  body[camposProibidos[i]];
    }
  }
  const unsetProperties = { paraNaoDeixarUnsetVazio: ''};
  if (req.user.categoria === 'estudante' && !body.unidadeEstagio) {
    unsetProperties.unidadeEstagio = '';
  }
  await Contato.findOneAndUpdate({ _id: req.user._id }, { $set: body, $unset: unsetProperties }, {new: true, strict: false});
  res.json('Edições salvas');
});

// edicao de contatos
router.post("/editar/:id", jaAutenticado, editarContatos, (req, res) => {
	const body = JSON.parse(req.body.data);
	Contato.findById(req.params.id, async (err, contato) => {
		if (err) {
			res.status(500).render("erro", { mensagem: "<p>Contato não localizado</p>", usuario: res.locals.usuario, permissoes: res.locals.permissoes});
		} else {		

      if (body.contexto) {
        const cargos = []
        for (let i = 0; i < body.contexto.length; i++) {
          let newCargo = {};
          newCargo.contexto = body.contexto[i];
          newCargo.cargo = body.cargo[i];
          newCargo.email = body.emailContexto[i];
          cargos.push(newCargo);
        }				
        contato.cargos = [...cargos];
			} 
      if (body.grupos) {
        var grupos = body.grupos[0].split(",");
        contato.grupos = [];
        for (let i = 0; i < grupos.length; i++) {
          contato.grupos.push(grupos[i]);
        }	
      }
			
			if (body.permissoes) {
        const permissoes = {}
				for (let i = 0; i < body.permissoes.length; i++) {
					permissoes[body.permissoes[i]] = true;
				}
        contato.permissoes = {...permissoes};		
			}
			if (contato.categoria !== 'docente') {
				contato.planids = undefined;
			}
			if (!contato.manutencao.length) {
				contato.manutencao = undefined;
			}
			if (!contato.reservasEspacos.length) {
				contato.reservasEspacos = undefined;
      }

      if (body.dadosParaAlterar) {
        const dadosArr = Object.entries(body.dadosParaAlterar);
        for (let i = 0; i < dadosArr.length; i++) {
          contato[dadosArr[i][0]] = dadosArr[i][1];
        }
      }
			await contato.save();
			res.json({success: 'contato salvo'});
		}
	});
});

//exclusão de contatos
router.post("/excluir/:id", jaAutenticado, gerenteSistema, (req, res) => {

	Contato.findOneAndRemove({_id: req.params.id}, (err, obj) => {
		if (err) {
			res.status(500).render("erro", { mensagem: "<h2>Usuário não localizado</h2>", usuario: res.locals.usuario, permissoes: res.locals.permissoes });
		} else {
			res.render("sucesso", { mensagem: "<h2>Usuário excluído</h2>", usuario: res.locals.usuario, permissoes: res.locals.permissoes });
		}
	});
});

router.get("/dashboard", routeData, jaAutenticado, (req, res) => {
  res.routeData.userId = req.user._id,
	res.render("dashboard", res.routeData);
});

//body: 
//finalizado - true ou false, 
//dados - objeto com array dos dados do envio
router.post('/planid/salvar', jaAutenticado, async (req, res) => {
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
  
  delete planid._csrf;
  let obj;
  if (req.body.idPlanid) {
    obj = await Planid.findById(req.body.idPlanid);
    /* if (obj.homologado) {
      return res.json({err: 'Este planid já foi homologado e não poderá ser editado novamente'});
    } */
    const doc = Object.entries(obj._doc);
    for (let i = 0; i < doc.length; i++) {
      if (planid[doc[i][0]] && Array.isArray(doc[i][1])) {
        //se a propriedade é array, é um campo do formulário e deve ser sobrescrito. Caso contrário, é campo extra-formulário e não deve ser sobrescrito;
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
      .find({_id: {$in: req.user.planids}})
      .select('semestre');
    for (let i = 0; i < userPlanids.length; i++) {
      
      if (userPlanids[i].semestre === planid.semestre) {
        return res.json({err: `Operação nao realizada. Detectamos planids duplicados no semestre ${planid.semestre}. Favor contactar a <a href='https://www.ccs.ufrj.br/fale-conosco?form=reportar-problema'>Assessoria de Desenvolvimento Web</a> e informar o ocorrido.`})
      }
    }
    obj =  await Planid.create(planid);    
  }
  if (obj) {
    const user = req.user;   
    if (req.body.finalizado === 'true') {
      let msg = `
        <h2>Prezado(a) ${user.nome.toUpperCase()}, </h2>
        <p>Confirmamos, por meio deste, o recebimento de seu planid referente ao semestre ${obj.semestre} às ${moment().tz("America/Sao_Paulo").format('HH:mm[h] [do dia] DD [de] MMMM [de] YYYY')}. Guarde este comprovante para futuras conferências.</p>
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

/* router.post('/planid/salvar-comentarios-gerais', jaAutenticado, async (req, res) => { 
  const planid = await Planid.findById(req.body.planid);
  planid.comentariosGerais = req.body.comentarios;
  await planid.save()
  res.json({sucesso: 'Comentários salvos'});
}); */


router.post('/editar-mensagens-usuario', jaAutenticado, async(req, res) => {
  const mensagem = await req.user.mensagens.find(msg => (msg._id).toString() === (req.body.id).toString());
  if (req.body.readStatus) {
    mensagem.lida = true;
    req.user.mensagens = [...req.user.mensagens.filter(msg => (msg._id).toString() !== (mensagem._id).toString()), mensagem];
    await req.user.save();
    res.json({success: 'Mensagem marcada como lida'});
  } else if (req.body.erase) {
    req.user.mensagens = [...req.user.mensagens.filter(msg => (msg._id).toString() !== (mensagem._id).toString())];
    req.user.save(err => {
      err ? res.json({err: '<h3>Houve um problema ao excluir sua mensagem. Por favor, tente novamente e, se o erro persistir, <a href="/fale-conosco?form=reportar-problema" target="_blank">entre em contato conosco.</a></h3>'}) : res.json({success: 'Mensagem apagada'});
    });
  }
});

router.post('/salvar-imagem-usuario', jaAutenticado, async (req, res) => {
  req.user.foto = req.body.public_id ? req.body.public_id : undefined;
  await req.user.save();
  res.json({user: req.user});
});

module.exports = router;
