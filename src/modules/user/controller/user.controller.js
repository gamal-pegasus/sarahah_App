import { Router } from "express";
import * as service from "../service/user.service.js";
import * as Middleware from "../../../middlewares/index.js";
import * as validation from "../../../validators/Schema/user.schema.js";
export const userController = Router();
userController.post(
  "/signin",
  Middleware.validationMiddleware(validation.signinSchema),
  Middleware.registrationLimiter,
  service.signinService
);
userController.post(
  "/confirmation",
  Middleware.validationMiddleware(validation.confirmationSchema),
  Middleware.registrationLimiter,
  service.confirmationByEmailService
);
userController.post(
  "/resetPassword",
  Middleware.validationMiddleware(validation.resetPasswordSchema),
  Middleware.registrationLimiter,
  service.resetPasswordService
);



userController.post(
  "/signup",
  Middleware.validationMiddleware(validation.signupSchema),
  service.signupService
);
userController.post(
  "/forgotPassword",
  Middleware.validationMiddleware(validation.forgotPasswordSchema),
  service.forgotPasswordService
);
userController.get(
  "/search",
  Middleware.validationMiddleware(validation.searchSchema),
  service.search
);

userController.post("/social-login", service.socialLoginService);
