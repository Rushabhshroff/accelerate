import { Router } from 'express';
import {FitnessRoutes} from './fitness-partners';
import {UserRoutes} from './user';

export const Routes = Router()

Routes.use('/user', UserRoutes);
Routes.use('/partners', FitnessRoutes);


export * from './fitness-partners'
export * from './user'