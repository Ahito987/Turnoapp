// Variables
const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');
const sections = document.querySelectorAll('main section');

const formTurno = document.getElementById('formTurno');
const formFestivo = document.getElementById('formFestivo');
const turnosCards = document.getElementById('turnosCards');
const calendarioMes = document.getElementById('calendarioMes');

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
  turnosCards.innerHTML = '';
  turnos.forEach(turno => {
    const card = document.createElement('div');
    card.className = 'turno-card';
    card.innerHTML = `
      <strong>${formatearFecha(turno.fecha)}</strong>
      <p><strong>${turno.hora} – ${turno.tipo}</strong></p>
      <p>${turno.nota || ''}</p>
    `;
    turnosCards.appendChild(card);
  });
}

function renderizarCalendario() {
  calendarioMes.innerHTML = '';
  const diasMes = 31;
  for (let dia = 1; dia <= diasMes; dia++) {
    const fecha = `2025-04-${String(dia).padStart(2, '0')}`;
    const div = document.createElement('div');
    div.className = 'dia';

    const turno = turnos.find(t => t.fecha === fecha);
    const festivo = festivos.find(f => f.fecha === fecha);

    if (festivo) {
      div.classList.add('festivo');
      div.innerHTML = `<strong>${dia}</strong><br><small>${festivo.descripcion}</small>`;
    } else if (turno) {
      div.innerHTML = `<strong>${dia}</strong><br><small>${turno.tipo.charAt(0)}</small>`;
    } else {
      div.innerHTML = `<strong>${dia}</strong>`;
    }

    calendarioMes.appendChild(div);
  }
}

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
