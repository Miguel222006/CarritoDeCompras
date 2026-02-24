/**
 * logic.test.js
 * -------------
 * Pruebas unitarias para las funciones de logic.js.
 *
 * ¿Qué es una prueba unitaria?
 * Es una función que verifica que otra función hace exactamente lo que se espera.
 * Formato básico:
 *
 *   test("descripción de lo que se prueba", () => {
 *     expect( funcionQueProbo(argumentos) ).toBe( resultadoEsperado );
 *   });
 *
 * Comandos para correr las pruebas:
 *   npm test                  → corre las pruebas
 *   npm run test:coverage     → corre las pruebas y muestra el % de cobertura
 */

// Importamos las funciones que vamos a probar desde logic.js
const {
  addToCart,
  removeFromCart,
  updateQuantity,
  getItemSubtotal,
  getCartTotal,
  getCartCount,
  clearCart
} = require("../js/logic.js");

// ─────────────────────────────────────────────
// 🧰 DATOS DE PRUEBA (fixtures)
// ─────────────────────────────────────────────

/**
 * Estos son datos que usamos en las pruebas.
 * No son los productos reales, son datos simples para testear.
 */
const mockProduct1 = { id: 1, name: "Auriculares", price: 59.99 };
const mockProduct2 = { id: 2, name: "Teclado", price: 89.99 };

// Un carrito con un producto ya agregado (quantity: 2)
const mockCartWithItems = [
  { id: 1, name: "Auriculares", price: 59.99, quantity: 2 },
  { id: 2, name: "Teclado", price: 89.99, quantity: 1 }
];

// ─────────────────────────────────────────────
// ✅ PRUEBAS PARA: addToCart()
// ─────────────────────────────────────────────

describe("addToCart", () => {
  /**
   * 'describe' agrupa pruebas relacionadas.
   * Es como un "capítulo" de pruebas.
   */

  test("debe agregar un producto nuevo al carrito vacío", () => {
    const carritoVacio = [];
    const resultado = addToCart(carritoVacio, mockProduct1);

    // El resultado debe tener 1 item
    expect(resultado.length).toBe(1);
    // Ese item debe tener quantity: 1
    expect(resultado[0].quantity).toBe(1);
    // El id debe ser el correcto
    expect(resultado[0].id).toBe(1);
  });

  test("debe aumentar la cantidad si el producto ya existe en el carrito", () => {
    // Carrito que ya tiene el producto 1 con quantity: 1
    const carritoExistente = [{ ...mockProduct1, quantity: 1 }];
    const resultado = addToCart(carritoExistente, mockProduct1);

    // Sigue siendo 1 item (no se duplica)
    expect(resultado.length).toBe(1);
    // La cantidad aumentó a 2
    expect(resultado[0].quantity).toBe(2);
  });

  test("debe agregar múltiples productos distintos", () => {
    let carrito = [];
    carrito = addToCart(carrito, mockProduct1);
    carrito = addToCart(carrito, mockProduct2);

    expect(carrito.length).toBe(2);
  });

  test("no debe modificar el array original (inmutabilidad)", () => {
    const carritoOriginal = [{ ...mockProduct1, quantity: 1 }];
    addToCart(carritoOriginal, mockProduct1);

    // El array original no debe cambiar
    expect(carritoOriginal[0].quantity).toBe(1);
  });
});

// ─────────────────────────────────────────────
// ✅ PRUEBAS PARA: removeFromCart()
// ─────────────────────────────────────────────

describe("removeFromCart", () => {

  test("debe eliminar el producto con el id correcto", () => {
    const resultado = removeFromCart(mockCartWithItems, 1);

    // El carrito pasa de 2 a 1 item
    expect(resultado.length).toBe(1);
    // El item restante debe ser el id 2
    expect(resultado[0].id).toBe(2);
  });

  test("debe retornar el mismo carrito si el id no existe", () => {
    const resultado = removeFromCart(mockCartWithItems, 999);
    expect(resultado.length).toBe(2);
  });

  test("debe retornar array vacío si se elimina el único item", () => {
    const carritoConUno = [{ ...mockProduct1, quantity: 1 }];
    const resultado = removeFromCart(carritoConUno, 1);
    expect(resultado.length).toBe(0);
  });
});

// ─────────────────────────────────────────────
// ✅ PRUEBAS PARA: updateQuantity()
// ─────────────────────────────────────────────

describe("updateQuantity", () => {

  test("debe aumentar la cantidad en 1", () => {
    const carrito = [{ ...mockProduct1, quantity: 1 }];
    const resultado = updateQuantity(carrito, 1, 1);
    expect(resultado[0].quantity).toBe(2);
  });

  test("debe disminuir la cantidad en 1", () => {
    const carrito = [{ ...mockProduct1, quantity: 3 }];
    const resultado = updateQuantity(carrito, 1, -1);
    expect(resultado[0].quantity).toBe(2);
  });

  test("debe eliminar el item si la cantidad llega a 0", () => {
    const carrito = [{ ...mockProduct1, quantity: 1 }];
    const resultado = updateQuantity(carrito, 1, -1);
    // Si quantity llega a 0, el item se elimina
    expect(resultado.length).toBe(0);
  });
});

// ─────────────────────────────────────────────
// ✅ PRUEBAS PARA: getItemSubtotal()
// ─────────────────────────────────────────────

describe("getItemSubtotal", () => {

  test("debe calcular correctamente el subtotal de un item", () => {
    const item = { price: 59.99, quantity: 2 };
    const resultado = getItemSubtotal(item);
    // 59.99 × 2 = 119.98
    expect(resultado).toBe(119.98);
  });

  test("debe retornar el precio si la cantidad es 1", () => {
    const item = { price: 29.99, quantity: 1 };
    expect(getItemSubtotal(item)).toBe(29.99);
  });

  test("debe manejar decimales correctamente", () => {
    const item = { price: 10.10, quantity: 3 };
    // 10.10 × 3 = 30.30
    expect(getItemSubtotal(item)).toBe(30.30);
  });
});

// ─────────────────────────────────────────────
// ✅ PRUEBAS PARA: getCartTotal()
// ─────────────────────────────────────────────

describe("getCartTotal", () => {

  test("debe retornar 0 para un carrito vacío", () => {
    expect(getCartTotal([])).toBe(0);
  });

  test("debe calcular correctamente el total del carrito", () => {
    // mockCartWithItems: Auriculares $59.99 × 2 = $119.98, Teclado $89.99 × 1 = $89.99
    // Total: $209.97
    const total = getCartTotal(mockCartWithItems);
    expect(total).toBe(209.97);
  });

  test("debe calcular correctamente con un solo item", () => {
    const carrito = [{ price: 44.99, quantity: 1 }];
    expect(getCartTotal(carrito)).toBe(44.99);
  });
});

// ─────────────────────────────────────────────
// ✅ PRUEBAS PARA: getCartCount()
// ─────────────────────────────────────────────

describe("getCartCount", () => {

  test("debe retornar 0 para un carrito vacío", () => {
    expect(getCartCount([])).toBe(0);
  });

  test("debe sumar las cantidades de todos los items", () => {
    // mockCartWithItems: quantity 2 + quantity 1 = 3
    expect(getCartCount(mockCartWithItems)).toBe(3);
  });

  test("debe contar correctamente con un solo item", () => {
    const carrito = [{ ...mockProduct1, quantity: 5 }];
    expect(getCartCount(carrito)).toBe(5);
  });
});

// ─────────────────────────────────────────────
// ✅ PRUEBAS PARA: clearCart()
// ─────────────────────────────────────────────

describe("clearCart", () => {

  test("debe retornar un array vacío", () => {
    const resultado = clearCart();
    expect(resultado).toEqual([]);
    expect(resultado.length).toBe(0);
  });

  test("debe retornar un array vacío sin importar qué había antes", () => {
    // No recibe el carrito como argumento, siempre retorna []
    const resultado = clearCart();
    expect(Array.isArray(resultado)).toBe(true);
    expect(resultado.length).toBe(0);
  });
});