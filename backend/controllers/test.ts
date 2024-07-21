import { Request, Response } from 'express';
import {createUser, getUsers} from '../database';

export const  getData = async (req: Request, res: Response): Promise<any> => {
  const result = await getUsers()
  console.log(result);
  res.json({ data: result });
};

export const postData = (req: Request, res: Response): void => {
  const receivedData = req.body;
  res.json({ message: 'Data received', data: receivedData });
};

export const addNewUser = async (req: Request, res: Response): Promise<any> => {
  const {name, email, groups} = req.body;
  const user = await createUser(name,email,groups) 
  res.json({ message: 'Data received', data: user });
};