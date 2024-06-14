import { Router } from 'express'

const router = Router()

import { getAllJobs, createJob, getJob, updateJob, deleteJob, showStats } from '../controllers/jobController'
import { validateJobInput } from '../middleware/validationMiddleware'
import { checkForTestUser } from '../middleware/authMiddleware'

router
    .route('/')
    .get(getAllJobs)
    // @ts-ignore
    .post(checkForTestUser, validateJobInput, createJob)

router.route('/stats').get(showStats)

router
    .route('/:id')
    .get(getJob)
    // @ts-ignore
    .patch(checkForTestUser, validateJobInput, updateJob)
    // @ts-ignore
    .delete(checkForTestUser, deleteJob)

export default router
