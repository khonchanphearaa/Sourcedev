
import { Article } from "../models/Article";

export const getArticlesService = async (params: any) => {
    const { page = 1, limit = 10, tag, search, authorId } = params;

    const query: Record<string, any> = { status: 'published' };
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

    return {
        articles,
        total,
        page,
        pages: Math.ceil(total / limit)
    };
}

export const getArticleBySlugService = async (slug: string) => {
    const article = await Article.findOneAndUpdate(
        { slug, status: 'published' },
        { $inc: { views: 1 } },
        { new: true }
    ).populate('author', 'name avatar bio');

    return article;
}

export const getArticleByIdService = async (id: string) => {
    const article = await Article.findById(id).populate('author', 'name avatar bio');
    if (!article) throw new Error('Article not found');
    return article;
}

export const getMyArticlesService = async (authorId: string) => {
    return await Article.find({ author: authorId })
        .sort({ createdAt: -1 })
        .select('-content');
}

export const getAllArticlesAdminService = async () => {
    return await Article.find()
        .populate('author', 'name avatar bio')
        .sort({ createdAt: -1 })
        .select('-content');
}

export const createArticleService = async (ArticleData: any, authorId: string) => {
    const article = await Article.create({ ...ArticleData, author: authorId });
    return await article.populate('author', 'name avatar bio');
}

export const updateArticleService = async (id: string, ArticleData: any) => {
    const article = await Article.findById(id);
    if (!article) throw new Error('Article not found');

    // Object.assign copy all properties from ArticleData : {title, content, tags, status,...}
    Object.assign(article, ArticleData);
    return await article.save();
}

export const deleteArticleService = async (id: string) => {
    const article = await Article.findById(id);
    if (!article) throw new Error('Article not found');
    await article.deleteOne();
    return true;
}

export const getSlugService = async () => {
    return await Article.aggregate([
        { $match: { status: 'published' } },
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 },
    ]);
}