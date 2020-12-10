"use strict"
const
  camposNaoListados = [
    "orientacoesIdorientando",
    "monitoriasIdmonitor",
    "projetosPesqFinanciadorOutro",
    "supervisoesCPFPosDoc",
    "orientacoesExtIdentificacao",
    "acoesTipoAcaoOutros",
  ],
  CHSemestrais = [
    "disciplinaCHDisciplinasSemanal",
    "atividadesComplementaresEnsinoCH",
    "atividadesCoopIntCH",
    "atividadesComplementaresPesquisaCH"
  ],  
  sectionNames = {
    section_1: "Férias e afastamentos",
    section_2: "Atividades de Ensino",
    section_3: "Atividades de Pesquisa/Inovação",
    section_4: "Atividades de Extensão",
    section_5: "Atividades Administrativas"
  },
  sections = {
    section_1: ["ferias", "afastamentos"],
    section_2: ["disciplinas", "orientacoes", "monitorias", "atividades-complementares-ensino"],
    section_3: [
      "projetos-pesq",
      "projetos-inov",
      "atividades-cooperacao-internacional",
      "supervisoes",
      "atividades-complementares-pesquisa"
    ],
    section_4: ["acoes", "orientacoes-ext"],
    section_5: ["atividades-adm"]
  },
  containers = {
    //seções e subseções, a fim de recuperar as informações de cada planid para visualização/edição na função editarPlanid
    ferias: ["feriasPeriodoInicio", "feriasPeriodoFim"],
    afastamentos: [
      "afastamentoPeriodo",
      "afastamentoNumeroDias",
      "afastamentoMotivo"
    ],
    disciplinas: [
      "disciplina",
      "disciplinaCodigo",
      "disciplinaNivel",
      "disciplinaParticipacao",
      "disciplinaCHDisciplinasSemanal"
    ],
    ["atividades-complementares-ensino"]: [
      "atividadesComplementaresEnsinoTipo",
      "atividadesComplementaresEnsinoDescricao",
      "atividadesComplementaresEnsinoCH"
    ],
    orientacoes: [
      "orientacoesNomeorientando",
      "orientacoesIdorientando",
      "orientacoesNivel",
      "orientacoesInstituicao",
      "orientacoesNatureza",
      "orientacoesCHOrientacao"
    ],
    monitorias: ["monitoriasNomemonitor", "monitoriasIdmonitor", "monitoriasCursoOrigem", "monitoriasCHOrientacao"],
    ["projetos-pesq"]: [
      "projetosPesqTitulo",
      "projetosPesqCoordenador",
      "projetosPesqFinanciador",
      "projetosPesqFinanciadorOutro",
      "projetosPesqCH"
    ],
    ["projetos-inov"]: ["projetosInovTitulo", "projetosInovCoordenador", "projetosInovFinanciador", "projetosInovCH"],
    ["atividades-cooperacao-internacional"]: [
      "atividadesCoopIntAtividade",
      "atividadesCoopIntDescricao",
      "atividadesCoopIntCH"
    ],
    supervisoes: ["supervisoesNomePosDoc", "supervisoesCPFPosDoc", "supervisoesBolsaPosDoc", "supervisoesCH"],
    ["atividades-complementares-pesquisa"]: [
      "atividadesComplementaresPesquisaTipo",
      "atividadesComplementaresPesquisaDescricao",
      "atividadesComplementaresPesquisaCH"
    ],
    acoes: [
      "acoesTitulo",
      "acoesTipo",
      "acoesTipoAcaoOutros",
      "acoesCoordenador",
      "acoesInstituicaoEnvolvida",
      "acoesAcaoCadastrada",
      "acoesCH"
    ],
    ["orientacoes-ext"]: [
      "orientacoesExtNome",
      "orientacoesExtIdentificacao",
      "orientacoesExtInstituicao",
      "orientacoesExtCurso",
      "orientacoesExtBolsa",
      "orientacoesExtFinanciador",
      "orientacoesExtCH"
    ],
    ["atividades-adm"]: ["atividadesAdmCargo", "atividadesAdmDescricao", "atividadesAdmCH"]
  },
  nomesAmigaveis = {
    ferias: "Férias",
    afastamentos: "Afastamentos",
    disciplinas: "Disciplinas",
    orientacoes: "Orientacoes",
    monitorias: "Monitorias",
    ["atividades-complementares-ensino"]: "Atividades complementares de ensino",
    ["projetos-pesq"]: "Projetos de pesquisa",
    ["projetos-inov"]: "Projetos de inovação",
    ["atividades-cooperacao-internacional"]: "Atividades de Cooperação Internacional",
    supervisoes: "Supervisões de pós-doutorado",
    ["atividades-complementares-pesquisa"]: "Atividades complementares de pesquisa e inovação",
    acoes: "Ações de Extensão",
    ["orientacoes-ext"]: "Orientações de Extensão",
    ["atividades-adm"]: "Atividades Administrativas",
    feriasPeriodoInicio: "Início do período",
    feriasPeriodoFim: "Final do período",
    afastamentoPeriodo: "Período de afastamento",
    afastamentoNumeroDias: "Número de dias",
    afastamentoMotivo: "Motivo",
    disciplina: " Nome",
    disciplinaCHDisciplinasSemanal: "CH semanal",
    disciplinaCodigo: "Código",
    disciplinaNivel: "Nível",
    disciplinaParticipacao: "Natureza da participação",
    atividadesComplementaresEnsinoDescricao: "Descrição da atividade",
    atividadesComplementaresEnsinoTipo: "Tipo",
    atividadesComplementaresEnsinoCH: "CH semanal",
    orientacoesCHOrientacao: "CH semanal",
    orientacoesIdorientando: "Identificação do orientando",
    orientacoesNivel: "Nível do orientando",
    orientacoesNomeorientando: "Nome",
    orientacoesInstituicao: "Instituição",
    orientacoesNatureza: "Natureza da atividade",
    monitoriasCHOrientacao: "CH semanal",
    monitoriasIdmonitor: "Identificação do monitor",
    monitoriasCursoOrigem: "Curso de origem do monitor",
    monitoriasNomemonitor: "Nome",
    projetosPesqTitulo: "Título",
    projetosPesqCH: "CH semanal",
    projetosPesqCoordenador: "Natureza da participação",
    projetosPesqFinanciador: "Financiador",
    projetosPesqFinanciadorOutro: "Outro Financiador",
    projetosInovTitulo: "Título",
    projetosInovCH: "CH semanal",
    projetosInovCoordenador: "Natureza da participação",
    projetosInovFinanciador: "Financiador",
    atividadesCoopIntAtividade: "Atividade",
    atividadesCoopIntCH: "CH semanal",
    atividadesCoopIntDescricao: "Descrição",
    supervisoesNomePosDoc: "Nome",
    supervisoesCPFPosDoc: "Identificação",
    supervisoesBolsaPosDoc: "Bolsa",
    supervisoesCH: "CH semanal",
    atividadesComplementaresPesquisaDescricao: "Descrição da atividade",
    atividadesComplementaresPesquisaTipo: "Tipo da atividade",
    atividadesComplementaresPesquisaCH: "CH semanal",
    acoesTitulo: "Título da ação",
    acoesTipo: "Tipo da ação",
    acoesTipoAcaoOutros: "ação de outra natureza",
    acoesCH: "CH semanal",
    acoesCoordenador: "Natureza da participação",
    acoesInstituicaoEnvolvida: "Instituições envolvidas",
    acoesAcaoCadastrada: "Cadastro no SIGA?",
    orientacoesExtNome: "Nome",
    orientacoesExtInstituicao: "Instituição",
    orientacoesExtCurso: "Curso",
    orientacoesExtBolsa: "Bolsista",
    orientacoesExtFinanciador: "Agência de fomento",
    orientacoesExtCH: "CH semanal",
    orientacoesExtIdentificacao: "Identificação",
    atividadesAdmCargo: "Natureza do cargo",
    atividadesAdmDescricao: "Especificação e/ou descrição",
    atividadesAdmCH: "CH semanal"
  },
  financiamento = `
    <option disabled selected>Selecione uma opção:</option>
    <option value='-'>sem financiamento</option>
    <option value='capes'>CAPES</option>
    <option value='cnpq'>CNPq</option>
    <option value='faperj'>FAPERJ</option>
    <option value='finep'>Finep</option>
    <option value='ufrj'>UFRJ</option>
    <option value='outros'>outros / varios</option>
  `,
  bolsa = `
    <option disabled selected>Selecione uma opção:</option>
    <option value='capes'>CAPES</option>
    <option value='cnpq'>CNPq</option>
    <option value='faperj'>FAPERJ</option>
    <option value='finep'>Finep</option>
    <option value='ufrj'>UFRJ</option>
    <option value='outros'>outros</option>
  `;

let cargasHorariasParciais = {
  total: 0,
  parcial: {
    section_2: 0,
    section_3: 0,
    section_4: 0,
    section_5: 0
  }
};

////////////////////////////////////
////////////// PLANID //////////////
////////////////////////////////////

const relatorioBase = (csrfToken, userId, homologado) => {
  let planidSemestre = "";
  if (planid.emEdicao) {
    planidSemestre = planid.emEdicao.semestre;
  } else {   
    if (!planid.ultimoRegistrado) {
      console.log('semestre é o caso!!: >>>>>> ', semestre);
      planidSemestre = semestre;
    } else if (planid.ultimoRegistrado.semestre !== semestre || planid.ultimoRegistrado.semestre !== proximoSemestre) {
      // o docente pulou um planid!
      const sem = planid.ultimoRegistrado.semestre.split("-")[1] === "2" ? "1" : "2";
      const ano =
        planid.ultimoRegistrado.semestre.split("-")[1] === "2"
          ? +planid.ultimoRegistrado.semestre.split("-")[0] + 1
          : planid.ultimoRegistrado.semestre.split("-")[0];
      planidSemestre = `${ano}-${sem}`;
    }
  }
  const iconClock = `
  <svg class="a" viewBox="0 0 364.2 364.2"><defs><style>.a{fill:none;stroke-linecap:round;stroke-miterlimit:10;stroke-width:17px;}</style></defs><path d="M337.21,103.23a15.14,15.14,0,0,0,15.09-15.1V80.58a15.1,15.1,0,0,0-30.19,0v7.55A15.15,15.15,0,0,0,337.21,103.23Z"/><path d="M88.13,322.11H80.58a15.1,15.1,0,0,0,0,30.19h7.55a15.1,15.1,0,1,0,0-30.19Z"/><path d="M166.63,145.49a14.95,14.95,0,0,0-21.14,21.14l5.29,5.28a14.59,14.59,0,0,0,21.13,0,14.59,14.59,0,0,0,0-21.13Z"/><path class="a" d="M355.7,8.5C163.79,8.5,8.5,163.79,8.5,355.7"/></svg>
  `;
  const txtCHSecao = "CH Seção";
  const html = `
    <div class='overlay overlay-novo-planid opacidade-zero'>
      <div class='janela'> 
        <div class='cabecalho'>
          <h2 class='header planid-formulario-header'> ${homologado ? "" : "Preencher"} planid ${planidSemestre} </h2>
        </div>
        <form class="formulario ${homologado}" id='planid-formulario' action="/planid/salvar-formulario" novalidate>
          <input type='hidden' name='_csrf' value='${csrfToken}' >
          <input type='hidden' name='autor' value='${userId}' >
          <input type='hidden' name='comentariosGerais' value='' >
          <div>
            <input type='hidden' name='semestre' value='${planidSemestre}'>                       
          </div>
          <div class='form-steps'>
            ${formStep(sectionNames.section_1, "1", false, true)}
            ${formStep(sectionNames.section_2, "2", true, true)}
            ${formStep(sectionNames.section_3, "3", true, true)}
            ${formStep(sectionNames.section_4, "4", true, true)}
            ${formStep(sectionNames.section_5, "5", true, false)}
          </div>
          <section class='section-planid section-1' data-section='1'>        
            <h2>${sectionNames.section_1}</h2>
            ${construirCampo("ferias", "Férias", "adicionar período")}          
            ${construirCampo("afastamentos", "Afastamentos", "adicionar afastamento")} 
          </section>
          <section class='section-planid opacidade-zero hidden section-2' data-section='2'>            
            <div class='horas-semanais-parcial' title='carga horária parcial - ${sectionNames.section_2}'>
              ${iconClock}
              <span class='horas-parciais-legenda'>CH seção</span>
              <span class='section-planid__ch section-planid__ch-2 quantidade-horas'>0</span>
            </div>
            <h2>${sectionNames.section_2}</h2>
            ${construirCampo("disciplinas", "Disciplinas", "adicionar disciplina", true)}          
            ${construirCampo(
              "atividades-complementares-ensino",
              "Atividades complementares",
              "adicionar atividade",
              true
            )}         
            ${construirCampo("orientacoes", "Orientações", "adicionar orientacao")}
            ${construirCampo("monitorias", "Monitorias e apoio pedagógico", "adicionar monitoria")} 
          </section>
          <section class='section-planid opacidade-zero hidden section-3' data-section='3'>
          <div class='horas-semanais-parcial' title='carga horária parcial - ${sectionNames.section_3}'>
            ${iconClock}
            <span class='horas-parciais-legenda'>${txtCHSecao}</span>
            <span class='section-planid__ch section-planid__ch-3 quantidade-horas'>0</span>
          </div>
            <h2>${sectionNames.section_3}</h2>
            ${construirCampo("projetos-pesq", "Projetos de pesquisa", "adicionar projeto")}
            ${construirCampo("projetos-inov", "Projetos de inovação", "adicionar projeto")}
            ${construirCampo("supervisoes", "Supervisão de pós-doutorandos", "adicionar supervisão")}
            ${construirCampo(
              "atividades-cooperacao-internacional",
              "Atividades de internacionalização",
              "adicionar atividade"
            )} 
            ${construirCampo("atividades-complementares-pesquisa", "Atividades complementares", "adicionar atividade")} 
          </section>  
          <section class='section-planid opacidade-zero hidden section-4' data-section='4'>
          <div class='horas-semanais-parcial' title='carga horária parcial - ${sectionNames.section_4}'>
            ${iconClock}
            <span class='horas-parciais-legenda'>${txtCHSecao}</span>
            <span class='section-planid__ch section-planid__ch-4 quantidade-horas'>0</span>
          </div>
            <h2>${sectionNames.section_4}</h2>
            ${construirCampo("acoes", "Ações de Extensão", "adicionar ação")} 
            ${construirCampo(
              "orientacoes-ext",
              "Orientação de bolsistas PIBEX/PROFAEX ou IC ensino médio",
              "adicionar orientação"
            )} 
          </section> 
          <section class='section-planid opacidade-zero hidden section-5' data-section='5'>
            <div class='horas-semanais-parcial' title='carga horária parcial - ${sectionNames.section_5}'>
              ${iconClock}
              <span class='horas-parciais-legenda'>${txtCHSecao}</span>
              <span class='section-planid__ch section-planid__ch-5 quantidade-horas'>0</span>
            </div>
            <h2>${sectionNames.section_5}</h2>
            ${construirCampo("atividades-adm", "Atividades administrativas", "adicionar atividade")} 
          </section>  
          <div class='btn-div btn-submit-planid-div'>
            <i class='fa fa-bars abrir-menu-acoes'></i>
            <div class='planid__icone-wrapper wrapper-imprimir-planid-btn' data-imprimir='${planid.emEdicao._id ||
              ""}' data-semestre='${planidSemestre}'>
              <i class='fa fa-print imprimir-planid-btn fa-fw'></i>  
              <span>imprimir</span>
            </div>
            <div class='planid__icone-wrapper wrapper-enviar-mensagem-btn'>
              <a href='/acompanhar-eventos/planid/${planid.emEdicao.autor}/${planid.emEdicao._id}' target='_blank' rel='noopener' rel='noreferrer'>
                <i class='fa fa-envelope enviar-mensagem-btn fa-fw'></i>  
              </a>
              <span>mensagens</span>
            </div>
            <div class='planid__icone-wrapper wrapper-comentarios'>
              <i class='fa fa-commenting-o comentarios-gerais fa-fw'></i>   
              <span>comentários</span>
            </div>
            <div class='horas-semanais'>
              ${iconClock}
              <span class='quantidade-horas'>0.0</span>
              <span class='horas-totais-legenda'>CH total</span>
            </div>   
            <label for='submit-planid' class='planid__icone-wrapper label-submit-planid'>
              <div class='wrapper-salvar'>
                <i class='fa fa-floppy-o fa-fw'></i>
                <span>salvar</span>
              </div>
            </label>  
            ${
              !homologado
                ? `
              <div class='planid__icone-wrapper wrapper-enviar'>
                <i class='fa fa-paper-plane-o icon-enviar-planid fa-fw'></i>
                <span>enviar</span>
              </div>`
                : ""
            }

            <input type="submit" id='submit-planid' class='hidden'>            
            <span class='button-fechar sem-borda'>FECHAR</span>

            <div class='planid__icone-wrapper wrapper-alerta-nao-preenchidos'>
              <i class='fa fa-exclamation-triangle alerta-nao-preenchidos'></i>  
              <span>há erros</span>
            </div>
          </div>   
        </form>
      </div>
    </div>`;
  return html;
};

const divNavegacaoPlanid = `
  <div class='div-navegacao-planid controles-direcionais-div centralizado fonte-titulo'>
    <div class='btn-navegacao-planid btn-retornar oscilador-esquerda inativo filhos-inativos'><i class='fa fa-caret-left inativo'></i>retornar</div>
    <div class='btn-navegacao-planid btn-avancar oscilador-direita filhos-inativos'>avançar<i class='fa fa-caret-right'></i></div>
  </div> 
`;

/* 
constrói, dinamicamente, qualquer subseção do planid.
Parâmetros:
fieldId - palavra que identifica a subseção, compondo sua classList, e servindo de argumento à função que constrói o botão de adicionar inpus dinamicamente. Nomeia também os containers que abrigam os inputs dinâmicos.
labelText - o Nome da subseção, como exibida aos usuários
btnText - texto do botão de inserir inputs dinamicamente, a ser exibido aos usuários
*/
const construirCampo = (fieldId, labelText, btnText, dica) => {
  return `
    <div class='subsection-container fechado user-${fieldId}'>      
      <label class='subsection-header'>
        <p class='subsection-title'>${labelText}:</p>
        ${
          dica
            ? `<i class='fa fa-info' data-dica='${fieldId}'></i>
          <span class='dica'>Clique para orientações acerca do preenchimento desta seção.</span>            
          `
            : ""
        }
      </label>       
      ${btnAdicionar(`adicionar-${fieldId}`, btnText)} 
      <div class='${fieldId}-container atividade-container'></div>
    </div>    
  `;
};

const removerPendenciasAtividadeDeletada = e => {
  const divPendencias = document.querySelector(`.div-pendencias`);
  if (divPendencias) {
    const pendencias = divPendencias.querySelectorAll("li");
    const inputs = document.querySelectorAll(
      `#${e.target.dataset.id} input, #${e.target.dataset.id} select, #${e.target.dataset.id} textarea`
    );
    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < pendencias.length; j++) {
        if (inputs[i].id === pendencias[j].dataset.campo) {
          pendencias[j].outerHTML = "";
        }
      }
    }
    if (!divPendencias.querySelectorAll("li").length) {
      divPendencias.outerHTML = "";
      document.querySelector(`.alerta-nao-preenchidos`).classList.remove("active");
    }
  }
};

const btnAdicionar = (classe, texto) => {
  return `
    <div class="btn-acao ${classe}">
      <i class="fa fa-plus-circle" aria-hidden="true"></i>
      <span>${texto}</span>
    </div>
  `;
};

const montarListadisciplinasExternas = disciplinas => {
  let disciplinasExternas = '<div class="disciplina-externa__div">';
  for (let i = 0; i < disciplinas.length; i++) {
    disciplinasExternas += `
      <p class='disciplina-externa' data-nome='${disciplinas[i].nome}' data-codigo='${disciplinas[i].codigo}'><strong>${disciplinas[i].nome} - ${disciplinas[i].codigo}</strong></p>
    `;
  }
  disciplinasExternas += "</div>";

  return disciplinasExternas;
};

const feriasDinamicas = () => {
  const nomeInput = "ferias",
    classes = "input-ferias",
    campoDinamico = num => `   
      <div class='field'>
        <label for="ferias-inicio-${num}">
          <p>Início do Período:</p>
        </label>  
        <input type="date" id="ferias-inicio-${num}" name="${nomeInput}PeriodoInicio" data-section='1' data-subsection='user-ferias' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
      </div>  
      <div class='field'>
        <label for="ferias-fim-${num}">
          <p>Fim do Período:</p>
        </label> 
        <input type="date" id="ferias-fim-${num}" name="${nomeInput}PeriodoFim" data-section='1' data-subsection='user-ferias' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
      </div> 
    `;
  inserirInput({
    nomeInput,
    classes,
    campoDinamico,
    container: ".ferias-container",
    callbackPreDelete: removerPendenciasAtividadeDeletada
  });
};

const afastamentosDinamicos = () => {
  const nomeInput = "afastamento",
    classes = "input-afastamento",
    campoDinamico = num => `       
      <div class='field'>
        <label for="${nomeInput}-${num}">
          <p>Período do Afastamento:</p>
        </label>  
        <input type="text" id="${nomeInput}-${num}" name="${nomeInput}Periodo" data-section='1' data-subsection='user-afastamentos' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
      </div>        
      <div class='field'>
        <label for="${nomeInput}-dias-${num}">
          <p>Número de dias:</p>
        </label>
        <input type="number" id="${nomeInput}-dias-${num}" name="${nomeInput}NumeroDias" data-section='1' data-subsection='user-afastamentos' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
      </div>
      <div class='field field-textarea'>
        <label for="afastamento-motivo-${num}">
          <p>Motivo do Afastamento:</p>
        </label>
        <textarea id="afastamento-motivo-${num}" name="${nomeInput}Motivo" data-section='1' data-subsection='user-afastamentos' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required ></textarea>
      </div>
    `;
  inserirInput({
    nomeInput,
    classes,
    campoDinamico,
    container: ".afastamentos-container",
    callbackPreDelete: removerPendenciasAtividadeDeletada
  });
};

const disciplinasDinamicas = () => {
  const nomeInput = "disciplina",
    classes = "input-disciplina",
    campoDinamico = num => `  
      <div class='field'>
        <label for='nivel-${num}'>
          <p>Nível:</p>            
        </label>
        <select name="${nomeInput}Nivel" id='nivel-${num}' data-section='2' data-subsection='user-disciplinas'  tabindex="-1" required >
          <option disabled selected>Selecione uma opção:</option>
          <option value='graduacao'>graduação</option>
          <option value='especializacao'>Especialização</option>
          <option value='mestrado'>Mestrado</option>
          <option value='doutorado'>Doutorado</option>   
          <option value='m/d'>Mestrado / Doutorado</option>
        </select>
      </div>

      <div class='campos-disciplina-${num}'>
        <div class='field campo-disciplina'>
          <label for="disciplina-${num}">
            <p>Disciplina:</p>
            <i class='fa fa-info'></i>
            <span class='dica'>Informe nome ou código da disciplina</span>
          </label>
          <input type="text" id="disciplina-input-${num}" name="${nomeInput}" data-section='2' class='readonly' readonly tabIndex='-1' data-subsection='user-disciplinas' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required autocomplete='off'>          
          <div class='div-disciplinas div-disciplinas-${num}'></div>
        </div> 
        <div class='field campo-codigo-disciplina'>
          <label for="codigo-${num}">
            <p>Código:</p>
          </label>
          <input type="text" id="codigo-${num}" name="${nomeInput}Codigo" data-section='2' data-subsection='user-disciplinas' class='readonly' readonly tabIndex='-1' required >
        </div>      
      </div>

      <div class='field'>
        <label for='participacao-${num}'>
          <p>Participação:</p>            
        </label>
        <select name="${nomeInput}Participacao" id='participacao-${num}' data-section='2' data-subsection='user-disciplinas' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
          <option disabled selected>Selecione uma opção:</option>
          <option value='coordenador'>coordenador</option>
          <option value='colaborador'>colaborador</option>
          <option value='convidado'>convidado</option>
        </select>
      </div>
      <div class='field field-ch'>
        <label for="carga-semanal-${num}">
          <p>Carga horária <span class='ch-semestral'>semestral</span> do docente:</p>
          <i class='fa fa-info'> </i>
          <span class='dica'>A carga horária total semestral ministrada pelo docente (em casos de disciplina compartilhada, não deve ser informada a carga horária total da disciplina).</span>
        </label>
        <input class='input-ch input-ch-disciplinas' type="number" id="carga-semanal-${num}" name="${nomeInput}CHDisciplinasSemanal" data-section='2' data-subsection='user-disciplinas' min='0' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
      </div>
    `;

  const clicouItem = (innerHTML, e) => {
    const disciplina = innerHTML.split(" -- ");
    e.target.parentElement.parentElement.nextElementSibling.querySelector("input").value = disciplina[1];
    return disciplina[0];
  };

  const inputPerdeuFoco = ({ blurEvent, itemsArray, divItems }) => {
    const valorInput = blurEvent.target.value;
    const disciplinaCodigo = blurEvent.target.parentElement.nextElementSibling.querySelector("input");
    const disciplinaNivel = blurEvent.target.parentElement.parentElement.previousElementSibling.querySelector("select").value;

    const validarInputsDisciplina = valid => {
      if (!valid) {
        blurEvent.target.value = "";
        disciplinaCodigo.value = "";
      } else {
        blurEvent.target.value = blurEvent.target.value.split(" -- ")[0];
      }
      if (disciplinaCodigo.classList.contains("campo-vazio")) {
        const inputNumber = blurEvent.target.id.split("-")[2];
        disciplinaCodigo.classList.remove("campo-vazio");
        document.querySelector(`.campo-vazio-codigo-${inputNumber}`).outerHTML = "";
      }
    };
    let inputIsValid = false;
    for (let i = 0; i < itemsArray.length; i++) {
      const codigoDiscArray = itemsArray[i].split(" -- ")[1];
      const nomeIgual =
        itemsArray[i].toLowerCase().split(" -- ")[0] === blurEvent.target.value.toLowerCase().split(" -- ")[0];
      if (blurEvent.target.value && (codigoDiscArray === disciplinaCodigo.value && nomeIgual)) {
        inputIsValid = true;
        blurEvent.target.value = itemsArray[i];
        const disciplina = itemsArray[i].split(" -- ");
        disciplinaCodigo.value = disciplina[1];
        if (document.querySelector(`${divItems}`)) {
          document.querySelector(`${divItems}`).innerHTML = "";
        }
        break;
      }
    }
    if (!blurEvent.target.value) {
      variaveisGlobais.exibirMensagem(
        "<h3>É necessário informar o nome ou o código da disciplina</h3>",
        2000,
        "Atenção!"
      );
    } else if (!inputIsValid) {
      variaveisGlobais.exibirMensagem(`
          <h3>Disciplina não cadastrada em sua Unidade. Deseja buscar em todas as Unidades?</h3>
          <div class='button-div'>
            <button class='btn-base' data-value='sim'>SIM</button>
            <button class='btn-base' data-value='nao'>NÃO</button>
          </div>
          `);
      document.getElementById(`mensagens-genericas`).addEventListener(`click`, async e => {
        if (e.target.dataset.value === "nao") {
          variaveisGlobais.controlarVisibilidade("ocultar", "#mensagens-genericas");
        } else if (e.target.dataset.value === "sim") {
          const disciplinas = await variaveisGlobais.ajax("/planids/recuperar-disciplina", "GET", {
            string: valorInput,
            nivel: disciplinaNivel
          });
          if (!disciplinas.length) {
            variaveisGlobais.exibirMensagem(`
                <h3>Não foi localizada disciplina com o termo de busca em nossa base de dados.</h3>
                <h3>O cadastramento de nova disciplina na base de dados do PLANID CCS deve ser solicitado à Direção da Unidade que a oferece.</h3>
              `);
          } else {
            const listaDisciplinas = montarListadisciplinasExternas(disciplinas);
            variaveisGlobais.exibirMensagem(`
                <h3>Clique sobre a disciplina que pretende adicionar ao planid:</h3>
                ${listaDisciplinas}               
              `);
            document.getElementById(`mensagens-genericas`).addEventListener("click", e => {
              if (e.target.dataset.nome) {
                blurEvent.target.value = e.target.dataset.nome;
                disciplinaCodigo.value = e.target.dataset.codigo;
                variaveisGlobais.controlarVisibilidade("ocultar", "#mensagens-genericas", true);
              }
            });
          }
        }
      });
    }
    validarInputsDisciplina(inputIsValid);
    if (document.querySelector(`.div-pendencias`)) {
      controlarExibicaoPendencias();
    }
    if (blurEvent.target.parentElement.querySelector(".localizar-disciplinas")) {
      blurEvent.target.parentElement.querySelector(".localizar-disciplinas").outerHTML = "";
    }
  };

  const selecionouItemEnter = ({ selectedItem, inputSelector, items, keyEvent }) => {
    document.querySelector(`${inputSelector}`).value = selectedItem ? selectedItem.innerHTML : items[0].outerText;
    const disciplina = document.querySelector(`${inputSelector}`).value.split(" -- ");
    keyEvent.target.value = disciplina[0];
    keyEvent.target.parentElement.nextElementSibling.querySelector("input").value = disciplina[1];
  };

  const filtrarDisciplinas = nivel => {
    return arrayDisciplinas.filter(d => d.split(" -- ")[2] === nivel);
  };

  const autoCompleteHandler = async (num, nivel) => {
    if (!arrayDisciplinas.length) {
      const disciplinas = await variaveisGlobais.ajax("/planids/recuperar-disciplinas", "GET", {
        unidade: planid.unidadePreenchimentoPlanid,
      });
      arrayDisciplinas = formarArrayDisciplinas(disciplinas);
    }

    autoComplete({
      inputSelector: `#disciplina-input-${num}`,
      divItems: `.div-disciplinas-${num}`,
      itemClass: "item-autocompletar",
      itemsArray: filtrarDisciplinas(nivel),
      clicouItem,
      inputPerdeuFoco,
      selecionouItemEnter
    });
  };

  const inserirInputDisciplina = (e, num) => {
    const camposDisciplina = `
        <div class='field campo-disciplina'>
          <label for="disciplina-${num}">
            <p>Disciplina:</p>
            <i class='fa fa-info'></i>
            <span class='dica'>Informe nome ou código da disciplina</span>
          </label>
          <input type="text" id="disciplina-input-${num}" name="${nomeInput}" data-section='2' data-subsection='user-disciplinas' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required autocomplete='off'>          
          <div class='div-disciplinas div-disciplinas-${num}'></div>
        </div> 
        <div class='field'>
          <label for="codigo-${num}">
            <p>Código:</p>
          </label>
          <input type="text" id="codigo-${num}" name="${nomeInput}Codigo" data-section='2' data-subsection='user-disciplinas' required >
        </div>
      `;

    if (e.target.value !== "especializacao") {
      document.querySelector(`.campos-disciplina-${num}`).innerHTML = camposDisciplina;
      autoCompleteHandler(num, e.target.value);
      document.getElementById(`codigo-${num}`).classList.add("readonly");
      document.getElementById(`codigo-${num}`).readonly = true;
      document.getElementById(`codigo-${num}`).tabIndex = "-1";
      document.getElementById(`disciplina-input-${num}`).addEventListener("input", e => exibirBuscaDisciplinas(e, num));
    } else {
      document.querySelector(`.campos-disciplina-${num}`).innerHTML = camposDisciplina;
      document.getElementById(`codigo-${num}`).classList.remove("readonly");
      document.getElementById(`codigo-${num}`).readonly = false;
      document.getElementById(`codigo-${num}`).tabIndex = "0";
    }
    document.getElementById(`disciplina-input-${num}`).focus();
  };

  const exibirBuscaDisciplinas = (e, num) => {
    setTimeout(() => {
      const botaoBusca = document.getElementById(`disciplina-busca-${num}`);
      const opcoesAutocompletar = document.querySelector(`.div-disciplinas-${num}`).children.length;
      if (e.target.value.length > 2 && !opcoesAutocompletar) {
        if (!botaoBusca) {
          e.target.insertAdjacentHTML(
            "afterend",
            `<i class='fa fa-search localizar-disciplinas' id='disciplina-busca-${num}'></i>`
          );
        }
      } else {
        if (botaoBusca) {
          botaoBusca.outerHTML = "";
        }
      }
    }, 150);
  };

  const listeners = [
    {
      elemento: `select[name=${nomeInput}Nivel]`,
      evento: "change",
      funcao: (e, num) => inserirInputDisciplina(e, num)
    }
  ];

  inserirInput({
    nomeInput,
    classes,
    campoDinamico,
    container: ".disciplinas-container",
    callbackPreDelete: removerPendenciasAtividadeDeletada,
    listeners
    //autoCompleteHandler,
  });
};

const atividadesComplementaresEnsinoDinamicas = () => {
  const nomeInput = "atividadesComplementaresEnsino",
    classes = "input-atividades-ensino",
    campoDinamico = num => `   
      <div class='field'>
        <label for='atividade-complementar-ensino-tipo-${num}'>
          <p>Tipo da atividade:</p>            
        </label>
        <select name="${nomeInput}Tipo" id='atividade-complementar-ensino-tipo-${num}' data-section='2' data-subsection='user-atividades-complementares-ensino' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
          <option disabled selected>Selecione uma opção:</option>
          <option value='prep-aula'>Preparação de aulas/provas, etc.</option>
          <option value='coord-disc'>Coordenador de Disciplina</option>
          <option value='correcao-prova'>Correção/acompanhamento de provas/trabalhos/etc.</option>
          <option value='atendimento-extra-classe'>Atendimento extraclasse ao Aluno</option>
          <option value='correcao-tese'>Correção de Monografias/Dissertação/Teses</option>
          <option value='participacao-bancas'>Participação em bancas como membro ou revisor</option>
          <option value='atividades-fora'>Atividades fora da sede (bancas, aulas, representação...)</option>
          <option value='outros'>Outros</option>
        </select>   
      </div>
      <div class='field field-textarea'>
        <label for="descricao-atividades-complementares-ensino-${num}">
          <p>Descrição da atividade (obrigatório apenas se a atividade for tipificada como "outros"):</p>
        </label>
        <textarea id="descricao-atividades-complementares-ensino-${num}" name="${nomeInput}Descricao" data-section='2' data-subsection='user-atividades-complementares-ensino' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} ></textarea>
      </div>
      <div class='field field-ch'>
        <label for="carga-horaria-atividades-complementares-ensino-${num}">
          <p>Carga horária <span class='ch-semestral'>semestral</span>:</p>
        </label>
        <input class='input-ch input-ch-atividades-complementares-ensino' type="number" min='0' id="carga-horaria-atividades-complementares-ensino-${num}" name="${nomeInput}CH" data-section='2' data-subsection='user-atividades-complementares-ensino' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
      </div>
    `;
  inserirInput({
    nomeInput,
    classes,
    campoDinamico,
    container: ".atividades-complementares-ensino-container",
    callbackPreDelete: removerPendenciasAtividadeDeletada
  });
};

const dadosEstudante = (num, nomeInput, condicao) => {
  let cursoOrigem;
  if (condicao === "orientando") {
    cursoOrigem = `      
        <label for='nivel-${condicao}-${num}'>
          <p>Nível do curso do ${condicao}:</p>            
        </label>
        <select name="${nomeInput}Nivel" id='nivel-${condicao}-${num}' data-section='2' data-subsection='user-orientacoes' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
          <option disabled selected>Selecione uma opção:</option>
          <option value='graduacao'>Graduação</option>
          <option value='especializacao'>Especialização / Residência</option>
          <option value='mestrado'>Mestrado</option>
          <option value='doutorado'>Doutorado</option>
        </select>       
    `;
  } else if (condicao === "monitor") {
    cursoOrigem = `
      <label for='cursoOrigem-${condicao}-${num}'>
        <p>Curso no qual o ${condicao} atua:</p>            
      </label>
      <input type=text name="${nomeInput}CursoOrigem" id='cursoOrigem-${condicao}-${num}' data-section='2' data-subsection='user-monitorias' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
    `;
  }

  return `
    <div class='field'>
      <label for='nome-${condicao}-${num}'>
        <p>Nome do ${condicao}:</p>            
      </label>
      <input type="text" id="nome-${condicao}-${num}" name="${nomeInput}Nome${condicao}" data-section='2' data-subsection='${
    condicao === "orientando" ? "user-orientacoes" : "user-monitorias"
  }' ${planid.emEdicao.homologado && 'readonly tabindex="-1"'} required >
    </div>
    <div class='field identificacao-estudante'>
      <label for='identificacao-${condicao}-${num}'>
        <p>Identificação do ${condicao}:</p>   
        <i class='fa fa-info'></i>  
        <span class='dica'>DRE ou CPF</span>    
        </label>
      <input type="text" id="identificacao-${condicao}-${num}" name="${nomeInput}Id${condicao}" data-section='2' data-subsection='${
    condicao === "orientando" ? "user-orientacoes" : "user-monitorias"
  }' ${planid.emEdicao.homologado && 'readonly tabindex="-1"'} required >  
    </div>
    <div class='field'>
      ${cursoOrigem}
    </div>
    <div class='field field-ch'>
      <label for='carga-horaria-${condicao}-${num}'>
        <p>Carga horária de orientação semanal :</p>            
      </label>
      <input type="number" min='0' class='input-ch' id="carga-horaria-${condicao}-${num}" name="${nomeInput}CHOrientacao" data-section='2' data-subsection='user-orientacoes' ${planid
    .emEdicao.homologado && 'readonly tabindex="-1"'} required >
    </div>`;
};

const instituicaoEstudante = (num, inputName) => {
  const subsection = inputName === 'orientacoes' ? 'user-orientacoes' : 'user-orientacoes-ext';
  return `
  <div class='instituicao-div field'>
    <label><p>Instituição:</p></label>
    <div>
      <input type='radio' name='${inputName}-instituicao-radio-${num}' value='ufrj' id="instituicao-${inputName}-ufrj-${num}" data-subsection='${subsection}' ${planid
  .emEdicao.homologado && 'readonly tabindex="-1"'} checked >      
      <label for="instituicao-${inputName}-ufrj-${num}">
        <span></span><p>UFRJ:</p>
      </label>
    </div>
    <div>
      <input type='radio' name='${inputName}-instituicao-radio-${num}' value='outros' id="instituicao-${inputName}-outros-${num}" data-subsection='${subsection}' ${planid
  .emEdicao.homologado && 'readonly tabindex="-1"'} >  
      <label for="instituicao-${inputName}-outros-${num}">
        <span></span><p>Outras instituições:</p>
      </label>
    </div>
    <div class='${inputName}-instituicao ${inputName}-instituicao-${num}'>
      <input type='text' name='${inputName}Instituicao' value='ufrj' hidden data-subsection='${subsection}' ${planid
  .emEdicao.homologado && 'readonly tabindex="-1"'}>
    </div>
  </div>
`};

const orientacoesDinamicas = () => {
  const nomeInput = "orientacoes",
    classes = "input-orientacoes",
    condicao = "orientando",
    campoDinamico = num => `  
      <div class='field'>
        <label for='${nomeInput}Natureza-${num}'><p>Natureza da atividade</p></label>
        <select id='${nomeInput}Natureza-${num}' name=${nomeInput}Natureza data-section='2'>
          <option disabled selected>Selecione uma opção:</option>
          <option value='orientacao'>Orientação</option>
          <option value='coorientacao'>Coorientação</option>
        </select>
      </div> 
      ${instituicaoEstudante(num, nomeInput)}
      ${dadosEstudante(num, nomeInput, condicao)}
    `;
  const outrasInstituicoes = `    
    <label><p>qual instituição?</p></label>
    <input id='' type='text' data-section='2' name='${nomeInput}Instituicao' data-subsection='user-orientacoes'>    
  `;
  const listeners = [
    {
      elemento: `input[value=outros]`,
      evento: "change",
      funcao: e =>
        (e.target.parentElement.parentElement.querySelector(`.${nomeInput}-instituicao`).innerHTML = outrasInstituicoes)
    },
    {
      elemento: `input[value=ufrj]`,
      evento: "change",
      funcao: e =>
        (e.target.parentElement.parentElement.querySelector(
          `.${nomeInput}-instituicao`
        ).innerHTML = `<input type='text' name='${nomeInput}Instituicao' value='ufrj' hidden data-subsection='user-orientacoes'>`)
    }
  ];

  inserirInput({
    nomeInput,
    classes,
    campoDinamico,
    container: ".orientacoes-container",
    listeners,
    callbackPreDelete: removerPendenciasAtividadeDeletada
  });
};

const monitoriasDinamicas = () => {
  const nomeInput = "monitorias",
    classes = "input-monitorias",
    condicao = "monitor",
    campoDinamico = num => `   
      ${dadosEstudante(num, nomeInput, condicao)}
    `;
  inserirInput({
    nomeInput,
    classes,
    campoDinamico,
    container: ".monitorias-container",
    callbackPreDelete: removerPendenciasAtividadeDeletada
  });
};

const projetosDinamicos = tipo => {
  const nomeInput = `projetos${tipo.charAt(0).toUpperCase()}${tipo.slice(1)}`,
    classes = "input-projetos",
    dataSubsection = `user-projetos-${tipo}`,
    campoDinamico = num => `  
      <div class='field'>
        <label for='titulo-projeto-${tipo}-${num}'>
          <p>Título do projeto:</p>            
        </label>      
        <input type="text" id="titulo-projeto-${tipo}-${num}" name="${nomeInput}Titulo" data-section='3' data-subsection='${dataSubsection}' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
      </div> 
      <div class='field'>
        <label for='coordenador-projeto-${tipo}-${num}'>
          <p>Coordenador ou colaborador:</p>            
        </label>      
        <select id="coordenador-projeto-${tipo}-${num}" name="${nomeInput}Coordenador" data-section='3' data-subsection='${dataSubsection}' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
          <option disabled selected>Selecione uma opção:</option>
          <option value='coordenador'>Coordenador</option>
          <option value='colaborador'>Colaborador</option>
        </select>      
      </div>
      <div class='field'>
        <label for='financiador-projeto-${tipo}-${num}'>
          <p>Órgão financiador:</p>            
        </label> 
        <select id="financiador-projeto-${tipo}-${num}" name="${nomeInput}Financiador" data-section='3' data-subsection='${dataSubsection}' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
          ${financiamento}
        </select>  
      </div>

      <div class='${nomeInput}-financiador-outro-${num} field' id='${nomeInput}-financiador-outro-${num}'>
        <input type='text' name='${nomeInput}FinanciadorOutro' value='-' hidden data-subsection='${dataSubsection}' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'}>
      </div>
      
      <div class='field field-ch'>
        <label for='ch-projeto-${tipo}-${num}'>
          <p>Carga horária semanal:</p>            
        </label>      
        <input type="number" min='0' class='input-ch' id="ch-projeto-${tipo}-${num}" name="${nomeInput}CH" data-section='3' data-subsection='${dataSubsection}' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
      </div>
    `;
  const listeners = [
    {
      elemento: `select[name=${nomeInput}Financiador]`,
      evento: "change",
      funcao: (e, num) => {
        if (e.target.value === "outros") {
          document.querySelector(`.${nomeInput}-financiador-outro-${num}`).innerHTML = `
              <div class='field'>
                <label>
                  <p>Qual(is) o(s) financiador(es)?</p>
                  <i class='fa fa-info'></i>
                  <span class='dica'>Para vários financiadores, separá-los por vírgulas</span>
                </label>
                <input type='text' name='${nomeInput}FinanciadorOutro' data-section='3' data-subsection='${dataSubsection}' ${planid
            .emEdicao.homologado && 'readonly tabindex="-1"'} required>
              </div>
            `;
        } else {
          document.querySelector(`.${nomeInput}-financiador-outro-${num}`).innerHTML = `
            <input type='text' name='${nomeInput}FinanciadorOutro' value='-' hidden data-subsection='${dataSubsection}' ${planid
            .emEdicao.homologado && 'readonly tabindex="-1"'}>`;
        }
      }
    }
  ];

  inserirInput({
    nomeInput,
    classes,
    campoDinamico,
    container: `.projetos-${tipo}-container`,
    listeners,
    callbackPreDelete: removerPendenciasAtividadeDeletada
  });
};

const supervisoesDinamicas = () => {
  const nomeInput = "supervisoes",
    classes = "input-supervisoes",
    campoDinamico = num => `  
      <div class='supervisoes-div field'>
        <div class='field'>
          <label for='nome-pos-doc-${num}'>
            <p>Nome do pós-doutorando:</p>            
          </label>
          <input type="text" id="nome-pos-doc-${num}" name="${nomeInput}NomePosDoc" data-section='3' data-subsection='user-supervisoes' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required > 
        </div>        
        <div class='field identificacao-estudante'>
          <label for='${nomeInput}-CPF-${num}'>
            <p>CPF do pós-doutorando:</p>               
          </label>
          <input type="text" id="${nomeInput}-CPF-${num}" name="${nomeInput}CPFPosDoc" data-section='3' data-subsection='user-supervisoes' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >  
        </div>
        <div class='field'>
          <label >
            <p>O pós-doutorando recebe bolsa de estudos?</p>            
          </label>
          <div class='input-radio-div'>
            <input type='radio' name='${nomeInput}-radio-bolsa-pos-doc-${num}' id='bolsa-posdoc-nao-${num}' data-section='3' data-subsection='user-supervisoes' value='nao' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} checked>
            <label for='bolsa-posdoc-nao-${num}'>
              <span></span><p>Não</p>
            </label>
            <input type='radio' name='${nomeInput}-radio-bolsa-pos-doc-${num}' id='bolsa-posdoc-sim-${num}' data-section='3' data-subsection='user-supervisoes' value='sim' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'}>
            <label for='bolsa-posdoc-sim-${num}'>
              <span></span><p>Sim</p>
            </label>
          </div>
        </div>

        <div class='${nomeInput}-bolsa field' id='${nomeInput}-bolsa-${num}'>
          <input type='hidden' name='${nomeInput}BolsaPosDoc' value = '-' data-subsection='user-supervisoes'>
        </div> 

        <div class='field field-ch'>
          <label for='${nomeInput}-ch-${num}'>
            <p>Carga horária semanal:</p>            
          </label>      
          <input type="number" min='0' class='input-ch' id="${nomeInput}-ch-${num}" name="${nomeInput}CH" data-section='3' data-subsection='user-supervisoes' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
        </div>        
      </div>       
    `;

  const listeners = [
    {
      elemento: `input[value=sim]`,
      evento: "change",
      funcao: (e, num) => {
        document.querySelector(`.supervisoes-div #${nomeInput}-bolsa-${num}`).innerHTML = `
          <div class='field'>
            <label><p>A bolsa é provida por qual agência?</p></label> 
            <select name="${nomeInput}BolsaPosDoc" id='agencia-bolsa-pos-doc-${num}' data-section='3' data-subsection='user-supervisoes' ${planid
          .emEdicao.homologado && 'readonly tabindex="-1"'} required >
              ${bolsa}
            </select>
          </div>
        `;
      }
    },
    {
      elemento: `input[value=nao]`,
      evento: "change",
      funcao: (e, num) => {
        document.getElementById(
          `${nomeInput}-bolsa-${num}`
        ).innerHTML = `<input type='hidden' name='${nomeInput}BolsaPosDoc' value = '-' data-subsection='user-supervisoes'>`;
      }
    }
  ];
  inserirInput({
    nomeInput,
    classes,
    campoDinamico,
    container: ".supervisoes-container",
    listeners,
    callbackPreDelete: removerPendenciasAtividadeDeletada
  });
};

const atividadesCoopIntDinamicas = () => {
  const nomeInput = "atividadesCoopInt",
    classes = "input-atividades-coop-int",
    campoDinamico = num => `  
      <div class='field'>
        <label for='atividade-coop-int-atividade-${num}'>
          <p>Atividade:</p>            
        </label>      
        <select id="atividade-coop-int-atividade-${num}" name="${nomeInput}Atividade" data-section='3' data-subsection='user-atividades-cooperacao-internacional' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >       
          <option disabled selected>Selecione uma opção:</option>
          <option value='trabalho no exterior'>missão de trabalho no exterior com ou sem palestra</option>
          <option value='receber visitantes estrangeiros'>receber docentes ou discentes visitantes estrangeiros</option>      
          <option value='participação de cursos'>participação de cursos/simpósios em instituição internacional</option>         
          <option value='realização de cursos'>realização de cursos/simpósios com participação de público estrangeiro na UFRJ</option>         
          <option value='outras'>outras (especificar)</option> 
        </select>   
      </div> 
      <div class='field field-textarea'>
        <label for='atividade-coop-int-descricao-${num}'>
          <p>Especificação / Descrição da atividade:</p>            
        </label>      
        <textarea id="atividade-coop-int-descricao-${num}" name="${nomeInput}Descricao" data-section='3' data-subsection='user-atividades-cooperacao-internacional' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} ></textarea>     
      </div>  
      <div class='field'>
        <label for='atividade-coop-int-ch-${num}'>
          <p>Carga horária <span class='ch-semestral'>semestral</span>:</p>            
        </label>      
        <input type="number" min='0' class='input-ch' id="atividade-coop-int-ch-${num}" name="${nomeInput}CH" data-section='3' data-subsection='user-atividades-cooperacao-internacional' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
      </div>
    `;
  inserirInput({
    nomeInput,
    classes,
    campoDinamico,
    container: ".atividades-cooperacao-internacional-container",
    callbackPreDelete: removerPendenciasAtividadeDeletada
  });
};

const atividadesComplementaresPesquisaDinamicas = () => {
  const nomeInput = "atividadesComplementaresPesquisa",
    classes = "input-atividades-pesquisa",
    campoDinamico = num => `      
        <div class='field'>
          <label for='atividade-complementar-pesquisa-tipo-${num}'>
            <p>Tipo da atividade:</p>            
          </label>
          <select name="${nomeInput}Tipo" id='atividade-complementar-pesquisa-tipo-${num}' data-section='3' data-subsection='user-atividades-complementares-pesquisa' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
            <option disabled selected>Selecione uma opção:</option>
            <option value='prep-proj'>Preparação de projetos para editais de financiamento</option>
            <option value='pareceres-fomento'>Pareceres para órgãos de fomentos à pesquisa/revistas científicas</option>
            <option value='outros'>Outros</option>        
          </select>            
        </div>
        <div class='field field-textarea'>
          <label for="descricao-atividades-complementares-pesquisa-${num}">
            <p>Descrição da atividade:</p>
          </label>
          <textarea id="descricao-atividades-complementares-pesquisa-${num}" name="${nomeInput}Descricao" data-section='3' data-subsection='user-atividades-complementares-pesquisa'  ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} ></textarea>
        </div>
        <div class='field field-ch'>
          <label for="carga-horaria-atividades-pesquisa-${num}">
            <p>Carga horária <span class='ch-semestral'>semestral</span>:</p>
          </label>
          <input type="number" min='0' class='input-ch' id="carga-horaria-atividades-pesquisa${num}" name="${nomeInput}CH" data-section='3' data-subsection='user-atividades-complementares-pesquisa'  ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
        </div>
    `;

  inserirInput({
    nomeInput,
    classes,
    campoDinamico,
    container: ".atividades-complementares-pesquisa-container",
    callbackPreDelete: removerPendenciasAtividadeDeletada
  });
};

const acoesDinamicas = () => {
  const nomeInput = "acoes",
    classes = "input-acoes",
    campoDinamico = num => `      
      <div class='field'>
        <label for='acao-titulo-${num}'>
          <p>Título da ação:</p>            
        </label>      
        <input type="text" id="acao-titulo-${num}" name="${nomeInput}Titulo" data-section='4' data-subsection='user-acoes' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
      </div>
      <div class='field'>
        <label for='acao-tipo-${num}'>
          <p>Tipo da ação:</p>            
        </label>
        <select name="${nomeInput}Tipo" id='acao-tipo-${num}' data-section='4' data-subsection='user-acoes' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
          <option disabled selected>Selecione uma opção:</option>
          <option value='evento'>evento</option>
          <option value='curso'>curso</option>
          <option value='projeto'>projeto</option>        
          <option value='programa'>programa</option>        
          <option value='outros'>outros</option>        
        </select>  
      </div>

      <div class='tipo-acao-outros field' id='tipo-acao-outros-${num}'>
        <input id='tipo-acao-${num}' type='hidden' name='${nomeInput}TipoAcaoOutros' value = '-'>
      </div>

      <div class='field'>
        <label for='acao-coordenador-${num}'>
          <p>Coordenador ou colaborador:</p>            
        </label>    
        <select id="acao-coordenador-${num}" name="${nomeInput}Coordenador" data-section='4' data-subsection='user-acoes' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
          <option disabled selected>Selecione uma opção:</option>
          <option value='coordenador'>Coordenador</option>
          <option value='colaborador'>Colaborador</option>
        </select>
      </div>
      <div class='field'>
        <label for='acao-instituicao-${num}'>
          <p>Instituição(ões) envolvida(s):</p>            
        </label>      
        <input type="text" id="acao-instituicao-${num}" name="${nomeInput}InstituicaoEnvolvida" data-section='4' data-subsection='user-acoes' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
      </div>
      <div class='field'>
        <label for='acao-cadastrada-${num}'>
          <p>Ação cadastrada no SIGA?</p>            
        </label>
        <select name='${nomeInput}AcaoCadastrada' id='acao-cadastrada-${num}' data-section='4' data-subsection='user-acoes' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'}>
          <option disabled selected>Selecione uma opção:</option>
          <option value='sim'>sim</option>
          <option value='nao'>não</option>
        </select>          
      </div>   
      <div class='field field-ch'>
        <label for='ch-acao-${num}'>
          <p>Carga horária semanal:</p>            
        </label>      
        <input type="number" min='0' class='input-ch' id="ch-acao-${num}" name="${nomeInput}CH" data-section='4' data-subsection='user-acoes' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
      </div>
    `;

  const listeners = [    
    {
      elemento: `select[name=${nomeInput}Tipo]`,
      evento: "change",
      funcao: (e, num) => {
        let html;
        if (e.target.value === "outros") {
          html = `
            <label for='tipo-acao-${num}'>
              <p>Tipo da ação:</p>            
            </label>
            <input type='text' id="tipo-acao-${num}" name="${nomeInput}TipoAcaoOutros" data-section='4' data-subsection='user-acoes' ${planid
            .emEdicao.homologado && 'readonly tabindex="-1"'} required>
          `;
        } else {
          html = `<input id='tipo-acao-${num}' type='hidden' name='${nomeInput}TipoAcaoOutros' value = '-'>`;
        }
        document.getElementById(`tipo-acao-outros-${num}`).innerHTML = html;
      }
    }
  ];
  inserirInput({
    nomeInput,
    classes,
    campoDinamico,
    container: ".acoes-container",
    listeners,
    callbackPreDelete: removerPendenciasAtividadeDeletada
  });
};

const orientacoesExtDinamicas = () => {
  const nomeInput = "orientacoesExt",
    classes = "input-orientacoes-ext",
    outrasInstituicoes = `    
      <label><p>qual instituição?</p></label>
      <input id='' type='text' data-section='4' name='orientacoesExtInstituicao' data-subsection='user-orientacoes-ext'>    
    `,
    campoDinamico = num => `
      <div class='orientacoes-ext-div field'>
        <div class='field'>
          <label for='orientacoes-ext-nome-${num}'>
            <p>Nome do extensionista:</p>            
          </label>
          <input type="text" id="orientacoes-ext-nome-${num}" name="${nomeInput}Nome" data-section='4' data-subsection='user-orientacoes-ext' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
        </div>

        <div class='field identificacao-estudante'>
          <label for='identificacao-ext-${num}'>
            <p>Identificação do extensionista:</p>   
            <i class='fa fa-info'></i>  
            <span class='dica'>DRE ou CPF</span>    
            </label>
          <input type="text" id="identificacao-ext-${num}" name="orientacoesExtIdentificacao" data-section='4' data-subsection='user-acoes' ${planid.emEdicao.homologado && 'readonly tabindex="-1"'} required >  
        </div>

        <div class='field'>
          ${instituicaoEstudante(num, nomeInput)}
        </div>
        <div class='field'>
          <label for='orientacoes-ext-curso-${num}'>
            <p>Curso de origem do extensionista:</p>            
          </label>
          <input type=text name="orientacoesExtCurso" id='orientacoes-ext-curso-${num}' data-section='4' data-subsection='user-orientacoes-ext' ${planid.emEdicao.homologado && 'readonly tabindex="-1"'} required >
        </div>
        <div class='field'>
          <label for='bolsa-ext-${num}'>
            <p>O extensionista recebe bolsa de estudos?</p>            
          </label>
          <select name='${nomeInput}Bolsa' id='bolsa-ext-${num}' data-section='4' data-subsection='user-orientacoes-ext' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'}>
            <option disabled selected>Selecione uma opção:</option>
            <option value='sim'>sim</option>
            <option value='nao'>não</option>
          </select>
        </div>

          <div class='${nomeInput}-financiador ${nomeInput}-financiador-${num} field'>
            <input type='hidden' name='${nomeInput}Financiador' data-subsection='user-orientacoes-ext' id='${nomeInput}-financiador-${num}' value = '-'>
          </div>           
        
        <div class='field field-ch'>
          <label for='ch-${nomeInput}-${num}'>
            <p>Carga horária semanal:</p>            
          </label>      
          <input type="number" class='input-ch' id="ch-${nomeInput}-${num}" name="${nomeInput}CH" data-section='4' data-subsection='user-orientacoes-ext' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
        </div>
      </div>
    `,
    listeners = [
      {
        elemento: `input[value=outros]`,
        evento: "change",
        funcao: (e, num) => {
          document.querySelector(`.${nomeInput}-instituicao-${num}`).innerHTML = outrasInstituicoes;
        }
      },
      {
        elemento: `input[value=ufrj]`,
        evento: "change",
        funcao: (e, num) => {
          document.querySelector(
            `.${nomeInput}-instituicao-${num}`
          ).innerHTML = `<input type='text' name='orientacoesExtInstituicao' value='ufrj' hidden data-subsection='user-orientacoes-ext'>`;
        }
      },
      {
        elemento: `select[name=${nomeInput}Bolsa]`,
        evento: "change",
        funcao: (e, num) => {
          if (e.target.value === "sim") {
            document.querySelector(`.${nomeInput}-financiador-${num}`).innerHTML = `
              <label><p>A bolsa é provida por qual agência?</p></label> 
              <select name="${nomeInput}Financiador" id='${nomeInput}-financiador-${num}' data-section='4' data-subsection='user-orientacoes-ext' ${planid
              .emEdicao.homologado && 'readonly tabindex="-1"'} required >
                ${bolsa}
              </select>
            `;
          } else {
            document.querySelector(
              `.${nomeInput}-financiador-${num}`
            ).innerHTML = `<input type='hidden' id='${nomeInput}-financiador-${num}' name='${nomeInput}Financiador' value = '-' data-subsection='user-orientacoes-ext'>`;
          }
        }
      }
    ];
  inserirInput({
    nomeInput,
    classes,
    campoDinamico,
    container: ".orientacoes-ext-container",
    listeners,
    callbackPreDelete: removerPendenciasAtividadeDeletada
  });
};

const atividadesAdmDinamicas = () => {
  const nomeInput = "atividadesAdm",
    classes = "input-atividades-adm",
    campoDinamico = num => `   
      <div class='field'>
        <label for='atividade-adm-cargo-${num}'>
          <p>${nomesAmigaveis.atividadesAdmCargo}:</p>            
        </label>      
        <select id="atividade-adm-cargo-${num}" name="${nomeInput}Cargo" data-section='5' data-subsection='user-atividades-adm' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >       
          <option disabled selected>Selecione uma opção:</option>
          <option value='adm-sup'>Administração Superior (Reitoria)</option>
          <option value='adm-med'>Administração Média (Decania)</option>
          <option value='diretoria'>Diretorias</option>      
          <option value='coordenacao'>Coordenações</option> 
          <option value='chefia'>Chefias</option> 
          <option value='comissao'>Participação em Comissões</option> 
          <option value='outros'>Atividades Administrativas de outra natureza</option>           
        </select> 
      </div>
      <div class='field field-textarea'>
        <label for='atividade-adm-descricao-${num}'>
          <p>${nomesAmigaveis.atividadesAdmDescricao}:</p>            
        </label>      
        <textarea id="atividade-adm-descricao-${num}" name="${nomeInput}Descricao" data-section='5' data-subsection='user-atividades-adm' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required ></textarea>   
      </div>
      <div class='field field-ch'>  
        <label for='atividade-adm-ch-${num}'>
          <p>Carga horária semanal:</p>            
        </label>      
        <input type="number" class='input-ch' id="atividade-adm-ch-${num}" name="${nomeInput}CH" data-section='5' data-subsection='user-atividades-adm' ${planid
      .emEdicao.homologado && 'readonly tabindex="-1"'} required >
      </div>
    `;
  inserirInput({
    nomeInput,
    classes,
    campoDinamico,
    container: ".atividades-adm-container",
    callbackPreDelete: removerPendenciasAtividadeDeletada
  });
};

const removerPlanidDOM = () => {
  variaveisGlobais.controlarVisibilidade("ocultar", ".overlay-novo-planid");
  setTimeout(() => {
    document.querySelector(`.overlay-novo-planid`).outerHTML = "";
    document.querySelector(`body`).classList.remove("fixo");
  }, 500);
};

const inserirCabecalho = (autor, semestre) => {
  const janela = document.querySelector(`.overlay-novo-planid .janela`);
  const html = `
    <div class='cabecalho-planid'>
      <div>
        <img class='marca-ccs' src='/img/marca.svg'>
        <h2>Planid ${semestre}</h2>
      </div>
      <h2>${autor.nome.split(" ")[0]} ${autor.nome.split(" ").pop()}</h2> 
      <span class='fechar-planid'>&times;</span>
    </div>
    <div class='cabecalho-print'>
    <div class='marca-ccs-planid-print__container'>
      <img class='marca-ccs-planid-print' src='/img/marca.svg'>
    </div>
      <h2>Plano de atividades docentes ${semestre}</h2>
      <div class='cabecalho-print__dados'>
        <h2>${autor.nome}</h2>
        <p>Unidade: ${document.querySelector(`input[name=unidade]`).value}</p>
        <p>Carga horária semanal planejada: ${somarCargaHoraria(document.querySelectorAll(`.input-ch`)).toFixed(
          1
        )} horas</p>
      </div>
    </div>
  `;
  janela.insertAdjacentHTML("afterbegin", html);
  janela.querySelector(`.fechar-planid`).addEventListener("click", removerPlanidDOM);
};

const removerFormsteps = () => {
  document.querySelector(`.form-steps`).outerHTML = "";
};

const removerBotoesAdicionarAtividade = () => {
  const botoes = document.querySelectorAll(`.btn-acao`);
  for (let i = 0; i < botoes.length; i++) {
    botoes[i].outerHTML = "";
  }
};

const exibirSecoes = () => {
  const secoes = document.querySelectorAll(`.section-planid`);
  for (let i = 0; i < secoes.length; i++) {
    secoes[i].classList.remove("hidden");
    secoes[i].classList.remove("opacidade-zero");
  }
};

const removerBotoesExcluirAtividade = () => {
  const botoes = document.querySelectorAll(`.box-cinza .fa-times-circle`);
  for (let i = 0; i < botoes.length; i++) {
    botoes[i].outerHTML = "";
  }
};

const removerIconesControle = () => {
  //document.querySelector(`.btn-submit-planid-div`).outerHTML = "";
  if (document.querySelector(`.comentarios-gerais`)) {
    document.querySelector(`.comentarios-gerais`).outerHTML = "";
  }
};

const indicarCamposVazios = () => {
  const containers = document.querySelectorAll(`.atividade-container`);
  for (let i = 0; i < containers.length; i++) {
    if (!containers[i].innerHTML) {
      containers[i].innerHTML = `<div class='box-cinza sem-atividades'><p>Sem atividades registradas</p></div>`;
    }
  }
};

const ajustarExibicaoPlanid = planid => {
  inserirCabecalho(planid.autor, planid.semestre);
  removerFormsteps();
  removerBotoesAdicionarAtividade();
  exibirSecoes();
  removerBotoesExcluirAtividade();
  removerIconesControle();
  indicarCamposVazios();
  if (planid.eventos.length) {
    adicionarEventos(planid.eventos, { elementoInsercao: "#planid-formulario", posicao: "afterend" });
  }
  adicionarAcoesPlanid(planid);
};

const somarCargaHoraria = inputs => {
  let ch = 0;
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value <= 0) {
      inputs[i].value = "";
      continue;
    }
    if (inputs[i].classList.contains("input-ch-disciplinas")) {
      //if (planid.unidadePreenchimentoPlanid === 'Faculdade de Medicina (FM)') {
      //ch += +inputs[i].value / semanasAulaMedicina;
      //} else {
      ch += +inputs[i].value / semanasAula;
      //}
    } else if (
      inputs[i].name === "atividadesComplementaresEnsinoCH" ||
      inputs[i].name === "atividadesCoopIntCH" ||
      inputs[i].name === "atividadesComplementaresPesquisaCH"
    ) {
      ch += +inputs[i].value / semanasAula;
    } else {
      ch += +inputs[i].value;
    }
  }
  return ch;
};

const calcularCargaHorariaTotal = e => {
  if ((e && e.target.classList.contains("input-ch")) || !e) {
    const inputsCargaHoraria = document.querySelectorAll(`.input-ch`);
    planid.cargaHorariaTotal = somarCargaHoraria(inputsCargaHoraria);
    setTimeout(() => {
      document.querySelector(`.horas-semanais .quantidade-horas`).innerHTML = `${planid.cargaHorariaTotal.toFixed(1)}`;
    }, 50);
    if (+planid.cargaHorariaTotal.toFixed(0) !== planid.CHIdeal) {
      document.querySelector(`.horas-semanais`).classList.add("fora-da-faixa");
    } else {
      document.querySelector(`.horas-semanais `).classList.remove("fora-da-faixa");
    }
  }
};

const calcularCargaHorariaParcial = e => {
  // se houver evento, calcula-se a carga horária parcial apenas do container que sofreu edição. Caso contrário, o planid foi carregado para visualização / edição e devem ser calculadas as cargas horárias parciais de todas as seções.
  let chParcial = 0;
  let secoes;
  let sectionNumber;
  if (e && e.target.dataset.section) {
    // listener change input
    secoes = document.querySelectorAll(`.section-${e.target.dataset.section}`);
    sectionNumber = e.target.dataset.section;
  } else if (e && !e.target.dataset.section) {
    // listener excluir atividade
    secoes = document.querySelectorAll(
      `.section-${e.target.parentElement.parentElement.parentElement.parentElement.dataset.section}`
    );
    sectionNumber = e.target.parentElement.parentElement.parentElement.parentElement.dataset.section;
  } else if (!e) {
    // edição do Planid
    secoes = document.querySelectorAll(`.section-planid`);
  }

  //settimeout necessário porque a eliminação do input do DOM ocorre com delay de 500ms
  setTimeout(() => {
    for (let i = 0; i < secoes.length; i++) {
      if (!e) {
        sectionNumber = i + 1;
      }
      const ch = secoes[i].querySelectorAll(`.input-ch`);
      chParcial = somarCargaHoraria(ch);
      if (document.querySelector(`.section-planid__ch-${sectionNumber}`)) {
        document.querySelector(`.section-planid__ch-${sectionNumber}`).innerHTML = chParcial.toFixed(1);
      }
    }
  }, 600);
};

const calcularCargaHoraria = planid => {
  cargasHorariasParciais = {
    total: 0,
    parcial: {
      section_2: 0,
      section_3: 0,
      section_4: 0,
      section_5: 0,
    }
  };
  const props = Object.entries(planid);    
  for (let j = 0; j < props.length; j++) {
    let chDividida;
    if (props[j][0].includes('CH') && planid[props[j][0]].length) {
      const cargasHorarias = planid[props[j][0]];
      for (let k = 0; k < cargasHorarias.length; k++) {        
        if (CHSemestrais.includes(props[j][0])) {
          //if (planids.autor.unidadePreenchimentoPlanid === 'Faculdade de Medicina (FM)') {            
            //chDividida = planid[props[j][0]][k] / semanasAulaMedicina;
          //} else {
            chDividida = planid[props[j][0]][k] / semanasAula;
          //}
        }
        computarCargasHorariasParciais(props[j][0], chDividida || +planid[props[j][0]][k]);
      }
    }
  }
};

const gerarPlanidEmBranco = () => {
  const planidEmBranco = {}
  const todasSubsecoes = Object.values(containers);
  for (let i = 0; i < todasSubsecoes.length; i++) {
    for (let k = 0; k < todasSubsecoes[i].length; k++)
    planidEmBranco[todasSubsecoes[i][k]] = []
  }
  return planidEmBranco;
};

const preencherPlanid = plSelecionado => {
  if (plSelecionado.comentariosGerais) {
    document.querySelector(`input[name=comentariosGerais]`).value = plSelecionado.comentariosGerais;
  }
  const containerArray = Object.entries(containers);
  //cliques
  for (let i = 0; i < containerArray.length; i++) {
    for (let j = 0; j < containerArray[i][1].length; j++) {
      for (let k = 0; k < plSelecionado[containerArray[i][1][j]].length; k++) {      
        document.querySelector(`.adicionar-${containerArray[i][0]}`).click();
      }
      break;
    }
  }
  //preenchimento
  for (let i = 0; i < containerArray.length; i++) {
    for (let j = 0; j < containerArray[i][1].length; j++) {
      if (plSelecionado[containerArray[i][1][j]].length) {
        const propriedade = containerArray[i][1][j];
        const valores = plSelecionado[containerArray[i][1][j]];
        for (let k = 0; k < valores.length; k++) {
          if (propriedade === "orientacoesInstituicao" && valores[k] !== "ufrj") {
            document.querySelectorAll(
              `.orientacoes-container [name=orientacoes-instituicao-radio-${valores.length - 1 - k}]`
            )[1].checked = true;
            document.querySelectorAll(`.orientacoes-container .orientacoes-instituicao`)[k].innerHTML = `
              <label><p>qual?</p></label>
              <input type="text" name="orientacoesInstituicao" data-section='2' value='${valores[k]}'>
            `;
          } else if (propriedade === "orientacoesExtInstituicao" && valores[k] !== "ufrj") {            
              document.querySelectorAll(`[name=orientacoesExt-instituicao-radio-${valores.length - 1 - k}]`)[1].checked = true;
              document.querySelectorAll(`.orientacoesExt-instituicao`)[k].innerHTML = `
                <label><p>qual?</p></label>
                <input type="text" name="orientacoesExtInstituicao" data-section='4' value='${valores[k]}'>
              `;            
          } else if (propriedade === "orientacoesExtBolsa" && valores[k] === "sim") {
            getSelectedOption(document.querySelectorAll(`#bolsa-ext-${valores.length - 1 - k} option`), "sim");
            document.querySelectorAll(`.orientacoesExt-financiador`)[k].innerHTML = `
            <label><p>A bolsa é provida por qual agência?</p></label> 
            <select name="orientacoesExtFinanciador" id='orientacoesExt-financiador-${valores.length -
              1 -
              k}' data-section="3" ${planid.emEdicao.homologado && 'readonly tabindex="-1"'} required >
            ${bolsa}
            </select>
            `;
          } else if (propriedade === "supervisoesBolsaPosDoc" && valores[k] !== "-") {
            document.querySelectorAll(
              `[name=supervisoes-radio-bolsa-pos-doc-${valores.length - 1 - k}]`
            )[1].checked = true;
            document.querySelectorAll(`.supervisoes-bolsa`)[k].innerHTML = `
              <label><p>A bolsa é provida por qual agência?</p></label> 
              <select name="supervisoesBolsaPosDoc" id='agencia-bolsa-pos-doc-${valores.length -
                1 -
                k}' data-section='3'  ${planid.emEdicao.homologado && 'readonly tabindex="-1"'} required value=${
              valores[k]
            } >
                ${bolsa}
              </select>
            `;
            getSelectedOption(
              document.querySelectorAll(`#agencia-bolsa-pos-doc-${valores.length - 1 - k} option`),
              valores[k]
            );
          } else if (propriedade === "projetosPesqFinanciador" && valores[k] === "outros") {
            getSelectedOption(
              document.querySelectorAll(`#financiador-projeto-pesq-${valores.length - 1 - k} option`),
              valores[k]
            );
            document.getElementById(`projetosPesq-financiador-outro-${valores.length - 1 - k}`).innerHTML = `
              <label><p>Qual o financiador?</p></label>
                <input type='text' name='projetosPesqFinanciadorOutro' data-section='3' value='${
                  plSelecionado.projetosPesqFinanciadorOutro[k]
                }' ${planid.emEdicao.homologado && 'readonly tabindex="-1"'} required>  
            `;
          } else if (propriedade === "projetosInovFinanciador" && valores[k] === "outros") {
            getSelectedOption(
              document.querySelectorAll(`#financiador-projeto-inov-${valores.length - 1 - k} option`),
              valores[k]
            );
            document.getElementById(`projetosInov-financiador-outro-${valores.length - 1 - k}`).innerHTML = `
              <label><p>Qual o financiador?</p></label>
                <input type='text' name='projetosInovFinanciadorOutro' data-section='3' value='${
                  plSelecionado.projetosInovFinanciadorOutro[k]
                }' ${planid.emEdicao.homologado && 'readonly tabindex="-1"'} required>  
            `;
          } else if (propriedade === "acoesTipo" && valores[k] === "outros") {
            getSelectedOption(document.querySelectorAll(`#acao-tipo-${valores.length - 1 - k} option`), valores[k]);
            document.getElementById(`tipo-acao-outros-${valores.length - 1 - k}`).innerHTML = `
              <label for='tipo-acao-${valores.length - 1 - k}'>
                <p>Tipo da ação:</p>            
              </label>
              <input type='text' id="tipo-acao-${valores.length -
                1 -
                k}" name="acoesTipoAcaoOutros" data-section='4' data-subsection='user-acoes' ${planid.emEdicao
              .homologado && 'readonly tabindex="-1"'} required>
            `;
          } else {     
            document.querySelectorAll(`[name=${propriedade}]`)[k].value = valores[k];
          }          
        }
      }
    }
  }
  calcularCargaHorariaTotal();
  calcularCargaHorariaParcial();
};

const listenersBotoesFormulario = () => {
  document.querySelector(`.adicionar-ferias`).addEventListener("click", feriasDinamicas);
  document.querySelector(`.adicionar-afastamentos`).addEventListener("click", afastamentosDinamicos);
  document.querySelector(`.adicionar-disciplinas`).addEventListener("click", disciplinasDinamicas);
  document
    .querySelector(`.adicionar-atividades-complementares-ensino`)
    .addEventListener("click", atividadesComplementaresEnsinoDinamicas);
  document.querySelector(`.adicionar-orientacoes`).addEventListener("click", orientacoesDinamicas);
  document.querySelector(`.adicionar-monitorias`).addEventListener("click", monitoriasDinamicas);
  document.querySelector(`.adicionar-projetos-inov`).addEventListener("click", () => projetosDinamicos("inov"));
  document.querySelector(`.adicionar-projetos-pesq`).addEventListener("click", () => projetosDinamicos("pesq"));
  document.querySelector(`.adicionar-supervisoes`).addEventListener("click", supervisoesDinamicas);
  document
    .querySelector(`.adicionar-atividades-cooperacao-internacional`)
    .addEventListener("click", atividadesCoopIntDinamicas);
  document
    .querySelector(`.adicionar-atividades-complementares-pesquisa`)
    .addEventListener("click", atividadesComplementaresPesquisaDinamicas);
  document.querySelector(`.adicionar-acoes`).addEventListener("click", acoesDinamicas);
  document.querySelector(`.adicionar-orientacoes-ext`).addEventListener("click", orientacoesExtDinamicas);
  document.querySelector(`.adicionar-atividades-adm`).addEventListener("click", atividadesAdmDinamicas);
};
