import express from 'express';
import { 
  getAllProjects, 
  getActiveProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject 
} from '../controllers/projectController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.get('/', getActiveProjects);
router.get('/all', protect, admin, getAllProjects);
router.get('/:id', getProjectById);
router.post('/', protect, admin, createProject);
router.put('/:id', protect, admin, updateProject);
router.delete('/:id', protect, admin, deleteProject);

export default router;
