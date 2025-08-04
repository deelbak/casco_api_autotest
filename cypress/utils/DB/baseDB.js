const mysql = require('mysql2/promise');
const Logger = require('../log/Logger');

class BaseDB {
    #host;
    #user;
    #port;
    #password;
    #database;
    #connection;


    constructor(host, user, port, password, database, connection) {
        this.#host = host;
        this.#user = user;
        this.#password = password;
        this.#database = database;
        this.#port = port;
    }

    async createConnection() {
        Logger.log(`[inf] ▶ connect to ${this.#database} database`)
        this.#connection = await mysql.createConnection({
            host: this.#host,
            user: this.#user,
            password: this.#password,
            database: this.#database,
            port: this.#port

        })
    }

    async closeConnection() {
        Logger.log(`[inf] ▶ close connection to ${this.#database} database`);
        await this.#connection.end();
    }

    async sqlQuery(sql, values) {
        const [rows] = await this.#connection.query(query, values);
        return rows;
    }

    async sqlSelect(tableName, target = '*', conditions = '', values = [], logger = true) {
        if (logger) Logger.log(`[inf] ▶ select ${target} from ${tableName} table`);
        const query = `SELECT ${target} from ${tableName} ${conditions}`;
        return await this.sqlQuery(query, values);
    }
}

