<template>
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
    <div class="mb-6 flex items-start justify-between">
       <div>
         <h3 class="text-xl font-bold text-slate-900">Get Verification Badge</h3>
         <p class="text-slate-500 mt-1">Enhance your site's trust by displaying your security score.</p>
       </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Configuration -->
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Select Badge Style</label>
          <div class="grid grid-cols-3 gap-3">
            <button 
              v-for="s in styles" 
              :key="s.value"
              @click="style = s.value"
              class="p-3 rounded-lg border transition-all text-left"
              :class="style === s.value ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'"
            >
              <div class="flex items-center gap-2 mb-1">
                <div class="h-3 w-3 rounded-full border-2 flex items-center justify-center" :class="style === s.value ? 'border-blue-600' : 'border-slate-400'">
                   <div v-show="style === s.value" class="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                </div>
                <span class="font-semibold text-sm" :class="style === s.value ? 'text-blue-700' : 'text-slate-700'">{{ s.label }}</span>
              </div>
              <p class="text-xs text-slate-500 pl-5">{{ s.desc }}</p>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Live Preview</label>
          <div class="p-8 bg-slate-50 rounded-xl border border-slate-200 border-dashed flex items-center justify-center min-h-[140px] shadow-inner">
            <img :src="badgeUrl" alt="Security Badge" class="max-w-full shadow-sm" />
          </div>
        </div>
      </div>

      <!-- Code Snippet -->
      <div class="space-y-4">
        <label class="block text-sm font-medium text-slate-700">HTML Embed Code</label>
        <p class="text-xs text-slate-500">
          Paste this snippet into your website's footer or security page to display the badge.
        </p>
        
        <div class="relative group">
          <textarea 
            readonly
            class="w-full h-36 p-4 bg-slate-900 text-blue-100 font-mono text-xs rounded-lg focus:outline-none resize-none shadow-inner border border-slate-800"
            :value="embedCode"
            @focus="$event.target.select()"
          ></textarea>
          <button 
            @click="copyCode"
            class="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-white text-xs px-2.5 py-1.5 rounded transition-colors font-medium border border-white/10"
          >
            {{ copied ? 'Copied!' : 'Copy Snippet' }}
          </button>
        </div>

        <div class="bg-blue-50 border border-blue-100 text-blue-800 text-xs p-4 rounded-lg flex gap-3 items-start">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <p>
            When visitors click this badge, they are directed to your dedicated <a :href="certUrl" target="_blank" class="underline font-semibold hover:text-blue-900">Certificate Page</a> which validates the scan date and authenticity.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
  certificateId: {
    type: String,
    required: true
  }
});

const styles = [
  { label: 'Shield', value: 'shield', desc: 'Premium badge with logo' },
  { label: 'Compact', value: 'compact', desc: 'Minimal horizontal bar' },
  { label: 'Seal', value: 'seal', desc: 'Circular trust stamp' }
];

const style = ref('shield');
const copied = ref(false);

// In a real app, use runtime config for base URL. Assuming window.location here for client-side.
const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

const badgeUrl = computed(() => {
  return `${baseUrl}/api/badges/${props.certificateId}?style=${style.value}`;
});

const certUrl = computed(() => {
  return `${baseUrl}/certificate/${props.certificateId}`;
});

const embedCode = computed(() => {
  return `<a href="${certUrl.value}" target="_blank" rel="noopener noreferrer">
  <img src="${badgeUrl.value}" alt="BlackBoxAudit Security Score" />
</a>`;
});

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(embedCode.value);
    copied.value = true;
    setTimeout(() => copied.value = false, 2000);
  } catch (err) {
    console.error('Failed to copy', err);
  }
};
</script>
