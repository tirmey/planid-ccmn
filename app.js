
//////////////////////////////////////////
/////////////// CONSTANTS ////////////////
//////////////////////////////////////////

const express = require("express"),
			compression = require('compression'),	
      bodyParser = require("body-parser"),
			helmet = require('helmet'),			
			// ROUTER
			commonRoutes = require("./routes/commonRoutes"),
			getRoutes = require("./routes/getRoutes"),
			usersRoutes = require('./routes/usersRoutes'),
			planidRoutes = require("./routes/planidRoutes");



//////////////////////////////////////////
///////////////// SETUP //////////////////
//////////////////////////////////////////

//setando variáveis ambientais
require("dotenv").config({ path: "variables.env" });

// CRIANDO EXPRESS SERVER
var app = express();

// SETANDO RENDERIZADOR DE PÁGINAS SERVER_SIDE
app.set('view engine', 'hbs');

// REQUISIÇÕES EM FORMATO JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//compressão do site
app.use(compression());

// caminho para acesso aos arquivos estáticos (imagens, scripts, documentos, etc)
app.use(express.static(__dirname + "/public"));

// Penduricalhos diversos adicionados ao header da requisição HTTP, para aumentar a segurança (securityPolicy, noOpen, noSniff, etc...)
app.use(helmet());

///////////////////////////////////
////////////// ROTAS ////////////// 
///////////////////////////////////

app.use(commonRoutes);
app.use('/users', usersRoutes);
app.use('/planids', planidRoutes);
app.use(getRoutes);

//////////////////////////////////////////
////////////// INIT SERVER ///////////////
//////////////////////////////////////////
const port = process.env.PORT || 3000;

app.listen(port, function () {
	console.log(`Servidor Web CCS iniciado e escutando na porta ${port}`);
});
