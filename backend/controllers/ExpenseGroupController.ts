import { Request, Response } from 'express';
import Joi, { number } from 'joi';
import { deleteExpenseGroup, addExpenseGroup, updateExpenseGroup } from '../ExpenseGroup+db';

const ExpenseGroupScheme = Joi.object({
    name: Joi.string().min(2).required(),
    description: Joi.string().optional(),
    addedUser: Joi.number().required(),
    associatedMembers: Joi.array().items(Joi.string()).optional(),
    dateTime: Joi.date().iso().required()
});

const ExpenseGroupIDSchema = Joi.number().integer().positive().required();

export const addNewExpenseGroup = async (req: Request, res: Response): Promise<any> => {
    const { error, value } = ExpenseGroupScheme.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const { name, description, addedUser, associatedMembers, dateTime } = value;

    try {
        const expenseGroup = await addExpenseGroup(
            name,
            description,
            addedUser,
            associatedMembers,
            dateTime
        );
        res.json({ message: 'Expense Group created successfully', data: expenseGroup });
    }
    catch (err) {
        console.error("Error Adding Expens Group");
        throw (err);
    }
}

export const editExpenseGroup = async (req: Request, res: Response): Promise<any> => {
    const { error: bodyError, value } = ExpenseGroupScheme.validate(req.body);
    const { error: idError, value: ExpenseGroupId } = Joi.number().required().validate(req.params.id);

    // Handle any validation errors
    if (bodyError) {
        return res.status(400).send(bodyError.details[0].message);  // Handle body validation error
    }

    if (idError) {
        return res.status(400).send(idError.details[0].message);  // Handle ID validation error
    }

    const { name, description, addedUser, associatedMembers, dateTime } = value;
    try {
        const expenseGroup = await updateExpenseGroup(
            ExpenseGroupId,
            name,
            description,
            addedUser,
            associatedMembers,
            dateTime
        );
        res.json({ message: 'Expense Group updated successfully', data: expenseGroup });
    }
    catch (err) {
        console.error("Error updating Expense Group");
        throw (err);
    }
}

export const removeExpenseGroup = async (req: Request, res: Response): Promise<any> => {
    const { error, value } = ExpenseGroupIDSchema.validate(parseInt(req.params.id));
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const userId = value;
    try {
        const result = await deleteExpenseGroup(userId);
        res.json({ message: 'Expense Group deleted successfully', data: result });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}