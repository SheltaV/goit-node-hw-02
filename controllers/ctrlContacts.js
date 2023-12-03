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
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, ...filterParams } = req.query;
  const skip = (page - 1) * limit;
  const filter = { owner, ...filterParams };
  const result = await Contact.find(filter, "-createdAt -updatedAt", {skip, limit}).populate('owner', 'email subscription')
  console.log(result)
  res.json(result)
}

const getContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
    const result = await Contact.findOne({_id: contactId, owner});
    if (!result) {
      throw httpError(404, 'Not Found')
    }
    res.json(result)
}

const postContact = async (req, res) => {
  const { _id: owner } = req.user;
    const result = await Contact.create({...req.body, owner})
    res.status(201).json(result)
}

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
    const result = await Contact.findOneAndDelete({_id: contactId, owner});
      if (!result) {
        throw httpError(404, 'Not found')
    }
    res.json({Message: "Contact deleted"})
}

 const changeContact = async (req, res) => {
   const { contactId } = req.params;
   const { _id: owner } = req.user;
    const result = await Contact.findOneAndUpdate({_id: contactId, owner}, req.body);
    if (!result) {
      throw httpError(404, `Movie with id=${id} not found`)
    }
    res.json(result)
}

const updateFavorite = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body);
  if (!result) {
    throw HttpError(404, `Contact with id ${id} not found`);
  }
  res.json(result);
};

export default {
  schema, favoriteSchema,
  getAllContacts: ctrlWrapper(getAllContacts),
  getContact: ctrlWrapper(getContact),
  postContact: ctrlWrapper(postContact),
  deleteContact: ctrlWrapper(deleteContact),
  changeContact: ctrlWrapper(changeContact),
  updateFavorite: ctrlWrapper(updateFavorite)
}