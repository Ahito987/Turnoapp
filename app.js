const formTurno = document.getElementById('formTurno');
const listadoTurnos = document.getElementById('listadoTurnos').querySelector('tbody');
const buscar = document.getElementById('buscar');
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const calendar = document.getElementById('calendar');

let turnos = JSON.parse(localStorage.getItem('turnos')) || [];

menuBtn.addEventListener('click', () => {
  menu.classList.toggle('hidden');
});

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

function renderizarTurnos() {
  listadoTurnos.innerHTML = '';
  let term = buscar.value.toLowerCase();

  turnos
    .filter(t => t.fecha.includes(term) || t.tipo.toLowerCase().includes(term))
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .forEach((turno, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${formatearFecha(turno.fecha)}</td>
        <td>${turno.hora}</td>
        <td>${turno.tipo}</td>
        <td>${turno.nota || ''}</td>
        <td><button class="delete-btn" onclick="eliminarTurno(${index})">🗑️</button></td>
      `;
      listadoTurnos.appendChild(row);
    });
}

function eliminarTurno(index) {
  if (confirm('¿Eliminar este turno?')) {
    turnos.splice(index, 1);
    localStorage.setItem('turnos', JSON.stringify(turnos));
    renderizarTurnos();
    renderizarCalendario();
  }
}

function formatearFecha(fecha) {
  const [a, m, d] = fecha.split('-');
  return `${d}/${m}/${a}`;
}

buscar.addEventListener('input', renderizarTurnos);

function renderizarCalendario() {
  calendar.innerHTML = '';
  let grouped = {};

  turnos.forEach(t => {
    let [year, month, day] = t.fecha.split('-');
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push({ day, tipo: t.tipo });
  });

  for (const month in grouped) {
    const mesDiv = document.createElement('div');
    mesDiv.innerHTML = `<h3>${nombreMes(month)}</h3>`;

    grouped[month].forEach(({ day, tipo }) => {
      const item = document.createElement('div');
      item.innerHTML = `<strong>${day}</strong>: ${abreviaturaTurno(tipo)}`;
      if (tipo === 'Vacaciones' || tipo === 'Festivo') {
        item.classList.add('festivo');
      }
      mesDiv.appendChild(item);
    });

    calendar.appendChild(mesDiv);
  }
}

function nombreMes(m) {
  return ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][parseInt(m)-1];
}

function abreviaturaTurno(tipo) {
  switch (tipo) {
    case 'Mañana': return 'M';
    case 'Tarde': return 'T';
    case 'Noche': return 'N';
    case 'Libranza': return 'L';
    case 'Vacaciones': return 'V';
    default: return tipo;
  }
}

renderizarTurnos();
renderizarCalendario();
