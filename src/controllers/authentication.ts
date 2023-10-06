import express, { response } from 'express';
import { getUserByEmail, createUser, getUserBySessionToken } from '../db/users';
import { random, authentication } from '../helpers';

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.sendStatus(400);
    }
    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
    if (!user) {
      return res.sendStatus(400);
    }
    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== expectedHash) {
      return res.sendStatus(400);
    }
    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString());
    await user.save();

    res.cookie('sessionToken', user.authentication.sessionToken, { domain: 'localhost', path: '/', httpOnly: true, sameSite: 'strict' });

    return res.status(200).send(user).end();
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const findUserBySessionId = async (req: express.Request, res: express.Response) => {
  try {
    const { sessionToken } = req.body;
    if (!sessionToken) {
      return res.sendStatus(400);
    }
    const user = await getUserBySessionToken(sessionToken);
    if (!user) {
      return res.sendStatus(400);
    }
    return res.status(200).send(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { username, email, password } = req.body;
    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();
    const user = await createUser({
      username,
      email,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });
    return res.status(200).send(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
