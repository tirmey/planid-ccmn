const 
	bodyParser = require("body-parser");

const urlEncoded = bodyParser.urlencoded({ extended: false });


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

module.exports = {
	urlEncoded,
	ordenar,
};
