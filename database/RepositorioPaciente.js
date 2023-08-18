import { pacienteColumn } from "./SequelizeDatabase.js";
import Paciente from "../model/Paciente.js";

class RepositorioPaciente {
    #pacientes;
    #novos_pacientes;

    constructor() {
        this.#findAll();
    }

    async #findAll() {
        let allPacientes = await pacienteColumn.findAll();
        this.#pacientes = allPacientes;
    }

    *iterate() {
        for (let item in this.#pacientes) {
            let p = Paciente.createFrom(item);
            yield p;
        }
    }

    retrieveOne(cpfDoPaciente) {
        for (let item in this.#pacientes) {
            if (item.cpf === cpfDoPaciente) {
                return new Paciente(item.cpf, item.nome, item.dataNascimento);
            }
        }
    }

    retrieveAll() {
        let result = [];
        for (let item in this.#pacientes) {
            result.push(Paciente.createFrom(item));
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

    remove(paciente) {
        for (let item in this.#pacientes) {
            if (paciente.CPF === item.cpf) {
                this.#pacientes.remove(item);
                return item;
            }
        }
        for (let item in this.#novos_pacientes) {
            if (paciente.CPF === item.cpf) {
                this.#novos_pacientes.remove(item);
                return item;
            }
        }
    }

    saveToDatabase() {
        pacienteColumn.bulkCreate(this.#novos_pacientes);
    }
}

export default RepositorioPaciente;