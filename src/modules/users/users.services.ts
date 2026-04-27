// Brain Logic (Middle Man) - Controller -> (MM) -> Repository
import { BadRequestError } from "../../helper/app_error_helper.js";
import { uuidValidator } from "../../helper/model_helper.js";
import { CreateUserDto, DeleteUserDto, UpdateUserDto, UserFilterDto, UserResponseDto } from "./users.dto.js";
import { UserRepository } from "./users.repository.js";

class UserService{
    private userRepo: UserRepository = new UserRepository();
    
    async findAllUsers(filters: UserFilterDto | null): Promise<UserResponseDto[]>{
        const response = await this.userRepo.findAllUsers(filters)

        return response.map(user => ({
            id: user.id,
            name: user.name,
            role: user.role,
            email: user.email
        }))
    }
    
    async createUser(req: CreateUserDto): Promise<UserResponseDto> {
        if (!req.name){
            throw new BadRequestError("Name is required");
        }
        if (!req.email){
            throw new BadRequestError("Email is required");
        }
        if (req.password !== req.password_confirmation) {
            throw new BadRequestError("Password and password confirmation do not match");
        }

        // Trimming Data
        req?.name && (req.name = req.name.trim());
        req?.email && (req.email = req.email.trim());

        await this.findUserByEmail(req.email);

        const response = await this.userRepo.createUser(req)

        return {
            id: response[0].id,
            name: response[0].name,
            role: response[0].role,
            email: response[0].email
        }
    }

    async updateUser(req: UpdateUserDto): Promise<UserResponseDto> {
        const { id, ...updateData } = req;
        
        await this.findUserById(id);
        updateData?.email && await this.findUserByEmail(updateData.email, id);
        if (req.password) {
            if (req.password !== req.password_confirmation) {
                throw new BadRequestError("Password and password confirmation do not match");
            }
        }

        // Trimming Data
        updateData?.name && (updateData.name = updateData.name.trim());
        updateData?.email && (updateData.email = updateData.email.trim());
        
        const response = await this.userRepo.updateUser(id, updateData)

        return {
            id: response[0].id,
            name: response[0].name,
            role: response[0].role,
            email: response[0].email
        }
    }

    async deleteUser(req: DeleteUserDto): Promise<void> {
        const { id, ...existingUser } = await this.findUserById(req.id);
        await this.userRepo.deleteUser(id, existingUser);
        return;
    }

    // Private helper functions can be added here if needed
    private async findUserByEmail(email: string, id: string | null = null){
        const existingUser = await this.userRepo.findAllUsers({ email })
        
        if (existingUser.length > 0) {
            // Check if the found user is the same as the one being updated
            if((!id) || id && existingUser[0].id !== id){
                throw new BadRequestError("Email already exists");
            }
        }
    }

    private async findUserById(id: string){
        uuidValidator(id);

        const existingUser = await this.userRepo.findAllUsers({ id });
        if (existingUser.length === 0) {
            throw new BadRequestError("User not found");
        }

        return existingUser[0];
    }
}

export{
    UserService
}