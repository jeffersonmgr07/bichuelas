const productCards = document.querySelectorAll(".js-product-card");

const productModal = document.getElementById("productModal");
const modalProductImage = document.getElementById("modalProductImage");
const modalProductTag = document.getElementById("modalProductTag");
const modalProductName = document.getElementById("modalProductName");
const modalProductDescription = document.getElementById("modalProductDescription");
const modalProductFeatures = document.getElementById("modalProductFeatures");
const modalProductPrice = document.getElementById("modalProductPrice");
const modalProductQty = document.getElementById("modalProductQty");
const addToCartFromModal = document.getElementById("addToCartFromModal");

const qtyMinus = document.getElementById("qtyMinus");
const qtyPlus = document.getElementById("qtyPlus");

const cartDrawer = document.getElementById("cartDrawer");
const cartBackdrop = document.getElementById("cartBackdrop");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartCount = document.getElementById("cartCount");
const goCheckoutBtn = document.getElementById("goCheckoutBtn");

const checkoutModal = document.getElementById("checkoutModal");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutItems = document.getElementById("checkoutItems");
const checkoutTotal = document.getElementById("checkoutTotal");
const deliveryType = document.getElementById("deliveryType");
const shippingFields = document.getElementById("shippingFields");
const pickupFields = document.getElementById("pickupFields");
const fakeYapeBtn = document.getElementById("fakeYapeBtn");

let selectedProduct = null;
let cart = JSON.parse(localStorage.getItem("bichuelas_cart")) || [];

function formatPrice(value) {
  return `S/ ${Number(value).toFixed(2)}`;
}

function saveCart() {
  localStorage.setItem("bichuelas_cart", JSON.stringify(cart));
}

function updateCartCount() {
  const totalUnits = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCount.textContent = totalUnits;
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = `<div class="empty-cart">Tu carrito está vacío.</div>`;
    cartSubtotal.textContent = formatPrice(0);
    updateCartCount();
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <h4>${item.name}</h4>
            <p>Cantidad: ${item.quantity}</p>
            <p>${formatPrice(item.price)} c/u</p>
          </div>
          <button type="button" onclick="removeCartItem('${item.id}')">Quitar</button>
        </div>
      `
    )
    .join("");

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  cartSubtotal.textContent = formatPrice(subtotal);
  updateCartCount();
}

function renderCheckoutResume() {
  if (!cart.length) {
    checkoutItems.innerHTML = `<p>No hay productos en el carrito.</p>`;
    checkoutTotal.textContent = formatPrice(0);
    return;
  }

  checkoutItems.innerHTML = cart
    .map(
      (item) => `
        <div class="checkout-item-line">
          <span>${item.name} x ${item.quantity}</span>
          <strong>${formatPrice(item.price * item.quantity)}</strong>
        </div>
      `
    )
    .join("");

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  checkoutTotal.textContent = formatPrice(total);
}

function openProductModal(product) {
  selectedProduct = product;
  modalProductImage.src = product.image;
  modalProductImage.alt = product.name;
  modalProductTag.textContent = product.tag;
  modalProductName.textContent = product.name;
  modalProductDescription.textContent = product.description;
  modalProductPrice.textContent = formatPrice(product.price);
  modalProductQty.value = 1;

  modalProductFeatures.innerHTML = "";
  product.features.forEach((feature) => {
    const li = document.createElement("li");
    li.textContent = feature;
    modalProductFeatures.appendChild(li);
  });

  productModal.classList.add("active");
  document.body.classList.add("modal-open");
  productModal.setAttribute("aria-hidden", "false");
}

function closeProductModal() {
  productModal.classList.remove("active");
  productModal.setAttribute("aria-hidden", "true");

  if (!cartDrawer.classList.contains("active") && !checkoutModal.classList.contains("active")) {
    document.body.classList.remove("modal-open");
  }
}

function openCart() {
  cartDrawer.classList.add("active");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeCart() {
  cartDrawer.classList.remove("active");
  cartDrawer.setAttribute("aria-hidden", "true");

  if (!productModal.classList.contains("active") && !checkoutModal.classList.contains("active")) {
    document.body.classList.remove("modal-open");
  }
}

function openCheckout() {
  if (!cart.length) {
    alert("Tu carrito está vacío.");
    return;
  }

  renderCheckoutResume();
  checkoutModal.classList.add("active");
  checkoutModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeCheckout() {
  checkoutModal.classList.remove("active");
  checkoutModal.setAttribute("aria-hidden", "true");

  if (!productModal.classList.contains("active") && !cartDrawer.classList.contains("active")) {
    document.body.classList.remove("modal-open");
  }
}

function addToCart(product, quantity) {
  const qty = Number(quantity);

  if (!qty || qty < 1) return;

  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity: qty
    });
  }

  saveCart();
  renderCart();
  closeProductModal();
  openCart();
}

function removeCartItem(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
  renderCheckoutResume();
}

window.removeCartItem = removeCartItem;

productCards.forEach((card) => {
  card.addEventListener("click", () => {
    const product = {
      id: card.dataset.id,
      name: card.dataset.name,
      price: Number(card.dataset.price),
      image: card.dataset.image,
      tag: card.dataset.tag,
      description: card.dataset.description,
      features: card.dataset.features.split("|")
    };

    openProductModal(product);
  });
});

document.querySelectorAll("[data-close-modal]").forEach((btn) => {
  btn.addEventListener("click", closeProductModal);
});

document.querySelectorAll("[data-close-checkout]").forEach((btn) => {
  btn.addEventListener("click", closeCheckout);
});

qtyMinus.addEventListener("click", () => {
  const current = Number(modalProductQty.value) || 1;
  if (current > 1) modalProductQty.value = current - 1;
});

qtyPlus.addEventListener("click", () => {
  const current = Number(modalProductQty.value) || 1;
  modalProductQty.value = current + 1;
});

addToCartFromModal.addEventListener("click", () => {
  if (!selectedProduct) return;
  addToCart(selectedProduct, modalProductQty.value);
});

openCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);

goCheckoutBtn.addEventListener("click", () => {
  closeCart();
  openCheckout();
});

deliveryType.addEventListener("change", (e) => {
  const type = e.target.value;

  if (type === "envio") {
    shippingFields.style.display = "block";
    pickupFields.style.display = "none";

    document.getElementById("department").required = true;
    document.getElementById("province").required = true;
    document.getElementById("district").required = true;
    document.getElementById("address").required = true;
  } else {
    shippingFields.style.display = "none";
    pickupFields.style.display = "block";

    document.getElementById("department").required = false;
    document.getElementById("province").required = false;
    document.getElementById("district").required = false;
    document.getElementById("address").required = false;
  }
});

checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!cart.length) {
    alert("No hay productos en el carrito.");
    return;
  }

  const orderData = {
    customer: {
      name: document.getElementById("customerName").value,
      email: document.getElementById("customerEmail").value,
      phone: document.getElementById("customerPhone").value
    },
    deliveryType: document.getElementById("deliveryType").value,
    shipping: {
      department: document.getElementById("department").value,
      province: document.getElementById("province").value,
      district: document.getElementById("district").value,
      address: document.getElementById("address").value
    },
    items: cart,
    total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  };

  console.log("Orden lista para enviar a Mercado Pago:", orderData);

  // AQUI CONECTARAS MERCADO PAGO LUEGO
  // Ejemplo futuro:
  // fetch('/crear-preferencia', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(orderData)
  // }).then(...)

  alert("Formulario validado. Aquí conectarás Mercado Pago.");
});

fakeYapeBtn.addEventListener("click", () => {
  alert("Aquí luego conectas tu flujo de Yape.");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeProductModal();
    closeCart();
    closeCheckout();
  }
});

renderCart();
renderCheckoutResume();
