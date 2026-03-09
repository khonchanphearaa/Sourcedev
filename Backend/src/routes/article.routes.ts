import { Router } from 'express';
import {
  getArticles, getArticle, getMyArticles,
  createArticle, updateArticle, deleteArticle, getTags
} from '../controllers/articleController';
import { protect } from '../middlewares/auth';

const router = Router();

router.get('/', getArticles);
router.get('/tags', getTags);
router.get('/my', protect, getMyArticles);
router.get('/:slug', getArticle);
router.post('/', createArticle);
router.put('/:id', protect, updateArticle);
router.delete('/:id', protect, deleteArticle);

export default router;