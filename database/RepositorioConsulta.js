import { consultaColumn } from "./SequelizeDatabase.js";
import Consulta from "../model/Consulta.js";

class RepositorioConsulta {
    #consultas;
    #novas_consultas;

    constructor() {
        this.#findAll();
    }

    async #findAll() {
        let allConsultas = await consultaColumn.findAll();
        this.#consultas = allConsultas;
    }

    *iterate() {
        for (let item in this.#consultas) {
            let p = Consulta.createFrom(item.cpf, item.dataConsulta, item.dataFim);
            yield p;
        }
    }

    *retrieveOne(cpfDoPaciente) {
        for (let item in this.#consultas) {
            if (item.cpf === cpfDoPaciente) {
                yield new Consulta.createFrom(item.cpf, item.dataConsulta, item.dataFim);
            }
        }
    }

    retrieveAll() {
        let result = [];
        for (let item in this.#consultas) {
            result.push(Consulta.createFrom(item.cpf, item.dataConsulta, item.dataFim));
        } return result;
    }

    add(consulta) {
        const item  = {
            cpf: consulta.CPF,
            dataConsulta: consulta.data_da_consulta,
            dataFim: consulta.fim_da_consulta,
        }
        this.#novas_consultas.push(item);
    }

    remove(consulta) {
        for (let item in this.#consultas) {
            if (consulta.CPF === item.cpf) {
                this.#consultas.remove(item);
                return item;
            }
        }
        for (let item in this.#novas_consultas) {
            if (consulta.CPF === item.cpf) {
                this.#novas_consultas.remove(item);
                return item;
            }
        }
    }

    saveToDatabase() {
        consultasColumn.bulkCreate(this.#novas_consultas);
    }
}

export default RepositorioConsulta;