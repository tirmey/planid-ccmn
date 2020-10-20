"use strict";

const semestre = `${moment().year()}-${moment().quarter() === 1 || moment().quarter() === 2 ? "1" : "2"}`,
  proximoSemestre = `${moment()
    .add(6, "month")
    .year()}-${
    moment()
      .add(6, "month")
      .quarter() === 1 ||
    moment()
      .add(6, "month")
      .quarter() === 2
      ? "1"
      : "2"
  }`,
  semestreAnterior = `${moment()
    .subtract(6, "month")
    .year()}-${
    moment()
      .subtract(6, "month")
      .quarter() === 1 ||
    moment()
      .subtract(6, "month")
      .quarter() === 2
      ? "1"
      : "2"
  }`,
  inicioPreenchimentoPlanid = new Date(2020, 0, 13).getTime(),
  fimPreenchimentoPlanid = new Date(2020, 11, 31).getTime(),
  inicioNovoPlanid = new Date(2020, 0, 13).getTime(),
  fimNovoPlanid = new Date(2020, 10, 29).getTime(),
  habilitarPreenchimentoPlanid = new Date().getTime() > inicioPreenchimentoPlanid && new Date().getTime() < fimPreenchimentoPlanid,
  prazoNovoPlanid = new Date().getTime() > inicioNovoPlanid && new Date().getTime() < fimNovoPlanid,
  semanasAula = 15,
  // semanasAulaMedicina = 22,
  planid = {
    pagina: 1, // página de início de exibição do planid aberto
    totalPaginas: 0, // total de seções do planid. Calculado 'on the fly'
    clicouFinalizar: false, //indica que o usuario clicou em finalizar para enviar o formulário
    emEdicao: "", //id de um planid JÁ SALVO, quando está aberto, em edição.
    habilitarNovoPlanid: true, // determina se será exibido o botão de novo planid
    campoSelecionado: "", //informa o input selecionado, para validação
    cargaHorariaTotal: 0,
    CHIdeal: typeof dashboard === "undefined" ? 40 : dashboard.user.regime === "20h" ? 20 : 40,
    exibiuTutorial: false,
    tutorialPaginaAtual: 0,
    unidadePreenchimentoPlanid: "",
    autosaving: false,
    intervaloAutosave: 300000,
    clicouFecharPlanid: false,
    exibiuAlertaDadosOffline: false,
  }, 
  caret = `
        <div class='icone-abertura-container-atividade'>
          <div>         
            <span class='texto-exibir'><i class='fa fa-window-maximize'></i></span><span class='texto-ocultar'><i class='fa fa-times'></i></span> 
          </div>          
        </div>
      `,
  formStep = (section, number, before, after) => {
    const svg = position => `
          <svg class="form-step-svg ${position}" viewBox="0 0 376.78 68"><path d="M801.65,411H489.21a3,3,0,0,1-1.49-5.6l41.76-24.07a5,5,0,0,0,0-8.66L487.72,348.6a3,3,0,0,1,1.49-5.6H801.65a20,20,0,0,1,10,2.67l49.85,28.73a3,3,0,0,1,0,5.2l-49.85,28.73A20,20,0,0,1,801.65,411Z" transform="translate(-486.21 -343)" /></svg>`;
    return `<div class='form-steps__step step-section-${number} ${number === "1" ? "selected" : ""}' title='${section}'>
          ${before ? svg("before") : ""}
          <span data-section='${number}'>${number}</span>
          ${after ? svg("after") : ""}
        </div>`;
  },
  autosaveMessage = `
    <div class='autosave-message'><div><img src="/img/loading.svg"></div><p>Salvando...</p></div>
  `,
  autoSave = () => {
    planid.autosaving = true;
    document.getElementById(`submit-planid`).click();        
    document.querySelector(`.overlay-novo-planid`).insertAdjacentHTML('beforeend', autosaveMessage); 
  };

const dicas = {
  disciplinas_geral: `<p>Neste campo, devem ser incluídas todas as disciplinas de graduação e de pós que o/a docente tenha ministrado, sendo ou não responsável, e que tenham um código da UFRJ.A carga horária indicada deve ser aquela que efetivamente foi ministrada pelo/a docente</p><p>Disciplinas com dois ou mais docentes responsáveis devem ter a carga horária dividida entre os docentes, indicando, para cada docente, a carga de sua responsabilidade direta</p>`,
  ["atividades-complementares-ensino_geral"]: `<p>1) Preparação de provas e aula por semestre: indicar até 25% da carga horária das disciplinas "efetivas", ou seja, com turmas que necessitem preparação de aulas e provas e não seminários, etc. Exemplo: No caso de 60h semestrais colocado na parte acima, 15h semestrais serão incluídas neste item.<p><p>2) Correção de prova/trabalho: indicar de 20% a 30% da carga horária das disciplinas "efetivas", dependendo do tamanho da turma e do tipo de trabalho. Sugestão adicionar até 15h semestrais</p><p>3)Atendimento ao aluno: tirar dúvidas (fora do horário de aula), explicações de trabalhos, etc. Sugestão: indicar entre 5-10 horas /semestre</p><p>4) Correção de Monografias/Dissertação/Teses: Serão considerados entre 0 e 5 teses ou dissertação por semestre. Sugestão: Adicionar 4 horas por tese/dissertação e 2 horas/ monografia</p><p>5) Participação em bancas como membro ou revisor: Sugestão adicionar 4 horas / por tese/ dissertação e 2 horas/ monografia</p><p>6) Atividades fora da sede: São reuniões com grupos de pesquisa externos, workshops, seminários e congressos. Sugestão até 50 horas/ semestre (Em torno de 8% do Total)</p><p>OBS: Caso a atividade demande um número de horas maior do que a sugerida, o/a docente deverá justificar no campo"Observações" abaixo.</p>`
},
textosTutorial = [
  {
    titulo: "",
    texto: `
          <div>
            <div class='text-svg'>
              <svg viewBox="0 0 576 512"><defs><style>.fa-secondary{opacity:.4}</style></defs><path d="M192 32l192 64v384l-192-64z" class="fa-secondary"/><path d="M0 117.66V464a16 16 0 0 0 21.94 14.86L160 416V32L20.12 88A32 32 0 0 0 0 117.66zm554.06-84.5L416 96v384l139.88-55.95A32 32 0 0 0 576 394.34V48a16 16 0 0 0-21.94-14.84z" class="fa-primary"/></svg>
            </div class='text-svg'>
            <h3>Planids CCS</h3>
            <p>Guia rápido de Preenchimento</p>
          </div>`,
    instrucoes: `<p>Clique nas setas para acessar as seções deste guia. Marque a caixa "Não exibir o tutorial novamente neste dispositivo" se não deseja iniciar o tutorial automaticamente, a cada sessão.</p>`
  },
  {
    titulo: "1- Criando um novo planid",
    instrucoes: `<h3>Botão "adicionar plano"</h3><p>clique neste botão para iniciar o preenchimento de um novo planid.</p>`,
    imagem: "criandoPlanid"
  },
  {
    titulo: "2- Lista de planids",
    instrucoes: `
          <h3>1 - Lista de planids</h3><p>Lista geral com o histórico de planids já preenchidos. Todos os planids anteriores podem ser visualizados e apenas o planid ativo (próximo semestre) pode ser editado.</p>
          <h3>2 - Status do planid</h3><p>Indica o status do planid. O ícone \"lápis\" indica planid em preenchimento. O ícone \"check\" indica que o planid fora enviado aos gestores do planid de sua Unidade.</p>
          <h3>3 - Identificação do planid</h3><p>Clique para visualizar ou editar um planid.</p>
          <h3>4 - Comentários gerais</h3><p>Clique para visualizar ou editar os comentários gerais de um planid.</p>
          <h3>5 - Mensagens</h3><p>Clique para visualizar ou enviar mensagens referentes a um planid.</p>
          <h3>6 - Imprimir</h3><p>Clique para imprimir um planid.</p>
        `,
    imagem: "listaPlanids"
  },
  {
    titulo: "3- Interface de edição",
    instrucoes: `
          <h3>1 - Índice de Seções</h3><p>Clique sobre os números para navegar entre as seções do planid.</p>
          <h3>2 - Seção do planid</h3>
          <h3>3 - Sub-seção do planid</h3>
          <h3>4 - Botões de navegação</h3><p>Clique sobre "retornar" e "avançar" para acessar a seção anterior ou a seção seguinte, respectivamente.</p><p>Obs.: Na última seção, \"avançar\" é substituído por \"enviar\". Clique sobre "enviar" para submeter o plano de atividades aos gestores do planid de sua Unidade.</p>
          <h3>5 - Menu de ações</h3><p>O Menu de ações será apresentado em detalhes na próxima tela deste guia.</p>
        `,
    imagem: "interfaceEdicao"
  },
  {
    titulo: "4- Menu de ações",
    instrucoes: `
          <h3>1 - Carga horária total</h3><p>A carga horária semanal total do planid em tela.</p>
          <h3>2 - Erros de preenchimento</h3><p>Caso haja campos obrigatórios não preenchidos durante a validação dos dados para envio do planid, o indicador de erros de preenchimento piscará intermitentemente na cor laranja e a legenda "há erros" será exibida. Clicar sobre o ícone de erros de preenchimento em seu estado ativo exibe ou oculta a janela de exibição de campos não preenchidos.</p>
          <h3>3 - Comentários gerais</h3><p>Exibe a interface para visualização ou edição dos comentários gerais do planid.</p>
          <h3>4 - Salvar planid</h3><p>Salva o planid em tela, em seu estado atual. Durante o salvamento, não há validação dos dados, sendo permitido, portanto, que haja campos em branco.</p>
          <h3>5 - Enviar planid</h3><p>Envia o plano de atividades em tela aos gestores do planid de sua Unidade. Nesta etapa, há validação dos dados e não será possível enviar o plano de atividades enquanto os todos os campos vazios não forem preenchidos ou removidos.</p>
          <h3>6 - Fechar o planid atual</h3><p>Fecha o planid em tela, sem salvar os dados, e exibe a lista de planids.</p>
        `,
    imagem: "menuAcoes"
  },
  {
    titulo: "5- Detalhamento da seção",
    instrucoes: `
          <h3>1 - Seção do planid</h3>
          <h3>2 - Carga horária parcial da seção em tela</h3>
          <h3>3 - Sub-seção fechada com atividades registradas</h3>
          <h3>4 - Sub-seção expandida</h3>
          <h3>5 - Atividade</h3>
          <h3>6 - Ícone "maximizar seção"</h3><p>Clique sobre o ícone "maximizar seção" para expandir uma sub-seção e exibir suas atividades registradas. O ícone "maximizar seção" é exibido apenas quando há registro de atividades na respectiva seção.</p>
          <h3>7 - ícone "minimizar seção"</h3><p>Clique sobre o ícone "minimizar seção" para ocultar as atividades registradas na sub-seção. O ícone "minimizar seção" é exibido apenas quando a respectiva sub-sessão apresenta-se no modo expandido.</p>
          <h3>8 - botão adicionar atividade</h3><p>Clique sobre o botão "adicionar atividade" para adicionar uma nova atividade à sub-seção.</p>
          <h3>9 - ícone "excluir atividade"</h3><p>Clique sobre o ícone "excluir atividade" para excluir a respectiva atividade.</p>
        `,
    imagem: "detalhamentoSecao"
  }
],
animarTutorial = direcao => {
  let fade, dir;
  document.querySelector(`.tutorial-planid__imagem-div`).classList.value = "tutorial-planid__imagem-div";

  switch (direcao) {
    case "fade-out-esquerda":
      fade = "fade-out";
      dir = "esquerda";
      break;
    case "fade-out-direita":
      fade = "fade-out";
      dir = "direita";
      break;
    case "fade-in-esquerda":
      fade = "fade-in";
      dir = "esquerda";
      break;
    case "fade-in-direita":
      fade = "fade-in";
      dir = "direita";
      break;
    default:
      break;
  }
  document.querySelector(`.tutorial-planid__imagem-div`).classList.add(`${fade}-tutorial-${dir}`);
},
tutorialHandler = e => {
  if (
    e.target.classList.contains("tutorial-planid__imagem") ||
    e.target.classList.contains("tutorial-planid__imagem-div__icone-fechar")
  ) {
    const imagemContainer = document.querySelector(`.tutorial-planid__imagem-div`);
    imagemContainer.classList.toggle("tutorial-planid__imagem-div__big");
    document.querySelector(".tutorial-planid__instrucoes").classList.toggle("opacidade-zero");
  } else if (e.target.classList.contains("controle-tutorial-direita")) {
    if (planid.tutorialPaginaAtual < textosTutorial.length - 1) {
      planid.tutorialPaginaAtual++;
      animarTutorial("fade-out-esquerda");
      variaveisGlobais.controlarVisibilidade("ocultar", ".tutorial-planid__instrucoes");
      setTimeout(() => {
        exibirTutorialPreenchimento(e);
        animarTutorial("fade-in-direita");
        variaveisGlobais.controlarVisibilidade("exibir", ".tutorial-planid__instrucoes");
      }, 500);
    }
  } else if (e.target.classList.contains("controle-tutorial-esquerda")) {
    if (planid.tutorialPaginaAtual > 0) {
      planid.tutorialPaginaAtual--;
      animarTutorial("fade-out-direita");
      variaveisGlobais.controlarVisibilidade("ocultar", ".tutorial-planid__instrucoes");
      setTimeout(() => {
        exibirTutorialPreenchimento(e);
        animarTutorial("fade-in-esquerda");
        variaveisGlobais.controlarVisibilidade("exibir", ".tutorial-planid__instrucoes");
      }, 500);
    }
  } else if (
    e.target.classList.contains("tutorial-planid__fechar") ||
    e.target.classList.contains("tutorial-planid__overlay") ||
    e.target.id === "nao-exibir-tutorial"
  ) {
    variaveisGlobais.controlarVisibilidade("ocultar", ".tutorial-planid__overlay", true);
    document.querySelectorAll("body")[0].classList.remove("fixo");
  }

  if (e.target.id === "nao-exibir-tutorial") {
    localStorage.setItem("ocultarTutorialPreenchimentoPlanid", true);
  }
};

const comentariosGerais = (id, semestre, comentarios) => `
  <div class='formulario form-comentarios-gerais__overlay hidden opacidade-zero' >
    <form class='form-comentarios-gerais box-cinza' data-id='${id}'>
      <h2>Comentários gerais sobre o planid ${semestre}</h2>
      <i class='fa fa-times-circle'></i>
      <div>
        <label>
          <p>Comentários gerais:</p>
          <i class='fa fa-info'></i>
          <span class='dica'>Informações complementares e/ou comentários sobre o planid em tela podem ser adicionados preenchendo-se este campo.</span>
        </label>
        <textarea name='comentariosGerais'>${comentarios}</textarea>
      </div>
      <div class='btn-div'>
        <input type='submit' value='salvar comentários'>
      </div>
    </form>
  </div>
`;

let arrayDisciplinas = [];


// FUNÇÕES COMUNS À EDIÇÃO E IMPRESSÃO DO PLANID

const exibirTutorialPreenchimento = e => {
  const ocultarTutorial = localStorage.getItem("ocultarTutorialPreenchimentoPlanid");
  if (e || !ocultarTutorial) {
    document.querySelectorAll("body")[0].classList.add("fixo");
    if (document.querySelector(`.tutorial-planid__overlay`)) {
      document.querySelector(`.tutorial-planid__overlay`).outerHTML = "";
    }
    const tutorial = `
      <div class='tutorial-planid__overlay'>
        <div class='tutorial-planid__janela'>
          <i class='fa fa-times tutorial-planid__fechar'></i>
          <div class='tutorial-planid__titulo'>
            Instruções de Preenchimento
            <span class='tutorial-planid__titulo__instrucoes-etapa'>${
              textosTutorial[planid.tutorialPaginaAtual].titulo
            }</span>
          </div>
          <div class='tutorial-planid__controles-e-imagem'>
            <i class='fa fa-caret-left controle-tutorial controle-tutorial-esquerda ${
              planid.tutorialPaginaAtual === 0 ? "inativo" : ""
            }'></i>
            <div class='tutorial-planid__imagem-div opacidade-zero'>  
              <i class='fa fa-times tutorial-planid__imagem-div__icone-fechar'></i>
              ${
                textosTutorial[planid.tutorialPaginaAtual].imagem
                  ? `<img class='tutorial-planid__imagem' src='/img/planids/${textosTutorial[planid.tutorialPaginaAtual].imagem}.jpg'>`
                  : `<div class='tutorial-planid__imagem texto'>                    
                    ${textosTutorial[planid.tutorialPaginaAtual].texto}
                  </div>`
              }
            </div>
            <i class='fa fa-caret-right controle-tutorial controle-tutorial-direita ${
              planid.tutorialPaginaAtual >= textosTutorial.length - 1 ? "inativo" : ""
            }'></i>
          </div>
          <div class='tutorial-planid__instrucoes__container'>
            <div class='tutorial-planid__instrucoes opacidade-zero'>
              ${textosTutorial[planid.tutorialPaginaAtual].instrucoes}
            </div>
          </div>      
        </div>
        ${
          !ocultarTutorial
            ? `
            <div class='tutorial-planid__nao-exibir'>
              <input type='checkbox' id='nao-exibir-tutorial' name='nao-exibir'>
              <label for='nao-exibir-tutorial'>Não exibir o tutorial novamente neste dispositivo</label>
            </div>`
            : ""
        }
      </div>
    `;
    document.querySelectorAll(`body`)[0].insertAdjacentHTML("beforeend", tutorial);
    variaveisGlobais.controlarVisibilidade("exibir", ".tutorial-planid__imagem-div");
    variaveisGlobais.controlarVisibilidade("exibir", ".tutorial-planid__instrucoes");
    document.querySelector(`.tutorial-planid__overlay`).addEventListener(`click`, tutorialHandler);
    if ((!ocultarTutorial && !e) || e.target.classList.contains("tutorial-planid__exibir-tutorial")) {
      document.querySelector(`.tutorial-planid__janela`).classList.add("anim-janela-tutorial");
    }
  }
};

const imprimirPlanid = (id, unidade, semestre, fecharPlanid) => {
  let win;
  if (id) {
    win = window.open(`/planids/print?_id=${id}&unidade=${unidade}&semestre=${semestre}`, "_blank");
  } else {
    win = window.open(`/planids/print?unidade=${unidade}&semestre=${semestre}`, "_blank");
  }
  win.focus();
  if (fecharPlanid && document.querySelector(`.overlay-novo-planid`)) {
    removerPlanidDOM();
  }
};

const identificarContainer = (elemento, obj) => {
  const containersArr = Object.entries(obj);
  for (let i = 0; i < containersArr.length; i++) {
    for (let j = 0; j < containersArr[i][1].length; i++) {
      if (containersArr[i][1].includes(elemento)) {
        return containersArr[i][0];
      }
    }
  }
};

const computarCargasHorariasParciais = (elemento, CH) => {
  const secao = identificarContainer(identificarContainer(elemento, containers), sections);
  cargasHorariasParciais.total += CH;
  cargasHorariasParciais.parcial[`${secao}`] += CH;
};


// SELECIONAR FONTE DE DADOS PARA IMPRESSÃO E PREENCHIMENTO
const urlParams = new URLSearchParams(window.location.search);
const _id = urlParams.get('_id'); 
const unidade = urlParams.get('unidade'); 
const semestreImpressao = urlParams.get('semestre'); 

const carregarScriptsImpressao = () => {
  switch (semestreImpressao) {
    // adicionar cases quando as rotinas de impressão sofrerem ajustes, para não quebrar a impressão dos planids anteriores
    default:
      loadScript('/dist/scripts/planidsVersions/last_imprimir.min.js');
      break;
  }
};

const carregarScriptPlanid = src => {
  if (!document.querySelector(`script[src="${src}"]`)) {
    loadScript(src);
  } 
};

const selecionarDadosVersao = (sem) => {
  if (semestreImpressao) {
    switch (semestreImpressao) {
      case '2019-2':
        loadScript('/dist/scripts/planidsVersions/pre_2020_1.min.js', carregarScriptsImpressao);
        break;      
        default:
          loadScript('/dist/scripts/planidsVersions/last.min.js', carregarScriptsImpressao);
        break;
    }  
  } else if (sem) {
    // CARREGANDO VERSÃO DO PLANID PARA PREENCHIMENTO
    switch (sem) {
      case '2019-2':
        if (!document.querySelector(`script[src='/dist/scripts/planidsVersions/pre_2020_1.min.js']`)) {
          carregarScriptPlanid('/dist/scripts/planidsVersions/pre_2020_1.min.js');
        }
        break;
      default:
        if (!document.querySelector(`script[src='/dist/scripts/planidsVersions/last.min.js']`)) {
          carregarScriptPlanid('/dist/scripts/planidsVersions/last.min.js');
        }
    }  
  }
};

selecionarDadosVersao();
