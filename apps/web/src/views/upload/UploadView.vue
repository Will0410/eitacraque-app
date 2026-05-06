<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ClipType, Position } from '@eitacraque/shared';
import { clipsApi } from '@/api/clips';
import AppShell from '@/components/AppShell.vue';

const router = useRouter();

const step = ref<1 | 2 | 3>(1);
const file = ref<File | null>(null);
const upload = ref<{ uploadUrl: string; uploadId: string; clipId: string } | null>(null);
const progress = ref(0);
const error = ref<string | null>(null);

const meta = reactive({
  title: '',
  description: '',
  clipType: ClipType.GENERAL as ClipType,
  position: undefined as Position | undefined,
  matchDate: '',
  opponent: '',
});

const clipTypeOptions = [
  { value: ClipType.GOAL, label: 'Gol' },
  { value: ClipType.DRIBBLE, label: 'Drible' },
  { value: ClipType.PASS, label: 'Passe' },
  { value: ClipType.DEFENSE, label: 'Defesa' },
  { value: ClipType.SAVE, label: 'Defesa de gol' },
  { value: ClipType.ASSIST, label: 'Assistência' },
  { value: ClipType.FREE_KICK, label: 'Falta' },
  { value: ClipType.GENERAL, label: 'Outro' },
];

function pickFile(e: Event) {
  const input = e.target as HTMLInputElement;
  const selectedFile = input.files?.[0];

  if (selectedFile) {
    const maxSize = 500 * 1024 * 1024; // 500 MB
    if (selectedFile.size > maxSize) {
      error.value = 'Vídeo muito grande (máximo 500 MB)';
      return;
    }

    if (!selectedFile.type.startsWith('video/')) {
      error.value = 'Selecione um arquivo de vídeo válido';
      return;
    }

    error.value = null;
  }

  file.value = selectedFile ?? null;
}

async function next() {
  error.value = null;
  if (step.value === 1) {
    if (!file.value) return (error.value = 'Selecione um vídeo');

    const maxSize = 500 * 1024 * 1024;
    if (file.value.size > maxSize) {
      return (error.value = 'Vídeo muito grande (máximo 500 MB)');
    }

    if (!file.value.type.startsWith('video/')) {
      return (error.value = 'Arquivo deve ser um vídeo');
    }

    if (!meta.title.trim()) meta.title = file.value.name.replace(/\.[^.]+$/, '');
    step.value = 2;
    return;
  }
  if (step.value === 2) {
    try {
      const created = await clipsApi.createUpload({
        title: meta.title,
        description: meta.description || undefined,
        clipType: meta.clipType,
        position: meta.position,
        matchDate: meta.matchDate || undefined,
        opponent: meta.opponent || undefined,
      });
      upload.value = {
        uploadUrl: created.muxUploadUrl,
        uploadId: created.muxUploadId,
        clipId: created.clip.id,
      };
      step.value = 3;
      await sendToMux();
    } catch (err: any) {
      error.value = err?.response?.data?.message ?? 'Falha ao criar upload';
    }
  }
}

async function sendToMux() {
  if (!file.value || !upload.value) return;
  const xhr = new XMLHttpRequest();
  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) progress.value = Math.round((e.loaded / e.total) * 100);
  };
  xhr.onload = async () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        await clipsApi.finalize(upload.value!.uploadId);
        setTimeout(() => router.push(`/clip/${upload.value!.clipId}`), 1200);
      } catch (err: any) {
        error.value = err?.response?.data?.message ?? 'Falha ao finalizar';
      }
    } else {
      error.value = `Upload falhou (HTTP ${xhr.status})`;
    }
  };
  xhr.onerror = () => (error.value = 'Erro de rede no upload');
  xhr.open('PUT', upload.value.uploadUrl);
  xhr.send(file.value);
}
</script>

<template>
  <AppShell>
    <h1 class="font-display text-2xl font-black mb-6">🎬 Postar Novo Lance</h1>
    <!-- Step indicator -->
    <div class="flex items-center justify-center gap-3 mb-8">
      <div v-for="i in 3" :key="i" class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full flex items-center justify-center font-black" :class="step >= i ? 'bg-gold-400 text-brand-900' : 'bg-white/10 text-white/50'">
          {{ i }}
        </div>
        <span v-if="i < 3" class="w-8 h-0.5 rounded-full" :class="step > i ? 'bg-gold-400' : 'bg-white/10'"></span>
      </div>
    </div>

    <div v-if="step === 1" class="space-y-4">
      <label class="block card cursor-pointer text-center py-12">
        <input type="file" accept="video/*" @change="pickFile" class="hidden" />
        <div class="text-4xl mb-2">🎬</div>
        <div class="font-semibold">{{ file ? file.name : 'Selecione um vídeo (até 60s)' }}</div>
        <div class="text-xs text-white/50 mt-1">MP4, MOV ou WebM</div>
      </label>
    </div>

    <div v-else-if="step === 2" class="space-y-4">
      <div>
        <label class="label">Título</label>
        <input v-model="meta.title" class="input" placeholder="Ex.: Gol de chapéu" />
      </div>
      <div>
        <label class="label">Tipo de lance</label>
        <select v-model="meta.clipType" class="input">
          <option v-for="o in clipTypeOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="label">Data</label>
          <input v-model="meta.matchDate" type="date" class="input" />
        </div>
        <div>
          <label class="label">Adversário</label>
          <input v-model="meta.opponent" class="input" placeholder="Opcional" />
        </div>
      </div>
      <div>
        <label class="label">Descrição</label>
        <textarea v-model="meta.description" rows="3" class="input" placeholder="Conte o contexto do lance"></textarea>
      </div>
    </div>

    <div v-else class="space-y-4">
      <div class="card text-center py-8">
        <div class="text-4xl mb-3">{{ progress < 100 ? '⏫' : '🤖' }}</div>
        <div class="font-semibold mb-2">
          {{ progress < 100 ? `Enviando vídeo… ${progress}%` : 'Processando com IA…' }}
        </div>
        <div class="progress-bar-gold">
          <div class="progress-bar-gold-fill transition-all" :style="{ width: `${Math.max(progress, 5)}%` }"></div>
        </div>
        <p class="text-xs text-white/50 mt-4">
          Você será redirecionado quando a análise estiver pronta.
        </p>
      </div>
    </div>

    <p v-if="error" class="text-red-300 text-sm mt-4">{{ error }}</p>

    <div v-if="step < 3" class="flex gap-3 mt-6">
      <button v-if="step > 1" @click="step = (step - 1) as 1 | 2 | 3" class="btn-ghost flex-1">
        Voltar
      </button>
      <button @click="next" class="btn-primary flex-1">
        {{ step === 2 ? 'Enviar' : 'Continuar' }}
      </button>
    </div>
  </AppShell>
</template>
