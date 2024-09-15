import { Request, Response } from 'express';
import Joi from 'joi';
import expenseService from '../db.methods/Expense.db';

const expenseIDSchema = Joi.number().integer().positive().required()
const addExpenseSchema = Joi.object({
    name : Joi.string().min(2).required(),
    description : Joi.string().optional(),
    addedUser: Joi.number().integer().positive().required(),
    amount : Joi.number().positive().required(),
    currency : Joi.string().length(3).required(),
    splitBy : Joi.array().items(Joi.number()).optional(),
    associatedExpenseGroups : Joi.array().items(Joi.number()).optional()
});

const updateExpenseSchema = Joi.object({
    name : Joi.string().min(2).optional(),
    description : Joi.string().optional(),
    amount : Joi.number().positive().optional(),
    currency : Joi.string().length(3).optional(),
    splitBy : Joi.array().items(Joi.number()).optional(),
    associatedExpenseGroups : Joi.array().items(Joi.number()).optional()
});

export const addNewExpense = async (req: Request, res: Response) : Promise<any> => {
    const {error: bodyValidationError, value: bodyValue} = addExpenseSchema.validate(req.body);
    if (bodyValidationError){
        return res.status(400).send(bodyValidationError.details[0].message);
    }
    const {name, description, addedUser, amount, currency, splitBy, associatedExpenseGroups} = bodyValue;

    try{
        const expense = await expenseService.addExpense(
            name,
            description,
            addedUser,
            amount,
            currency,
            splitBy,
            associatedExpenseGroups
        );
        res.json({ message: 'Expense Group created successfully', data: expense });
    }catch(err){
        console.error("Error Adding Expense!!", err);
    }
}

export const editExpense = async (req: Request, res: Response) : Promise<any> => {
    const { error: IDerror, value : expenseID } = expenseIDSchema.validate(parseInt(req.params.id));
    if (IDerror) {
        return res.status(400).send(IDerror.details[0].message);  // Handle ID validation error
    }

    const {error: bodyValidationError, value: bodyValue} = updateExpenseSchema.validate(req.body);
    if (bodyValidationError){
        return res.status(400).send(bodyValidationError.details[0].message);
    }
    const name = bodyValue.name;
    const description = bodyValue.description;
    const amount = bodyValue.amount;
    const currency = bodyValue.currency;
    const splitBy = bodyValue.splitBy;
    const associatedExpenseGroups = bodyValue.associatedExpenseGroups;    

    try{
        const expense = await expenseService.updateExpense(
            expenseID,
            name,
            description,
            amount,
            currency,
            splitBy,
            associatedExpenseGroups
        );
        res.json({ message: 'Expense updated successfully', data: expense });
    }catch(error){
        console.error("Error updating Expense!!", error);
    }
}

export const removeExpense = async (req: Request, res: Response): Promise<any> => {
    const { error, value: expenseID } = expenseIDSchema.validate(parseInt(req.params.id));
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const result = await expenseService.deleteExpense(expenseID);
        res.json({ message: 'Expense deleted successfully', data: result });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

