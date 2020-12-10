"use strict"

const _csrf = document.querySelector(`.csrf-token`).value;
const consolidaPlanid = {
  semestre: '',
};

const selecaoSemestre = `
  <h1>Gestão de planids (Centro)</h1>
  <form class='form-selecao-semestre formulario'>
    <div>
      <label for='input-selecionar-ano'>Ano:</label>
      <input type='number' min='2019' max='${new Date().getMonth() < 9 ? new Date().getFullYear() : new Date().getFullYear() }' id='input-selecionar-ano' value='${new Date().getMonth() < 9 ? new Date().getFullYear() : new Date().getFullYear()}'>
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

const tratarDadosConsolidacaoPlanid = users => {
  let totalEnvios = 0, totalEmPreenchimento = 0;
	const unidades = {};
	for (let i = 0; i < users.length; i++) {
		const unidadePlanid = users[i].unidadePreenchimentoPlanid || 'unidadeLocalizacao';
		if (unidades[users[i][unidadePlanid]]) {
			unidades[users[i][unidadePlanid]].docentesCadastrados += 1;			
		} else {
			unidades[users[i][unidadePlanid]] = {docentesCadastrados: 1, naoIniciouPreenchimento: 0, enviouPlanid: 0, preenchimentoIniciado: 0};
    }
    
		if (!users[i].planids.length) {		
			unidades[users[i][unidadePlanid]].naoIniciouPreenchimento += 1; 
		} else {
			const planid = users[i].planids.find(planid => planid.semestre === consolidaPlanid.semestre);
			if (planid && planid.enviado) {
				unidades[users[i][unidadePlanid]].enviouPlanid += 1; 
				totalEnvios++;
			} else if (planid && !planid.enviado) {
				unidades[users[i][unidadePlanid]].preenchimentoIniciado += 1; 
				totalEmPreenchimento++;
			} else if (!planid) {
        unidades[users[i][unidadePlanid]].naoIniciouPreenchimento += 1;
      }
		}
	}
  return {unidades, totalDocentesCadastrados: users.length, totalEnvios, totalEmPreenchimento}
};

const estatisticasResumoCentroCSV = async () => {
  operacaoDB('Recuperando informações no banco de dados');
  let csv = "data:text/csv;charset=utf-8,\ufeff";
  const query = {
    exibir: JSON.stringify('nome unidadePreenchimentoPlanid unidadeLotacao unidadeLocalizacao planids categoria'),
    query: JSON.stringify([{ categoria: 'docente' }]),
    populate: JSON.stringify({ path: 'planids', options: { select: 'enviado semestre' } }),
  }
  const users = await variaveisGlobais.ajax('/users/recuperarContatos', 'GET', { _csrf, ...query }, () => variaveisGlobais.controlarVisibilidade('ocultar', '#mensagens-genericas'));
  const consolidado = tratarDadosConsolidacaoPlanid(users);

  const header = [
    'unidade',
    'docentes cadastrados', 
    'total de envios',      
    'nao enviaram',
    'nao preencheram',
    'Percentual de envio'
  ];

  const { separador: sep } = statState;

  let body = `'total'${sep} ${consolidado.totalDocentesCadastrados}${sep} ${consolidado.totalEnvios}${sep} ${consolidado.totalEmPreenchimento}${sep} ${consolidado.totalDocentesCadastrados - (consolidado.totalEnvios + consolidado.totalEmPreenchimento)}${sep} ${((consolidado.totalEnvios * 100) / consolidado.totalDocentesCadastrados).toFixed(0)}%\r\n`;
  const unidadesArr = Object.entries(consolidado.unidades);
  for (let i = 0; i < unidadesArr.length; i++) {  
      body += `${unidadesArr[i][0]}${sep} ${unidadesArr[i][1].docentesCadastrados}${sep} ${unidadesArr[i][1].enviouPlanid}${sep} ${unidadesArr[i][1].preenchimentoIniciado}${sep} ${unidadesArr[i][1].naoIniciouPreenchimento}${sep} ${((unidadesArr[i][1].enviouPlanid * 100) / unidadesArr[i][1].docentesCadastrados).toFixed(0) }%\r`;
  }
  csv += `${header.join(sep)}\r\n`;
  csv += body;
  prepararLink(csv, consolidaPlanid.semestre, 'carga_horaria_resumo_ccs');
};

const selecionarArquivoCSVHandler = (submitEvent, clickEvt) => {
  definirSeparadorDecimal(submitEvent.target.value);
  variaveisGlobais.controlarVisibilidade('ocultar', '#mensagens-genericas')
  if (clickEvt.target.dataset.csv) {
    const file = clickEvt.target.dataset.csv;
    switch (file) {
      case 'resumo-centro':
        estatisticasResumoCentroCSV();
        break;
    
      default:
        break;
    }
  }
};

const selecionarIdioma = evt => {
  const html = `
    <form class='form-selecao-idioma-so formulario'>
      <div>
        <label>Qual o idioma de seu visualizador de planilha?</label>
        <select>
          <option value='' selected readOnly>Selecione:</option>
          <option value='pt'>Português</option>
          <option value='en'>Inglês</option>
        </select>
      </div>
      <div></div>
    </form>    
  `;
  variaveisGlobais.exibirMensagem(html);
  document.querySelector(`.form-selecao-idioma-so`).addEventListener('change', e => selecionarArquivoCSVHandler(e, evt));
};

const csvDOM = () => {
  let resumoCentro = `
    <div class='csv-estatisticas-planid__div'>
      <h2>${consolidaPlanid.semestre}</h2>
      <h2>Arquivos em formato .csv para download</h2>
      <div class='csv-estatisticas-planid__link' data-csv='resumo-centro'>
        <a class='link-estatisticas-resumo-centro' >
          <i class='fa fa-bar-chart-o'></i>
          <span class='btn-csv'>Resumo do Centro</span>
        </a>
      </div>
    </div>`;
  document.querySelector(`.planids-consolidacao__pesquisas`).innerHTML = resumoCentro;
  document.querySelector(`.csv-estatisticas-planid__div`).addEventListener('click', selecionarIdioma);
};

const selecionarSemestreHandler = async e => {
  e.preventDefault();  
  operacaoDB();
  const semestre = `${e.target.elements['input-selecionar-ano'].value}-${e.target.elements['input-selecionar-semestre'].value}`;
  const query = {
    query: JSON.stringify({semestre}),
    countOnly: true,   
  }
  const planids = await variaveisGlobais.ajax('/planids/recuperar-planid-homologacao', 'GET', { _csrf, ...query }, () => variaveisGlobais.controlarVisibilidade('ocultar', '#mensagens-genericas'));
  if (planids.length) {
    consolidaPlanid.semestre = semestre;
    csvDOM();
  } else {
    variaveisGlobais.exibirMensagem(`<h3>Não há planids registrados no semestre ${semestre}</h3>`)
  }
}

const iniciarModulo = () => {
  document.querySelector(`.planids-consolidacao__selecao-semestre`).innerHTML = selecaoSemestre;
  document.querySelector(`.form-selecao-semestre`).addEventListener('submit', selecionarSemestreHandler);
}

document.addEventListener('DOMContentLoaded', iniciarModulo);