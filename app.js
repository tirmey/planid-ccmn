
//////////////////////////////////////////
/////////////// CONSTANTS ////////////////
//////////////////////////////////////////

const express = require("express"),
			expressSession = require("express-session"),
			hbs = require("hbs"),
			fileUpload = require("express-fileupload"),
			passport = require("passport"),
			flash = require("connect-flash"),
			compression = require('compression'),			
      bodyParser = require("body-parser"),
			csrf = require('csurf'),
			helmet = require('helmet'),			
			// ROUTER
			commonRoutes = require("./routes/commonRoutes"),
			loginRoutes = require("./routes/loginRoutes"),
			usersRoutes = require('./routes/usersRoutes'),
			getRoutes = require("./routes/getRoutes"),
			planidRoutes = require("./routes/planidRoutes");



//////////////////////////////////////////
///////////////// SETUP //////////////////
//////////////////////////////////////////

//setando variáveis ambientais
require("dotenv").config({ path: "variables.env" });

var app = express();

app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//compressão do site
app.use(compression());

app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials");

//configurações de transferência de arquivos
app.use(fileUpload({
	limits: { fileSize: 5 * 1024 * 1024 },
	safeFileNames: true,
	preserveExtension: 4
}));

//inicialização do flash (deve vir antes do passport!)
app.use(flash());

//inicialização da sessão
app.use(expressSession({
	secret: process.env.CHAVE_EXPRESS_SESSION,
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//proteção csrf e helmet
const csrfProtection = csrf();
app.use(csrfProtection);
app.use(helmet());

///////////////////////////////////
////////////// ROTAS ////////////// 
///////////////////////////////////

app.use(loginRoutes);
app.use(commonRoutes);
app.use('/users', usersRoutes);
app.use('/planids', planidRoutes);
app.use(getRoutes);

//////////////////////////////////////////
////////////// INIT SERVER ///////////////
//////////////////////////////////////////
const port = process.env.PORT || 3000;

app.listen(port, function () {
	console.log(`Servidor site Decania iniciado e escutando na porta ${port}`);
});
