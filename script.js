const products = [
    { id: 1, name: "Rose Bouquet", price: 29.99, category: "bouquets", image: "https://images.unsplash.com/photo-1516048015710-7a3b4c86be43?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", description: "Beautiful red roses arranged in a classic bouquet" },
    { id: 2, name: "Tulip Bouquet", price: 24.99, category: "bouquets", image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", description: "Colorful tulips arranged in a spring bouquet" },
    { id: 3, name: "Succulent Plant", price: 19.99, category: "plants", image: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", description: "Low maintenance succulent perfect for any space" },
    { id: 4, name: "Orchid Plant", price: 34.99, category: "plants", image: "https://images.unsplash.com/photo-1518843875959-a47b1e0e2e1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", description: "Elegant orchid plant in a decorative pot" },
    { id: 5, name: "Gift Box", price: 39.99, category: "gifts", image: "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", description: "Luxury gift box with assorted flowers and chocolates" },
    { id: 6, name: "Flower Vase", price: 45.99, category: "gifts", image: "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", description: "Handcrafted ceramic vase with flower arrangement" }
  ];
  
  const productList = document.getElementById("product-list");
  const cartBtn = document.getElementById("cart-btn");
  const cartSection = document.getElementById("cart-section");
  const cartItems = document.getElementById("cart-items");
  const totalPrice = document.getElementById("total-price");
  const cartCount = document.getElementById("cart-count");
  const closeCart = document.getElementById("close-cart");
  const checkoutBtn = document.getElementById("checkout-btn");
  const ctaButton = document.querySelector(".cta-button");
  
  // Get cart from localStorage or initialize empty
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  const ADMIN_PHONE = "8881544975";
  const ADMIN_EMAIL = "admin@bloomandpetals.com";
  
  // Update cart count
  function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCount.textContent = totalItems;
    updateCart(); // Update cart display whenever count changes
  }
  
  // Smooth scroll to products section
  ctaButton.addEventListener("click", () => {
    document.querySelector("#product-list").scrollIntoView({ behavior: "smooth" });
  });
  
  // Add smooth scrolling for navigation links
  document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      document.querySelector(targetId).scrollIntoView({
        behavior: 'smooth'
      });
      
      // Update active link
      document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
      });
      this.classList.add('active');
    });
  });
  
  // Add product filtering functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active filter button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const filter = button.getAttribute('data-filter');
      renderProducts(filter);
    });
  });
  
  function renderProducts(filter = 'all') {
    productList.innerHTML = "";
    const filteredProducts = filter === 'all' 
      ? products 
      : products.filter(product => product.category === filter);
    
    filteredProducts.forEach(product => {
      const card = document.createElement("div");
      card.className = "product";
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="price">$${product.price.toFixed(2)}</p>
        <button onclick="addToCart(${product.id})" class="add-to-cart">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      `;
      productList.appendChild(card);
    });
  }
  
  function notifyAdmin(product) {
    // In a real application, you would send this to your backend server
    // which would then send SMS/email notifications
    console.log(`Admin Notification:
        New item added to cart:
        Product: ${product.name}
        Price: ₹${product.price}
        Contact Admin at:
        Phone: ${ADMIN_PHONE}
        Email: ${ADMIN_EMAIL}
    `);
  }
  
  function addToCart(productId) {
    const item = products.find(p => p.id === productId);
    const existingItem = cart.find(i => i.id === productId);
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ ...item, quantity: 1 });
      // Notify admin when a new item is added
      notifyAdmin(item);
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCart(); // Add this line to update the cart display immediately
    
    // Show notification
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerHTML = `
      <i class="fas fa-check-circle"></i>
      ${item.name} added to cart!
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
  
  function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;
    
    if (cart.length === 0) {
      cartItems.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-cart" style="font-size: 3em; color: #ddd; margin-bottom: 20px;"></i>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added any flowers to your cart yet.</p>
        </div>
      `;
    } else {
      cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
              <span>${item.name}</span>
              <span>$${item.price.toFixed(2)}</span>
              <div class="quantity-controls">
                <button onclick="updateQuantity(${index}, -1)">-</button>
                <span>${item.quantity || 1}</span>
                <button onclick="updateQuantity(${index}, 1)">+</button>
              </div>
            </div>
            <button onclick="removeFromCart(${index})" class="remove-item">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `;
        cartItems.appendChild(li);
        total += item.price * (item.quantity || 1);
      });
    }
    
    totalPrice.textContent = `$${total.toFixed(2)}`;
    
    // Update cart button style if cart is empty
    if (cart.length === 0) {
      cartBtn.classList.remove("has-items");
    } else {
      cartBtn.classList.add("has-items");
    }
  }
  
  function updateQuantity(index, change) {
    const item = cart[index];
    const newQuantity = (item.quantity || 1) + change;
    
    if (newQuantity <= 0) {
      removeFromCart(index);
    } else {
      item.quantity = newQuantity;
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
    }
  }
  
  function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  }
  
  // Toggle cart visibility when cart button is clicked
  cartBtn.addEventListener('click', () => {
    cartSection.classList.toggle("hidden");
    document.body.style.overflow = cartSection.classList.contains("hidden") ? "auto" : "hidden";
  });
  
  closeCart.addEventListener('click', () => {
    cartSection.classList.add("hidden");
    document.body.style.overflow = "auto";
  });
  
  checkoutBtn.onclick = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    alert(`Thank you for your purchase! Total: ₹${total}`);
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    cartSection.classList.add("hidden");
    document.body.style.overflow = "auto";
  };
  
  // Close cart when clicking outside
  document.addEventListener("click", (e) => {
    if (!cartSection.contains(e.target) && !cartBtn.contains(e.target)) {
      cartSection.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  });
  
  // Add contact form functionality
  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Here you would typically send this data to a server
    // For now, we'll just show a success message
    alert(`Thank you for your message, ${name}! We'll get back to you soon.`);
    
    // Reset the form
    contactForm.reset();
  });
  
  // Initialize
  renderProducts();
  updateCartCount();
  