import mysql, { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';
import DatabasePoolManagerDb from './DatabasePoolManager.db';

dotenv.config();

class UserService {
    private pool: Pool = DatabasePoolManagerDb.getPool();

    constructor() {
        this.pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB
        });
    }

    // Test the connection
    public async testConnection(): Promise<void> {
        try {
            const connection = await this.pool.getConnection();
            console.log('Connected to the database.');
            connection.release();
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    // Create a new user
    public async createUser(name: string, email: string, groups: string): Promise<any> {
        try {
            const [result]: [any, any] = await this.pool.query(
                "INSERT INTO User (Name, Email, AssociatedExpenseGroups) VALUES (?,?,?)", 
                [name, email, groups]
            );
            console.log(result);
            return { name, email, groups };
        } catch (error) {
            console.error('An error occurred while querying the database:', error);
            throw error;
        }
    }

    // Get all users
    public async getUsers(): Promise<any> {
        try {
            const [result]: [any[], any] = await this.pool.query("SELECT * FROM User");
            return result;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    // Update user details
    public async updateUser(id: number, name: string, email: string): Promise<any> {
        try {
            const updates: string[] = [];
            const values: any[] = [];
            const userData: { [key: string]: string } = {};

            if (name) {
                updates.push("Name = ?");
                values.push(name);
                userData["Name"] = name;
            }
            if (email) {
                updates.push("Email = ?");
                values.push(email);
                userData["Email"] = email;
            }

            if (updates.length === 0) {
                throw new Error("No values provided for update.");
            }

            values.push(id);
            const query = `
                UPDATE User
                SET ${updates.join(", ")}
                WHERE id = ?
            `;
            await this.pool.query(query, values);
            console.log("User updated successfully");

            return userData;

        } catch (error) {
            console.error('An error occurred while updating user details in DB:', error);
            throw error;
        }
    }

    // Delete a user
    public async deleteUser(id: number): Promise<string> {
        try {
            await this.pool.query("DELETE FROM User WHERE id = ?", [id]);
            console.log(`User ${id} Deleted Successfully!`);
            return `User ${id} Deleted Successfully!`;
        } catch (error) {
            console.error('An error occurred while deleting user from DB:', error);
            throw error;
        }
    }

    // Close the pool connection
    public async closePool(): Promise<void> {
        try {
            await this.pool.end();
            console.log('Database connection pool closed.');
        } catch (error) {
            console.error('Error closing the database connection pool:', error);
            throw error;
        }
    }
}

// Example usage
const userService = new UserService();

(async () => {
    await userService.testConnection();
    // You can now call db.createUser, db.getUsers, db.updateUser, and db.deleteUser.
})();

export default userService;