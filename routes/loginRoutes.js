const express = require("express"),
	router = express.Router(),
	passport = require("passport"),
	bcrypt = require('bcrypt'),
	randomstring = require("randomstring"),
	// MEUS MODELOS
	Contato = require("../models/modeloContato"),
	// MEUS MÓDULOS
	login = require("../myModules/login"),
	{ textoCamelCase } = require('../myModules/arquivos'),
	{ routeData } = require('../myModules/rotinasServidor'),   
	{ smtpTrans: nodeMailer , mailHTML } = require("../myModules/nodeMailer");


//////////////////////////////////////////
/////////////// VARIAVEIS ////////////////
//////////////////////////////////////////

var saltRounds = 10;

const 
	formularioSenhaNova = message => `
		<h2>Alteração de senha</h2>
		<div class='erro-login__div'>
			${message}
		</div>
		<div>
			<label for="senhaAtual"><p>Senha Atual:</p></label>
			<input type="password" name="senhaAtual" id="senhaAtual" required>
		</div>
		<div>
			<label for="senhaNova"><p>Nova senha:</p></label>
			<input type="password" name="senhaNova" id="senhaNova" required>
		</div>
		<div>
			<label for="senhaConfirma"><p>Confirme a nova senha:</p></label>
			<input type="password" name="senhaConfirma" id="senhaConfirma" required>
		</div>
	`,
	formularioSenhaTemp = message => `
		<h2>Envio de senha temporária</h2>
		<div class='erro-login__div'>
			${message}
		</div>
		<div>
			<label for="identificacao">
				<p>Identificação</p>
				<i class='fa fa-info'></i>
				<span class='dica'>servidores - SIAPE, alunos - DRE, demais usuários - CPF:</span>
			</label>
			<input type="text" name="identificacao" id="identificacao" required>
		</div>
	`;

let usuario, permissoes = [];

//////////////////////////////////////////
///////////////// ROTAS //////////////////
//////////////////////////////////////////

//Rota intermediária a todas as rotas, definindo objetos que estarão disponível para o server side rendering
router.all("*", function (req, res, next) {
	if (req.user) {
		usuario = req.user.nome.split(" ")[0];
		permissoes = req.user.permissoes;
		categoria = req.user.categoria;
		csrfToken = req.csrfToken();
	} else {
		usuario = undefined;
		csrfToken = req.csrfToken();
	}
	next();
});

/* Requisição GET para página de LOGIN. */
router.get('/login', (req, res) => {
	// Mostra a página de Login com qualquer mensagem flash, caso exista
	const message = req.flash('message')[0];
	res.render('login', { message, csrfToken: req.csrfToken() });
});

const logoutUsuarioAnterior = (req, res, next) => {
	req.logout();
	next();
};

const formataCPF = (req, res, next) => {
	if (req.body.identificacao && (req.body.identificacao).includes('.') && (req.body.identificacao).includes('-')) {
		req.body.identificacao = textoCamelCase(req.body.identificacao);
	}
	next();
};

/* Requisição POST para LOGIN */
router.post('/login', logoutUsuarioAnterior, formataCPF, passport.authenticate('local', {
	failureRedirect: '/login',
	failureFlash: true
}), async (req, res) => {
	await Contato.findOneAndUpdate({ _id: req.user._id }, { ultimoAcesso: [new Date().getTime(), req.user.ultimoAcesso[0]] });
	if (req.user.excluido) {
		req.user.excluido = undefined;
		req.user.save();
	}
	if (req.body.urlDestino) {
		res.redirect(req.body.urlDestino);
	} else {
		res.redirect("/");
	}
});


//Requisição GET para alterar a senha do usuário
router.get('/alterarsenha', function (req, res) {
	//Abre um campo para escolher uma nova senha
	if (req.isAuthenticated()) {
		res.render('alterarSenha', { formulario: formularioSenhaNova(req.flash('message')), usuario, permissoes, csrfToken });
	}
	//Abre um campo para receber uma senha temporária via email
	else {		
		res.render('alterarSenha', { formulario: formularioSenhaTemp(req.flash('message')), csrfToken });
	}
});

//Requisição POST para alterar a senha do usuário
router.post('/alterarsenha', routeData, formataCPF, function (req, res) {
	//Confirma a alteração da senha
	if (req.isAuthenticated()) {
		if (!bcrypt.compareSync(req.body.senhaAtual, req.user.senha)) {
			req.flash('message', '<h2>Senha atual inválida.</h2>');
			res.redirect('/alterarsenha');
		}
		else if (req.body.senhaNova !== req.body.senhaConfirma) {
			req.flash('message', '<h2>As senhas novas não conferem.</h2>');
			res.redirect('/alterarsenha');
		}
		else {
			Contato.findById(req.user.id, function (err, user) {
				bcrypt.hash(req.body.senhaNova, saltRounds, function (err, hash) {
					user.senha = hash;
					user.save();
				});
			})
			res.routeData.mensagem = "<h2>Senha alterada com sucesso!</h2>";
			res.render("sucesso", res.routeData);
		}
	}
	//Envia uma senha temporária por email
	else {
		Contato.findOne({ identificacao: req.body.identificacao }, function (err, user) {
			if (!user) {
				req.flash('message', '<h2>Usuário não encontrado.</h2>');
				res.redirect('/alterarsenha');
			}
			else {
				var senhaTemp = randomstring.generate(8);
				bcrypt.hash(senhaTemp, saltRounds, function (err, hash) {
					user.senha = hash;
					user.save();
				});
				const message = `                
					<p>Prezado(a) ${user.nome},</p>
					<p>Segue, abaixo, sua senha temporária de acesso aos sistemas do Centro de Ciências da Saúde da UFRJ:</p> 
					<div style='width: 100%; margin: 30px 0; display: flex; justify-content: center;'>
						<h3 style='padding: 15px; margin: 0 auto; color: #fff; background-color: #116466; border-radius: 5px'>
							<strong>${senhaTemp}</strong>
						</h3>                    
					</div>	
					<p>Lembramos que, para realizar login, você deverá informar seu <strong>${user.tipoIdentificacao.toUpperCase()} (${user.identificacao})</strong>.</p>				
					<p>Recomendamos que altere essa senha, logo em seu primeiro acesso. Assim que efetuar a autenticação no portal do CCS, procure pelo link "alterar senha" no menu do usuário.</p>
					<p>Caso necessário, <a target="_blank" href="https://www.ccs.ufrj.br/fale-conosco?form=outros">entre em contato conosco</a>.`;
				var mailOpts = {
					from: `'Alteração de senha - Decania CCS' <${process.env.USERMAIL}>`,
					to: [user.email],
					subject: "Senha temporária de acesso",
					html: mailHTML(message)
				};
				nodeMailer.sendMail(mailOpts, function (error, response) {
					if (error) {
						res.status(500).render("erro", { mensagem: "<h2>Ocorreu um erro em sua requisição. Favor tentar novamente, ou <a href='/fale-conosco?form=reportar-problema' alt='link para a central de comunicação'>entre em contato conosco</a></h2>" });
					} else {
						res.routeData.mensagem = "<h2>Uma senha temporária foi enviada para o seu email.</h2>"
						res.render("sucesso", res.routeData);
					}
				});
			}
		});
	}
});

/* Manipula a saída */
router.get('/signout', function (req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;
