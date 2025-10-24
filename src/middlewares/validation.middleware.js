const reqKeys = ["body", "headers", "params", "query"];
export const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const validationError = [];
    for (let key of reqKeys) {
      if (schema[key]) {
        const { error } = schema[key].validate(req[key], { abortEarly: false });
        if (error) {
          console.log("validation error", error.details);
          validationError.push(...error.details);
        }
      }
    }
    if (validationError.length) {
      return res
        .status(400)
        .json({ message: "validation failed", error: validationError });
    }
    next();
  };
};

