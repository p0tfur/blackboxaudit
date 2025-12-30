<template>
  <div class="fixed inset-x-0 top-4 z-[60] flex justify-end px-4 pointer-events-none">
    <div class="w-full max-w-sm space-y-3">
      <transition-group name="toast" tag="div">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="pointer-events-auto rounded-xl border border-slate-100 bg-white/95 shadow-xl shadow-slate-200/50 backdrop-blur p-4 flex items-start gap-3 animate-toast-pop"
        >
          <div
            class="mt-1 flex h-6 w-6 items-center justify-center rounded-full text-white shrink-0"
            :class="iconWrapperClass(notification.type)"
          >
            <span class="text-xs font-bold">
              {{ notification.type.slice(0, 1).toUpperCase() }}
            </span>
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-slate-900">{{ notification.title }}</p>
            <p class="text-sm text-slate-600 mt-0.5 leading-relaxed">{{ notification.message }}</p>
          </div>
          <button
            class="text-slate-400 hover:text-slate-600 transition-colors p-1"
            type="button"
            @click="removeNotification(notification.id)"
          >
            <span class="sr-only">Close</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotifications } from "~/composables/useNotifications";

const { notifications, removeNotification } = useNotifications();

const iconWrapperClass = (type: string) => {
  switch (type) {
    case "success":
      return "bg-emerald-500 shadow-md shadow-emerald-500/30";
    case "error":
      return "bg-red-500 shadow-md shadow-red-500/30";
    case "warning":
      return "bg-amber-500 shadow-md shadow-amber-500/30";
    default:
      return "bg-brand-500 shadow-md shadow-brand-500/30";
  }
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
