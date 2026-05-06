<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import AppShell from '@/components/AppShell.vue';

const auth = useAuthStore();
const proposals = ref<any[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const res = await fetch('/api/v1/proposals/me', {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    proposals.value = await res.json();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <AppShell>
    <div class="space-y-4">
      <h1 class="font-display text-3xl font-black bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent mb-6">💼 Minhas Propostas</h1>

      <div v-if="loading" class="space-y-4 animate-pulse">
        <div v-for="i in 3" :key="i" class="card p-4">
          <div class="h-6 bg-white/10 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-white/10 rounded w-1/2"></div>
        </div>
      </div>

      <div v-else-if="!proposals.length" class="text-center text-white/60 py-12">
        Nenhuma proposta no momento.
      </div>

      <div v-else class="space-y-4">
        <div v-for="p in proposals" :key="p.id" class="card-gold p-5 border-l-4" :class="p.status === 'ACCEPTED' ? 'border-l-green-400' : p.status === 'REJECTED' ? 'border-l-red-400' : 'border-l-gold-400'">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="font-display font-black text-lg text-white">{{ p.athlete?.displayName }}</h3>
              <p class="text-sm text-white/70 mt-1">{{ p.category }} • {{ p.durationMonths }} meses</p>
              <p v-if="p.monthlyValueCents" class="text-xl font-black text-gold-300 mt-2">
                R$ {{ (p.monthlyValueCents / 100).toLocaleString('pt-BR').split(',')[0] }}/mês
              </p>
              <p class="text-sm text-white/70 mt-3 line-clamp-3">{{ p.message }}</p>
            </div>
            <span class="ml-3 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap" :class="{
              'bg-green-500/30 text-green-300 border border-green-400/50': p.status === 'ACCEPTED',
              'bg-red-500/30 text-red-300 border border-red-400/50': p.status === 'REJECTED',
              'bg-gold-400/30 text-gold-300 border border-gold-400/50': p.status === 'SENT' || p.status === 'DRAFT',
            }">
              {{ p.status === 'ACCEPTED' ? '✅ Aceita' : p.status === 'REJECTED' ? '❌ Rejeitada' : p.status === 'SENT' ? '📤 Enviada' : '📝 Rascunho' }}
            </span>
          </div>
          <div class="mt-4 text-xs text-white/40">
            Criada em {{ new Date(p.createdAt).toLocaleDateString('pt-BR') }}
          </div>
        </div>
      </div>
    </div>
  </AppShell>
</template>
