<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import AppShell from '@/components/AppShell.vue';

const auth = useAuthStore();
const ratings = ref<any[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const res = await fetch('/api/v1/scout-ratings/scout/' + auth.user?.id, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    ratings.value = await res.json();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <AppShell>
    <div class="space-y-4">
      <h1 class="text-2xl font-black text-white">⭐ Minhas Avaliações</h1>

      <div v-if="loading" class="space-y-4 animate-pulse">
        <div v-for="i in 3" :key="i" class="card p-4">
          <div class="h-6 bg-white/10 rounded w-2/3 mb-2"></div>
          <div class="h-4 bg-white/10 rounded w-1/2"></div>
        </div>
      </div>

      <div v-else-if="!ratings.length" class="text-center text-white/60 py-12">
        Você ainda não recebeu avaliações.
      </div>

      <div v-else class="space-y-4">
        <div v-for="r in ratings" :key="r.id" class="card p-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white font-bold">
              {{ r.rater?.displayName?.charAt(0) }}
            </div>
            <div>
              <p class="font-bold text-white">{{ r.rater?.displayName }}</p>
              <p class="text-gold-300 font-semibold">{{ r.rating }}/5</p>
            </div>
            <span class="ml-auto text-xs text-white/40">
              {{ new Date(r.createdAt).toLocaleDateString('pt-BR') }}
            </span>
          </div>
          <p v-if="r.comment" class="mt-3 text-white/80 border-t border-white/10 pt-3">{{ r.comment }}</p>
        </div>
      </div>
    </div>
  </AppShell>
</template>
