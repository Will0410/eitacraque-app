<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { AthleteProfileResponse } from '@eitacraque/shared';
import { usersApi } from '@/api/users';
import AppShell from '@/components/AppShell.vue';

const route = useRoute();
const data = ref<AthleteProfileResponse | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

async function load() {
  loading.value = true;
  try {
    data.value = await usersApi.getAthlete(route.params.id as string);
  } catch (err: any) {
    error.value = err?.response?.data?.message ?? 'Atleta não encontrado';
  } finally {
    loading.value = false;
  }
}

watch(() => route.params.id, load);
onMounted(load);
</script>

<template>
  <AppShell>
    <div v-if="loading" class="text-center text-white/50 py-12">Carregando…</div>
    <div v-else-if="error" class="text-center text-red-300 py-12">{{ error }}</div>
    <template v-else-if="data">
      <header class="flex items-center gap-4 mb-6">
        <div class="w-20 h-20 rounded-full bg-brand-700 flex items-center justify-center text-2xl font-bold" :class="data.profile.nationalPercentile > 75 ? 'ring-2 ring-gold-400' : ''">
          {{ data.user.displayName.charAt(0) }}
        </div>
        <div>
          <h1 class="font-display text-xl font-black">{{ data.user.displayName }}</h1>
          <p class="text-sm text-white/60">
            {{ data.profile.position ?? '—' }}
            <span v-if="data.profile.category">· {{ data.profile.category }}</span>
            <span v-if="data.profile.city">· {{ data.profile.city }}/{{ data.profile.state }}</span>
          </p>
        </div>
      </header>

      <div class="grid grid-cols-3 gap-3 mb-6">
        <div class="card text-center">
          <div class="font-display font-black text-3xl">{{ data.recentClipsCount }}</div>
          <div class="text-xs text-white/50 mt-1">vídeos</div>
        </div>
        <div class="card text-center">
          <div class="font-display font-black text-3xl text-gold-300">{{ data.profile.overallRating.toFixed(1) }}</div>
          <div class="text-xs text-white/50 mt-1">média geral</div>
        </div>
        <div class="card text-center">
          <div class="font-display font-black text-3xl text-gold-300">{{ data.profile.nationalPercentile.toFixed(0) }}%</div>
          <div class="text-xs text-white/50 mt-1">percentil</div>
        </div>
      </div>

      <p v-if="data.profile.bio" class="text-sm text-white/80 mb-6">{{ data.profile.bio }}</p>

      <section v-if="data.radar.length" class="card-gold mb-4">
        <h2 class="font-bold mb-3">Radar de atributos</h2>
        <div
          v-for="a in data.radar"
          :key="a.attribute"
          class="flex items-center gap-3 text-xs mb-2"
        >
          <span class="w-32 text-white/70">{{ a.attribute }}</span>
          <div class="progress-bar-gold flex-1">
            <div class="progress-bar-gold-fill" :style="{ width: `${(a.score / 10) * 100}%` }"></div>
          </div>
          <span class="w-8 text-right font-semibold text-gold-300">{{ a.score.toFixed(1) }}</span>
        </div>
      </section>
    </template>
  </AppShell>
</template>
