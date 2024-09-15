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
const DatabasePoolManager_db_1 = __importDefault(require("./DatabasePoolManager.db"));
class ExpenseService {
    constructor() {
        this.pool = DatabasePoolManager_db_1.default.getPool();
    }
    // Method to add a new expense
    addExpense(name, description, addedUser, amount, currency, splitBy, associatedExpenseGroups) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Step 1: Insert the basic expense information into the Expenses table
                const [expenseResult] = yield this.pool.query("INSERT INTO Expenses (Name, Description, AddedUser, Amount, Currency) VALUES (?, ?, ?, ?, ?)", [name, description, addedUser, amount, currency]);
                const expenseId = expenseResult.insertId;
                console.log(`Expense added with ID: ${expenseId}`);
                // Step 2: Insert splitBy into Expense_SplitBy table
                yield this.insertSplitByUsers(expenseId, splitBy);
                // Step 3: Insert associatedExpenseGroups into Expense_AssociatedExpenseGroups table
                yield this.insertExpenseGroups(expenseId, associatedExpenseGroups);
                // Return the newly added expense
                const [newExpense] = yield this.pool.query("SELECT * FROM Expenses WHERE Id = ?", [expenseId]);
                return newExpense;
            }
            catch (error) {
                console.error("Error adding expense", error);
                throw error;
            }
        });
    }
    // Method to update an existing expense
    updateExpense(id, name, description, amount, currency, splitBy, associatedExpenseGroups) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updates = [];
                const values = [];
                // Update basic fields in the Expenses table
                if (name)
                    updates.push("Name = ?"), values.push(name);
                if (description)
                    updates.push("Description = ?"), values.push(description);
                if (amount)
                    updates.push("Amount = ?"), values.push(amount);
                if (currency)
                    updates.push("Currency = ?"), values.push(currency);
                if (updates.length > 0) {
                    const expenseUpdateQuery = `
                    UPDATE Expenses
                    SET ${updates.join(", ")}
                    WHERE Id = ?
                `;
                    values.push(id);
                    yield this.pool.query(expenseUpdateQuery, values);
                    console.log("Expense updated successfully.");
                }
                // Update splitBy in Expense_SplitBy table
                if (splitBy) {
                    yield this.pool.query("DELETE FROM Expense_SplitBy WHERE ExpenseId = ?", [id]);
                    yield this.insertSplitByUsers(id, splitBy);
                }
                // Update associatedExpenseGroups in Expense_AssociatedExpenseGroups table
                if (associatedExpenseGroups) {
                    yield this.pool.query("DELETE FROM Expense_AssociatedExpenseGroups WHERE ExpenseId = ?", [id]);
                    yield this.insertExpenseGroups(id, associatedExpenseGroups);
                }
                // Fetch and return the updated expense
                const [updatedExpense] = yield this.pool.query("SELECT * FROM Expenses WHERE Id = ?", [id]);
                return updatedExpense;
            }
            catch (error) {
                console.error("Error updating Expense", error);
                throw error;
            }
        });
    }
    // Method to delete an expense
    deleteExpense(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = "DELETE from Expenses WHERE id = ?";
                const [result, fields] = yield this.pool.query(query, [id]);
                console.log("Expense deleted successfully.");
            }
            catch (error) {
                console.error("Error deleting Expense", error);
                throw error;
            }
        });
    }
    // Private method to handle the insertion of splitBy users
    insertSplitByUsers(expenseId, splitBy) {
        return __awaiter(this, void 0, void 0, function* () {
            if (splitBy && splitBy.length > 0) {
                const splitByInsertQuery = "INSERT INTO Expense_SplitBy (ExpenseId, UserId) VALUES (?, ?)";
                for (const userId of splitBy) {
                    const [userCheck] = yield this.pool.query("SELECT ID FROM User WHERE ID = ?", [userId]);
                    if (userCheck.length > 0) {
                        yield this.pool.query(splitByInsertQuery, [expenseId, userId]);
                    }
                    else {
                        console.error(`User with ID ${userId} does not exist. Skipping.`);
                    }
                }
                console.log("Users added to Expense_SplitBy successfully.");
            }
        });
    }
    // Private method to handle the insertion of associated expense groups
    insertExpenseGroups(expenseId, associatedExpenseGroups) {
        return __awaiter(this, void 0, void 0, function* () {
            if (associatedExpenseGroups && associatedExpenseGroups.length > 0) {
                const expenseGroupInsertQuery = "INSERT INTO Expense_AssociatedExpenseGroups (ExpenseId, ExpenseGroupId) VALUES (?, ?)";
                for (const groupId of associatedExpenseGroups) {
                    const [groupCheck] = yield this.pool.query("SELECT ID FROM ExpenseGroups WHERE ID = ?", [groupId]);
                    if (groupCheck.length > 0) {
                        yield this.pool.query(expenseGroupInsertQuery, [expenseId, groupId]);
                    }
                    else {
                        console.error(`Expense group with ID ${groupId} does not exist. Skipping.`);
                    }
                }
                console.log("Expense groups added to Expense_AssociatedExpenseGroups successfully.");
            }
        });
    }
}
// Export the service instance
const expenseService = new ExpenseService();
exports.default = expenseService;
