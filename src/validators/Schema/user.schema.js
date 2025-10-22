import Joi from "joi";
import { GenderEnum } from "../../common/enums/user.enum.js";
import { generalRules } from "../../utils/index.js";
import { getRounds } from "bcrypt";
export const signupSchema = {
  body: Joi.object({
    firstName: Joi.string().alphanum().messages({
      "string.base": "First name must be a string",
      "string.alphanum": "First name must contain only letters and numbers",
      "any.required": "First name is required",
    }),
    lastName: Joi.string().min(3).max(10),
    email: generalRules.email,
    password: generalRules.password,
    gender: Joi.string().valid(...Object.values(GenderEnum)),
    age: Joi.number().greater(17).less(61),
    phoneNumber: Joi.string()
      .pattern(/^01[0125][0-9]{8}$/)
      .messages({
        "string.empty": "Phone number is required",
        "string.pattern.base": "Invalid Egyptian phone number",
      }),
  }).options({ presence: "required" }),
};
export const signinSchema = {
  body: Joi.object({
    email: generalRules.email.messages({
      "string.email": "Invalid Email Or Password",
    }),
    password: generalRules.password.messages({
      "string.empty": "Invalid Email Or Password",
      "string.pattern.base": "Invalid Email Or Password",
    }),
  }).options({ presence: "required" }),
};
export const updateSchema = {
  body: Joi.object({
    firstName: Joi.string().alphanum().messages({
      "string.base": "First name must be a string",
      "string.alphanum": "First name must contain only letters and numbers",
      "any.required": "First name is required",
    }),
    lastName: Joi.string().min(3).max(10),
    email: generalRules.email,
    gender: Joi.string().valid(...Object.values(GenderEnum)),
    age: Joi.number().greater(17).less(61),
    phoneNumber: Joi.string()
      .pattern(/^01[0125][0-9]{8}$/)
      .messages({
        "string.empty": "Phone number is required",
        "string.pattern.base": "Invalid Egyptian phone number",
      }),
  }),
};
export const forgotPasswordSchema = {
  body: Joi.object({
    email: generalRules.email,
  }),
};
export const confirmationSchema = {
  body: Joi.object({
    email: generalRules.email,
    otp: Joi.string().length(5).invalid().messages({
'string.length': "The one-time password  be 5 digits long",
'string.base': "The one-time password must be a string",
}),
  }),
};
export const resetPasswordSchema={
  body:Joi.object({
    password:generalRules.password,
    email:generalRules.email
  })
}
export const searchSchema={
  body:Joi.object({
    fullName:Joi.string().min(2).max(15)
  })
}
