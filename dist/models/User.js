"use strict";
class User {
    constructor(name, email) {
        this.associatedExpenseGroups = [];
        this.id = ++User.lastId;
        this.name = name;
        this.email = email;
    }
    static addUser(name, email) {
        const newUser = new User(name, email);
        User.usersList.push(newUser);
        return "User added";
    }
    static getUsersList() {
        return User.usersList;
    }
    static getUser(id) {
        for (const user of User.usersList) {
            if (user.id === id) {
                return user;
            }
        }
        return undefined;
    }
}
User.lastId = 0;
User.usersList = [];
