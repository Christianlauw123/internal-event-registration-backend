// shio.service.ts
// Brain Logic (Middle Man) - Controller -> (MM) -> Repository
import { BadRequestError } from "../../helper/app_error_helper.js";
import { uuidValidator } from "../../helper/model_helper.js";
import { CreateShioDto, DeleteShioDto, UpdateShioDto, ShioResponseDto, ShioFilterDto } from "./shios.dto.js";
import { ShioRepository } from "./shios.repository.js";

class ShioService{
    private ShioRepo: ShioRepository = new ShioRepository();
    
    async findAllShios(filters: ShioFilterDto | null): Promise<ShioResponseDto[]>{
        const response = await this.ShioRepo.findAllShios(filters)

        return response.map(Shio => ({
            id: Shio.id,
            indonesianShio: Shio.indonesianShio,
            mandarinShio: Shio.mandarinShio,
        }))
    }
    
    async createShio(req: CreateShioDto): Promise<ShioResponseDto> {
        if (!req.indonesianShio && !req.mandarinShio){
            throw new BadRequestError("Indonesian Shio and Mandarin Shio are required");
        }

        await this.findShioByName(req.indonesianShio.trim());
        await this.findShioByName(req.mandarinShio.trim());

        // Trimming Data
        req?.indonesianShio && (req.indonesianShio = req.indonesianShio.trim());
        req?.mandarinShio && (req.mandarinShio = req.mandarinShio.trim());

        const response = await this.ShioRepo.createShio(req)

        return {
            id: response[0].id,
            indonesianShio: response[0].indonesianShio,
            mandarinShio: response[0].mandarinShio,
        }
    }

    async updateShio(req: UpdateShioDto): Promise<ShioResponseDto> {
        if (!req.indonesianShio && !req.mandarinShio){
            throw new BadRequestError("Indonesian Shio and Mandarin Shio are required");
        }

        const { id, ...updateData } = req;
        
        await this.findShioById(id);
        // Trimming Data
        updateData?.indonesianShio && (updateData.indonesianShio = updateData.indonesianShio.trim());
        updateData?.mandarinShio && (updateData.mandarinShio = updateData.mandarinShio.trim());

        const response = await this.ShioRepo.updateShio(id, updateData)

        return {
            id: response[0].id,
            indonesianShio: response[0].indonesianShio,
            mandarinShio: response[0].mandarinShio,
        }
    }

    async deleteShio(req: DeleteShioDto): Promise<void> {
        const { id, ...existingShio } = await this.findShioById(req.id);
        await this.ShioRepo.deleteShio(id, existingShio);
        return;
    }

    private async findShioByName(name: string){
        const response = await this.ShioRepo.findAllShios({ keyword: name.trim() })
        if(response.length > 0){
            throw new BadRequestError("Shio with the same name already exists");
        }
    }

    private async findShioById(id: string){
      uuidValidator(id);

      const response = await this.ShioRepo.findAllShios({ id: id })
      if(response.length === 0){
          throw new BadRequestError("Shio not found");
      }

      return response[0];
    }
}

export{
    ShioService
}