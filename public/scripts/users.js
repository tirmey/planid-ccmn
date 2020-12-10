"use strict"

/////////////////////////////////////
////////////// FUNÇÕES //////////////
/////////////////////////////////////

const tipoUsuario = {
  estudante: false,
  docente: false,
  tecnico: false,
  ufrj: false,
  posDoutorando: false,
  colaborador: false,
  externo: false,
};

const arrayLocaisUFRJ = ['Reitoria da UFRJ', 'Pró-Reitoria de Graduação - PR1', 'Pró-Reitoria de Pós-Graduação e Pesquisa - PR-2', 'Pró-Reitoria de Finanças - PR-3', 'Pró-Reitoria de Pessoal - PR4', 'Pró-Reitoria de Extensão - PR5', 'Pró-Reitoria de Gestão e Governança - PR6', 'Pró-Reitoria de Políticas Estudantis - PR7', 'Centro de Letras e Artes - CLA', 'Centro de Ciências Matemáticas e da Natureza - CCMN', 'Centro de Filosofia e Ciências Humanas - CFCH', 'Centro de Ciências Jurídicas e Econômicas - CCJE', 'Centro de Tecnologia - CT', 'Fórum de Ciência e Cultura - FCC', 'Campus UFRJ - Macaé Professor Aloísio Teixeira', 'UFRJ - Campus Duque de Caxias Professor Geraldo Cidade' ];

const selecionarListaLocais = () => {
  return tipoUsuario.ufrj ? arrayLocaisUFRJ : arrayUnidades;
};

const blocosArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'N', 'HUCFF','IPPMG', 'EEFD', 'outras localizações na Cidade Universitária', 'local externo à Cidade Universitária'];
let blocosLista = '';
for (let i = 0; i < blocosArray.length; i++) {
	blocosLista += `<option value='${blocosArray[i]}'>${blocosArray[i]}</option>`;
}

const termoResponsabilidade = `
  <div class='exibir-termo-veracidade'>
    <input type='checkbox' id='termo-ciencia' required>
    <label for="termo-ciencia">
      <span></span><p class=''>Li e estou ciente do disposto no Termo de Veracidade.</p>      
    </label> 
  </div>
`;

const msgCiencia = `
  <p>Declaro, para os devidos fins de direito, sob as penas da lei, que as informações prestadas no formulário de cadastramento de usuários do portal do CCS são verdadeiras e estou ciente de que a falsidade dessa declaração configura crime previsto no <a href="http://www.planalto.gov.br/ccivil_03/decreto-lei/Del2848compilado.htm" title="Decreto-lei no 2.848, de 7 de dezembro de 1940." target='_blank' rel='noopener'>Código Penal</a> Brasileiro, passível de apuração na forma da Lei, além da ciência de responsabilidade sob todos os efeitos e danos causados pelas minhas declarações.</p>
  <div class='button-div'>
    <button class='btn-base btn-fechar'>CIENTE</button>
  </div>
`;


const exibirTermoVeracidade = e => {  
  if (document.getElementById(`termo-ciencia`).checked) {
    variaveisGlobais.exibirMensagem(msgCiencia);
    document.getElementById(`mensagens-genericas`).addEventListener('click', () => {
      variaveisGlobais.controlarVisibilidade('ocultar', '#mensagens-genericas', true);      
    });
  }  
};


const clicouItem = (innerHTML) => {        
  return innerHTML;
}

const verificarInputNumerico = (e, input, tamanho, mensagem) => {
	const numberIsPressed = (e.keyCode >= 48 && e.keyCode < 58) || (e.keyCode >= 96 && e.keyCode < 106 );
	if (numberIsPressed && input.value.length < tamanho) {
		input.value += e.key;
	} else if ((e.keyCode >= 48 && e.keyCode < 58) || (e.keyCode >= 96 && e.keyCode < 106 ) && input.value.length >= tamanho) {
		variaveisGlobais.exibirMensagem(mensagem, 1500, 'Atenção!');
	}
};

const inputPerdeuFoco = ({blurEvent, itemsArray, divItems}) => {
  let inputIsValid = false;
  for (let i = 0; i < itemsArray.length; i++) {
    if (itemsArray[i] === blurEvent.target.value) {
      inputIsValid = true;
      document.querySelector(`${divItems}`).innerHTML = '';
      break;
    }
  }
  if (!inputIsValid) {
    blurEvent.target.value = '';        
    variaveisGlobais.exibirMensagem('<h3>A Unidade informada é inválida.</h3>', 1500, 'Atenção!')
  }
};
const selecionouItemEnter = ({selectedItem, inputSelector, items}) => {
  selectedItem ? document.querySelector(`${inputSelector}`).value = selectedItem.innerHTML : document.querySelector(`${inputSelector}`).value = items[0].innerHTML;            
};

const validarIdentificacao = () => {
  const identificacao = document.getElementById(`identificacao`);
  let mensagem, invalido = false;
  if (tipoUsuario.colaborador || tipoUsuario.externo) {
    invalido = !testarCPF(identificacao.value);
    mensagem = 'O CPF informado não é válido';
  } else if (tipoUsuario.docente || tipoUsuario.tecnico ) {  
    if (identificacao.value.length !== 7) {		
      invalido = true;
      mensagem = 'O número do SIAPE informado está incorreto.';	
    }    
  } else if (tipoUsuario.estudante) {
    if (identificacao.value.length !== 9 ) {				
      invalido = true;
      mensagem = 'O número do DRE informado está incorreto.';
    }
  }
  if (invalido) {
    identificacao.value = '';
    variaveisGlobais.exibirMensagem(`<h3>${mensagem}</h3>`, 1500, "Atenção!")
  }
};

const controleIdentificacao = e => {  
  const idInput = document.getElementById(`identificacao`);
  if (tipoUsuario.colaborador || tipoUsuario.posDoutorando || tipoUsuario.externo) {    
    e.preventDefault();
    if ((e.keyCode >= 48 && e.keyCode < 58) || (e.keyCode >= 96 && e.keyCode < 106 )) {
      if (idInput.value[2] && (idInput.value.length === 3 || idInput.value.length === 7 )) {
        idInput.value += '.';      
      }
      if (idInput.value[10] && idInput.value.length === 11) {
        idInput.value += '-';
      }
      if (idInput.value.length < 14) {
        idInput.value += e.key;
      } else {
        variaveisGlobais.exibirMensagem("<h3>O número do CPF tem, exatamente, 11 dígitos. Por favor, verifique o número informado.</h3>", 3000, 'Atenção!');
      }					
    }
    if (e.keyCode === 8 || e.keyCode === 46) {
      idInput.value = ''
    }
    if (e.keyCode === 9) {
      testarCPF(idInput.value);	
      if (tipoUsuario.externo) {
        document.getElementById(`senha`).focus();  
      } else {
        document.getElementById(`user-unidade`).focus();	
      }
    }
    /* if (document.getElementById('cpf-consulta') && validarCPF(CPFDigitos()) && e.keyCode === 13) {
      acessoUsuarioHandler();
    } */
    
  } else if (tipoUsuario.docente || tipoUsuario.tecnico) {		
    e.preventDefault();
      verificarInputNumerico(e, idInput, 7, '<h3>O número de SIAPE tem exatamente 7 dígitos. Por favor, verifique o número informado</h3>');
    if (e.keyCode === 8 || e.keyCode === 46) {
      idInput.value = '';
    }
    if (e.keyCode === 9) {			
      document.getElementById(`user-unidade`).focus();	
      if (idInput.value.length < 7) {				
        idInput.value = '';
      }	
    }
  } else if (tipoUsuario.estudante) {	
    e.preventDefault();    
    verificarInputNumerico(e, idInput, 9, '<h3>O número de DRE tem exatamente 9 dígitos. Por favor, verifique o número informado</h3>');
    if (e.keyCode === 8 || e.keyCode === 46) {
      idInput.value = '';
    }
    if (e.keyCode === 9) {			
      document.getElementById(`user-unidade`).focus();	
      if (idInput.value.length < 9) {				
        idInput.value = '';
      }	
    }
  }   
};

const selecionarUnidadePreenchimentoPlanid = () => {
  const inputUnidadePreenchimentoPlanid = document.querySelector(`.field-unidade-planid`);
  const inputLotacao = document.getElementById(`user-unidade`);
  const inputLocalizacao = document.getElementById(`user-unidade-localizacao`);
  if (inputLotacao.value && inputLotacao.value === inputLocalizacao.value) {
    if (inputUnidadePreenchimentoPlanid) {
      inputUnidadePreenchimentoPlanid.outerHTML = '';
    }
  } else if (inputLotacao.value && inputLocalizacao.value && !inputUnidadePreenchimentoPlanid) {    
    document.querySelector(`.field-unidade-localizacao`).insertAdjacentHTML('afterend', unidadePlanid);
  }
};


//////////////////////////////////////////////////
////////////// LISTENERS FORMULÁRIO //////////////
//////////////////////////////////////////////////

const listenersFormulario = () => {


  //listener para o container da unidade de lotação
  if (document.getElementById(`user-unidade`)) {
    autoComplete({
      inputSelector: '#user-unidade',
      divItems: '.div-user-unidades',
      itemClass: 'item-autocompletar',
      itemsArray: selecionarListaLocais(),
      clicouItem,
      selecionouItemEnter,
      inputPerdeuFoco
    });
  }

  //listener para o container da unidade de localização
  if (document.getElementById(`user-unidade-localizacao`)) {
    autoComplete({
      inputSelector: '#user-unidade-localizacao',
      divItems: '.div-user-unidades-localizacao',
      itemClass: 'item-autocompletar',
      itemsArray: selecionarListaLocais(),
      clicouItem,
      selecionouItemEnter,
      inputPerdeuFoco
    });
  }

  //listeners gerais do formulário
  document.getElementById('identificacao').addEventListener('blur', validarIdentificacao);
  document.getElementById(`identificacao`).addEventListener('keydown', controleIdentificacao);
  document.getElementById('user-categoria').addEventListener('change', selecionarCategoria);    
  document.getElementById(`termo-ciencia`).addEventListener('change', exibirTermoVeracidade);

  //listeners de campos dinâmicos:
  document.querySelector(`.cadastrar-telefones`).addEventListener('click', telefonesDinamicos);
  if (tipoUsuario.estudante) {
    document.getElementById(`nivel-curso`).addEventListener(`change`, definirNivelCurso);
    document.getElementById(`estagiario`).addEventListener(`change`, definirEstagio);	
  }

  // Lsiteners planid
  if (tipoUsuario.docente) {
    document.getElementById(`user-unidade`).addEventListener('change', selecionarUnidadePreenchimentoPlanid);
    document.getElementById(`user-unidade-localizacao`).addEventListener('change', selecionarUnidadePreenchimentoPlanid);
  }
};

////////////////////////////////////////////////
////////////// CAMPOS ESPECÍFICOS //////////////
////////////////////////////////////////////////

const definirNivelCurso = e => {
  const nivel = e.target.value;
	let nomeCurso;	
	if (nivel === 'graduacao' || nivel === 'especializacao') {
		nomeCurso = `
			<div class='input-wrapper input-curso-graduacao nao-editavel'>
				<div class="input-curso-grad">
					<label for="curso-graduacao" ><p>Nome do Curso:</p></label>
					<input type="text" autocomplete='off' name="cursoGrad" id="curso-graduacao" required>
				</div>
			</div>
		`;
	} else {
		nomeCurso = `
			<div class='input-wrapper input-programa-pg nao-editavel'>
				<div class="input-programa-pg">
					<label for="programa-pg" ><p>Nome do programa de pós-graduação:</p></label>
					<input type="text" name="programaPG" id="programa-pg" required>
				</div>
			</div>
			<div class='input-wrapper input-curso-pg nao-editavel'>
				<div class="input-curso-pg">
					<label for="curso-pg" ><p>Nome do curso:</p></label>
					<input type="text" autocomplete='off' name="cursoPG" id="curso-pg" required>
				</div>
			</div>
		`;
	}	
	document.querySelector(`.nome-curso`).innerHTML = nomeCurso;
};

const definirEstagio = e => {
  const temEstagio = e.target.checked;
	let localEstagio = '';
	localEstagio = temEstagio ?
		`
		<div class='input-wrapper input-unidade-estagio nao-editavel'>
			<label for="local-estagio" class='label-local-estagio'><p>Unidade onde realiza estágio:</p>
				<i class="fa fa-info"></i>
				<span class="dica">Unidade na qual realiza estágio. Informar pelo menos três caracteres do nome ou da sigla da unidade no campo abaixo e confirmar a seleção, clicando na lista que será exibida. Constam, na lista, as Unidades Acadêmicas, Suplementares e a Unidade Administrativa do CCS (Decania do CCS)</span>
			</label>
			<div class="input-unidade-wrapper">
				<input type="text" autocomplete='off' name="unidadeEstagio" id="unidade-estagio" required>
			</div>
			<div class="div-unidades-estagio div-autocompletar"></div>
		</div>
		` : '';				
	if (temEstagio) {
		document.querySelector(`.local-estagio-div`).innerHTML = localEstagio;
		variaveisGlobais.controlarVisibilidade('exibir', '.local-estagio-div');	
		autoComplete({
			inputSelector:'#unidade-estagio', 
			divItems: '.div-unidades-estagio',
			itemClass: 'item-autocompletar' ,
			itemsArray: selecionarListaLocais(),
			clicouItem,
			inputPerdeuFoco,
			selecionouItemEnter
		}); 
	} else {
		variaveisGlobais.controlarVisibilidade('ocultar', '.local-estagio-div');
		setTimeout(() => {
			document.querySelector(`.local-estagio-div`).innerHTML = localEstagio;						
		}, 500);
	}
};

const unidadePlanid = `
  <div class='field-unidade-planid'>
    <label for='unidade-planid'>
      <p>PLANIDS vinculados à:</p>            
    </label>
    <select name="unidadePreenchimentoPlanid" id='unidade-planid' required>
      <option disabled selected value=''>Selecione uma opção:</option>
      <option value='unidadeLotacao'>Unidade de Lotação</option>
      <option value='unidadeLocalizacao'>Unidade de Localização</option>        
    </select>
  </div>
`;

const selecionarCategoria = e => {
  if (document.querySelector('.user-campos-especificos')) {
    document.querySelector('.user-campos-especificos').outerHTML = '';
  }
  let id, 
      departamento = '', 
      titulacao = '', 
      classe = '', 
      regime = '', 
      vinculo = '', 
      setor = '', 
      endereco = '', 
      bloco = '',
      unidadeLotacao = '', 
      unidadeLocalizacao = '',
      nivelCurso = '', 
      estagiario = '';

  tipoUsuario.docente = e.target.value === 'docente';
  tipoUsuario.estudante = e.target.value ==='estudante';
  tipoUsuario.colaborador = (e.target.value === 'posDoutorando' || e.target.value === 'colaborador');
  tipoUsuario.tecnico = e.target.value === 'tecnico';
  tipoUsuario.ufrj = e.target.value === 'ufrj'
  tipoUsuario.externo = e.target.value === 'externo';
  const telefones = `
    <div class='user-telefones'>
      <label>
        <p>Telefones:</p>
      </label>
      <div class="btn-acao display-only cadastrar-telefones">
          <i class="fa fa-plus-circle" aria-hidden="true"></i>
          <span>cadastrar telefone</span>
      </div>
      <div class='telefones-container'></div>
    </div>
  `;

  if (tipoUsuario.externo || tipoUsuario.colaborador || tipoUsuario.ufrj) {
    id = 'CPF';  
  } else if (tipoUsuario.estudante) {
    id = 'DRE'
    nivelCurso = `
      <div class='input-wrapper input-nivel-curso'>
        <div class="nivel-curso estudantes">
          <label for="nivel-curso">
            <p>Nível:</p>
          </label>
          <select id='nivel-curso' name='nivelCurso' required>
            <option selected value='' disabled>Selecione uma opção:</option>
            <option value='graduacao'>graduação</option>
            <option value='especializacao'>especialização</option>
            <option value='mestrado'>mestrado</option>			
            <option value='residencia'>residência médica</option>				
            <option value='doutorado'>doutorado</option>				
          </select>				
        </div>
      </div>			
      <div class='nome-curso'></div>    
    `;

    estagiario = `
			<div class='input-estagiario'>
				<div class="estagiario estudantes">
					<input type='checkbox' id='estagiario'>					
					<label for="estagiario"><span></span><p>Marque se estagiário</p></label>							
				</div>	
			</div>
			<div class="local-estagio-div estudantes hidden opacidade-zero"></div>
		`;	
  } else if (tipoUsuario.tecnico || tipoUsuario.docente) {
    id = 'SIAPE';
    unidadeLocalizacao = `
      <div class='field-unidade-localizacao'>
        <div class="user-unidade-localizacao">	
          <label for="user-unidade-localizacao">
            <p>Unidade de localização:</p>
            <i class='fa fa-info'></i>
            <span class="dica">Unidade na qual exerce, de fato, atividades. Informar pelo menos três caracteres do nome ou da sigla da unidade no campo abaixo e confirmar a seleção, clicando na lista que será exibida. Constam, na lista, as Unidades Acadêmicas, Suplementares e a Unidade Administrativa do CCS (Decania do CCS)</span>
          </label>				
          <input type="text" autocomplete='off' name="unidadeLocalizacao" id="user-unidade-localizacao" required>					
        </div>
        <div class="div-user-unidades-localizacao div-autocompletar"></div>
      </div>
    `;    
  }

  if (!tipoUsuario.estudante && !tipoUsuario.externo && !tipoUsuario.ufrj) {
    setor = `
      <div>
        <label for="user-setor">
          <p>Setor:</p>
          <i class='fa fa-info'></i>
          <span class='dica'>Seção, laboratório, gabinete, etc.</span>
        </label>
        <input type="text" name="setor" id="user-setor" required>    
      </div>
    `;
    endereco = `
      <div>
        <label for="user-endereco-setor">
          <p>Endereço (do setor):</p>
        </label>
        <input type="text" name="endereco" id="endereco-setor" required>    
      </div>
    `;
    bloco = `	
			<div class="docentes tecnicos">
				<label for="bloco">
					<p>Bloco:</p>
					<i class="fa fa-info"></i>
					<span class="dica">Bloco do Prédio do CCS ou outro local onde está situado seu setor de localização.</span>
				</label>
				<select name="bloco" id="bloco" required>
					<option disabled selected value=''>Indique o bloco de seu setor de localização</option>					
					${blocosLista}
				</select>
			</div>`
		;
  }

  if (!tipoUsuario.externo) {
    unidadeLotacao = `
      <div>
        <div class="user-unidade">	
          <label for="user-unidade">
            <p>${!tipoUsuario.ufrj ? 'Unidade' : 'Pró-Reitoria ou Centro'} ${tipoUsuario.estudante ? 'que oferece o curso' : tipoUsuario.colaborador ? 'de vínculo' : 'de lotação'}:</p>
            <i class='fa fa-info'></i>
            <span class="dica">${tipoUsuario.estudante ?  '' : tipoUsuario.colaborador ? 'A Unidade vincluada ao SIAPE. ' : ''}Informar pelo menos três caracteres do nome ou da sigla ${!tipoUsuario.ufrj ?'da Unidade Acadêmica' : 'da Reitoria, Pró-Reitoria ou Centro de lotação'} no campo abaixo e confirmar a seleção, clicando na lista que será exibida. Constam, na lista, ${!tipoUsuario.ufrj ? 'as Unidades Acadêmicas, Suplementares e a Unidade Administrativa do CCS (Decania do CCS)' : 'os Centros e as Pró-Reitorias da UFRJ'} </span>
          </label>				
          <input type="text" autocomplete='off' name="unidadeLotacao" id="user-unidade" required>					
        </div>
        <div class="div-user-unidades div-autocompletar"></div>
      </div>
    `;   
  }
  
  if (tipoUsuario.docente) {
    departamento = `
      <div>
        <label for='departamento'>
          <p>Departamento:</p>
          <i class="fa fa-info"></i>
          <span class='dica'>Ou programa, para Unidades que não são estruturadas em departamentos</span>
        </label>
        <input type='text' id='departamento' name='departamento' required>
      </div>
    `;
    titulacao = `
      <div>
        <label for='titulacao'>
          <p>Titulação:</p>            
        </label>
        <select name="titulacao" id='titulacao' required>
          <option disabled selected value=''>Selecione uma opção:</option>
          <option value='graduado'>bacharel ou licenciado</option>
          <option value='mestre'>mestre</option>
          <option value='doutor'>doutor</option>
          <option value='pós-doutor'>pós-doutor</option>
        </select>
      </div>
    `;
    classe = `
      <div>
        <label for='classe'>
          <p>Classe:</p>            
        </label>
        <select name="classe" id='classe' required>
          <option disabled selected value=''>Selecione uma opção:</option>
          <option value='substituto'>Substituto</option>
          <option value='auxilar'>Auxilar</option>
          <option value='assistente'>Assistente</option>
          <option value='adjunto'>Adjunto</option>
          <option value='associado'>Associado</option>
          <option value='titular'>Titular</option>
        </select>
      </div>
    `;
    regime = `
      <div>
        <label for='regime'>
          <p>Regime:</p>            
        </label>
        <select name="regime" id='regime' required>
          <option disabled selected value=''>Selecione uma opção:</option>
          <option value='20h'>20 horas</option>
          <option value='40h'>40 horas</option>
          <option value='de'>Dedicação exclusiva</option>            
        </select>
      </div>
    `;
    vinculo = `
      <div>
        <label for='vinculo'>
          <p>Vínculo:</p>            
        </label>
        <select name="vinculo" id='vinculo' required>
          <option disabled selected value=''>Selecione uma opção:</option>
          <option value='estatuto'>Estatutário</option>
          <option value='substituto'>Substituto</option>
          <option value='visitante'>Visitante</option>
          
        </select>
      </div>
    `;    
  } 

  const identificacao = `
  <div class='user-identificacao'>
    <label for="user-identificacao">
      <p>Identificação (${id}):</p>
      <i class="fa fa-info"></i>
      <span class="dica">informe o número de seu ${id} sem pontos ou traços</span>
    </label>
    <input type="text" id="identificacao" name="identificacao" required>
    </div>
  `;  
  
  const senha = typeof dashboard === 'undefined'
    ? `
      <div>
        <label for="senha">
          <p>Escolha uma senha de acesso:</p>
        </label>
        <input type="password" name="senha" id="senha" required>    
      </div>
      <div>
        <label for="user-senha-confirm">
          <p>Confirme a senha escolhida:</p>
        </label>
        <input type="password" id="user-senha-confirm" required>    
      </div>
    `
    : ''
  ;
  
  const camposEspecificos = `
    <section class='user-campos-especificos'>
      ${telefones}
      ${identificacao}
      ${unidadeLotacao}
      ${unidadeLocalizacao}
      ${tipoUsuario.docente ? unidadePlanid : ''}
      ${nivelCurso}
      ${estagiario}
      ${setor}
      ${bloco}
      ${endereco}
      ${departamento}
      ${titulacao}
      ${classe}
      ${regime}
      ${vinculo}
      ${senha}    
      ${termoResponsabilidade}
    </section>
  `;
  document.querySelector('.user-categoria').insertAdjacentHTML('afterend', camposEspecificos);
  document.querySelector(`.btn-submit`).classList.remove('inativo');
  listenersFormulario();  
};

//////////////////////////////////////////////
////////////// CAMPOS DINÂMICOS //////////////
//////////////////////////////////////////////

const telefonesDinamicos = () => {
  const nomeInput = 'telefones',
        classes = 'input-telefones'

  const campoDinamico = num =>`
    <label for="telefones-user-tipo-${num}">
      <p>Tipo:</p>
    </label>      
    <select name="${nomeInput}Tipo" id='telefones-user-tipo-${num}' >
      <option disabled value="neutro">Selecione uma opção:</option>
      <option value='comercial'>comercial</option>
      <option value='celular'>celular</option>
      <option value='residencial'>residencial</option>
    </select>
    <label for="user-telefones-${num}">
      <p>Número:</p>
    </label>      
    <input type="text" id="user-telefones-${num}" name="${nomeInput}" required>
  `;  
  inserirInput({
    nomeInput,
    classes,
    campoDinamico,
    container:'.telefones-container'
  });
};

////////////////////////////////////////////////////
////////////// VALIDAÇÃO E ENVIO FORM //////////////
////////////////////////////////////////////////////

const validacaoForm = e => {
  e.preventDefault();  
  const concordaTermo = document.getElementById(`termo-ciencia`).checked;
  document.getElementById(`identificacao`).value = textoCamelCase(document.getElementById(`identificacao`).value);
  if (!concordaTermo) {
    variaveisGlobais.exibirMensagem('<h3>A fim de submeter o formulário, você deve estar ciente do disposto no Termo de Veracidade.</h3>', 1500);
  } else {
    const faltaPreencher = checkEmptyInputs(document.querySelectorAll('#user-form input[required], #user-form select[required]'), -200, 75);
    const senhaDiverge = document.getElementById(`senha`).value !== document.getElementById(`user-senha-confirm`).value;
    if (!faltaPreencher) {
      let unidadeLotacaoValida = true;
      let unidadeLocalizacaoValida = true;
      if (document.getElementById(`user-unidade`)) {
        unidadeLotacaoValida = selecionarListaLocais().includes(document.getElementById(`user-unidade`).value);
      } 
      if (document.getElementById(`user-unidade-localizacao`)) {
        unidadeLocalizacaoValida = selecionarListaLocais().includes(document.getElementById(`user-unidade-localizacao`).value);
      }  
      if (!unidadeLotacaoValida) {    
        variaveisGlobais.scrollTo('#user-unidade', -200, () => variaveisGlobais.exibirMensagem('<h3>Favor conferir o nome da Unidade de lotação informada.</h3>', 1000));
      } else if (!unidadeLocalizacaoValida) {
        variaveisGlobais.scrollTo('#user-unidade-localizacao', -200, () => variaveisGlobais.exibirMensagem('<h3>Favor conferir o nome da Unidade de localização informada.</h3>', 1000));    
      } else if (senhaDiverge) {
        variaveisGlobais.scrollTo('#senha', -200, () => variaveisGlobais.exibirMensagem('<h3>As senhas informadas não conferem.</h3>', 1000));
        document.getElementById(`senha`).value = '';
        document.getElementById(`user-senha-confirm`).value = '';
      } else {
        document.getElementById(`btn-submit`).setAttribute('disabled', true);
        document.getElementById(`btn-submit`).classList.add('inativo');
        operacaoDB();
        e.target.submit();
      }
    }
  }  
};

document.getElementById(`user-form`).addEventListener('submit', validacaoForm);

//prevenindo a submissão do formulário com a tecla enter
document.getElementById(`user-form`).addEventListener('keydown', e => {
  if (e.keyCode === 13) {
    e.preventDefault();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // listener do seletor de categorias
  document.getElementById('user-categoria').addEventListener('change', selecionarCategoria);
});