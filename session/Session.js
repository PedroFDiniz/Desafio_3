import { sequelizeDB } from '../database/SequelizeDatabase.js';
import Consultorio from '../model/Consultorio.js';
import RepositorioConsulta from '../database/RepositorioConsulta.js'
import RepositorioPaciente from '../database/RepositorioPaciente.js'

/**
 * Classe que controla a sessão do usuário
 */
class SessionManager {
    #consultorio;
    #repositorioPacientes;
    #repositorioConsultas;


    constructor() {
        this.#repositorioConsultas = new RepositorioConsulta();
        this.#repositorioPacientes = new RepositorioPaciente();

        let mapaDoConsultorio = new Map();
        for (let item in this.#repositorioPacientes) {
            listaDeConsultas = [];
            for (let consulta in this.#repositorioConsultas.iterate()) {
                if (consulta.cpf === item.cpf) {
                    listaDeConsultas.push(consulta);
                }
            } mapaDoConsultorio[item] = listaDeConsultas;
        }
        this.#consultorio = new Consultorio(mapaDoConsultorio);
    }

    get Consultorio() {
        return this.#consultorio;
    }

    get bancoDeConsultas() {
        return this.#repositorioConsultas;
    }

    get bancoDePacientes() {
        return this.#repositorioPacientes
    }

    updateDatabase() {
        this.#repositorioConsultas.saveToDatabase(this.#consultorio.consultas);
        this.#repositorioPacientes.saveToDatabase(this.#consultorio.pacientes);
    }
}

const session = new SessionManager();
export default session;