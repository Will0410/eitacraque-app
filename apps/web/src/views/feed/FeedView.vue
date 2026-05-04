<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import { FeedTab, type FeedItem, ClipType } from '@eitacraque/shared';
import { feedApi } from '@/api/feed';
import AppShell from '@/components/AppShell.vue';

const tab = ref<FeedTab>(FeedTab.FOR_YOU);
const items = ref<FeedItem[]>([]);
const cursor = ref<string | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const tabs = [
  { value: FeedTab.FOR_YOU, label: 'Pra Você' },
  { value: FeedTab.FOLLOWING, label: 'Seguindo' },
  { value: FeedTab.TRENDING, label: 'Em Alta 🔥' },
];

const clipTypeIcons: Record<ClipType, string> = {
  GOAL: '⚽',
  DRIBBLE: '💨',
  PASS: '🎯',
  DEFENSE: '🛡️',
  SAVE: '🧤',
  ASSIST: '🅰️',
  FREE_KICK: '🔴',
  GENERAL: '📹',
};

const clipTypeLabels: Record<ClipType, string> = {
  GOAL: 'Gol',
  DRIBBLE: 'Drible',
  PASS: 'Passe',
  DEFENSE: 'Defesa',
  SAVE: 'Defesa',
  ASSIST: 'Assistência',
  FREE_KICK: 'Falta',
  GENERAL: 'Lance',
};

function getClipIcon(type: ClipType): string {
  return clipTypeIcons[type] || '⚽';
}

function getClipLabel(type: ClipType): string {
  return clipTypeLabels[type] || 'Lance';
}

async function load(reset = false) {
  loading.value = true;
  error.value = null;
  try {
    const data = await feedApi.list(tab.value, reset ? undefined : cursor.value ?? undefined);
    items.value = reset ? data.items : [...items.value, ...data.items];
    cursor.value = data.nextCursor;
  } catch (err: any) {
    error.value = err?.response?.data?.message ?? 'Falha ao carregar feed';
  } finally {
    loading.value = false;
  }
}

watch(tab, () => load(true));
onMounted(() => load(true));
</script>

<template>
  <AppShell>
    <div class="flex gap-2 mb-4 overflow-x-auto -mx-4 px-4">
      <button
        v-for="t in tabs"
        :key="t.value"
        @click="tab = t.value"
        class="pill whitespace-nowrap px-4 py-1.5 text-sm"
        :class="tab === t.value ? 'bg-white text-brand-900' : 'bg-white/5 text-white/70 hover:bg-white/10'"
      >
        {{ t.label }}
      </button>
    </div>

    <div v-if="loading && items.length === 0" class="text-center text-white/50 py-12">
      Carregando…
    </div>

    <div v-else-if="error" class="text-center text-red-300 py-12">{{ error }}</div>

    <div v-else-if="items.length === 0" class="text-center text-white/50 py-12">
      Nenhum lance ainda. Que tal subir o primeiro?
    </div>

    <div v-else class="space-y-5">
      <article
        v-for="item in items"
        :key="item.clip.id"
        class="card overflow-hidden p-0 group cursor-pointer shadow-xl hover:shadow-2xl"
      >
        <RouterLink :to="`/clip/${item.clip.id}`" class="block">
          <div class="relative aspect-video field-hero">
            <img
              v-if="item.thumbnailUrl"
              :src="item.thumbnailUrl"
              :alt="item.clip.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-7xl opacity-10 bg-gradient-to-br from-brand-600 to-brand-900">⚽</div>

            <!-- Tipo de Lance Badge - Esquerda -->
            <div class="absolute top-4 left-4 flex items-center gap-2 pill bg-white/95 text-brand-900 font-bold border border-white/30 shadow-lg">
              <span class="text-xl">{{ getClipIcon(item.clip.clipType) }}</span>
              <span class="text-xs uppercase tracking-wider">{{ getClipLabel(item.clip.clipType) }}</span>
            </div>

            <!-- IA Score Badge - Direita Superior -->
            <div
              v-if="item.aiOverallScore !== null"
              class="absolute top-4 right-4 pill bg-gradient-to-r from-yellow-300 to-amber-400 text-gray-900 font-bold text-sm shadow-lg border border-yellow-200"
            >
              ⭐ {{ item.aiOverallScore.toFixed(1) }}
            </div>

            <!-- Duração - Canto Inferior Direito -->
            <div v-if="item.clip.durationSeconds" class="absolute bottom-4 right-4 pill bg-black/70 text-white text-xs font-bold backdrop-blur">
              {{ Math.floor(item.clip.durationSeconds / 60) }}:{{ String(item.clip.durationSeconds % 60).padStart(2, '0') }}
            </div>

            <!-- Sobreposição gradient bottom -->
            <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </div>
        </RouterLink>

        <div class="p-5">
          <!-- Atleta Info com Avatar -->
          <div class="flex items-center gap-3 mb-4">
            <RouterLink
              :to="`/athlete/${item.athlete.id}`"
              class="flex items-center gap-3 hover:opacity-80 transition flex-1"
            >
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0 border-2 border-brand-300">
                {{ item.athlete.displayName.charAt(0) }}
              </div>
              <div>
                <p class="text-sm font-bold text-white">{{ item.athlete.displayName }}</p>
                <p class="text-xs text-white/50">{{ new Date(item.clip.createdAt).toLocaleDateString('pt-BR') }}</p>
              </div>
            </RouterLink>
          </div>

          <!-- Título do Lance -->
          <h3 class="font-bold text-base mb-3 line-clamp-2 group-hover:text-brand-300 transition">{{ item.clip.title }}</h3>

          <!-- Contexto de Partida -->
          <div v-if="item.clip.opponent || item.clip.matchDate" class="mb-4 pb-4 border-b border-white/10">
            <div class="flex items-center gap-2 text-sm text-white/70">
              <span class="text-lg">🏟️</span>
              <div>
                <span v-if="item.clip.opponent" class="font-semibold text-white">vs {{ item.clip.opponent }}</span>
                <span v-if="item.clip.matchDate" class="text-white/50 ml-2">
                  {{ new Date(item.clip.matchDate).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Estatísticas -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4 text-sm">
              <div class="flex items-center gap-1.5 text-white/70 hover:text-white transition">
                <span class="text-lg">👁</span>
                <span class="font-semibold">{{ item.clip.views.toLocaleString() }}</span>
              </div>
              <div class="flex items-center gap-1.5 text-white/70 hover:text-white transition">
                <span class="text-lg">❤️</span>
                <span class="font-semibold">{{ item.clip.likes }}</span>
              </div>
              <div v-if="item.communityAverage !== null" class="flex items-center gap-1.5 text-white/70 hover:text-white transition">
                <span class="text-lg">📊</span>
                <span class="font-semibold">{{ item.communityAverage }}</span>
              </div>
            </div>
          </div>
        </div>
      </article>

      <button
        v-if="cursor"
        @click="load(false)"
        :disabled="loading"
        class="btn-ghost w-full"
      >
        {{ loading ? 'Carregando…' : 'Ver mais' }}
      </button>
    </div>
  </AppShell>
</template>
