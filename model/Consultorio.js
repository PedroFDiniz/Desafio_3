class Consultorio {
    // #cadastros é um objeto do tipo Map<Paciente, Consulta[]>
    #cadastros;

    // Para sinalizar o horário de funcionamento do consultório
    #HORARIO_ABERTURA = "0800";
    #HORARIO_FECHAMENTO = "1900";

    constructor(cadastros) {
        // Caso não seja passado nenhum parâmetro
        if (cadastros === undefined) {
            this.#cadastros = new Map();
        } else {
            this.#cadastros = cadastros;
        }
    }

    get pacientes() {
        return this.#cadastros.keys();
    }

    get consultas() {
        let resultado = [];
        for (let listaDeConsultas of this.#cadastros.values()) {
            resultado = resultado.concat(listaDeConsultas);
        } return resultado;
    }

    get cadastros() {
        return this.#cadastros.entries();
    }

    /** Cadastra um Paciente no mapa do consultório.
     * @param {String} cpf contendo os 11 dígitos de um CPF válido para o Paciente.
     * @param {String} nome de tamanho mínimo 5 referente ao nome do paciente.
     * @param {String} dataNascimento contendo a data de nascimento do paciente, no formato "DD/MM/AAAA".
     * @return Um booleano confirmando se o paciente foi cadastrado com sucesso.
     */
    cadastrar(cpf, nome, dataNascimento) {
        let novoPaciente = new Paciente(cpf, nome, dataNascimento);
        for (let paciente of this.#cadastros.keys()) {
            if (paciente.equals(novoPaciente)) {
                return false;
            }
        }
        this.#cadastros.set(novoPaciente,[]);
        return true;
    }

    /** Remove um Paciente do mapa do consultório.
     * @param {String} cpf contendo os 11 dígitos de um CPF válido para o Paciente.
     * @return Um booleano confirmando se o paciente foi retirado do mapa com sucesso.
     */
    descadastrar(cpf) {
        // Cria um paciente generico só para facilitar a pesquisa
        let aRemover = new Paciente(cpf);

        for (let paciente of this.#cadastros.keys()) {
            if (paciente.equals(aRemover)) {
                // Se o paciente for encontrado, checar suas consultas
                for (let consulta of this.#cadastros.get(paciente)) {
                    if (consulta.isPendente()) return false;
                }

                // Se nenhuma das consultas estiver pendente, apagar a chave e valores do mapa de cadastros
                this.#cadastros.delete(paciente);
                return true;
            }
        } return false;
    }

    /** Busca um paciente pelo seu CPF dentro do mapa de cadastros do consultório.
     * @param {String} cpf Uma String correspondente ao CPF do paciente buscado.
     * @return Um objeto Paciente se algum com o CPF passado estiver presente nas chaves do mapa, ou undefined caso contrário.
     */
    buscarPaciente(cpf) {
        for (let paciente of this.#cadastros.keys()) {
            if (paciente.CPF.CPF === cpf) return paciente;
        } return;
    }

    hasConsultaAgendada(paciente) {
        for (let consulta of this.#cadastros[paciente]) {
            if (consulta.isPendente()) {
                return true;
            }
        } return false;
    }

    /** Adiciona uma consulta ao cadastro do paciente no Consultório.
     * Os parâmetros são todos em forma de String, e a função lançará um InvalidInputError caso algum não esteja adequado.
     * Não admite um agendamento caso exista alguma consulta já agendada.
     * Não permite agendamento caso os horários estejam fora do limite de funcionamento do consultório.
     *
     * @param {String} cpf correspondente aos 11 dígitos do CPF do paciente buscado.
     * @param {String} data correspondente à data da consulta a ser agendada. Formato "DD/MM/AAAA".
     * @param {String} horaInicial contendo o horário inicial da consulta. Formato "HHmm".
     * @param {String} horaFinal contendo o horário de término da consulta. Formato "HHmm".
     * @return Um booleano indicando se a consulta foi adicionada ao mapa do consultório ou não.
     */
    agendarConsulta(cpf, data, horaInicial, horaFinal) {
        let paciente = this.buscarPaciente(cpf);
        if (paciente === undefined) {
            return false;
        }
        if (this.hasConsultaAgendada(paciente)) {
            return false;
        }

        // Checa se o horário está dentro do horário de funcionamento do consultório
        if (Number(horaInicial) < Number(this.#HORARIO_ABERTURA) || Number(horaFinal) > Number(this.#HORARIO_FECHAMENTO)) {
            return false;
        }
        let novaConsulta = new Consulta(cpf, data, horaInicial, horaFinal);

        // Checa se a nova consulta coincide em horário com alguma outra consulta do paciente
        for (let consulta of this.#cadastros[paciente]) {
            if (consulta.coincideCom(novaConsulta)) {
                return false;
            }
        }
        // Inserir a consulta criada no array que é retornado como valor da chave 'paciente' no mapa #cadastros
        this.#cadastros[paciente].push(novaConsulta);
        return true;
    }

    /* Remove uma consulta do mapa de um paciente, caso data e hora passados sejam válidos, o paciente exista e a consulta esteja no mapa.
     * @param String correspondente aos 11 dígitos do CPF do paciente buscado.
     * @param String correspondente à data da consulta a ser agendada. Formato "DD/MM/AAAA".
     * @param String contendo o horário inicial da consulta. Formato "HHmm".
     * @return Um booleano confirmando se a consulta buscada foi removida.
     */
    cancelarConsulta(cpf, data, horaInicial) {
        if (!Validacao.hora(horaInicial) || Validacao.data(data)) {
            return false;
        }
        let paciente = this.buscarPaciente(cpf);
        if (paciente === undefined) {
            return false;
        }

        let horario = Validacao.criaHorario(data, horaInicial);
        for (let consulta of this.#cadastros[paciente]) {
            if (consulta.data_da_consulta === horario) {
                this.#cadastros[paciente].splice(consulta);
                return true;
            }
        } return false;

    }
}

export default Consultorio;