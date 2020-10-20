"use strict"

const urlParamsConsulta = new URLSearchParams(window.location.search);
const paramUnidade = urlParamsConsulta.get('unidade'); 
const paramSemestre = urlParamsConsulta.get('semestre');

const ajax = async ({method, url, params = {}, callback}) => {  
  let response;
  await axios({
    method,
    url,    
    params    
  })
  .then(res => {
    response = res;
    if (callback) {
      callback(res);
    }
  })
  .catch(err => {console.log('err: >>>>>> ', err);});
  return response;
};

const state = {
  semestre: '',
  unidade: '',
  docentes: [],
  searchTerm: '',
};

const consultarPlanid = e => {
  const 
    id = e.target.dataset.id,
    unidade = e.target.dataset.unidade,
    semestre = e.target.dataset.semestre; 
  if (unidade && semestre) {
    let win = window.open(`/planids/print?${id ? `_id=${id}` : ''}&unidade=${unidade}&semestre=${semestre}`, "_blank");
    win.focus();
  }   
};

const gerarCorpoLista = docentes => {
  let lista = `
    <h2>Clique sobre o nome do docente para visualizar, salvar ou imprimir o respectivo planid</h2>
    <p class='planid-consulta-docentes__nome-unidade'>${state.unidade}</p>
    <div class="planid-consulta-docentes__lista">`;    
  if (docentes.length) {
    for (let i = 0; i < docentes.length; i++) {
      lista += `<span data-id='${docentes[i].planids._id}' data-semestre='${state.semestre}' data-unidade='${state.unidade}'>${docentes[i].nome.toUpperCase()}</span>`;
    }
    lista += '</div>';
  } else {
    lista = '<h2 class="nao-encontrados">Não foram encontrados planos de atividades que atendam aos critérios informados</h2>';
  }
  if (docentes.length > 1) {
    lista += `
      <div class='button-div'>
        <button class="btn-base planid-consulta-docentes__imprimir-todos" data-unidade='${state.unidade}' data-semestre='${state.semestre}'>Imprimir todos</button>
      </div>
    `;
  }  
  const listaDocentes = document.querySelector(`.planid-consulta-docentes`);
  listaDocentes.innerHTML = lista;  
  listaDocentes.addEventListener('click', consultarPlanid);
};

const renderizarListaDocentes = async () => {
  const callback = msg => {
    document.querySelector(`.planid-consulta-filtros__form input[type=submit]`).removeAttribute('disabled');
  };  
  const queryUnidade = {$or:[{'unidadePreenchimentoPlanid': 'unidadeLotacao', 'unidadeLotacao': state.unidade}, {'unidadePreenchimentoPlanid': 'unidadeLocalizacao', 'unidadeLocalizacao': state.unidade}]};
  const populate = {path: 'planids'};
  const result = await ajax({ url: '/planids/recuperar-docentes', method: 'GET', params: { populate, query: queryUnidade, semestre: state.semestre }, callback });  
  const docentes = result.data;
  state.docentes = docentes;
  gerarCorpoLista(state.docentes);  
};

const renderizarInputBusca = () => {
  let inputBusca;
  if (state.docentes.length > 10) {
    inputBusca = `<input type='text' class='input-busca-docente' placeholder='pesquisar docentes pelo nome' value='${state.searchTerm}'>`;
    document.querySelector(`.planid-consulta-filtros__input-busca`).innerHTML = inputBusca;
    document.querySelector(`.input-busca-docente`).addEventListener('input', e => {
      state.searchTerm = e.target.value;
      gerarCorpoLista(state.docentes.filter(doc => e.target.value ? removeDiacritics(doc.nome.toUpperCase()).includes(removeDiacritics(e.target.value.toUpperCase())): true));
    });
  } else if (document.querySelector(`.input-busca-docente`)) {
    document.querySelector(`.input-busca-docente`).outerHTML= '';
  }
};

const listenerFiltros = async e => {
  e.preventDefault();
  state.unidade = e.target.elements.unidade.value;
  state.semestre = e.target.elements.semestre.value;
  if (!state.unidade || !state.semestre) {
    return alert('É necessário informar Unidade e semestre para buscar planids');
  }  
  document.querySelector(`.planid-consulta-filtros__form input[type=submit]`).setAttribute('disabled', true);
  state.searchTerm = '';
  document.querySelector(`.planid-consulta-docentes`).innerHTML = '<img class="loading-docentes" src="/img/loading.svg">';
  window.history.pushState(null, null, `consulta-publica?semestre=${state.semestre}&unidade=${state.unidade}`);
  await renderizarListaDocentes();  
  renderizarInputBusca();
};

const checarParametros = () => {
  if (paramUnidade && arrayUnidades.includes(paramUnidade) && paramSemestre) {
    state.unidade = paramUnidade;
    state.semestre = paramSemestre;
    document.querySelector(`.selecao-semestre`).value = state.semestre;
    document.querySelector(`.selecao-unidade`).value = state.unidade;
    document.querySelector(`.planid-consulta-filtros__form input[type=submit]`).click();
  } else if (paramUnidade && !arrayUnidades.includes(paramUnidade) || (paramUnidade && !paramSemestre) || (paramSemestre && !paramUnidade)) {
    setTimeout(() => {
      alert('Não foram encontrados planos de atividades que atendam aos critérios informados');      
    }, 500);
  }
};

const montarDivUnidades = () => {
  const listaUnidades = [...arrayUnidades];
  listaUnidades.pop();
  let unidades = `
  <option value='' selected>Selecione uma Unidade:</option>
  `;
  unidades += listaUnidades.map(unid => `
    <option value='${unid}'>${unid}</option>
  `);
  return unidades;
};

const montarDivSemestres = () => {
  const anoAtual = new Date().getFullYear();
  const semestreAtual = new Date().getMonth() > 6 ? 2 : 1;
  let options = `
    <option value='' selected>Selecione um semestre:</option>
    <option value='2019-2'>2019-2</option>
  `;
  for (let i = 2020; i < anoAtual - 1; i++) {
    options += `
    <option value='${anoAtual}-1'>${anoAtual}-1</option>
    <option value='${anoAtual}-2'>${anoAtual}-2</option>
    `;
  }
  options += `<option value='${anoAtual}-1'>${anoAtual}-1</option>`;
  if (semestreAtual === 2) {
    options += `<option value='${anoAtual}-2'>${anoAtual}-2</option>`;
  }
  return options;
};

const rotinasConsultaPlanids = () => {
  document.querySelector(`.selecao-semestre`).innerHTML = montarDivSemestres();
  document.querySelector(`.selecao-unidade`).innerHTML = montarDivUnidades();
  document.querySelector(`.planid-consulta-filtros__form`).addEventListener('submit', listenerFiltros);
  checarParametros();
};

window.addEventListener('DOMContentLoaded', rotinasConsultaPlanids);