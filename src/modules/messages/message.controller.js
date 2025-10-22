import { Router } from 'express'
import * as service from './service/message.service.js'
import * as Middleware from '../../middlewares/index.js'
 export const messageController=Router()
 messageController.use(Middleware.limiter);
 messageController.post('/sendMessage/:receiverId',service.sendMessageService)
 messageController.get('/getMessages',Middleware.authenticationMiddleware,service.getMessagesService)



