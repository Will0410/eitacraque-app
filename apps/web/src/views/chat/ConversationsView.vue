<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { chatApi, type Conversation } from '@/api/chat';
import AppShell from '@/components/AppShell.vue';

const auth = useAuthStore();
const router = useRouter();
const conversations = ref<Conversation[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    conversations.value = await chatApi.getConversations();
  } finally {
    loading.value = false;
  }
});

function openChat(userId: string) {
  router.push(`/chat/${userId}`);
}
</script>

<template>
  <AppShell>
    <div class="space-y-4">
      <h1 class="font-display text-3xl font-black bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent mb-6">
        💬 Mensagens
      </h1>

      <div v-if="loading" class="space-y-3 animate-pulse">
        <div v-for="i in 3" :key="i" class="card p-4">
          <div class="h-6 bg-white/10 rounded w-2/3 mb-2"></div>
          <div class="h-4 bg-white/10 rounded w-1/2"></div>
        </div>
      </div>

      <div v-else-if="!conversations.length" class="text-center py-12">
        <div class="text-4xl mb-3">💬</div>
        <p class="text-white/60 font-semibold">Nenhuma conversa ainda</p>
        <p class="text-white/40 text-sm mt-2">Contate um atleta para começar a conversar</p>
      </div>

      <div v-else class="space-y-3">
        <button
          v-for="conv in conversations"
          :key="conv.userId"
          @click="openChat(conv.userId)"
          class="card w-full text-left p-4 cursor-pointer transition hover:bg-white/[0.10] hover:border-white/[0.25]"
        >
          <div class="flex items-start gap-3">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white font-bold flex-shrink-0">
              {{ conv.userDisplayName?.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-display font-black text-white">{{ conv.userDisplayName }}</p>
              <p v-if="conv.lastMessage" class="text-sm text-white/60 truncate mt-1">{{ conv.lastMessage }}</p>
              <p v-else class="text-sm text-white/40 italic mt-1">Nenhuma mensagem ainda</p>
            </div>
            <div class="flex flex-col items-end gap-1 flex-shrink-0">
              <span v-if="conv.lastMessageAt" class="text-xs text-white/40">
                {{ new Date(conv.lastMessageAt).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }) }}
              </span>
              <span v-if="conv.unreadCount && conv.unreadCount > 0" class="px-2 py-0.5 rounded-full bg-brand-600 text-xs font-bold text-white">
                {{ conv.unreadCount }}
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  </AppShell>
</template>
