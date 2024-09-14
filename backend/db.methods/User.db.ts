import mysql, { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create a MySQL connection pool with type assertions
const pool: Pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});

export async function testConnection(): Promise<void> {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to the database.');
        connection.release();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

// Define an async function to test the connection
export async function createUser(name: string, email: string, groups: string): Promise<any> {
    try {
        const [result, fields]: [any[], any] = await pool.query("INSERT INTO User (Name, Email, AssociatedExpenseGroups) VALUES (?,?,?)", [name, email, groups]);
        console.log(result);
        console.log(name, email, groups);
        return result
    } catch (error) {
        console.error('An error occurred while querying the database:', error);
        throw error;
    }
}

export async function getUsers(): Promise<any> {
    const result = await pool.query("SELECT * From User");
    return result[0];
}

export async function updateUser(id: number, name: string, email: string): Promise<string> {
    try {
        await pool.query("UPDATE User SET Name = '" + name + "', Email = '" + email + "' WHERE ID=" + id)
        console.log(await pool.query("SELECT * from User WHERE ID=" + id))
        return "User " + id + " Updated  Successfully!";
    } catch (error) {
        console.error('An error occurred while updating user details to DB', error);
        throw error;
    }
}

export async function deleteUser(id: number): Promise<string> {
    try {
        await pool.query("DELETE from User WHERE id=" + id)
        console.log("User " + id + " Deleted  Successfully!")
        return "User " + id + " Deleted  Successfully!";
    } catch (error) {
        console.error('An error occurred while Deleting user from DB', error);
        throw error;
    }
}

testConnection()

export default pool;
