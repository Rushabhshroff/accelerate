import { Router } from 'express';
import AuthRoutes from './Auth';

const Routes = Router()
Routes.use('/auth',AuthRoutes);

export default Routes;