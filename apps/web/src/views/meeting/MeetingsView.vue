<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import AppShell from '@/components/AppShell.vue';

const auth = useAuthStore();
const meetings = ref<any[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    // Try both endpoints depending on role
    const [scoutRes, athleteRes] = await Promise.all([
      fetch('/api/v1/meetings/my-scout', { headers: { Authorization: `Bearer ${auth.token}` } }),
      fetch('/api/v1/meetings/my-athlete', { headers: { Authorization: `Bearer ${auth.token}` } }),
    ]);
    const [scoutData, athleteData] = await Promise.all([scoutRes.json(), athleteRes.json()]);
    meetings.value = [...scoutData, ...athleteData];
    meetings.value.sort((a, b) => new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime());
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <AppShell>
    <div class="space-y-4">
      <h1 class="text-2xl font-black text-white">📅 Encontros</h1>

      <div v-if="loading" class="space-y-4 animate-pulse">
        <div v-for="i in 3" :key="i" class="card p-4">
          <div class="h-6 bg-white/10 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-white/10 rounded w-1/2"></div>
        </div>
      </div>

      <div v-else-if="!meetings.length" class="text-center text-white/60 py-12">
        Nenhum encontro agendado.
      </div>

      <div v-else class="space-y-4">
        <div v-for="m in meetings" :key="m.id" class="card p-4">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-bold text-white">
                {{ m.scout?.displayName }} ↔ {{ m.athlete?.displayName }}
              </h3>
              <p class="text-sm text-white/70">
                📆 {{ new Date(m.scheduledFor).toLocaleString('pt-BR') }}
              </p>
              <p v-if="m.location" class="text-sm text-white/70">📍 {{ m.location }}</p>
              <p v-if="m.notes" class="text-sm text-white/70 mt-1">{{ m.notes }}</p>
              <p class="text-xs text-white/50 mt-2">
                Código: <span class="font-mono font-bold">{{ m.meetingCode }}</span>
              </p>
            </div>
            <span class="pill px-3 py-1" :class="{
              'bg-blue-500/20 text-blue-300': m.status === 'PENDING',
              'bg-green-500/20 text-green-300': m.status === 'CONFIRMED',
              'bg-purple-500/20 text-purple-300': m.status === 'COMPLETED',
              'bg-red-500/20 text-red-300': m.status === 'CANCELLED',
            }">
              {{ m.status }}
            </span>
          </div>
          <div class="mt-3 flex gap-2">
            <button v-if="m.status === 'PENDING'" class="btn-ghost text-xs py-2 px-3">
              Confirmar
            </button>
            <button class="btn-ghost text-xs py-2 px-3">
              {{ m.scoutConfirmed && m.athleteConfirmed ? '✅ Ambos confirmaram' : '⏳ Aguardando confirmação' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppShell>
</template>
