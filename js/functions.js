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

let editando, DB;
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
    // Modo edicion
    administrarCitas.editarCita({ ...citaObj });
    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');
    objectStore.put(citaObj);
    transaction.oncomplete = () => {
      formulario.querySelector('button[type="submit"]').textContent = 'Crear cita';
      ui.imprimirAlerta('Editado correctamente');
      editando = false;
    };
    transaction.onerror = () => {
      ui.imprimirAlerta('Error al actualizar la cita', 'error');
    };
  } else {
    // Generar id unico
    citaObj.id = Math.random().toString(36).slice(2);

    // Insertar registro en Indexed DB
    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');
    objectStore.add(citaObj);

    transaction.oncomplete = function () {
      administrarCitas.agregarCita({ ...citaObj });
      reiniciarObjeto();
      ui.imprimirAlerta('Se agrego correctamente');
    };

    transaction.onerror = function () {
      ui.imprimirAlerta('Hubo un error al agregar la cita a la base de datos', 'error');
    };
  }

  formulario.reset();
  ui.imprimirCitas();
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
  const transaction = DB.transaction(['citas'], 'readwrite');
  const objectStore = transaction.objectStore('citas');
  objectStore.delete(id);

  transaction.oncomplete = () => {
    ui.imprimirAlerta('La cita se elimino correctamente');
    ui.imprimirCitas();
  };

  transaction.onerror = () => {
    ui.imprimirAlerta('Hubo un error al eliminar la cita');
  };
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

export function crearDB() {
  const crearDB = window.indexedDB.open('citas', 1);

  crearDB.onerror = function () {
    console.log('Hubo un error');
  };

  crearDB.onsuccess = function () {
    DB = crearDB.result;
    ui.imprimirCitas();
  };

  crearDB.onupgradeneeded = function (e) {
    const db = e.target.result;
    const objectStore = db.createObjectStore('citas', {
      keyPath: 'id',
      autoincrement: true,
    });

    objectStore.createIndex('mascota', 'mascota', { unique: false });
    objectStore.createIndex('propietario', 'propietario', { unique: false });
    objectStore.createIndex('telefono', 'telefono', { unique: false });
    objectStore.createIndex('fecha', 'fecha', { unique: false });
    objectStore.createIndex('hora', 'hora', { unique: false });
    objectStore.createIndex('sintomas', 'sintomas', { unique: false });
    objectStore.createIndex('id', 'id', { unique: true });

    console.log('DB creada y lista');
  };
}

export { DB };
