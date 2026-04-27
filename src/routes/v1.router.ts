import express from 'express'
import { userRouter } from './v1/users.routes.js'
import { cityRouter } from './v1/cities.routes.js'
import { shioRouter } from './v1/shios.routes.js'
import { settingRouter } from './v1/setting.routes.js'
import { participantRouter } from './v1/participant.routes.js'
import { companyRouter } from './v1/company.routes.js'

const router = express.Router()

router.use('/users', userRouter)
router.use('/cities', cityRouter)
router.use('/shios', shioRouter)
router.use('/settings', settingRouter)
router.use('/participants', participantRouter)
router.use('/companies', companyRouter)

export {
    router as v1Router
}