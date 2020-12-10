const bodyParser = require("body-parser"),
			Erro = require("../models/modeloErro"),
			CryptoJS = require('crypto-js');


const semPermissao = (res) => {
	res.status(401).render("erro", { mensagem: mensagens[1], ...res.routeData });
	return;
};

const jaAutenticado = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.status(401).render('login', {
		message: `
			<div class="icon-erro">
				<i class="fa fa-times"></i>
			</div> 
			<h1>Erro!</h1>
			<h2>Autenticação necessária para acessar este sistema.</h2>
		`,
		urlDestino: req.originalUrl,
		csrfToken: req.csrfToken()
	});
};

const routeData = (req, res, next) => {	
	res.routeData = req.user ? {
		usuario: req.user.nome.split(' ')[0],
		servidorDecania: req.user.unidadeLotacao === 'Decania do CCS' || req.user.unidadeLocalizacao === 'Decania do CCS',
		sistemas: {
			veiculos: req.user.categoria !== 'externo',
			planids: req.user.categoria === 'docente'
		},
		foto: req.user.foto ? req.user.foto : '',
		permissoes: req.user.permissoes,
		numMensagens: req.user.mensagens.length > 0 ? req.user.mensagens.filter(msg => !msg.lida).length : '',
	}	: {};	
	res.routeData.production = process.env.NODE_ENV === 'production';
	res.routeData.csrfToken = req.csrfToken();
	next();
}

/////////////////////////////////////////////
//////////////// PERMISSÕES /////////////////
/////////////////////////////////////////////

const recuperarContatos = (req, res, next) => {
	if (
			req.user.permissoes.gerenteSistema || 
			req.user.permissoes.homologaPlanid || 
			req.user.permissoes.consolidaPlanid || 
			req.user.permissoes.gerenteAlmoxarifado ||
			req.user.permissoes.gerenteEstacionamentos
		) {
		return next();
	}
	semPermissao(res, req.originalUrl);
};

const editarContatos = (req, res, next) => {
	if (
		req.user.permissoes.gerenteSistema
		|| req.user.permissoes.gerenteEstacionamentos			
	) {
		return next();
	}
	semPermissao(res, req.originalUrl);
};

const reservarAuditorios = (req, res, next) => {
	if (req.user.permissoes.reservarAuditorios) {
		return next();
	}
	semPermissao(res, req.originalUrl);
};

const analisarReservaAuditorios = (req, res, next) => {
	if (req.user.permissoes.analisarReservaAuditorios) {
		return next();
	}
	semPermissao(res, req.originalUrl);
};

const gerenteSistema = (req, res, next) => {
	if (req.user.permissoes.gerenteSistema) {
		return next();
	}
	semPermissao(res, req.originalUrl);
};

const chefeManutencao = (req, res, next) => {
	if (req.user.permissoes.chefeManutencao) {
		return next();
	}
	semPermissao(res, req.originalUrl);
};

const usuarioManutencao = (req, res, next) => {
	if (req.user && (req.user.unidadeLotacao === 'Decania do CCS' || req.user.unidadeLocalizacao === 'Decania do CCS')) {
		return next();
	}
	semPermissao(res, req.originalUrl);
};

const gerenteEstacionamentos = (req, res, next) => {
	if (req.user.permissoes.gerenteEstacionamentos) {
		return next();
	}
	semPermissao(res, req.originalUrl);
};

const usuarioEstacionamentos = (req, res, next) => {
	if (req.user && req.user.categoria !== 'externo') {
		return next();
	}
	semPermissao(res, req.originalUrl);
};

const usuarioAlmoxarifado = (req, res, next) => {
	if (req.user.permissoes.usuarioAlmoxarifado || req.user.permissoes.gerenteAlmoxarifado) {
		return next();
	}
	semPermissao(res, req.originalUrl);
};

const gerenteAlmoxarifado = (req, res, next) => {
	if (req.user.permissoes.gerenteAlmoxarifado) {
		return next();
	}
	semPermissao(res, req.originalUrl);
};

const recuperaPlanid = (req, res, next) => {
	let query;
	if (req.query._id) {
		query = req.query;
	} else if (req.query.query) {
		query = JSON.parse(req.query.query);
	}
	if (query || req.user.permissoes.homologaPlanid || req.user.permissoes.consolidaPlanid) {
		let achouPlanid = req.user.permissoes.homologaPlanid || req.user.permissoes.consolidaPlanid;
		if (!achouPlanid) {
			const planidsUser = req.user.planids;
			for (let i = 0; i < planidsUser.length; i++) {
				if (planidsUser[i].toString() === query._id) {
					achouPlanid = true;
				}
			}
		}
		if (!achouPlanid) {
			semPermissao(res);
		} else {
			next()
		}
	} else if (!req.user.permissoes.homologaPlanid) {
		semPermissao(res);
	}
};

const homologaPlanid = (req, res, next) => {
	if (req.user.permissoes.homologaPlanid) {
		return next();
	}
	semPermissao(res);
};

const consolidaPlanid = (req, res, next) => {
	if (req.user.permissoes.consolidaPlanid) {
		return next();
	}
	semPermissao(res);
};

const gerenteRH = (req, res, next) => {
	if (req.user.permissoes.gerenteRH) {
		return next();
	}
	semPermissao(res);
};

const urlEncoded = bodyParser.urlencoded({ extended: false });

const criarLogErro = function (mensagemErro) {
	Erro.create({
		data: new Date(),
		log: mensagemErro
	});
};

//gera data no universal no formato string, com fuso do Brasil
const gerarData = (dia, hora, minutos) => {
	return `${dia}T${('0' + hora).slice(-2)}:${('0' + minutos).slice(-2)}:00-03:00`;
}

//action: encriptar ou decriptar
const crypto = (string, acao) => {
	if (acao === 'encriptar') {
		var b64 = CryptoJS.AES.encrypt(string, process.env.ENCRYPT_SECRET).toString();	
    var e64 = CryptoJS.enc.Base64.parse(b64);
		var eHex = e64.toString(CryptoJS.enc.Hex);
		return eHex;
	} else if (acao === 'decriptar') {
		var reb64 = CryptoJS.enc.Hex.parse(string);
		var bytes = reb64.toString(CryptoJS.enc.Base64);
		var decrypt = CryptoJS.AES.decrypt(bytes, process.env.ENCRYPT_SECRET);
		var plain = decrypt.toString(CryptoJS.enc.Utf8);
		return plain;
	}
}

//ordena objetos em um array, baseada em uma propriedade qualquer
const ordenar = (a, b, ordem, prop) => {      
	if ((isNaN(+a[prop]) ? a[prop] : +a[prop]) < (isNaN(+b[prop]) ? b[prop] : +b[prop])) {      
		 return ordem === 'direta' ? -1 : 1;
	} else if ((isNaN(+a[prop]) ? a[prop] : +a[prop]) > (isNaN(+b[prop]) ? b[prop] : +b[prop])) {
			return ordem === 'direta' ? 1 : -1;
	} else {
			return 0;
	}
};

//get the host name. If it is localhost, uses port 3000, instead of 3010
const getHost = host => host.includes('localhost') ? 'http://localhost:3000' : `https://${host}`;

const telefonesString = tels => {
	let telefones = '';
	if (tels.length) {
		const filtered = tels.filter(tel => tel.tipo !== 'residencial');
		if (!filtered.length) {
			telefones = `${tels[0].tipo}: ${tels[0].numero}`;		
		} else {
			telefones = `${filtered[0].tipo}: ${filtered[0].numero}`;
			if (filtered.length > 1) {				
					telefones += ` | ${filtered[1].tipo}: ${filtered[1].numero}`; //máximo 2 números!
			}
		}
	}
	return telefones;
}

const mensagens = [
	"<h2>Página não encontrada. Por favor, verifique o endereço informado.</h2>",
	`<h2>Você não tem permissão para acessar essa página.</h2>`,
	"<p>Ocorreu um erro em sua requisição. Favor tentar novamente, ou <a href='/fale-conosco' title='link para a central de comunicação'>entre em contato conosco</a></p>",
	"<p>Agradecemos a colaboração e, caso queira manifestar sua opinião sobre esse sistema, solicitamos que utilize nossa <a href='https://www.ccs.ufrj.br/fale-conosco' title='link para a central de comunicação'>central de comunicação.</a></p>",
]


module.exports = {
	jaAutenticado,
	routeData,
	recuperarContatos,
	editarContatos,
	reservarAuditorios,
	analisarReservaAuditorios,
	gerenteSistema,
	chefeManutencao,
	usuarioManutencao,
	gerenteEstacionamentos,
	usuarioEstacionamentos,
	gerenteAlmoxarifado,
	usuarioAlmoxarifado,
	recuperaPlanid,
	homologaPlanid,
	consolidaPlanid,
	gerenteRH,
	urlEncoded,
	criarLogErro,	
	gerarData,
	crypto,
	ordenar,
	getHost,
	telefonesString,
	mensagens,	
};
