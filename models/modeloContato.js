const mongoose = require("../mongoose");

var cargoSchema = new mongoose.Schema({
    contexto: String,
    cargo: String,
    email: String,    
}, {_id:false});  

var telefoneSchema = new mongoose.Schema({
    numero: String,
    tipo: String,    
}, {_id:false}); 

var mensagemSchema = new mongoose.Schema({
    titulo: String,
    texto: String,
    data: Number,
    lida: Boolean    
}); 


//scheme and models for contatos
var contatoSchema = new mongoose.Schema({
    nome: {
        type: String,
        trim: true,

    },
    identificacao: {
        type: String,  
        trim: true,
    },
    tipoIdentificacao: String,
    categoria: String,
    unidadeLotacao: String,
    unidadeLocalizacao: String,
    unidadePreenchimentoPlanid: String,
    setor: String,
    endereco: String,
    bloco: String,
    departamento: String,
    titulacao: String,
    classe: String,
    regime: String,
    vinculo: String,
    nivelCurso: String,
    programaPG: String,
    cursoPG: String,
    cursoGrad: String,
    unidadeEstagio: String,
    foto: String,
    documentoVinculo: String,
    email: {
        type: String,
        trim: true,
    },
    telefones: {
        type: [telefoneSchema],
        default: undefined
    },
    cargos: {
        type: [cargoSchema],
        default: undefined
    },
    senha: String,
    grupos: {
        type: Array,
        default: undefined
    },
    permissoes: {
        reservarAuditorios: Boolean,
        analisarReservaAuditorios: Boolean,
        chefeManutencao: Boolean,
        gerenteEstacionamentos: Boolean,
        gerenteSistema: Boolean,
        gerenteAlmoxarifado: Boolean,
        usuarioAlmoxarifado: Boolean,
        homologaPlanid: Boolean,
        consolidaPlanid: Boolean,
        gerenteRH: Boolean,
    },
    //Planids são objetos contendo os planejamentos semestrais dos docentes do Centro. 
    planids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Planid',
        default: undefined
    }],
    reservasEspacos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reserva',
        default: undefined
    }],
    manutencao: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ds',
        default: undefined
    }],    
    veiculo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Veiculo",
        default: undefined,
    }],
    mdm: [{
        type: String,
        ref: 'AlmoxarifadoMDM',
        default: undefined
    }],
    notifServicos: {
        email: Boolean,
        site: Boolean
    },
    mensagensGerais: {
        email: Boolean,
        site: Boolean
    },
    mensagens: [mensagemSchema],
    ultimoAcesso: [Number],
    excluido: Boolean,
    dataExclusao: Number,
});

contatoSchema.index({
    nome: 'text', 
    identificacao: 'text',   
    unidadeLocalizacao: 'text',   
    unidadeLotacao: 'text',
});

var Contato = mongoose.model("Contato", contatoSchema);

module.exports = Contato;
