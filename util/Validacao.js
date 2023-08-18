/* Classe com métodos auxiliares para as validações relevantes para o desafio.
 */
class Validacao {

    /* Testa se o CPF passado cumpre todas as condições descritas no desafio para ser válido.
     * @param Uma string com o CPF a ser analisado.
     * @return Retorna um booleano.
     */
    static validaCPF(cpf) {
        // Checa se 'cpf' tem tamanho 11
        // A conversão para String é para o caso do objeto passado ser um numero
        if (String(cpf).length !== 11) {
            return false;
        }

        // Checa se são todos números
        let rule1 = /^\d{11}/g;
        if (!rule1.test(cpf)) {
            return false;
        }


        // Checa se todos os caracteres são iguais
        for (let i = 1; i < cpf.length; i++) {
            if (cpf[0] !== cpf[i]) {
                break;
            }
            if (i === cpf.length - 1) {
                return false;
            }
        }

        // Valida os caracteres finais do CPF
        let corpoCPF = cpf.substring(0,9);
        let validaCPF = cpf.substring(9,11);
        let somaJ = 0;
        let somaK = 0;
        for (let i = 0; i < corpoCPF.length; i++) {
            somaJ += (10 - i) * Number(corpoCPF[i]);
            somaK += (11 - i) * Number(corpoCPF[i]);
        } somaK += 2 * Number(validaCPF[0]);
        let restoJ = somaJ % 11;
        let restoK = somaK % 11;

        // Cria uma expressão regular para fazer o teste
        let regexString = "^[0-9]{9}";
        regexString += (restoJ < 2? "[0]{1}" : "[" + (11-restoJ) + "]{1}");
        regexString += (restoK < 2? "[0]{1}" : "[" + (11-restoK) + "]{1}");
        let regex = new RegExp(regexString);

        return regex.test(cpf);
    }

    /* Testa se o nome passado possui tamanho maior ou igual a 5.
     * @param Uma String a ser testada.
     * @return Retorna um booleano apontando se a condicao foi satisfeita.
     */
    static validaNome(nome) {
        return (nome.length >= 5);
    }

     /* Testa se uma data fornecida é válida, de acordo com os requisitos do desafio.
     * @param Um objeto Date.
     * @return Um booleano.
     */
     static validaDataDeNascimento(dataDeNascimento) {
        if (Validacao.data(dataDeNascimento)) {
            if (Validacao.calculaIdade(dataDeNascimento) > Paciente.idade_minima) return true;
            throw new InvalidInputError("paciente deve ter pelo menos 13 anos.")
        }
        return false;
    }

    /* Testa se a String passada é uma data válida no formato DD/MM/AAAA.
     * @param Uma String candidata a data válida.
     * @return Um booleano que confirma se a data é válida ou não.
     */
    static validaData(data) {
        // Cria expressao regular para o formato DD/MM/AAAA
        const regex = /^[0-9]{2}[/]{1}[0-9]{2}[/]{1}[0-9]{4}/g;
        return regex.test(data);
    }

    /**
     * Checa se a String está no formato HHmm e é múltipla de 15 minutos
     * @param {string} hora 
     * @returns Um booleano confirmando se a string segue o formato desejado ou não
     */
    static validaHora(hora) {
        let regex = /^((([0-1]{1}[0-9]{1})|(2{1}[0-3]{1}))(00|15|30|45))|2400$/g;
        return regex.test(hora);
    }

    static validaDataDeConsulta(data, horaInicial, horaFinal) {
        let agora = new Date(Date.now());
        if (!Validacao.data(data)) {
            return false;
        }
        if (!Validacao.hora(horaInicial) || (horaFinal === undefined? false : !Validacao.hora(horaFinal))) {
            return false;
        }
        if (!(Number(horaFinal) > Number(horaInicial))) {
            return false;
        }

        let dataConsulta = Validacao.criaHorario(data, horaInicial);
        return (agora < dataConsulta);
    }

    /* Função auxiliar para calcular a idade de um sujeito em anos a partir da data de nascimento passada como parâmetro.
     * @param Um objeto Date representando a data de nascimento do sujeito.
     * @return Um booleano.
     */
    static calculaIdade(dataNascimento) {
        let hoje = new Date();
        let nascimento = Validacao.criaData(dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        let meses = hoje.getMonth() - nascimento.getMonth();
        if (meses < 0 || (meses === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        } return idade;
    }

    /* Função auxiliar para criação de um objeto Date a partir de uma String no formato DD/MM/AAAA.
     * Para essa função, assume-se que a String ja é uma data válida, então é recomendado o uso da função validaData(data) antes.
     * @param Uma String no formato DD/MM/AAAA
     * @return Um objeto Date
     */
    static criaData(string) {
        let componentes = string.split("/");
        let data = new Date(componentes[2], componentes[1] - 1, componentes[0]);
        return data;
    }

    /* Cria um objeto Date a partir da data e da hora passadas como parâmetro no formato String.
     * É recomendável validar o input com a função 'Validacao.dataDeConsulta(...)' antes.
     * @param String com a data no formato "DD/MM/AAAA".
     * @param String com horário no formato "HHmm"
     * @return Um objeto Date com as data e hora passadas.
     */
    static criaHorario(data, hora) {
        let resultado = Validacao.criaData(data);
        let horas = Number(hora.substring(0,2));
        let minutos = Number(hora.substring(2,4));
        resultado.setHours(horas, minutos);
        return resultado;
    }
}