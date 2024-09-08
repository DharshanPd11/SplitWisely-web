import { error } from "console";

import pool from './database'; 

// Name              | varchar(100) | YES  |     | NULL    |                |
// | Description       | text         | YES  |     | NULL    |                |
// | AddedUser         | int(11)      | YES  | MUL | NULL    |                |
// | Members           | json         | YES  |     | NULL    |                |
// | AssociatedMembers | json         | YES  |     | NULL    |                |
// | DateTime 

export async function addExpenseGroup(
    name:string,
    description:string, 
    addedUser: number, 
    associatedExpenseGroups:string[],
    datetime:string ) {
    const associatedMembersJson = JSON.stringify(associatedExpenseGroups);

    try{
        const [result, fields] : [any[], any] = await pool.query("INSERT into ExpenseGroups (Name, Description, AddedUser, AssociatedMembers, DateTime ) VALUES (?,?,?,?,?)", 
        [
            name, description ,addedUser, associatedMembersJson, datetime
        ]);
        console.log(associatedMembersJson);
        console.log(result);
    }
    catch (error){
        console.error("Error adding Expense Group !", error);
        throw(error);
    }
}

export async function updateExpenseGroup(
    id: number,
    name?:string,
    description?:string, 
    addedUser?: number, 
    associatedExpenseGroups?:[number],
    datetime?:string ) {
        
    try{
        const updates : string[] = []
        const values: any[] = []
        
        if (name){
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
        if (associatedExpenseGroups) {
            updates.push("AssociatedMembers = ?");
            values.push(associatedExpenseGroups);
        }
        if (datetime) {
            updates.push("DateTime = ?");
            values.push(datetime);
        }

        if (updates.length === 0) {
            throw new Error("No values provided for update.");
        }

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
    catch (error){
        console.error("Error adding Expense Group !", error);
        throw(error);
    }
}

export async function deleteExpenseGroup(id: number){
    try{
        const query = `
        DELETE from ExpenseGroups
        WHERE id = ?
        `;
        const [result, fields]: [any[], any] = await pool.query(query, [id]);
    } catch {
        console.error("Error deleting Expense Group");
        throw(error);
    }
}