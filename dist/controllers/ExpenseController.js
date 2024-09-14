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
exports.removeExpense = exports.editExpense = exports.addNewExpense = void 0;
const joi_1 = __importDefault(require("joi"));
const Expense_db_1 = require("../db.methods/Expense.db");
const expenseIDSchema = joi_1.default.number().integer().positive().required();
const addExpenseSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).required(),
    description: joi_1.default.string().optional(),
    addedUser: joi_1.default.number().integer().positive().required(),
    amount: joi_1.default.number().positive().required(),
    currency: joi_1.default.string().length(3).required(),
    splitBy: joi_1.default.array().items(joi_1.default.string()).optional(),
    associatedExpenseGroups: joi_1.default.array().items(joi_1.default.string()).optional()
});
const updateExpenseSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).optional(),
    description: joi_1.default.string().optional(),
    amount: joi_1.default.number().positive().optional(),
    currency: joi_1.default.string().length(3).optional(),
    splitBy: joi_1.default.array().items(joi_1.default.string()).optional(),
    associatedExpenseGroups: joi_1.default.array().items(joi_1.default.string()).optional()
});
const addNewExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error: bodyValidationError, value: bodyValue } = addExpenseSchema.validate(req.body);
    if (bodyValidationError) {
        return res.status(400).send(bodyValidationError.details[0].message);
    }
    const { name, description, addedUser, amount, currency, splitBy, associatedExpenseGroups } = bodyValue;
    try {
        const expense = yield (0, Expense_db_1.addExpense)(name, description, addedUser, amount, currency, splitBy, associatedExpenseGroups);
        res.json({ message: 'Expense Group created successfully', data: expense });
    }
    catch (err) {
        console.error("Error Adding Expense!!", err);
    }
});
exports.addNewExpense = addNewExpense;
const editExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error: IDerror, value: expenseID } = expenseIDSchema.validate(parseInt(req.params.id));
    if (IDerror) {
        return res.status(400).send(IDerror.details[0].message); // Handle ID validation error
    }
    const { error: bodyValidationError, value: bodyValue } = updateExpenseSchema.validate(req.body);
    if (bodyValidationError) {
        return res.status(400).send(bodyValidationError.details[0].message);
    }
    const name = bodyValue.name;
    const description = bodyValue.description;
    const amount = bodyValue.amount;
    const currency = bodyValue.currency;
    const splitBy = bodyValue.splitBy;
    const associatedExpenseGroups = bodyValue.associatedExpenseGroups;
    try {
        const expense = yield (0, Expense_db_1.updateExpense)(expenseID, name, description, amount, currency, splitBy, associatedExpenseGroups);
        res.json({ message: 'Expense updated successfully', data: expense });
    }
    catch (error) {
        console.error("Error updating Expense!!", error);
    }
});
exports.editExpense = editExpense;
const removeExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value: expenseID } = expenseIDSchema.validate(parseInt(req.params.id));
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const result = yield (0, Expense_db_1.deleteExpense)(expenseID);
        res.json({ message: 'Expense deleted successfully', data: result });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
exports.removeExpense = removeExpense;
