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
      <h1 class="font-display text-3xl font-black bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent mb-6">📅 Encontros Agendados</h1>

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
        <div v-for="m in meetings" :key="m.id" class="card-gold p-5">
          <div class="flex justify-between items-start gap-4">
            <div class="flex-1">
              <h3 class="font-display font-black text-lg text-white">
                {{ m.scout?.displayName }} ↔ {{ m.athlete?.displayName }}
              </h3>
              <div class="flex flex-col gap-2 mt-3 text-sm">
                <div class="flex items-center gap-2 text-white/70">
                  <span>📆</span>
                  <span>{{ new Date(m.scheduledFor).toLocaleString('pt-BR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</span>
                </div>
                <div v-if="m.location" class="flex items-center gap-2 text-white/70">
                  <span>📍</span>
                  <span>{{ m.location }}</span>
                </div>
                <div v-if="m.notes" class="text-white/70">{{ m.notes }}</div>
              </div>
              <div class="mt-3 pt-3 border-t border-white/10">
                <p class="text-xs text-white/50">Código: <span class="font-mono font-bold text-gold-300">{{ m.meetingCode }}</span></p>
              </div>
            </div>
            <span class="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap" :class="{
              'bg-blue-500/30 text-blue-300 border border-blue-400/50': m.status === 'PENDING',
              'bg-green-500/30 text-green-300 border border-green-400/50': m.status === 'CONFIRMED',
              'bg-purple-500/30 text-purple-300 border border-purple-400/50': m.status === 'COMPLETED',
              'bg-red-500/30 text-red-300 border border-red-400/50': m.status === 'CANCELLED',
            }">
              {{ m.status === 'PENDING' ? '⏳ Pendente' : m.status === 'CONFIRMED' ? '✅ Confirmado' : m.status === 'COMPLETED' ? '🏁 Concluído' : '❌ Cancelado' }}
            </span>
          </div>
          <div class="mt-4 pt-4 border-t border-white/10 flex gap-2">
            <button v-if="m.status === 'PENDING'" class="btn-secondary text-xs flex-1">
              Confirmar
            </button>
            <button class="btn-ghost text-xs flex-1">
              {{ m.scoutConfirmed && m.athleteConfirmed ? '✅ Ambos confirmaram' : '⏳ Aguardando' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppShell>
</template>
