import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import MongoStore from "rate-limit-mongo";
import { getIpCountry } from "../utils/index.js";

 
export const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: async function (req) {
    const { country_code } = await getIpCountry(req.headers["x-forwarded-for"] );
    if (country_code === "EG") return 20;
    return 10;
  },
  legacyHeaders: false,
  standardHeaders: true,
  handler: (req, res) => {
    console.log("Rate limiter hit");
    res.status(429).json({
      message:
        "Too many requests from this IP, please try again after 15 minutes",
    });
  },
  keyGenerator: (req) => {
 let ip = ipKeyGenerator(req.headers['x-forwarded-for'] || req.ip  );
    if (ip === "::1" || ip === "::56" || ip === "::ffff:127.0.0.1") {
      ip = "196.132.101.126";
    }
    return `ip:${ip}_${req.path}`;
  },
  requestPropertyName: "rateLimit",
  store: new MongoStore({
    uri: process.env.DB_URL_LOCAL,
    collectionName: "rateLimits",
    expireTimeMs: 10 * 60 * 1000,
  }),
});
  
export const registrationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  message: "Too many login attempts. Please try again after 5 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
    keyGenerator: (req) => {
 let ip = ipKeyGenerator(req.headers['x-forwarded-for'] || req.ip  );
    if (ip === "::1" || ip === "::56" || ip === "::ffff:127.0.0.1") {
      ip = "196.132.101.126";
    }
    return `ip:${ip}_${req.path}`;
  },
    store: new MongoStore({
    uri: process.env.DB_URL_LOCAL,
    collectionName: "rateLimits_registration",
    expireTimeMs: 5 * 60 * 1000, 
  }),
});
 
