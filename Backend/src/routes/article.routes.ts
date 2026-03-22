import { Router } from 'express';
import {
  getArticles, getArticle, getArticleById, getMyArticles,
  createArticle, updateArticle, deleteArticle, getTags,
  getAllArticles
} from '../controllers/articleController';
import { protect, requireAdmin } from '../middlewares/auth';

const router = Router();

router.get('/', getArticles);
router.get('/tags', getTags);
router.get('/my', protect, getMyArticles);
router.get('/id/:id', protect, requireAdmin, getArticleById);

/* Admin permissions */
router.get('/admin/all', protect, requireAdmin, getAllArticles);
router.post('/', protect, requireAdmin, createArticle);
router.put('/:id', protect, requireAdmin, updateArticle);
router.delete('/:id', protect, requireAdmin, deleteArticle);

router.get('/:slug', getArticle);

export default router;