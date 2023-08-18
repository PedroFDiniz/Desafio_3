import { pacienteColumn } from "./SequelizeDatabase";
import Paciente from "../model/Paciente.js";

class RepositorioPaciente {
    #pacientes;
    #novos_pacientes;

    constructor() {
        this.#pacientes = pacienteColumn.findAll();
    }

    *retrieve() {
        for (let item in this.#pacientes) {
            let p = Paciente.criaFrom(item);
            yield p;
        }
    }

    retrieveAll() {
        let result = [];
        for (let item in this.#pacientes) {
            result.push(Paciente.criaFrom(item));
        } return result;
    }

    add(paciente) {
        const item  = {
            cpf: paciente.CPF,
            nome: paciente.nome,
            dataNascimento: paciente.dataNascimento,
        }
        this.#novos_pacientes.push(item);
    }

    saveToDatabase() {
        
    }
}