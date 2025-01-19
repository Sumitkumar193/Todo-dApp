import { Router } from 'express';
import Authenticate from '../middlewares/Authenticate';
import {
  get,
  create,
  update,
  validateStatus,
} from '../controllers/TodoController';
import Paginate from '../middlewares/Pagination';

const TodoRoutes = Router();

TodoRoutes.get('/', Authenticate, Paginate, get);
TodoRoutes.post('/', Authenticate, create);
TodoRoutes.get('/:id', Authenticate, validateStatus);
TodoRoutes.post('/:id', Authenticate, update);

export default TodoRoutes;
