"use strict"

const variaveisGlobais = (function() {  

  ////////////////////////////
  //////// funções globais
  ////////////////////////////

  //argumentos 
  //acao - String: "ocultar" ou "exibir".
  //seletor - String: classe ou ID do elemento no DOM;
  //eliminar - Bool: se o elemento deve ser eliminado do DOM após ocultá-lo;
  const controlarVisibilidade = (acao, seletor, eliminar) => {
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
  const exibirMensagem = (mensagem, t, header, closeIconHandler) => {
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

  const validarEmail = email => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  // selector - entity to scroll to (could be a selector OR an element)
  // offset - distance from top to elementToTop
  // callback - callback to execute after the scroll finish
  // container - scrollable container that contains the selector
  //selectorTop - element above the selector, to stay on top of the screen
  let scrollTo = (selector, offset = 0, callback, container = "html") => {
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
    $(container).animate({ scrollTop: scrollAmount }, "slow", function() {
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
    controlarVisibilidade,
    exibirMensagem,
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


