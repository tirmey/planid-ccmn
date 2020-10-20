const mongoose = require("../mongoose");

const disciplinaSchema = new mongoose.Schema({
    unidade: String,
    curso: String,
    nivel: String, // graduacao, especializacao, mestrado, doutorado, m/d
    codigo: String,
    nome: String,
});

disciplinaSchema.index({codigo: 'text', nome: 'text'});

const Disciplina = mongoose.model("Disciplina", disciplinaSchema);

module.exports = Disciplina;
