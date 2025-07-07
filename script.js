const TASA_REFERENCIA_INTERNA = 100.00;

const listaCompras = document.getElementById('lista-compras');
const totalBsSpan = document.getElementById('total-bs');
const totalUsdSpan = document.getElementById('total-usd');
const tasaDiaInput = document.getElementById('tasa-dia');

const modal = document.getElementById('modal-articulo');
const formArticulo = document.getElementById('form-articulo');
const cantidadInput = document.getElementById('cantidad');
const precioInput = document.getElementById('precio');
const montoBsDiv = document.getElementById('monto-bs');
const montoUsdDiv = document.getElementById('monto-usd');
const guardarBtn = document.getElementById('guardar-btn');
const cancelarBtn = document.getElementById('cancelar-btn');
const modalTitulo = document.getElementById('modal-titulo');

let articuloActual = null;

let articulos = [
  { id: 1, nombre: 'Leche (1L)', precioSugerido: 100.00, cantidad: 1, precioReal: 0, agregado: false, incluido: false },
  { id: 2, nombre: 'Huevos (docena)', precioSugerido: 100.00, cantidad: 1, precioReal: 0, agregado: false, incluido: false },
  { id: 3, nombre: 'Pan cuadrado', precioSugerido: 100.00, cantidad: 1, precioReal: 0, agregado: false, incluido: false },
  { id: 4, nombre: 'Queso blanco (kg)', precioSugerido: 100.00, cantidad: 1, precioReal: 0, agregado: false, incluido: false },
  { id: 4, nombre: 'Arroz', precioSugerido: 100.00, cantidad: 1, precioReal: 0, agregado: false, incluido: false },
  { id: 5, nombre: 'Azúcar', precioSugerido: 100.00, cantidad: 1, precioReal: 0, agregado: false, incluido: false },
  { id: 6, nombre: 'Café', precioSugerido: 100.00, cantidad: 1, precioReal: 0, agregado: false, incluido: false },
  { id: 7, nombre: 'Queso amarillo', precioSugerido: 100.000, cantidad: 1, precioReal: 0, agregado: false, incluido: false },
  { id: 8, nombre: 'Aceite', precioSugerido:100.00, cantidad: 0, precioReal: 1, agregado: false, incluido: false },
  { id: 9, nombre: 'Pasta', precioSugerido: 100.00, cantidad: 0, precioReal: 1, agregado: false, incluido: false },
  { id: 10, nombre: 'Harina', precioSugerido: 100.00, cantidad: 0, precioReal: 1, agregado: false, incluido: false },
  { id: 7, nombre: 'Carne', precioSugerido: 100.00, cantidad: 0, precioReal: 1, agregado: false, incluido: false },
  { id: 8, nombre: 'Pollo', precioSugerido: 100.00, cantidad: 0, precioReal: 1, agregado: false, incluido: false },
  { id: 9, nombre: 'Toortilla', precioSugerido: 100.00, cantidad: 0, precioReal: 1, agregado: false, incluido: false },
  { id: 10, nombre: 'Mantequilla', precioSugerido: 100.00, cantidad: 0, precioReal: 1, agregado: false, incluido: false },
];

function renderizarLista() {
  listaCompras.innerHTML = '';
  articulos.forEach(articulo => {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = articulo.incluido;
    checkbox.addEventListener('change', () => {
      articulo.incluido = checkbox.checked;
      actualizarTotales();
    });

    const label = document.createElement('label');
    label.textContent = articulo.nombre;

    const botones = document.createElement('div');
    botones.style.display = 'flex';
    botones.style.gap = '0.5rem';

    const boton = document.createElement('button');
    boton.textContent = articulo.agregado ? 'Editar' : 'Agregar';
    boton.className = articulo.agregado ? 'editar' : 'agregar';
    boton.addEventListener('click', () => abrirModal(articulo.id));

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = '🗑️';
    btnEliminar.className = 'eliminar';
    btnEliminar.addEventListener('click', () => eliminarArticulo(articulo.id));

    botones.appendChild(boton);
    botones.appendChild(btnEliminar);

    tarjeta.appendChild(checkbox);
    tarjeta.appendChild(label);
    tarjeta.appendChild(botones);

    listaCompras.appendChild(tarjeta);
  });
}

function abrirModal(id) {
  articuloActual = articulos.find(a => a.id === id);
  modalTitulo.textContent = articuloActual.agregado ? 'Editar Artículo' : 'Agregar Artículo';

  cantidadInput.value = articuloActual.cantidad || '';
  precioInput.value = articuloActual.precioReal || '';
  precioInput.placeholder = articuloActual.precioSugerido.toFixed(2) + ' Bs';

  actualizarMontos();
  modal.style.display = 'flex';
  cantidadInput.focus();
}

cancelarBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

formArticulo.addEventListener('submit', (e) => {
  e.preventDefault();
  const cantidad = parseFloat(cantidadInput.value);
  const precio = parseFloat(precioInput.value) || articuloActual.precioSugerido;

  if (cantidad > 0 && precio > 0) {
    articuloActual.cantidad = cantidad;
    articuloActual.precioReal = precio;
    articuloActual.agregado = true;
    articuloActual.incluido = true;

    modal.style.display = 'none';
    renderizarLista();
    actualizarTotales();
  }
});

cantidadInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    precioInput.focus();
  }
});

[cantidadInput, precioInput, tasaDiaInput].forEach(input =>
  input.addEventListener('input', actualizarMontos)
);

function actualizarMontos() {
  const cantidad = parseFloat(cantidadInput.value) || 0;
  const precio = parseFloat(precioInput.value) || articuloActual?.precioSugerido || 0;
  const montoBs = cantidad * precio;
  const tasa = parseFloat(tasaDiaInput.value) || TASA_REFERENCIA_INTERNA;
  const montoUsd = montoBs / tasa;

  montoBsDiv.textContent = `Monto Total (Bs): ${montoBs.toFixed(2)}`;
  montoUsdDiv.textContent = `Monto Total (USD): ${montoUsd.toFixed(2)}`;
}

function actualizarTotales() {
  let totalBs = 0;
  articulos.forEach(articulo => {
    if (articulo.incluido && articulo.agregado) {
      totalBs += articulo.cantidad * articulo.precioReal;
    }
  });
  const tasa = parseFloat(tasaDiaInput.value) || TASA_REFERENCIA_INTERNA;
  totalBsSpan.textContent = totalBs.toFixed(2);
  totalUsdSpan.textContent = (totalBs / tasa).toFixed(2);
}

function eliminarArticulo(id) {
  const articulo = articulos.find(a => a.id === id);
  if (confirm(`¿Eliminar "${articulo.nombre}" de la lista?`)) {
    articulos = articulos.filter(a => a.id !== id);
    renderizarLista();
    actualizarTotales();
  }
}

tasaDiaInput.value = TASA_REFERENCIA_INTERNA;
tasaDiaInput.addEventListener('input', actualizarTotales);

renderizarLista();

// Botón nuevo artículo
const btnNuevoArticulo = document.getElementById('btn-nuevo-articulo');
const nombreInput = document.getElementById('nombre');
const labelNombre = document.getElementById('label-nombre');

let esNuevo = false;

btnNuevoArticulo.addEventListener('click', () => {
  esNuevo = true;
  modalTitulo.textContent = 'Nuevo Artículo';
  nombreInput.style.display = 'block';
  labelNombre.style.display = 'block';
  nombreInput.value = '';
  cantidadInput.value = '';
  precioInput.value = '';
  montoBsDiv.textContent = '';
  montoUsdDiv.textContent = '';
  modal.style.display = 'flex';
  nombreInput.focus();
});

const originalAbrirModal = abrirModal;
abrirModal = function(id) {
  esNuevo = false;
  articuloActual = articulos.find(a => a.id === id);
  modalTitulo.textContent = articuloActual.agregado ? 'Editar Artículo' : 'Agregar Artículo';
  nombreInput.style.display = 'none';
  labelNombre.style.display = 'none';
  cantidadInput.value = articuloActual.cantidad || '';
  precioInput.value = articuloActual.precioReal || '';
  precioInput.placeholder = articuloActual.precioSugerido.toFixed(2) + ' Bs';
  actualizarMontos();
  modal.style.display = 'flex';
  cantidadInput.focus();
};

formArticulo.addEventListener('submit', (e) => {
  e.preventDefault();
  const cantidad = parseFloat(cantidadInput.value);
  const precio = parseFloat(precioInput.value);
  const nombre = nombreInput.value.trim();
  if (cantidad > 0 && (precio > 0 || !isNaN(precio))) {
    if (esNuevo) {
      if (!nombre) {
        alert('El nombre es obligatorio.');
        return;
      }
      const nuevoArticulo = {
        id: Date.now(),
        nombre: nombre,
        precioSugerido: precio,
        cantidad: cantidad,
        precioReal: precio,
        agregado: true,
        incluido: true
      };
      articulos.push(nuevoArticulo);
    } else {
      articuloActual.cantidad = cantidad;
      articuloActual.precioReal = precio || articuloActual.precioSugerido;
      articuloActual.agregado = true;
      articuloActual.incluido = true;
    }
    modal.style.display = 'none';
    renderizarLista();
    actualizarTotales();
  }
});
