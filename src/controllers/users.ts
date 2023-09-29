import express from 'express';

import { getUsers } from '../db/users';

export const getAllusers = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getUsers();
    return res.status(200).send(users).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
