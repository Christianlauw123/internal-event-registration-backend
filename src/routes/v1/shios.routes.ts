// shio.routes.ts
import express from 'express'
import { createShio, deleteShio, findAllShios, updateShio } from '../../modules/shios/shios.controller.js';

const shioRouter = express.Router();

shioRouter.get('/', findAllShios)
shioRouter.post('/', createShio)
shioRouter.put('/:id', updateShio)
shioRouter.delete('/:id', deleteShio)

export{
    shioRouter
}