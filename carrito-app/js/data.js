/**
 * data.js
 * -------
 * Este archivo contiene los datos de los productos de la tienda.
 * Es como una "base de datos falsa" en JavaScript.
 * Aquí NO hay lógica, solo información.
 *
 * Cada producto tiene:
 * - id: número único que identifica al producto
 * - name: nombre del producto
 * - price: precio en números (sin símbolos)
 * - image: ruta a la imagen del producto
 * - category: categoría a la que pertenece
 * - description: descripción corta del producto
 */

const products = [
  {
    id: 1,
    name: "Auriculares Bluetooth",
    price: 90000,
    image: "assets/images/auriculares.jpg",
    category: "Electrónica",
    description: "Sonido envolvente con cancelación de ruido y 20h de batería."
  },
  {
    id: 2,
    name: "Teclado Mecánico",
    price: 80000,
    image: "assets/images/teclado.jpg",
    category: "Electrónica",
    description: "Teclado compacto con switches táctiles y retroiluminación RGB."
  },
  {
    id: 3,
    name: "Mochila Urbana",
    price: 50000,
    image: "assets/images/mochila.jpg",
    category: "Accesorios",
    description: "Mochila resistente al agua con compartimento para laptop de 15\"."
  },
  {
    id: 4,
    name: "Lámpara LED de Escritorio",
    price: 40000,
    image: "assets/images/lampara.jpg",
    category: "Hogar",
    description: "Luz ajustable con 3 modos de temperatura y puerto USB integrado."
  },
  {
    id: 5,
    name: "Mouse Inalámbrico",
    price: 60000,
    image: "assets/images/mouse.jpg",
    category: "Electrónica",
    description: "Mouse silencioso con receptor USB y batería de larga duración."
  },
  {
    id: 6,
    name: "Libreta de Notas A5",
    price: 15000,
    image: "assets/images/libreta.jpg",
    category: "Papelería",
    description: "Libreta de 200 páginas con papel grueso ideal para bolígrafos y marcadores."
  },
  {
    id: 7,
    name: "Termo Acero Inoxidable",
    price: 30000,
    image: "assets/images/termo.jpg",
    category: "Hogar",
    description: "Mantiene bebidas frías 24h y calientes 12h. Libre de BPA."
  },
  {
    id: 8,
    name: "Soporte para Laptop",
    price: 60000,
    image: "assets/images/soporte.jpg",
    category: "Accesorios",
    description: "Soporte ajustable de aluminio, plegable y compatible con laptops de 10\" a 17\"."
  }
];

/**
 * Esta línea exporta el array 'products' para que otros archivos JS puedan usarlo.
 * En el navegador no se usa 'export', pero sí en el entorno de pruebas con Jest.
 * El bloque typeof module !== 'undefined' verifica si estamos en Node.js (Jest)
 * o en el navegador, para no causar errores.
 */
if (typeof module !== "undefined") {
  module.exports = { products };
}