"use strict";
const express = require("express"),
			router = express.Router(),
			// meus módulos
			{
				routeData,
				mensagens,
			} = require("../myModules/rotinasServidor");
	

/////////////////////////////////////////////////
///////////////// ROTAS GERAIS //////////////////
/////////////////////////////////////////////////

router.get("/", routeData, function (req, res) {
	return req.user ? res.render("dashboard", { ...res.routeData, userId: req.user._id }) : res.render('login', res.routeData);
});

router.get("*", routeData, (req, res) => {
	res.routeData.mensagem = mensagens[0],
	res.status(404).render("erro", res.routeData);
});

module.exports = router;
