import express from 'express'
import { createCity, deleteCity, findAllCities, updateCity } from '../../modules/cities/cities.controller.js';

const cityRouter = express.Router();

cityRouter.get('/', findAllCities)
cityRouter.post('/', createCity)
cityRouter.put('/:id', updateCity)
cityRouter.delete('/:id', deleteCity)

export{
    cityRouter
}