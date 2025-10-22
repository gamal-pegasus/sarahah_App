import Joi from "joi"
import { isValidObjectId } from "mongoose"

function objectIdvalidation(value,helper){
    isValidObjectId(value)?value:helper.message('invalid object id') 
}
export const generalRules={
  password: Joi.string()  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_-])[A-Za-z\d@$!%*]{8,}$/).messages({
            "string.empty": "Password is required",
            "string.pattern.base":
              "Password must be 8+ chars with upper, lower, number & symbol",
          }),
  email: Joi.string()  .email({
     tlds: { allow: ["com"],},}).messages({
     "string.email": "Invalid email format","any.required": "Email is required"}),
_id:Joi.string().custom(objectIdvalidation)

}