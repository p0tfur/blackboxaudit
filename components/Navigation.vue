<template>
  <nav class="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-lg bg-white/90">
    <div class="container mx-auto px-4 max-w-5xl">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div
            class="bg-brand-600 text-white p-1.5 rounded-lg group-hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <span class="text-lg font-display font-bold text-slate-900 tracking-tight"
            >BlackBoxAudit<span class="text-brand-600">.com</span></span
          >
        </NuxtLink>

        <!-- Navigation Links -->
        <div class="flex items-center space-x-1">
          <NuxtLink
            to="/"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            :class="[
              route.path === '/'
                ? 'bg-slate-100 text-brand-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
            ]"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/tips"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            :class="[
              route.path === '/tips'
                ? 'bg-slate-100 text-brand-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
            ]"
          >
            Security Tips
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();
</script>
