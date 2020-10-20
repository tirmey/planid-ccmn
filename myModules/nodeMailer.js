
const nodeMailer = require("nodemailer");

const smtpTrans = nodeMailer.createTransport({
	service: 'Gmail',
	host: "smtp@gmail.com",
	auth: {
		user: process.env.USERMAIL,
		pass: process.env.USERPASS,
	}
});

var anexos = function (reqFiles, array, msg) {
	msg += `<p><strong>Arquivos:</strong></p>`;
	if (reqFiles.anexo.length) {
		for (let i = 0; i < reqFiles.anexo.length; i++) {
			array.push({ filename: reqFiles.anexo[i].name, content: new Buffer.from(reqFiles.anexo[i].data, reqFiles.anexo[i].encoding), encoding: reqFiles.anexo[i].encoding, mimetype: reqFiles.anexo[i].mimetype, mv: reqFiles.anexo[i].mv });
			msg += `<p class="arquivos">${reqFiles.anexo[i].name}</p>`;
		}
	} else {
		array.push({ filename: reqFiles.anexo.name, content: new Buffer.from(reqFiles.anexo.data, reqFiles.anexo.encoding), encoding: reqFiles.anexo.encoding, mimetype: reqFiles.anexo.mimetype, mv: reqFiles.anexo.mv });
		msg += `<p class="arquivos">${reqFiles.anexo.name}</p>`;
	}
	return msg;
};

const bannerSite = `<div class="mensagem">`;

const bannerMail = `
	<div style="max-width:800px; margin: 0 auto; padding: 0; border: 1px solid #ccc" class="mensagem">
	<a target="_blank" href="https://www.ccs.ufrj.br"><img src="https://www.ccs.ufrj.br/img/banner.jpg" alt='banner e-mail'></a>
`;

const rodape = `    
	<div style="background-color: #2c3430; color: #fff; max-width: 800px; margin: 0 auto; padding: 5px 5%; box-shadow: 0 0px 9px -1px rgba(0,0,0,0.45); text-align: center; border: 1px solid #2c3430; box-sizing: border-box">
		<a target="_blank" href="https://ufrj.br">
			<img style='height: 70px; margin-top: 20px;' src='https://www.ccs.ufrj.br/img/minervaFooter.png'>
		</a>
		<a style="text-decoration: none; color: #fff;" target="_blank" href="https:/www.ccs.ufrj.br">
			<h2>CENTRO DE CIÊNCIAS DA SAÚDE | UFRJ</h2>
		</a>
		<a style="text-decoration: none; color: #fff;" target="_blank" href="https://goo.gl/maps/wWfRpxDbuWD2"><p style="margin-bottom: -0.3rem;">Avenida Carlos Chagas Filho, 373 - Bloco K - 2º andar - sala 20</p> 
			<p style="margin-bottom: -0.3rem;">CEP 21941-902 - Cidade Universitária - Rio de Janeiro - RJ.</p>
		</a>  
		<a style="text-decoration: none; color: #fff;" target="_blank" href="tel:21-2562-6684">
			<p style="margin-bottom: 20px;">telefone: (21) 3938-6701</p>
		</a>        
	</div>
`;
const mailHTML = msg => {
	return `
		${bannerMail}
			<div style="background-color:#f2f2f2; padding: 30px; font-size: 1.2em;color: #555; border-bottom: 10px solid #be1717">
				${msg}
			</div>
		</div>
		${rodape}
	`;
};

const mailButton = (label, url) => {
	let button = `
		<button style="padding: 20px; pointer-events:none; font-size: 16px; font-weight: bold; text-transform: uppercase; border: none; color: #fff; background-color: #116466; border-radius: 6px">${label}</button>
	`;
	let path = url ? url : ''
	return `
		<div style='width: 100%; display: flex; justify-content: center;'>
			<a href=${path} target='_blank' title='${label}' style='margin: 50px auto;'>${button}</a>
		</div>
	`;
}

const mensagem = (mensagem, titulo = 'mensagem:') => `
	<p><strong>${titulo}</strong></p>			
	<p style="padding: 20px 10px !important; background-color: #e4e4e4; border-radius: 10px; margin: 0 10px 15px 10px;">
		<em class='citacao'>"${mensagem}"</em>
	</p>		
`;

module.exports = {
	smtpTrans,
	anexos,
	bannerSite,
	mailHTML,
	mailButton,
	mensagem,
};
