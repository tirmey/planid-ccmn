'strict mode'
const 
  express = require("express"),
	router = express.Router(),      
  Contato = require("../models/modeloContato");
 
  
//////////////////////////////////////////////
///////////////// ROTAS GET //////////////////
//////////////////////////////////////////////

//rota para localizar contato específico via ajax
router.get("/recuperarContatoPorId", async (req, res) => {	
  const populate = req.query.populate ? req.query.populate : '';
  const select = req.query.select || '';
  const contato = await Contato.findById(req.query.id).select(select).populate(populate);
	contato ? res.json(contato) : res.end(contato);
});

//rota para localizar contatos via ajax
router.get("/recuperarContatos", (req, res) => {
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
				res.end("erro");
			} else {
				res.json(contatos);
			}
		});
	} else {
		res.json({err: 'Informe os termos e/ou autorizações para realizar a busca'});
	}
});

module.exports = router;
