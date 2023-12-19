import express from 'express';

import { isValidId } from '../../middlewares/isValidId.js';
import { isEmptyBody } from '../../middlewares/isEmptyBody.js';
import authenticate from '../../middlewares/authenticate.js';
import { upload } from '../../middlewares/upload.js';
import contactController from '../../controllers/ctrlContacts.js';
import { validateBody } from '../../decorators/validateBody.js';

export const router = express.Router();

router.use(authenticate)

router.get('/', contactController.getAllContacts)

router.get('/:contactId', isValidId, contactController.getContact)

router.post('/', upload.single("avatar"), validateBody(contactController.schema), contactController.postContact)

router.delete('/:contactId', isValidId, contactController.deleteContact)

router.put('/:contactId', isEmptyBody, validateBody(contactController.schema), isValidId, contactController.changeContact)

router.patch('/:contactId/favorite', isValidId, validateBody(contactController.favoriteSchema), contactController.changeContact)