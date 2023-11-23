import { isValidObjectId } from "mongoose"
import { httpError } from "../helpers/httpError.js"

export const isValidId = (req, res, next) => {
    const { contactId } = req.params;
    if (!isValidObjectId(contactId)) {
        return next(httpError(404, `${contactId} is not valid id`))
    }
    next();
}