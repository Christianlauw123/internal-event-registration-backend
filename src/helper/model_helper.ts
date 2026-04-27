import { validate as uuidValidate } from "uuid";
import { BadRequestError } from "./app_error_helper.js";

function withUpdatedAt<T>(data: T): T & { updatedAt: Date } {
  return {
    ...data,
    updatedAt: new Date(),
  };
}

function withDeletedAt<T>(data: T): T & { deletedAt: Date } {
  return {
    ...data,
    deletedAt: new Date(),
  };
}

function uuidValidator(id: string) {
  if (!uuidValidate(id)){
    throw new BadRequestError("Invalid ID");
  }
}

export {
    withUpdatedAt,
    withDeletedAt,
    uuidValidator
}