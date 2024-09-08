"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeExpenseGroup = exports.editExpenseGroup = exports.addNewExpenseGroup = void 0;
const joi_1 = __importDefault(require("joi"));
const ExpenseGroup_db_1 = require("../ExpenseGroup+db");
const ExpenseGroupScheme = joi_1.default.object({
    name: joi_1.default.string().min(2).required(),
    description: joi_1.default.string().optional(),
    addedUser: joi_1.default.number().required(),
    associatedMembers: joi_1.default.array().items(joi_1.default.string()).optional(),
    dateTime: joi_1.default.date().iso().required()
});
const addNewExpenseGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = ExpenseGroupScheme.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const { name, description, addedUser, associatedMembers, dateTime } = value;
    try {
        const expenseGroup = yield (0, ExpenseGroup_db_1.addExpenseGroup)(name, description, addedUser, associatedMembers, dateTime);
        res.json({ message: 'Expense Group created successfully', data: expenseGroup });
    }
    catch (err) {
        console.error("Error Adding Expens Group");
        throw (err);
    }
});
exports.addNewExpenseGroup = addNewExpenseGroup;
const editExpenseGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = ExpenseGroupScheme.validate(req.body);
    if (error) {
        throw (error);
    }
    const { name, description, addedUser, associatedMembers, dateTime } = value;
    try {
        const expenseGroup = yield (0, ExpenseGroup_db_1.updateExpenseGroup)(name, description, addedUser, associatedMembers, dateTime);
        res.json({ message: 'Expense Group updated successfully', data: expenseGroup });
    }
    catch (err) {
        console.error("Error updating Expense Group");
        throw (err);
    }
});
exports.editExpenseGroup = editExpenseGroup;
const removeExpenseGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteExpenseSchema = joi_1.default.number().integer().positive().required();
    const { error, value } = deleteExpenseSchema.validate(parseInt(req.params.id));
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const userId = value;
    try {
        const result = yield (0, ExpenseGroup_db_1.deleteExpenseGroup)(userId);
        res.json({ message: 'User deleted successfully', data: result });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
exports.removeExpenseGroup = removeExpenseGroup;
