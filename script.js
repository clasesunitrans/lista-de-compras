// La tasa de referencia interna se inicializará con el valor obtenido de la API
let TASA_REFERENCIA_INTERNA = 100.00; // Valor por defecto en caso de que la API falle

const listaCompras = document.getElementById('lista-compras');
const totalBsSpan = document.getElementById('total-bs');
const totalUsdSpan = document.getElementById('total-usd');
const tasaDiaInput = document.getElementById('tasa-dia');

// Asegurarse de que el campo de la tasa del día muestre el valor por defecto inmediatamente
tasaDiaInput.value = TASA_REFERENCIA_INTERNA.toFixed(2);

const modal = document.getElementById('modal-articulo');
const formArticulo = document.getElementById('form-articulo');
const cantidadInput = document.getElementById('cantidad');
const precioBsInput = document.getElementById('precio-bs'); // Nuevo input para precio en Bs
const precioUsdInput = document.getElementById('precio-usd'); // Nuevo input para precio en USD
const montoBsDiv = document.getElementById('monto-bs');
const montoUsdDiv = document.getElementById('monto-usd');
const guardarBtn = document.getElementById('guardar-btn');
const cancelarBtn = document.getElementById('cancelar-btn');
const modalTitulo = document.getElementById('modal-titulo');

let articuloActual = null;
let esNuevo = false; // Variable para controlar si es un nuevo artículo

let articulos = [
  { id: 1, nombre: 'Leche (1L)', precioSugerido: 100.00, cantidad: 1, precioReal: 0, agregado: false, incluido: false },
  { id: 2, nombre: 'Huevos (docena)', precioSugerido: 100.00, cantidad: 1, precioReal: 0, agregado: false, incluido: false },
  { id: 3, nombre: 'Pan cuadrado', precioSugerido: 100.00, cantidad: 1, precioReal: 0, agregado: false, incluido: false },
  { id: 4, nombre: 'Queso blanco (kg)', precioSugerido: 100.00, cantidad: 1, precioReal: 0, agregado: false, incluido: false },
  { id: 5, nombre: 'Arroz', precioSugerido: 100.00, cantidad: 1, precioReal: 0, agregado: false, incluido: false },
  { id: 6, nombre: 'Azúcar', precioSugerido: 100.00, cantidad: 1, precioReal: 0, agregado: false, incluido: false },
  { id: 7, nombre: 'Café', precioSugerido: 100.00, cantidad: 1, precioReal: 0, agregado: false, incluido: false },
  { id: 8, nombre: 'Queso amarillo', precioSugerido: 100.000, cantidad: 1, precioReal: 0, agregado: false, incluido: false },
  { id: 9, nombre: 'Aceite', precioSugerido:100.00, cantidad: 0, precioReal: 1, agregado: false, incluido: false },
  { id: 10, nombre: 'Pasta', precioSugerido: 100.00, cantidad: 0, precioReal: 1, agregado: false, incluido: false },
  { id: 11, nombre: 'Harina', precioSugerido: 100.00, cantidad: 0, precioReal: 1, agregado: false, incluido: false },
  { id: 12, nombre: 'Carne', precioSugerido: 100.00, cantidad: 0, precioReal: 1, agregado: false, incluido: false },
  { id: 13, nombre: 'Pollo', precioSugerido: 100.00, cantidad: 0, precioReal: 1, agregado: false, incluido: false },
  { id: 14, nombre: 'Tortilla', precioSugerido: 100.00, cantidad: 0, precioReal: 1, agregado: false, incluido: false },
  { id: 15, nombre: 'Mantequilla', precioSugerido: 100.00, cantidad: 0, precioReal: 1, agregado: false, incluido: false },
  { id: 16, nombre: 'Gatarina', precioSugerido: 100.00, cantidad: 0, precioReal: 1, agregado: false, incluido: false },
  { id: 17, nombre: 'Te', precioSugerido: 100.00, cantidad: 0, precioReal: 1, agregado: false, incluido: false },
  { id: 18, nombre: 'Platano', precioSugerido: 100.00, cantidad: 0, precioReal: 1, agregado: false, incluido: false },
  { id: 19, nombre: 'Tomate', precioSugerido: 100.00, cantidad: 0, precioReal: 1, agregado: false, incluido: false },
  { id: 20, nombre: 'Cebolla', precioSugerido: 100.00, cantidad: 0, precioReal: 1, agregado: false, incluido: false },
];

// Función para renderizar la lista de artículos
function renderizarLista() {
  listaCompras.innerHTML = ''; // Limpiar la lista actual
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

// Función para abrir el modal de artículo
function abrirModal(id) {
  esNuevo = false; // No es un nuevo artículo al editar
  articuloActual = articulos.find(a => a.id === id);
  modalTitulo.textContent = articuloActual.agregado ? 'Editar Artículo' : 'Agregar Artículo';

  // Ocultar campos de nombre para edición
  nombreInput.style.display = 'none';
  labelNombre.style.display = 'none';

  cantidadInput.value = articuloActual.cantidad || '';
  precioBsInput.value = articuloActual.precioReal || '';
  precioUsdInput.value = (articuloActual.precioReal / (parseFloat(tasaDiaInput.value) || TASA_REFERENCIA_INTERNA)).toFixed(2); // Calcular y mostrar precio en USD

  // Establecer placeholders
  precioBsInput.placeholder = articuloActual.precioSugerido.toFixed(2) + ' Bs';
  precioUsdInput.placeholder = (articuloActual.precioSugerido / (parseFloat(tasaDiaInput.value) || TASA_REFERENCIA_INTERNA)).toFixed(2) + ' USD';

  // Habilitar ambos campos de precio al abrir el modal para edición
  precioBsInput.disabled = false;
  precioUsdInput.disabled = false;

  actualizarMontos();
  modal.style.display = 'flex';
  cantidadInput.focus();
}

// Event listener para el botón de cancelar del modal
cancelarBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Event listener para el envío del formulario del modal
formArticulo.addEventListener('submit', (e) => {
  e.preventDefault();
  const cantidad = parseFloat(cantidadInput.value);
  let precio;

  // Determinar qué campo de precio se usó
  if (precioBsInput.value !== '' && !precioBsInput.disabled) {
    precio = parseFloat(precioBsInput.value);
  } else if (precioUsdInput.value !== '' && !precioUsdInput.disabled) {
    precio = parseFloat(precioUsdInput.value) * (parseFloat(tasaDiaInput.value) || TASA_REFERENCIA_INTERNA);
  } else {
    precio = articuloActual.precioSugerido;
  }

  const nombre = nombreInput.value.trim();

  if (cantidad >= 0 && (precio >= 0 || !isNaN(precio))) {
    if (esNuevo) {
      if (!nombre) {
        // Reemplazar alert con un mensaje en la interfaz de usuario
        montoBsDiv.textContent = 'El nombre es obligatorio.';
        montoBsDiv.style.color = 'red';
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

// Event listener para el campo de cantidad para pasar el foco
cantidadInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    precioBsInput.focus(); // Pasar el foco al campo de precio en Bs
  }
});

// Event listeners para los campos de precio para la conversión y enfoque
precioBsInput.addEventListener('input', () => {
  const tasa = parseFloat(tasaDiaInput.value) || TASA_REFERENCIA_INTERNA;
  const precioBs = parseFloat(precioBsInput.value);
  if (!isNaN(precioBs)) {
    precioUsdInput.value = (precioBs / tasa).toFixed(2);
    precioUsdInput.disabled = true; // Inhibir el campo USD
    montoBsDiv.textContent = ''; // Limpiar mensaje de error si existe
    montoBsDiv.style.color = '';
    actualizarMontos();
  } else {
    precioUsdInput.value = '';
    precioUsdInput.disabled = false; // Habilitar el campo USD si Bs está vacío
    actualizarMontos();
  }
});

precioBsInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    guardarBtn.focus(); // Pasar el foco al botón Guardar
  }
});

precioUsdInput.addEventListener('input', () => {
  const tasa = parseFloat(tasaDiaInput.value) || TASA_REFERENCIA_INTERNA;
  const precioUsd = parseFloat(precioUsdInput.value);
  if (!isNaN(precioUsd)) {
    precioBsInput.value = (precioUsd * tasa).toFixed(2);
    precioBsInput.disabled = true; // Inhibir el campo Bs
    montoBsDiv.textContent = ''; // Limpiar mensaje de error si existe
    montoBsDiv.style.color = '';
    actualizarMontos();
  } else {
    precioBsInput.value = '';
    precioBsInput.disabled = false; // Habilitar el campo Bs si USD está vacío
    actualizarMontos();
  }
});

precioUsdInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    guardarBtn.focus(); // Pasar el foco al botón Guardar
  }
});

// Event listener para la tasa del día
tasaDiaInput.addEventListener('input', () => {
  actualizarMontos();
  actualizarTotales();
});


// Función para actualizar los montos en el modal
function actualizarMontos() {
  const cantidad = parseFloat(cantidadInput.value) || 0;
  let precio;

  // Determinar qué campo de precio se está usando para el cálculo
  if (precioBsInput.value !== '' && !precioBsInput.disabled) {
    precio = parseFloat(precioBsInput.value);
  } else if (precioUsdInput.value !== '' && !precioUsdInput.disabled) {
    precio = parseFloat(precioUsdInput.value) * (parseFloat(tasaDiaInput.value) || TASA_REFERENCIA_INTERNA);
  } else {
    precio = articuloActual?.precioSugerido || 0;
  }

  const montoBs = cantidad * precio;
  const tasa = parseFloat(tasaDiaInput.value) || TASA_REFERENCIA_INTERNA;
  const montoUsd = montoBs / tasa;

  montoBsDiv.textContent = `Monto Total (Bs): ${montoBs.toFixed(2)}`;
  montoUsdDiv.textContent = `Monto Total (USD): ${montoUsd.toFixed(2)}`;
}

// Función para actualizar los totales en la cabecera
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

// Función para eliminar un artículo
function eliminarArticulo(id) {
  const articulo = articulos.find(a => a.id === id);
  // Reemplazar confirm con un modal personalizado si fuera necesario
  if (window.confirm(`¿Eliminar "${articulo.nombre}" de la lista?`)) {
    articulos = articulos.filter(a => a.id !== id);
    renderizarLista();
    actualizarTotales();
  }
}

// Botón nuevo artículo
const btnNuevoArticulo = document.getElementById('btn-nuevo-articulo');
const nombreInput = document.getElementById('nombre');
const labelNombre = document.getElementById('label-nombre');

btnNuevoArticulo.addEventListener('click', () => {
  esNuevo = true;
  modalTitulo.textContent = 'Nuevo Artículo';
  nombreInput.style.display = 'block';
  labelNombre.style.display = 'block';
  nombreInput.value = '';
  cantidadInput.value = '';
  precioBsInput.value = '';
  precioUsdInput.value = '';
  montoBsDiv.textContent = '';
  montoUsdDiv.textContent = '';
  
  // Habilitar ambos campos de precio para un nuevo artículo
  precioBsInput.disabled = false;
  precioUsdInput.disabled = false;

  modal.style.display = 'flex';
  nombreInput.focus();
});

// Función para obtener la tasa del día de la API
async function obtenerTasaDelDia() {
  try {
    const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
    if (!response.ok) {
      console.error(`Error HTTP! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data && data.promedio) {
      TASA_REFERENCIA_INTERNA = parseFloat(data.promedio);
      tasaDiaInput.value = TASA_REFERENCIA_INTERNA.toFixed(2);
      console.log('Tasa del día obtenida de la API:', TASA_REFERENCIA_INTERNA);
    } else {
      console.warn('No se pudo obtener la tasa del día de la API. Usando valor por defecto.');
    }
  } catch (error) {
    console.error('Error al obtener la tasa del día:', error);
    console.warn('No se pudo obtener la tasa del día de la API. Usando valor por defecto.');
  } finally {
    // Asegurarse de que la lista y los totales se rendericen y actualicen después de intentar obtener la tasa
    renderizarLista();
    actualizarTotales();
  }
}

// Llamar a la función para obtener la tasa del día al cargar el script
obtenerTasaDelDia();
