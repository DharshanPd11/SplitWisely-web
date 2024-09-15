import { error } from "console";
import dbManager from "./DatabasePoolManager.db";

const pool = dbManager.getPool();

class ExpenseGroupService {
    private pool = dbManager.getPool();
    public async addExpenseGroup(
        name: string,
        description: string,
        addedUser: number,
        associatedMembers: string[],
        datetime: string) {
        const associatedMembersJson = JSON.stringify(associatedMembers);

        try {
            const [result, fields]: [any[], any] = await pool.query("INSERT into ExpenseGroups (Name, Description, AddedUser, AssociatedMembers, DateTime ) VALUES (?,?,?,?,?)",
                [
                    name, description, addedUser, associatedMembersJson, datetime
                ]);
            console.log(associatedMembersJson);
            console.log(result);
        }
        catch (error) {
            console.error("Error adding Expense Group !", error);
            throw (error);
        }
    }

    public async updateExpenseGroup(
        id: number,
        name?: string,
        description?: string,
        addedUser?: number,
        associatedMembers?: [number],
        datetime?: string) {

        try {
            const updates: string[] = []
            const values: any[] = []

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
            const [result, fields]: [any[], any] = await pool.query(query, values);

            console.log("Update successful:", result);
            return result;
        }
        catch (error) {
            console.error("Error adding Expense Group !", error);
            throw (error);
        }
    }

    public async deleteExpenseGroup(id: number) {
        try {
            const query = `
        DELETE from ExpenseGroups
        WHERE id = ?
        `;
            const [result, fields]: [any[], any] = await pool.query(query, [id]);
        } catch {
            console.error("Error deleting Expense Group");
            throw (error);
        }
    }
}

// Export the service instance
const expenseGroupService = new ExpenseGroupService();
export default expenseGroupService;