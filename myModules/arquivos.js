//transforma textos com espaços simples, escritos em minúsculas, em camelCase, sem diacríticos
let textoCamelCase = texto => {
	texto.trim();
	let textoSemEspacos = texto.split(" ")[0].toLowerCase();
	for (let i = 1; i < texto.split(" ").length; i++) {
		textoSemEspacos += texto.split(" ")[i].slice(0, 1).toUpperCase() + texto.split(" ")[i].slice(1, texto.split(" ")[i].length).toLowerCase();
	}
	let textoNormalizado = textoSemEspacos.normalize('NFD').replace(/[^a-zA-Z0-9]/g, "");
	return textoNormalizado;
};

module.exports = {
	textoCamelCase,
};

