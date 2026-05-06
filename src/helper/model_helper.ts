import { validate as uuidValidate } from "uuid";
import { BadRequestError } from "./app_error_helper.js";

import { SettingRepository } from "../modules/setting/setting.repository.js";
import { SettingResponseDto } from "../modules/setting/setting.dto.js";

const settingRepo = new SettingRepository();

// Validator for UUID format
function uuidValidator(id: string) {
  if (!uuidValidate(id)){
    throw new BadRequestError("Invalid ID");
  }
}

async function activeYearFilter(): Promise<SettingResponseDto> {
  const activeYear = await settingRepo.findActiveSetting()
  if(!activeYear || activeYear.length === 0){
    throw new BadRequestError("No active year found");
  }
  return activeYear[0] || null;
}

export {
    uuidValidator,
    activeYearFilter
}