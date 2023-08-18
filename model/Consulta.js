class Consulta {
    #cpf;
    #dataConsulta;
    #dataFim;

    constructor(cpf, dataDaConsulta, horaInicial, horaFinal) {
        if (!Validacao.cpf(cpf)) {
            throw new InvalidInputError("CPF invalido!");
        }
        if (!Validacao.dataDeConsulta(dataDaConsulta, horaInicial, horaFinal)) {
            throw new InvalidInputError("Data Invalida!");
        }

        this.#cpf = new CPF(cpf);
        this.#dataConsulta = criaHorario(dataDaConsulta, horaInicial);
        this.#dataFim = criaHorario(dataDaConsulta, horaFinal);
    }

    get CPF() {
        return this.#cpf;
    }

    get data_da_consulta() {
        return this.#dataConsulta;
    }

    get dataString() {
        let dia = String(this.#dataConsulta.getDate()).padStart(2,"0");
        let mes = String(this.#dataConsulta.getMonth() + 1).padStart(2,"0");
        let ano = String(this.#dataConsulta.getFullYear());
        return (dia + "/" + mes + "/" + ano);
    }

    get fim_da_consulta() {
        return this.#dataFim;
    }

    get horario_inicial_string() {
        let horas = String(this.#dataConsulta.getHours()).padStart(2,"0");
        let minutos = String(this.#dataConsulta.getMinutes()).padStart(2,"0");
        return (horas + ":" + minutos);
    }

    get horario_final_string() {
        let horas = String(this.#dataFim.getHours()).padStart(2,"0");
        let minutos = String(this.#dataFim.getMinutes()).padStart(2,"0");
        return (horas + ":" + minutos);
    }

    /* Esta função checa se a Consulta já aconteceu ou não.
     * @return um booleano.
     */
    isPendente() {
        let agora = new Date(Date.now());
        return (this.#dataConsulta > agora);
    }

    coincideCom(outraConsulta) {
        if ((this.data_da_consulta > outraConsulta.data_da_consulta && this.data_da_consulta < outraConsulta.fim_da_consulta)
            || (outraConsulta.data_da_consulta > this.data_da_consulta && outraConsulta.data_da_consulta < this.fim_da_consulta)) {
                return true;
        } return false;
    }

    equals(outraConsulta) {
        if (!this.CPF.equals(outraConsulta.CPF)) {
            return false;
        }

        if (this.data_da_consulta !== outraConsulta.data_da_consulta) {
            return false;
        }

        if (this.fim_da_consulta !== outraConsulta.fim_da_consulta) {
            return false;
        }
        return true;
    }

}

export default { Consulta };