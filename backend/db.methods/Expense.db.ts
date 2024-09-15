import { stringify } from 'querystring';
import dbManager from './DatabasePoolManager.db';
import { Console, error } from "console";

class ExpenseService {
    private pool = dbManager.getPool();

    // Method to add a new expense
    public async addExpense(
        name: string,
        description: string,
        addedUser: number,
        amount: number,
        currency: string,
        splitBy: number[],
        associatedExpenseGroups: number[]
    ) {
        try {
            // Step 1: Insert the basic expense information into the Expenses table
            const [expenseResult]: [any, any] = await this.pool.query(
                "INSERT INTO Expenses (Name, Description, AddedUser, Amount, Currency) VALUES (?, ?, ?, ?, ?)",
                [name, description, addedUser, amount, currency]
            );
            const expenseId = expenseResult.insertId;
            console.log(`Expense added with ID: ${expenseId}`);

            // Step 2: Insert splitBy into Expense_SplitBy table
            await this.insertSplitByUsers(expenseId, splitBy);

            // Step 3: Insert associatedExpenseGroups into Expense_AssociatedExpenseGroups table
            await this.insertExpenseGroups(expenseId, associatedExpenseGroups);

            // Return the newly added expense
            const [newExpense] = await this.pool.query("SELECT * FROM Expenses WHERE Id = ?", [expenseId]);
            return newExpense;

        } catch (error) {
            console.error("Error adding expense", error);
            throw error;
        }
    }

    // Method to update an existing expense
    public async updateExpense(
        id: number,
        name?: string,
        description?: string,
        amount?: number,
        currency?: string,
        splitBy?: number[],
        associatedExpenseGroups?: number[]
    ) {
        try {
            const updates: string[] = [];
            const values: (string | number)[] = [];

            // Update basic fields in the Expenses table
            if (name) updates.push("Name = ?"), values.push(name);
            if (description) updates.push("Description = ?"), values.push(description);
            if (amount) updates.push("Amount = ?"), values.push(amount);
            if (currency) updates.push("Currency = ?"), values.push(currency);

            if (updates.length > 0) {
                const expenseUpdateQuery = `
                    UPDATE Expenses
                    SET ${updates.join(", ")}
                    WHERE Id = ?
                `;
                values.push(id);
                await this.pool.query(expenseUpdateQuery, values);
                console.log("Expense updated successfully.");
            }

            // Update splitBy in Expense_SplitBy table
            if (splitBy) {
                await this.pool.query("DELETE FROM Expense_SplitBy WHERE ExpenseId = ?", [id]);
                await this.insertSplitByUsers(id, splitBy);
            }

            // Update associatedExpenseGroups in Expense_AssociatedExpenseGroups table
            if (associatedExpenseGroups) {
                await this.pool.query("DELETE FROM Expense_AssociatedExpenseGroups WHERE ExpenseId = ?", [id]);
                await this.insertExpenseGroups(id, associatedExpenseGroups);
            }

            // Fetch and return the updated expense
            const [updatedExpense] = await this.pool.query("SELECT * FROM Expenses WHERE Id = ?", [id]);
            return updatedExpense;

        } catch (error) {
            console.error("Error updating Expense", error);
            throw error;
        }
    }

    // Method to delete an expense
    public async deleteExpense(id: number) {
        try {
            const query = "DELETE from Expenses WHERE id = ?";
            const [result, fields]: [any[], any] = await this.pool.query(query, [id]);
            console.log("Expense deleted successfully.");
        } catch (error) {
            console.error("Error deleting Expense", error);
            throw error;
        }
    }

    // Private method to handle the insertion of splitBy users
    private async insertSplitByUsers(expenseId: number, splitBy: number[]) {
        if (splitBy && splitBy.length > 0) {
            const splitByInsertQuery = "INSERT INTO Expense_SplitBy (ExpenseId, UserId) VALUES (?, ?)";
            for (const userId of splitBy) {
                const [userCheck]: [any[], any] = await this.pool.query("SELECT ID FROM User WHERE ID = ?", [userId]);
                if (userCheck.length > 0) {
                    await this.pool.query(splitByInsertQuery, [expenseId, userId]);
                } else {
                    console.error(`User with ID ${userId} does not exist. Skipping.`);
                }
            }
            console.log("Users added to Expense_SplitBy successfully.");
        }
    }

    // Private method to handle the insertion of associated expense groups
    private async insertExpenseGroups(expenseId: number, associatedExpenseGroups: number[]) {
        if (associatedExpenseGroups && associatedExpenseGroups.length > 0) {
            const expenseGroupInsertQuery = "INSERT INTO Expense_AssociatedExpenseGroups (ExpenseId, ExpenseGroupId) VALUES (?, ?)";
            for (const groupId of associatedExpenseGroups) {
                const [groupCheck]: [any[], any] = await this.pool.query("SELECT ID FROM ExpenseGroups WHERE ID = ?", [groupId]);
                if (groupCheck.length > 0) {
                    await this.pool.query(expenseGroupInsertQuery, [expenseId, groupId]);
                } else {
                    console.error(`Expense group with ID ${groupId} does not exist. Skipping.`);
                }
            }
            console.log("Expense groups added to Expense_AssociatedExpenseGroups successfully.");
        }
    }
}

// Export the service instance
const expenseService = new ExpenseService();
export default expenseService;