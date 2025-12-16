const restaurante = {
    nome: "Pizzaria Sabor & Arte",
    corTema: "#00028bff",
    logo: "./assets/img/logo.png",
    telefone: "",
    endereco: "Rua das Flores, 123 - Centro, Cidade Exemplo",
    horarios: "Segunda a Domingo: 18h - 23h",
    cardapio: [
        {
            categoria: "Pizzas Tradicionais",
            itens: [
                { nome: "Calabresa", 
                  descricao: "Molho de tomate, calabresa fatiada, cebola e orégano.", 
                  preco: 25.00, 
                  imagem: "./assets/img/pizza-calabresa.png", 
                  promocao: true, 
                  esgotado: false },

                { nome: "Mussarela", 
                  descricao: "Molho, mussarela, rodelas de tomate e azeitona.", 
                  preco: 38.00, 
                  imagem: "./assets/img/pizza-mussarela.png", 
                  promocao: false, 
                  esgotado: false }
            ]
        },
        {
            categoria: "Bebidas",
            itens: [
                { nome: "Coca-Cola 2L", 
                  descricao: "Garrafa bem gelada.", 
                  preco: 12.00, 
                  imagem: "./assets/img/cocacola2L.png", 
                  promocao: false, 
                  esgotado: false },

                { nome: "Guarana Antartica Lata 350ml", 
                  descricao: "Garrafa bem gelada.", 
                  preco: 6.00, 
                  imagem: "./assets/img/guarana-lata.png", 
                  promocao: false, 
                  esgotado: false }
            ]
        }
    ]
};

let carrinho = [];

function adicionarItem(nome, preco){
    carrinho.push({nome, preco});
    atualizarCarrinho();
}

function atualizarCarrinho(){
    const barra = document.getElementById('carrinho-bar');
    const contador = document.getElementById('contador-itens');
    const totalSpan = document.getElementById('total-carrinho');

    if (carrinho.length === 0) {
        barra.style.display = 'none';
        return;
    }

    barra.style.display = 'flex';
    const total = carrinho.reduce((soma, item) => soma + item.preco, 0);
    contador.innerText = `${carrinho.length} item(s)`;
    totalSpan.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function abrirModal() {
    const modal = document.getElementById('modal-carrinho');
    const listaItens = document.getElementById('itens-carrinho-lista');
    const totalModal = document.getElementById('modal-total-valor');

    listaItens.innerHTML = '';

    carrinho.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'item-carrinho-modal';
        div.innerHTML = `
            <span>${item.nome}</span>
            <div style="display:flex; align-items:center">
                <span style="font-weight:bold">R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
                <button class="btn-remover-item" onclick="removerItem(${index})">Remover 🗑️</button>
            </div>
        `;
        listaItens.appendChild(div);
    });

    const total = carrinho.reduce((soma, item) => soma + item.preco, 0);
    totalModal.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;

    modal.style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modal-carrinho').style.display = 'none';
}

function removerItem(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();

    if (carrinho.length === 0) {
        abrirModal();
    } else {
        fecharModal();
    }
}    

let cardapioAtual = restaurante.cardapio;

function renderizarCardapio() {
    const header = document.getElementById('header-restaurante');

    const container = document.getElementById('container-cardapio');
    const navContainer = document.getElementById('barra-navegacao');
    
    let htmlContent = '';
    let navContent = '';

    cardapioAtual.forEach(categoria => { 
        if(categoria.itens.length === 0) return;

        const idCategoria = categoria.categoria.replace(/\s+/g, '');

        navContent += `<a href="#${idCategoria}" class="botao-nav">${categoria.categoria}</a>`;
        
        htmlContent += `
            <section class="categoria" id="${idCategoria}">
                <h2 style="border-left: 5px solid ${restaurante.corTema}">${categoria.categoria}</h2>
                <div class="itens-grid">
        `;

        categoria.itens.forEach(item => {
            const classeEsgotado = item.esgotado ? 'item-esgotado' : '';
            const avisoHtml = item.esgotado ? '<div class="aviso-esgotado">INDISPONÍVEL</div>' : '';
            const seloHtml = item.promocao && !item.esgotado ? '<span class="selo-promo">OFERTA!</span>' : '';

            htmlContent += `
                <div class="item-card ${classeEsgotado}">
                    ${seloHtml}
                    <img src="${item.imagem}" alt="${item.nome}">
                    <div class="detalhes">
                        <h3>${item.nome}</h3>
                        <p>${item.descricao}</p>
                        ${avisoHtml}
                        <div class="card-footer">
                            <span class="preco">R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
                            <button class="botao-pedir" onclick="adicionarItem('${item.nome}', ${item.preco})" ${item.esgotado ? 'disabled' : ''}>
                                Adicionar ➕
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        htmlContent += `</div></section>`;
    });

    container.innerHTML = htmlContent;
    navContainer.innerHTML = navContent;
}

function  finalizarPedido() {
    if (carrinho.length === 0) return;
    let texto = 'Olá, gostaria de fazer o seguinte pedido:\n\n';

    carrinho.forEach(item => {
        texto += `. ${item.nome}\n`;
    });
    
    const total = carrinho.reduce((soma, item) => soma + item.preco, 0);
    texto += `\n*Total: R$ ${total.toFixed(2).replace('.', ',')}*`;

    const mensagem = encodeURIComponent(texto);
    const linkZap = `https://wa.me/${restaurante.telefone}?text=${mensagem}`;

    window.open(linkZap, '_blank');
}

const inputBusca = document.getElementById('input-busca');

inputBusca.addEventListener('keyup', (evento) => {
    const textoDigitado = inputBusca.value.toLowerCase(); 
    if (textoDigitado === '') {
        cardapioAtual = restaurante.cardapio;
    } else {
        cardapioAtual = restaurante.cardapio.map(categoria => {
            return {
                ...categoria, 
                itens: categoria.itens.filter(item => 
                    item.nome.toLowerCase().includes(textoDigitado) || 
                    item.descricao.toLowerCase().includes(textoDigitado)
                )
            };
        });
    }
    renderizarCardapio();
});
function renderizarRodape() {
    const footer = document.getElementById('rodape-restaurante');
    footer.style.borderTopColor = restaurante.corTema;
    footer.innerHTML = `
        <div class="info-rodape">
            <span class="info-destaque">📍 Endereço:</span>
            <p>${restaurante.endereco}</p>
        </div>
        <div class="info-rodape">
            <span class="info-destaque">⏰ Horários:</span>
            <p>${restaurante.horarios}</p>
        </div>
        <div class="creditos">
            <p>Desenvolvido por <a href="https://github.com/pouskzin" target="_blank">PouskDEV</a></p>
        </div>
    `;
}

document.querySelector('#header-restaurante h1').innerText = restaurante.nome;
document.querySelector('.logo').src = restaurante.logo;

renderizarCardapio();
renderizarRodape();
