<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import AppShell from '@/components/AppShell.vue';

const auth = useAuthStore();
const tracks = ref<any[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const res = await fetch('/api/v1/player-tracks/my', {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    tracks.value = await res.json();
  } finally {
    loading.value = false;
  }
});

async function remove(athleteId: string) {
  await fetch(`/api/v1/player-tracks/athlete/${athleteId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${auth.token}` },
  });
  tracks.value = tracks.value.filter(t => t.athleteId !== athleteId);
}
</script>

<template>
  <AppShell>
    <div class="space-y-4">
      <h1 class="font-display text-3xl font-black bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent mb-6">🎯 Meu Radar de Atletas</h1>

      <div v-if="loading" class="space-y-4 animate-pulse">
        <div v-for="i in 5" :key="i" class="card p-4">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-white/10"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-white/10 rounded w-40"></div>
              <div class="h-3 bg-white/10 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!tracks.length" class="text-center text-white/60 py-12">
        Nenhum jogador no seu radar ainda.
      </div>

      <div v-else class="space-y-4">
        <div v-for="track in tracks" :key="track.id" class="card p-4">
          <div class="flex items-center gap-4">
            <RouterLink :to="`/athlete/${track.athlete.id}`">
              <div class="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-xl text-white font-bold shadow">
                {{ track.athlete.displayName.charAt(0) }}
              </div>
            </RouterLink>
            <div class="flex-1">
              <RouterLink :to="`/athlete/${track.athlete.id}`" class="font-display font-black text-lg text-white hover:text-gold-300">
                {{ track.athlete.displayName }}
              </RouterLink>
              <div class="flex items-center gap-3 mt-2">
                <div class="flex items-center gap-1">
                  <span class="text-xs text-white/60">Prioridade:</span>
                  <div class="flex gap-0.5">
                    <span v-for="i in 5" :key="i" class="w-1.5 h-1.5 rounded-full" :class="i <= track.priority ? 'bg-gold-400' : 'bg-white/10'"></span>
                  </div>
                </div>
                <span v-if="track.potential" class="text-xs text-gold-300 font-semibold">{{ track.potential }}% potencial</span>
              </div>
              <p v-if="track.notes" class="text-sm text-white/70 mt-2 line-clamp-2">{{ track.notes }}</p>
              <div v-if="track.tags?.length" class="flex gap-1 mt-2 flex-wrap">
                <span v-for="tag in track.tags" :key="tag" class="text-xs px-2 py-1 rounded-full bg-gold-400/20 text-gold-300 font-semibold border border-gold-400/30">
                  {{ tag }}
                </span>
              </div>
            </div>
            <button @click="remove(track.athleteId)" class="text-red-400 hover:text-red-300 text-sm font-semibold hover:bg-red-500/10 px-3 py-1.5 rounded-full transition">
              ✕
            </button>
          </div>
          <div class="text-xs text-white/40 mt-2">
            Última vez visto: {{ new Date(track.lastSeenAt).toLocaleDateString('pt-BR') }}
          </div>
        </div>
      </div>
    </div>
  </AppShell>
</template>
