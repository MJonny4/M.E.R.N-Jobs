import { Router } from 'express'
import { getApplicationStats, getCurrentUser, updateUser } from '../controllers/userController'
import { validateUpdateUserInput } from '../middleware/validationMiddleware'
import { authorizePermissions, checkForTestUser } from '../middleware/authMiddleware'
import upload from '../middleware/multerMiddleware'

const router: Router = Router()

//@ts-ignore
router.get('/current-user', getCurrentUser)

//@ts-ignore
router.get('/admin/app-stats', authorizePermissions('admin'), getApplicationStats)
router.patch(
    '/update-user',

    //@ts-ignore
    checkForTestUser,
    upload.single('avatar'),
    validateUpdateUserInput,
    updateUser,
)

export default router
