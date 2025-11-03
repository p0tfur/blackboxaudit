<template>
  <nav class="bg-white shadow-md mb-8">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center py-4">
        <div class="flex items-center">
          <h4 class="text-blue-600 font-medium text-lg m-0">BlackBoxAudit.com Security Audit Tool</h4>
        </div>
        <div class="flex space-x-4">
          <NuxtLink 
            to="/" 
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="[route.path === '/' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100']"
          >
            Home
          </NuxtLink>
          <NuxtLink 
            to="/tips" 
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="[route.path === '/tips' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100']"
          >
            Security Tips
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>