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
exports.addExpense = addExpense;
exports.updateExpense = updateExpense;
exports.deleteExpense = deleteExpense;
const User_db_1 = __importDefault(require("./User.db"));
const console_1 = require("console");
function addExpense(name, description, addedUser, amount, currency, splitBy, associatedExpenseGroups) {
    return __awaiter(this, void 0, void 0, function* () {
        const splitByJSON = JSON.stringify(splitBy);
        const associatedExpenseGroupsJSON = JSON.stringify(associatedExpenseGroups);
        try {
            const [result, fields] = yield User_db_1.default.query("INSERT INTO Expenses (Name, Description, AddedUser, Amount, Currency, SplitBy, AssociatedExpenseGroups) VALUES (?, ?, ?, ?, ?, ?, ?)", [
                name, description, addedUser, amount, currency, splitByJSON, associatedExpenseGroupsJSON
            ]);
            console.log("Query Success! " + name + " Expense Added");
        }
        catch (error) {
            console.error("Error adding Exoense ", error);
        }
    });
}
function updateExpense(id, name, description, amount, currency, splitBy, associatedExpenseGroups) {
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
            if (amount) {
                const amountJSON = JSON.stringify(amount);
                updates.push("Amount = ?");
                values.push(amountJSON);
            }
            if (currency) {
                updates.push("Currency = ?");
                values.push(currency);
            }
            if (splitBy) {
                const splitByJSON = JSON.stringify(splitBy);
                updates.push("SplitBy = ?");
                values.push(splitByJSON);
            }
            if (associatedExpenseGroups) {
                const associatedExpenseGroupsJSON = JSON.stringify(associatedExpenseGroups);
                updates.push("AssociatedExpenseGroups = ?");
                values.push(associatedExpenseGroupsJSON);
            }
            if (updates.length === 0) {
                console.log("No values provided for update.");
                return;
            }
            const expenseID = JSON.stringify(id);
            values.push(expenseID);
            const expenseUpdateQuery = `
            UPDATE Expenses
            SET ${updates.join(", ")}
            WHERE id = ? 
        `;
            const [result, fields] = yield User_db_1.default.query(expenseUpdateQuery, values);
            console.log("Expense Updated successful:", result);
            return result;
        }
        catch (error) {
            console.error("Error updating Expense ", error);
        }
    });
}
function deleteExpense(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = `
        DELETE from Expenses
        WHERE id = ?
        `;
            const [result, fields] = yield User_db_1.default.query(query, [id]);
        }
        catch (_a) {
            console.error("Error deleting Expense (Expense.db)", console_1.error);
            throw (console_1.error);
        }
    });
}
