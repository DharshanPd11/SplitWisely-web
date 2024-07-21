class ExpenseGroup {

    private static lastId = 0;

     id: number;
     name: string;
     createdBy: User;
     members: User[];
     expenses: Expense[];
  
    constructor(name: string, createdBy: User, members: User[] = [], expenses: Expense[] = []) {
      this.id = ++ExpenseGroup.lastId;
      this.name = name;
      this.createdBy = createdBy;
      this.members = members;
      this.expenses = expenses;
    }
  
    getExpenseID(id: number): any {
        for (let index = 0; index < this.expenses.length; index++) {
            const expense = this.expenses[index];
            if (expense.id == id) {
                return expense
            }
        }
        return "No such expense with expense id "+id+".";
    }

    addExpense(newExpense: Expense): void {
      this.expenses.push(newExpense);
    }

    removeExpense(expenseID: number): void {
        for (let index = 0; index < this.expenses.length; index++) {
            const expense = this.expenses[index];
            if (expense.id == expenseID) {
                this.expenses.splice(index);
            }
        }
    }

    addMember(newMember : User): void {
        this.members.push(newMember);
    }

    removeMember(id : number): string {
        for (let index = 0; index < this.members.length; index++) {
            const member = this.members[index];
            if (member.id === id) {
                this.members.splice(index);
                return "Success";
            }
        }
        return "Remove member failure"
    }
  }
   
  