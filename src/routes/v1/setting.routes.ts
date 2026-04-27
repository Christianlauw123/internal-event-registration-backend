// setting.routes.ts
import express from 'express'
import { createSetting, deleteSetting, findAllSettings, updateSetting } from '../../modules/setting/setting.controller.js';

const settingRouter = express.Router();

settingRouter.get('/', findAllSettings)
settingRouter.post('/', createSetting)
settingRouter.put('/:id', updateSetting)
settingRouter.delete('/:id', deleteSetting)

export{
    settingRouter
}