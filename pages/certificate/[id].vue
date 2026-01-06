<template>
  <div class="min-h-screen bg-[#f8fafc] py-12 px-4 selection:bg-slate-200 selection:text-slate-900">
    <!-- Background Patterns -->
    <div class="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(#64748b 1px, transparent 1px); background-size: 32px 32px;"></div>

    <div v-if="pending" class="max-w-4xl mx-auto flex justify-center pt-32 relative z-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
    </div>

    <div v-else-if="error" class="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center relative z-10 mt-20">
      <div class="text-slate-400 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 class="text-3xl font-serif font-medium text-slate-900 mb-3">Certificate Not Found</h1>
      <p class="text-slate-500 text-lg">The security certification you requested could not be retrieved.</p>
      <NuxtLink to="/" class="inline-block mt-8 px-8 py-3 bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors font-medium">
        Run New Scan
      </NuxtLink>
    </div>

    <div v-else class="max-w-4xl mx-auto relative z-10">
      <!-- Certificate Container -->
      <div class="bg-white relative overflow-hidden shadow-2xl shadow-slate-200/50 print:shadow-none">
        
        <!-- Decorative Border (Guilloche-ish) -->
        <div class="absolute inset-0 border-[16px] border-double border-slate-100 pointer-events-none z-20"></div>
        <div class="absolute inset-0 border-[1px] border-slate-200 pointer-events-none z-20 m-4"></div>

        <!-- Header -->
        <div class="bg-white p-12 pb-6 text-center relative z-10">
          <div class="mb-6 flex justify-center">
            <div class="h-16 w-16 bg-slate-900 text-white flex items-center justify-center rounded">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                 <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
               </svg>
            </div>
          </div>
          <h2 class="text-sm font-bold tracking-[0.2em] text-slate-400 uppercase mb-2">BlackBoxAudit.com</h2>
          <h1 class="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight">Certificate of Security</h1>
        </div>

        <!-- Body -->
        <div class="px-12 py-8 relative z-10">
           <div class="flex flex-col items-center">
              <h3 class="text-2xl md:text-3xl font-bold text-slate-900 mb-8 border-b-2 border-slate-100 pb-2 px-8">{{ cert.scan.url }}</h3>
              
              <div class="flex flex-col md:flex-row gap-12 items-center justify-center w-full mb-12">
                  <!-- Score Box -->
                  <div class="text-center p-6 bg-slate-50 rounded border border-slate-100 min-w-[200px]">
                      <span class="block text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Security Score</span>
                      <span class="block text-6xl font-serif font-medium" :class="scoreTextColor">{{ cert.scan.score }}<span class="text-3xl text-slate-400">/100</span></span>
                  </div>

                  <!-- Date Box -->
                  <div class="text-center p-6 min-w-[200px]">
                       <span class="block text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Audit Date</span>
                       <span class="block text-xl text-slate-900 font-medium">{{ formatDate(cert.scan.createdAt) }}</span>
                       <span class="block text-sm text-slate-400 mt-1">ID: {{ cert.certificate.id.slice(0,8) }}</span>
                  </div>
              </div>

              <div class="max-w-2xl mx-auto text-center">
                  <p class="text-slate-600 leading-relaxed">
                    This website has undergone a comprehensive security audit performed by BlackBoxAudit.com. 
                    The automated analysis covered critical security headers, content safety policies, SSL/TLS configuration, and vulnerability scanning.
                  </p>
              </div>
           </div>
        </div>

        <!-- Footer -->
        <div class="p-12 pt-6 flex flex-col md:flex-row justify-between items-end relative z-10">
           <div class="text-left">
              <!-- Handwritten Signature -->
              <svg class="h-12 w-auto mb-3" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="5" y="30" font-family="'Brush Script MT', 'Segoe Script', cursive" font-size="28" fill="#1e293b" font-style="italic">BlackBoxAudit</text>
                <path d="M5 35 Q50 32 195 35" stroke="#1e293b" stroke-width="1" fill="none" opacity="0.4"/>
              </svg>
              <div class="border-t border-slate-300 w-48 pt-2">
                 <p class="text-xs font-bold text-slate-900 uppercase">Verification Authority</p>
                 <p class="text-xs text-slate-500">BlackBoxAudit Automated System</p>
              </div>
           </div>
           
           <div class="mt-8 md:mt-0">
               <!-- Gold Seal -->
               <div class="h-32 w-32 rounded-full bg-gradient-to-br from-amber-200 to-amber-500 relative flex items-center justify-center p-1 shadow-lg">
                   <div class="absolute inset-0 border-4 border-amber-600/20 rounded-full m-1"></div>
                   <div class="absolute inset-0 border-dotted border-2 border-amber-700/40 rounded-full m-2"></div>
                   <div class="bg-white/90 h-full w-full rounded-full flex items-center justify-center flex-col text-center shadow-inner">
                       <span class="text-[10px] uppercase font-bold tracking-widest text-amber-800 mb-0.5" style="writing-mode: horizontal-tb;">Verified</span>
                       <span class="text-3xl font-serif font-black text-amber-600">{{ cert.scan.score }}</span>
                       <span class="text-[8px] uppercase font-bold text-amber-700 mt-0.5">Security Score</span>
                   </div>
               </div>
           </div>
        </div>
        
      </div>
      
      <div class="text-center mt-8 print:hidden">
         <button onclick="window.print()" class="text-slate-500 hover:text-slate-800 font-medium text-sm flex items-center justify-center gap-2 mx-auto">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
           Print Certificate
         </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { data: cert, pending, error } = await useFetch(`/api/certificates/${route.params.id}`);

const scoreTextColor = computed(() => {
  const score = cert.value?.scan?.score || 0;
  if (score >= 90) return 'text-emerald-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-red-600';
});

const securityGrade = computed(() => {
  const score = cert.value?.scan?.score || 0;
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Poor';
});


const formatDate = (dateValue: string | number) => {
  return new Date(dateValue).toLocaleString(undefined, {
    dateStyle: 'long',
    timeStyle: 'short'
  });
};
</script>
