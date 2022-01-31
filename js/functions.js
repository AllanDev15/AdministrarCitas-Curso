import Citas from './classes/citas.js';
import UI from './classes/ui.js';
import {
  mascotaInput,
  propietarioInput,
  telefonoInput,
  fechaInput,
  horaInput,
  sintomasInput,
  formulario,
} from './selectors.js';

let editando;
const ui = new UI();
const administrarCitas = new Citas();

const citaObj = {
  mascota: '',
  propietario: '',
  telefono: '',
  fecha: '',
  hora: '',
  sintomas: '',
};

export function datosCita(e) {
  citaObj[e.target.name] = e.target.value;
}

// Valida y agrega una nueva cita a la clase de citas
export function nuevaCita(e) {
  e.preventDefault();
  const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

  // Validar
  if (
    mascota === '' ||
    propietario === '' ||
    telefono === '' ||
    fecha === '' ||
    hora === '' ||
    sintomas === ''
  ) {
    ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
    return;
  }

  if (editando) {
    administrarCitas.editarCita({ ...citaObj });
    formulario.querySelector('button[type="submit"]').textContent = 'Crear cita';
    ui.imprimirAlerta('Editado correctamente');
    editando = false;
  } else {
    // Generar id unico
    citaObj.id = Math.random().toString(36).slice(2);
    administrarCitas.agregarCita({ ...citaObj });
    ui.imprimirAlerta('Se agrego correctamente');
  }

  reiniciarObjeto();
  formulario.reset();

  ui.imprimirCitas(administrarCitas);
}

export function reiniciarObjeto() {
  citaObj.mascota = '';
  citaObj.propietario = '';
  citaObj.telefono = '';
  citaObj.fecha = '';
  citaObj.hora = '';
  citaObj.sintomas = '';
}

export function eliminarCita(id) {
  administrarCitas.eliminarCita(id);
  ui.imprimirAlerta('La cita se elimino correctamente');
  ui.imprimirCitas(administrarCitas);
}

export function cargarEdicion(cita) {
  const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

  mascotaInput.value = mascota;
  propietarioInput.value = propietario;
  telefonoInput.value = telefono;
  fechaInput.value = fecha;
  horaInput.value = hora;
  sintomasInput.value = sintomas;

  // Llenando el objeto
  citaObj.mascota = mascota;
  citaObj.propietario = propietario;
  citaObj.telefono = telefono;
  citaObj.fecha = fecha;
  citaObj.hora = hora;
  citaObj.sintomas = sintomas;
  citaObj.id = id;

  formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
  editando = true;
}
