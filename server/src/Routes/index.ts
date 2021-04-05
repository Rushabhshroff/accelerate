import { Router } from 'express';
import FitnessRoutes from './FitnessPartners';
import UserRoutes from './User';

const Routes = Router()

Routes.use('/user', UserRoutes);
Routes.use('/partners', FitnessRoutes);

export default Routes;