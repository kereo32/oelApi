import express from 'express';

import { getAllusers } from '../controllers/users';
import { isAuthenticated } from '../middlewares';

export default (router: express.Router) => {
  router.get('/users', isAuthenticated, getAllusers);
};
