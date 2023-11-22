import express from 'express';

import { isValidId } from '../../middlewares/isValidId.js';
import { isEmptyBody } from '../../middlewares/isEmptyBody.js';
import { validateBody } from '../../decorators/validateBody.js';

import contactController from '../../controllers/ctrlContacts.js';

export const router = express.Router()

router.get('/', contactController.getAllContacts)

router.get('/:contactId', isValidId, contactController.getContact)

router.post('/', validateBody(contactController.schema), contactController.postContact)

router.delete('/:contactId', isValidId, contactController.deleteContact)

router.put('/:contactId', isEmptyBody, validateBody(contactController.schema), isValidId, contactController.changeContact)

router.patch('/:contactId/favorite', isValidId, validateBody(contactController.favoriteSchema), contactController.changeContact)