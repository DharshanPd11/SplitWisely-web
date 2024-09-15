import { Request, Response } from 'express';
import Joi from 'joi';
import userService from '../db.methods/User.db';

export const getData = async (req: Request, res: Response): Promise<any> => {
  const result = await userService.getUsers()
  console.log(result);
  res.json({ data: result });
};

export const addNewUser = async (req: Request, res: Response): Promise<any> => {
  const addUserSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    groups: Joi.string().optional()
  });

  const { error, value } = addUserSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { name, email, groups } = value;
  try {
    const userData = await userService.createUser(name, email, groups);
    res.json({ message: 'User created successfully', data: userData });
  } catch (err) {
    throw err;
  }
};

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
});

export const updateUserDetails = async (req: Request, res: Response): Promise<any> => {

  const { error, value } = updateUserSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { name, email } = value;
  const userId = parseInt(req.params.id);

  try {
    const userData = await userService.updateUser(userId, name, email);
    res.json({ message: 'Data received', data: userData });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const delete_user = async (req: Request, res: Response): Promise<any> => {
  const deleteUserSchema = Joi.number().integer().positive().required();
  const { error, value } = deleteUserSchema.validate(parseInt(req.params.id));
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const userId = value;
  try {
    const result = await userService.deleteUser(userId);
    res.json({ message: 'User deleted successfully', data: result });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};