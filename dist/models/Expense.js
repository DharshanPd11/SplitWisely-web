"use strict";
class Expense {
    constructor(id, name, createdBy, amount, currency, splitBy, associatedExpenseGroup) {
        this.id = ++Expense.lastID;
        this.name = name;
        this.createdBy = createdBy;
        this.amount = amount;
        this.currency = currency;
        this.splitBy = splitBy;
        this.associatedExpenseGroup = associatedExpenseGroup;
    }
    getName() {
        return this.name;
    }
    setName(newName) {
        this.name = newName;
    }
    getAmount() {
        return this.currency + this.amount;
    }
    setAmount(newAmount) {
        this.amount = newAmount;
    }
    getCurrency() {
        return this.currency;
    }
    setCurrency(newCurrency) {
        this.currency = newCurrency;
    }
    addSplitMember(userList) {
        for (const user of userList) {
            this.splitBy.push(user);
        }
        this.splitBy.push;
    }
    getSplitMembers() {
        return this.splitBy;
    }
    getExpenseGroup() {
        return this.associatedExpenseGroup;
    }
    setExpenseGroup(newGroup) {
        this.associatedExpenseGroup = newGroup;
    }
}
Expense.lastID = 0;
