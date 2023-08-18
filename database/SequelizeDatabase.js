import { DataTypes, Sequelize } from "sequelize";
import SQLite from 'sqlite3';

class SequelizeDatabase {
    #instance;
    #path;

    constructor(path = './database.db3') {
        this.#path = path;
        this.#instance = new Sequelize({
            dialect: 'sqlite',
            storage: this.#path,
            dialectOptions: {
                mode: SQLite.OPEN_READWRITE,
            },
        });
    }

    testarConexaoComBD = async () => {
        try {
            await this.#instance.authenticate();
            return { success: true }
        } catch (erro) {
            return { failure: erro };
        }
    }

    get instance() {
        return this.#instance;
    }
}

// Inicializar e modelar o banco de dados
const sequelizeDB = new SequelizeDatabase();
const pacienteColumn = await sequelizeDB.instance.define("paciente", {
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING,
    },
    dataNascimento: {
        type: DataTypes.DATE,
    },
});

const consultaColumn = await sequelizeDB.instance.define("consulta", {
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    dataConsulta:{
        type: DataTypes.DATE,
    },
    dataFim: {
        type: DataTypes.DATE,
    },
});

sequelizeDB.testarConexaoComBD();

pacienteColumn.sync();
consultaColumn.sync();

export { sequelizeDB, pacienteColumn, consultaColumn };