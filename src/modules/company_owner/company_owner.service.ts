// company_owner.service.ts
import { CompanyResponseDto, CreateCompanyDto } from '../company/company.dto.js';
import { CompanyOwnerFilterDto, CompanyOwnerResponseDto, CreateCompanyOwnerDto, DeleteCompanyOwnerDto } from './company_owner.dto.js';
import { CompanyOwnerRepository } from './company_owner.repository.js';

class CompanyOwnerService {
  private CompanyOwnerRepository: CompanyOwnerRepository = new CompanyOwnerRepository();
  async findAllCompanyOwners(filters: CompanyOwnerFilterDto | null): Promise<CompanyOwnerResponseDto[]>{
    const response = await this.CompanyOwnerRepository.findAllCompanyOwners(filters)

    let mapCompanyOwners: { [key: string]: { company: CompanyResponseDto; participants: any[] } }= {};
    response.forEach(companyOwner => {
      if(!mapCompanyOwners[companyOwner.companyId as string])
        mapCompanyOwners[companyOwner.companyId as string] = {
          company: {
            id: companyOwner.companyId as string,
            name: companyOwner.companyName as string,
            address: companyOwner.companyAddress as string,
            city: null
          },
          participants: []
        }
      mapCompanyOwners[companyOwner.companyId as string] ?.participants.push({
        id: companyOwner.participantId,
        name: companyOwner.participantName
      })  
    });

    return mapCompanyOwners ? Object.values(mapCompanyOwners).map(companyOwner => ({
      company: companyOwner.company,
      owners: companyOwner.participants
    })) : []
  }
  
  async createCompanyOwner(req: CreateCompanyOwnerDto): Promise<void> {
      const responseCompanyOwners = await this.CompanyOwnerRepository.findExistingCompanyOwner(req.companyId, req.participantIds);
      if(responseCompanyOwners.length > 0){
        throw new Error("One or more of the participants are already owners of the company\nPlease remove the existing ownership before creating a new one:\n" + responseCompanyOwners.map(existingCompanyOwner => `Participant Name: ${existingCompanyOwner.participantName}`).join("\n"));
      }
      
      await this.CompanyOwnerRepository.createCompanyOwner(req)

      return
  }

  async deleteCompanyOwner(req: DeleteCompanyOwnerDto): Promise<void> {
      await this.CompanyOwnerRepository.deleteCompanyOwner(req.companyId, req.participantIds);
      return;
  }
}

export {
    CompanyOwnerService
}