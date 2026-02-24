/**
 * logic.js
 * --------
 * Este archivo contiene TODA la lógica del carrito.
 * Las funciones aquí son "puras": reciben datos, hacen algo y retornan un resultado.
 * NO tocan el HTML directamente. Eso lo hace app.js.
 *
 * ¿Por qué separar la lógica del HTML?
 * Porque así podemos probar cada función con Jest sin abrir el navegador.
 * Es un principio de la programación funcional: funciones predecibles y testeables.
 */

// ─────────────────────────────────────────────
// 📦 CARRITO: AGREGAR PRODUCTO
// ─────────────────────────────────────────────

/**
 * Agrega un producto al carrito.
 * Si el producto ya existe, aumenta su cantidad en 1.
 * Si no existe, lo agrega con cantidad 1.
 *
 * @param {Array} cart - El array actual del carrito
 * @param {Object} product - El producto a agregar (debe tener id, name, price)
 * @returns {Array} - Un nuevo array con el carrito actualizado
 */
function addToCart(cart, product) {
  // Buscamos si el producto ya existe en el carrito por su id
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    // Si ya existe, creamos un nuevo array donde ese item tiene +1 en cantidad
    // map() recorre todos los items y retorna un nuevo array (no modifica el original)
    return cart.map(item =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 } // spread: copia el item y cambia quantity
        : item // si no es el mismo, lo deja igual
    );
  } else {
    // Si no existe, lo agregamos al final con quantity: 1
    return [...cart, { ...product, quantity: 1 }];
  }
}

// ─────────────────────────────────────────────
// 🗑️ CARRITO: ELIMINAR PRODUCTO
// ─────────────────────────────────────────────

/**
 * Elimina completamente un producto del carrito por su id.
 *
 * @param {Array} cart - El array actual del carrito
 * @param {number} productId - El id del producto a eliminar
 * @returns {Array} - Un nuevo array sin ese producto
 */
function removeFromCart(cart, productId) {
  // filter() retorna un nuevo array solo con los items que NO tienen ese id
  return cart.filter(item => item.id !== productId);
}

// ─────────────────────────────────────────────
// ➕➖ CARRITO: CAMBIAR CANTIDAD
// ─────────────────────────────────────────────

/**
 * Aumenta o disminuye la cantidad de un producto en el carrito.
 * Si la cantidad llega a 0, el producto se elimina automáticamente.
 *
 * @param {Array} cart - El array actual del carrito
 * @param {number} productId - El id del producto a modificar
 * @param {number} delta - Cuánto sumar o restar (ej: 1 para sumar, -1 para restar)
 * @returns {Array} - Un nuevo array con la cantidad actualizada
 */
function updateQuantity(cart, productId, delta) {
  // Primero actualizamos la cantidad
  const updatedCart = cart.map(item =>
    item.id === productId
      ? { ...item, quantity: item.quantity + delta }
      : item
  );

  // Luego eliminamos los items que quedaron con cantidad 0 o menos
  return updatedCart.filter(item => item.quantity > 0);
}

// ─────────────────────────────────────────────
// 🧮 CALCULAR SUBTOTAL DE UN ITEM
// ─────────────────────────────────────────────

/**
 * Calcula el total de un item individual (precio × cantidad).
 *
 * @param {Object} item - Un item del carrito (debe tener price y quantity)
 * @returns {number} - El total de ese item redondeado a 2 decimales
 */
function getItemSubtotal(item) {
  return parseFloat((item.price * item.quantity).toFixed(2));
}

// ─────────────────────────────────────────────
// 💰 CALCULAR TOTAL DEL CARRITO
// ─────────────────────────────────────────────

/**
 * Calcula el total general sumando todos los items del carrito.
 *
 * @param {Array} cart - El array actual del carrito
 * @returns {number} - El total general redondeado a 2 decimales
 */
function getCartTotal(cart) {
  // reduce() acumula un valor recorriendo el array
  // Empieza en 0 y va sumando el subtotal de cada item
  const total = cart.reduce((accumulator, item) => {
    return accumulator + getItemSubtotal(item);
  }, 0);

  return parseFloat(total.toFixed(2));
}

// ─────────────────────────────────────────────
// 🔢 CONTAR ITEMS EN EL CARRITO
// ─────────────────────────────────────────────

/**
 * Cuenta cuántos items hay en el carrito (sumando todas las cantidades).
 * Sirve para mostrar el número en el ícono del carrito.
 *
 * @param {Array} cart - El array actual del carrito
 * @returns {number} - La cantidad total de productos
 */
function getCartCount(cart) {
  return cart.reduce((accumulator, item) => accumulator + item.quantity, 0);
}

// ─────────────────────────────────────────────
// 🗑️ VACIAR EL CARRITO
// ─────────────────────────────────────────────

/**
 * Retorna un carrito vacío.
 * Simple pero necesario para mantener el patrón funcional.
 *
 * @returns {Array} - Un array vacío
 */
function clearCart() {
  return [];
}

// ─────────────────────────────────────────────
// 💾 GUARDAR Y CARGAR DESDE LOCALSTORAGE
// ─────────────────────────────────────────────

/**
 * Guarda el carrito en LocalStorage.
 * LocalStorage solo guarda texto (strings), por eso usamos JSON.stringify
 * para convertir el array a texto, y JSON.parse para leerlo de vuelta.
 *
 * @param {Array} cart - El carrito a guardar
 */
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/**
 * Carga el carrito desde LocalStorage.
 * Si no hay nada guardado, retorna un array vacío.
 *
 * @returns {Array} - El carrito guardado o un array vacío
 */
function loadCart() {
  const saved = localStorage.getItem("cart");
  // Si 'saved' es null (no hay nada guardado), retornamos array vacío
  return saved ? JSON.parse(saved) : [];
}

// ─────────────────────────────────────────────
// 📤 EXPORTAR FUNCIONES (para Jest)
// ─────────────────────────────────────────────

/**
 * Este bloque exporta las funciones para que Jest pueda importarlas y probarlas.
 * En el navegador este bloque no se ejecuta (typeof module será 'undefined').
 */
if (typeof module !== "undefined") {
  module.exports = {
    addToCart,
    removeFromCart,
    updateQuantity,
    getItemSubtotal,
    getCartTotal,
    getCartCount,
    clearCart,
    saveCart,
    loadCart
  };
}