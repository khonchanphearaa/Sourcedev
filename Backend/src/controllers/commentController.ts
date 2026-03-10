import { Request, Response } from 'express';
import { Comment } from '../models/Comment';
import { Article } from '../models/Article';
import { AuthRequest } from '../middlewares/auth';

type ArticleParams = { articleId: string };
type CommentParams = { commentId: string };
type AuthRequestWithParams<T> = AuthRequest & { params: T };

// GET /api/comments/:articleId — public
export const getComments = async (req: Request<ArticleParams>, res: Response): Promise<void> => {
    try {
        const { articleId } = req.params;

        const comments = await Comment.find({ article: articleId })
            .populate('author', 'name avatar role')
            .sort({ createdAt: 1 });
        res.json({ success: true, comments });
    } catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// POST /api/comments/:articleId — auth required
export const createComment = async (req: AuthRequestWithParams<ArticleParams>, res: Response): Promise<void> => {
    try {
        const { articleId } = req.params;
        const { content } = req.body;
        if (!content?.trim()) {
            res.status(400).json({ success: false, message: 'Comment cannot be empty' });
            return;
        }

        if (!req.user?.id) {
            res.status(401).json({ success: false, message: 'Not authorized' });
            return;
        }

        // Check article exists and is published
        const article = await Article.findOne({ _id: articleId, status: 'published' });
        if (!article) {
            res.status(404).json({ success: false, message: 'Article not found' });
            return;
        }

        const comment = await Comment.create({
            article: articleId,
            author: req.user.id,
            content: content.trim(),
        });

        const populated = await Comment.findById(comment._id).populate('author', 'name avatar role');
        res.status(201).json({ success: true, comment: populated });
    } catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// DELETE /api/comments/:commentId — own comment or admin
export const deleteComment = async (req: AuthRequestWithParams<CommentParams>, res: Response): Promise<void> => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            res.status(404).json({ success: false, message: 'Comment not found' });
            return;
        }

        const isOwner = comment.author.toString() === req.user?.id;
        const isAdmin = req.user?.role === 'admin';

        if (!isOwner && !isAdmin) {
            res.status(403).json({ success: false, message: 'Not authorized' });
            return;
        }

        await comment.deleteOne();
        res.json({ success: true, message: 'Comment deleted' });
    } catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// PUT /api/comments/:commentId — own comment only
export const updateComment = async (req: AuthRequestWithParams<CommentParams>, res: Response): Promise<void> => {
    try {
        const { content } = req.body;
        if (!content?.trim()) {
            res.status(400).json({ success: false, message: 'Comment cannot be empty' });
            return;
        }

        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            res.status(404).json({ success: false, message: 'Comment not found' });
            return;
        }

        if (comment.author.toString() !== req.user?.id) {
            res.status(403).json({ success: false, message: 'Not authorized' });
            return;
        }

        comment.content = content.trim();
        await comment.save();
        const populated = await Comment.findById(comment._id).populate('author', 'name avatar role');
        res.json({ success: true, comment: populated });
    } catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};