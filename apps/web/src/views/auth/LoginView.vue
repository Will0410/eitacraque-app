<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const form = reactive({ email: '', password: '' });
const loading = ref(false);
const error = ref<string | null>(null);

async function submit() {
  loading.value = true;
  error.value = null;
  try {
    await auth.login(form);
    const redirect = (route.query.redirect as string) || '/feed';
    router.push(redirect);
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Não foi possível entrar. Verifique seus dados.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 relative">
    <!-- Decorative elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-brand-600/10 blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-brand-600/10 blur-3xl"></div>
    </div>

    <div class="w-full max-w-sm relative z-10">
      <!-- Logo/Title -->
      <div class="text-center mb-10">
        <div class="text-7xl mb-4 drop-shadow-2xl">⚽</div>
        <h1 class="font-display text-4xl font-black tracking-tight mb-2">EitaCraque</h1>
        <p class="text-gold-300 font-semibold text-sm">Sua vitrine. O olheiro que vê.</p>
      </div>

      <!-- Card Principal -->
      <div class="card-gold p-0 overflow-hidden">
        <!-- Tabs -->
        <div class="flex border-b border-white/10 bg-white/5">
          <button class="flex-1 py-4 font-bold text-sm border-b-2 border-gold-400 text-white">Entrar</button>
          <RouterLink
            to="/register"
            class="flex-1 py-4 font-bold text-sm border-b-2 border-transparent text-white/50 text-center hover:text-white transition"
          >
            Cadastrar
          </RouterLink>
        </div>

        <!-- Form -->
        <form @submit.prevent="submit" class="p-6 space-y-5">
          <!-- Email -->
          <div>
            <label class="label" for="email">📧 E-mail</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              class="input"
              placeholder="seu@email.com"
            />
          </div>

          <!-- Senha -->
          <div>
            <label class="label" for="password">🔐 Senha</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              autocomplete="current-password"
              class="input"
              placeholder="••••••••"
            />
          </div>

          <!-- Erro -->
          <div v-if="error" class="p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm font-semibold">
            ⚠️ {{ error }}
          </div>

          <!-- Submit -->
          <button type="submit" :disabled="loading" class="btn-primary w-full !py-3 font-bold text-base">
            {{ loading ? '⏳ Entrando…' : '▶️ Entrar' }}
          </button>
        </form>
      </div>

      <!-- Signup Link -->
      <p class="text-center text-sm text-white/60 mt-6">
        Ainda não tem conta?
        <RouterLink to="/register" class="text-gold-300 font-bold hover:text-gold-200 transition">
          Cadastrar aqui
        </RouterLink>
      </p>
    </div>
  </div>
</template>
