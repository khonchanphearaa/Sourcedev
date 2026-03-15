<template>
    <Teleport to="body">
        <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="modelValue" class="fixed inset-0 z-90">
                <div class="absolute inset-0 bg-ink/45" @click="close" />

                <div class="relative z-91 min-h-full px-4 py-6 sm:px-6 flex items-center justify-center">
                    <Transition enter-active-class="transition duration-200 ease-out"
                        enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
                        leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 scale-100"
                        leave-to-class="opacity-0 scale-95">
                        <div v-if="modelValue" class="w-full max-w-md rounded-2xl border border-paper-border bg-white shadow-2xl" role="dialog" aria-modal="true" :aria-labelledby="titleId" :aria-describedby="description ? descriptionId : undefined">
                            <div class="px-6 pt-5 pb-3 border-b border-paper-border">
                                <h2 :id="titleId" class="text-xl font-serif text-ink">
                                    {{ title }}
                                </h2>
                            </div>

                            <div class="px-6 py-4">
                                <p v-if="description" :id="descriptionId" class="text-sm text-ink-muted font-sans leading-6"> {{ description }} </p>
                                <slot />
                            </div>

                            <div class="px-6 pb-5 pt-2 flex items-center justify-end gap-3">
                                <button type="button" class="px-4 py-2 cursor-pointer text-sm font-medium text-ink-soft hover:text-ink transition-colors" @click="cancel">
                                    {{ cancelText }}
                                </button>
                                <button type="button" class="px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors" @click="confirm">
                                    {{ confirmText }}
                                </button>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

interface Props {
    modelValue: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
}

const props = withDefaults(defineProps<Props>(), {
    description: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
});

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "confirm"): void;
    (e: "cancel"): void;
}>();

const titleId = `modal-title-${Math.random().toString(36).slice(2, 9)}`;
const descriptionId = `modal-desc-${Math.random().toString(36).slice(2, 9)}`;

const close = () => emit("update:modelValue", false);

const cancel = () => {
    emit("cancel");
    close();
};

const confirm = () => {
    emit("confirm");
    close();
};

const onEsc = (event: KeyboardEvent) => {
    if (event.key === "Escape" && props.modelValue) close();
};

onMounted(() => document.addEventListener("keydown", onEsc));
onUnmounted(() => document.removeEventListener("keydown", onEsc));
</script>
