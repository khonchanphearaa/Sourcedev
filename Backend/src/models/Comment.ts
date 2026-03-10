import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
    _id: mongoose.Types.ObjectId;
    article: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
    {
        article: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true, trim: true, maxlength: 1000 },
    },
    { timestamps: true }
);

export const Comment = mongoose.model<IComment>('Comment', commentSchema);