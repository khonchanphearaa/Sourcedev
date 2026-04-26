import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { sendResponse } from '../utils/response';
import * as articleService from '../services/articleService';

/* Public get articles anyone can read */
export const getArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await articleService.getArticlesService(req.query);
    return sendResponse(res, 200, 'Articles retrieved success', result);
  } catch (error: any) {
    return sendResponse(res, 500, error.message);
  }
};

/* Public get single article anyone can read */
export const getArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const article = await articleService.getArticleBySlugService(req.params.slug as string);
    return sendResponse(res, 200, 'Article retrieved success', article);
  } catch (error: any) {
    return sendResponse(res, 500, error.message);
  }
};

/* Protected get single article by id for editing */
export const getArticleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const article = await articleService.getArticleByIdService(req.params.id as string);
    return sendResponse(res, 200, 'Article retrieved successfully', article);
  } catch (error: any) {
    return sendResponse(res, 500, error.message);
  }
};

export const getMyArticles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const articles = await articleService.getMyArticlesService(req.user?.id as string);
    return sendResponse(res, 200, 'Articles retrieved success', articles);
  } catch (error: any) {
    return sendResponse(res, 500, error.message);
  }
};

/* ADMIN — get all articles (any status) */
export const getAllArticles = async (_req: Request, res: Response): Promise<void> => {
  try {
    const articles = await articleService.getAllArticlesAdminService();
    return sendResponse(res, 200, 'Articles retrieved success', articles);
  } catch (error: any) {
    return sendResponse(res, 500, error.message);
  }
};

export const createArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const article = await articleService.createArticleService(req.body, req.user?.id as string);
    return sendResponse(res, 201, 'Article created sucess', article);
  } catch (error: any) {
    return sendResponse(res, 500, error.message);
  }
};

export const updateArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const article = await articleService.updateArticleService(req.params.id as string, req.body);
    return sendResponse(res, 200, 'Article updated sucess', article);
  } catch (error: any) {
    return sendResponse(res, 500, error.message);
  }
};

export const deleteArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const article = await articleService.deleteArticleService(req.params.id as string);
    return sendResponse(res, 200, 'Article deleted success', article);
  } catch (error: any) {
    return sendResponse(res, 500, error.message);
  }
};

export const getTags = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tags = await articleService.getSlugService();
    return sendResponse(res, 200, 'Tags retrieved success', tags);
  } catch (error: any) {
    return sendResponse(res, 500, error.message);
  }
};