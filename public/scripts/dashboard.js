"use strict";


const domain = window.location.host;
//ESTADO DA DASHBOARD
let dashboard = {
  user: {},  
  janelaAplicacoesAberta: false,
  edicao: false,
};
/////////////////////////////////////////////////////
//////////////  COMPONENTES USO GERAL  //////////////
/////////////////////////////////////////////////////

let adicionarObjBtn = (texto, classes) => `
  <div class="adicionar-objeto-btn">     
    <span class='text-shadow-inset ${classes || ''}'>${texto}</span>
  </div>
`;

const recuperarContato = async () => {
  const userId = document.querySelector(`input[name=userId]`).value;
  dashboard.user = await variaveisGlobais.ajax("/users/recuperarContatoPorId", "get", {
    id: userId,
    populate: [
      { path: "planids", options: { sort: { semestre: -1 } } },      
    ],
  });
};

/////////////////////////////////////////////////
////////////// APLICAÇÕES INICIO ////////////////
/////////////////////////////////////////////////

const montarAplicacoes = () => {
  document.querySelector(`.dashboard-section__aplicacoes-header`).innerHTML = `
    <ul>
      <li class='aplicacao-item-lista' id='MEUS PLANIDS'>MEUS PLANIDS</li>
    </ul>
  `;  
  
  loadScript(
    "/dist/scripts/planidUtils.min.js", 
    () => loadScript("/dist/scripts/dashboardPlanid.min.js", () => rotinasPlanid())
  );
};


/////////////////////////////////////////////////////
////////////// ROTINAS INICIALIZAÇÃO ////////////////
/////////////////////////////////////////////////////

const iniciarPrograma = async () => {  
  await recuperarContato();
  montarAplicacoes();
  
};

document.addEventListener(`DOMContentLoaded`, iniciarPrograma);
