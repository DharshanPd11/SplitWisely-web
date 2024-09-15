// DatabasePoolManager.ts
import mysql, { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

class DatabasePoolManager {
    private pool: Pool;

    constructor() {
        this.pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB
        });
        this.testConnection();
    }

    public getPool(): Pool {
        return this.pool;
    }

    public async testConnection(): Promise<void> {
        try {
            const connection = await this.pool.getConnection();
            console.log('Connected to the database.');
            connection.release();
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    public async closePool(): Promise<void> {
        await this.pool.end();
    }
}

const dbManager = new DatabasePoolManager()
export default dbManager;