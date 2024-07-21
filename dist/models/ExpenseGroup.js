"use strict";
class ExpenseGroup {
    constructor(name, createdBy, members = [], expenses = []) {
        this.id = ++ExpenseGroup.lastId;
        this.name = name;
        this.createdBy = createdBy;
        this.members = members;
        this.expenses = expenses;
    }
    getExpenseID(id) {
        for (let index = 0; index < this.expenses.length; index++) {
            const expense = this.expenses[index];
            if (expense.id == id) {
                return expense;
            }
        }
        return "No such expense with expense id " + id + ".";
    }
    addExpense(newExpense) {
        this.expenses.push(newExpense);
    }
    removeExpense(expenseID) {
        for (let index = 0; index < this.expenses.length; index++) {
            const expense = this.expenses[index];
            if (expense.id == expenseID) {
                this.expenses.splice(index);
            }
        }
    }
    addMember(newMember) {
        this.members.push(newMember);
    }
    removeMember(id) {
        for (let index = 0; index < this.members.length; index++) {
            const member = this.members[index];
            if (member.id === id) {
                this.members.splice(index);
                return "Success";
            }
        }
        return "Remove member failure";
    }
}
ExpenseGroup.lastId = 0;
