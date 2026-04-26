import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import * as commentService from '../services/commentService';
import { sendResponse } from '../utils/response';

const AUTHOR_FIELDS = 'name avatar role';


export const getComments = async (req: Request, res: Response): Promise<void> => {
    try {
        const comments = await commentService.getCommentsByArticleId(req.params.articleId as string)
        return sendResponse(res, 200, 'Comments retrieved successfully', comments);
    } catch (error: any) {
        return sendResponse(res, 500, error.message);
    }
};


export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const {content, parentComment} = req.body;
        if(!content?.trim()){
            return sendResponse(res, 400, 'Comment cannot be empty');
        }
        const comment = await commentService.createCommentService(
            req.params.articleId as string,
            req.user?.id as string,
            content,
            parentComment
        );
        return sendResponse(res, 201, 'Comment created successfully', comment
        )
    } catch (error: any) {
        return sendResponse(res, 500, error.message);
    }
};


export const updateComment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const {content} = req.body;
        if(!content?.trim()){
            return sendResponse(res, 400, 'Comment cannot be empty');
        }
        const comment = await commentService.updateCommentService(
            req.params.commentId as string,
            req.user?.id as string,
            content
        );
        return sendResponse(res, 200, 'Comment updated successfully', comment);
    } catch (error: any) {
        return sendResponse(res, 500, error.message);
    }
};


export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await commentService.deleteCommentService(
            req.params.commentId as string, 
            req.user?.id as string,
            req.user?.role as string
        );
        return sendResponse(res, 200, 'Comment deleted successfully')
    } catch (error: any) {
        return sendResponse(res, 500, error.message);
    }
};


export const toggleLike = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const result = await commentService.likeCommentService(
            req.params.commentId as string,
            req.user?.id as string
        );
        return sendResponse(res, 200, result.liked ? 'Liked' : 'Unliked', result);
    } catch (error: any) {
        return sendResponse(res, 500, error.message);
    }
};