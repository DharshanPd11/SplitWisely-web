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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewUser = exports.postData = exports.getData = void 0;
const database_1 = require("../database");
const getData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, database_1.getUsers)();
    console.log(result);
    res.json({ data: result });
});
exports.getData = getData;
const postData = (req, res) => {
    const receivedData = req.body;
    res.json({ message: 'Data received', data: receivedData });
};
exports.postData = postData;
const addNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, groups } = req.body;
    const user = yield (0, database_1.createUser)(name, email, groups);
    res.json({ message: 'Data received', data: user });
});
exports.addNewUser = addNewUser;
