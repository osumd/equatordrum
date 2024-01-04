import { createPool, Pool, PoolConnection, createConnection } from 'mysql2';

require('dotenv').config();


const pool: Pool = createPool({
    host: "",
    user: "",
    password: "",
    database: "",
    connectionLimit: 10,
});

class DatabaseAgent {
    private connection: PoolConnection | null = null;

    constructor(){
        console.log(process.env.DB_HOST);
        console.log(process.env.DB_USER);

    }

    async connectDirect(): Promise<any>{

        let mysql2Con = createConnection({
            host: '127.0.0.1',
            user: 'leakyhot_cottage',
            password: 'cottage2',
            port: 3306,
            debug: true,
        });

        return mysql2Con;
    }

    async getDatabaseConnection(): Promise<PoolConnection> {
        try {
            if (!this.connection) {
                // Get a connection from the pool
                this.connection = await new Promise<PoolConnection>((resolve, reject) => {
                    pool.getConnection(function (_err, _connection) {
                        if (_err) {
                            console.error('Error creating connection from pool:', _err.message);
                            reject(_err);
                        } else {
                            resolve(_connection);
                        }
                    });
                });
            }

            return this.connection;
        } catch (error) {
            console.error('Error fetching data from the database:', error);
            throw error;
        }
    }

    async releaseConnection() {
        if (this.connection) {
            // Release the connection back to the pool
            this.connection.release();
            this.connection = null;
        }
    }

}


export default DatabaseAgent;