/**
 * app.js
 * ------
 * Este archivo es el "puente" entre la lógica (logic.js) y el HTML.
 * Se encarga de:
 *  1. Leer el carrito desde LocalStorage al cargar la página
 *  2. Renderizar (dibujar) los productos en pantalla
 *  3. Renderizar el carrito en el panel lateral
 *  4. Escuchar eventos (clics, botones) y llamar a las funciones de logic.js
 *  5. Guardar el carrito en LocalStorage cada vez que cambia
 */

// ─────────────────────────────────────────────
// 🗂️ ESTADO DE LA APLICACIÓN
// ─────────────────────────────────────────────

/**
 * 'cart' es el array que vive en memoria mientras la página está abierta.
 * Se carga desde LocalStorage al iniciar, y se guarda cada vez que cambia.
 */
let cart = loadCart();

// ─────────────────────────────────────────────
// 🎯 REFERENCIAS AL HTML (elementos del DOM)
// ─────────────────────────────────────────────

// Contenedor donde se muestran las tarjetas de productos
const productsGrid = document.getElementById("products-grid");

// Panel lateral del carrito (el sidebar)
const cartPanel = document.getElementById("cart-panel");

// Lista de items dentro del carrito
const cartItemsList = document.getElementById("cart-items");

// Elemento que muestra el total general
const cartTotal = document.getElementById("cart-total");

// Badge (número rojo) encima del ícono del carrito
const cartBadge = document.getElementById("cart-badge");

// Botón que abre el carrito
const openCartBtn = document.getElementById("open-cart-btn");

// Botón X que cierra el carrito
const closeCartBtn = document.getElementById("close-cart-btn");

// Botón para vaciar todo el carrito
const clearCartBtn = document.getElementById("clear-cart-btn");

// Overlay oscuro detrás del panel del carrito
const cartOverlay = document.getElementById("cart-overlay");

// Notificación que aparece cuando se elimina un producto
const notification = document.getElementById("notification");

// ─────────────────────────────────────────────
// 🃏 RENDERIZAR PRODUCTOS EN PANTALLA
// ─────────────────────────────────────────────

/**
 * Toma el array 'products' de data.js y crea una tarjeta HTML por cada producto.
 * Usa template literals (backticks) para crear el HTML como texto y luego
 * lo inserta en el contenedor.
 */
function renderProducts() {
  // Para cada producto, creamos su tarjeta HTML y las unimos en un solo string
  productsGrid.innerHTML = products.map(product => `
    <article class="product-card" data-id="${product.id}">
      <div class="product-image-wrapper">
        <img 
          src="${product.image}" 
          alt="${product.name}" 
          class="product-image"
          onerror="this.src='assets/images/placeholder.jpg'"
        />
        <span class="product-category">${product.category}</span>
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-footer">
          <span class="product-price">$${formatPrice(product.price)}</span>
          <button 
            class="btn-add-to-cart" 
            data-id="${product.id}"
            aria-label="Agregar ${product.name} al carrito"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>
  `).join(""); // .join("") une todos los strings sin separadores

  // Después de crear las tarjetas, les asignamos los eventos de clic
  attachProductEvents();
}

// ─────────────────────────────────────────────
// 🛒 RENDERIZAR EL CARRITO EN EL PANEL
// ─────────────────────────────────────────────

/**
 * Dibuja todos los items del carrito en el panel lateral.
 * Se llama cada vez que el carrito cambia.
 */
function renderCart() {
  // Actualizamos el badge (número encima del ícono)
  const count = getCartCount(cart);
  cartBadge.textContent = count;
  // Si hay items mostramos el badge, si no lo ocultamos
  cartBadge.style.display = count > 0 ? "flex" : "none";

  // Si el carrito está vacío, mostramos el mensaje
  if (cart.length === 0) {
    cartItemsList.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>El carrito está vacío</p>
      </div>
    `;
    cartTotal.textContent = "$0";
    return; // Salimos de la función, no hay nada más que dibujar
  }

  // Si hay items, los dibujamos uno por uno
  cartItemsList.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-unit-price">$${formatPrice(item.price)} c/u</p>
      </div>
      <div class="cart-item-controls">
        <button 
          class="btn-quantity btn-decrease" 
          data-id="${item.id}" 
          aria-label="Disminuir cantidad de ${item.name}"
        >−</button>
        <span class="cart-item-quantity">${item.quantity}</span>
        <button 
          class="btn-quantity btn-increase" 
          data-id="${item.id}" 
          aria-label="Aumentar cantidad de ${item.name}"
        >+</button>
      </div>
      <div class="cart-item-subtotal">
        <p class="cart-item-total">$${formatPrice(getItemSubtotal(item))}</p>
        <button 
          class="btn-remove" 
          data-id="${item.id}" 
          aria-label="Eliminar ${item.name} del carrito"
        >✕</button>
      </div>
    </div>
  `).join("");

  // Mostramos el total general
  cartTotal.textContent = `$${formatPrice(getCartTotal(cart))}`;

  // Asignamos eventos a los botones del carrito
  attachCartEvents();
}

// ─────────────────────────────────────────────
// 🔔 NOTIFICACIÓN DE PRODUCTO ELIMINADO
// ─────────────────────────────────────────────

/**
 * Muestra un aviso en la parte superior por 2.5 segundos.
 * Después lo oculta automáticamente.
 *
 * @param {string} message - El texto que se mostrará en la notificación
 */
function showNotification(message) {
  notification.textContent = message;
  notification.classList.add("show");

  // Después de 2500ms (2.5 segundos), quitamos la clase 'show'
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2500);
}

// ─────────────────────────────────────────────
// 🖱️ EVENTOS DE LOS BOTONES DE PRODUCTOS
// ─────────────────────────────────────────────

/**
 * Le asigna el evento 'click' a cada botón "Agregar al carrito".
 * Se llama después de renderizar los productos.
 */
function attachProductEvents() {
  const addButtons = document.querySelectorAll(".btn-add-to-cart");

  addButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Obtenemos el id del producto desde el atributo data-id del botón
      const productId = parseInt(button.getAttribute("data-id"));

      // Buscamos el producto en el array de productos por su id
      const product = products.find(p => p.id === productId);

      if (product) {
        // Llamamos a la función de logic.js para actualizar el carrito
        cart = addToCart(cart, product);

        // Guardamos el nuevo carrito en LocalStorage
        saveCart(cart);

        // Actualizamos la vista del carrito
        renderCart();

         // Reproduce el sonido al agregar
        playAddSound();

        // Animación en el botón para dar feedback visual
        button.textContent = "¡Agregado!";
        button.classList.add("btn-added");
        setTimeout(() => {
          button.textContent = "Agregar al carrito";
          button.classList.remove("btn-added");
        }, 1000);
      }
    });
  });
}

// ─────────────────────────────────────────────
// 🖱️ EVENTOS DE LOS BOTONES DEL CARRITO
// ─────────────────────────────────────────────

/**
 * Le asigna eventos a los botones dentro del panel del carrito:
 * - Botón ✕ (eliminar item)
 * - Botones + y − (cantidad)
 */
function attachCartEvents() {
  // Botones de eliminar item (✕)
  document.querySelectorAll(".btn-remove").forEach(button => {
    button.addEventListener("click", () => {
      const productId = parseInt(button.getAttribute("data-id"));
      cart = removeFromCart(cart, productId);
      saveCart(cart);
      renderCart();
      showNotification("Producto eliminado del carrito");
    });
  });

  // Botones de aumentar cantidad (+)
  document.querySelectorAll(".btn-increase").forEach(button => {
    button.addEventListener("click", () => {
      const productId = parseInt(button.getAttribute("data-id"));
      cart = updateQuantity(cart, productId, 1);
      saveCart(cart);
      renderCart();
    });
  });

  // Botones de disminuir cantidad (−)
  document.querySelectorAll(".btn-decrease").forEach(button => {
    button.addEventListener("click", () => {
      const productId = parseInt(button.getAttribute("data-id"));
      // Si el item tiene cantidad 1 y se presiona −, se elimina y muestra notificación
      const item = cart.find(i => i.id === productId);
      cart = updateQuantity(cart, productId, -1);
      saveCart(cart);
      renderCart();
      // Si el item dejó de existir en el carrito, mostramos la notificación
      if (item && item.quantity === 1) {
        showNotification("Producto eliminado del carrito");
      }
    });
  });
}

// ─────────────────────────────────────────────
// 🚪 ABRIR Y CERRAR EL PANEL DEL CARRITO
// ─────────────────────────────────────────────

/**
 * Abre el panel lateral del carrito.
 * Agrega la clase 'open' que activa la animación de entrada en CSS.
 */
function openCart() {
  cartPanel.classList.add("open");
  cartOverlay.classList.add("visible");
  // Bloqueamos el scroll del body para que no se mueva mientras el carrito está abierto
  document.body.style.overflow = "hidden";
}

/**
 * Cierra el panel lateral del carrito.
 */
function closeCart() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("visible");
  document.body.style.overflow = "";
}

// Funcion para que se vea en pesos colombianos //

function formatPrice(number) {
  return "" + number.toLocaleString("es-CO");
}

// ─────────────────────────────────────────────
// 🔗 EVENTOS GLOBALES (botones del header y carrito)
// ─────────────────────────────────────────────

// Abrir carrito al hacer clic en el ícono del header
openCartBtn.addEventListener("click", openCart);

// Cerrar carrito al hacer clic en la X
closeCartBtn.addEventListener("click", closeCart);

// Cerrar carrito al hacer clic en el overlay oscuro de fondo
cartOverlay.addEventListener("click", closeCart);

// Vaciar todo el carrito
clearCartBtn.addEventListener("click", () => {
  if (cart.length === 0) return; // Si ya está vacío, no hacemos nada
  cart = clearCart();
  saveCart(cart);
  renderCart();
  showNotification("El carrito ha sido vaciado");
  // Reproduce sonido al vaciar el carrito
  playClearSound();
});



// SONIDOS

// Reproduce el sonido al agregar un producto
function playAddSound() {
  const addSound = new Audio("assets/sounds/Cachin.mp3");
  addSound.currentTime = 0;
  
  // play() retorna una promesa, esto maneja si el navegador la bloquea
  addSound.play().catch(error => {
    console.log("Error al reproducir sonido:", error);
  });
}

// VACIAR CARRITO
function playClearSound() {
  const clearSound = new Audio("assets/sounds/Eliminar.mp3");
  clearSound.play().catch(error => {
    console.log("Error al reproducir sonido:", error);
  });
}

// function playWelcomeSound() {
//   const welcomeSound = new Audio("assets/sounds/Entrar.mp3");
//   welcomeSound.play().catch(error => {
//     console.log("Error al reproducir bienvenida:", error);
//   });
// }     DOCUMENTADO PORQUE SOLO SUENA AL HACER CLICK. LAMENTABLE

// ─────────────────────────────────────────────
// 🚀 INICIALIZACIÓN DE LA APP
// ─────────────────────────────────────────────

// Reproduce el sonido de bienvenida al primer clic del usuario
// document.addEventListener("click", function reproducirBienvenida() {
//   playWelcomeSound();
//   document.removeEventListener("click", reproducirBienvenida);
// }, { once: true });

/**
 * Esta función se llama UNA VEZ cuando la página carga.
 * Dibuja los productos y el estado actual del carrito (desde LocalStorage).
 */
function init() {
  renderProducts();
  renderCart();
}

// Llamamos a init() para arrancar la app
init();