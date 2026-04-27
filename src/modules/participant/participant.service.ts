// participant.service.ts
import { ParticipantRepository } from './participant.repository.js';
import { CreateParticipantDto, DeleteParticipantDto, ParticipantFilterDto, ParticipantResponseDto, UpdateParticipantDto } from './participant.dto.js';
import { BadRequestError } from '../../helper/app_error_helper.js';
import { uuidValidator } from '../../helper/model_helper.js';

class ParticipantService{
    private ParticipantRepo: ParticipantRepository = new ParticipantRepository();
    
    async findAllParticipants(filters: ParticipantFilterDto | null): Promise<ParticipantResponseDto[]>{
        const response = await this.ParticipantRepo.findAllParticipants(filters)

        return response.map(participant => ({
            id: participant.id,
            name: participant.name,
            isMandarin: participant.isMandarin as boolean,
            shio: {
                id: participant.shioId,
                indonesianShio: participant.indonesianShio,
                mandarinShio: participant.mandarinShio
            } as ParticipantResponseDto["shio"] | null
        }))
    }
    
    async createParticipant(req: CreateParticipantDto): Promise<ParticipantResponseDto> {
        await this.findParticipantByName(req.name);

        // Trimming Data
        req?.name && (req.name = req.name.trim());
        const response = await this.ParticipantRepo.createParticipant(req)

        return {
            id: response[0].id,
            name: response[0]?.name,
            isMandarin: response[0]?.isMandarin as boolean,
            shio: null
        }
    }

    async updateParticipant(req: UpdateParticipantDto): Promise<ParticipantResponseDto> {
        const { id, ...updateData } = req;
        
        await this.findParticipantById(id);
        updateData?.name && (updateData.name = updateData.name.trim());

        const response = await this.ParticipantRepo.updateParticipant(id, updateData)

        return {
            id: response[0].id,
            name: response[0]?.name,
            isMandarin: response[0]?.isMandarin as boolean,
            shio: null
        }
    }

    async deleteParticipant(req: DeleteParticipantDto): Promise<void> {
        const { id, ...existingParticipant } = await this.findParticipantById(req.id);
        await this.ParticipantRepo.deleteParticipant(id, existingParticipant);
        return;
    }

    private async findParticipantByName(name: string, id: string | null = null){
        const response = await this.ParticipantRepo.findAllParticipants({ name: name.trim().toLowerCase() });
        if(response.length > 0){
            if((!id) || id && response[0].id !== id){
                throw new BadRequestError("Participant with the same name already exists");
            }
        }
    }

    private async findParticipantById(id: string){
        uuidValidator(id);

        const response = await this.ParticipantRepo.findAllParticipants({ id: id })
        if(response.length === 0){
            throw new BadRequestError("Participant not found");
        }
        return response[0];
    }

    id?: string
    keyword?: string
    isMandarin?: boolean
    shioId?: string
    deleted?: boolean
}

export{
    ParticipantService
}