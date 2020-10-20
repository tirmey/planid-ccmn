"use strict"

const 
	express = require("express"),
	router = express.Router();

//middleware para eliminar trailing slashes
router.get('\\S+\/$', function (req, res) {
	return res.redirect(301, req.path.slice(0, -1) + req.url.slice(req.path.length));
});

module.exports = router;
