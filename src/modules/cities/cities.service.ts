// Brain Logic (Middle Man) - Controller -> (MM) -> Repository
// city.service.ts
import { BadRequestError } from "../../helper/app_error_helper.js";
import { uuidValidator } from "../../helper/model_helper.js";
import { CreateCityDto, DeleteCityDto, UpdateCityDto, CityResponseDto, CityFilterDto } from "./cities.dto.js";
import { CityRepository } from "./cities.repository.js";

class CityService{
    private CityRepo: CityRepository = new CityRepository();
    
    async findAllCities(filters: CityFilterDto | null): Promise<CityResponseDto[]>{
        const response = await this.CityRepo.findAllCities(filters)

        return response.map(city => ({
            id: city.id,
            name: city.name,
        }))
    }
    
    async createCity(req: CreateCityDto): Promise<CityResponseDto> {
        await this.findCityByName(req.name.trim());

        // Trimming Data
        req?.name && (req.name = req.name.trim());

        const response = await this.CityRepo.createCity(req)

        return {
            id: response[0].id,
            name: response[0].name,
        }
    }

    async updateCity(req: UpdateCityDto): Promise<CityResponseDto> {
        const { id, ...updateData } = req;
        
        await this.findCityById(id);
        updateData?.name && await this.findCityByName(updateData.name.trim(), id);
        
        // Trimming Data
        updateData?.name && (updateData.name = updateData.name.trim());

        const response = await this.CityRepo.updateCity(id, updateData)

        return {
            id: response[0].id,
            name: response[0].name,
        }
    }

    async deleteCity(req: DeleteCityDto): Promise<void> {
        const { id, ...existingCity } = await this.findCityById(req.id);
        await this.CityRepo.deleteCity(id, existingCity);
        return;
    }

    private async findCityByName(name: string, id: string | null = null){
        const response = await this.CityRepo.findAllCities({ name: name.trim().toLowerCase() });
        if(response.length > 0){
            if((!id) || id && response[0].id !== id){
                throw new BadRequestError("City with the same name already exists");
            }
        }
    }

    private async findCityById(id: string){
      uuidValidator(id);

      const response = await this.CityRepo.findAllCities({ id: id });
      if(response.length === 0){
          throw new BadRequestError("City not found");
      }

      return response[0];
    }
}

export{
    CityService
}