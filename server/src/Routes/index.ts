import { Router } from 'express';
import { AuthRoutes } from './auth';

export const Routes = Router()
Routes.use('/auth',AuthRoutes)

export * from './fitness-partners'
export * from './user'
export * from './auth'