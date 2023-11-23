import express from 'express';

// import { isEmptyBody } from '../../middlewares/isEmptyBody.js';
import { validateBody } from '../../decorators/validateBody.js';

import authController from '../../controllers/ctrlUserAuth.js';

export const authRouter = express.Router();

authRouter.post('/signup', validateBody(authController.userSignUpSchema), authController.signUp);

authRouter.post('/signin', validateBody(authController.userSignInSchema), authController.signIn);