import { Router } from 'express';
import { AuthRoutes } from './auth';
import { InAppPurchases } from './in-app-purchase';

export const Routes = Router()

Routes.use('/auth', AuthRoutes)
Routes.use('/in-app-purchases', InAppPurchases)

export * from './fitness-partners'
export * from './user'
export * from './auth'