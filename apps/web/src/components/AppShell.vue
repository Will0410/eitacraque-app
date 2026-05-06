<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useOnline } from '@vueuse/core';
import { useAuthStore } from '@/stores/auth';
import { usePwaStore } from '@/stores/pwa';

const auth = useAuthStore();
const pwa = usePwaStore();
const router = useRouter();
const route = useRoute();
const online = useOnline();

const items = computed(() => {
  const base = [
    { to: '/feed', label: 'Feed', icon: '⚽' },
    { to: '/upload', label: 'Postar', icon: '＋', requiresAuth: true },
    { to: auth.user ? `/athlete/${auth.user.id}` : '/login', label: 'Perfil', icon: '👤' },
  ];

  // Adiciona itemextra para olheiros
  if (auth.user && auth.user.accountType === 'SCOUT') {
    base.splice(2, 0, { to: '/my-tracks', label: 'Radar', icon: '🎯' });
  }

  return base;
});

async function logout() {
  await auth.logout();
  router.push('/login');
}

async function installPWA() {
  await pwa.installPWA();
}
</script>

<template>
  <div class="min-h-screen flex flex-col relative z-10">
    <!-- Offline Banner -->
    <Transition name="slide-down">
      <div v-if="!online" class="fixed top-0 inset-x-0 z-50 bg-red-500/90 backdrop-blur-sm border-b border-red-400 py-2 px-4">
        <div class="max-w-2xl mx-auto text-center text-sm font-medium text-white">
          📡 Sem conexão — exibindo conteúdo em cache
        </div>
      </div>
    </Transition>

    <!-- Header -->
    <header class="sticky top-0 z-40 bg-gradient-to-b from-black/50 via-brand-900/30 to-transparent backdrop-blur-md border-b border-white/5" :class="!online && 'mt-10'">
      <div class="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <RouterLink to="/feed" class="flex items-center gap-2 group">
          <div class="text-2xl group-hover:animate-pulse">⚽</div>
          <span class="font-black text-xl tracking-tight bg-gradient-to-r from-brand-300 to-white bg-clip-text text-transparent">
            EitaCraque
          </span>
        </RouterLink>

         <div class="flex items-center gap-2">
           <!-- Scout Quick Links -->
           <div v-if="auth.user && auth.user.accountType === 'SCOUT'" class="flex items-center gap-1">
             <RouterLink to="/my-tracks" class="text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 px-2 py-1.5 rounded-full transition">
               🎯 Radar
             </RouterLink>
             <RouterLink to="/proposals" class="text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 px-2 py-1.5 rounded-full transition">
               💼 Propostas
             </RouterLink>
             <RouterLink to="/meetings" class="text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 px-2 py-1.5 rounded-full transition">
               📅 Encontros
             </RouterLink>
             <RouterLink to="/ratings" class="text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 px-2 py-1.5 rounded-full transition">
               ⭐ Avaliações
             </RouterLink>
           </div>

           <!-- Athlete & Club Links -->
           <div v-else-if="auth.user && (auth.user.accountType === 'ATHLETE' || auth.user.accountType === 'CLUB')" class="flex items-center gap-1">
             <RouterLink to="/proposals" class="text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 px-2 py-1.5 rounded-full transition">
               💼 Propostas
             </RouterLink>
             <RouterLink to="/meetings" class="text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 px-2 py-1.5 rounded-full transition">
               📅 Encontros
             </RouterLink>
           </div>

           <span v-if="auth.user" class="text-sm text-white/70 hidden sm:inline">
             {{ auth.user.displayName }}
           </span>
           <button
             v-if="auth.user"
             @click="logout"
             class="text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-full transition"
           >
             Sair
           </button>
          <button
            v-if="!auth.user"
            @click="installPWA"
            class="text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-full transition border border-white/20"
          >
            Instalar
          </button>
          <RouterLink v-else to="/login" class="btn-primary !py-2 !px-4 text-sm">
            Entrar
          </RouterLink>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-2xl w-full mx-auto px-4 py-6 pb-24 relative">
      <slot />
    </main>

     <!-- Bottom Navigation -->
     <nav class="fixed bottom-0 inset-x-0 z-40 bg-gradient-to-t from-brand-950 via-brand-950/95 to-transparent backdrop-blur-lg border-t border-white/10 pb-safe">
       <div :class="['max-w-2xl mx-auto grid', items.length === 4 ? 'grid-cols-4' : 'grid-cols-3']">
        <RouterLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="relative flex flex-col items-center gap-1 py-4 text-xs font-semibold transition-all duration-200 group"
          :class="{
            'text-brand-300': route.path.startsWith(item.to.split('/').slice(0, 2).join('/')),
            'text-white/50 hover:text-white/80': !route.path.startsWith(item.to.split('/').slice(0, 2).join('/'))
          }"
        >
          <span class="text-2xl leading-none group-hover:scale-110 transition-transform">{{ item.icon }}</span>
          <span class="text-xs">{{ item.label }}</span>
          <div
            v-if="route.path.startsWith(item.to.split('/').slice(0, 2).join('/'))"
            class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-300"
          ></div>
        </RouterLink>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
