import { sequelizeDB } from '../database/SequelizeDatabase.js';
import Consultorio from '../model/Consultorio.js';

/**
 * Classe que controla a sessão do usuário
 */
class SessionManager {
    #consultorio;
    #database;


    constructor() {
        this.#consultorio = new Consultorio();
        this.#database = sequelizeDB;
    }

    get Consultorio() {
        return this.#consultorio;
    }

    get Database() {
        return this.#database;
    }
}

const session = new SessionManager();
const consultorio1 = new Consultorio();
console.log(consultorio1);
export default session;