<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { Clip, ClipAnalysisResponse } from '@eitacraque/shared';
import { clipsApi } from '@/api/clips';
import AppShell from '@/components/AppShell.vue';

const route = useRoute();
const clip = ref<Clip | null>(null);
const analysis = ref<ClipAnalysisResponse | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const myScore = ref<number>(7);

async function load() {
  loading.value = true;
  try {
    const id = route.params.id as string;
    const [c, a] = await Promise.all([clipsApi.get(id), clipsApi.getAnalysis(id)]);
    clip.value = c;
    analysis.value = a;
  } catch (err: any) {
    error.value = err?.response?.data?.message ?? 'Erro ao carregar';
  } finally {
    loading.value = false;
  }
}

async function rate() {
  if (!clip.value) return;
  await clipsApi.rate(clip.value.id, { score: myScore.value });
  await load();
}

onMounted(load);
</script>

<template>
  <AppShell>
    <div v-if="loading" class="text-center text-white/50 py-12">Carregando…</div>
    <div v-else-if="error" class="text-center text-red-300 py-12">{{ error }}</div>
    <template v-else-if="clip">
      <div class="aspect-video rounded-2xl overflow-hidden bg-black mb-4">
        <iframe
          v-if="clip.muxPlaybackId"
          :src="`https://stream.mux.com/${clip.muxPlaybackId}.m3u8`"
          class="w-full h-full"
          allowfullscreen
        ></iframe>
        <div v-else class="w-full h-full flex items-center justify-center text-white/40">
          Vídeo ainda processando…
        </div>
      </div>

      <h1 class="text-xl font-bold mb-1">{{ clip.title }}</h1>
      <p v-if="clip.description" class="text-white/70 text-sm mb-4">{{ clip.description }}</p>

      <section v-if="analysis?.ai" class="card mb-4">
        <div class="flex items-baseline justify-between mb-3">
          <h2 class="font-bold">Análise IA</h2>
          <span class="text-2xl font-extrabold">{{ analysis.ai.overallScore.toFixed(1) }}</span>
        </div>
        <p class="text-sm text-white/80 mb-3">{{ analysis.ai.summary }}</p>

        <div class="grid grid-cols-2 gap-3 text-sm mb-3">
          <div>
            <div class="text-xs text-white/50 mb-1">Pontos fortes</div>
            <ul class="space-y-1">
              <li v-for="s in analysis.ai.strengths" :key="s">✓ {{ s }}</li>
            </ul>
          </div>
          <div>
            <div class="text-xs text-white/50 mb-1">A melhorar</div>
            <ul class="space-y-1">
              <li v-for="w in analysis.ai.weaknesses" :key="w">→ {{ w }}</li>
            </ul>
          </div>
        </div>

        <div class="space-y-2 mt-4">
          <div
            v-for="a in analysis.ai.attributeScores"
            :key="a.attribute"
            class="flex items-center gap-3 text-xs"
          >
            <span class="w-32 text-white/70">{{ a.attribute }}</span>
            <div class="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div class="h-full bg-white" :style="{ width: `${(a.score / 10) * 100}%` }"></div>
            </div>
            <span class="w-8 text-right font-semibold">{{ a.score.toFixed(1) }}</span>
          </div>
        </div>
      </section>

      <section v-if="analysis" class="card">
        <h2 class="font-bold mb-3">Avaliação da comunidade</h2>
        <div class="flex items-baseline gap-4 mb-4">
          <div>
            <div class="text-3xl font-extrabold">{{ analysis.community.averageScore.toFixed(1) }}</div>
            <div class="text-xs text-white/50">{{ analysis.community.ratingsCount }} avaliações</div>
          </div>
          <div v-if="analysis.community.scoutWeightedAverage > 0">
            <div class="text-xl font-bold text-brand-200">{{ analysis.community.scoutWeightedAverage.toFixed(1) }}</div>
            <div class="text-xs text-white/50">média de olheiros</div>
          </div>
        </div>

        <label class="label">Sua nota: {{ myScore }}</label>
        <input v-model.number="myScore" type="range" min="0" max="10" step="0.5" class="w-full" />
        <button @click="rate" class="btn-secondary w-full mt-3">Enviar avaliação</button>
      </section>
    </template>
  </AppShell>
</template>
