# 🛒 Carrito Premium

Aplicación web de carrito de compras desarrollada con **HTML, CSS y JavaScript puro**. Aplica principios de programación funcional y pruebas unitarias con Jest.

---

## 📁 Estructura del proyecto

carrito-app/
├── .vscode/
│   └── settings.json        → Configuración del editor VS Code
├── assets/
│   └── images/              → Imágenes de los productos
├── coverage/                → Reporte de cobertura generado por Jest (no se sube al repo)
├── js/
│   ├── data.js              → Datos de productos (array estático)
│   ├── logic.js             → Funciones puras de lógica del carrito
│   └── app.js               → Conexión entre lógica y el DOM (HTML)
├── node_modules/            → Dependencias instaladas por npm (no se sube al repo)
├── styles/
│   └── styles.css           → Estilos de la interfaz
├── tests/




│   └── logic.test.js        → Pruebas unitarias con Jest
├── .gitignore               → Archivos que Git debe ignorar
├── index.html               → Estructura HTML principal
├── package-lock.json        → Registro exacto de versiones de dependencias
├── package.json             → Configuración del proyecto y scripts de npm
└── README.md                → Este archivo
```

---

## 🚀 Cómo usar la aplicación

1. Abre el archivo `index.html` directamente en tu navegador.
2. No necesitas servidor ni instalación para ver la app.

---

## 🧪 Cómo correr las pruebas unitarias

Primero asegúrate de tener las dependencias instaladas:

```bash
npm install
```

Correr pruebas:

```bash
npm test
```

Correr pruebas con reporte de cobertura de código:

```bash
npm run test:coverage
```

---

## ✨ Funcionalidades

- Listado de productos en tarjetas con imagen, categoría, descripción y precio
- Agregar productos al carrito con un clic
- Si el producto ya está en el carrito, aumenta la cantidad (no se duplica)
- Botones `+` y `−` para controlar la cantidad de cada item
- Eliminar items individuales del carrito
- Vaciar todo el carrito de una vez
- Subtotal por item y total general en tiempo real
- Carrito persistente con `localStorage` (sobrevive recargas de página)
- Notificación al eliminar un producto
- Panel lateral deslizable con overlay
- Diseño responsive para móvil, tablet y escritorio

---

## 🧠 Conceptos aplicados

- **Programación funcional**: funciones puras en `logic.js` sin efectos secundarios
- **Inmutabilidad**: los arrays nunca se modifican, siempre se crea uno nuevo
- **Separación de responsabilidades**: datos / lógica / presentación en archivos distintos
- **Pruebas unitarias**: cada función probada de forma aislada con Jest
- **Cobertura de código**: medida con `jest --coverage`
- **LocalStorage**: persistencia sin base de datos
- **Accesibilidad**: atributos `aria-label`, `role`, y `aria-live`