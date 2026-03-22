<template>
    <section class="mt-16 pt-10 border-t border-paper-border">
        <div class="flex items-center gap-3 mb-8">
            <h2 class="font-serif text-2xl text-ink">Comments</h2>
            <span v-if="totalCount > 0"
                class="bg-paper-warm border border-paper-border text-ink-muted text-xs font-semibold font-sans px-2.5 py-1 rounded-full">
                {{ totalCount }}
            </span>
        </div>

        <div v-if="auth.isAuthenticated" class="mb-10">
            <div class="flex gap-3">
                <BaseAvatar :name="auth.user!.name" size="sm" class="shrink-0 mt-1" />
                <div class="flex-1">
                    <textarea v-model="newComment" placeholder="Share your thoughts…" rows="3" maxlength="1000" :class="[ 'w-full px-4 py-3 border rounded-2xl text-sm font-sans text-ink bg-white placeholder-ink-muted focus:outline-none transition-all duration-150 resize-none leading-relaxed',
                        focused ? 'border-ink shadow-sm' : 'border-paper-border' ]" @focus="focused = true" @blur="onBlur" @keydown.ctrl.enter="submit" @keydown.meta.enter="submit" />
                    <Transition enter-active-class="transition duration-150 ease-out"
                        enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0"
                        leave-active-class="transition duration-100" leave-from-class="opacity-100"
                        leave-to-class="opacity-0">
                        <div v-if="focused || newComment.length > 0"
                            class="flex items-center justify-between mt-2 px-1">
                            <span class="text-xs text-ink-muted font-sans">{{ newComment.length }}/1000</span>
                            <div class="flex gap-2">
                                <BaseButton size="sm" variant="ghost" @click="newComment = ''">Clear</BaseButton>
                                <BaseButton size="sm" variant="accent" :loading="submitting" :disabled="!newComment.trim()" @click="submit"> Post comment </BaseButton>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
            <BaseAlert :message="error" class="mt-3" />
        </div>

        <div v-else
            class="mb-10 bg-paper-warm border border-paper-border rounded-2xl px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
            <div>
                <p class="font-sans text-sm font-medium text-ink">Join the conversation</p>
                <p class="font-sans text-xs text-ink-muted mt-0.5">Sign in to comment, reply, and like.</p>
            </div>
            <div class="flex gap-2">
                <RouterLink to="/login">
                    <BaseButton size="sm" variant="outline">Sign in</BaseButton>
                </RouterLink>
                <RouterLink to="/register">
                    <BaseButton size="sm" variant="primary">Create account</BaseButton>
                </RouterLink>
            </div>
        </div>

        <BaseSpinner v-if="loading" />

        <div v-else-if="comments.length > 0" class="flex flex-col gap-6">
            <CommentItem v-for="comment in comments" :key="comment._id" :comment="comment"
                :current-user-id="auth.user?.id" @like="handleLike" @delete="handleDelete" @update="handleUpdate"
                @reply="handleReply" />
        </div>

        <div v-else class="text-center py-10">
            <MessageCircleMore class="mx-auto mb-3" :size="40"/>
            <p class="font-sans text-sm text-ink-muted">No comments yet. Be the first!</p>
        </div>

    </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/composables/useApi'
import { useAuthStore } from '@/stores/auth'
import CommentItem from '@/components/Commentitem.vue'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import { MessageCircleMore } from 'lucide-vue-next';
import type { Comment } from '@/types'

const props = defineProps<{ articleId: string }>()

const auth = useAuthStore()
const comments = ref<Comment[]>([])
const newComment = ref('')
const loading = ref(true)
const submitting = ref(false)
const focused = ref(false)
const error = ref('')

const totalCount = computed(() =>
    comments.value.reduce((sum, c) => sum + 1 + (c.replies?.length ?? 0), 0)
)

const onBlur = () => {
    setTimeout(() => { focused.value = false }, 150)
}

/* GET the comments */
const fetchComments = async () => {
    loading.value = true
    try {
        const { data } = await api.get(`/comments/${props.articleId}`)

        /* ensure likes and replies always exist */
        comments.value = data.comments.map((c: Comment) => ({
            ...c,
            likes: c.likes ?? [],
            replies: (c.replies ?? []).map((r: Comment) => ({
                ...r,
                likes: r.likes ?? [],
            })),
        }))
    } finally {
        loading.value = false
    }
}

/* Post a new comment */
const submit = async () => {
    error.value = ''
    if (!newComment.value.trim()) return
    submitting.value = true
    try {
        const { data } = await api.post(`/comments/${props.articleId}`, {
            content: newComment.value,
        })
        comments.value.push({ ...data.comment, replies: [] })
        newComment.value = ''
    } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } }
        error.value = e.response?.data?.message || 'Failed to post comment.'
    } finally {
        submitting.value = false
    }
}

/* Reply to a comment */
const handleReply = async (parentId: string, content: string) => {
    error.value = ''
    try {
        const { data } = await api.post(`/comments/${props.articleId}`, {
            content,
            parentComment: parentId,
        })
        const parent = comments.value.find(c => c._id === parentId)
        if (parent) {
            if (!parent.replies) parent.replies = []
            parent.replies.push(data.comment)
        }
    } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } }
        error.value = e.response?.data?.message || 'Failed to post reply.'
    }
}

/* Like toggle */
const handleLike = async (id: string) => {
    if (!auth.isAuthenticated) return
    try {
        const { data } = await api.post(`/comments/${id}/like`)
        const uid = auth.user!.id

        for (const c of comments.value) {
            if (c._id === id) {
                c.likes = data.liked
                    ? [...c.likes, uid]
                    : c.likes.filter(l => l !== uid)
                return
            }
            const reply = c.replies?.find(r => r._id === id)
            if (reply) {
                reply.likes = data.liked
                    ? [...reply.likes, uid]
                    : reply.likes.filter(l => l !== uid)
                return
            }
        }
    } catch {  }
}

/* Delete a comment */
const handleDelete = async (id: string) => {
    if (!confirm('Delete this comment?')) return
    try {
        await api.delete(`/comments/${id}`)
        /* Check top-level */
        const topIdx = comments.value.findIndex(c => c._id === id)
        if (topIdx !== -1) { comments.value.splice(topIdx, 1); return }
        /* Check replies */
        for (const c of comments.value) {
            const rIdx = c.replies?.findIndex(r => r._id === id) ?? -1
            if (rIdx !== -1) { c.replies!.splice(rIdx, 1); return }
        }
    } catch {
        error.value = 'Failed to delete comment.'
    }
}

/* Update a comment */
const handleUpdate = async (id: string, content: string) => {
    try {
        const { data } = await api.put(`/comments/${id}`, { content })
        for (const c of comments.value) {
            if (c._id === id) { Object.assign(c, data.comment); return }
            const reply = c.replies?.find(r => r._id === id)
            if (reply) { Object.assign(reply, data.comment); return }
        }
    } catch {
        error.value = 'Failed to update comment.'
    }
}

onMounted(fetchComments)
</script>