<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AppShell from '@/components/AppShell.vue';

const route = useRoute();
const auth = useAuthStore();
const scoutId = route.params.id as string;

const scout = ref<any>(null);
const ratings = ref<any[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const [scoutRes, ratingsRes] = await Promise.all([
      fetch(`/api/v1/scouts/${scoutId}`).then(r => r.json()),
      fetch(`/api/v1/scout-ratings/scout/${scoutId}`).then(r => r.json()),
    ]);
    scout.value = scoutRes;
    ratings.value = ratingsRes;
  } finally {
    loading.value = false;
  }
});

const averageRating = computed(() => {
  if (!ratings.value.length) return 0;
  const sum = ratings.value.reduce((s, r) => s + r.rating, 0);
  return (sum / ratings.value.length).toFixed(1);
});
</script>

<template>
  <AppShell>
    <div v-if="loading" class="space-y-4 animate-pulse">
      <div class="h-32 bg-white/10 rounded-2xl"></div>
      <div class="h-24 bg-white/10 rounded-xl"></div>
    </div>

    <div v-else-if="scout" class="space-y-6">
      <!-- Profile Header -->
      <div class="card-gold p-6 rounded-2xl">
        <div class="flex items-center gap-4">
          <div class="w-20 h-20 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-3xl text-white font-bold shadow-lg">
            {{ scout.displayName?.charAt(0) || '👤' }}
          </div>
          <div class="flex-1">
            <h1 class="text-2xl font-black text-white">{{ scout.displayName }}</h1>
            <p class="text-white/70">{{ scout.organizationName || 'Olheiro independente' }}</p>
            <div class="flex items-center gap-2 mt-2">
              <span class="text-gold-300 font-bold">⭐ {{ averageRating }}</span>
              <span class="text-white/50 text-sm">({{ ratings.length }} avaliações)</span>
            </div>
          </div>
        </div>
        <p v-if="scout.bio" class="mt-4 text-white/80">{{ scout.bio }}</p>
        <div v-if="scout.regions?.length" class="mt-3 flex gap-2 flex-wrap">
          <span v-for="r in scout.regions" :key="r" class="pill bg-white/10 text-white text-xs">{{ r }}</span>
        </div>
        <div v-if="scout.cartolaId || scout.brasfutId" class="mt-3 text-sm text-white/60 space-y-1">
          <p v-if="scout.cartolaId">Cartola ID: {{ scout.cartolaId }}</p>
          <p v-if="scout.brasfutId">Brasfut ID: {{ scout.brasfutId }}</p>
        </div>
      </div>

      <!-- Ratings List -->
      <section class="space-y-4">
        <h2 class="text-lg font-bold text-white">Avaliações Recebidas</h2>
        <div v-if="!ratings.length" class="text-white/50 text-center py-8">
          Nenhuma avaliação ainda.
        </div>
        <div v-for="r in ratings" :key="r.id" class="card p-4">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
              {{ r.rater.displayName?.charAt(0) }}
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <span class="font-bold text-white">{{ r.rater.displayName }}</span>
                <span class="text-gold-300 font-bold">{{ r.rating }}/5</span>
              </div>
              <p v-if="r.comment" class="text-white/70 text-sm mt-2">{{ r.comment }}</p>
              <p class="text-white/40 text-xs mt-2">{{ new Date(r.createdAt).toLocaleDateString('pt-BR') }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div v-else class="text-center text-white/60 py-12">
      Olheiro não encontrado.
    </div>
  </AppShell>
</template>
