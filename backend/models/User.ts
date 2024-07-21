class User {
    private static lastId = 0;
    private static usersList: User[] = [];
    id: number;
    name: string;
    email: string;
    associatedExpenseGroups: ExpenseGroup[] = [];

    constructor(name: string, email: string) {
      this.id = ++User.lastId;
      this.name = name;
      this.email = email;
    }
  
    static addUser(name: string, email: string): string {
      const newUser = new User(name, email);
      User.usersList.push(newUser);
      return "User added";
    }
  
    static getUsersList(): User[] {
      return User.usersList;
    }
  
    static getUser(id: number): User | undefined {
      for (const user of User.usersList) {
        if (user.id === id) {
          return user;
        }
      }
      return undefined;
    }
  }