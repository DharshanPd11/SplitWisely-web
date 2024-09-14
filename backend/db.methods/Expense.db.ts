import { stringify } from 'querystring';
import pool from './User.db';
import { Console, error } from "console";

export async function addExpense(
    name: string,
    description: string,
    addedUser: number,
    amount: number,
    currency: string,
    splitBy: string[],
    associatedExpenseGroups: string[]) {

    const splitByJSON = JSON.stringify(splitBy);
    const associatedExpenseGroupsJSON = JSON.stringify(associatedExpenseGroups);

    try {
        const [result, fields]: [any[], any] = await pool.query("INSERT INTO Expenses (Name, Description, AddedUser, Amount, Currency, SplitBy, AssociatedExpenseGroups) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                name, description, addedUser, amount, currency, splitByJSON, associatedExpenseGroupsJSON
            ]);
        console.log("Query Success! " + name + " Expense Added");
    } catch (error) {
        console.error("Error adding Exoense ", error);
    }
}

export async function updateExpense(
    id: number,
    name?: string,
    description?: string,
    amount?: number,
    currency?: string,
    splitBy?: string[],
    associatedExpenseGroups?: string[]) {
    try{
        const updates: string[] = [];
        const values: string[] = [];

        if (name){
            updates.push("Name = ?");
            values.push(name);
        }
        if (description){
            updates.push("Description = ?");
            values.push(description); 
        }
        if (amount){
            const amountJSON = JSON.stringify(amount);
            updates.push("Amount = ?");
            values.push(amountJSON);
        }
        if (currency){
            updates.push("Currency = ?");
            values.push(currency);
        }
        if (splitBy){
            const splitByJSON = JSON.stringify(splitBy)
            updates.push("SplitBy = ?");
            values.push(splitByJSON);
        }
        if (associatedExpenseGroups){
            const associatedExpenseGroupsJSON = JSON.stringify(associatedExpenseGroups)
            updates.push("AssociatedExpenseGroups = ?");
            values.push(associatedExpenseGroupsJSON);
        }

        if (updates.length === 0){
            console.log("No values provided for update.");
            return
        }
        const expenseID = JSON.stringify(id);
        values.push(expenseID);

        const expenseUpdateQuery = `
            UPDATE Expenses
            SET ${updates.join(", ")}
            WHERE id = ? 
        `;
        const [result, fields]:[any[], any] = await pool.query(expenseUpdateQuery, values);
        console.log("Expense Updated successful:", result);
        return result
        
    }catch(error){
        console.error("Error updating Expense ", error);
    }
}

export async function deleteExpense(id: number) {
    try {
        const query = `
        DELETE from Expenses
        WHERE id = ?
        `;
        const [result, fields]: [any[], any] = await pool.query(query, [id]);
    } catch {
        console.error("Error deleting Expense (Expense.db)", error);
        throw (error);
    }
}