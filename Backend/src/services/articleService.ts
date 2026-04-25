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
        {slug, status: 'published'},
        {$inc: {views: 1}},
        {new: true}
    ).populate('author', 'name avatar bio');
    
    return article;
}