'use strict'

const arrayUnidades = ['Centro Nacional de Biologia Estrutural e Bioimagem (CENABIO)', 'Escola de Educação Física e Desportos (EEFD)', 'Escola de Enfermagem Anna Nery (EEAN)', 'Faculdade de Farmácia (FF)', 'Faculdade de Medicina (FM)', 'Faculdade de Odontologia (FO)', 'Hospital Universitário Clementino Fraga Filho (HUCFF)', 'Instituto NUTES de Educação em Ciências e Saúde', 'Instituto de Atenção Primária de Saúde São Francisco de Assis (HESFA)', 'Instituto de Biofísica Carlos Chagas Filho (IBCCF)', 'Instituto de Biologia (IB)', 'Instituto de Bioquímica Médica (IBqM)', 'Instituto de Ciências Biomédicas (ICB)', 'Instituto de Doenças do Tórax (IDT)', 'Instituto de Estudos em Saúde Coletiva (IESC)', 'Instituto de Ginecologia (IG)', 'Instituto de Microbiologia Paulo de Góes (IMPG)', 'Instituto de Neurologia Deolindo Couto (INDC)', 'Instituto de Nutrição Josué de Castro (INJC)', 'Instituto de Pesquisas de Produtos Naturais (IPPN)', 'Instituto de Psiquiatria (IPUB)', 'Instituto de Puericultura e Pediatria Martagão Gesteira (IPPMG)', 'Instituto do Coração Edson Abdala Saad (ICES)', 'Maternidade Escola (ME)', 'Nucleo de Bioética e Ética Aplicada (NUBEA)', 'Núcleo de Pesquisas Ecológicas de Macaé (NUPEM)', 'Decania do CCS'];

var eventosDOM = eventos => {  
  var eventosDOM = "";    
  eventos = eventos.sort((a, b) => variaveisGlobais.ordenar(a, b, 'inversa', 'data'));
  for (let i = 0; i < eventos.length; i++) {         
    let emissor, mensagem; 
    emissor = eventos[i].emissor === 'gerente' ?  'gerente' : 'solicitante';    
    mensagem = `<p class=mensagem-texto><strong>${eventos[i].texto}</strong></p>`;
    
    //TODO: o operaswdor ternário para a determinação do nome do emissor é solução temporário! removê-lo quando todas as demandas estiverem adequadas ao novo padrão de objeto de eventos, com as propriedads texto, data e emissor!
    eventosDOM += `
      <div class="evento-ds mensagem-${emissor}">
        <span class='mensagem-hora'>${eventos[i].emissor ? eventos[i].emissor.split(' ')[0] : 'usuario'} escreveu, em ${moment(eventos[i].data).format('DD MMM YYYY [, às] HH:mm[h]')}</span> 
        ${mensagem}
      </div>
    `;
  }
  return eventosDOM;
};

//returnedType especifica se o objeto com os elementos do formulário serão enviados ao servidor como string ou array (quando houver apenas um elemento com determinado 'name', será retornada uma string, caso contrário, será retornado um array com todos os elementos de mesmo name), ou array (quando, em pelo menos um caso, é possível que haja mais de um input com mesmo name, é recomendável enviar tudo como array)
const getFormElements = (submitEvent, returnedType, extractedElements) => {
  const reqBody = {};          
  let elements = submitEvent ? submitEvent.target.elements : extractedElements;
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].name) {
      if (returnedType === 'string') {
        if (reqBody[elements[i].name]) {
          if (Array.isArray(reqBody[elements[i].name])) {
            reqBody[elements[i].name] = [...reqBody[elements[i].name], elements[i].value];
          } else {
            reqBody[elements[i].name] = [reqBody[elements[i].name], elements[i].value];
          }
        } else {
          reqBody[elements[i].name] = elements[i].value;
        }
      } else if (returnedType === 'array') {
        if (reqBody[elements[i].name]) {
          reqBody[elements[i].name].push(elements[i].value);
        } else {
          reqBody[elements[i].name] = [elements[i].value];    
        }
      } 
    }
  }
  return reqBody;
};  

const checkEmptyInputs = (inputs, containerOffset, hintOffset = 0, container = 'html') => { 
	let foundEmpty = false;
	//function to scan radiobuttons (or checkboxes, if necessary!)
	let emptyRadio = (name) => {
		let error = true;
		let radios = document.querySelectorAll(`input[name='${name}']`);
		for (let i = 0; i < radios.length; i++) {
			if (radios[i].checked) {
				error = false;
				break;
			}
		}
		return error;
	}
  let emptyRequiredHint = input => {  
    const top = input.parentElement.getBoundingClientRect().top;
    const left = input.parentElement.getBoundingClientRect().left;
    document.getElementById(`aviso-campo-invalido`).style = `position: fixed; top: ${top + hintOffset}px; left: ${left}px`;
    input.focus();
    variaveisGlobais.controlarVisibilidade("exibir", "#aviso-campo-invalido");
    setTimeout(function () {
      variaveisGlobais.controlarVisibilidade("ocultar", "#aviso-campo-invalido");
    }, 2500);
  };
	for (let i = 0; i < inputs.length; i++) {
		//show a hint to fill unfilled inputs
		if (inputs[i].type === 'radio') {
			foundEmpty = emptyRadio(inputs[i].name);
			if (foundEmpty) {
        variaveisGlobais.scrollTo(inputs[i].parentElement, -120,  () => emptyRequiredHint(inputs[i]), container);
				break;
			}
		}
		if (inputs[i].value === "" || (inputs[i].type === 'checkbox' && !inputs[i].checked)) {
			if (inputs[i].type !== 'checkbox' && !foundEmpty) {
        let input = inputs[i].type === 'file' ? inputs[i].parentElement : inputs[i];
				variaveisGlobais.scrollTo(input, containerOffset, () => emptyRequiredHint(inputs[i]), container);
				foundEmpty = true;
				break;
			}
		}
  }
	return foundEmpty;
};

const operacaoDB = msg => {
  variaveisGlobais.exibirMensagem(`<h3>${msg ? msg : 'Comunicando com o banco de dados'}</h3><img src="/img/loading.svg">`, null, 'Aguarde...');
};

//função para marcar a opção selecionada de uma tag SELECT, ao recuperar dados de um formulário 
const getSelectedOption = (list, value) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].value === value) {
      list[i].selected = true;
      break;
    }
  }
};

let textoCamelCase = (texto) => {
  texto.trim();
  let textoSemEspacos = texto.split(" ")[0].toLowerCase();
  for (let i = 1; i < texto.split(" ").length; i++) {
      textoSemEspacos += texto.split(" ")[i].slice(0,1).toUpperCase() + texto.split(" ")[i].slice(1, texto.split(" ")[i].length).toLowerCase();
  }
  let textoNormalizado = textoSemEspacos.normalize('NFD').replace(/[^a-zA-Z0-9]/g, "");
  return textoNormalizado;
}; 

let removeDiacritics = (texto) => {
  texto.trim();  
  let textoNormalizado = texto.normalize('NFD').replace(/[^a-zA-Z0-9 ]/g, "");
  return textoNormalizado;
}; 

const arrToObj = (arr, keyProp) => {
  const obj = {};
  arr.forEach(it => {
    if (keyProp.includes('.')) {
      // Neste caso, o novo objeto será indicado por uma propriedade de um de seus subobjetos
      const properties = keyProp.split('.');
      return obj[it[properties[0]][properties[1]]] = it;
    } else {
      return obj[it[keyProp]] = it;
    }
  }
     );
  return obj;
};

const swapClass = (element, class1, class2) => {
  const el = typeof element === 'string' ? document.querySelector(element) : element;
  const method1 = el.classList.contains(class1) ? 'remove' : 'add';  
  const method2 = method1 === 'remove' ? 'add' : 'remove';  
  el.classList[method1](class1);
  el.classList[method2](class2);
};

//InserirInput

//função que insere inputs dinâmicos no padrão dos sistemas do site do CCS
//nomeInput - String - o atributo "name" de todos os inputs criados por uma mesma chamada da função
//classes: String - As classes atribuídas a cada box, separadas por um espaço simples. O nome do input é adicionado automaticamente às classes. Não deve, portanto, ser incluído na string classes. evitar nomes genéricos
//campo dinâmico é uma função contendo o input (input, select, checkbox, radio) a ser criado e deve conter, em sua estrutura, o parâmetro dinâmico "num", que individualiza cada input.
//listeners é um array de objetos para construção dinâmica de listeners. sua estrutura é a seguinte:
/* 
  [
    {
      elemento: element,
      evento: evento,
      funcao: funcao
    }
  ]
*/
//onde: 
//elemento: String - seletor do elemento que receberá o evento 
//evento: String -  é uma string que qualifica o envento ('blur', 'click', 'change', etc).
//funcao: Function - a função a ser executada quando o evento ocorrer

//callBackPreDelete é função a ser executada antes de remover o input do dom
// autocomplete é uma função de autocompletar, passada para o campo dinâmico
const inserirInput = ({nomeInput, classes, campoDinamico, container, listeners = [], callbackPreDelete, autoCompleteHandler}) => {
  const lastElement = document.querySelectorAll(`.${nomeInput}`)[0];   
  const num = lastElement ? +lastElement.dataset.idnum + 1 : 0;
  const deleteItem = (e) => {
    if (callbackPreDelete) {
      callbackPreDelete(e);
    } 
    variaveisGlobais.controlarVisibilidade('ocultar', `#${e.target.dataset.id}`);
    const box = document.getElementById(`${nomeInput}-${num}`);
    box.classList.add('no-height');
    setTimeout(() => {
      if (box.parentElement.children.length === 1) {
        box.parentElement.parentElement.scrollTop = 0;
        box.parentElement.parentElement.classList.add('vazio');
      }      
    }, 100);
    setTimeout(() => {
      document.getElementById(`${e.target.dataset.id}`).outerHTML = '';  
    }, 500);
  };
  const elemento = `
  <div class="${classes} ${nomeInput} box-cinza no-height hidden opacidade-zero" id="${nomeInput}-${num}" data-idnum="${num}" >
    <i class="fa fa-times-circle" id='delete-${nomeInput}-${num}' data-id='${nomeInput}-${num}' title='excluir item'></i>
    ${campoDinamico(num)}       
  </div>`;
  document.querySelector(container).insertAdjacentHTML("afterbegin", elemento);
  const elementoDOM = document.getElementById(`${nomeInput}-${num}`);
  document.getElementById(`delete-${nomeInput}-${num}`).addEventListener(`click`, deleteItem);   
  
  //animando o novo input
  variaveisGlobais.controlarVisibilidade('exibir', `#${nomeInput}-${num}`);
  setTimeout(() => {
    document.getElementById(`${nomeInput}-${num}`).classList.remove('no-height');
  }, 50);
  
  // listeners customizados
  for (let i = 0; i < listeners.length; i++) {
    elementoDOM.querySelector(listeners[i].elemento).addEventListener(listeners[i].evento, (e) => listeners[i].funcao(e, num));
  }
  if (autoCompleteHandler) {
    autoCompleteHandler(num);
  }
};

const loadScript = (filePath, handleLoadEvent) => {
  // Create a script tag, set its source
  var scriptTag = document.createElement("script");      

  // And listen to it
  scriptTag.onload = e => {
    // This function is an event handler of the script tag
    if (handleLoadEvent) {
      handleLoadEvent(e);
    }
  }
  
  // Set the type of file and where it can be found
  scriptTag.type = "text/javascript";
  scriptTag.src = filePath;

  // Finally add it to the <head>
  document.getElementsByTagName("head")[0].appendChild(scriptTag);
}

const loadStyles = (filePath) => {
  var styleTag = document.createElement("link");    
  styleTag.rel = "stylesheet";
  styleTag.href = filePath;
  document.getElementsByTagName("head")[0].appendChild(styleTag);
}

// para marcar um item como selecionado em um menu. remove a seleção do item selecionado anteriormente e atribui ao novo item selecionado
const selecionarElemento = (selecionado, seletor, classe, toggle) => {
  if (selecionado.classList.contains(seletor)) {
    let returnAfterRemoveClass;
    if (toggle && selecionado.classList.contains(classe)) {
      returnAfterRemoveClass = true;
    }
    if (document.querySelector(`.${seletor}.${classe}`)) {
      document.querySelector(`.${seletor}.${classe}`).classList.remove(classe); 
    }
    if (returnAfterRemoveClass) {
      return;
    }
    selecionado.classList.add(classe);
  }
};

const construirSelects = ({ name, value, id, label, options, outros }) => {
  return `
    ${label ? `<label for='${id}'><p>${label}</p></label>` : ''}
    <select id="${id}" name='${name}' value='${value}'>
      <option value='' ${!value ? 'selected' : ''} disabled>Escolha:</option>
      ${options.map(op => `<option value='${op.value}' ${value === `${op.value}` ? 'selected' : ''}>${op.label}</option>`)}
      ${outros ? `<option value='outros' ${value === 'outros' ? 'selected' : ''}>Outros</option>` : ''}
    </select>
  `;  
};

// rotinas para validação de CPF
const testarCPF = rawCPF => {	
	const valido = validarCPF(CPFDigitos(rawCPF));
	return valido;
};

const CPFDigitos = (cpf) => {
	cpf = cpf.replace(/\./g, '');
	cpf = cpf.replace(/\-/g, '').trim();
	return cpf;
};

const validarCPF = cpf => {
  var numeros, digitos, soma, i, resultado, digitos_iguais = 1;
  if (cpf.length < 11 || cpf.length > 14) {
    return false;
  }
  for (i = 0; i < cpf.length - 1; i++) {
    if (cpf.charAt(i) != cpf.charAt(i + 1)) {
      digitos_iguais = 0;
      break;
    }
  }
  if (!digitos_iguais) {
    numeros = cpf.substring(0,9);
    digitos = cpf.substring(9);
    soma = 0;
    for (i = 10; i > 1; i--) {
      soma += numeros.charAt(10 - i) * i;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)) {
      return false;
    }
    numeros = cpf.substring(0,10);
    soma = 0;
    for (i = 11; i > 1; i--) {
      soma += numeros.charAt(11 - i) * i;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    return (resultado != digitos.charAt(1)) ? false : true;
  } else {
    return false;
  }
};

//autocomplete by Thiago Meyer
//parameters: inputSelector - the input element
//            divItems - the selector of the container that´ll hold the sugestions
//            item - the class given to each element of our list
//            array - array that contains the items
//            clicouItem - function that manipulates innerHTML of clicked option.
//            selecionouItemEnter - outputs an option to inputSelector.
//            inputPerdeuFoco - actions taken when inputSelector lost its focus
const autoComplete = ({inputSelector, divItems, itemClass, itemsArray, clicouItem, selecionouItemEnter, inputPerdeuFoco}) => {
  
  // TODO: toques em tela e touchpads não são reconhecidos pelo evento "click". Evento substituido por "mousedown". Excluir se não houver probleas posteriores
  /* document.querySelector(divItems).addEventListener('click', (evt) => {  
    console.log('evt.target: >>>>>> ', evt.target);
    document.querySelector(inputSelector).value = clicouItem(evt.target.innerHTML, evt); // evt: parâmetro opcional, para capturar o evento e realizar alguma ação após o clique
  }); */
  document.querySelector(divItems).addEventListener('mousedown', (evt) => {  
    document.querySelector(inputSelector).value = clicouItem(evt.target.innerHTML, evt); // evt: parâmetro opcional, para capturar o evento e realizar alguma ação após o clique
  });

  document.querySelector(inputSelector).addEventListener('blur', blurEvent => {  
    setTimeout(() => {
      inputPerdeuFoco({blurEvent, inputSelector, divItems, itemClass, itemsArray});
      if (document.querySelector(`${divItems}`)) {
        document.querySelector(`${divItems}`).innerHTML = '';
      }
    }, 200);    
  });
  let validateInput = () => {
    document.querySelector(divItems).innerHTML = '';
    for (let i = 0; i < itemsArray.length; i++) {
      if (itemsArray[i].toUpperCase().includes(document.querySelector(inputSelector).value.toUpperCase())) {
        let classes;
        if (typeof itemClass === 'object') {
        } else {
          classes = itemClass
        }
        document.querySelector(divItems).insertAdjacentHTML('beforeend', `<p class='${classes}'>${itemsArray[i]}</p><br>`);
      }
    }
  };
  
  let selectByKeys = keyEvent => {
    let items = document.querySelectorAll(`.${itemClass}`),
        selectedItem;        
    keyEvent.preventDefault();    
    if (document.querySelector(`.${itemClass}`) && keyEvent.keyCode === 13) {
      if (document.querySelector('.autocomplete-selected-item')) {
        selectedItem = document.querySelector('.autocomplete-selected-item');
      }      
      selecionouItemEnter({selectedItem, inputSelector, divItems, itemClass, itemsArray, items, keyEvent});  
      document.querySelector(`${divItems}`).innerHTML = '';    
    } else if (keyEvent.keyCode === 40) {
      let selectedIndex;
      selectedItem = document.querySelector('.autocomplete-selected-item');
      if (!selectedItem && document.querySelector(`.${itemClass}`)) {
        items[0].classList.add('autocomplete-selected-item');
      }
      selectedIndex = Array.from(items).indexOf(selectedItem);
      document.querySelector('.autocomplete-selected-item').classList.remove('autocomplete-selected-item');
      if (selectedIndex + 1 === items.length) {
        document.querySelectorAll(`.${itemClass}`)[0].classList.add('autocomplete-selected-item');
        selectedItem = document.querySelectorAll(`.${itemClass}`)[0];
      } else {
        document.querySelectorAll(`.${itemClass}`)[selectedIndex + 1].classList.add('autocomplete-selected-item');
        selectedItem = document.querySelectorAll(`.${itemClass}`)[selectedIndex + 1];
      }      
      $(divItems).animate({ scrollTop: ($(selectedItem).offset().top - $(`${divItems} p`).offset().top) - 50 }, 'fast', function () { });
    } else if (keyEvent.keyCode === 38) {
      let selectedIndex;
      selectedItem = document.querySelector('.autocomplete-selected-item');
      if (!selectedItem && document.querySelector(`.${itemClass}`)) {
        items[0].classList.add('autocomplete-selected-item');
        selectedIndex = 0;
      }
      selectedIndex = Array.from(items).indexOf(selectedItem);
      document.querySelector('.autocomplete-selected-item').classList.remove('autocomplete-selected-item');
      if (selectedIndex <= 0) {
        document.querySelectorAll(`.${itemClass}`)[document.querySelectorAll(`.${itemClass}`).length - 1].classList.add('autocomplete-selected-item');
        selectedItem = document.querySelectorAll(`.${itemClass}`)[document.querySelectorAll(`.${itemClass}`).length - 1];
      } else {
        document.querySelectorAll(`.${itemClass}`)[selectedIndex - 1].classList.add('autocomplete-selected-item');
        selectedItem = document.querySelectorAll(`.${itemClass}`)[selectedIndex - 1];
      }
      $(divItems).animate({ scrollTop: ($(selectedItem).offset().top - $(`${divItems} p`).offset().top) - 100 }, 'fast', function () { });
    }
  };
  document.querySelector(inputSelector).addEventListener('input', (e) => {
    if (document.querySelector(inputSelector).value.length >= 2) {
      validateInput();
    } else {
      document.querySelector(divItems).innerHTML = '';
    }
  });
  //pressing a key (keyup, keydown or enter)
  document.querySelector(inputSelector).removeEventListener('keyup',selectByKeys, false);
  document.querySelector(inputSelector).addEventListener('keyup',selectByKeys);
};
