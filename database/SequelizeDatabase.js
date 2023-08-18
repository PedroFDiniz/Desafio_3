import { DataTypes, Sequelize } from "sequelize";
import SQLite from 'sqlite3';

class SequelizeDatabase {
    #instance;
    #path = './database.db3';

    constructor(path) {
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
const sequelizeDB = new SequelizeDatabase(SequelizeDatabase.DATABASE_NAME, SequelizeDatabase.DATABASE_USER, SequelizeDatabase.DATABASE_PASSWORD);
const pacienteColumn = sequelizeDB.instance.define("paciente", {
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

const consultaColumn = sequelizeDB.instance.define("consulta", {
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    dataConsulta:{
        type: DataTypes.STRING,
    },
    dataFim: {
        type: DataTypes.STRING,
    },
});

pacienteColumn.sync();
consultaColumn.sync();

export { sequelizeDB, pacienteColumn, consultaColumn };