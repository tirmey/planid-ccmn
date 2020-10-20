const mongoose = require("../mongoose");      

var eventoSchema = new mongoose.Schema({
  data: Date,
  texto: String,  
  emissor: String
}, {_id:false}); 

var PlanidSchema = new mongoose.Schema({    
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contato",
      required: true
    },
    semestre: {
      type: String,
      required: true
    },
    feriasPeriodoInicio: [String],
    feriasPeriodoFim: [String],
    afastamentoPeriodo: [String],
    //afastamentoPeriodoInicio: [String],
    //afastamentoPeriodoFim: [String],
    // afastamentoNumProcesso: [String],
    afastamentoNumeroDias: [Number],
    afastamentoMotivo: [String],
    disciplina: [String],
    disciplinaCodigo: [String],
    disciplinaNivel: [String],
    disciplinaParticipacao: [String],
    disciplinaCHDisciplinasSemanal: [String],
    atividadesComplementaresEnsinoTipo: [String],
    atividadesComplementaresEnsinoDescricao: [String],
    atividadesComplementaresEnsinoCH: [String],
    orientacoesNatureza: [String],
    orientacoesInstituicao: [String],
    orientacoesNomeorientando: [String],
    orientacoesIdorientando: [String],
    orientacoesNivel: [String],
    orientacoesCHOrientacao: [String],    
    monitoriasNomemonitor: [String],
    monitoriasIdmonitor: [String],
    monitoriasCursoOrigem: [String],
    monitoriasCHOrientacao: [String],
    projetosPesqTitulo: [String],
    projetosPesqCoordenador: [String],    
    projetosPesqFinanciador: [String],
    projetosPesqFinanciadorOutro: [String],
    projetosPesqCH: [String],
    projetosInovTitulo: [String],
    projetosInovCoordenador: [String],    
    projetosInovFinanciador: [String],
    projetosInovFinanciadorOutro: [String],
    projetosInovCH: [String],
    atividadesCoopIntAtividade: [String],
    atividadesCoopIntCH: [String],
    atividadesCoopIntDescricao: [String],
    supervisoesNomePosDoc: [String],
    supervisoesCH: [String],
    supervisoesCPFPosDoc: [String],
    supervisoesBolsaPosDoc: [String],
    atividadesComplementaresPesquisaTipo: [String],
    atividadesComplementaresPesquisaDescricao: [String],
    atividadesComplementaresPesquisaCH: [String],
    acoesTitulo: [String],
    acoesTipo: [String],
    acoesTipoAcaoOutros: [String],
    acoesCoordenador: [String],
    acoesInstituicaoEnvolvida: [String],
    acoesAcaoCadastrada: [String],
    acoesSIGPROJ: [String], // deprecated
    acoesCH: [String],
    orientacoesExtNome: [String],
    orientacoesExtIdentificacao: [String],
    orientacoesExtInstituicao: [String],
    orientacoesExtCurso: [String],
    orientacoesExtBolsa: [String],
    orientacoesExtFinanciador: [String],
    orientacoesExtCH: [String],
    atividadesAdmCargo: [String],
    atividadesAdmDescricao: [String],
    atividadesAdmCH: [String],
    dataDeEdicao: Number,
    enviado: Boolean,
    comentariosGerais: String,   
    eventos: [eventoSchema],
    novoEvento: Boolean
});
var Planid = mongoose.model("Planid", PlanidSchema);


module.exports = Planid;