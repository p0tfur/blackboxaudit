<template>
  <div
    class="min-h-screen bg-slate-50 font-body text-slate-900 antialiased selection:bg-brand-100 selection:text-brand-900 flex flex-col"
  >
    <Navigation />
    <NotificationsTray />
    <NuxtPage class="flex-grow" />
    <Footer />
  </div>
</template>
