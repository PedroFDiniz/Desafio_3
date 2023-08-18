class Paciente {
    #cpf;
    #nome;
    #dataNascimento;
    static #IDADE_MIN = 13;

    constructor(cpf, nome = "generico", nascimento = "01/01/2000") {
        if (!Validacao.nome(nome)) {
            throw new InvalidInputError("Nome Invalido!");
        }
        if (!Validacao.dataDeNascimento(nascimento)) {
            throw new InvalidInputError("Data de nascimento invalida!");
        }
        (cpf === undefined? this.#cpf = new CPF() : this.#cpf = new CPF(cpf));
        this.#nome = nome;
        this.#dataNascimento = Validacao.criaData(nascimento);
    }

    get CPF() {
        return this.#cpf;
    }

    get nome() {
        return this.#nome;
    }

    get data_de_nascimento() {
        return this.#dataNascimento;
    }

    get nascimentoString() {
        let dia = String(this.#dataNascimento.getDate()).padStart(2,"0");
        let mes = String(this.#dataNascimento.getMonth() + 1).padStart(2,"0");
        let ano = String(this.#dataNascimento.getFullYear());
        return (dia + "/" + mes + "/" + ano);
    }

    static get idade_minima() {
        return this.#IDADE_MIN;
    }

    static createFrom(objeto) {
        this.#cpf = objeto.cpf;
        this.#dataNascimento = objeto.dataNascimento;
        this.#nome = objeto.nome;
    }

    equals(outroPaciente) {
        return this.CPF.equals(outroPaciente.CPF);
    }

    toString() {
        let resultado = "";
        resultado += "Nome: " + this.nome;
        resultado += "\nCPF: " + this.CPF.toString();
        resultado += "\nData de nascimento: "
            + String(this.data_de_nascimento.getDate()).padStart(2,"00")
            + "/" + String(this.data_de_nascimento.getMonth()+1).padStart(2,"00")
            + "/" + this.data_de_nascimento.getFullYear();
        return resultado;
    }
}

export default Paciente;