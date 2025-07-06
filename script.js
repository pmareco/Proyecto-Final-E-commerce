// URL API REST
const API_URL = "https://fakestoreapi.com/products";

const productosContainer = document.getElementById('productos');
const carritoLista = document.getElementById('carrito-lista');
const contador = document.getElementById('contador');
const totalSpan = document.getElementById('total');

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function renderProductos(productos) {
  productos.forEach(producto => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${producto.image}" class="card-img-top" alt="${producto.title}">
      <div class="card-body">
        <h5 class="card-title">${producto.title}</h5>
        <p class="card-text">$${producto.price}</p>
        <button class="btn btn-primary" onclick='agregarAlCarrito(${JSON.stringify(producto)})'>Añadir al carrito</button>
      </div>
    `;
    productosContainer.appendChild(card);
  });
}

function agregarAlCarrito(producto) {
  const existe = carrito.find(p => p.id === producto.id);
  if (existe) {
    existe.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  actualizarCarrito();
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter(p => p.id !== id);
  actualizarCarrito();
}

function cambiarCantidad(id, nuevaCantidad) {
  const item = carrito.find(p => p.id === id);
  if (item) {
    item.cantidad = nuevaCantidad;
    if (item.cantidad <= 0) eliminarDelCarrito(id);
  }
  actualizarCarrito();
}

function actualizarCarrito() {
  carritoLista.innerHTML = '';
  let total = 0;
  carrito.forEach(producto => {
    total += producto.price * producto.cantidad;
    const div = document.createElement('div');
    div.innerHTML = `
      <p>
        ${producto.title} - $${producto.price} x 
        <input type="number" min="1" value="${producto.cantidad}" onchange="cambiarCantidad(${producto.id}, this.value)">
        <button onclick="eliminarDelCarrito(${producto.id})" class="btn btn-danger btn-sm">Eliminar</button>
      </p>
    `;
    carritoLista.appendChild(div);
  });
  contador.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  totalSpan.textContent = total.toFixed(2);
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Validación básica de formulario
const formulario = document.querySelector('form');
formulario.addEventListener('submit', function (e) {
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const mensaje = document.getElementById('mensaje').value;

  if (!nombre || !email || !mensaje) {
    e.preventDefault();
    alert('Todos los campos son obligatorios.');
  }
});

// Inicializar
fetch(API_URL)
  .then(res => res.json())
  .then(data => renderProductos(data))
  .catch(err => console.error('Error cargando productos:', err));

actualizarCarrito();
