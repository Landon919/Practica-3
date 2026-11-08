const CLAVE = 'invex_productos';

let productos = [];
let editandoId = null;   

function guardar() {
  localStorage.setItem(CLAVE, JSON.stringify(productos));
}

function cargar() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) ?? [];
  } catch {
    return [];  
  }
}

productos = cargar();

const form = document.getElementById('productoForm');
const grid = document.getElementById('productsGrid');
const mensaje = document.getElementById('mensaje');
const buscador = document.getElementById('buscador');
const btnGuardar = document.getElementById('btnGuardar');
const btnCancelar = document.getElementById('btnCancelar');

const mostrarMensaje = (texto, tipo = 'error') => {
  mensaje.textContent = texto;
  mensaje.className = tipo;        
  setTimeout(() => (mensaje.textContent = ''), 3000);
};

const escapar = (t) =>
  String(t).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function mostrarProductos() {
  const texto = buscador.value.trim().toLowerCase();
  const lista = productos.filter((p) => p.nombre.toLowerCase().includes(texto));

  if (lista.length === 0) {
    grid.innerHTML = '<p>No hay productos para mostrar.</p>';
  } else {
    grid.innerHTML = lista.map((p) => `
      <div class="product-card">
        <h3>${escapar(p.nombre)}</h3>
        <p><strong>Precio:</strong> $${p.precio.toFixed(2)}</p>
        <p><strong>Cantidad:</strong> ${p.cantidad}</p>
        <p>${escapar(p.descripcion)}</p>
        <button data-accion="editar" data-id="${p.id}">Editar</button>
        <button data-accion="eliminar" data-id="${p.id}">Eliminar</button>
      </div>`).join('');
  }
  actualizarResumen();
}

function actualizarResumen() {
  document.getElementById('totalProductos').textContent = productos.length;
  const valor = productos.reduce((suma, p) => suma + p.precio * p.cantidad, 0);
  document.getElementById('valorInventario').textContent = `$${valor.toFixed(2)}`;
}

buscador.addEventListener('input', mostrarProductos);   

function validar({ nombre, precio, cantidad }) {
  if (!nombre) return 'El nombre es obligatorio.';
  if (nombre.length < 2) return 'El nombre debe tener al menos 2 caracteres.';
  if (Number.isNaN(precio) || precio <= 0) return 'El precio debe ser mayor a 0.';
  if (!Number.isInteger(cantidad) || cantidad < 0) return 'La cantidad debe ser un entero de 0 o más.';

  const repetido = productos.some(
    (p) => p.nombre.toLowerCase() === nombre.toLowerCase() && p.id !== editandoId
  );
  if (repetido) return 'Ya existe un producto con ese nombre.';
  return null;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const datos = {
    nombre: form.nombre.value.trim(),
    precio: parseFloat(form.precio.value),
    cantidad: parseInt(form.cantidad.value, 10),
    descripcion: form.descripcion.value.trim(),
  };

  const error = validar(datos);
  if (error) return mostrarMensaje(error);

  if (editandoId === null) {
    productos.push({ id: Date.now(), ...datos });
    mostrarMensaje('Producto agregado.', 'ok');
  } else {
    productos = productos.map((p) => (p.id === editandoId ? { ...p, ...datos } : p));
    mostrarMensaje('Producto actualizado.', 'ok');
  }

  guardar();
  salirDeEdicion();
  mostrarProductos();
});

grid.addEventListener('click', (e) => {
  const boton = e.target.closest('button[data-accion]');
  if (!boton) return;

  const id = Number(boton.dataset.id);
  const producto = productos.find((p) => p.id === id);

  if (boton.dataset.accion === 'eliminar') {
    if (confirm(`¿Eliminar "${producto.nombre}"?`)) {
      productos = productos.filter((p) => p.id !== id);
      guardar();
      mostrarProductos();
      mostrarMensaje('Producto eliminado.', 'ok');
    }
  }

  if (boton.dataset.accion === 'editar') {
    editandoId = id;
    form.nombre.value = producto.nombre;
    form.precio.value = producto.precio;
    form.cantidad.value = producto.cantidad;
    form.descripcion.value = producto.descripcion;
    document.getElementById('formTitulo').textContent = 'Editar producto';
    btnGuardar.textContent = 'Guardar cambios';
    btnCancelar.hidden = false;
    form.scrollIntoView({ behavior: 'smooth' });
  }
});

function salirDeEdicion() {
  editandoId = null;
  form.reset();
  document.getElementById('formTitulo').textContent = 'Agregar producto';
  btnGuardar.textContent = 'Agregar';
  btnCancelar.hidden = true;
}

btnCancelar.addEventListener('click', salirDeEdicion);

mostrarProductos();