import { Router } from 'express';
import { getComments, createComment, deleteComment, updateComment } from '../controllers/commentController'
import { protect } from '../middlewares/auth';

const router = Router();

router.get('/:articleId', getComments);
router.post('/:articleId', protect, createComment);
router.put('/:commentId', protect, updateComment);
router.delete('/:commentId', protect, deleteComment);

export default router;