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
exports.addExpenseGroup = addExpenseGroup;
exports.updateExpenseGroup = updateExpenseGroup;
exports.deleteExpenseGroup = deleteExpenseGroup;
const console_1 = require("console");
const database_1 = __importDefault(require("./database"));
// Name              | varchar(100) | YES  |     | NULL    |                |
// | Description       | text         | YES  |     | NULL    |                |
// | AddedUser         | int(11)      | YES  | MUL | NULL    |                |
// | Members           | json         | YES  |     | NULL    |                |
// | AssociatedMembers | json         | YES  |     | NULL    |                |
// | DateTime 
function addExpenseGroup(name, description, addedUser, associatedMembers, datetime) {
    return __awaiter(this, void 0, void 0, function* () {
        const associatedMembersJson = JSON.stringify(associatedMembers);
        try {
            const [result, fields] = yield database_1.default.query("INSERT into ExpenseGroups (Name, Description, AddedUser, AssociatedMembers, DateTime ) VALUES (?,?,?,?,?)", [
                name, description, addedUser, associatedMembersJson, datetime
            ]);
            console.log(associatedMembersJson);
            console.log(result);
        }
        catch (error) {
            console.error("Error adding Expense Group !", error);
            throw (error);
        }
    });
}
function updateExpenseGroup(id, name, description, addedUser, associatedMembers, datetime) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updates = [];
            const values = [];
            if (name) {
                updates.push("Name = ?");
                values.push(name);
            }
            if (description) {
                updates.push("Description = ?");
                values.push(description);
            }
            if (addedUser) {
                updates.push("AddedUser = ?");
                values.push(addedUser);
            }
            if (associatedMembers) {
                updates.push("AssociatedMembers = ?");
                const associatedMembersJSON = JSON.stringify(associatedMembers);
                values.push(associatedMembersJSON);
            }
            if (datetime) {
                updates.push("DateTime = ?");
                values.push(datetime);
            }
            if (updates.length === 0) {
                throw new Error("No values provided for update.");
            }
            values.push(id);
            const query = `
            UPDATE ExpenseGroups 
            SET ${updates.join(", ")}
            WHERE id = ?
        `;
            // Execute the query
            const [result, fields] = yield database_1.default.query(query, values);
            console.log("Update successful:", result);
            return result;
        }
        catch (error) {
            console.error("Error adding Expense Group !", error);
            throw (error);
        }
    });
}
function deleteExpenseGroup(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = `
        DELETE from ExpenseGroups
        WHERE id = ?
        `;
            const [result, fields] = yield database_1.default.query(query, [id]);
        }
        catch (_a) {
            console.error("Error deleting Expense Group");
            throw (console_1.error);
        }
    });
}
