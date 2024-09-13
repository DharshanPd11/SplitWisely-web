class Expense {
    static lastID = 0;

    id: number;
    name: string;
    createdBy: User;
    amount: number;
    currency: string;
    splitBy: User[];
    associatedExpenseGroup: ExpenseGroup;

    constructor(id: number, name: string, createdBy: User, amount: number, currency: string, splitBy: User[], associatedExpenseGroup: ExpenseGroup) {
        this.id = ++Expense.lastID;
        this.name = name;
        this.createdBy = createdBy;
        this.amount = amount;
        this.currency = currency;
        this.splitBy = splitBy;
        this.associatedExpenseGroup = associatedExpenseGroup;
    }

    getName(): string {
        return this.name;
    }
    setName(newName: string) {
        this.name = newName;
    }

    getAmount(): any {
        return this.currency + this.amount;
    }
    setAmount(newAmount: number): void {
        this.amount = newAmount;
    }

    getCurrency(): string {
        return this.currency;
    }
    setCurrency(newCurrency: string) {
        this.currency = newCurrency;
    }

    addSplitMember(userList: User[]) {
        for (const user of userList) {
            this.splitBy.push(user);
        }
        this.splitBy.push
    }
    getSplitMembers(): User[] {
        return this.splitBy;
    }

    getExpenseGroup(): ExpenseGroup {
        return this.associatedExpenseGroup;
    }
    setExpenseGroup(newGroup: ExpenseGroup): void {
        this.associatedExpenseGroup = newGroup;
    }

}