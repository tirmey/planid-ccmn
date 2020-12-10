//////////////////////
//////// VARIÁVEIS GLOBAIS
//////////////////////

const faultyBrowserHandler = () => {
  const 
    ua = window.navigator.userAgent,
    msie = ua.indexOf('MSIE '),
    trident = ua.indexOf('Trident/'),
    edge = ua.indexOf('Edge/'),
    isSafari = navigator.vendor && 
    navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') == -1 &&
    navigator.userAgent.indexOf('FxiOS') == -1;  
  if (isSafari || edge > 0 || trident > 0 || msie > 0) {
    window.alert('Os Navegadores Internet Explorer e Safari não são suportados pelos sistemas do CCS. Indicamos a utilização dos navegadores Chrome ou Firefox.');  
    window.close();  
  } 
};

const browserOlderVersion = () => {   
  var chrome = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
  if (chrome && parseInt(chrome[2], 10) < 49) {  
    window.alert('A versão do navegador chrome utilizada é muito antiga. É necessário atualizar este navegador para acessar o portal do CCS');
    window.location.href = 'https://www.google.com/intl/pt-BR/chrome/';
  }  

  var firefox = window.navigator.userAgent.match(/Firefox\/([0-9]+)\./);    
  var FFVer = firefox ? parseInt(firefox[1]) : false;
  if (FFVer && FFVer < 43) {
    window.alert('A versão do navegador firefox utilizada é muito antiga. É necessário atualizar este navegador para acessar o portal do CCS');
    window.location.href = 'https://www.mozilla.org/pt-BR/firefox/new/';    
  }  
};

faultyBrowserHandler();
browserOlderVersion();

var variaveisGlobais = (function() {
  var selectedN1,
    selectedN1Old,
    selectedN2,
    selectedN2Old,
    selectedN3,
    selectedN3Old,
    reservas,
    dataSelecionada,
    antecedenciaMinima = 2,
    antecedenciaMaximaNumber = 8,
    antecedenciaMaximaSub, // valor a subtrair de antecedenciaMaximaNumber, quando o último dia é sábado ou domingo
    antecedenciaMaxima = `+${antecedenciaMaximaNumber}m`,
    intervalos = [8, 10, 12, 13, 15, 17, 18],
    videos,
    fotos,
    disabled = false,
    //defiinição do tamnho máximo de arquivo para upload no site (sem considerar as configs do nginx)
    tamanhoMaximoUpload = 3 * 1024 * 1024,
    tamanhoMaximoArquivo = 1024 * 1024;

  ////////////////////////////
  //////// funções globais
  ////////////////////////////

  //alternar os ícones caret-up e caret-down
  var trocarSeta = function(elemento) {
    elemento.classList.toggle("fa-caret-up");
    elemento.classList.toggle("fa-caret-down");
  };

  //argumentos -
  //acao - String: "ocultar" ou "exibir".
  //seletor - String: classe ou ID do elemento no DOM;
  //eliminar - Bool: se o elemento deve ser eliminado do DOM após ocultá-lo;
  var controlarVisibilidade = function(acao, seletor, eliminar) {
    const elemento = document.querySelector(seletor);
    if (acao === "exibir") {
      elemento.classList.remove("hidden");
      setTimeout(function() {
        elemento.classList.remove("opacidade-zero");
      }, 50);
    } else {
      elemento.classList.add("opacidade-zero");
      setTimeout(function() {
        elemento.classList.add("hidden");
        if (eliminar) {
          elemento.outerHTML = "";
        }
      }, 500);
    }
  };

  //mensagem - mensagem a ser exibida | t - tempo de exibição |header - mensagem a ser exibida no header.
  var exibirMensagem = (mensagem, t, header, closeIconHandler) => {
    const ocultarMensagem = e => {
      if (e.target.id === 'mensagens-genericas' || e.target.classList.contains('icone-fechar-janela')) {
        controlarVisibilidade('ocultar', '#mensagens-genericas', true);
      }
    };
    
    let mensagemDIV,
      overlay = "#mensagens-genericas";
    if (document.getElementById(`mensagens-genericas`)) {
      document.getElementById(`mensagens-genericas`).outerHTML = "";
    }
    const closeIcon = t ? '' : '<i class="fa fa-times icone-fechar-janela"></i>';
    document.querySelectorAll(`body`)[0].insertAdjacentHTML(
      "beforeend",
      `
      <div id='mensagens-genericas' class='opacidade-zero hidden display-only'>
          <div id="mensagens-genericas__janela" class="janela"></div>
      </div>`
    );
    mensagemDIV = document.getElementById(`mensagens-genericas__janela`);    
    mensagemDIV.innerHTML = `
        <h2 class="header">
          ${header || 'Atenção!'}
          ${closeIcon}
        </h2>        
        ${mensagem}
        `;
    controlarVisibilidade("exibir", overlay, true);
    if (t) {
      setTimeout(function() {
        controlarVisibilidade("ocultar", overlay, true);
      }, t);
    } else {
      document.querySelector(`#mensagens-genericas .icone-fechar-janela`).addEventListener('click', closeIconHandler ? closeIconHandler : ocultarMensagem);      
    }
  };

  // REMOVENDO OS PRELOADERS
  function removePreLoaders(classe) {
    for (let i = document.querySelectorAll(".loading" + classe).length - 1; i >= 0; i--) {
      document.querySelectorAll(".loading" + classe)[i].outerHTML = "";
    }
  }


  //função para impedir múltiplos cliques
  var clickingOnce = function(time) {
    if (!time) {
      time = 10000;
    }
    variaveisGlobais.disabled = true;
    setTimeout(function() {
      variaveisGlobais.disabled = false;
    }, time);
  };

  const validarEmail = email => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  // selector - entity to scroll to (could be a selector OR an element)
  // offset - distance from top to elementToTop
  // callback - callback to execute after the scroll finish
  // container - scrollable container that contains the selector
  //selectorTop - element above the selector, to stay on top of the screen
  let scrollTo = (selector, offset = 0, callback, container = "html", velocity = "slow") => {
    let scrollAmount;
    if (container !== "html") {
      if (typeof selector === "string") {
        scrollAmount = $(selector).offset().top - $(container).offset().top + offset;
      } else {
        scrollAmount = $(selector).offset().top - $(container).offset().top + offset;
      }
    } else {
      scrollAmount = $(selector).offset().top + offset;      
    }
    $(container).animate({ scrollTop: scrollAmount }, velocity, function() {
      if (callback) {
        callback();
      }
    });
  };

  //requisição AJAX universal
  //Parâmetros: url - a URL da rota que irá tratar a requisição | verb: GET or POST | data: um objeto a ser tratado pelo server na rota destino | callback e callbackError (optional): funções a serem executadas depois do retorno da requisição.
  //Por padrão, a função requisicao_ajax retorna a resposta do servidor (msg),
  //Dependencies: JQuery
  var ajax = async (paramUrl, verb, data, callback, callbackError) => {
    let response;
    await $.ajax({
      type: verb,
      url: paramUrl,
      data: data,
      dataType: "json"
    })
      .done(function(msg) {
        response = msg;
        if (callback) {
          callback(msg);
        }
      })
      .fail(function(msg) {
        response = msg;
        if (callbackError) {
          callbackError(msg);
        }
      });
    return response;
  };

  const maximoCaracteres = (string, limite) => {
    return string.length > limite ? `${string.substr(0, limite)}...` : string;
  };

  //ordena objetos em um array, baseada em uma propriedade qualquer
  const ordenar = (a, b, ordem, prop) => {
    if ((isNaN(+a[prop]) ? a[prop].toLowerCase() : +a[prop]) < (isNaN(+b[prop]) ? b[prop].toLowerCase() : +b[prop])) {
      return ordem === "direta" ? -1 : 1;
    } else if ((isNaN(+a[prop]) ? a[prop].toLowerCase() : +a[prop]) > (isNaN(+b[prop]) ? b[prop].toLowerCase() : +b[prop])) {
      return ordem === "direta" ? 1 : -1;
    } else {
      return 0;
    }
  };

  const getSelectedOption = (list, value) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i].value === value) {
        list[i].selected = true;
        break;
      }
    }
  };

  //type: 'radio' or 'checkbox'
  const getCheckedOrSelected = (list, type) => {
    let values = [],
      value = "";
    for (let i = 0; i < list.length; i++) {
      if (list[i].checked && type === "radio") {
        value = list[i].value;
        break;
      } else if (list[i].checked && type === "checkbox") {
        values.push(list[i].value);
      }
    }
    return type === "radio" ? value : values;
  };

  const isMobileDevice = () => {
    return typeof window.orientation !== "undefined" || navigator.userAgent.indexOf("IEMobile") !== -1;
  };

  return {
    //variáveis
    dataSelecionada,
    reservas,
    selectedN1,
    selectedN1Old,
    selectedN2,
    selectedN2Old,
    selectedN3,
    selectedN3Old,
    antecedenciaMinima,
    antecedenciaMaxima,
    antecedenciaMaximaNumber,
    antecedenciaMaximaSub,
    intervalos,
    videos,
    fotos,
    disabled,
    tamanhoMaximoArquivo,
    tamanhoMaximoUpload,
    //funções
    controlarVisibilidade,
    exibirMensagem,
    trocarSeta,
    removePreLoaders,
    clickingOnce,
    scrollTo,
    ajax,
    validarEmail,
    maximoCaracteres,
    ordenar,
    getSelectedOption,
    getCheckedOrSelected,
    isMobileDevice
  };
})();

////////////////////////////////////////////////
//////// FUNCIONALIDADES TOPBAR E MENU
////////////////////////////////////////////////

//fechar menus ao clicar fora do menu em questão ou de seus elementos relacionados. "Elemento opcional" é qualquer elemento e seus descendentes que não seja descendente do menu a ser fechado, mas serve para acioná-lo, ou está vinculado de alguma maneira. classes vinculadas é um array de classes que, caso estejam presentes no elemento clicado, indicam que o menu deve continuar aberto
var fecharMenus = function(e, menu, icone, elementoOpcional, classesVinculadas) {
  var menuAberto = false;
  if (menu) {
    for (let i = 0; i < menu.querySelectorAll("*").length; i++) {
      if (e.target === menu.querySelectorAll("*")[i] || e.target === menu) {
        menuAberto = true;
        break;
      }
    }
  }
  if (elementoOpcional && !menuAberto) {
    for (let i = 0; i < elementoOpcional.querySelectorAll("*").length; i++) {
      if (e.target === elementoOpcional || elementoOpcional.querySelectorAll("*")[i] === e.target) {
        menuAberto = true;
        break;
      }
    }
  }
  if (classesVinculadas && !menuAberto) {
    for (let i = 0; i < classesVinculadas.length; i++) {
      if (e.target.classList.contains(classesVinculadas[i])) {
        menuAberto = true;
        break;
      }
    }
  }
  if (!menuAberto) {
    menu.classList.remove("aberto");
    if (icone) {
      icone.classList.remove("fa-caret-up");
      icone.classList.add("fa-caret-down");
    }
  }
};

//rolar a desktopbar para o topo
var desktopBarTopo = function() {
  variaveisGlobais.scrollTo(".top-bar-desktop", 2);
};

var animarTopbar = function() {
  //Animar topbar (mobile layout)
  if (window.pageYOffset > 100 && !document.querySelector(".top-bar").classList.contains("topbar-up")) {
    document.querySelector(".top-bar").classList.add("topbar-up");
  }
  if (window.pageYOffset < 100 && document.querySelector(".top-bar").classList.contains("topbar-up")) {
    document.querySelector(".top-bar").classList.remove("topbar-up");
  }
  if (window.innerWidth >= 1024) {
    //Animar topbar e agenda (desktop layout - pagina principal)
    if (
      document.querySelector(".slideshow") &&
      document.querySelector(".sobre-o-ccs").getBoundingClientRect().top <= 0
    ) {
      document.querySelector(".top-bar-desktop").classList.add("fixed");
      document.getElementById("main-nav").classList.add("fixed");
      document.getElementById("secao-agenda").classList.add("fixed");
      document.getElementById("secao-agenda").style.top = "50px";
    } else if (document.querySelector(".slideshow")) {
      document.querySelector(".top-bar-desktop").classList.remove("fixed");
      document.getElementById("main-nav").classList.remove("fixed");
      document.getElementById("secao-agenda").classList.remove("fixed");
      document.getElementById("secao-agenda").style.top = "0";
    }

    //Animar topbar e agenda (desktop layout - demais páginas)
    if (window.innerWidth >= 1024 && !document.querySelector(".slideshow")) {
      if (document.getElementById("barra-brasil").getBoundingClientRect().top < 0) {
        document.querySelector(".top-bar-desktop").classList.add("fixed");
        document.getElementById("main-nav").classList.add("fixed");
        if (document.getElementById("secao-agenda")) {
          document.getElementById("secao-agenda").classList.add("fixed");
          document.getElementById("secao-agenda").style.top = "50px";
        }
      } else {
        document.querySelector(".top-bar-desktop").classList.remove("fixed");
        document.getElementById("main-nav").classList.remove("fixed");
        if (document.getElementById("secao-agenda")) {
          document.getElementById("secao-agenda").classList.remove("fixed");
          document.getElementById("secao-agenda").style.top = "82px";
        }
      }
    }
  }
};

window.addEventListener(
  "scroll",
  function() {
    animarTopbar();
  },
  false
);

//eventos de clique na página
window.addEventListener("click", e => {
  var acessoRapidoDesktop = document.querySelector(".acesso-rapido-desktop"),
    acessoRapidoIcone = document.querySelector(".acesso-rapido-desktop i"),
    loginFormDesktop = document.querySelector(".login-form-desktop"),
    loginFormIcone = document.querySelector(".login-seta"),
    agenda = document.getElementById("secao-agenda"),
    filtroResultados = document.querySelector(".filtro-resultados"),
    filtroResultadosIcone = document.querySelector(".icone-refinar-busca");
  if (document.getElementById("carrinho-horarios")) {
    var resumoReserva = document.getElementById("carrinho-horarios");
  }
  if (window.innerWidth >= 1024) {
    //fechando o menu, em resouções >= 1024px, ao se clicar em outros elementos
    if (!e.target.classList.contains("menu") && e.target.id !== "abrir-menu-desktop") {
      var iconeMobile = document.querySelector(".icone-menu-mobile");
      var iconeDesktop = document.getElementById("abrir-menu-desktop");
      document.getElementById("main-nav").classList.remove("action");
      document.querySelector("body").classList.remove("noScroll");
      for (let i = 0; i < document.querySelectorAll(".deslocar").length; i++) {
        document.querySelectorAll(".deslocar")[i].classList.remove("action");
      }
    }

    //fechando os menus da topbar, quando é aberto o menu principal
    if (e.target.id === "abrir-menu-desktop") {
      var janelasAbertas = document.querySelectorAll(".aberto");
      var icones = document.querySelectorAll(".aberto .fa");

      for (let i = janelasAbertas.length - 1; i >= 0; i--) {
        janelasAbertas[i].classList.remove("aberto");
        if (
          icones[i] &&
          (icones[i].classList.contains("fa-caret-down") || icones[i].classList.contains("fa-caret-up"))
        ) {
          variaveisGlobais.trocarSeta(icones[i]);
        }
      }
      if (!e.target.classList.contains("fechar-carrinho")) {
        e.target.classList.toggle("fa-bars");
        e.target.classList.toggle("fa-times");
      }

      setTimeout(function() {
        document.getElementById("main-nav-titulo").classList.toggle("hidden");
      }, 500);
    }

    //clicar no ícone agenda da top-bar-desktop
    if (!document.querySelector(".reservar-auditorio")) {
      if (document.getElementById("secao-agenda") && e.target.classList.contains("agenda-desktop-clicavel")) {
        document.getElementById("secao-agenda").classList.toggle("aberto");
      }

      if (
        e.target.classList.contains("agenda-desktop-clicavel") &&
        document.getElementById("secao-agenda").classList.contains("aberto")
      ) {
        desktopBarTopo();
      }
    } else {
      if (e.target.classList.contains("agenda-desktop-clicavel")) {
        variaveisGlobais.scrollTo("#datepickerDiaEvento", -180);
      }
    }

    //fechando menus da top-bar-desktop não selecionados
    fecharMenus(e, loginFormDesktop, loginFormIcone);
  } else {
    document.getElementById("main-nav").style.top = 0;
  }
});

//exibir mapa do site
document.querySelector(".mapa-div").addEventListener("click", function(e) {
  e.preventDefault();
  variaveisGlobais.mapaDOM();
});

//animar menu principal
document.querySelector(".icone-menu-mobile").addEventListener(
  "click",
  function() {
    document.getElementById("main-nav").classList.toggle("action");
    for (i = 0; i < document.querySelectorAll(".deslocar").length; i++) {
      document.querySelectorAll(".deslocar")[i].classList.toggle("action");
    }
    document.querySelector("body").classList.toggle("noScroll");
    if ($(window).width() < 1024) {
      if (document.querySelector(".icone-menu-mobile").classList.contains("fa-bars")) {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
      setTimeout(function() {
        document.querySelector(".icone-menu-mobile").classList.toggle("fa-bars");
        document.querySelector(".icone-menu-mobile").classList.toggle("fa-times");
        document.getElementById("abrir-menu-desktop").classList.toggle("fa-bars");
        document.getElementById("abrir-menu-desktop").classList.toggle("fa-times");
      }, 500);
    }
  },
  false
);

////////////////////////////////////////////
/////////// CONTROLE DE LOGIN
////////////////////////////////////////////

//login em desktops
if (document.querySelector(".login-header")) {
  for (let i = 0; i < document.querySelectorAll(".login-header").length; i++) {
    document.querySelectorAll(".login-header")[i].addEventListener("click", function(e) {
      if (e.target.classList.contains("numero-mensagens-usuario")) {
        window.location.href = "/users/dashboard?dashboard-system=MENSAGENS";
      } else {
        if (window.innerWidth >= 1024) {
          desktopBarTopo();
        }
        variaveisGlobais.trocarSeta(document.querySelectorAll(".login-header .seta")[i]);
        if (document.querySelectorAll(".login-seta")[i].classList.contains("fa-caret-down")) {
          document.querySelectorAll(".form-login-topbar")[i].classList.remove("aberto");
          if (document.querySelectorAll(".login-form-desktop")[i]) {
            document.querySelectorAll(".login-form-desktop")[i].classList.remove("aberto");
          }
        } else {
          document.querySelectorAll(".form-login-topbar")[i].classList.add("aberto");
          if (document.querySelectorAll(".login-form-desktop")[i]) {
            document.querySelectorAll(".login-form-desktop")[i].classList.add("aberto");
          }
        }
      }
    });
  }

  // correção de bug que ocorre quando a jqanela de login se fecha sem que o input perca foco.
  for (let i = 0; i < document.querySelectorAll(`.form-login-topbar input`).length; i++) {
    document.querySelectorAll(`.form-login-topbar input`)[i].addEventListener("input", e => {
      if (
        !document.querySelector(`.login-form-desktop`).classList.contains("aberto") &&
        document.querySelector(`.form-login-topbar`).classList.contains("aberto")
      ) {
        document.querySelector(`.form-login-topbar`).classList.add("aberto");
        document.querySelector(`.login-form-desktop`).classList.add("aberto");
      }
    });
  }
}



