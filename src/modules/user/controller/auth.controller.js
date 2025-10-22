import { Router } from "express";
import * as authServic from "../service/auth.service.js";
import * as Middleware from "../../../middlewares/index.js";
import { privilleges } from "../../../common/enums/user.enum.js";
import * as validation from "../../../validators/Schema/user.schema.js";
export const authServicController = Router();

authServicController.put(
  "/updated",
  Middleware.authenticationMiddleware,
  Middleware.validationMiddleware(validation.updateSchema),
  authServic.updateService
);
authServicController.delete(
  "/delete",
  Middleware.authenticationMiddleware,
  Middleware.authorization([...privilleges.USER]),
  authServic.deleteService
);

authServicController.post(
  "/logout",
  Middleware.authenticationMiddleware,
  authServic.logoutService
);
authServicController.post(
  "/upload-profile",
  Middleware.authenticationMiddleware,
  Middleware.hostUpload().single("profile"),
  authServic.UploadProfileService
);
authServicController.delete(
  "/delete-profile",
  Middleware.authenticationMiddleware,
  Middleware.hostUpload().single("profile"),
  authServic.deleteProfileService
);
