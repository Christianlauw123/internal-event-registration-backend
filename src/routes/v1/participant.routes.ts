// participant.routes.ts
import express from 'express';
import { createParticipant, deleteParticipant, findAllParticipants, updateParticipant,  } from '../../modules/participant/participant.controller.js';

const participantRouter = express.Router();

participantRouter.get('/', findAllParticipants);
participantRouter.post('/', createParticipant);
participantRouter.put('/:id', updateParticipant);
participantRouter.delete('/:id', deleteParticipant);

export {
    participantRouter
}