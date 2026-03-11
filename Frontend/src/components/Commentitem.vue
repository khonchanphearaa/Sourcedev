<template>
    <div>
        <div class="group flex gap-3">
            <BaseAvatar :name="comment.author.name" size="sm" class="shrink-0 mt-0.5" />

            <div class="flex-1 min-w-0">
                <div class="bg-paper-warm border border-paper-border rounded-2xl rounded-tl-sm px-4 py-3">
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                        <span class="font-semibold text-sm text-ink font-sans">{{ comment.author.name }}</span>
                        <span v-if="comment.author.role === 'admin'"
                            class="text-xs bg-accent-light text-accent border border-accent/20 px-1.5 py-0.5 rounded-full font-sans font-semibold">Admin</span>
                        <span class="text-xs text-ink-muted font-sans">{{ timeAgo(comment.createdAt) }}</span>
                        <span v-if="wasEdited" class="text-xs text-ink-muted font-sans italic">(edited)</span>
                    </div>

                    <div v-if="!editing">
                        <p class="text-sm text-ink-soft font-sans leading-relaxed whitespace-pre-wrap">{{
                            comment.content }}</p>
                    </div>

                    <div v-else class="flex flex-col gap-2 mt-2">
                        <textarea v-model="editContent" rows="3" maxlength="1000"
                            class="w-full px-3 py-2 border border-paper-border rounded-lg text-sm font-sans text-ink bg-white focus:outline-none focus:border-ink transition-colors resize-none leading-relaxed"
                            @keydown.ctrl.enter="submitEdit" @keydown.meta.enter="submitEdit" />
                        <div class="flex items-center gap-2">
                            <BaseButton size="sm" variant="primary" :loading="saving" @click="submitEdit">Save
                            </BaseButton>
                            <BaseButton size="sm" variant="ghost" @click="cancelEdit">Cancel</BaseButton>
                            <span class="text-xs text-ink-muted font-sans ml-auto">{{ editContent.length }}/1000</span>
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-1 mt-1.5 px-1">
                    <button @click="$emit('like', comment._id)" :class="[ 'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-sans transition-all duration-150 cursor-pointer', 
                        isLiked ? 'bg-red-50 text-red-500' : 'text-ink-muted hover:bg-paper-warm hover:text-ink']">
                        <svg class="w-3.5 h-3.5" :fill="isLiked ? 'currentColor' : 'none'" viewBox="0 0 24 24"
                            stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{{ comment.likes.length > 0 ? comment.likes.length : '' }}</span>
                        <span>{{ isLiked ? 'Liked' : 'Like' }}</span>
                    </button>

                    <button v-if="!comment.parentComment && auth.isAuthenticated" @click="toggleReply" :class="['flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-sans transition-all duration-150 cursor-pointer',
                        replyOpen ? 'bg-paper-warm text-ink' : 'text-ink-muted hover:bg-paper-warm hover:text-ink']">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        Reply
                        <span v-if="comment.replies?.length" class="text-ink-muted">({{ comment.replies.length
                            }})</span>
                    </button>

                    <!-- Spacer -->
                    <div class="flex-1" />

                    <button v-if="canEdit && !editing" @click="startEdit"
                        class="px-2.5 py-1 rounded-full text-xs text-ink-muted hover:text-ink hover:bg-paper-warm font-sans transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">Edit</button>

                    <button v-if="canDelete" @click="$emit('delete', comment._id)"
                        class="px-2.5 py-1 rounded-full text-xs text-red-400 hover:text-red-600 hover:bg-red-50 font-sans transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">Delete</button>
                </div>

                <Transition enter-active-class="transition duration-200 ease-out"
                    enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
                    leave-to-class="opacity-0">
                    <div v-if="replyOpen" class="mt-3 flex gap-3">
                        <BaseAvatar :name="auth.user!.name" size="xs" class="shrink-0 mt-1" />
                        <div class="flex-1">
                            <textarea v-model="replyContent" :placeholder="`Reply to ${comment.author.name}…`" rows="2" maxlength="1000"
                                class="w-full px-3 py-2 border border-paper-border rounded-xl text-sm font-sans text-ink bg-white placeholder-ink-muted focus:outline-none focus:border-ink transition-colors resize-none leading-relaxed"
                                @keydown.ctrl.enter="submitReply" @keydown.meta.enter="submitReply" ref="replyInputRef" />
                            <div class="flex items-center gap-2 mt-2">
                                <BaseButton size="sm" variant="accent" :loading="replying"
                                    :disabled="!replyContent.trim()" @click="submitReply">Reply</BaseButton>
                                <BaseButton size="sm" variant="ghost" @click="toggleReply">Cancel</BaseButton>
                                <span class="text-xs text-ink-muted font-sans ml-auto">{{ replyContent.length}}/1000</span>
                            </div>
                        </div>
                    </div>
                </Transition>

                <div v-if="comment.replies?.length"
                    class="mt-4 flex flex-col gap-4 pl-2 border-l-2 border-paper-border ml-1">
                    <CommentItem v-for="reply in comment.replies" :key="reply._id" :comment="reply"
                        :current-user-id="currentUserId" @like="$emit('like', $event)" @delete="$emit('delete', $event)"
                        @update="(id: string, content: string) => $emit('update', id, content)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import type { Comment } from '@/types'
defineOptions({ name: 'CommentItem' })

const props = defineProps<{
    comment: Comment
    currentUserId?: string
}>()

const emit = defineEmits<{
    like: [id: string]
    delete: [id: string]
    update: [id: string, content: string]
    reply: [parentId: string, content: string]
}>()

const auth = useAuthStore()
const editing = ref(false)
const saving = ref(false)
const replyOpen = ref(false)
const replying = ref(false)
const editContent = ref(props.comment.content)
const replyContent = ref('')
const replyInputRef = ref<HTMLTextAreaElement>()

const wasEdited = computed(() => props.comment.createdAt !== props.comment.updatedAt)
const isLiked = computed(() => {
    const uid = props.currentUserId
    if (!uid || !props.comment.likes) return false
    return props.comment.likes.includes(uid)
})
const canEdit = computed(() => {
    const uid = props.currentUserId
    const authorId = (props.comment.author as { id?: string; _id?: string }).id || (props.comment.author as { id?: string; _id?: string })._id
    return uid === authorId
})
const canDelete = computed(() => canEdit.value || auth.isAdmin)

const startEdit = () => {
    editContent.value = props.comment.content
    editing.value = true
}
const cancelEdit = () => { editing.value = false }

const submitEdit = async () => {
    if (!editContent.value.trim()) return
    saving.value = true
    emit('update', props.comment._id, editContent.value.trim())
    editing.value = false
    saving.value = false
}

const toggleReply = async () => {
    replyOpen.value = !replyOpen.value
    replyContent.value = ''
    if (replyOpen.value) {
        await nextTick()
        replyInputRef.value?.focus()
    }
}

const submitReply = async () => {
    if (!replyContent.value.trim()) return
    replying.value = true
    emit('reply', props.comment._id, replyContent.value.trim())
    replyContent.value = ''
    replyOpen.value = false
    replying.value = false
}

const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>