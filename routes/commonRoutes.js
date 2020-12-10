"use strict"
const express = require("express"),
			router = express.Router(),
			moment = require('moment');

//////////////////////////////////////////
//////////////// CONFIGS /////////////////
//////////////////////////////////////////

moment.locale("pt-br");

//Rota intermediária a todas as rotas
router.all("*", function (req, res, next) {
	if (req.user) {
		res.locals.usuario = req.user.nome.split(" ")[0];
		res.locals.permissoes = req.user.permissoes;
	}
	next();
});

//middleware para eliminar trailing slashes
router.get('\\S+\/$', function (req, res) {
	return res.redirect(301, req.path.slice(0, -1) + req.url.slice(req.path.length));
});

module.exports = router;