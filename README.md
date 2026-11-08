# Invex - Gestor de Inventario

Aplicación web sencilla para administrar productos de un inventario. Funciona completamente en el navegador, sin servidor: los datos se guardan en `localStorage` y se conservan entre sesiones.

## Funcionalidades

- Agregar, visualizar, editar y eliminar productos.
- Actualización de la interfaz sin recargar la página (manipulación del DOM).
- Validación de datos con mensajes claros al usuario.
- Persistencia de la información con `localStorage`.
- Buscador de productos por nombre.
- Contador de productos y cálculo automático del valor total del inventario (precio × cantidad).

## Tecnologías

- HTML5
- CSS3
- JavaScript (ES6+): `let/const`, arrow functions, template literals, spread operator y métodos de arreglos (`filter`, `map`, `find`, `some`, `reduce`).

## Estructura del proyecto

```
mi-inventario/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── img/
```

## Modelo de datos

Cada producto es un objeto y la lista completa es un arreglo guardado en `localStorage` bajo la clave `invex_productos`:

```js
{
  id: 1731000000000,
  nombre: "Gaseosa",
  precio: 15.5,
  cantidad: 20,
  descripcion: "Botella de 600 ml"
}
```

## Validaciones

- El nombre es obligatorio y debe tener al menos 2 caracteres.
- El precio debe ser mayor a 0.
- La cantidad debe ser un número entero de 0 o más.
- No se permiten productos con nombre repetido.

## Cómo ejecutarlo

1. Descarga o clona el repositorio.
2. Abre `index.html` en el navegador, o usa la extensión **Live Server** de VS Code.
3. No requiere instalar dependencias.

## Cómo usarlo

1. Llena el formulario y presiona **Agregar** para registrar un producto.
2. Usa **Editar** en una tarjeta para modificar sus datos y **Guardar cambios** para confirmar.
3. Usa **Eliminar** para borrar un producto (pide confirmación).
4. Escribe en el buscador para filtrar productos por nombre.
5. Recarga la página: los datos permanecen guardados.

Para borrar todos los datos, abre las herramientas del navegador (F12) → Application → Local Storage y elimina la clave `invex_productos`.
