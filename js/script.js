// Base de datos de productos
const products = [
    { id: 8, name: "Alakazam", type: "Psíquico", rarity: "Rara", price: 65.00, image: "img/alakazam.png" },
    { id: 9, name: "Arcanine", type: "Fuego", rarity: "Poco común", price: 40.00, image: "img/Arcanine.png" },
    { id: 2, name: "Blastoise", type: "Agua", rarity: "Holográfica", price: 120.00, image: "img/Blastoise.jpg" },
    { id: 15, name: "Charmeleon", type: "Fuego", rarity: "Común", price: 22.00, image: "img/charmeleon.png" },
    { id: 5, name: "Dragonite", type: "Dragón", rarity: "Rara", price: 280.00, image: "img/Dragonite.png" },
    { id: 4, name: "Pikachu", type: "Eléctrico", rarity: "Rara", price: 85.00, image: "img/pikachu.png" },
    { id: 7, name: "Pikachu EX", type: "Eléctrico", rarity: "EX", price: 200.00, image: "img/pikachuex.jpg" },
    { id: 13, name: "Raichu", type: "Eléctrico", rarity: "Común", price: 30.00, image: "img/Raichu.webp" },
    { id: 14, name: "Wartortle", type: "Agua", rarity: "Común", price: 20.00, image: "img/SV3PT5_LA_68.png" }
];

// Carrito global
let cart = JSON.parse(localStorage.getItem('pokeCart')) || [];

// Funciones del carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartDisplay();
    showNotification(`${product.name} agregado al carrito`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartDisplay();
        }
    }
}

function saveCart() {
    localStorage.setItem('pokeCart', JSON.stringify(cart));
}

function updateCartDisplay() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Actualizar contador en la página principal
    const cartCountElements = document.querySelectorAll('.cart-count');
    const cartTotalElements = document.querySelectorAll('.cart-total');
    
    // Actualizar todos los elementos con clase cart-count
    cartCountElements.forEach(element => {
        if (element) {
            element.textContent = cartCount;
            // Mostrar/ocultar según si hay productos
            if (cartCount === 0) {
                element.classList.add('hidden');
            } else {
                element.classList.remove('hidden');
            }
        }
    });
    
    // Actualizar todos los elementos con clase cart-total
    cartTotalElements.forEach(element => {
        if (element) {
            element.textContent = cartTotal.toFixed(2);
        }
    });

    // Actualizar también en el modal del carrito si existe
    const modalCartCount = document.getElementById('modal-cart-count');
    const modalCartTotal = document.getElementById('modal-total');
    
    if (modalCartCount) {
        modalCartCount.textContent = cartCount;
        modalCartCount.classList.toggle('hidden', cartCount === 0);
    }
    if (modalCartTotal) modalCartTotal.textContent = cartTotal.toFixed(2);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Funciones de navegación
function openCart() {
    window.location.href = 'carrito.html';
}

// Funciones de renderizado
function renderProducts() {
    const grid = document.getElementById('products-container');
    if (!grid) return;

    grid.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image"><img src="${product.image}" alt="${product.name}" loading="lazy" /></div>
            <div class="product-name">${product.name}</div>
            <div class="product-type">${product.type}</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                Agregar al Carrito
            </button>
        `;
        grid.appendChild(productCard);
    });
}

// Funciones específicas para carrito.html
function renderCart() {
    const container = document.getElementById('cart-container');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <h2>🛍️ Tu carrito está vacío</h2>
                <p>¡Agrega algunas cartas Pokémon increíbles a tu colección!</p>
                <a href="index.html" class="continue-shopping">Continuar comprando</a>
            </div>
        `;
        return;
    }

    const cartItems = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return { ...product, quantity: item.quantity };
    });

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    container.innerHTML = `
        <div class="cart-section">
            <div class="cart-items">
                <h2>Tus Cartas</h2>
                ${cartItems.map(item => `
                    <div class="cart-item">
                        <div class="item-image"><img src="${item.image}" alt="${item.name}" loading="lazy" /></div>
                        <div class="item-details">
                            <h3>${item.name}</h3>
                            <div class="item-type">${item.type} • ${item.rarity}</div>
                        </div>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑️</button>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-summary">
                <h2>Resumen del Pedido</h2>
                <div class="summary-item">
                    <span>Subtotal:</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-item">
                    <span>IVA (16%):</span>
                    <span>$${tax.toFixed(2)}</span>
                </div>
                <div class="summary-total">
                    Total: $${total.toFixed(2)}
                </div>
                
                <div class="checkout-form">
                    <h3>Información de Envío</h3>
                    <div class="form-group">
                        <label>Nombre Completo</label>
                        <input type="text" id="fullName" placeholder="Ingresa tu nombre completo">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="email" placeholder="tu@email.com">
                    </div>
                    <div class="form-group">
                        <label>Dirección</label>
                        <input type="text" id="address" placeholder="Calle, número, colonia">
                    </div>
                    <div class="form-group">
                        <label>Ciudad</label>
                        <input type="text" id="city" placeholder="Ciudad">
                    </div>
                    <div class="form-group">
                        <label>Código Postal</label>
                        <input type="text" id="zipCode" placeholder="00000">
                    </div>
                    
                    <button class="checkout-btn" onclick="processCheckout()">
                        Finalizar Compra
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Función para procesar checkout
function processCheckout() {
    const fullName = document.getElementById('fullName')?.value;
    const email = document.getElementById('email')?.value;
    const address = document.getElementById('address')?.value;
    const city = document.getElementById('city')?.value;
    const zipCode = document.getElementById('zipCode')?.value;

    if (!fullName || !email || !address || !city || !zipCode) {
        alert('Por favor completa todos los campos de envío');
        return;
    }

    if (!validateEmail(email)) {
        alert('Por favor ingresa un email válido');
        return;
    }

    const cartItems = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return { ...product, quantity: item.quantity };
    });

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    alert(`¡Compra realizada con éxito!\n\nTotal: $${total.toFixed(2)}\n\nGracias por tu compra en PokéCards Store!`);
    
    // Limpiar carrito
    cart = [];
    saveCart();
    updateCartDisplay();
    renderCart();
}

// Función de validación de email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartDisplay();
    if (window.location.pathname.endsWith('carrito.html')) {
        renderCart();
    }

    // Animar header al hacer scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Animar botones y productos al cargar
    const buttons = document.querySelectorAll('.btn, .add-to-cart');
    buttons.forEach(btn => {
        btn.classList.add('glow-effect');
    });

    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.classList.add('fade-in');
    });

    // Toggle menú móvil
    const btnMenu = document.querySelector('.btn-menu');
    const nav = document.getElementById('primary-navigation');

    if (btnMenu && nav) {
        btnMenu.addEventListener('click', () => {
            const isExpanded = btnMenu.getAttribute('aria-expanded') === 'true';
            btnMenu.setAttribute('aria-expanded', String(!isExpanded));
            if (nav.hasAttribute('hidden')) {
                nav.removeAttribute('hidden');
            } else {
                nav.setAttribute('hidden', '');
            }
        });
    }
});
