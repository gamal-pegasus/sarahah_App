import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import express from "express";
import dbConnection from "./DB/db.connection.js";
import * as Modules from './modules/index.js'
import  {limiter} from "./middlewares/index.js";
const app = express();
app.use(express.json());
dbConnection();
const whitelist = process.env.WHITE_LISTED_ORIGINS;
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions));
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:5173"],
      imgSrc: ["'self'", "http://localhost:5173"],
    },
  },
  frameguard: { action: "deny" },
});
app.use(helmet());
const authLimitedRoutes = ["/user/signin", "/user/confirmation", "/user/resetPassword"];
app.use((req, res, next) => {
  if (authLimitedRoutes.includes(req.path)) return next();
  limiter(req, res, next);
});
app.use("/user", Modules.userController,Modules.authServicController);
app.use("/message", Modules.messageController);

// 404 handler
app.use((req,res,next)=>{
    res.status(404).json({
        message:"Router not found"
    })
});
// Error handling middleware
app.use(async (err, req, res, next) => {
  if (req.session && req.session.inTransaction()) {
    await req.session.abortTransaction();
    await req.session.endSession();
    req.session = null;
    console.log("the transaction is abort");
  }
  res.status(500).json({
    message: "Something broke!!",
    error: err.message,
    stack: err.stack,
  });
});

const port = process.env.PORT;
app.listen(port, () => console.log(`Server running on port ${port}`));
