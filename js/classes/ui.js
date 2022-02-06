import { eliminarCita, cargarEdicion } from './../functions.js';
import { contenedorCitas } from './../selectors.js';
import { DB } from './../functions.js';

class UI {
  imprimirAlerta(mensaje, tipo) {
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

    if (tipo === 'error') {
      divMensaje.classList.add('alert-danger');
    } else {
      divMensaje.classList.add('alert-success');
    }

    divMensaje.textContent = mensaje;
    document
      .querySelector('#contenido')
      .insertBefore(divMensaje, document.querySelector('.agregar-cita'));

    setTimeout(() => {
      divMensaje.remove();
    }, 5000);
  }

  imprimirCitas() {
    this.limpiarHTML();

    // Leer el contenido de la base de datos
    const objectStore = DB.transaction('citas').objectStore('citas');
    objectStore.openCursor().onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cursor.value;
        const divCita = document.createElement('div');
        divCita.classList.add('cita', 'p-3');
        divCita.dataset.id = id;

        const mascotaParrafo = document.createElement('h2');
        mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
        mascotaParrafo.textContent = mascota;
        divCita.appendChild(mascotaParrafo);

        const propietarioParrafo = document.createElement('p');
        propietarioParrafo.innerHTML = `<span class="font-weight-bolder">Propietario:</span> ${propietario}`;
        divCita.appendChild(propietarioParrafo);

        const telefonoParrafo = document.createElement('p');
        telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Telefono:</span> ${telefono}`;
        divCita.appendChild(telefonoParrafo);

        const fechaParrafo = document.createElement('p');
        fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha:</span> ${fecha}`;
        divCita.appendChild(fechaParrafo);

        const horaParrafo = document.createElement('p');
        horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora:</span> ${hora}`;
        divCita.appendChild(horaParrafo);

        const sintomasParrafo = document.createElement('p');
        sintomasParrafo.innerHTML = `<span class="font-weight-bolder">Sintomas:</span> ${sintomas}`;
        divCita.appendChild(sintomasParrafo);

        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
        btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>`;
        btnEliminar.onclick = () => eliminarCita(id);
        divCita.appendChild(btnEliminar);

        const btnEditar = document.createElement('button');
        btnEditar.classList.add('btn', 'btn-info');
        btnEditar.innerHTML = `
          Editar <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>`;
        const cita = cursor.value;
        btnEditar.onclick = () => cargarEdicion(cita);
        divCita.appendChild(btnEditar);

        contenedorCitas.appendChild(divCita);

        // Avanzar al siguiente elemento de la BD
        cursor.continue();
      }
    };
  }

  limpiarHTML() {
    while (contenedorCitas.firstChild) {
      contenedorCitas.removeChild(contenedorCitas.firstChild);
    }
  }
}

export default UI;
