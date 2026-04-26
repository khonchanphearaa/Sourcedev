import { Types } from "mongoose";
import { Comment } from "../models/Comment";
import { Article } from "../models/Article";

const AUTHOR_FIELDS = "name avatar role";

export const getCommentsByArticleId = async (articleId: string) => {
  const all = await Comment.find({ article: articleId })
    .populate("author", AUTHOR_FIELDS)
    .sort({ createdAt: 1 })
    .lean();

  const topLevel = all.filter((c) => !c.parentComment); // Filter out the main comments (those without a parent)
  const replies = all.filter((c) => c.parentComment); // Filter out the sub-comments (those with a parent)

  return topLevel.map((comment) => ({
    ...comment, // This call Spread Operator is shortcut  copy all propertes {title: comment.title, content: comment.content, ...}
    replies: replies.filter(
      (r) => r.parentComment?.toString() === comment._id.toString(),
    ),
  }));
};

export const createCommentService = async (articleId: string, userId: string, content: string, parentCommentId?: string) => {
  const article = await Article.findOne({_id: articleId, status: "published",});
  if (!article) throw new Error("Article not found");

  if (parentCommentId) {
    const parent = await Comment.findOne({ _id: parentCommentId, article: articleId});
    if (!parent) throw new Error("Parent comment not found");
    if (parent.parentComment) throw new Error("Cannot reply to a reply");
  }

  const comment = await Comment.create({
    article: new Types.ObjectId(articleId),
    author: userId,
    content: content.trim(),
    parentComment: parentCommentId ? new Types.ObjectId(parentCommentId) : undefined,
  });

  return await comment.populate("author", AUTHOR_FIELDS);
};

export const updateCommentService = async (commentId: string, userId: string, content: string) => {
    const comment = await Comment.findById(commentId);
    if(!comment) throw new Error('Comment not found');
    
    // is not author comment
    if(comment.author.toString() !== userId) throw new Error('Unauthorized');

    comment.content = content.trim();
    await comment.save();
    return await comment.populate("author", AUTHOR_FIELDS);
}

export const deleteCommentService = async (commentId: string, userId: string, userRole: string) =>{
    const comment = await Comment.findById(commentId);
    if(!comment) throw new Error('Comment not found');

    const isOwner = comment.author.toString() === userId;
    const isAdmin = userRole === 'Admin';
    if(!isOwner && !isAdmin) throw new Error('Not authorized');

    await Comment.deleteMany({ $or: [{ _id: comment._id }, { parentComment: comment._id }] });
    return true;
}

export const likeCommentService = async (commentId: string, userId: string) => {
    const comment = await Comment.findById(commentId);
    if(!comment) throw new Error('Comment not found');

    const likeIndex = comment.likes.map(id => id.toString()).indexOf(userId);
    const isLiked = likeIndex !== -1;

    if(isLiked){
        comment.likes.splice(likeIndex, 1);
    }else{
        comment.likes.push(userId as any);
    }
    await comment.save();
    return { liked: !isLiked, likeCount: comment.likes.length };
}