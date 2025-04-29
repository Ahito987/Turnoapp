const form = document.getElementById("formTurno");
const tabla = document.querySelector("#tablaTurnos tbody");
const calendario = document.getElementById("calendario");
const busqueda = document.getElementById("busqueda");

let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

document.getElementById("menuToggle").onclick = () => {
  document.getElementById("sideMenu").classList.toggle("hidden");
};

function guardar() {
  localStorage.setItem("turnos", JSON.stringify(turnos));
}

function mostrarSeccion(id) {
  document.querySelectorAll("main section").forEach(s => s.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
  if (id === "calendario") generarCalendario();
}

form.onsubmit = e => {
  e.preventDefault();
  const turno = {
    fecha: form.fecha.value,
    hora: form.hora.value,
    tipo: form.tipo.value,
    nota: form.nota.value
  };
  turnos.push(turno);
  guardar();
  form.reset();
  mostrarTurnos();
};

function mostrarTurnos() {
  tabla.innerHTML = "";
  turnos.forEach((t, i) => {
    const row = tabla.insertRow();
    row.innerHTML = `
      <td>${t.fecha}</td>
      <td>${t.tipo}</td>
      <td>${t.nota || ""}</td>
      <td><button onclick="borrar(${i})">🗑️</button></td>
    `;
  });
}

function borrar(index) {
  if (confirm("¿Eliminar este turno?")) {
    turnos.splice(index, 1);
    guardar();
    mostrarTurnos();
  }
}

busqueda.oninput = () => {
  const filtro = busqueda.value.toLowerCase();
  const filas = tabla.querySelectorAll("tr");
  filas.forEach(f => {
    f.style.display = f.textContent.toLowerCase().includes(filtro) ? "" : "none";
  });
};

function generarCalendario() {
  calendario.innerHTML = "";
  const hoy = new Date();
  const año = hoy.getFullYear();

  for (let mes = 0; mes < 12; mes++) {
    const divMes = document.createElement("div");
    divMes.innerHTML = `<h3>${new Date(año, mes).toLocaleString("es", { month: "long" }).toUpperCase()}</h3>`;
    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(7, 1fr)";
    const diasMes = new Date(año, mes + 1, 0).getDate();

    for (let dia = 1; dia <= diasMes; dia++) {
      const fechaStr = `${año}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
      const divDia = document.createElement("div");
      const turno = turnos.find(t => t.fecha === fechaStr);
      const clase = turno ? (turno.tipo === "V" ? "vacaciones" : turno.tipo === "D" ? "festivo" : "") : "";

      divDia.innerHTML = `<strong>${dia}</strong><br><span class="turno-letra ${clase}">${turno ? turno.tipo : ""}</span>`;
      divDia.style.border = "1px solid #ccc";
      divDia.style.padding = "0.5rem";
      divDia.style.textAlign = "center";
      if (fechaStr === hoy.toISOString().slice(0, 10)) divDia.classList.add("dia-actual");
      grid.appendChild(divDia);
    }

    divMes.appendChild(grid);
    calendario.appendChild(divMes);
  }
}

mostrarTurnos();
