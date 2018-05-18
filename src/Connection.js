import { MongoClient, Collection } from "mongodb";
import { Config } from "stackerjs-utils";


export class Connection {
    static async query(queryToBeExecuted) {
        if (!this.isConnected()) await this.connect();

        return queryToBeExecuted(this.pool.db(Connection.database))
            .then(response => {
                if (response instanceof Collection || typeof response === "boolean")
                    return { affectedRows: 0, changedRows: 0, lastInsertedId: null }

                if (Array.isArray(response))
                    return response;

                return {
                    affectedRows: response.insertedCount ? response.insertedCount : 0,
                    lastInsertedId: (() => {
                        if (response.insertedIds)
                            return Object.values(response.insertedIds).reverse()[0].toString()

                        if (response.insertedId)
                            return response.insertedId.toString();

                        return null;
                    })(),
                    changedRows: response.modifiedCount ? response.modifiedCount : 0
                }
            });
    }

    static isConnected() {
        return this.pool ? true : false;
    }

    static connect() {
        return new MongoClient.connect(this.buildConnectionString())
            .then(db => this.pool = db);
    }

    static disconnect() {
        return this.pool.close()
            .then(() => this.pool = null)
            .then(() => true);
    }

    static buildConnectionString() {
        let { host, database, user, password } = Connection.parameters;

        let connString = "mongodb://";
        if (user) {
            connString += user;
            if (password) connString += `:${password}`;

            connString += "@";
        }

        connString += `${host}/${database}`;

        return connString;
    }
}
Connection.parameters = {
    host: Config.get("db.host"),
    database: Config.get("db.name"),
    user: Config.get("db.user"),
    password: Config.get("db.pass")
};
Connection.pool = null;
