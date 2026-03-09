import { Request, Response } from 'express';
import { Article } from '../models/Article';
import { AuthRequest } from '../middlewares/auth';

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

    res.json({ success: true, articles, total, page, pages: Math.ceil(total / limit) });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const article = await Article.findOneAndUpdate(
      { slug: req.params.slug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name avatar bio');

    if (!article) { res.status(404).json({ success: false, message: 'Article not found' }); return; }
    res.json({ success: true, article });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMyArticles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const articles = await Article.find({ author: req.user?.id })
      .sort({ createdAt: -1 })
      .select('-content');
    res.json({ success: true, articles });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
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
    res.status(201).json({ success: true, article: populated });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) { res.status(404).json({ success: false, message: 'Article not found' }); return; }
    if (article.author.toString() !== req.user?.id) {
      res.status(403).json({ success: false, message: 'Not authorized' }); return;
    }
    const { title, excerpt, content, coverImage, tags, status, linkGithub } = req.body;
    Object.assign(article, { title, excerpt, content, coverImage, tags, status, linkGithub });
    await article.save();
    res.json({ success: true, article });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) { res.status(404).json({ success: false, message: 'Article not found' }); return; }
    if (article.author.toString() !== req.user?.id) {
      res.status(403).json({ success: false, message: 'Not authorized' }); return;
    }
    await article.deleteOne();
    res.json({ success: true, message: 'Article deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
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
    res.json({ success: true, tags });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};