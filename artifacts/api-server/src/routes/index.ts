import { Router, type IRouter } from "express";
import healthRouter from "./health";
import coursesRouter from "./courses";
import questionsRouter from "./questions";
import analyticsRouter from "./analytics";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(coursesRouter);
router.use(questionsRouter);
router.use(analyticsRouter);
router.use(adminRouter);

export default router;
