import PromptSync from 'prompt-sync'













/* Basicamente uma enumeração.
 */
class Estados {
    static QUIT = 0;
    static NAO_RECONHECIDO = 1;
    static MENU = 2;
    static CADASTRO = 3;
    static AGENDA = 4;
    static NOVO_PACIENTE = 5;
    static EXCLUIR_PACIENTE = 6;
    static LISTAR_PACIENTE = 7;
    static LISTAR_CPF = 8;
    static AGENDAR_CONSULTA = 9;
    static CANCELAR_CONSULTA = 10;
    static LISTAR_AGENDA = 11;
}

/* Classe para rodar a interface de linha de comando para o desafio.
 */
class CLI {
    estadoAtual;
    #estadoAnterior;
    #consultorio;
    quit = false;
    string_layout1 = ["Menu Principal", "1-Cadastro de pacientes", "2-Agenda", "3-Fim", ""];
    string_layout2 = ["Menu do Cadastro de Pacientes","1-Cadastrar novo paciente", "2-Excluir paciente", "3-Listar pacientes (ordenado por CPF)", "4-Listar pacientes (ordenado por nome)", "5-Voltar p/ menu principal", ""];
    string_layout3 = ["Agenda", "1-Agendar consulta", "2-Cancelar agendamento", "3-Listar agenda", "4-Voltar p/ menu principal", ""];

    constructor() {
        this.estadoAtual = Estados.MENU;
        this.#consultorio = new Consultorio();
    }

    rodar() {
        while (!this.quit) {
            let resultado;
            console.log(this.estadoAtual)
            switch(this.estadoAtual) {
                case Estados.MENU:
                    resultado = this.menuPrincipal();
                    if (CLI.isBreakLoop(resultado)) break;
                    this.updateEstado(resultado);
                    break;
                case Estados.CADASTRO:
                    resultado = this.menuCadastro();
                    if (CLI.isBreakLoop(resultado)) break;
                    this.updateEstado(resultado);
                    break
                case Estados.AGENDA:
                    resultado = this.menuAgenda();
                    if (CLI.isBreakLoop(resultado)) break;
                    this.updateEstado(resultado);
                    break;
                case Estados.NOVO_PACIENTE:
                    resultado = this.novoPaciente();
                    if (CLI.isBreakLoop(resultado)) break;
                    this.updateEstado(resultado);
                    break
                case Estados.EXCLUIR_PACIENTE:
                    resultado = this.excluirPaciente();
                    if (CLI.isBreakLoop(resultado)) break;
                    this.updateEstado(resultado);
                    break
                case Estados.LISTAR_PACIENTE:
                    resultado = this.listarPacientes();
                    if (CLI.isBreakLoop(resultado)) break;
                    this.updateEstado(resultado);
                    break
                case Estados.LISTAR_CPF:
                    resultado = this.listarCPFs();
                    if (CLI.isBreakLoop(resultado)) break;
                    this.updateEstado(resultado);
                    break
                case Estados.AGENDAR_CONSULTA:
                    resultado = this.agendarConsulta();
                    if (CLI.isBreakLoop(resultado)) break;
                    this.updateEstado(resultado);
                    break
                case Estados.CANCELAR_CONSULTA:
                    resultado = this.cancelarConsulta();
                    if (CLI.isBreakLoop(resultado)) break;
                    this.updateEstado(resultado);
                    break
                case Estados.LISTAR_AGENDA:
                    resultado = this.listarAgenda();
                    if (CLI.isBreakLoop(resultado)) break;
                    this.updateEstado(resultado);
                    break
                default:
                    resultado = this;
            }
        }
    }

    static print(array) {
        for (let linha of array) {
            console.log(linha);
        }
    }

    static isBreakLoop(option) {
        if (option === Estados.QUIT || option === Estados.NAO_RECONHECIDO) {
            return true;
        } return false;
    }

    updateEstado(novo) {
        this.#estadoAnterior = this.estadoAtual;
        this.estadoAtual = novo;
    }

    input(string) {
        const prompt = PromptSync({sigint:true});
        let resposta = prompt(string);
        return resposta;
    }

    menuPrincipal() {
        CLI.print(this.string_layout1);
        let resposta = this.input("R: ");
        switch(Number(resposta)) {
            case 1:
                return Estados.CADASTRO;
            case 2:
                return Estados.AGENDA;
            case 3:
                this.quit = true;
                return Estados.QUIT;
            default:
                return Estados.NAO_RECONHECIDO;
        }
    }

    menuCadastro() {
        CLI.print(this.string_layout2)
        let resposta = this.input("R: ");
        switch(Number(resposta)) {
            case 1:
                return Estados.NOVO_PACIENTE;
            case 2:
                return Estados.EXCLUIR_PACIENTE;
            case 3:
                return Estados.LISTAR_CPF;
            case 4:
                return Estados.LISTAR_PACIENTE;
            case 5:
                return Estados.MENU;
            default:
                return Estados.NAO_RECONHECIDO;
        }
    }

    menuAgenda() {
        CLI.print(this.string_layout3);
        let resposta = this.input("R: ");
        switch(Number(resposta)) {
            case 1:
                return Estados.AGENDAR_CONSULTA;
            case 2:
                return Estados.CANCELAR_CONSULTA;
            case 3:
                return Estados.LISTAR_AGENDA;
            case 4:
                return Estados.MENU;
            default:
                return Estados.NAO_RECONHECIDO;
        }
    }

    novoPaciente() {
        let dados = ["", "", ""];
        let cpfValido = false;
        let nomeValido = false;
        let dataValida = false;
        while (!cpfValido) {
            dados[0] = this.input("CPF: ");
            cpfValido = this.testaCPF(dados[0]);
        } while (!nomeValido) {
            dados[1] = this.input("Nome: ");
            nomeValido = this.testaNome(dados[1]);
        } while (!dataValida) {
            dados[2] = this.input("Data de nascimento: ");
            dataValida = this.testaNascimento(dados[2]);
        } this.#consultorio.cadastrar(dados[0],dados[1],dados[2]);
        console.log("Paciente cadastrado com sucesso!\n")

        return Estados.CADASTRO;

    }

    excluirPaciente() {
        let cpf;
        let cpfValido = false;
        while (!cpfValido) {
            cpf = this.input("CPF: ");
            cpfValido = this.testaCPF(cpf);
        } this.#consultorio.descadastrar(cpf);
        console.log("Paciente excluído com sucesso!\n");
        return Estados.CADASTRO;
    }

    listarPacientes() {
        let mapa = new Map([...this.#consultorio.cadastros].sort( this.comparaPacientes ));
        this.imprimeMapa(mapa);
        return Estados.CADASTRO;
    }

    listarCPFs() {
        let mapa = new Map([...this.#consultorio.cadastros].sort( this.comparaPacientesPorCPF ));
        this.imprimeMapa(mapa);
        return Estados.CADASTRO;
    }

    agendarConsulta() {
        let cpf;
        let data;
        let hInicial;
        let hFinal;
        let cpfValido = false;
        let dataValida = false;
        let hInicialValida = false;
        let hFinalValida = false;

        while (!cpfValido) {
            cpf = this.input("CPF: ");
            cpfValido = this.testaCPF(cpf);
        }
        while (!dataValida) {
            data = this.input("Data da consulta: ");
            dataValida = Validacao.data(data);
        }
        while (!hInicialValida) {
            hInicial = this.input("Hora inicial: ");
            hInicialValida = Validacao.hora(hInicial);
        }
        while (!hFinalValida) {
            hFinal = this.input("Hora final: ");
            hFinalValida = Validacao.hora(hFinal);
        }

        try {
            this.#consultorio.agendarConsulta(cpf,data,hInicial,hFinal);
            console.log("Agendamento realizado com sucesso!\n");
        } catch (erro) {
            console.log("\nErro: " + erro.message);
        } return Estados.AGENDA;
    }

    cancelarConsulta() {
        let cpf;
        let data;
        let hInicial;
        let cpfValido = false;
        let dataValida = false;
        let hInicialValida = false;
        while (!cpfValido) {
            cpf = this.input("CPF: ");
            cpfValido = this.testaCPF(cpf);
        }
        while (!dataValida) {
            data = this.input("Data da consulta: ");
            dataValida = Validacao.data(data);
        }
        while (!hInicialValida) {
            hInicial = this.input("Hora inicial: ");
            hInicialValida = Validacao.hora(hInicial);
        }

        try {
            if ( !this.#consultorio.cancelarConsulta(cpf, data, hInicial) ) {
                console.log("\nErro: agendamento não encontrado");
            } else {
                console.log("\nErro: agendamento cancelado com sucesso!");
            }

        } catch (erro) {
            console.log("\nErro: " + erro.message);
        }
        return Estados.AGENDA;
    }

    listarAgenda() {
        let data;
        let data2;
        let dataValida = false;
        let dataValida2 = false;
        while (!dataValida) {
            data = this.input("Data inicial: ");
            dataValida = Validacao.data(data);
        }
        while (!dataValida2) {
            data2 = this.input("Data final: ");
            dataValida2 = Validacao.data(data2);
        }
        this.imprimeLista(this.filtrarConsultas(data,data2));
        return Estados.AGENDA;
    }

    imprimeMapa(mapa) {
        console.log("".padEnd(61,"-"));
        console.log("CPF".padEnd(16," ") + "Nome".padEnd(33," ") + "Dt.Nasc.".padEnd(10," ") + "Idade");
        console.log("".padEnd(61,"-"));
        for (let key of mapa.keys()) {
            let dado1 = key.CPF.toString().padEnd(16, " ");
            let dado2 = key.nome.padEnd(33, " ");
            let dado3 = key.nascimentoString.padEnd(12," ");
            let dado4 = String(Validacao.calculaIdade(key.nascimentoString)).padStart(4," ");

            console.log(dado1 + dado2 + dado3 + dado4);
            if (mapa[key].length > 0) {
                for (let consulta of mapa[key]) {
                    console.log("".padStart(12, " ") + "Agendado para: " + consulta.dataString);
                    console.log("".padStart(12, " ") + consulta.horario_inicial_string + " às " + consulta.horario_final_string);
                }
            }
        } console.log("".padEnd(61,"-"));
    }

    filtrarConsultas(dataInicial,dataFinal) {
        let lista = [];
        let inicio = Validacao.criaData(dataInicial);
        let fim = Validacao.criaData(dataFinal);
        for (let consulta of this.#consultorio.consultas) {
            if (consulta.data_da_consulta >= inicio && consulta.dataConsulta <= fim) {
                lista.push(consulta);
            }
        } return lista;
    }

    imprimeLista(lista) {
        console.log("".padEnd(61,"-"));
        console.log("Data".padStart(7," ") + "H.Ini".padStart(9," ") + "H.Fim".padStart(6," ") + "Tempo".padStart(6," ") + "Nome".padStart(5," ") + "Dt.Nasc.".padStart(27," "));
        console.log("".padEnd(61,"-"));
        for (let consulta of lista) {
            let paciente = this.#consultorio.buscarPaciente(consulta.cpf);
            console.log(consulta.dataString.padEnd(11," ") + consulta.horario_inicial_string.padEnd(6," ") + consulta.horario_final_string.padEnd(6," ") + "".padEnd(6," ") + paciente.nome.padEnd(17," ") + paciente.nascimentoStringo.padEnd(11," "));
        }
        console.log("".padEnd(61,"-"));
    }

    testaCPF(cpf) {
        if (this.#consultorio.buscarPaciente(cpf) !== undefined) {
            console.log("Erro: CPF já cadastrado");
        }
        try {
            let resultado = new CPF(cpf);
            return true;
        } catch (erro) {
            console.log("Erro: " + erro.message);
            return false;
        }
    }

    testaNome(nome) {
        return Validacao.nome(nome);
    }

    testaNascimento(data) {
        try {
            if (!Validacao.dataDeNascimento(data)) {
                console.log("Erro: data inválida.");
                return false;
            } return true;
        } catch (erro) {
            console.log("Erro: " + erro.message);
            return false;
        }
    }

    comparaPacientes(pacienteA, pacienteB) {
        if (pacienteA.nome < pacienteB.nome) return -1;
        if (pacienteA.nome > pacienteB.nome) return 1;
        return 0;
    }

    comparaPacientesPorCPF(pacienteA, pacienteB) {
        if (pacienteA.CPF.toString() < pacienteB.CPF.toString()) return -1;
        if (pacienteA.CPF.toString() > pacienteB.CPF.toString()) return 1;
        return 0;
    }

}

let cli = new CLI();
console.log("Exemplo de CPF Valido: " + (new CPF()).CPF);
cli.rodar();

