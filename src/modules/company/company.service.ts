// company.service.ts
import { CompanyRepository } from './company.repository.js';
import { CreateCompanyDto, CompanyResponseDto, CompanyFilterDto, UpdateCompanyDto, DeleteCompanyDto } from './company.dto.js';
import { BadRequestError } from '../../helper/app_error_helper.js';
import { uuidValidator } from '../../helper/model_helper.js';

class CompanyService {
  private CompanyRepo: CompanyRepository = new CompanyRepository();
    
    async findAllCompanies(filters: CompanyFilterDto | null): Promise<CompanyResponseDto[]>{
        const response = await this.CompanyRepo.findAllCompanies(filters)

        return response.map(company => ({
            id: company.id,
            name: company.name as string,
            address: company.address as string,
            city: {
                id: company.cityId as string,
                name: company.cityName
            }
        }))
    }
    
    async createCompany(req: CreateCompanyDto): Promise<CompanyResponseDto> {
        await this.findCompanyByName(req.name.trim());

        // Trimming Data
        req?.name && (req.name = req.name.trim());
        req?.address && (req.address = req.address.trim());

        const response = await this.CompanyRepo.createCompany(req)

        return {
            id: response[0].id,
            name: response[0].name as string,
            address: response[0].address as string,
            city: null
        }
    }

    async updateCompany(req: UpdateCompanyDto): Promise<CompanyResponseDto> {
        const { id, ...updateData } = req;
        
        await this.findCompanyById(id);
        updateData?.name && await this.findCompanyByName(updateData.name.trim(), id);
        
        // Trimming Data
        updateData?.name && (updateData.name = updateData.name.trim());
        updateData?.address && (updateData.address = updateData.address.trim());

        const response = await this.CompanyRepo.updateCompany(id, updateData)

        return {
            id: response[0].id,
            name: response[0].name as string,
            address: response[0].address as string,
            city: null
        }
    }

    async deleteCompany(req: DeleteCompanyDto): Promise<void> {
        const { id, ...existingCompany } = await this.findCompanyById(req.id);
        await this.CompanyRepo.deleteCompany(id, existingCompany);
        return;
    }

    private async findCompanyByName(name: string, id: string | null = null){
        const response = await this.CompanyRepo.findAllCompanies({ name: name.trim().toLowerCase() });
        if(response.length > 0){
            if((!id) || id && response[0].id !== id){
                throw new BadRequestError("Company with the same name already exists");
            }
        }
    }

    private async findCompanyById(id: string){
      uuidValidator(id);

      const response = await this.CompanyRepo.findAllCompanies({ id: id });
      if(response.length === 0){
          throw new BadRequestError("Company not found");
      }

      return response[0];
    }
}

export {
    CompanyService
}