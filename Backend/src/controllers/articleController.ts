import { Request, Response } from 'express';
import { Article } from '../models/Article';
import { AuthRequest } from '../middlewares/auth';
import { sendResponse } from '../utils/response';

/* Public get articles anyone can read */
export const getArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const tag = req.query.tag as string;
    const search = req.query.search as string;
    const authorId = req.query.author as string;

    const query: Record<string, unknown> = { status: 'published' };
    if (tag) query.tags = tag;
    if (authorId) query.author = authorId;
    if (search) query.$text = { $search: search };

    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .populate('author', 'name avatar bio')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-content');

    return sendResponse(res, 200, 'Articles retrieved successfully', { articles, total, page, pages: Math.ceil(total / limit) });
  } catch {
    return sendResponse(res, 500, 'Server error');
  }
};

/* Public get single article anyone can read */
export const getArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const article = await Article.findOneAndUpdate(
      { slug: req.params.slug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name avatar bio');

    if(!article){ return sendResponse(res, 404, 'Article not found');}
    return sendResponse(res, 200, 'Article retrieved successfully', article);
  } catch {
    return sendResponse(res, 500, 'Server error');
  }
};

/* Protected get single article by id for editing */
export const getArticleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const article = await Article.findById(req.params.id).populate('author', 'name avatar bio');
  
    if(!article){return sendResponse(res, 404, 'Article not found');}

    return sendResponse(res, 200, 'Article retrieved successfully', article);
  } catch {
    return sendResponse(res, 500, 'Server error');
  }
};

export const getMyArticles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const articles = await Article.find({ author: req.user?.id })
      .sort({ createdAt: -1 })
      .select('-content');
    return sendResponse(res, 200, 'Articles retrieved successfully', articles);
  } catch {
    return sendResponse(res, 500, 'Server error');
  }
};

/* ADMIN — get all articles (any status) */
export const getAllArticles = async (_req: Request, res: Response): Promise<void> => {
  try {
    const articles = await Article.find()
      .populate('author', 'name avatar role')
      .sort({ createdAt: -1 })
      .select('-content');
    return sendResponse(res, 200, 'Articles retrieved successfully', articles);
  } catch {
    return sendResponse(res, 500, 'Server error');
  }
};

export const createArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, excerpt, content, coverImage, tags, status, linkGithub } = req.body;
    const article = await Article.create({
      title, excerpt, content, coverImage, tags, status, linkGithub,
      author: req.user?.id,
    });
    const populated = await article.populate('author', 'name avatar');
    return sendResponse(res, 201, 'Article created successfully', populated);
  } catch {
    return sendResponse(res, 500, 'Server error');
  }
};

export const updateArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) { return sendResponse(res, 404, 'Article not found'); }

    const { title, excerpt, content, coverImage, tags, status, linkGithub } = req.body;
    Object.assign(article, { title, excerpt, content, coverImage, tags, status, linkGithub });
    await article.save();
    return sendResponse(res, 200, 'Article updated successfully', article);
  } catch {
    return sendResponse(res, 500, 'Server error');
  }
};

export const deleteArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) { return sendResponse(res, 404, 'Article not found'); }

    await article.deleteOne();
    return sendResponse(res, 200, 'Article deleted');
  } catch {
    return sendResponse(res, 500, 'Server error');
  }
};

export const getTags = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tags = await Article.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);
    return sendResponse(res, 200, 'Tags retrieved successfully', tags);
  } catch {
    return sendResponse(res, 500, 'Server error');
  }
};