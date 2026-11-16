const botaoMenu = document.querySelector('.menu-botao');
const menu = document.getElementById('menu');
const formulario = document.getElementById('form-reserva');
const confirmacao = document.getElementById('confirmacao');

function fecharMenu() {
    menu.classList.remove('menu--aberto');
    botaoMenu.setAttribute('aria-expanded', 'false');
}

botaoMenu.addEventListener('click', () => {
    const aberto = menu.classList.toggle('menu--aberto');
    botaoMenu.setAttribute('aria-expanded', String(aberto));
});

menu.addEventListener('click', (evento) => {
    if (evento.target.closest('a')) fecharMenu();
});

document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') fecharMenu();
});

// Cada campo tem uma regra que devolve a mensagem de erro (ou texto vazio, se estiver certo).
const regras = {
    nome: (valor) => (valor.trim().length >= 3 ? '' : 'Digite o seu nome completo.'),
    email: (valor) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim()) ? '' : 'Digite um e-mail válido, como nome@exemplo.com.'),
    telefone: (valor) => (/^\(\d{2}\) \d{4,5}-\d{4}$/.test(valor) ? '' : 'Digite o telefone com DDD, como (35) 99999-0000.')
};

function validarCampo(campo) {
    const mensagem = regras[campo.name](campo.value);
    document.getElementById(`${campo.name}-erro`).textContent = mensagem;
    campo.setAttribute('aria-invalid', String(Boolean(mensagem)));
    return !mensagem;
}

function aplicarMascara(valor) {
    const d = valor.replace(/\D/g, '').slice(0, 11);
    if (d.length === 0) return '';
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

formulario.telefone.addEventListener('input', (evento) => {
    evento.target.value = aplicarMascara(evento.target.value);
});

formulario.addEventListener('focusout', (evento) => {
    if (evento.target.name in regras) validarCampo(evento.target);
});

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const campos = [formulario.nome, formulario.email, formulario.telefone];
    const invalidos = campos.filter((campo) => !validarCampo(campo));

    if (invalidos.length > 0) {
        invalidos[0].focus();
        return;
    }

    formulario.reset();
    confirmacao.showModal();
});

confirmacao.addEventListener('click', (evento) => {
    if (evento.target.closest('[data-fechar]')) confirmacao.close();
});
