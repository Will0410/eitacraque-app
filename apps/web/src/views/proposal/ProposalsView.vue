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
    const res = await fetch('/api/v1/proposals', {
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
      <h1 class="text-2xl font-black text-white">💼 Minhas Propostas</h1>

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
        <div v-for="p in proposals" :key="p.id" class="card p-4">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-bold text-white">{{ p.athlete?.displayName }}</h3>
              <p class="text-sm text-white/70">{{ p.category }} • {{ p.durationMonths }} meses</p>
              <p v-if="p.monthlyValueCents" class="text-gold-300 font-semibold mt-1">
                R$ {{ (p.monthlyValueCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}/mês
              </p>
              <p class="text-sm text-white/60 mt-2 line-clamp-2">{{ p.message }}</p>
            </div>
            <span class="pill px-3 py-1" :class="{
              'bg-green-500/20 text-green-300': p.status === 'ACCEPTED',
              'bg-red-500/20 text-red-300': p.status === 'REJECTED',
              'bg-yellow-500/20 text-yellow-300': p.status === 'SENT',
              'bg-gray-500/20 text-gray-300': p.status === 'DRAFT',
            }">
              {{ p.status }}
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
