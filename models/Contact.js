import { Schema, model } from "mongoose";
import { preUpdate, saveHandleError } from "./hooks.js";

const contactSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
})

contactSchema.post('save', saveHandleError)

contactSchema.pre('findOneAndUpdate', preUpdate)

contactSchema.post('findOneAndUpdate', saveHandleError)

export const Contact = model("contact", contactSchema)