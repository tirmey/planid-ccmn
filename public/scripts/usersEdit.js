const baseform = `
  <div class='div-editar-usuario hidden opacidade-zero'>
    <i class='fa fa-times-circle-o div-editar-usuario__fechar'></i>
    <div class='div-editar-usuario__form-wrapper'>
      <form class="formulario" id='user-form' method="POST" action="/users/cadastro/editar-usuario" novalidate>
        <input type='hidden' name='_csrf' value=${dashboard.csrfToken}>
        <h2>Editar perfil</h2>
        <div>
          <label for="user-nome">
            <p>Nome completo:</p>
          </label>
          <input class='readonly' type="text" id="nome" name="nome" value='${dashboard.user.nome}' required readonly>
        </div>
        <div>
          <label for="user-email">
            <p>E-mail:</p>
          </label>
          <input type="email" id="email" name="email" value='${dashboard.user.email}' required>
        </div>            
        <div class="user-categoria">
          <label for="user-categoria">
            <p>Categoria:</p>
          </label>
          <select name='categoria' id='user-categoria'>
            <option disabled selected>Selecione uma opção:</option>
            <option value='estudante'>estudante</option>
            <option value='docente'>docente</option>
            <option value='tecnico'>técnico</option>
            <option value='ufrj'>servidores de outros Centros / Reitoria</option>
            <option value='posDoutorando'>pós-doutorando</option>
            <option value='colaborador'>pesquisador-colaborador</option>
            <option value='externo'>usuário dos serviços do CCS / outros</option>
          </select>
        </div>  
        <div>
          <input type="submit" class='btn-submit inativo' id='btn-submit' value="enviar">
        </div>
      </form>
    </div>
  </div>
`;
const eliminarFormEdicao = e => {
  if (!e || e.target.classList.contains('div-editar-usuario') || e.target.classList.contains('div-editar-usuario__fechar')) {
    variaveisGlobais.controlarVisibilidade('ocultar', '.div-editar-usuario');    
    setTimeout(() => {
      document.querySelector(`.div-editar-usuario`).outerHTML = '';
    }, 1000);  
  }
};

// inserindo o formulário base no DOM, antes de carregar o arquivo users.min.js: 
document.querySelector(`.wrapper`).insertAdjacentHTML('afterbegin', baseform);
variaveisGlobais.controlarVisibilidade('exibir', '.div-editar-usuario');
document.querySelector(`.div-editar-usuario`).addEventListener('click', eliminarFormEdicao);

const camposDesabilitados = {
  todos: ['nome', 'categoria', 'identificacao', 'unidadeLotacao', 'unidadeLocalizacao', 'unidadePreenchimentoPlanid' ],
  estudante: ['unidadeLotacao', 'nivelCurso', 'programaPG', 'cursoPG', 'cursoGrad'],
};


const desabilitarCampos = () => {
  for (let i = 0; i < camposDesabilitados.todos.length; i++) {
    const campo = document.querySelector(`[name=${camposDesabilitados.todos[i]}]`);
    if (campo) {
      campo.setAttribute('disabled', true);
      campo.setAttribute('readonly', true);
      campo.classList.add('readonly');
    }
  }
  if (dashboard.user.categoria === 'estudante') {
    for (let i = 0; i < camposDesabilitados.estudante.length; i++) {
      const campo = document.querySelector(`[name=${camposDesabilitados.estudante[i]}]`);
      if (campo) {        
        campo.setAttribute('disabled', true);
        campo.setAttribute('readonly', true);
        campo.classList.add('readonly');
      }
    }
  }  
  if (document.querySelector(`[name=senha]`)) {
    document.querySelector(`[name=senha]`).parentElement.outerHTML = '';
  }
};

const prepararTelefonesSubmit = elements => {
  const tels = [];
  if (elements.telefones && Array.isArray(elements.telefones)) {
    for (let i = 0; i < elements.telefones.length; i++) {
      tels.push({tipo: elements.telefonesTipo[i], numero: elements.telefones[i]})
    }  
  } else if (elements.telefones) {
    tels.push({tipo: elements.telefonesTipo, numero: elements.telefones})
  }
  return tels;
};

const prepararDadosEEnviar = e => {
  const elements = getFormElements(e, 'string');
  const telefones = prepararTelefonesSubmit(elements);
  delete elements.telefonesTipo;
  delete elements._csrf;
  elements.telefones = telefones;
  const naoEnviar = camposDesabilitados.todos;
  if (dashboard.user.categoria === 'estudante') {
    naoEnviar = [...camposDesabilitados.todos, ...camposDesabilitados.estudante];
  }
  for (let i = 0; i < naoEnviar.length; i++) {    
    if (elements[naoEnviar[i]]) {
      delete elements[naoEnviar[i]];
    }
  }
  if (typeof planid !== 'undefined') {
    planid.unidadePreenchimentoPlanid = dashboard.user[elements.unidadePreenchimentoPlanid];
    arrayDisciplinas = [];
  }
  const cb = msg => {
    const message = msg.err || 'Perfil atualizado. A interface será reiniciada...';
    variaveisGlobais.exibirMensagem(`<h3>${message}</h3>`, 3000, '');
    if (!msg.err) {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };
  const novoEmail = elements.email !== dashboard.user.email ? elements.email : undefined;
  variaveisGlobais.ajax('/users/cadastro/editar-usuario', 'POST', {_csrf: dashboard.csrfToken, novoEmail, elements: JSON.stringify(elements) }, cb);
};

const validarEdicaoForm = e => {
  e.preventDefault(); 
  const inputs = document.querySelectorAll(`#user-form input, #user-form select`);
  const concordaTermo = document.getElementById(`termo-ciencia`).checked;
  if (concordaTermo) {
    const camposNulos = checkEmptyInputs(inputs, 200, 40, document.querySelector(`.div-editar-usuario__form-wrapper`));
    if (!camposNulos) {
      operacaoDB();
      prepararDadosEEnviar(e);    
    }
  } else {
    variaveisGlobais.exibirMensagem('<h3>Antes de enviar o formulário, você deve declarar ciência do teor do Termo de Veracidade</h3>', 3500);
  }
};

const novoEmailHandler = e => {
  if (e.target.value !== dashboard.user.email) {
    variaveisGlobais.exibirMensagem(`
      <h3>Certifique-se de que o novo e-mail é válido. Caso contrário, as menagens enviadas pela Decania do CCS não serão entregues.</h3>
    `, null, 'Atenção!');
  }
}
const prepararForm = () => {
  //carregando o formulário completo
  if (!document.querySelector(`.div-editar-usuario`)) {
    document.querySelector(`.wrapper`).insertAdjacentHTML('afterbegin', baseform);
    variaveisGlobais.controlarVisibilidade('exibir', '.div-editar-usuario');
  }
  
  //selecionando a categoria do usuário
  const eventoSelecionarCategoria = { target: { value: dashboard.user.categoria } };
  document.getElementById(`user-categoria`).querySelector(`option[value=${dashboard.user.categoria }]`).selected = true;
  selecionarCategoria(eventoSelecionarCategoria);

  if (!document.querySelector(`.div-editar-usuario`)) {    
    listenersFormulario();
  } 

  // listeners 
  document.querySelector(`.div-editar-usuario`).addEventListener('click', eliminarFormEdicao);
  document.getElementById(`email`).addEventListener('blur', novoEmailHandler);
  document.getElementById(`user-form`).removeEventListener('submit', validacaoForm);
  document.getElementById(`user-form`).addEventListener('submit', validarEdicaoForm);
};

const preencherTelefones = () => {
  const { telefones } = dashboard.user;
  for (let i = 0; i < telefones.length; i++) {
    document.querySelector(`.cadastrar-telefones`).click();
    document.getElementById(`telefones-user-tipo-${i}`).querySelector(`option[value=${telefones[i].tipo}]`).selected = true;
    document.getElementById(`user-telefones-${i}`).value = telefones[i].numero;
  }
};

const preencherForm = () => {    
  // preenchendo os telefones de contato
  if (dashboard.user.telefones) {
    preencherTelefones();
  }

  // marcando o checkbox 'marque se estagiário'
  if (dashboard.user.unidadeEstagio) {
    document.getElementById(`estagiario`).checked = true;
    const e = { target: { checked: true }}
    definirEstagio(e);
  }

  // definindo o nível do curso, se estudante:
  if (dashboard.user.categoria === 'estudante') {
    document.querySelector(`[name=nivelCurso]`).querySelector(`option[value=${dashboard.user.nivelCurso}]`).selected = true;
    const e = { target: { value: dashboard.user.nivelCurso }}
    definirNivelCurso(e);
  }

  //prenchendo os demais campos
  const arrayCampos = Object.entries(dashboard.user);
  for (let i = 0; i < arrayCampos.length; i++) {
    if (document.querySelector(`[name=${arrayCampos[i][0]}]`) && arrayCampos[i][0] !== 'telefones') {
      document.querySelector(`[name=${arrayCampos[i][0]}]`).value = arrayCampos[i][1];
    } 
  }
};

const rotinasEdicao = () => {    
  prepararForm();
  preencherForm();
  desabilitarCampos();
}

loadScript('/dist/scripts/users.min.js', () => {
  rotinasEdicao();
});

