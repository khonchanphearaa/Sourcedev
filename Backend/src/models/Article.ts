import mongoose, { Document, Schema } from 'mongoose';

export interface IArticle extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  author: mongoose.Types.ObjectId;
  status: 'draft' | 'published';
  readTime: number;
  views: number;
  linkGithub?: string;
  createdAt: Date;
  updatedAt: Date;
}

const articleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, unique: true, lowercase: true },
    excerpt: { type: String, required: true, maxlength: 300 },
    content: { type: String, required: true },
    coverImage: { type: String, default: '' },
    tags: [{ type: String, trim: true, lowercase: true }],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    readTime: { type: Number, default: 1 },
    views: { type: Number, default: 0 },
    linkGithub: { type: String, default: '' },
  },
  { timestamps: true }
);

// Auto-generate slug and read time before saving
articleSchema.pre('save', async function () {
  if (this.isModified('title')) {
    const slugify = (await import('slugify')).default;
    const baseSlug = slugify(this.title, { lower: true, strict: true });
    const existingCount = await mongoose.model('Article').countDocuments({
      slug: new RegExp(`^${baseSlug}`),
      _id: { $ne: this._id },
    });
    this.slug = existingCount > 0 ? `${baseSlug}-${existingCount}` : baseSlug;
  }
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }
});

articleSchema.index({ title: 'text', content: 'text', tags: 'text' });

export const Article = mongoose.model<IArticle>('Article', articleSchema);