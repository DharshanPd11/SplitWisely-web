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
exports.delete_user = exports.updateUserDetails = exports.addNewUser = exports.getData = void 0;
const joi_1 = __importDefault(require("joi"));
const User_db_1 = __importDefault(require("../db.methods/User.db"));
const getData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield User_db_1.default.getUsers();
    console.log(result);
    res.json({ data: result });
});
exports.getData = getData;
const addNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const addUserSchema = joi_1.default.object({
        name: joi_1.default.string().min(2).required(),
        email: joi_1.default.string().email().required(),
        groups: joi_1.default.string().optional()
    });
    const { error, value } = addUserSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const { name, email, groups } = value;
    try {
        const userData = yield User_db_1.default.createUser(name, email, groups);
        res.json({ message: 'User created successfully', data: userData });
    }
    catch (err) {
        throw err;
    }
});
exports.addNewUser = addNewUser;
const updateUserSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).required(),
    email: joi_1.default.string().email().required(),
});
const updateUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const { name, email } = value;
    const userId = parseInt(req.params.id);
    try {
        const userData = yield User_db_1.default.updateUser(userId, name, email);
        res.json({ message: 'Data received', data: userData });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
exports.updateUserDetails = updateUserDetails;
const delete_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteUserSchema = joi_1.default.number().integer().positive().required();
    const { error, value } = deleteUserSchema.validate(parseInt(req.params.id));
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const userId = value;
    try {
        const result = yield User_db_1.default.deleteUser(userId);
        res.json({ message: 'User deleted successfully', data: result });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
exports.delete_user = delete_user;
