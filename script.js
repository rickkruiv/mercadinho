let productsData = [];
const cart = JSON.parse(localStorage.getItem('cart')) || [];
let indexEditando = null;

async function loadProducts() {
    const res = await fetch('https://fakestoreapi.com/products');
    const products = await res.json();
    productsData = products;
    const list = document.getElementById('product-list');

    products.forEach((product, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        col.innerHTML = `
          <div class="product-card">
            <img src="${product.image}" alt="${product.title}">
            <h5>${product.title}</h5>
            <p class="fw-bold">R$ ${product.price.toFixed(2)}</p>
            <button class="buy-btn" onclick="addToCart(${index})">Comprar</button>
          </div>
        `;
        list.appendChild(col);
    });
}

function addToCart(index) {
    const existingItem = cart.find(item => item.id === productsData[index].id);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({
            id: productsData[index].id,
            title: productsData[index].title,
            price: productsData[index].price,
            image: productsData[index].image,
            qty: 1
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    showCartToast();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function editQuantity(index) {
    indexEditando = index;
    document.getElementById('edit-product-name').innerText = cart[index].title;
    document.getElementById('new-qty').value = cart[index].qty;
    document.getElementById('edit-qty-overlay').style.display = 'flex';
}

function salvarQuantidade() {
    const novaQtd = parseInt(document.getElementById('new-qty').value);
    if (isNaN(novaQtd) || novaQtd <= 0) {
        alert('Digite uma quantidade válida.');
        return;
    }
    cart[indexEditando].qty = novaQtd;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    fecharEditar();
}

function fecharEditar() {
    document.getElementById('edit-qty-overlay').style.display = 'none';
}


function updateCart() {
    const container = document.getElementById('cart-items');
    const count = document.getElementById('cart-count');
    const total = document.getElementById('cart-total');
    container.innerHTML = '';
    let totalPrice = 0;

    cart.forEach((item, i) => {
        const itemTotal = item.price * item.qty;
        totalPrice += itemTotal;

        const div = document.createElement('div');
        div.className = 'd-flex align-items-start mb-3';
        div.innerHTML = `
          <img src="${item.image}" alt="">
          <div class="flex-grow-1">
            <strong>${item.title}</strong><br>
            <small>Preço: R$ ${item.price.toFixed(2)} | Qtd: ${item.qty} | Total: R$ ${itemTotal.toFixed(2)}</small>
            <br>
            <button class="btn btn-sm btn-secondary me-1 mt-1" onclick="editQuantity(${i})">Editar</button>
            <button class="btn btn-sm btn-danger mt-1" onclick="removeFromCart(${i})">Remover</button>
          </div>
        `;
        container.appendChild(div);
    });

    count.innerText = cart.reduce((acc, item) => acc + item.qty, 0);
    total.innerText = totalPrice.toFixed(2);
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar.style.right === '0px') {
        sidebar.style.right = '-400px';
    } else {
        sidebar.style.right = '0px';
        updateCart();
    }
}

window.onload = () => {
    updateCart();
    loadProducts();
}

function finalizarPedido() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    cart.length = 0;
    localStorage.removeItem('cart');
    updateCart();
    toggleCart();
    document.getElementById('overlay').style.display = 'flex';
}

function closeOverlay() {
    document.getElementById('overlay').style.display = 'none';
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (email === 'Choma' && password === '1234') {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('app-section').style.display = 'block';
        updateCart();
        loadProducts();
    } else {
        alert('E-mail ou senha incorretos!');
    }
}

function showCartToast() {
    const toast = document.getElementById('cart-toast');
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 2000);
}

function irParaCheckout() {
    document.getElementById('cart-sidebar').style.right = '-400px';
    document.getElementById('app-section').style.display = 'none';
    document.getElementById('checkout-section').style.display = 'block';
    renderizarItensCheckout();
}

function renderizarItensCheckout() {
    const container = document.getElementById('checkout-items');
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p>Seu carrinho está vazio!</p>';
        return;
    }

    let totalGeral = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        totalGeral += itemTotal;

        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
      <strong>${item.title}</strong> - ${item.qty} x R$ ${item.price.toFixed(2)} = R$ ${itemTotal.toFixed(2)}
      <hr>
    `;
        container.appendChild(itemDiv);
    });

    const totalDiv = document.createElement('div');
    totalDiv.innerHTML = `<h5>Total da compra: R$ ${totalGeral.toFixed(2)}</h5>`;
    container.appendChild(totalDiv);
}


function confirmarPedido() {
    const endereco = document.getElementById('address').value;
    const cidade = document.getElementById('city').value;
    const cep = document.getElementById('zip').value;
    const pagamento = document.getElementById('payment-method').value;

    if (!endereco || !cidade || !cep) {
        alert('Por favor, preencha o endereço completo.');
        return;
    }

    cart.length = 0;
    localStorage.removeItem('cart');
    updateCart();

    document.getElementById('checkout-section').style.display = 'none';
    document.getElementById('order-confirmation-overlay').style.display = 'flex';
}

function fecharConfirmacaoPedido() {
    document.getElementById('order-confirmation-overlay').style.display = 'none';
    document.getElementById('app-section').style.display = 'block';
}

function cancelarCheckout() {
    document.getElementById('checkout-section').style.display = 'none';
    document.getElementById('app-section').style.display = 'block';
}
