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
      <h1 class="font-display text-3xl font-black bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent mb-6">⭐ Minhas Avaliações</h1>

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
        <div v-for="r in ratings" :key="r.id" class="card-gold p-5">
          <div class="flex items-start gap-4">
            <div class="w-14 h-14 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ring-2 ring-gold-400/50">
              {{ r.rater?.displayName?.charAt(0) }}
            </div>
            <div class="flex-1">
              <p class="font-display font-black text-lg text-white">{{ r.rater?.displayName }}</p>
              <div class="flex items-center gap-2 mt-1">
                <div class="flex gap-0.5">
                  <span v-for="i in 5" :key="i" class="text-lg">{{ i <= r.rating ? '⭐' : '☆' }}</span>
                </div>
                <span class="font-black text-gold-300 ml-1">{{ r.rating }}/5</span>
              </div>
            </div>
            <span class="text-xs text-white/50 font-semibold">
              {{ new Date(r.createdAt).toLocaleDateString('pt-BR') }}
            </span>
          </div>
          <p v-if="r.comment" class="mt-4 text-white/80 border-t border-white/10 pt-4 italic">{{ r.comment }}</p>
        </div>
      </div>
    </div>
  </AppShell>
</template>
