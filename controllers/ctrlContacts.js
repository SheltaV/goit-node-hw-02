import Joi from 'joi';

import { Contact } from '../models/Contact.js';
import { httpError } from '../helpers/httpError.js';
import { ctrlWrapper } from '../decorators/ctrlWrapper.js';

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite:Joi.boolean(),
})

const favoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
})

const getAllContacts = async (req, res) => {
  const result = await Contact.find()
  res.json(result)
}

const getContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
      throw httpError(404, 'Not Found')
    }
    res.json(result)
}

const postContact = async (req, res) => {
    const result = await Contact.create(req.body)
    res.status(201).json(result)
}

const deleteContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
      if (!result) {
        throw httpError(404, 'Not found')
    }
    res.json({Message: "Contact deleted"})
}

 const changeContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body);
    if (!result) {
      throw httpError(404, `Movie with id=${id} not found`)
    }
    res.json(result)
}

export default {
  schema, favoriteSchema,
  getAllContacts: ctrlWrapper(getAllContacts),
  getContact: ctrlWrapper(getContact),
  postContact: ctrlWrapper(postContact),
  deleteContact: ctrlWrapper(deleteContact),
  changeContact: ctrlWrapper(changeContact),
}