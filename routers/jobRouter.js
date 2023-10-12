import { Router } from "express";

const router = Router();

import {
    getAllJobs,
    createJob,
    getJob,
    updateJob,
    deleteJob,
    showStats,
} from "../controllers/jobController.js";
import { validateJobInput } from "../middleware/validationMiddleware.js";
import { checkForTestUser } from "../middleware/authMiddleware.js";

router
    .route("/")
    .get(getAllJobs)
    .post(checkForTestUser, validateJobInput, createJob);

router.route("/stats").get(showStats);

router
    .route("/:id")
    .get(getJob)
    .patch(checkForTestUser, validateJobInput, updateJob)
    .delete(checkForTestUser, deleteJob);

export default router;
