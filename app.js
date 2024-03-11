//Variables y Selectores
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");

// Events
eventListeners();
function eventListeners() {
  document.addEventListener("DOMContentLoaded", preguntarPresupuesto);
  formulario.addEventListener("submit", agregarGasto);
}

// Clases
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
  }

  calcularRestante() {
    const gastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );
    this.restante = this.presupuesto - gastado;
  }
}

class userInterface {
  insertarPresupuesto(cantidad) {
    // Extrayendo los valores
    const { presupuesto, restante } = cantidad;

    // Agregar al HTML
    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
  }

  imprimirAlerta(mensaje, tipo) {
    // crear el div
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert");

    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    // Mensaje de error
    divMensaje.textContent = mensaje;

    // insertar en el html
    document.querySelector(".primario").insertBefore(divMensaje, formulario);
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }

  agregarGastoListado(gastos) {
    // Iterar sobre los gastos
    limpiarHTML();
    gastos.forEach((gasto) => {
      const { cantidad, nombre, id } = gasto;
      // Crear un LI
      const nuevoGasto = document.createElement("li");
      nuevoGasto.className =
        "list-group-item d-flex justify-content-between align-items-center";
      nuevoGasto.dataset.id = id;
      // Agregar el HTML del gasto
      nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>`;
      //boton para borrar el gasto
      const btnBorrar = document.createElement("button");
      btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
      btnBorrar.textContent = "Borrar";

      nuevoGasto.appendChild(btnBorrar);

      // Agregar al HMTL
      gastoListado.appendChild(nuevoGasto);

      // borrar el elemento creado con el boton borrar
      btnBorrar.addEventListener("click", () => {
        // Eliminar del arreglo
        presupuesto.gastos = presupuesto.gastos.filter((g) => g.id !== id);
        nuevoGasto.remove();
        // Recalcular restante y actualizar la interfaz
        presupuesto.calcularRestante();
        ui.actualizarRestante(presupuesto.restante);
      
        // Llamada a la función comprobarPresupuesto después de borrar
        ui.comprobarPresupuesto(presupuesto);
      
        if (restante > 1) {
          formulario.querySelector('button[type="submit"]').disabled = false;
        }
      });
    });
  }

  actualizarRestante(restante) {
    document.querySelector("#restante").textContent = restante;
  }

  comprobarPresupuesto(presupuestoObj) {
    const { presupuesto, restante } = presupuestoObj;
    const restanteDiv = document.querySelector(".restante");

    // Calcular el porcentaje de gasto
    const porcentajeGasto = ((presupuesto - restante) / presupuesto) * 100;

    // Verificar el porcentaje de gasto para determinar el color
    if (porcentajeGasto >= 75) {
      restanteDiv.classList.remove("alert-success", "alert-warning");
      restanteDiv.classList.add("alert-danger");
    } else if (porcentajeGasto >= 50) {
      restanteDiv.classList.remove("alert-success", "alert-danger");
      restanteDiv.classList.add("alert-warning");
    } else {
      restanteDiv.classList.remove("alert-danger", "alert-warning");
      restanteDiv.classList.add("alert-success");
    }

    // Si el total es 0 o menor
    if (restante <= 0) {
      ui.imprimirAlerta("El presupuesto se ha agotado", "error");
      formulario.querySelector('button[type="submit"]').disabled = true;
    } else {
      // Habilitar el botón si el restante es mayor que 0
      formulario.querySelector('button[type="submit"]').disabled = false;
    }
  }
}

// Instanciar
const ui = new userInterface();
let presupuesto;

// Funciones
function preguntarPresupuesto() {
  const presupuestoUsuario = prompt("¿Cual es tu presupuesto?");
  if (
    presupuestoUsuario === "" ||
    presupuestoUsuario === null ||
    isNaN(presupuestoUsuario) ||
    presupuestoUsuario <= 0
  ) {
    window.location.reload();
  }
  //presupuesto valido
  presupuesto = new Presupuesto(presupuestoUsuario);
  ui.insertarPresupuesto(presupuesto);
}

// añade gastos
function agregarGasto(e) {
  e.preventDefault();

  // leer los datos del formulario
  const nombre = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);

  //Validar
  if (nombre === "" || cantidad === "") {
    ui.imprimirAlerta("Ambos campos son obligatorios", "error");
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta("Cantidad no válida", "error");
    return;
  }

  // Generar un objeto con el gasto
  const gasto = { nombre, cantidad, id: Date.now() };

  // añade un nuevo gasto
  presupuesto.nuevoGasto(gasto);
  // Mensaje de todo esta bien.
  ui.imprimirAlerta("Gasto agregado correctamente");
  //Reiniciar el formulario
  formulario.reset();
  //Imprimir los gastos
  const { gastos, restante } = presupuesto;
  ui.agregarGastoListado(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto);
}

function limpiarHTML() {
  while (gastoListado.firstChild) {
    gastoListado.removeChild(gastoListado.firstChild);
  }
}
