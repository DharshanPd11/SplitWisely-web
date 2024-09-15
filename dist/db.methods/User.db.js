"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
const DatabasePoolManager_db_1 = __importDefault(require("./DatabasePoolManager.db"));
dotenv_1.default.config();
class UserService {
    constructor() {
        this.pool = DatabasePoolManager_db_1.default.getPool();
        this.pool = promise_1.default.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB
        });
    }
    // Test the connection
    testConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield this.pool.getConnection();
                console.log('Connected to the database.');
                connection.release();
            }
            catch (error) {
                console.error('Unable to connect to the database:', error);
            }
        });
    }
    // Create a new user
    createUser(name, email, groups) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield this.pool.query("INSERT INTO User (Name, Email, AssociatedExpenseGroups) VALUES (?,?,?)", [name, email, groups]);
                console.log(result);
                return { name, email, groups };
            }
            catch (error) {
                console.error('An error occurred while querying the database:', error);
                throw error;
            }
        });
    }
    // Get all users
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield this.pool.query("SELECT * FROM User");
                return result;
            }
            catch (error) {
                console.error('Error fetching users:', error);
                throw error;
            }
        });
    }
    // Update user details
    updateUser(id, name, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updates = [];
                const values = [];
                const userData = {};
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
                yield this.pool.query(query, values);
                console.log("User updated successfully");
                return userData;
            }
            catch (error) {
                console.error('An error occurred while updating user details in DB:', error);
                throw error;
            }
        });
    }
    // Delete a user
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.pool.query("DELETE FROM User WHERE id = ?", [id]);
                console.log(`User ${id} Deleted Successfully!`);
                return `User ${id} Deleted Successfully!`;
            }
            catch (error) {
                console.error('An error occurred while deleting user from DB:', error);
                throw error;
            }
        });
    }
    // Close the pool connection
    closePool() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.pool.end();
                console.log('Database connection pool closed.');
            }
            catch (error) {
                console.error('Error closing the database connection pool:', error);
                throw error;
            }
        });
    }
}
// Example usage
const userService = new UserService();
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield userService.testConnection();
    // You can now call db.createUser, db.getUsers, db.updateUser, and db.deleteUser.
}))();
exports.default = userService;
