// Variables
const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');
const sections = document.querySelectorAll('main section');

const formTurno = document.getElementById('formTurno');
const formFestivo = document.getElementById('formFestivo');
const turnosCards = document.getElementById('turnosCards');
const calendarioMes = document.getElementById('calendarioMes');
const tbodyTurnos = document.getElementById('tbodyTurnos');



let turnos = JSON.parse(localStorage.getItem('turnos')) || [];
let festivos = JSON.parse(localStorage.getItem('festivos')) || [];

// Funciones
menuToggle.addEventListener('click', () => {
  menu.classList.toggle('hidden');
});

function mostrarSeccion(id) {
  sections.forEach(section => section.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  menu.classList.add('hidden');
}

function renderizarTurnos() {
  /* modificaciones*/
  if (!tbodyTurnos) return;
  tbodyTurnos.innerHTML = '';
  turnos.forEach((turno, index) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${formatearFecha(turno.fecha)}</td>
      <td>${turno.hora} - ${turno.tipo}</td>
      <td>${turno.nota || ''}</td>
      <td><button onclick="eliminarTurno(${index})" class="delete-btn">🗑️</button></td>
    `;
    tbodyTurnos.appendChild(fila);
  });
}

if (turno) {
  const letra = turno.tipo.charAt(0);
  const color = letra === 'V' ? 'green' : 'black';
  div.innerHTML += `<br><small style="color:${color}; font-weight:bold" title="${turno.nota || ''}">${letra}</small>`;
}
div.addEventListener('click', () => {
  document.getElementById('fecha').value = fecha; // autocompletar fecha del formulario
  mostrarSeccion('seccionAgregarTurno'); // si tienes una sección con este ID
});


function eliminarTurno(index) {
  const confirmado = confirm("¿Estás seguro de eliminar este turno?");
  if (confirmado) {
    turnos.splice(index, 1);
    localStorage.setItem('turnos', JSON.stringify(turnos));
    renderizarTurnos();
    renderizarCalendario();
  }
}



let fechaActual = new Date(); // fecha actual

function renderizarCalendario() {
  calendarioMes.innerHTML = '';

  const mes = fechaActual.getMonth();
  const año = fechaActual.getFullYear();

  const primerDia = new Date(año, mes, 1).getDay(); // día de la semana
  const diasMes = new Date(año, mes + 1, 0).getDate();

  document.getElementById('mesActual').textContent = 
    fechaActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  for (let i = 0; i < primerDia; i++) {
    calendarioMes.innerHTML += `<div class="dia vacio"></div>`;
  }

  for (let dia = 1; dia <= diasMes; dia++) {
    const fecha = `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const div = document.createElement('div');
    div.className = 'dia';

    const turno = turnos.find(t => t.fecha === fecha);
    const festivo = festivos.find(f => f.fecha === fecha);

    div.innerHTML = `<strong>${dia}</strong>`;

    if (festivo) {
      div.classList.add('festivo');
    }

    if (turno) {
      const letra = turno.tipo.charAt(0);
      const color = letra === 'V' ? 'green' : 'black';
      div.innerHTML += `<br><small style="color:${color}; font-weight:bold">${letra}</small>`;
    }

    calendarioMes.appendChild(div);
  }
}

document.getElementById('prevMes').addEventListener('click', () => {
  fechaActual.setMonth(fechaActual.getMonth() - 1);
  renderizarCalendario();
});

document.getElementById('nextMes').addEventListener('click', () => {
  fechaActual.setMonth(fechaActual.getMonth() + 1);
  renderizarCalendario();
});

calendarioMes.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
});

calendarioMes.addEventListener('touchend', (e) => {
  let startX= 0;
  const endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) {
    fechaActual.setMonth(fechaActual.getMonth() + 1);
    renderizarCalendario();
  } else if (endX - startX > 50) {
    fechaActual.setMonth(fechaActual.getMonth() - 1);
    renderizarCalendario();
  }
});


function formatearFecha(fecha) {
  const [a, m, d] = fecha.split('-');
  return `${d}/${m}/${a}`;
}

// Eventos
formTurno.addEventListener('submit', (e) => {
  e.preventDefault();
  const nuevoTurno = {
    fecha: document.getElementById('fecha').value,
    hora: document.getElementById('hora').value,
    tipo: document.getElementById('tipo').value,
    nota: document.getElementById('nota').value
  };
  turnos.push(nuevoTurno);
  localStorage.setItem('turnos', JSON.stringify(turnos));
  formTurno.reset();
  renderizarTurnos();
  renderizarCalendario();
});

formFestivo.addEventListener('submit', (e) => {
  e.preventDefault();
  const nuevoFestivo = {
    fecha: document.getElementById('fechaFestivo').value,
    descripcion: document.getElementById('descripcionFestivo').value
  };
  festivos.push(nuevoFestivo);
  localStorage.setItem('festivos', JSON.stringify(festivos));
  formFestivo.reset();
  renderizarCalendario();
});

// Inicializar
renderizarTurnos();
renderizarCalendario();
document.addEventListener('DOMContentLoaded', () => {
  mostrarSeccion('seccionCalendario'); // muestra por defecto
});

   




