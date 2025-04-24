// Get cart items from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartItemsList = document.getElementById('cart-items-list');
const subtotalElement = document.getElementById('subtotal');
const totalPriceElement = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');

function updateCart() {
  if (cart.length === 0) {
    cartItemsList.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart" style="font-size: 3em; color: #ddd; margin-bottom: 20px;"></i>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added any flowers to your cart yet.</p>
      </div>
    `;
    subtotalElement.textContent = '₹0';
    totalPriceElement.textContent = '₹0';
    return;
  }

  cartItemsList.innerHTML = '';
  let subtotal = 0;

  cart.forEach((item, index) => {
    subtotal += item.price * (item.quantity || 1);
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <div class="cart-item-price">₹${item.price}</div>
        <div class="cart-item-quantity">
          <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
          <span>${item.quantity || 1}</span>
          <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="removeFromCart(${index})">
        <i class="fas fa-trash"></i>
      </button>
    `;
    cartItemsList.appendChild(cartItem);
  });

  subtotalElement.textContent = `₹${subtotal}`;
  totalPriceElement.textContent = `₹${subtotal + 50}`; // Adding ₹50 shipping
}

function updateQuantity(index, change) {
  const item = cart[index];
  const newQuantity = (item.quantity || 1) + change;
  
  if (newQuantity < 1) return;
  
  item.quantity = newQuantity;
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
}

checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0) + 50;
  alert(`Thank you for your purchase! Total: ₹${total}`);
  cart = [];
  localStorage.removeItem('cart');
  updateCart();
});

// Initialize cart display
updateCart(); 