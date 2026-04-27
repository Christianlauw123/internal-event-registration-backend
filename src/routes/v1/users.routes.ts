import express from 'express'
import { createUser, deleteUser, findAllUsers, updateUser } from '../../modules/users/users.controller.js';

const userRouter = express.Router();

userRouter.get('/', findAllUsers)
userRouter.post('/', createUser)
userRouter.put('/:id', updateUser)
userRouter.delete('/:id', deleteUser)

export{
    userRouter
}