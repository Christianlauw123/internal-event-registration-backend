// Brain Logic (Middle Man) - Controller -> (MM) -> Repository
// setting.service.ts
import { BadRequestError } from "../../helper/app_error_helper.js";
import { uuidValidator } from "../../helper/model_helper.js";
import { CreateSettingDto, DeleteSettingDto, SettingFilterDto, SettingResponseDto, UpdateSettingDto } from "./setting.dto.js";
import { SettingRepository } from "./setting.repository.js";

class SettingService{
    private SettingRepo: SettingRepository = new SettingRepository();
    
    async findAllSettings(filters: SettingFilterDto | null): Promise<SettingResponseDto[]>{
        const response = await this.SettingRepo.findAllSettings(filters)

        return response.map(setting => ({
            id: setting.id,
            title: setting.title,
            year: setting.year,
        }))
    }
    
    async createSetting(req: CreateSettingDto): Promise<SettingResponseDto> {
        await this.findSettingByYear(req.year);

        // Trimming Data
        req?.title && (req.title = req.title.trim());
        const response = await this.SettingRepo.createSetting(req)

        return {
            id: response[0].id,
            title: response[0].title,
            year: response[0].year,
        }
    }

    async updateSetting(req: UpdateSettingDto): Promise<SettingResponseDto> {
        const { id, ...updateData } = req;
        
        await this.findSettingById(id);
        updateData?.year &&await this.findSettingByYear(updateData.year, id);
        
        // Trimming Data
        updateData?.title && (updateData.title = updateData.title.trim());

        const response = await this.SettingRepo.updateSetting(id, updateData)

        return {
            id: response[0].id,
            title: response[0].title,
            year: response[0].year,
        }
    }

    async deleteSetting(req: DeleteSettingDto): Promise<void> {
        const { id, ...existingSetting } = await this.findSettingById(req.id);
        await this.SettingRepo.deleteSetting(id, existingSetting);
        return;
    }

    async settingActivation(activeSettingId: string): Promise<void> {
        await this.SettingRepo.settingActivation(activeSettingId);
        return;
    }

    private async findSettingByYear(year: number, id: string | null = null){
        const response = await this.SettingRepo.findAllSettings({ year: year })
        if(response.length > 0){
            if((!id) || id && response[0].id !== id){
                throw new BadRequestError("Setting with the same year already exists");
            }
        }
    }

    private async findSettingById(id: string){
        uuidValidator(id);

        const response = await this.SettingRepo.findAllSettings({ id: id })
        if(response.length === 0){
            throw new BadRequestError("Setting not found");
        }
        return response[0];
    }
}

export{
    SettingService
}