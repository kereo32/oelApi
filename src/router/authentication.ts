import express from 'express';

import { login, register, findUserBySessionId } from '../controllers/authentication';

export default (router: express.Router) => {
  router.post('/auth/register', register);
  router.post('/auth/login', login);
  router.post('/auth/findUserBySessionId', findUserBySessionId);
};
