"use strict";

const 
	express = require("express"),
	router = express.Router();	

/////////////////////////////////////////////////
///////////////// ROTAS GERAIS //////////////////
/////////////////////////////////////////////////

// Preenchimento do planid aqui!!
router.get("/", (req, res) => {
	// id do usuário hardcoded, uma vez que não há módulo de autenticação, portanto não há dados do usuário logado. Alterar o ID para acessar a tela de preenchimento com outro usuário
	res.render("dashboard", {userId: "5d1d00ac7bde400ed9e8f93e"});
});

router.get("*", (req, res) => {
	res.status(404).render("erro", {mensagem: "<h2>Página não encontrada. Por favor, verifique o endereço informado.</h2>"});
});

module.exports = router;
