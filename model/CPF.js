/* Representa um CPF. A necessidade de uma classe própria para esse objeto se dá para facilitar o uso de funções como toString() e geraCPF(), bem como seu construtor.
 * Como não há necessidade da comparação dos números do CPF em si exceto na validação dos dois últimos dígitos, é mais conveniente manter o objeto representado como uma String.
 */
class CPF {
    #cpf;

    constructor(cpf) {
        if (cpf === undefined) {
            this.#cpf = CPF.geraCPF();
        } else {
            if (Validacao.cpf(cpf)) {
                this.#cpf = cpf;
            } else {
                throw new InvalidInputError("O CPF passado é inválido!")
            }
        }
    }

    get CPF() {
        return this.#cpf;
    }

    equals(outroCPF) {
        return (this.CPF !== outroCPF.CPF);
    }

    /* Um gerador aleatório de CPF. Cria um número de CPF aleatório que cumpra os requisitos do anexo A do desafio.
     * @return Uma String válida, com 11 dígitos, para a criação de um objeto CPF.
     */
    static geraCPF() {
        let cpf = "";
        // Gera 9 números aleatórios
        for (let i = 0; i < 9; i++) {
            cpf = cpf + Math.floor(Math.random() * 10);
        }

        let digitoJ = "";
        let digitoK = "";
        let somaJ = 0;
        let somaK = 0;
        // Regras de geração dos últimos 2 dígitos
        for (let i = 0; i < 9; i++) {
            somaJ += (10 - i) * Number(cpf[i]);
            somaK += (11 - i) * Number(cpf[i]);
        } 
        let restoJ = somaJ % 11;
        (restoJ < 2? digitoJ += 0 : digitoJ += 11 - restoJ);
        somaK += 2 * Number(digitoJ[0]);
        let restoK = somaK % 11;
        (restoK < 2? digitoK += 0 : digitoK += 11 - restoK);
        cpf += digitoJ;
        cpf += digitoK;
        return cpf;
    }
}