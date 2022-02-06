import { crearDB, datosCita, nuevaCita } from './../functions.js';
import {
  mascotaInput,
  propietarioInput,
  telefonoInput,
  fechaInput,
  horaInput,
  sintomasInput,
  formulario,
} from './../selectors.js';

class App {
  constructor() {
    this.initApp();
  }
  initApp() {
    crearDB();

    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);
    formulario.addEventListener('submit', nuevaCita);
  }
}

export default App;
