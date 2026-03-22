import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Comment } from '../models/Comment';
import { Article } from '../models/Article';
import { AuthRequest } from '../middlewares/auth';

const AUTHOR_FIELDS = 'name avatar role';


export const getComments = async (req: Request, res: Response): Promise<void> => {
    try {
        const all = await Comment.find({ article: req.params.articleId })
            .populate('author', AUTHOR_FIELDS)
            .sort({ createdAt: 1 })
            .lean();


        const topLevel = all.filter(c => !c.parentComment);
        const replies = all.filter(c => c.parentComment);


        const nested = topLevel.map(comment => ({
            ...comment,
            replies: replies.filter(r => r.parentComment?.toString() === comment._id.toString()),
        }));

        res.json({ success: true, comments: nested });
    } catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { content, parentComment } = req.body;

        if (!content?.trim()) {
            res.status(400).json({ success: false, message: 'Comment cannot be empty' });
            return;
        }

        const article = await Article.findOne({ _id: req.params.articleId, status: 'published' });
        if (!article) {
            res.status(404).json({ success: false, message: 'Article not found' });
            return;
        }

        /* If replying, verify parent exists and belongs to same article */
        if (parentComment) {
            const parent = await Comment.findOne({ _id: parentComment, article: req.params.articleId });
            if (!parent) {
                res.status(404).json({ success: false, message: 'Parent comment not found' });
                return;
            }
            if (parent.parentComment) {
                res.status(400).json({ success: false, message: 'Cannot reply to a reply' });
                return;
            }
        }

        const comment = await Comment.create({
            article: new Types.ObjectId(req.params.articleId as string),
            author: req.user?.id,
            content: content.trim(),
            parentComment: parentComment || null,
        });

        const populated = await comment.populate('author', AUTHOR_FIELDS);
        res.status(201).json({ success: true, comment: populated });
    } catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


export const updateComment = async (req: AuthRequest, res: Response): Promise<void> => {
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
        const populated = await comment.populate('author', AUTHOR_FIELDS);
        res.json({ success: true, comment: populated });
    } catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
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

        await Comment.deleteMany({ $or: [{ _id: comment._id }, { parentComment: comment._id }] });
        res.json({ success: true, message: 'Comment deleted' });
    } catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


export const toggleLike = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            res.status(404).json({ success: false, message: 'Comment not found' });
            return;
        }

        const userId = req.user?.id as string;
        const liked = comment.likes.map(id => id.toString()).includes(userId);

        if (liked) {
            /* Unlike */
            comment.likes = comment.likes.filter(id => id.toString() !== userId) as typeof comment.likes;
        } else {
            /* Like */
            comment.likes.push(userId as any);
        }

        await comment.save();
        res.json({ success: true, liked: !liked, likeCount: comment.likes.length });
    } catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};