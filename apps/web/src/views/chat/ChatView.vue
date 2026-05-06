<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { chatApi, type Message } from '@/api/chat';
import AppShell from '@/components/AppShell.vue';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const messages = ref<Message[]>([]);
const loading = ref(true);
const sending = ref(false);
const newMessage = ref('');
const messagesContainer = ref<HTMLElement>();

const userId = computed(() => route.params.userId as string);

// Mock data - usando nome genérico já que não temos endpoint
const contactName = ref('Contato');

onMounted(async () => {
  loading.value = true;
  try {
    messages.value = await chatApi.getMessages(userId.value);
  } finally {
    loading.value = false;
    await scrollToBottom();
  }
});

async function scrollToBottom() {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

async function sendMessage() {
  if (!newMessage.value.trim()) return;

  sending.value = true;
  try {
    const msg = await chatApi.sendMessage(userId.value, newMessage.value);
    messages.value.push(msg);
    newMessage.value = '';
    await scrollToBottom();
  } catch (err) {
    console.error('Erro ao enviar mensagem:', err);
  } finally {
    sending.value = false;
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}
</script>

<template>
  <AppShell>
    <div class="h-screen flex flex-col pb-24">
      <!-- Header -->
      <div class="sticky top-0 z-30 bg-gradient-to-b from-brand-900/50 via-brand-900/30 to-transparent backdrop-blur-md border-b border-white/5 px-4 py-4 mb-4">
        <div class="flex items-center gap-3">
          <button @click="router.push('/chat')" class="text-xl hover:text-brand-300 transition">
            ←
          </button>
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white font-bold flex-shrink-0">
            {{ contactName.charAt(0) }}
          </div>
          <div>
            <p class="font-display font-black text-white">{{ contactName }}</p>
          </div>
        </div>
      </div>

      <!-- Messages Area -->
      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto space-y-3 px-4"
      >
        <div v-if="loading" class="flex items-center justify-center h-full">
          <p class="text-white/50">Carregando mensagens...</p>
        </div>

        <div v-else-if="!messages.length" class="flex items-center justify-center h-full">
          <p class="text-white/50 text-center">
            <div class="text-3xl mb-2">💬</div>
            Comece a conversa!
          </p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="flex"
            :class="msg.senderId === auth.user?.id ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-xs px-4 py-2 rounded-2xl"
              :class="
                msg.senderId === auth.user?.id
                  ? 'bg-brand-600 rounded-br-sm'
                  : 'bg-white/10 rounded-bl-sm'
              "
            >
              <p class="text-white break-words">{{ msg.content }}</p>
              <p class="text-xs mt-1" :class="msg.senderId === auth.user?.id ? 'text-white/70' : 'text-white/50'">
                {{ new Date(msg.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="fixed bottom-0 inset-x-0 z-40 bg-gradient-to-t from-brand-950 via-brand-950/95 to-transparent backdrop-blur-lg border-t border-white/10 px-4 py-4 pb-safe">
        <div class="max-w-2xl mx-auto">
          <div class="flex gap-3">
            <textarea
              v-model="newMessage"
              @keydown="handleKeyDown"
              placeholder="Digite sua mensagem..."
              rows="1"
              class="input flex-1 resize-none max-h-24"
              :disabled="sending"
            />
            <button
              @click="sendMessage"
              :disabled="!newMessage.trim() || sending"
              class="btn-primary !px-4 !py-2 flex-shrink-0"
            >
              {{ sending ? '⏳' : '➤' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppShell>
</template>
