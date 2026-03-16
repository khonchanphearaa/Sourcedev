import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/composables/useApi'
import type { Article, Tag } from '@/types'

type ArticleStatus = 'draft' | 'published'

interface ListArticlesParams {
	page?: number
	limit?: number
	tag?: string
}

interface SaveArticlePayload {
	title: string
	excerpt: string
	content: string
	coverImage?: string
	linkGithub: string
	tags: string[]
	status: ArticleStatus
}

export const useArticleStore = defineStore('article', () => {
	const loading = ref(false)
	const error = ref<string | null>(null)

	const listArticles = async (params: ListArticlesParams = {}) => {
		loading.value = true
		error.value = null
		try {
			const { data } = await api.get('/articles', { params })
			return {
				articles: (data.articles || []) as Article[],
				pages: Number(data.pages || 1),
				total: Number(data.total || 0),
			}
		} catch (err: unknown) {
			const e = err as { response?: { data?: { message?: string } } }
			error.value = e.response?.data?.message || 'Failed to fetch articles'
			throw err
		} finally {
			loading.value = false
		}
	}

	const listTags = async () => {
		const { data } = await api.get('/articles/tags')
		return (data.tags || []) as Tag[]
	}

	const getArticleBySlug = async (slug: string) => {
		const { data } = await api.get(`/articles/${slug}`)
		return (data?.article ?? data) as Article
	}

	const getArticleById = async (id: string) => {
		const { data } = await api.get(`/articles/id/${id}`)
		return (data?.article ?? data) as Article
	}

	const createArticle = async (payload: SaveArticlePayload) => {
		const { data } = await api.post('/articles', payload)
		return (data?.article ?? data) as Article
	}

	const updateArticle = async (id: string, payload: SaveArticlePayload) => {
		const { data } = await api.put(`/articles/${id}`, payload)
		return (data?.article ?? data) as Article
	}

	const deleteArticle = async (id: string) => {
		await api.delete(`/articles/${id}`)
	}

	const listMyArticles = async () => {
		const { data } = await api.get('/articles/my')
		if (Array.isArray(data)) return data as Article[]
		return (data?.articles || []) as Article[]
	}

	const getArticleCount = async () => {
		const { total } = await listArticles({ limit: 1 })
		return total
	}

	return {
		loading,
		error,
		listArticles,
		listTags,
		getArticleBySlug,
		getArticleById,
		createArticle,
		updateArticle,
		deleteArticle,
		listMyArticles,
		getArticleCount,
	}
})
