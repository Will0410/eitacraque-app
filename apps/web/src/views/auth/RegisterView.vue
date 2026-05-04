<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AccountType } from '@eitacraque/shared';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();

const form = reactive({
  displayName: '',
  email: '',
  password: '',
  accountType: AccountType.ATHLETE as AccountType,
  acceptTerms: false,
});

const loading = ref(false);
const error = ref<string | null>(null);

const accountOptions = [
  { value: AccountType.ATHLETE, label: 'Atleta', desc: 'Quero ser visto' },
  { value: AccountType.SCOUT, label: 'Olheiro', desc: 'Procuro talentos' },
  { value: AccountType.CLUB, label: 'Clube', desc: 'Vamos contratar' },
  { value: AccountType.FAN, label: 'Torcedor', desc: 'Acompanho craques' },
];

async function submit() {
  if (!form.acceptTerms) {
    error.value = 'Aceite os termos para continuar';
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    await auth.register({
      displayName: form.displayName,
      email: form.email,
      password: form.password,
      accountType: form.accountType,
    });
    router.push('/feed');
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Erro ao cadastrar';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-8 relative">
    <!-- Decorative elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-brand-600/10 blur-3xl"></div>
      <div class="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-brand-600/10 blur-3xl"></div>
    </div>

    <div class="w-full max-w-md relative z-10">
      <!-- Logo/Title -->
      <div class="text-center mb-8">
        <div class="text-6xl mb-3">⚽</div>
        <h1 class="text-4xl font-black tracking-tight mb-2">EitaCraque</h1>
        <p class="text-brand-200 font-semibold text-sm">Crie sua conta em segundos</p>
      </div>

      <!-- Card Principal -->
      <div class="card p-0 overflow-hidden">
        <!-- Tabs -->
        <div class="flex border-b border-white/10 bg-white/5">
          <RouterLink
            to="/login"
            class="flex-1 py-4 font-bold text-sm border-b-2 border-transparent text-white/50 text-center hover:text-white transition"
          >
            Entrar
          </RouterLink>
          <button class="flex-1 py-4 font-bold text-sm border-b-2 border-brand-400 text-white">Cadastrar</button>
        </div>

        <!-- Form -->
        <form @submit.prevent="submit" class="p-6 space-y-5">
          <!-- Tipo de Conta -->
          <div>
            <label class="label">🎯 Tipo de conta</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="opt in accountOptions"
                :key="opt.value"
                type="button"
                @click="form.accountType = opt.value"
                class="rounded-lg border px-3 py-2.5 text-left text-xs transition font-semibold"
                :class="
                  form.accountType === opt.value
                    ? 'border-brand-400 bg-brand-600/20 text-white'
                    : 'border-white/10 text-white/70 hover:border-white/30 hover:text-white'
                "
              >
                <div>{{ opt.label }}</div>
                <div class="text-xs font-normal opacity-70">{{ opt.desc }}</div>
              </button>
            </div>
          </div>

          <!-- Nome -->
          <div>
            <label class="label" for="displayName">👤 Nome</label>
            <input
              id="displayName"
              v-model="form.displayName"
              required
              class="input"
              placeholder="Como quer ser chamado"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="label" for="email-r">📧 E-mail</label>
            <input id="email-r" v-model="form.email" type="email" required class="input" placeholder="seu@email.com" />
          </div>

          <!-- Senha -->
          <div>
            <label class="label" for="password-r">🔐 Senha</label>
            <input
              id="password-r"
              v-model="form.password"
              type="password"
              required
              minlength="8"
              class="input"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <!-- Termos -->
          <label class="flex items-start gap-2.5 text-xs text-white/70 p-3 rounded-lg bg-white/5 border border-white/10">
            <input type="checkbox" v-model="form.acceptTerms" class="mt-1 rounded cursor-pointer" />
            <span>
              Li e aceito os
              <a href="#" class="text-brand-300 font-semibold hover:text-brand-200">termos de uso</a>
              e a
              <a href="#" class="text-brand-300 font-semibold hover:text-brand-200">política de privacidade</a>.
            </span>
          </label>

          <!-- Erro -->
          <div v-if="error" class="p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm font-semibold">
            ⚠️ {{ error }}
          </div>

          <!-- Submit -->
          <button type="submit" :disabled="loading" class="btn-primary w-full !py-3 font-bold text-base">
            {{ loading ? '⏳ Cadastrando…' : '✨ Finalizar cadastro' }}
          </button>
        </form>
      </div>

      <!-- Login Link -->
      <p class="text-center text-sm text-white/60 mt-6">
        Já tem conta?
        <RouterLink to="/login" class="text-brand-300 font-bold hover:text-brand-200 transition">Entrar aqui</RouterLink>
      </p>
    </div>
  </div>
</template>
