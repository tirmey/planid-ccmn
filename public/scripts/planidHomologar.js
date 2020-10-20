"use strict"

let moduloSelecionado;
// variável com os resumos de usuários e planids. Só o essencial para gerar a lista de docentes e o status do planid do semestre em questão
const gruposDocentes = {
  arrayNomeDocentes: [],
  arrayNaoEnviados: [],
  arrayNaoPreenchidos: [],
  arrayEnviados: [],
  grupoSelecionado: '',
};

const dashboard = {
  user: {
    unidadeHomologacao: document.querySelector('[name=unidade]').value,
    tipoUnidadeHomologacao: document.querySelector('[name=tipoUnidadeHomologacao]').value,
    consolidaPlanid: document.querySelector('[name=consolidaPlanid]').value,
  }
};

const ativiadadesCHSemestral = [
  'disciplinaCHDisciplinasSemanal', 
  'atividadesComplementaresEnsinoCH', 
  'atividadesCoopIntCH', 
  'atividadesComplementaresPesquisaCH'
];

// variável que armazena os dados dos planids já visualizados pelo gestor, para evitar requisições desnecessárias.
const planidsCarregados = [];

// variável que deve ser setada antes de listar os docentes
let semestreHomologacao;

const exibirInterface = (componente) => {
  document.querySelector(`.planids-gestao__main`).innerHTML = componente;
};

////////////////////////////////////////////////
////////////// MÓDULO HOMOLOGAÇÃO //////////////
////////////////////////////////////////////////

const adicionarQuantidadesListas = () => {
  const relacao = [
    ['.grupo-usuarios.nao-preenchidos', 'arrayNaoPreenchidos', 'não preenchidos'],
    ['.grupo-usuarios.nao-enviados', 'arrayNaoEnviados', 'não enviados'],
    ['.grupo-usuarios.enviados', 'arrayEnviados', 'enviados']
  ];
  for (let i= 0; i < relacao.length; i++) {
    document.querySelector(relacao[i][0]).innerHTML =  `
      <span>${relacao[i][2]} (${gruposDocentes[relacao[i][1]].length} planids) </span>
    `;
  }  
};

const carregarPlanidHomologar = async (_id) => {
  const queryUnidade = {$or: [{'autor.unidadePreenchimentoPlanid': 'unidadeLotacao', 'autor.unidadeLotacao': dashboard.user.unidadeHomologacao }, {'autor.unidadePreenchimentoPlanid': 'unidadeLocalizacao', 'autor.unidadeLocalizacao': dashboard.user.unidadeHomologacao}]}
  const query = {
    query: JSON.stringify({ _id, enviado: true, ...queryUnidade }),
  };
  const planid = await variaveisGlobais.ajax('/planids/recuperar-planid', 'GET', { query: query.query });
  return planid;
};

const enviarMensagemDocente = e => {
  e.preventDefault();
  const {mensagem, planidId: id} = e.target.elements;
  variaveisGlobais.exibirMensagem(`<h3>Sistema desacoplado do portal CCS. O módulo de envio de mensagens está inacessível. A seguinte mensagem seria enviada para o usuário preenchedor do planid id ${id.value}:</h3> <p>${mensagem.value}</p>`);
};

const enviarMensagemDocentePlanidNaoEnviado = e => {
  e.preventDefault();
  const {mensagem, autor, grupoDocentes, planid} = e.target.elements;
  if (mensagem.value) {
    variaveisGlobais.exibirMensagem(`<h3>Sistema desacoplado do portal CCS. O módulo de envio de mensagens está inacessível. A seguinte mensagem seria enviada para o usuário que preencheu planid com id ${planid.value}:</h3> <p>${mensagem.value}</p>`);
  } else {
    checkEmptyInputs(document.querySelectorAll('.enviar-mensagem-docente textarea[name=mensagem]'), -100, 125, '#mensagens-genericas__janela');
  }  
};

const adicionarAcoesPlanid = planid => {
  const html = `
    <form class='formulario enviar-mensagem-docente'>
      <input type='hidden' name='planidId' value='${planid._id}' >
      <input type='hidden' name='autor' value='${planid.autor._id}' >     
      <h2>Enviar mensagem para ${planid.autor.nome}</h2>
      <div>
        <label><p>Mensagem</p></label>
        <textarea name='mensagem'></textarea>
      </div>
      <div>
        <input type='submit'>
      </div>
    </form>
    <div class='button-div btn-acoes-planid-div'>      
      <button class='btn-base btn-mensagem' type='button' >Mensagem</button>
      <button type='button' class='btn-imprimir btn-base'>imprimir</button>
    </div>    
  `;
  document.querySelector(`.overlay-novo-planid .janela`).insertAdjacentHTML('beforeend', html);
  document.querySelector(`.btn-acoes-planid-div`).addEventListener('click', e => {
    if (e.target.dataset.id) {
      // TODO: find out what was erased from this block... or erase it.
    } else if (e.target.classList.contains('btn-imprimir')) {
      imprimirPlanid(planid._id, dashboard.user.unidadeHomologacao, semestreHomologacao, true);
    } else if (e.target.classList.contains('btn-mensagem')) {
      const janelaMensagem = document.querySelector(`.enviar-mensagem-docente`);
      janelaMensagem.classList.toggle('aberto');
      setTimeout(() => {
        if (janelaMensagem.classList.contains('aberto')) {  
          const scrollAmount = document.querySelector('.btn-acoes-planid-div').offsetTop - $('.overlay-novo-planid .janela').offset().top;
          $('.overlay-novo-planid .janela').animate({ scrollTop: scrollAmount }, "slow");
        }
      }, 200);
      document.querySelector(`.enviar-mensagem-docente`).addEventListener('submit', enviarMensagemDocente);
    }
  });
};

const adicionarEventos = (eventos, configInsercao) => {
  const { elementoInsercao, posicao } = configInsercao;
  if (document.querySelector(`.eventos-e-mensagens`)) {
    document.querySelector(`.eventos-e-mensagens`).outerHTML = '';
  }
  document.querySelector(elementoInsercao).insertAdjacentHTML(posicao, `
    <div class='eventos-e-mensagens'>
      <h2>Histórico de mensagens</h2>
      <div class='lista-eventos'>
        ${eventosDOM(eventos)}
      </div>
    </div>  
  `);
};

const prepararExibicaoPlanid = async e => {  
  if (e.target.dataset.id) {    
    operacaoDB()
    let planidAExibir, idAutor;
    const docenteComPlanid = gruposDocentes[gruposDocentes.grupoSelecionado].find(docente => (docente._id === e.target.dataset.id && docente.planidSelecionado))
    if (docenteComPlanid) {
      const planidCarregado = planidsCarregados.find(planid => planid._id.toString() === docenteComPlanid.planidSelecionado._id.toString());
      if (!planidCarregado) {
        let planid = await carregarPlanidHomologar(docenteComPlanid.planidSelecionado._id); 
        planidsCarregados.push(planid[0]);
        planidAExibir = planid[0];    
        idAutor = planid[0].autor._id;
      } else {
        planidAExibir = planidCarregado;   
        idAutor = planidCarregado.autor._id;
      }
      if (planidAExibir.novoEvento) {
        const data = JSON.stringify({ novoEvento: false, _id: planidAExibir._id })
        variaveisGlobais.ajax('/planids/editar-planid', 'POST', { data });
        planidAExibir.novoEvento = false;
        // TODO: atualizar o objeto no conjunto de completas
        for (let i = 0; i < planidsCarregados.length; i++) {
          if (planidsCarregados[i]._id.toString() !== planidAExibir._id.toString()) {
            planidsCarregados[i].novoEvento = false;
            break;
          }
          if (e.target.parentElement.querySelector('.mensagem-nova')) {
            e.target.parentElement.querySelector('.mensagem-nova').outerHTML = '';
          }
        }        
      } 
      exibirPlanid(idAutor, planidAExibir);  
      if (e.target.classList.contains('mensagem-nova')) {
        setTimeout(() => {
          variaveisGlobais.scrollTo('.btn-acoes-planid-div', -90, null, '.overlay-novo-planid .janela');
        }, 1000);
      } 
    }
  }
};

const recuperarMensagensPlanidNaoEnviado = (id, grupo) => {
  const user = gruposDocentes[grupo].find(user => user._id.toString() === id);
  const planid = user.planids.find(planid => planid.semestre === semestreHomologacao);
  return planid ? planid.eventos : [];
};

const exibirJanelaMensagemDocentes = (id, nome, idPlanid, planidEnviado, grupo) => {  
  const html = `
    <form class='formulario enviar-mensagem-docente'>      
      <input type='hidden' name='autor' value='${id ? id : ''}' >     
      <input type='hidden' name='planid' value='${idPlanid ? idPlanid : ''}' >     
      <input type='hidden' name='grupoDocentes' value='${grupo}' >     
      <input type='hidden' name='semestre' value='${semestreHomologacao}' >     
      <h2>Enviar mensagem para ${nome ? nome : 'todos os docentes que não enviaram o planid'}</h2>
      <div>
        <label><p>Mensagem</p></label>
        <textarea name='mensagem'></textarea>
      </div>
      <div>
        <input type='submit'>
      </div>
    </form>     
  `;
  variaveisGlobais.exibirMensagem(html);  
  if (nome) {
    const eventosPlanid = recuperarMensagensPlanidNaoEnviado(id, grupo);
    if (eventosPlanid.length) {
      adicionarEventos(eventosPlanid, {elementoInsercao: '#mensagens-genericas .enviar-mensagem-docente', posicao: 'afterend'});
    }    
  } 
  document.querySelector(`#mensagens-genericas .enviar-mensagem-docente`).addEventListener(`submit`, enviarMensagemDocentePlanidNaoEnviado);  
};

const updateUser = (grupo, planidId) => {  
  for (let i = 0; i < gruposDocentes[grupo].length; i++) {
    if (gruposDocentes[grupo][i].planids.length) {
      for (let j = 0; j < gruposDocentes[grupo][i].planids.length; j++) {
        if (gruposDocentes[grupo][i].planids[j]._id === planidId) {
          gruposDocentes[grupo][i].planids[j].novoEvento = false;
          return;
        }
      }
    }
  }
};

const listaDocentesClickHandler = e => {
  const docente = gruposDocentes[gruposDocentes.grupoSelecionado].find(docente => (docente._id === e.target.dataset.id && docente.planidSelecionado));
  if (e.target.dataset.action === 'visualizar') {
    prepararExibicaoPlanid(e);
  } else if (e.target.dataset.action === 'imprimir') {  
    imprimirPlanid(docente.planidSelecionado._id, dashboard.user.unidadeHomologacao, semestreHomologacao, true);
  } else if (e.target.dataset.action === 'enviar-mensagem') {    
    if (e.target.parentElement.querySelector('.mensagem-nova')) {
      document.querySelector(`.lista-mensagem-nova-${docente._id}`).outerHTML = '';
      e.target.parentElement.querySelector('.mensagem-nova').outerHTML = '';
      updateUser(gruposDocentes.grupoSelecionado, docente.planidSelecionado._id);
      const data = JSON.stringify({ novoEvento: false, _id: docente.planidSelecionado._id })
      variaveisGlobais.ajax('/planids/editar-planid', 'POST', { data });      
    }
    const
      id = e.target.dataset.id, 
      nome = e.target.dataset.nome;
    if (gruposDocentes.grupoSelecionado === 'arrayNaoPreenchidos') {
      exibirJanelaMensagemDocentes(id, nome, null, null, 'arrayNaoPreenchidos');
    } else {
      exibirJanelaMensagemDocentes(id, nome, docente.planidSelecionado._id, gruposDocentes.grupoSelecionado === 'arrayEnviados'? true : null, gruposDocentes.grupoSelecionado);
    }
  } 
};

const imprimirTodosPlanids = async () => {
  imprimirPlanid(null, dashboard.user.unidadeHomologacao, semestreHomologacao, true);
};

const iconClock = `
  <svg class="a icon-clock" viewBox="0 0 364.2 364.2"><defs><style>.a{fill:none;stroke-linecap:round;stroke-miterlimit:10;stroke-width:17px;}</style></defs><path d="M337.21,103.23a15.14,15.14,0,0,0,15.09-15.1V80.58a15.1,15.1,0,0,0-30.19,0v7.55A15.15,15.15,0,0,0,337.21,103.23Z"/><path d="M88.13,322.11H80.58a15.1,15.1,0,0,0,0,30.19h7.55a15.1,15.1,0,1,0,0-30.19Z"/><path d="M166.63,145.49a14.95,14.95,0,0,0-21.14,21.14l5.29,5.28a14.59,14.59,0,0,0,21.13,0,14.59,14.59,0,0,0,0-21.13Z"/><path class="a" d="M355.7,8.5C163.79,8.5,8.5,163.79,8.5,355.7"/></svg>
`;

const listaDocentesHTML = (lista, grupo) => {
  const divLista = document.createElement('div');  
  let listaVazia = document.createElement('div');
  if (!lista.length) {
    listaVazia.innerHTML = `<h2>Não há docentes nesta categoria</h2>`
  }
  const ul = document.createElement('ul');
  for (let i = 0; i < lista.length; i++) {  
    let iconeMensagem = '';
    if (lista[i].planidSelecionado && lista[i].planidSelecionado.novoEvento) {      
      if (lista[i].planidSelecionado.eventos[lista[i].planidSelecionado.eventos.length - 1].emissor !== 'gerente') {
        const acao = gruposDocentes.grupoSelecionado === 'arrayEnviados' ? 'visualizar' : 'enviar-mensagem';
        iconeMensagem = `<i class="fa fa-exclamation-triangle mensagem-nova" data-id=${lista[i]._id} data-nome='${lista[i].nome}' data-action='${acao}' title="há mensagens novas neste planid"></i>`;
      }
    }
    
    let chTotal;
    if (grupo === 'arrayEnviados') {
      calcularCargaHoraria(lista[i].planidSelecionado);
      chTotal = cargasHorariasParciais.total;
    }
    
    let icones;    
    if (gruposDocentes.grupoSelecionado !== 'arrayNaoEnviados' && lista[i].planidSelecionado) {      
      icones = `<div class='lista-docentes-icones'>
          ${iconeMensagem}
          <i class='fa fa-desktop' data-id='${lista[i]._id}' data-action='visualizar' title='visualizar planid'></i> 
          <i class='fa fa-print' data-id='${lista[i]._id}' data-action='imprimir' title='imprimir planid'></i>
        </div>
      `;
    } else {
      icones = `
        <div class='lista-docentes-icones'>
          ${iconeMensagem}
          <i class="fa fa-envelope enviar-mensagem" data-nome='${lista[i].nome}' data-id='${lista[i]._id}' data-action='enviar-mensagem' title='enviar mensagem para ${lista[i].nome}'></i>    
        </div>
      `;
    }    

    const docente = `
      <li id='lista-usuarios-${lista[i].nome.toLowerCase().split(' ').join('-')}'>      
        <span class="lista-docentes-nome">${lista[i].nome}</span>
        ${icones}
        ${chTotal 
          ? `
            <div class='horas-semanais-parcial lista-docentes-horas-totais' title='carga horária'>
                ${iconClock}
                <span class='section-planid__ch lista-docentes-ch quantidade-horas'>${chTotal.toFixed(0)}</span>
              </div>
            ` 
          : ''}
      </li>
    `;
    ul.insertAdjacentHTML('beforeend', docente);
  }
  divLista.insertAdjacentElement('beforeend', ul);
  const listaDocentes = document.querySelector(`.planids-homologar__lista-docentes`);
  const imprimirPlanidsBtn = document.querySelector(`.imprimir-todos-planids__btn-div`);
  const contactarNaoEnviados = document.querySelector(`.enviar-mensagem-nao-enviados__btn-div`) ;
  listaDocentes.innerHTML = '';   
  listaDocentes.insertAdjacentElement('beforeend', lista.length ? divLista : listaVazia);

  if (contactarNaoEnviados) {
    contactarNaoEnviados.outerHTML = '';
  }
  if (imprimirPlanidsBtn) {
    imprimirPlanidsBtn.outerHTML = '';
  }
  if (grupo === 'arrayEnviados' && gruposDocentes[grupo].length > 1) {
    listaDocentes.insertAdjacentHTML('afterend', "<div class='imprimir-todos-planids__btn-div button-div'><button class='imprimir-todos-planids btn-base'>Imprimir todos</button></div>" );    
    document.querySelector(`.imprimir-todos-planids`).addEventListener('click', imprimirTodosPlanids);
  } else if (grupo !== 'arrayEnviados' && gruposDocentes[grupo].length > 1) {    
    listaDocentes.insertAdjacentHTML('afterend', "<div class='enviar-mensagem-nao-enviados__btn-div button-div'><button class='enviar-mensagem-nao-enviados btn-base'>Enviar mensagem a todos</button></div>" );
    document.querySelector(`.enviar-mensagem-nao-enviados`).addEventListener('click', () => exibirJanelaMensagemDocentes(null, null, null, null, gruposDocentes.grupoSelecionado));
  }
}

const preencherListaDocentes = (e) => {
  if (e.target.dataset.grupo) {
    selecionarElemento(e.target, 'grupo-usuarios', 'selected');
    gruposDocentes.grupoSelecionado = e.target.dataset.grupo;
    listaDocentesHTML(gruposDocentes[e.target.dataset.grupo], e.target.dataset.grupo);
  } 
};

const preencherGruposDocentes = array => {  
  gruposDocentes.arrayNaoPreenchidos = [];
  gruposDocentes.arrayNaoEnviados = [];  
  gruposDocentes.arrayEnviados = [];

  for (let i = 0; i < array.length; i++) {
    const planids = array[i].planids;   
    let temPlanidSemestre = false;

    // nunca preencheu planid
    if (!planids.length) {
      gruposDocentes.arrayNaoPreenchidos.push(array[i]);
      continue;
    }
    for (let j = 0; j < planids.length; j++) {
      if (planids[j].semestre === semestreHomologacao) {
        if (planids[j].enviado) {          
          gruposDocentes.arrayEnviados.push(array[i]);
        } else {
          // tem planid no semestre, mas não enviou
          gruposDocentes.arrayNaoEnviados.push(array[i]);    
        }
        array[i].planidSelecionado = planids[j];
        temPlanidSemestre = true;
        break;
      }
    }
    if (!temPlanidSemestre) {
      // tem planids, mas não no semestre em questão
      gruposDocentes.arrayNaoPreenchidos.push(array[i]);
    }
  }

  //preencher, por padrão a lista de docentes a homologar:  
  gruposDocentes.grupoSelecionado = 'arrayEnviados';
  listaDocentesHTML(gruposDocentes.arrayEnviados, gruposDocentes.grupoSelecionado);
};

const eliminarItemListaMensagensDocentes = item => {
  item.outerHTML = '';
  const mensagensRecebidas = document.querySelectorAll(`.div-mensagens-recebidas li`);
  if (!mensagensRecebidas.length) {
    document.querySelector(`.div-mensagens-recebidas`).outerHTML = '';
  }
}

const checarMensagensDocentes = docentes => {
  const clicarMensagemDocenteHandler = e => {
    eliminarItemListaMensagensDocentes(e.target);
    exibirJanelaMensagemDocentes(e.target.dataset.id, e.target.dataset.nome, e.target.dataset.planid, e.target.dataset.enviado, e.target.dataset.grupo);
    const data = JSON.stringify({ novoEvento: false, _id: e.target.dataset.planid })
    variaveisGlobais.ajax('/planids/editar-planid', 'POST', { data });
    if (e.target.dataset.grupo === gruposDocentes.grupoSelecionado) {
      const nomeNaLista = document.getElementById(`lista-usuarios-${e.target.dataset.nome.toLowerCase().split(' ').join('-')}`);
      if (nomeNaLista.querySelector('.lista-docentes-icones .mensagem-nova')) {
        nomeNaLista.querySelector('.lista-docentes-icones .mensagem-nova').outerHTML = '';
      }
    }
    updateUser(e.target.dataset.grupo, e.target.dataset.planid);
  };
  let html = '<div class="div-mensagens-recebidas"><span>Novas mensagens</span><ul>';
  let haMensagens;
  for (let i = 0; i < docentes.length; i++) {
    const planidSelecionado = docentes[i].planidSelecionado;
    if (planidSelecionado && planidSelecionado.novoEvento) {
      const ultimoEvento = planidSelecionado.eventos[planidSelecionado.eventos.length - 1];
      if (ultimoEvento.emissor !== 'gerente') {
        haMensagens = true;
        const grupo = planidSelecionado.enviado ? 'arrayEnviados' : 'arrayNaoEnviados';
        html += `<li class='lista-mensagem-nova-${docentes[i]._id}' data-id='${docentes[i]._id}' data-nome='${ultimoEvento.emissor}' data-grupo='${grupo}' data-enviado='${planidSelecionado.enviado}' data-planid='${planidSelecionado._id}'>${ultimoEvento.emissor}</li>`;
      }
    }
  }
  html += `</ul></div>`;
  if (haMensagens) {
    document.querySelector(`.base-homologacao-semestre`).insertAdjacentHTML('afterend', html);
    document.querySelector(`.div-mensagens-recebidas`).addEventListener('click', clicarMensagemDocenteHandler);
  }
};

const recuperarNomeDocentes = async() => {  
  const ano = semestreHomologacao.split('-')[0];
  const semestre = semestreHomologacao.split('-')[1];
  // recupera apenas os cadastros de docentes que se registraram no semestre em questão
  const mesInicio = +semestre === 1 ? 6 : 11;
  const since = Math.floor((new Date(ano, mesInicio, 1))/1000).toString(16) + "0000000000000000";
  const query = {
    query: JSON.stringify([{categoria: 'docente', _id: {$lte: since}, $and: [{$or: [{unidadePreenchimentoPlanid: 'unidadeLotacao', unidadeLotacao: dashboard.user.unidadeHomologacao}, {unidadePreenchimentoPlanid: 'unidadeLocalizacao', unidadeLocalizacao: dashboard.user.unidadeHomologacao}]}, {$or: [{excluido: {$exists: false}}, {dataExclusao: {$gte: new Date(ano, mesInicio, 1).getTime()}}] }] }]),
    exibir: JSON.stringify('nome planids'),
    populate: JSON.stringify({ path: 'planids' })
  };
  const arrayNomeDocentes = await variaveisGlobais.ajax('/users/recuperarContatos', 'GET', { populate: query.populate, query: query.query, exibir: query.exibir});
  return arrayNomeDocentes;
}; 

const exibirPlanid = (userId, planidCarregado) => {  
  document.querySelector(`.planids-homologar`).insertAdjacentHTML('beforeend', relatorioBase(userId)); 
  listenersBotoesFormulario();
  document.querySelectorAll(`body`)[0].classList.add('fixo');
  setTimeout(() => {
    preencherPlanid(planidCarregado);    
    ajustarExibicaoPlanid(planidCarregado);
    variaveisGlobais.controlarVisibilidade('exibir', '.overlay-novo-planid');
    variaveisGlobais.controlarVisibilidade('ocultar', '#mensagens-genericas');
  }, 500);
};

const listenersHomologacaoPlanids = () => {
  document.querySelector(`.grupos-usuarios`).addEventListener('click', preencherListaDocentes);
  document.querySelector(`.planids-homologar__lista-docentes`).addEventListener('click', listaDocentesClickHandler);   
};


const selecionarSemestreHandler = e => {
  e.preventDefault();
  operacaoDB();
  const ano = document.getElementById(`input-selecionar-ano`).value;
  const semestre = document.getElementById(`input-selecionar-semestre`).value;
  if (ano && semestre) {
    document.querySelector(`.grupos-usuarios`).innerHTML = `
      <ul>
        <li class='grupo-usuarios enviados selected' data-grupo='arrayEnviados'>enviados</li>
        <li class='grupo-usuarios nao-enviados' data-grupo='arrayNaoEnviados'>não enviados</li>        
        <li class='grupo-usuarios nao-preenchidos' data-grupo='arrayNaoPreenchidos'>não preenchidos</li>        
      </ul>
    `;
    semestreHomologacao = `${ano}-${semestre}`;

    // construir as demais rotinas baseadas no semestre escolhido
    selecionarDadosVersao(semestreHomologacao);
    setTimeout(async () => {
      document.querySelector(`.base-homologacao-semestre`).innerHTML = `<h2>Planids ${semestreHomologacao}</h2>`;
      gruposDocentes.arrayNomeDocentes = await recuperarNomeDocentes();
      preencherGruposDocentes(gruposDocentes.arrayNomeDocentes);
      checarMensagensDocentes(gruposDocentes.arrayNomeDocentes);
      adicionarQuantidadesListas();  
      selecionarElemento(document.querySelector(`.grupo-usuarios.enviados`), 'grupo-usuarios', 'selected');    
      listenersHomologacaoPlanids();    
    }, 500);
    setTimeout(() => {
      variaveisGlobais.controlarVisibilidade('ocultar', '#mensagens-genericas');        
    }, 300);
  } else {
    variaveisGlobais.exibirMensagem('<h3>É necessário informar ano e semestre para exibir os planids</h3>', 1500);
  }
};

const selecaoSemestre = `
  <h1>Gestão de planids</h1>
  <h2>${dashboard.user.unidadeHomologacao}</h2>
  <form class='form-selecao-semestre formulario'>
    <div>
      <label for='input-selecionar-ano'>Ano:</label>
      <input type='number' min='2019' max='${new Date().getMonth() < 9 ? new Date().getFullYear() : new Date().getFullYear() + 1}' id='input-selecionar-ano' value='${new Date().getMonth() < 9 ? new Date().getFullYear() : new Date().getFullYear() + 1}'>
    </div>
      <div>
      <label for='input-selecionar-semestre'>Semestre:</label>
      <input type='number' min='1' max='2' id='input-selecionar-semestre' value='${new Date().getMonth() < 7 ? 1 : 2}'>
    </div>
    <div>
      <input type='submit' value='selecionar semestre'>
    </div>
  </form>
`;

const baseHomologacao = `
  ${selecaoSemestre}
  <div class='base-homologacao-semestre'></div>
  <div class='grupos-usuarios'>    
  </div>  
  <div class="planids-homologar__lista-docentes"></div>  
`;

const rotinasHomologacaoPlanids = () => {
  exibirInterface(baseHomologacao);
  document.querySelector(`.form-selecao-semestre`).addEventListener('submit', selecionarSemestreHandler);
};

/////////////////////////////////////////////////
////////////// MÓDULO ESTATÍSTICAS //////////////
/////////////////////////////////////////////////

const estatisticasDistChCSV = planids => {
  definirSeparadorDecimal('en');
  let csv = "data:text/csv;charset=utf-8,\uFEFF";
  const sep = statState.separador;
  const header = [
    'docente',
    'regime',
    'chTotal',
    'chEnsino',
    'chPesquisa',
    'chExtensao',
    'chAdm',  
    'chMedia 40h',
    'chMedia 20h',
  ];
  const chTotal = {
    _20h: 0,
    _40h: 0,
    docentes20h: 0,
    docentes40h: 0,
  };

  let body = [];
  for (let i = 0; i < planids.length; i++) {
    cargasHorariasParciais = {
      total: 0,
      parcial: {
        section_2: 0,
        section_3: 0,
        section_4: 0,
        section_5: 0,
      }
    };
    const props = Object.entries(planids[i]);    
    for (let j = 0; j < props.length; j++) {
      if (props[j][0].includes('CH') && planids[i][props[j][0]].length) {
        const cargasHorarias = planids[i][props[j][0]];
        for (let k = 0; k < cargasHorarias.length; k++) {
          if (CHSemestrais.includes(props[j][0])) {            
            planids[i][props[j][0]][k] = planids[i][props[j][0]][k] / semanasAula;
          }
          computarCargasHorariasParciais(props[j][0], +planids[i][props[j][0]][k]);
        }
      }
    }
    if (planids[i].autor.regime === '20h') {
      chTotal._20h += +cargasHorariasParciais.total;
      chTotal.docentes20h += 1;
    } else {
      chTotal._40h += +cargasHorariasParciais.total;
      chTotal.docentes40h += 1;
    }

       
    body += `${planids[i].autor.nome}${sep}${planids[i].autor.regime}${sep}"${cargasHorariasParciais.total.toFixed(1)}"${sep}"${cargasHorariasParciais.parcial.section_2.toFixed(1)}"${sep}"${cargasHorariasParciais.parcial.section_3.toFixed(1)}"${sep}"${cargasHorariasParciais.parcial.section_4.toFixed(1)}"${sep}"${cargasHorariasParciais.parcial.section_5.toFixed(1)}"\r`;     
  }
  body += `TOTAL${sep}${sep}${sep}${sep}${sep}${sep}${sep}${chTotal.docentes40h ? (chTotal._40h / chTotal.docentes40h).toFixed(1) : 0}${sep}${chTotal.docentes20h ? `"${(chTotal._20h / chTotal.docentes20h).toFixed(1)}"` : 0}`;
  
  csv += `${header.join(sep)}\r\n`;
  body = body.replace(/\./g, statState.separadorDecimal);
  csv += body; 
  prepararLink(csv, semestreHomologacao, `${dashboard.user.unidadeHomologacao}_resumo_carga_horaria`);
};

const gerarEstatisticasCSV = planids => {
  const distCH = "<div class='csv-estatisticas-planid__link' data-csv='distribuicao-ch'><a class='link-estatisticas-completas'><i class='fa fa-bar-chart-o'></i><span class='btn-csv' >Distribuição de carga horária</span></a></div>";    
  
  document.querySelector(`.estatisticas-main-div`).innerHTML = `
  <div class='csv-estatisticas-planid__div'>
    <h2>Arquivos em formato .csv para download</h2>
    ${distCH}
  </div>`;
  document.querySelector(`.estatisticas-main-div`).addEventListener('click', e => selecionarArquivoCSV(e, planids));  
};


// Funções seleção dinâmica - módulo preliminar não desenvolvido, mas fica o registro para caso queiram implementar algo do tipo
const stat1 = planids => {
  for (let i = 0; i < planids.length; i++) {
    const props = Object.entries(planids[i]);
    for (let j = 0; j < props.length; j++) {
      if (props[j][0].includes('CH')) {
        console.log('props[j]: >>>>>> ', props[j]);
      }
    }
  }
  return '<p>Stat 1</p>'
};

const stat2 = planids => {  
  return '<p>Stat 2</p>'
};

const stat3 = planids => {  
  return '<p>Stat 3</p>'
};

const selecaoDinamicasHandler = (e, planids) => {  
  let statHTML = '';
  switch (e.target.dataset.stat) {
    case 'stat1':
      statHTML = stat1(planids);
      break;  
    case 'stat2':
      statHTML = stat2(planids);
      break;  
    case 'stat3':
      statHTML = stat3(planids);
      break;  
    default:
      break;
  }
  document.querySelector(`.estatisticas-dinamicas__main`).innerHTML = statHTML;
};

const selecaoEstatisticaHandler = e => {
  if (e.target.classList.contains('btn-back')) {
    rotinasEstatisticas();
  } else if (e.target.classList.contains('btn-dinamicas')) {
    const seletor = `
    <div class='estatisticas-dinamicas__div'>
      <ul>
        <li data-stat='stat1'>Stat 1</li>
        <li data-stat='stat2'>stat 2</li>
        <li data-stat='stat3'>stat 3</li>          
      </ul>
      <div class='estatisticas-dinamicas__main'></div>
    </div>
  `;
    gerarEstatisticasDinamicas(dadosEstatisticas[semestreHomologacao], seletor, selecaoDinamicasHandler);
  } else if (e.target.classList.contains('btn-csv')) {
    gerarEstatisticasCSV(dadosEstatisticas[semestreHomologacao]);
  }
};

const carregarPlanidsSemestre = async e => {
  e.preventDefault();  
  semestreHomologacao = `${e.target.elements['input-selecionar-ano'].value}-${e.target.elements['input-selecionar-semestre'].value}`;
  const query = {
    query: JSON.stringify({semestre: semestreHomologacao,  $or: [{'autor.unidadePreenchimentoPlanid': 'unidadeLotacao', 'autor.unidadeLotacao': dashboard.user.unidadeHomologacao}, {'autor.unidadePreenchimentoPlanid': 'unidadeLocalizacao', 'autor.unidadeLocalizacao': dashboard.user.unidadeHomologacao}], enviado: true}),    
  };
  if (!dadosEstatisticas[semestreHomologacao]) {
    dadosEstatisticas[semestreHomologacao] = await variaveisGlobais.ajax('/planids/recuperar-planid', 'GET', { query: query.query });
  }
  if (dadosEstatisticas[semestreHomologacao].length) {
    document.querySelector('.planids-gestao__main').innerHTML = `    
      <div class="button-div estatisticas-main-button-div">              
        <button class="btn-base btn-csv">Estatísticas em .csv</button>      
        <button class="btn-base btn-dinamicas">Estatísticas dinâmicas</button>      
        <button class="btn-base btn-back">Outro semestre</button>
      </div>
      <div class="estatisticas-main-div"></div>
    `;
    selecionarDadosVersao(semestreHomologacao);
    document.querySelector('.estatisticas-main-button-div').addEventListener('click', selecaoEstatisticaHandler);
  } else {
    variaveisGlobais.exibirMensagem(`<h3>Não há planids de docentes da ${dashboard.user.unidadeHomologacao} registrados no semestre ${semestreHomologacao}.</h3>`);
  }
};

const rotinasEstatisticas = async() => {
  setTimeout(() => {
    variaveisGlobais.controlarVisibilidade('ocultar', '#mensagens-genericas');
    exibirInterface(selecaoSemestre);
    document.querySelector(`.form-selecao-semestre`).addEventListener('submit', carregarPlanidsSemestre);
  }, 300);
  
};

///////////////////////////////////////////////////////
////////////// INICIALIZA GESTÃO PLANIDS //////////////
///////////////////////////////////////////////////////

const selecaoSubsistemas = e => {  
  if (e.target.dataset.modulo !== moduloSelecionado) {
    selecionarElemento(e.target, 'planids-gestao__modulos-opcao', 'selected');
    moduloSelecionado = e.target.dataset.modulo;
    switch (e.target.dataset.modulo) {
      case 'homologacao':    
        rotinasHomologacaoPlanids();        
        break;
      case 'estatisticas':
        rotinasEstatisticas();
        operacaoDB();      
      default:
        break;
    }
  }
}

const selecaoAlt = e => {
  if (e.target.dataset.modulo === 'homologacao') {
    document.querySelector(`.opcao-homologacao`).click();
  } else if (e.target.dataset.modulo === 'estatisticas') {
    document.querySelector(`.opcao-estatisticas`).click();
  }
};

const rotinasGestaoPlanids = () => {   
  document.querySelector(`.planids-gestao__modulos`).addEventListener('click', selecaoSubsistemas);
  document.querySelector(`.planids-gestao__opcoes-iniciais`).addEventListener('click', selecaoAlt);
}

document.addEventListener('DOMContentLoaded', rotinasGestaoPlanids);
