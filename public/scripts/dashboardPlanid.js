"use strict";
/////////////////////////////////////////////////////
////////////// CONFIGS MÓDULO DOCENTES //////////////
/////////////////////////////////////////////////////

const registroNovoPlanid = msg => {
  dashboard.user.planids = [
    msg.sucesso,
    ...dashboard.user.planids.filter(pl =>  pl._id.toString() !== msg.sucesso._id),
  ];
};

const cbEnviar = msg => {
  variaveisGlobais.exibirMensagem(
    `<h3>${
      msg.err
        ? msg.err
        : "Plano de atividades enviado à Unidade Acadêmica."
    }</h3>`,
    4000,
    msg.err ? "Erro" : "Sucesso"
  );

  setTimeout(() => {        
    if (msg.sucesso) {
      if (planid.clicouFinalizar) {
        return window.location.reload();
      }
      planid.clicouFecharPlanid = false;
      planid.clicouFinalizar = false;  
      registroNovoPlanid(msg);
      fecharPlanid();
    }    
  }, 4000);
};

const cbEditar = msg => {
  if (!planid.autosaving) {
    variaveisGlobais.exibirMensagem(
      `<h3>${
        msg.err
          ? msg.err
          : 'Planid salvo.<br> Não esqueça de submetê-lo ao finalizar o registro das atividades.'
      }</h3>`,
      msg.err ? 2000 : 3000,
      msg.err ? "Erro" : "Sucesso"
    );    
  } else {
    planid.autosaving = false;
    if (document.querySelector(`.autosave-message`)) {
      setTimeout(() => {
        document.querySelector(`.autosave-message`).outerHTML = '';
      }, 600);
    }
  }    
  if (msg.sucesso) {
    registroNovoPlanid(msg);
    planid.emEdicao = planid.clicouFecharPlanid ? '' : msg.sucesso;
  }
  if (planid.clicouFecharPlanid) {
    rotinasPlanid();
  } else {
    clearInterval(planid.autoSaveInterval);
    planid.autoSaveInterval = setInterval(autoSave, planid.intervaloAutosave);
  }
  planid.clicouFecharPlanid = false;
};

const cbErroSalvamento = msg => {  
  variaveisGlobais.exibirMensagem('<h3>Não foi possível estabelecer conexão com o servidor, por conta de instabilidades da rede. Os dados foram salvos localmente. <a href="/" class="maiores-informacoes-rede">clique aqui</a> para maiores informações sobre como fazer para efetivar o envio dos dados salvos.</h3>');
  document.querySelector(`.maiores-informacoes-rede`).addEventListener('click', e => {
    e.preventDefault();
    variaveisGlobais.exibirMensagem(`
      <p>Se a rede não estiver disponível em seu dispositivo ou em nossos servidores, não será possível concluir o salvamento dos dados do Planid CCS no banco de dados. No entanto, os dados salvos estão seguros na memória deste dispositivo.</p><p>Não recomendamos a utilização de outros dispositivos para o preenchimento do planid, até que os dados registrados localmente sejam salvos no banco de dados, sob o risco de perda de informações.</p><p>Esta janela, bem como o navegador utilizado para o preeenchimento de seu plano de atividades podem ser fechados a qualquer momento. Recomendamos que aguarde alguns instantes e clique, novamente, sobre os botões "salvar" ou "enviar".</p><p>Se, após algumas tentativas de salvamento, a conexão não for reestabelecida, tente atualizar seu navegador. Se, ainda asssim, persistir a mensagem de instabilidade na rede, sugerimos que entre em contato com o suporte do sistema, pelo email <a href='mailto:webdev@ccsdecania.ufrj.br'>webdev@ccsdecania.ufrj.br</a> ou pelo telefone <a href='tel:+552139380986'>3938-0986</a>.</p>
    `);
  });
  planid.semRede = true;
  submeterPlanid();
};

const rotinasNovoPlanid = (semestre) => {
  selecionarDadosVersao(semestre);
  setTimeout(() => {
    novoPlanid('novo')
  }, 300);
};

const montarDivPendencias = pendencias => {
  if (document.querySelector(`.div-pendencias`)) {
    document.querySelector(`.div-pendencias`).outerHTML = "";
  }
  let html = `
    <div class="div-pendencias">
      <div class='div-pendencias__window'>
      
        <div class='div-pendencias__header'>
          <h3>campos não preenchidos:</h3>
        </div>
        <ul>
  `;
  for (let i = 0; i < pendencias.length; i++) {
    html += `<li class='campo-vazio-${pendencias[i].id}' data-campo='${pendencias[i].id}' data-section='${
      pendencias[i].dataset.section
    }' data-subsection='${pendencias[i].dataset.subsection}'>${pendencias[i].name}</li>`;
  }
  html += "</ul></div></div>";
  return html;
};

const submeterPlanid = e => {
  const idPlanid = planid.emEdicao._id;
  let 
    elements,
    pendencias = [];
  if (e) {
    e.preventDefault();
    elements = getFormElements(e, "array");
  } else {
    elements = getFormElements(null, 'array', document.getElementById(`planid-formulario`).elements);
  }
  if (Array.isArray(elements.comentariosGerais)) {
    elements.comentariosGerais = elements.comentariosGerais[0];
  }  
  
  if (planid.semRede) {
    planid.semRede = false;
    elements.dataDeEdicao = new Date().getTime();

    const planidOffline = {
      idPlanid,
      _csrf: dashboard.csrfToken,
      finalizado: planid.clicouFinalizar,
      dados: JSON.stringify(elements)
    };
    clearInterval(planid.autoSaveInterval);
    planid.autosaving = false;
    if (document.querySelector(`.autosave-message`)) {
      document.querySelector(`.autosave-message`).outerHTML = '';
    }
    return localStorage.setItem('planidSalvo', JSON.stringify(planidOffline));    
  }  

  localStorage.removeItem("planidSalvo");

  if (planid.clicouFinalizar) {
    pendencias = validarPlanid(elements);
    if (pendencias === 'disciplina repetida') {
      return variaveisGlobais.exibirMensagem('<h3>Há disciplinas com mesmo código e mesma natureza de participação. Os dados devem ser retificados, antes de submeter seu plano</h3>');
    }

    if (!pendencias.length) {
      const html = `
        <div class='confirmar-submissao-planid'>
          <h3>Confirmar a submissão deste planid?</h3>
          <h3 class='subtitulo'>Certifique-se de ter informado todo o planejamento das atividades para o próximo semestre!</h3>
          <h3 class='subtitulo'>Ao submeter o planid, você concorda com as seguintes condições:</h3>
          <div class='condicoes-preenchimento-planid'>
            <h3 class='condicoes-preenchimento-planid__condicao'>&bull; Fornecer informações verdadeiras e exatas.</h3>
            <h3 class='condicoes-preenchimento-planid__condicao'>&bull; Aceitar que o usuário é o único responsável por toda e qualquer informação registrada em seu PLANID, estando sujeito às conseqüências, administrativas e legais, decorrentes de declarações falsas ou inexatas que vierem a causar prejuízos ao CCS, à UFRJ, à Administração Pública em geral ou a terceiros.</h3>
          </div>
          <div class='btn-div'>
            <button class='btn-acao-cancelar'>Retornar</button>
            <button class='btn-acao-confirmar'>Confirmar</button>
          </div>
        </div>
      `;
      variaveisGlobais.exibirMensagem(html, null, "Confirmar submissão");
      document.querySelector(`.confirmar-submissao-planid`).addEventListener("click", e => {
        if (e.target.classList.contains("btn-acao-cancelar")) {
          variaveisGlobais.controlarVisibilidade("ocultar", "#mensagens-genericas");
          planid.clicouFinalizar = false;
        } else if (e.target.classList.contains("btn-acao-confirmar")) {
          operacaoDB();
          variaveisGlobais.ajax(
            "/users/planid/salvar",
            "POST",
            {
              idPlanid,
              _csrf: dashboard.csrfToken,
              finalizado: planid.clicouFinalizar,
              dados: JSON.stringify(elements)
            },
            cbEnviar,
            cbErroSalvamento
          );
        }
      });
    } else {
      const divPendencias = montarDivPendencias(pendencias);
      document.querySelector(`.overlay-novo-planid`).insertAdjacentHTML("beforeend", divPendencias);
      document.querySelector(`.div-pendencias`).addEventListener("click", apontarInputVazio);
      document.querySelector(`.alerta-nao-preenchidos`).classList.add("active");
      cbEnviar({
        err:
          "Todos os campos do planid devem ser preenchidos com dados válidos, antes de enviá-lo. Favor preencher ou remover os campos indicados."
      });
    }
  } else {
    if (!planid.autosaving) {
      operacaoDB();
    }
    variaveisGlobais.ajax(
      "/users/planid/salvar",
      "POST",
      { idPlanid, _csrf: dashboard.csrfToken, finalizado: planid.clicouFinalizar, dados: JSON.stringify(elements) },
      cbEditar,
      cbErroSalvamento,
    );
  }
};

const exibirPlanidAposConexao = () => {
  variaveisGlobais.exibirMensagem(`
    <h3>Conexão Restabelecida! Clique em 'OK' para reiniciar o navegador e continuar o preenchimento de seu planid</h3>
    <div class='btn-div'>
      <button class='btn-reiniciar-navegador'>OK</button>
    </div>
  `)
  document.getElementById(`mensagens-genericas`).addEventListener(`click`, () => window.location.reload());
};

const planidsClickHandler = e => {  
  if (!window.navigator.onLine) {
    variaveisGlobais.exibirMensagem(`<h3>Sem acesso à internet. Avisaremos quando a conexão for restabelecida.</h3>`);
    return window.addEventListener('online', exibirPlanidAposConexao);
  }
  let semestreDoPlanid;





  if (e.target.dataset.id) {
    const planidSelecionado = dashboard.user.planids.find(planid => planid._id === e.target.dataset.id);
    semestreDoPlanid = planidSelecionado.semestre;
    const prazoEncerrado = `<h3>Prazo de preenchimento do planid ${semestreDoPlanid} encerrado.</h3>`;

    if (planidSelecionado.enviado && semestreDoPlanid < semestre) {
      return variaveisGlobais.exibirMensagem(prazoEncerrado)
    }

    if (habilitarPreenchimentoPlanid) {   
      selecionarDadosVersao(semestreDoPlanid);
      setTimeout(() => {
        editarPlanid(e.target.dataset.id);
      }, 150);
      planid.autoSaveInterval = setInterval(autoSave, planid.intervaloAutosave);
    } else {
      return variaveisGlobais.exibirMensagem(new Date() < inicioPreenchimentoPlanid ? `<h3>O planid ${semestreDoPlanid} poderá ser preenchido a partir de ${moment(inicioPreenchimentoPlanid).format('DD [de] MMMM [de] YYYY')}.</h3>` : prazoEncerrado);
    }
  } else if (e.target.dataset.planid) {
    if (!window.navigator.onLine) {
      return variaveisGlobais.exibirMensagem('<h3>Sem acesso à internet. Para registrar comentários, abra o planid desejado e clique no ícone "Comentários Gerais", localizado no menu de ações.</h3>');
    }
    const thisPlanid = dashboard.user.planids.find(planid => planid._id === e.target.dataset.planid);
    semestreDoPlanid = thisPlanid.semestre;
    // TODO: estudar manter as alterações abaixo: para permitir comentárioe mensagens, basta que o preenchimento esteja habilitado, mesmo que o planid já tenha sido enviado.
    if ((habilitarPreenchimentoPlanid /* && semestreDoPlanid >= semestre */) /* || !thisPlanid.enviado */) {
      for (let i = 0; i < dashboard.user.planids.length; i++) {
        if (dashboard.user.planids[i]._id.toString() === e.target.dataset.planid) {
          const plSelecionado = dashboard.user.planids[i];
          comentariosGeraisHandler(plSelecionado._id, plSelecionado.semestre, plSelecionado.comentariosGerais);
          break;
        }
      }
    } else {
      return variaveisGlobais.exibirMensagem(`<h3>O prazo para edição dos comentários gerais deste planid já está encerrado</h3>`);
    }
  } else if (e.target.dataset.imprimir) {
    imprimirPlanid(e.target.dataset.imprimir, planid.unidadePreenchimentoPlanid, e.target.dataset.semestre, true);
  } else if (e.target.classList.contains('botao-novo-planid')) {
    let message;
    if (prazoNovoPlanid && !todosPlanidsEnviados()) {
      message = "<h3>Não é possível iniciar o preenchimento de um novo planid sem o envio de todos os planos anteriores</h3>";
    } else if (!prazoNovoPlanid) {
     message = "<h3>O prazo para o preenchimento de um novo planid está encerrado</h3>";
    } else {
      message = "<h3>Todos os seus planids foram enviados! Aguarde a divulgação do período para preenchimento de um novo planid.</h3>";      
    }
    planid.habilitarNovoPlanid ? rotinasNovoPlanid(semestre) : variaveisGlobais.exibirMensagem(message);
  }
};

const editarPlanid = (planidId, planidImportado) => {
  let plSelecionado;
  if (planidId) {
    plSelecionado = dashboard.user.planids.find(planid => planid._id === planidId);
    // TODO: habilitar o condicional se a gestão decidir bloquear a edição após o envio
    //if (!plSelecionado.enviado) {
      
    //}
  } else if (planidImportado) {
    plSelecionado = planidImportado;
  }
  planid.emEdicao = plSelecionado;
  novoPlanid('edicao');
  preencherPlanid(plSelecionado);
  fecharContainersAtividades();
};

const iconeNaoPreenchidosHandler = () => {
  if (document.querySelector(`.div-pendencias.oculto`)) {
    document.querySelector(`.div-pendencias`).classList.remove("oculto");
  } else {
    document.querySelector(`.div-pendencias`).classList.add("oculto");
  }
};

const controlarExibicaoPendencias = () => {
  const divPendencias = document.querySelector(`.div-pendencias`);
  const allItems = divPendencias.querySelectorAll("li");
  if (!allItems.length) {
    divPendencias.outerHTML = "";
    document.querySelector(`.alerta-nao-preenchidos`).classList.remove("active");
  } else {
    let temInputVazioNestaPagina;
    for (let i = 0; i < allItems.length; i++) {
      if (+allItems[i].dataset.section === planid.pagina) {        
        temInputVazioNestaPagina = true;
        break;
      }
    }
    if (!temInputVazioNestaPagina) {
      document.querySelector(`.div-pendencias`).classList.remove("oculto");
    }
  }
};

const apontarInputVazio = e => {
  if (e.target.dataset.section) {
    document.querySelector(`.div-pendencias`).classList.add("oculto");
    const campoVazio = e.target;
    const subSection = document.querySelector(`.${campoVazio.dataset.subsection}`);
    if (subSection.classList.contains("fechado")) {
      subSection.classList.remove("fechado");
    }
    if (planid.pagina !== Number(campoVazio.dataset.section)) {
      variaveisGlobais.controlarVisibilidade("ocultar", `.section-${planid.pagina}`);
      planid.pagina = Number(campoVazio.dataset.section);
      navegacaoPlanid(false, true);
    }

    setTimeout(() => {
      variaveisGlobais.scrollTo(subSection, 0, null, ".janela");
      subSection.scrollTop = 0;
    }, 500);
    setTimeout(() => {
      variaveisGlobais.scrollTo(
        document.getElementById(campoVazio.dataset.campo),
        -80,
        null,
        `.${campoVazio.dataset.subsection}`
      );
    }, 1000);
  }
};

const disciplinasDuplicadas = () => {
  const codigo = document.querySelectorAll(`input[name=disciplinaCodigo]`);
  const participacao = document.querySelectorAll(`select[name=disciplinaParticipacao]`);
  const disciplinas = {};
  for (let i = 0; i < codigo.length; i++) {
    if (disciplinas[`${codigo[i].value}${participacao[i].value}`]) {
      return true;
    } else {
      disciplinas[`${codigo[i].value}${participacao[i].value}`] = true
    }
  }
  return false;
};

//validação ao enviar o planid. Retorna falso se há campos não preenchidos e marca o primeiro campo vazio encontrado
const validarPlanid = elements => {
  if (disciplinasDuplicadas()) {    
    return 'disciplina repetida';
  }
  let pendencias = [];
  const elArray = Object.entries(elements);
  for (let i = 0; i < elArray.length; i++) {
    let element = elArray[i][0];
    let values = elArray[i][1];
    for (let j = 0; j < values.length; j++) {
      const camposOptativos =
        element === "atividadesComplementaresEnsinoDescricao" ||
        element === "atividadesComplementaresPesquisaDescricao" ||
        element === "atividadesCoopIntDescricao" ||
        element === 'comentariosGerais';
      const numeroNegativo = !isNaN(+values[j]) && values[j] < 0;
      if ((!values[j] || values[j] === "Selecione uma opção:" || numeroNegativo) && !camposOptativos) {
        const campoVazio = document.querySelectorAll(`[name=${element}]`)[j];
        campoVazio.classList.add("campo-vazio");
        pendencias.push(document.querySelectorAll(`[name=${elArray[i][0]}]`)[j]);
      }
    }
  }
  return pendencias;
};

//validação local, em tempo real
const checarCampoVazio = e => {  
  const atribuirClasse = campoSelecionado => {
    if (campoSelecionado.required && !campoSelecionado.value) {
      campoSelecionado.classList.add("campo-vazio");
    } else if (campoSelecionado.value) {
      campoSelecionado.classList.remove("campo-vazio");
      if (document.querySelector(`.campo-vazio-${campoSelecionado.id}`)) {
        document.querySelector(`.campo-vazio-${campoSelecionado.id}`).outerHTML = "";
        controlarExibicaoPendencias();
      }
    }
  };
  if (e.keyCode && e.keyCode === 9) {
    atribuirClasse(planid.campoSelecionado);
    if (document.activeElement.type) {
      planid.campoSelecionado = document.activeElement;
    }
  } else if (!e.keyCode) {
    atribuirClasse(planid.campoSelecionado);
    if (e.target.type) {
      planid.campoSelecionado = e.target;
    }
  }
};

// O argumento validação é variável booleana que indica que a função navegacaoPlanid foi chamada do módulo de validação do planid (função validarPlanid). Neste caso,
const navegacaoPlanid = (e, validacao) => {
  let classeRetornar, textoBotaoAvancar, avancarInativo;
  const controles = acao => {
    variaveisGlobais.controlarVisibilidade("ocultar", `.section-${planid.pagina}`);
    // ações para cliques no div de controle
    if (acao === "retornar") {
      planid.pagina--;
    } else if (acao && planid.pagina < planid.totalPaginas) {
      planid.pagina++;
    } else if (acao) {      
      planid.clicouFinalizar = true;
      // TODO: habilitar o condicional caso a gestão decida implementar a homologação de planids
      // if (!planid.emEdicao.homologado) {
        document.getElementById(`submit-planid`).click();
      // }
    }

    // editando as classes dos steps
    document.querySelector(`.form-steps__step.selected`).classList.remove("selected");
    document.querySelector(`.step-section-${planid.pagina}`).classList.add("selected");

    // definindo os textos do div de controle
    // TODO: reabilitar o condicional se a gestão determinar o bloqueio para edição após o envio
    if (planid.pagina === planid.totalPaginas /* && planid.emEdicao.enviado */) {
      avancarInativo = "inativo";
      textoBotaoAvancar = "avançar";
    } else {
      avancarInativo = "";
      textoBotaoAvancar = planid.pagina < planid.totalPaginas ? "avançar" : "enviar";
    }
    classeRetornar = planid.pagina === 1 ? "inativo" : "";
    setTimeout(() => {
      variaveisGlobais.controlarVisibilidade("exibir", `.section-${planid.pagina}`);
    }, 500);
  };

  //navegação pelos botões
  if (e && e.target.classList.contains("btn-navegacao-planid")) {
    variaveisGlobais.scrollTo(".planid-formulario-header", 0, null, ".overlay-novo-planid .janela");
    if (e.target.classList.contains("btn-retornar") && planid.pagina > 0) {
      controles("retornar");
    } else if (e.target.classList.contains("btn-avancar") && planid.pagina <= planid.totalPaginas) {
      controles("avancar");
    }
  }

  // navegação pelos steps
  if (validacao || e.target.dataset.section) {
    controles();
  }

  //renderizando o div de controle
  if (!e || e.target.classList.contains("btn-navegacao-planid") || e.target.dataset.section) {
    document.querySelector(`.div-navegacao-planid`).innerHTML = `
      <div class=' btn-navegacao-planid btn-retornar ${classeRetornar} oscilador-esquerda filhos-inativos'><i class='fa fa-caret-left ${classeRetornar}'></i> retornar</div>
      <div class=' btn-navegacao-planid btn-avancar oscilador-direita filhos-inativos ${avancarInativo}'>${textoBotaoAvancar} <i class='fa fa-caret-right'></i></div>
    `;
  }
};

const stepsHandler = e => {
  if (e.target.dataset.section) {
    const newPage = Number(e.target.dataset.section);
    if (planid.pagina !== newPage) {
      variaveisGlobais.controlarVisibilidade("ocultar", `.section-${planid.pagina}`);
      planid.pagina = newPage;
      navegacaoPlanid(e);
    }
  }
};

const deveSalvarPlanidAoFechar = () => {
  if (!localStorage.getItem("planidSalvo")) {
    variaveisGlobais.exibirMensagem(`
      <h3>Deseja salvar o planid antes de fechá-lo?</h3>
      <div class='button-div mensagem-fechar-planid'>
        <button class='salvar-sim'>SIM</button>
        <button class='salvar-nao'>NÃO</button>
      </div>
    `);
    document.querySelector(`.mensagem-fechar-planid`).addEventListener('click', e => {
      if (e.target.classList.contains('salvar-sim')) {
        fecharPlanid(true);
      } else {
        fecharPlanid();
        variaveisGlobais.controlarVisibilidade('ocultar', '#mensagens-genericas');
      }
    });
  } else {
    fecharPlanid();
  }
};

const fecharPlanid = deveSalvar => {
  if (deveSalvar) {
    planid.clicouFecharPlanid = true; 
    document.getElementById(`submit-planid`).click();
  }
  //if (window.navigator.onLine) {
    variaveisGlobais.controlarVisibilidade("ocultar", ".overlay-novo-planid", true);
    document.querySelectorAll(`body`)[0].classList.remove("fixo");      
  //}
  clearInterval(planid.autoSaveInterval);
  planid.pagina = 1;
  planid.emEdicao = "";  
  rotinasPlanid();
  if (planid.enviouPlano) {
    planid.enviouPlano = false;
  }
};

const salvarComentariosGerais = e => {
  e.preventDefault();
  const sucesso = () => {
    variaveisGlobais.exibirMensagem(`<h3>comentários salvos</h3>`, 1000, "Sucesso!"); 
    setTimeout(() => {
      return variaveisGlobais.controlarVisibilidade('ocultar', '.form-comentarios-gerais__overlay');
    }, 1000);
  };

  const cbErro = msg => {
    planid.semRede = true;
    document.getElementById(`submit-planid`).click();    
    variaveisGlobais.exibirMensagem(`<h3>Sem acesso à internet. Os comentários foram salvos localmente.</h3>`, 2500, "Erro..."); 
    setTimeout(() => {
      return variaveisGlobais.controlarVisibilidade('ocultar', '.form-comentarios-gerais__overlay');
    }, 1000);
  };

  if (!dashboard.user.planids.length) {    
    document.querySelector(`#planid-formulario input[name=comentariosGerais]`).value = e.target.elements.comentariosGerais.value;
    sucesso();
  }

  if (planid.emEdicao) {
    // salvamento de comentários realizado da interface do planid aberto
    planid.emEdicao.comentariosGerais = e.target.elements.comentariosGerais.value;
    document.querySelector(`#planid-formulario input[name=comentariosGerais]`).value = e.target.elements.comentariosGerais.value;
    window.navigator.onLine ? sucesso() : cbErro();
  } else {
    if (!window.navigator.onLine) {
      return variaveisGlobais.exibirMensagem('<h3>Sem acesso à internet. Para registrar comentários, abra o planid desejado e clique no ícone "Comentários Gerais", localizado no menu de ações.</h3>');
    }
    const planids = dashboard.user.planids;
    for (let i = 0; i < planids.length; i++) {
      if (planids[i]._id === e.target.dataset.id) {
        planids[i].comentariosGerais = e.target.elements.comentariosGerais.value;
        variaveisGlobais.ajax(
          "/planids/editar-planid",
          "POST",
          { 
            _csrf: dashboard.csrfToken,              
            data: JSON.stringify({_id: e.target.dataset.id, comentariosGerais: e.target.elements.comentariosGerais.value}),
          },
          sucesso,
          cbErro
        );
        operacaoDB();
        break;
      }
    }
  } 
};

const comentariosGeraisHandler = (id, semestre, comentario) => {
  // exibindo o handler
  document.querySelector(`body`).insertAdjacentHTML("beforeend", comentariosGerais(id, semestre, comentario || ''));
  variaveisGlobais.controlarVisibilidade("exibir", ".form-comentarios-gerais__overlay");

  // ocultando o handler
  document.querySelector(`.form-comentarios-gerais .fa-times-circle`).addEventListener("click", () => {
    variaveisGlobais.controlarVisibilidade("ocultar", ".form-comentarios-gerais__overlay");
    setTimeout(() => {
      document.querySelector(`.form-comentarios-gerais__overlay`).outerHTML = "";
    }, 500);
  });
  document.querySelector(`.form-comentarios-gerais`).addEventListener("submit", salvarComentariosGerais);
};

const rotinasBtnAdicionar = e => {
  if (e.target.parentElement.classList.contains("fechado")) {   
    e.target.parentElement.classList.remove("fechado");
    e.target.parentElement.classList.remove("vazio");
  }
  if (!e.target.parentElement.querySelector(".icone-abertura-container-atividade")) {   
    e.target.previousElementSibling.insertAdjacentHTML("afterbegin", caret);
  }
};

const fecharContainersAtividades = () => {
  const atividades = document.querySelectorAll(`.subsection-container`);
  for (let i = 0; i < atividades.length; i++) {
    atividades[i].classList.add("fechado");
    if (!atividades[i].querySelector('.box-cinza')) {
      atividades[i].classList.add('vazio');
    }
    atividades[i].scrollTop = 0;
  }
};

const rolarDivAtividades = e => {
  setTimeout(() => {
    const scrollAmount = e.target.parentElement.offsetTop + 100;
    $(".overlay-novo-planid .janela").animate({ scrollTop: scrollAmount }, "slow");
  }, 700);
};

const aberturaContainerAtividadesHandler = e => {
  if (e.target.parentElement.classList.contains("fechado")) {
    fecharContainersAtividades();
  }
  if (e.target.parentElement.querySelectorAll('.box-cinza').length) {
    e.target.parentElement.classList.toggle("fechado");
    e.target.parentElement.scrollTop = 0;
    rolarDivAtividades(e);
  }
};

const generalClickHandler = e => {
  if (e.target.classList.contains("fa-times-circle")) {
    calcularCargaHorariaParcial(e);
    setTimeout(() => {
      calcularCargaHorariaTotal();
    }, 600);
    if (e.target.parentElement.parentElement.parentElement.querySelectorAll(".box-cinza").length === 1) {
      e.target.parentElement.parentElement.parentElement.querySelector(
        `.icone-abertura-container-atividade`
      ).outerHTML = "";
      e.target.parentElement.parentElement.parentElement.classList.add("fechado");
    }
  } else if (e.target.classList.contains('abrir-menu-acoes')) {
    e.target.classList.toggle('fa-bars');
    e.target.classList.toggle('fa-times');
    document.querySelector(`.btn-submit-planid-div`).classList.toggle('aberto');

  } else if (e.target.classList.contains("comentarios-gerais")) {
    comentariosGeraisHandler(planid.emEdicao._id, planid.emEdicao.semestre, planid.emEdicao.comentariosGerais);
  } else if (e.target.classList.contains("btn-acao")) {
    rotinasBtnAdicionar(e);
  } else if (e.target.classList.contains("subsection-header")) {
    aberturaContainerAtividadesHandler(e);
  } else if (e.target.classList.contains('wrapper-imprimir-planid-btn')) {
    // ANTES DE IMPRIMIR, SALVAR OS DADOS PARA REGISTRAR TODAS AS MODIFICAÇÕES ATÉ O MOMENTO 
    document.getElementById(`submit-planid`).click();
    setTimeout(() => {
      const planidId = e.target.dataset.imprimir || planid.emEdicao._id;
      imprimirPlanid(planidId, planid.unidadePreenchimentoPlanid, e.target.dataset.semestre);      
    }, 500);
  } else if (e.target.classList.contains("icon-enviar-planid")) {
    planid.clicouFinalizar = true;
    document.getElementById(`submit-planid`).click();
  } else if (e.target.dataset.dica) {
    variaveisGlobais.exibirMensagem(
      `<div class='texto-janela-dica'>${dicas[`${e.target.dataset.dica}_geral`]}<div>`,
      null,
      "orientações"
    );
    document.getElementById(`mensagens-genericas`).addEventListener("click", () => {
      variaveisGlobais.controlarVisibilidade("ocultar", "#mensagens-genericas", true);
    });
  }
};

const selecionarSecoesParaImportacao = thisPlanid => {
  const opcoes = [];
  const containersArr = Object.entries(containers);
  for (let i = 0; i < containersArr.length; i++) {    
    for (let j = 0; j < containersArr[i][1].length; j++) {   
      if (!opcoes.includes(containersArr[i][0]) && thisPlanid[containersArr[i][1][j]].length)  {
        opcoes.push(containersArr[i][0]);
      } 
    }    
  }
  return opcoes;
};

const listenerListasubsecoesImportarPlanid = (e, planidParaImportar )=> {
  e.preventDefault(); 
  const subsecoesParaImportar = variaveisGlobais.getCheckedOrSelected(e.target.elements, 'checkbox');   
  const novoPlanid = {};
  const containersArr = Object.values(containers);
  for (let i = 0; i < containersArr.length; i++) {     
    for (let j = 0; j < containersArr[i].length; j++) {
      novoPlanid[containersArr[i][j]] = [];
    }      
  }
  const sem = planid.ultimoRegistrado.semestre.split('-')[1] === '2' ? '1' : '2';
  const ano = planid.ultimoRegistrado.semestre.split('-')[1] === '2' ? +planid.ultimoRegistrado.semestre.split('-')[0] + 1 : planid.ultimoRegistrado.semestre.split('-')[0];    
  novoPlanid.semestre = `${ano}-${sem}`;  
  for (let i = 0; i < subsecoesParaImportar.length; i++) {
    const subsecao = subsecoesParaImportar[i];
    for (let j = 0; j < containers[subsecao].length; j++) {
      novoPlanid[containers[subsecao][j]] = planidParaImportar[containers[subsecao][j]]
    }      
  }
  editarPlanid(null, novoPlanid);
  return variaveisGlobais.controlarVisibilidade('ocultar', '#mensagens-genericas');
};

const controleMarcacaoSubsecoes = e => {
  const inputs = document.querySelectorAll(`#mensagens-genericas input[type=checkbox]`);
  for (let i = 0; i < inputs.length; i++) {
    e.target.classList.contains('marcar-tudo') ? inputs[i].checked = true : inputs[i].checked = false;
  }
};

const opcoesParaImportacaoDOM = (opcoes, planidParaImportar) => {
  let html = '';
  for (let i = 0; i < opcoes.length; i++) {

    html += `
      <div>
        <input type="checkbox" name="${opcoes[i]}" id="${opcoes[i]}" value="${opcoes[i]}" checked>
        <label for="${opcoes[i]}"><span></span>${nomesAmigaveis[opcoes[i]]}</label>        
      </div>
    `;
  }
  const lista = `
    <div class='planids-importacao__marcar-div'>
      <span class='marcar-tudo'>marcar todas</span>
      <span class='desmarcar-tudo'>desmarcar todas</span>
    </div>
    <form class='planids-importacao__form formulario'>
      <div>
        ${html}
      </div>      
      <div>
        <button>Importar subseções</button>
      </div>
    </form>
  `;
  variaveisGlobais.exibirMensagem(lista);
  document.getElementById(`mensagens-genericas`).addEventListener(`submit`, e => listenerListasubsecoesImportarPlanid(e, planidParaImportar));
  document.querySelector(`.planids-importacao__marcar-div`).addEventListener(`click`, controleMarcacaoSubsecoes);
}

const importarPlanidHandler = e => {  
  if (e.target.classList.contains('sim')) {
    const opcoesParaImportar = selecionarSecoesParaImportacao(planid.ultimoRegistrado);
    opcoesParaImportacaoDOM(opcoesParaImportar, JSON.parse(JSON.stringify(planid.ultimoRegistrado)));    
  } else if (e.target.classList.contains('nao')) {
    novoPlanid('edicao');    
    variaveisGlobais.controlarVisibilidade('ocultar', '#mensagens-genericas');
  }
};

const novoPlanid = tipo => {
  if (tipo === 'novo' && planid.ultimoRegistrado) {
    variaveisGlobais.exibirMensagem(`
      <h3>Deseja importar os dados do planid ${planid.ultimoRegistrado.semestre}?</h3>
      <div class='button-div'>
        <button class='btn-base sim'>Sim</button>
        <button class='btn-base nao'>Não</button>
      </div>
    `);
    document.getElementById(`mensagens-genericas`).addEventListener('click', importarPlanidHandler);
  } else if (tipo === 'edicao' || !planid.ultimoRegistrado) {
    document
      .querySelector(`body`)
      .insertAdjacentHTML("beforeend", relatorioBase(dashboard.csrfToken, dashboard.user._id));
    document.querySelector(`.overlay-novo-planid`).insertAdjacentHTML("beforeend", divNavegacaoPlanid);
    variaveisGlobais.controlarVisibilidade("exibir", ".overlay-novo-planid");
    document.querySelectorAll(`body`)[0].classList.add("fixo");
  
    //setando o total de páginas do Planid
    planid.totalPaginas = document.querySelectorAll(`.section-planid`).length;
  
    //listener para o envio do planid
    document.getElementById(`planid-formulario`).addEventListener(`submit`, submeterPlanid);
  
    //adicionando listeners
    listenersPlanid();
    
  }
};

const preventSubmitHandler = e => {
  if (e.keyCode === 13) {
    e.preventDefault();    
  }
};

const listenersPlanid = () => {
  //listeners gerais do planid
  document.querySelector(`.div-navegacao-planid`).addEventListener(`click`, navegacaoPlanid);
  document.querySelector(`.button-fechar`).addEventListener(`click`, deveSalvarPlanidAoFechar);
  document.getElementById(`planid-formulario`).addEventListener("click", checarCampoVazio);
  document.getElementById(`planid-formulario`).addEventListener("keyup", checarCampoVazio);
  document.getElementById(`planid-formulario`).addEventListener("keypress", preventSubmitHandler);
  document.getElementById(`planid-formulario`).addEventListener("click", generalClickHandler);
  document.getElementById(`planid-formulario`).addEventListener("change", e => calcularCargaHorariaTotal(e));
  document.getElementById(`planid-formulario`).addEventListener("change", e => calcularCargaHorariaParcial(e));
  document.querySelector(`.form-steps`).addEventListener("click", stepsHandler);
  document.querySelector(`.alerta-nao-preenchidos`).addEventListener("click", iconeNaoPreenchidosHandler);

  //listeners preenchimento do Planid
  listenersBotoesFormulario();
};

const recuperarDadosPlanidOffline = (planidSalvo, thisPlanid) => {
  const planidSalvoObj = JSON.parse(JSON.parse(planidSalvo).dados);
  planidSalvoObj._id = JSON.parse(planidSalvo).idPlanid;
  planidSalvoObj.autor = planidSalvoObj.autor[0];
  planidSalvoObj.semestre = planidSalvoObj.semestre[0];
  planidSalvoObj.comentariosGerais = planidSalvoObj.comentariosGerais[0];
  thisPlanid = planidSalvoObj;
  selecionarDadosVersao(thisPlanid.semestre);
  setTimeout(() => {
    for (let j = 0; j < dashboard.user.planids.length; j++) {
      if (dashboard.user.planids[j]._id === thisPlanid._id) {
        dashboard.user.planids[j] = {...gerarPlanidEmBranco(), ...thisPlanid};
        break;
      }
    }    
  }, 500);
};

const selecionarFonteDados = (e, planidSalvo, thisPlanid, maisRecente) => {
  if (e.target.dataset.value) {
    if (e.target.dataset.value === 'local') {
      recuperarDadosPlanidOffline(planidSalvo, thisPlanid);
      
    } 
  } else if (e.target.classList.contains('icone-fechar-janela')) {
    if (maisRecente === 'local') {
      recuperarDadosPlanidOffline(planidSalvo, thisPlanid);
    }
  }
  variaveisGlobais.controlarVisibilidade('ocultar', '#mensagens-genericas');
};

const gerarListaPlanids = () => {
  let html = "";
  const planidSalvo = localStorage.getItem('planidSalvo');
  if (dashboard.user.planids.length || planidSalvo) {
    html = `    
    <div class='objetos-registrados'>
      <h3>Planids registrados:</h3>
      <div class='objetos-registrados__container'>
    `;
    for (let i = 0; i < dashboard.user.planids.length; i++) {
      const isUltimoRegistrado = planid.ultimoRegistrado._id === dashboard.user.planids[i]._id;
      let thisPlanid = dashboard.user.planids[i];
      if (!planid.exibiuAlertaDadosOffline && planidSalvo && JSON.parse(planidSalvo).idPlanid === thisPlanid._id) {
        // confrontando a data de edição do planid offline e do planid carregado do banco de dados        
        const dataPlanidBD = thisPlanid.dataDeEdicao;
        const planidLocal = JSON.parse(JSON.parse(localStorage.getItem("planidSalvo")).dados);
        const dataPlanidLocal = planidLocal.dataDeEdicao;
        let msg = `<h3>Detectamos que há dados salvos do planid ${planidLocal.semestre} neste dispositivo. `;
        if (dataPlanidBD > dataPlanidLocal) {
          msg += "Os dados salvos no servidor, no entanto, são mais atuais. ";          
        } else {
          msg += 'Os dados do dispositivo são mais atuais em relação àqueles salvos no servidor. ';          
        }

        msg += `
          Assim, deseja recuperar os dados de qual fonte?</h3>
          <div class='button-div'>
            <button data-value='local'>Dispositivo</button>
            <button data-value='server'>Servidor</button>
          </div>          
          <h3>Se optar por fechar esta janela, os dados mais recentes serão carregados. Em caso de dúvidas, entre em contato com a <a target="_blank" href='/fale-conosco?form=reportar-problema'>Assessoria de Desenvovimento Web da Decania do CCS</a></h3>
        `;

        const maisRecente = dataPlanidBD > dataPlanidLocal ? 'server' : 'local';
        variaveisGlobais.exibirMensagem(msg);        
        document.querySelector(`#mensagens-genericas`).addEventListener('click', e => selecionarFonteDados(e, planidSalvo, thisPlanid, maisRecente));     
        planid.exibiuAlertaDadosOffline = true;     
      }

      let icon,
        title;
      if (!thisPlanid.enviado) {
        icon = `fa-pencil`;
        title = "planid em preenchimento";
      } else {
        icon = `fa-check`;
        title = "planid enviado";
      }
      
      const comentariosGerais = isUltimoRegistrado
        ? `
          <i class='fa fa-commenting-o icone-exibir-comentarios icone-acoes-planid' data-planid='${thisPlanid._id}' title='comentários gerais sobre o planid ${thisPlanid.semestre}'></i>
          <a href='/acompanhar-eventos/planid/${thisPlanid.autor}/${thisPlanid._id}' target='_blank' rel='noopener' rel='noreferrer'><i class='fa fa-envelope icone-exibir-mensagens icone-acoes-planid' title='eventos e mensagens do planid ${thisPlanid.semestre}'></i></a>
        `
        : "";
      html += `
        <div class='objetos-registrados__objeto-registrado'>
          <i title="${title}" class='fa fa-fw ${icon} objetos-registrados__icon' ${!thisPlanid.enviado ? `data-id="${thisPlanid._id}"` : ''}></i>
          <span class='${isUltimoRegistrado ? "objetos-registrados__link" : ""}' data-id='${isUltimoRegistrado ? thisPlanid._id : ''}' title='${isUltimoRegistrado ? "editar o" : ""} planid ${thisPlanid.semestre}'>Planid ${thisPlanid.semestre}</span>
          <div class='icone-acoes-planid-div'>
            ${comentariosGerais}
            <i class='fa fa-print icone-imprimir-planid icone-acoes-planid' data-imprimir='${
              thisPlanid._id
            }' data-semestre='${thisPlanid.semestre}' title='imprimir o planid ${thisPlanid.semestre}'></i>
          </div>
        </div>
      `;
    }

    html += `</div>
      ${adicionarObjBtn("adicionar plano", "botao-novo-planid")}
      </div>
    `;
  }
  
  const noPlanids = `
    <h3 class='centralizado sem-relatorios text-shadow-inset'>
      Não há registros de Planos. Para iniciar o preenchimento, clique em "adicionar plano"
    </h3>
    ${adicionarObjBtn("adicionar plano", "botao-novo-planid-primeiro")}
  `;
  const prazoEncerrado = `
    <h3 class='centralizado sem-relatorios text-shadow-inset'>
      Está encerrado o prazo para o preenchimento de novos planids. Por gentileza, retorne quando a Decania do CCS anunciar novo período.
    </h3>
  `;
  return dashboard.user.planids.length ? html : planid.habilitarNovoPlanid ? noPlanids : prazoEncerrado;
};

const gestaoPlanid = () => {
  let relatorios;
  relatorios = '<h2 class="dashboard-section__titulo-secao">Plano Individual Docente Semestral</h2>';
  relatorios += gerarListaPlanids();
  return relatorios;
};

const todosPlanidsEnviados = () => {
  let allSent = true;
  for (let i = 0; i < dashboard.user.planids.length; i++) {
    if (!dashboard.user.planids[i].enviado) {
      allSent = false;
    }
  }
  return allSent;
};

const inicializarVariaveis = () => {  
  if (dashboard.user.planids.length) {
    planid.ultimoRegistrado = dashboard.user.planids[0];
    planid.habilitarNovoPlanid =
      todosPlanidsEnviados() && !dashboard.user.planids.find(planid => planid.semestre === proximoSemestre) && prazoNovoPlanid;
  } else {
    planid.habilitarNovoPlanid = prazoNovoPlanid;
  }
  planid.unidadePreenchimentoPlanid = dashboard.user[dashboard.user.unidadePreenchimentoPlanid];  
};

const formarArrayDisciplinas = arrDisc => {
  const arr = [];
  for (let i = 0; i < arrDisc.length; i++) {
    arr.push(`${arrDisc[i].nome} -- ${arrDisc[i].codigo} -- ${arrDisc[i].nivel}`);
  }
  return arr;
};

const deveExibirTutorial = () => {
  variaveisGlobais.exibirMensagem(`
    <h3>Deseja exibir o guia rápido de preenchimento do Planid CCS?</h3>
    <div class='button-div'>
      <button class='sim'>Sim</button>
      <button class='nao'>Não</button>      
    </div>
  `);

  document.getElementById(`mensagens-genericas`).addEventListener(`click`, e => {
    if (e.target.classList.contains('sim')) {
      variaveisGlobais.controlarVisibilidade('ocultar', '#mensagens-genericas');
      setTimeout(() => {
        exibirTutorialPreenchimento();
      }, 750);
    } else {      
      variaveisGlobais.exibirMensagem('<h3>Para exibir o guia a qualquer momento, clique sobre <strong>"exibir tutorial"</strong> no canto inferior direito da interface dos sistemas.</h3>');
    }    
  });
} 

const montarAreaPlanid = async () => {  
  // Montar a seção PLANID
  document.querySelector(`.dashboard-section__aplicacoes-body`).innerHTML = gestaoPlanid();  

  // clicar sobre o botão adicionar plano
  if (document.querySelector(`.botao-novo-planid-primeiro`)) {    
    document.querySelector(`.botao-novo-planid-primeiro`).addEventListener('click', () => rotinasNovoPlanid(semestre));
  }

  // listeners da seção de planids para criação/exibição/edição
  if (document.querySelector(`.objetos-registrados`)) {
    document.querySelector(`.objetos-registrados`).addEventListener("click", e => planidsClickHandler(e));
  }

  // exibir o tutorial de preenchimento
  if (!planid.exibiuTutorial && !localStorage.getItem('ocultarTutorialPreenchimentoPlanid') && !localStorage.getItem('planidSalvo')) {
    planid.exibiuTutorial = true;
    deveExibirTutorial();      
  }  

  document.querySelector(`.dashboard-section__aplicacoes-body`).insertAdjacentHTML('beforeend', '<span class="tutorial-planid__exibir-tutorial">exibir tutorial</span>');
  document.querySelector(`.tutorial-planid__exibir-tutorial`).addEventListener(`click`, exibirTutorialPreenchimento);
};

const rotinasPlanid = () => {  
  inicializarVariaveis();
  montarAreaPlanid();
};



