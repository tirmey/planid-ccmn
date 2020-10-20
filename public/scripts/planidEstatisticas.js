"use strict"
const dadosEstatisticas = {};

const statState = {
  idiomasistema: 'pt',
  separadorDecimal: ',',
  separador: ';'
};

const calcularCH = (campo, unidade, semestral) => {
  const semanasTotais = unidade === 'Faculdade de Medicina (FM)' ? 22 : 15;
  let chTotal = 0
  for (let i = 0; i < campo.length; i++) {
    chTotal += +campo[i] / (semestral ? semanasTotais : 1);
  }
  return chTotal;
};

const isAtividadeSemestral = ativ => {
  if (ativiadadesCHSemestral.includes(ativ)) {
    return true
  }
  return false
};

const selecionarArquivoCSV = (e, planids) => {
  if (e.target.dataset.csv === 'distribuicao-ch') {
    estatisticasDistChCSV(planids);
  } else if (e.target.dataset.csv === 'resumo-centro') {
    estatisticasResumoCentroCSV(planids);
  } else if (e.target.dataset.csv === 'acoes-sigproj') {
    estatisticasAcoesSigprojCSV(planids);
  }
};

const prepararLink = (csv, semestre, nome) => {
  const encodedUri = encodeURI(csv);
  const link = document.createElement(`a`);
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `planids_${semestre}_${nome}.csv`);
  link.click();  
  link.remove();
};

const definirSeparadorDecimal = idioma => {
  statState.separadorDecimal = idioma === 'pt' ? ',' : '.';
  statState.separador = idioma === 'pt' ? ';' : ',';
};


/////////////////////////////////////////////
////////// ESTATISTICAS DINÂMICAS ///////////
/////////////////////////////////////////////

const gerarEstatisticasDinamicas = (planids, seletor, handlerSelecao )=> {
  const divDinamicas = document.querySelector(`.estatisticas-dinamicas-div`)
  if (!divDinamicas) {
    document.querySelector('.estatisticas-main-div').innerHTML = seletor;
    if (!document.querySelector(`script[src='/dist/scripts/planidEstatisticas.min.js']`)) {
      loadScript('/dist/scripts/planidEstatisticas.min.js', () => {});
    }
    document.querySelector(`.estatisticas-dinamicas__div`).addEventListener('click', e => handlerSelecao(e, planids));
  }
};