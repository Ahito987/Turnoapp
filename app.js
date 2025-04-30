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



function eliminarTurno(index) {
  const confirmado = confirm("¿Estás seguro de eliminar este turno?");
  if (confirmado) {
    turnos.splice(index, 1);
    localStorage.setItem('turnos', JSON.stringify(turnos));
    renderizarTurnos();
    renderizarCalendario();
  }
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
    }
    
    let contenido = `<strong>${dia}</strong>`;
    
    if (festivo) {
      contenido += `<br><small>${festivo.descripcion}</small>`;
    }
    if (turno) {
      const letra = turno.tipo.charAt(0);
      const color = letra === 'V' ? 'green' : 'black';
      contenido += `<br><small style="color:${color}; font-weight:bold; font-size:1rem">${letra}</small>`;
    }
    
    div.innerHTML = contenido;
    

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
