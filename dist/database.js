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
exports.testConnection = testConnection;
exports.createUser = createUser;
exports.getUsers = getUsers;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create a MySQL connection pool with type assertions
const pool = promise_1.default.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});
function testConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield pool.getConnection();
            console.log('Connected to the database.');
            connection.release();
        }
        catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    });
}
// Define an async function to test the connection
function createUser(name, email, groups) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [result, fields] = yield pool.query("INSERT INTO User (Name, Email, AssociatedExpenseGroups) VALUES (?,?,?)", [name, email, groups]);
            console.log(result);
            console.log(name, email, groups);
            return result;
        }
        catch (error) {
            console.error('An error occurred while querying the database:', error);
            throw error;
        }
    });
}
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield pool.query("SELECT * From User");
        return result[0];
    });
}
function updateUser(id, name, email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield pool.query("UPDATE User SET Name = '" + name + "', Email = '" + email + "' WHERE ID=" + id);
            console.log(yield pool.query("SELECT * from User WHERE ID=" + id));
            return "User " + id + " Updated  Successfully!";
        }
        catch (error) {
            console.error('An error occurred while updating user details to DB', error);
            throw error;
        }
    });
}
function deleteUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield pool.query("DELETE from User WHERE id=" + id);
            console.log("User " + id + " Deleted  Successfully!");
            return "User " + id + " Deleted  Successfully!";
        }
        catch (error) {
            console.error('An error occurred while Deleting user from DB', error);
            throw error;
        }
    });
}
testConnection();
exports.default = pool;
