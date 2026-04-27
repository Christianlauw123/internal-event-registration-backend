// UI -> Services
import type { Request, Response } from "express";
import { UserService } from "./users.services.js";
import { baseResponse } from "../../helper/response_helper.js";
import { CreateUserDto, DeleteUserDto, UpdateUserDto, UserFilterDto } from "./users.dto.js";

const userService = new UserService()

async function findAllUsers(req: Request, res: Response){
    const requestBody: UserFilterDto = {
        ...(req.query.id && { id: req.query.id as string }),
        ...(req.query.name && { name: req.query.name as string }),
        ...(req.query.role && { role: req.query.role as string }),
        ...(req.query.email && { email: req.query.email as string }),
        ...(req.query.keyword && { keyword: req.query.keyword as string }),
        ...(req.query.deleted !== undefined && { deleted: req.query.deleted === "true" })
    }

    const response = await userService.findAllUsers(requestBody)
    if(response.length === 0){
        return res.status(404).json(baseResponse("No users found", null, []))
    }
    return res.status(200).json(baseResponse("Users found", null, response))
}

async function createUser(req: Request, res: Response){
    const requestBody: CreateUserDto = {
        name: req.body.name,
        role: req.body.role,
        email: req.body.email,
        password: req.body.password,
        password_confirmation: req.body.password_confirmation
    }

    const response = await userService.createUser(requestBody)
    return res.status(201).json(baseResponse("User created", null, [response]))
}

async function updateUser(req: Request, res: Response){
    const requestBody: UpdateUserDto = {
        id: req.params.id as string,
        ...(req.body.name && { name: req.body.name as string }),
        ...(req.body.role && { role: req.body.role as string }),
        ...(req.body.email && { email: req.body.email as string }),
        ...(req.body.password && { password: req.body.password as string }),
        ...(req.body.password_confirmation && { password_confirmation: req.body.password_confirmation as string }),
    }

    const response = await userService.updateUser(requestBody)
    return res.status(201).json(baseResponse("User updated", null, [response]))
}

async function deleteUser(req: Request, res: Response){
    const requestBody: DeleteUserDto = {
        id: req.params.id as string
    }

    const response = await userService.deleteUser(requestBody)
    return res.status(201).json(baseResponse("User deleted", null, [response]))
}

export{
    findAllUsers,
    createUser,
    updateUser,
    deleteUser
}