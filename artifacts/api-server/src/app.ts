import express, { type Express } from "express";
import cors from "cors";
import session from "express-session";
import pinoHttp from "pino-http";
import routes from "./api_routes/index.js";
import { logger } from "./lib/logger";

const app: Express = express();

// Trust the Replit proxy (HTTPS termination happens at the proxy layer)
app.set("trust proxy", 1);

app.use(
  (pinoHttp as any)({
    logger,
    serializers: {
      req(req: any) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: any) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// --- ملاحظة: لا تحذف أو تغير أي كود موجود لديك تحت هذا السطر ---

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

const sessionSecret =
  process.env.SESSION_SECRET ?? "insight-exam-secret-fallback";

// In Replit's proxy environment the connection is always HTTPS at the edge,
// so cookies must be SameSite=None + Secure to work inside the preview iframe.
const inReplit = !!process.env.REPL_ID;

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: inReplit || process.env.NODE_ENV === "production",
      sameSite: inReplit ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

app.use("/api", routes);

export default app;
