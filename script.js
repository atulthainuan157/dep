// Sample Products Data
const products = [
    {
        id: 1,
        name: 'Wireless Headphones',
        category: 'electronics',
        price: 79.99,
        description: 'High-quality wireless headphones with noise cancellation',
        emoji: '🎧'
    },
    {
        id: 2,
        name: 'Smart Watch',
        category: 'electronics',
        price: 199.99,
        description: 'Feature-rich smartwatch with health tracking',
        emoji: '⌚'
    },
    {
        id: 3,
        name: 'Running Shoes',
        category: 'clothing',
        price: 89.99,
        description: 'Comfortable athletic running shoes',
        emoji: '👟'
    },
    {
        id: 4,
        name: 'Winter Jacket',
        category: 'clothing',
        price: 149.99,
        description: 'Warm and stylish winter jacket',
        emoji: '🧥'
    },
    {
        id: 5,
        name: 'Programming Book',
        category: 'books',
        price: 45.99,
        description: 'Learn web development from scratch',
        emoji: '📚'
    },
    {
        id: 6,
        name: 'Science Fiction Novel',
        category: 'books',
        price: 24.99,
        description: 'Thrilling sci-fi adventure',
        emoji: '📖'
    },
    {
        id: 7,
        name: 'Leather Wallet',
        category: 'accessories',
        price: 34.99,
        description: 'Premium leather wallet with RFID protection',
        emoji: '👜'
    },
    {
        id: 8,
        name: 'Sunglasses',
        category: 'accessories',
        price: 129.99,
        description: 'UV protection sunglasses',
        emoji: '😎'
    },
    {
        id: 9,
        name: 'Portable Speaker',
        category: 'electronics',
        price: 59.99,
        description: 'Bluetooth portable speaker with great sound',
        emoji: '🔊'
    },
    {
        id: 10,
        name: 'Wireless Charger',
        category: 'electronics',
        price: 39.99,
        description: 'Fast wireless charging pad',
        emoji: '⚡'
    },
    {
        id: 11,
        name: 'Cotton T-Shirt',
        category: 'clothing',
        price: 19.99,
        description: 'Comfortable 100% cotton t-shirt',
        emoji: '👕'
    },
    {
        id: 12,
        name: 'Jeans',
        category: 'clothing',
        price: 69.99,
        description: 'Classic denim jeans',
        emoji: '👖'
    }
];

// Cart Array
let cart = [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeCartBtn = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartCountSpan = document.getElementById('cartCount');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    setupEventListeners();
    loadCartFromStorage();
});

// Setup Event Listeners
function setupEventListeners() {
    cartIcon.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    categoryFilter.addEventListener('change', applyFilters);
    priceFilter.addEventListener('change', applyFilters);
    
    // Close cart when clicking outside
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) closeCart();
    });
}

// Display Products
function displayProducts(productsToDisplay) {
    productsGrid.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No products found</p>';
        return;
    }
    
    productsToDisplay.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = `product-card ${product.category}`;
    card.innerHTML = `
        <div class="product-image">${product.emoji}</div>
        <div class="product-info">
            <p class="product-category">${product.category}</p>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
                <span class="product-price">$${product.price.toFixed(2)}</span>
                <button class="btn-add-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `;
    return card;
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartCount();
    displayCart();
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCartToStorage();
            displayCart();
        }
    }
}

// Update Cart Count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = totalItems;
}

// Display Cart
function displayCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        updateCartTotals();
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-qty">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">×</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    updateCartTotals();
}

// Update Cart Totals
function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Open Cart Modal
function openCart() {
    cartModal.classList.add('active');
    displayCart();
}

// Close Cart Modal
function closeCart() {
    cartModal.classList.remove('active');
}

// Search Products
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (!searchTerm) {
        applyFilters();
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    displayProducts(filteredProducts);
}

// Apply Filters
function applyFilters() {
    let filteredProducts = [...products];
    
    // Category filter
    const selectedCategory = categoryFilter.value;
    if (selectedCategory) {
        filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
    }
    
    // Price filter
    const selectedPrice = priceFilter.value;
    if (selectedPrice) {
        filteredProducts = filteredProducts.filter(p => {
            if (selectedPrice === '0-50') return p.price <= 50;
            if (selectedPrice === '50-100') return p.price > 50 && p.price <= 100;
            if (selectedPrice === '100-500') return p.price > 100 && p.price <= 500;
            if (selectedPrice === '500+') return p.price > 500;
            return true;
        });
    }
    
    // Search term filter
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    displayProducts(filteredProducts);
}

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Local Storage Functions
function saveCartToStorage() {
    localStorage.setItem('shophubCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('shophubCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Add CSS animation
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Checkout Button Handler
document.querySelector('.btn-checkout').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = document.getElementById('total').textContent;
    showNotification(`Order placed! Total: ${total}`);
    
    // Clear cart after checkout
    setTimeout(() => {
        cart = [];
        saveCartToStorage();
        updateCartCount();
        closeCart();
        displayProducts(products);
    }, 2000);
});
