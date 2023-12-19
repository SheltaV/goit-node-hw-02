import express from 'express';

import { validateBody } from '../../decorators/validateBody.js';
import authController from '../../controllers/ctrlUserAuth.js';
import authenticate from '../../middlewares/authenticate.js';
import { upload } from '../../middlewares/upload.js';

export const authRouter = express.Router();

authRouter.post('/register', validateBody(authController.userSignUpSchema), authController.signUp);

authRouter.get('/verify/:verificationToken', authController.verify);

authRouter.post('/verify', validateBody(authController.userEmailSchema), authController.resendVerify)

authRouter.post('/login', validateBody(authController.userSignInSchema), authController.signIn);

authRouter.get('/current', authenticate, authController.getCurrent);

authRouter.post('/logout', authenticate, authController.signOut);

authRouter.patch('/', authenticate, validateBody(authController.updateSubscriptionSchema), authController.updateSubscription);

authRouter.patch('/avatars', upload.single("avatar"), authenticate, authController.updateAvatar);