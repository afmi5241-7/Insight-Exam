// @ts-nocheck
import { Router, type IRouter } from "express.js";
import healthRouter from "./health.js";
import coursesRouter from "./courses.js";
import questionsRouter from "./questions.js";
import analyticsRouter from "./analytics.js";
import adminRouter from "./admin.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(coursesRouter);
router.use(questionsRouter);
router.use(analyticsRouter);
router.use(adminRouter);

export default router;
