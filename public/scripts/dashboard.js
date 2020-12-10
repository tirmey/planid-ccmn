"use strict";

/* const CHAMADOS_DE_MANUTENCAO = "CHAMADOS DE MANUTENÇÃO";
const MENSAGENS = "MENSAGENS";
const MEU_VEICULO = "MEU VEÍCULO";
const RESERVAS_DE_ESPACOS = "RESERVAS DE ESPAÇOS"; */
const MEUS_PLANIDS = "MEUS PLANIDS";
/* const USUARIO_ALMOXARIFADO = "ALMOXARIFADO"; */
const domain = window.location.host;
//ESTADO DA DASHBOARD
let dashboard = {
  user: {},
 /*  mdms: [],
  aplicacoesGerais: [MENSAGENS],
  aplicacoesCorpoSocial: [MEU_VEICULO],
  aplicacoesEstudantes: [],
  aplicacoesFuncionarios: [CHAMADOS_DE_MANUTENCAO], */
  aplicacoesDocentes: [MEUS_PLANIDS],
  /* aplicacoesTecnicos: [], */
  aplicacaoSelecionada: "",
  janelaAplicacoesAberta: false,
  csrfToken: document.querySelector(`input[name=_csrf]`).value,
  edicao: false,
  system: new URLSearchParams(window.location.search).get("dashboard-system"),
};
/////////////////////////////////////////////////////
//////////////  COMPONENTES USO GERAL  //////////////
/////////////////////////////////////////////////////

let adicionarObjBtn = (texto, classes) => `
  <div class="adicionar-objeto-btn">     
    <span class='text-shadow-inset ${classes || ''}'>${texto}</span>
  </div>
`;

const configsHTML = user => {
  return `
  <div class='dashboard-section__configuracoes__overlay overlay hidden opacidade-zero' data-fechar_configs='true'>
    <div class='dashboard-section__configuracoes__wrapper'>  
      <div class='dashboard-section__configuracoes__header'>
        <h3>Configurações:</h3>   
        <i class='fa fa-times fechar-janela-configuracoes' data-fechar_configs='true'></i>
      </div> 
      <div class='dashboard-section__configuracoes__body formulario'>      
        <div class='dashboard-section__configuracoes__editar-perfil-div'>
          <div>
            <i class='icone-editar-usuario fa fa-user'></i><p class='dashboard-section__configuracoes__editar-perfil'>Editar perfil</p>
          </div>
          <div>
            <a href='/alterarsenha'><i class='icone-nova-senha fa fa-key'></i><p class='dashboard-section__configuracoes__nova-senha'>Alterar senha</p></a>
          </div>
        </div>
        <div class='notificacoes-e-mensagens'>
          <div title='notificações sobre o andamento de serviços solicitados.'>
            <p>Notificações de serviços:</p>
            <div>
              <input type='checkbox' id='notificacoes-email' name='notifServicosEmail' ${
                user.notifServicos.email ? "checked" : ""
              }>
              <label for='notificacoes-email'>
                <span></span>Receber notificações por e-mail              
              </label>
            </div>            
          </div>
          <div title='Mensagens gerais da Decania do CCS'>
            <p>Mensagens gerais:</p>
            <div>
              <input type='checkbox' id='mensagens-email' name='mensagensGeraisEmail' ${
                user.mensagensGerais.email ? "checked" : ""
              }>
              <label for='mensagens-email'>
                <span></span>Receber mensagens por e-mail              
              </label>
            </div>
            <div>
              <input type='checkbox' id='mensagens-site' name='mensagensGeraisSite' ${
                user.mensagensGerais.site ? "checked" : ""
              }>
              <label for='mensagens-site'>
                <span></span>Receber mensagens em seu perfil do portal do CCS           
              </label>
            </div>
          </div>
        </div>
          <div>
            ${user.categoria !== 'docente' 
              ? `
              <button class='btn-deletar-perfil'>deletar perfil</button>
              ` 
              : ''
            }         
          </div> 
      </div>
    </div>
  </div>
`;
};

const telefonesString = tels => {
  let telefones = "";
  for (let i = 0; i < tels.length; i++) {
    telefones += `<p class='dashboard-section__dados-funcionais__dado'><strong>${tels[i].tipo}: </strong>${
      tels[i].numero
    }</p>`;
  }
  return telefones;
};

const recuperarContato = async () => {
  const userId = document.querySelector(`input[name=userId]`).value;
  dashboard.user = await variaveisGlobais.ajax("/users/recuperarContatoPorId", "get", {
    id: userId,
    populate: [
      { path: "planids", options: { sort: { semestre: -1 } } },
      { path: "manutencao", options: { sort: { estado: 1 }, select: "descricao identificacao estado" } },
      { path: "veiculo" }
    ]
  });
};

/////////////////////////////////////////////////
////////////// APLICAÇÕES INICIO ////////////////
/////////////////////////////////////////////////

const iniciarAplicacao = async (e, cb) => {
  document.querySelector(`.dashboard-section__aplicacoes-body`).innerHTML = "";
  document.querySelector(`.dashboard-section__aplicacoes`).classList.add("aberto");
  document.getElementById(e.target.innerHTML).classList.add("selected");
  dashboard.aplicacaoSelecionada = e.target.innerHTML;
  dashboard.janelaAplicacoesAberta = true;
  await cb();
};

const transicaoAplicacoes = async (e, cb) => {
  document.querySelector(`.dashboard-section__aplicacoes`).classList.remove("aberto");
  if (dashboard.aplicacaoSelecionada) {
    document.getElementById(dashboard.aplicacaoSelecionada).classList.remove("selected");
  }
  if (dashboard.janelaAplicacoesAberta) {
    if (e.target.innerHTML === dashboard.aplicacaoSelecionada) {
      setTimeout(() => {
        document.querySelector(`.dashboard-section__aplicacoes-body`).innerHTML = "";
        dashboard.janelaAplicacoesAberta = false;
        dashboard.aplicacaoSelecionada = "";
      }, 400);
    } else {
      await iniciarAplicacao(e, cb);
    }
  } else {
    await iniciarAplicacao(e, cb);
  }
};

const abrirListaAplicacoes = e => {
  if (!window.navigator.onLine) {
    return variaveisGlobais.exibirMensagem('<h3>Não há conexão ativa entre dispositivo e a internet. Tente acessar os sistemas do CCS mais tarde. Se o problema persistir, entre em contato conosco</h3>', null, 'Atenção!');
  } 
  if (e.target.classList.contains("aplicacao-item-lista")) {
    variaveisGlobais.scrollTo(".dashboard-section__aplicacoes-header", -100);
    switch (e.target.innerHTML) {
      
      case MEUS_PLANIDS:
        if (!document.querySelector(`script[src="/dist/scripts/planidUtils.min.js"]`)) {
          loadScript(
            "/dist/scripts/planidUtils.min.js", 
            () => loadScript("/dist/scripts/dashboardPlanid.min.js", () => transicaoAplicacoes(e, rotinasPlanid))
          );    
        } else {
          transicaoAplicacoes(e, rotinasPlanid)
        }
        break;
      
        break;             
      default:
        break;
    }
  }
};

const preencherAplicacoes = () => {
  let minhasAplicacoes,
    html = "<ul>";
  switch (dashboard.user.categoria) {
    case "docente":
      minhasAplicacoes = [
        ...dashboard.aplicacoesDocentes
      ];
      break;
    default:
      break;
  }


  for (let i = 0; i < minhasAplicacoes.length; i++) {
    html += `<li class='aplicacao-item-lista' id='${minhasAplicacoes[i]}'>${minhasAplicacoes[i]}</li>`;
  }
  html += "</ul>";
  document.querySelector(`.dashboard-section__aplicacoes-header`).innerHTML = html;
};

const montarAplicacoes = () => {
  preencherAplicacoes();
  document.querySelector(`.dashboard-section__aplicacoes-header`).addEventListener("click", abrirListaAplicacoes);
};

////////////////////////////////////////////
////////////// DADOS GERAIS ////////////////
////////////////////////////////////////////

const preencherIdUsuario = () => {
  let categoriaTexto;
  switch (dashboard.user.categoria) {
    case "docente":
      categoriaTexto = `Professor ${dashboard.user.classe}`;
      break;
    default:
      break;
  }
  const removerFotoDOM = dashboard.user.foto
    ? `
    <hr>
    <div class='dashboard-section__user-details__imagem-usuario-edicao-foto dashboard-section__user-details__remover-imagem'>
      <i class='fa fa-times'></i>
      <span>remover foto</span>
    </div> `
    : ``;
  document.querySelector(`.dashboard-section__user-details`).innerHTML = `
    <div class='dashboard-section__user-details__container'>
      <div class='dashboard-section__user-details__imagem-usuario-container'>
        <div class='dashboard-section__user-details__imagem-usuario'>
          <div class='dashboard-section__user-details__imagem-usuario-overlay ${dashboard.user.foto ? "" : "single"}'>
            <div class='dashboard-section__user-details__imagem-usuario-edicao-foto dashboard-section__user-details__nova-imagem'>
              <i class='fa fa-camera'></i>
              <span>nova foto</span>
            </div>
            ${removerFotoDOM}
          </div>
          ${
            dashboard.user.foto
              ? `<img src='https://res.cloudinary.com/webdev-ccs/image/upload/${dashboard.user.foto}.jpg'>`
              : `<span class='dashboard-section__nome-usuario-inicial'>${textoCamelCase(
                  dashboard.user.nome[0]
                ).toUpperCase()}</span>`
          }
        </div>
      </div>
      <div id='cropper' class='cropper opacidade-zero hidden'></div>
      <p class='dashboard-section__user-details__nome-usuario'>${dashboard.user.nome}</p>
      <p class='dashboard-section__user-details__categoria-usuario'>${categoriaTexto}</p>
      <p class='dashboard-section__user-details__email-usuario'>${dashboard.user.email}</p>
    </div>
  `;
};

const preencherDadosFuncionais = () => {
  const { user } = dashboard;
  let localizacao = "";
  if (
    (user.categoria === "docente" || user.categoria === "tecnico") &&
    (user.unidadeLocalizacao && user.unidadeLotacao !== user.unidadeLocalizacao)
  ) {
    localizacao = `
      <p class='dashboard-section__dados-funcionais__dado'><span>Unidade de lotação:</span>${user.unidadeLotacao}</p>
      <p class='dashboard-section__dados-funcionais__dado'><span>Unidade de localização:</span>${
        user.unidadeLocalizacao
      }</p>
    `;
  } else if (user.unidadeLotacao) {
    localizacao = `<p class='dashboard-section__dados-funcionais__dado'><span>Unidade:</span>${
      user.unidadeLotacao
    }</p>`;
  }
  document.querySelector(`.dashboard-section__dados-gerais`).innerHTML = `  
  <div class='dashboard-section__ultimo-acesso'>Último acesso em ${moment(user.ultimoAcesso[1]).format(
    "DD [de] MMMM [de] YYYY, [às] HH:mm"
  )}h</div>
  <div class='dashboard-section__dados-funcionais'>      
    <h3 class='fonte-titulo'>Dados funcionais</h3>  
    <div>
      <i class='fa fa-cog dashboard-section__dados-funcionais__configuracoes'></i>
      <span class='dashboard-section__dados-funcionais__configuracoes-texto'>configurações</span>
    </div>  
    <p class='dashboard-section__responsabilidade'>As informações aqui prestadas são de inteira responsabilidade do utilizador do portal do CCS e não são válidas para comprovação de vínculo com o Centro de Ciências da Saúde da UFRJ.</p>
    ${localizacao}
    <p class='dashboard-section__dados-funcionais__dado'><span>Identificação:</span>${
      user.identificacao
    } (${user.tipoIdentificacao.toUpperCase()})</p>
    ${
      user.titulacao
        ? `<p class='dashboard-section__dados-funcionais__dado'><span>Titulação:</span> ${user.titulacao}</p>`
        : ""
    }
    ${user.setor ? `<p class='dashboard-section__dados-funcionais__dado'><span>Setor:</span> ${user.setor}</p>` : ""}
    ${user.bloco ? `<p class='dashboard-section__dados-funcionais__dado'><span>Bloco:</span> ${user.bloco}</p>` : ""}
    ${
      user.endereco
        ? `<p class='dashboard-section__dados-funcionais__dado'><span>Endereço:</span> ${user.endereco}</p>`
        : ""
    }
    ${
      user.departamento
        ? `<p class='dashboard-section__dados-funcionais__dado'><span>Departamento:</span>${user.departamento}</p>`
        : ""
    }
    ${user.classe ? `<p class='dashboard-section__dados-funcionais__dado'><span>Classe:</span>${user.classe}</p>` : ""}
    ${user.regime ? `<p class='dashboard-section__dados-funcionais__dado'><span>Regime:</span>${user.regime}</p>` : ""}
    ${
      user.vinculo
        ? `<p class='dashboard-section__dados-funcionais__dado'><span>Vínculo:</span>${user.vinculo}</p>`
        : ""
    }
    ${
      user.cursoGrad
        ? `<p class='dashboard-section__dados-funcionais__dado'><span>Curso:</span>${user.cursoGrad}</p>`
        : ""
    }
    ${
      user.cursoPG ? `<p class='dashboard-section__dados-funcionais__dado'><span>Curso:</span>${user.cursoPG}</p>` : ""
    }    
    ${
      user.telefones
        ? `<p class='dashboard-section__dados-funcionais__dado'><span>Telefones:</span></p> <div class='dashboard-section__telefones-div'>${telefonesString(
            user.telefones
          )}</div>`
        : ""
    }
  </div>`;
};

const editarPerfil = () => {
  if (!dashboard.edicao) {
    loadScript("/dist/scripts/usersEdit.min.js", () => {});
    dashboard.edicao = true;
  } else {
    rotinasEdicao();
  }
};

const cropperRoutines = cropper => {
  document.getElementById(`cropper`).insertAdjacentHTML(
    "beforeend",
    `
    <div class='button-div foto-usuario__button-div'>
      <button class='foto-usuario-send btn-acao-confirmar'>enviar foto</button>
      <button class='cancel btn-acao-cancelar'>cancelar</button>
    </div>
  `
  );
  document.querySelector(`.foto-usuario__button-div`).addEventListener(`click`, e => {
    if (e.target.classList.contains("cancel")) {
      cropper.destroy();
      variaveisGlobais.controlarVisibilidade("ocultar", "#cropper");
      setTimeout(() => {
        document.getElementById(`cropper`).innerHTML = "";
        variaveisGlobais.controlarVisibilidade("exibir", ".dashboard-section__user-details__imagem-usuario-container");
      }, 600);
    } else if (e.target.classList.contains("foto-usuario-send")) {
      cropper.result("blob").then(blob => {
      });
    }
  });
};

const initCropper = e => {
  variaveisGlobais.controlarVisibilidade("ocultar", ".form-nova-foto");
  const el = document.getElementById("cropper");
  const cropper = new Croppie(el, {
    viewport: { width: 150, height: 150, type: "circle" },
    boundary: { width: 200, height: 200 },
    showZoomer: true,
    enableOrientation: true
  });
  cropper.bind({
    url: window.URL.createObjectURL(e.target.files[0])
  });
  cropperRoutines(cropper);
};

const rotinasNovaImagem = () => {
  variaveisGlobais.controlarVisibilidade("ocultar", `.dashboard-section__user-details__imagem-usuario-container`);
  if (!document.getElementById(`upload-foto`)) {
    loadScript("/dist/scripts/croppie.min.js", () => {});
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js", () => {});
    document.getElementById(`cropper`).insertAdjacentHTML(
      "afterbegin",
      `
      <form class='formulario form-nova-foto'>   
        <label>
          <p>Selecionar arquivo:</p>
        </label>    
        <div class="anexo file-upload">   
          <div style='width:100%; color: #cccccc;'>
            <label class="label-upload" for="upload-foto" id="label-upload-foto">
                <i class="fa fa-upload manipular-arquivo"></i><span class="span-anexar">Anexar Arquivo</span>
            </label>
            <input type="file" name="anexo" id="upload-foto" class="anexo" required>
          </div>         
        </div> 
      </form>
    `
    );
    variaveisGlobais.controlarVisibilidade("exibir", "#cropper");
    document.getElementById(`upload-foto`).addEventListener("change", initCropper);
  }
};


const fotoHandler = e => {
  if (e.target.classList.contains("dashboard-section__user-details__nova-imagem")) {
    rotinasNovaImagem();
  } else if (e.target.classList.contains("dashboard-section__user-details__remover-imagem")) {
    document.querySelector(
      `.dashboard-section__user-details__container`
    ).innerHTML = `<img src='/img/loading.svg' alt='foto ${dashboard.user.nome}'>`;
    
  }
};

const definirOpcoesMensagem = e => {
  let prop;
  switch (e.target.name) {
    case "notifServicosEmail":
      prop = "notifServicos.email";
      break;
    case "mensagensGeraisSite":
      prop = "mensagensGerais.site";
      break;
    case "mensagensGeraisEmail":
      prop = "mensagensGerais.email";
      break;
    default:
      break;
  }
  const elements = JSON.stringify({ [prop]: e.target.checked });
  variaveisGlobais.ajax("/users/cadastro/editar-usuario", "POST", { _csrf: dashboard.csrfToken, elements });
};

const deletarPerfilHandler = e => {
  if (e.target.classList.contains("btn-acao-cancelar")) {
    operacaoDB();
    variaveisGlobais.ajax("/signout", "GET");
    const cb = () => {
      const msg = `
        <h3>${dashboard.user.nome.split(" ")[0]},</h3>
        <p>Lamentamos sua partida! Caso resolva reativar seu antigo cadastro, basta realizar login em 90 dias contados a partir de hoje. Após este prazo, seu cadastro será excluído definitivamente. Por fim, pedimos que registre em nossa <a href='/fale-conosco'>central de atendimento</a> o motivo deste cancelamento.</p>
        <p>Atenciosamente,</p>
        <p>Assessoria de Desenvolvimento Web</p>
        <p>Centro de Ciências da Saúde da UFRJ</p>
        <div class='btn-div'>
          <button class='retornar-pagina-principal'>Retornar ao Portal do CCS</button>
        </div>
      `;
      variaveisGlobais.exibirMensagem(msg, null, "perfil excluído");
      document
        .querySelector(`.retornar-pagina-principal`)
        .addEventListener("click", () => (window.location.href = "/"));
    };
    variaveisGlobais.ajax(
      "/users/cadastro/editar-usuario",
      "POST",
      { _csrf: dashboard.csrfToken, elements: JSON.stringify({ excluido: true }) },
      cb
    );
  } else if (e.target.classList.contains("btn-acao-confirmar")) {
    variaveisGlobais.controlarVisibilidade("ocultar", "#mensagens-genericas");
  }
};

const deletarPerfil = () => {
  const msg = `
    <h3>Tem certeza de que deseja excluir este perfil?</h3>    
    <div class='btn-div eliminar-perfil'>
      <button class='btn-acao-cancelar btn-apagar-perfil'>sim</button>
      <button class='btn-acao-confirmar'>não</button>
    </div>
  `;
  variaveisGlobais.exibirMensagem(msg, null, "Atenção!");
  document.querySelector(`.eliminar-perfil`).addEventListener("click", deletarPerfilHandler);
};

const fecharJanelaConfigs = e => {
  if (e.target.dataset.fechar_configs) {
    variaveisGlobais.controlarVisibilidade("ocultar", ".dashboard-section__configuracoes__overlay");
    document.querySelectorAll(`body`)[0].classList.remove("fixed");
  }
};

const listenersConfig = () => {
  document.querySelector(`.dashboard-section__configuracoes__editar-perfil`).addEventListener("click", editarPerfil);
  document.querySelector(`.notificacoes-e-mensagens`).addEventListener("click", definirOpcoesMensagem);
  if (dashboard.user.categoria !== 'docente') {
    document.querySelector(`.btn-deletar-perfil`).addEventListener("click", deletarPerfil);
  }
  document.querySelector(`.dashboard-section__configuracoes__overlay`).addEventListener("click", fecharJanelaConfigs);
};

const dashboardConfigs = e => {
  // FIXANDO O BODY
  document.querySelectorAll(`body`)[0].classList.add("fixed");

  // exibindo a janela de configurações
  document.querySelector(`.wrapper`).insertAdjacentHTML("afterbegin", configsHTML(dashboard.user));
  variaveisGlobais.controlarVisibilidade("exibir", ".dashboard-section__configuracoes__overlay");

  // adicionando listeners ao div de configurações
  listenersConfig();
};

const montarListenersDashboard = () => {
  document
    .querySelector(`.dashboard-section__user-details__imagem-usuario-overlay`)
    .addEventListener("click", fotoHandler);
  document
    .querySelector(`.dashboard-section__dados-funcionais__configuracoes`)
    .addEventListener("click", dashboardConfigs);
};

const preencherDadosGerais = () => {
  preencherIdUsuario();
  preencherDadosFuncionais();
  montarListenersDashboard();
};

/////////////////////////////////////////////////////
////////////// ROTINAS INICIALIZAÇÃO ////////////////
/////////////////////////////////////////////////////

const iniciarPrograma = async () => {

  if (!faultyBrowserHandler()) {
    await recuperarContato();
    preencherDadosGerais();
    montarAplicacoes();  
  
    if (dashboard.system) {
      setTimeout(() => {
        document.getElementById(dashboard.system).click();
      }, 500);
    }
  }
};

document.addEventListener(`DOMContentLoaded`, iniciarPrograma);
