import { Router } from 'express';
import { getComments, createComment, updateComment, deleteComment, toggleLike, } from '../controllers/commentController';
import { protect } from '../middlewares/auth';

const router = Router();

router.get('/:articleId', getComments);
router.post('/:articleId', protect, createComment);
router.put('/:commentId', protect, updateComment);
router.delete('/:commentId', protect, deleteComment);
router.post('/:commentId/like', protect, toggleLike);

export default router;