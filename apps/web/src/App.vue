<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usePwaStore } from '@/stores/pwa';
import { onMounted } from 'vue';
import type { BeforeInstallPromptEvent } from '@/stores/pwa';

const auth = useAuthStore();
const pwa = usePwaStore();

auth.hydrate();

// Listen for the beforeinstallprompt event
onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    pwa.setDeferredPrompt(e as BeforeInstallPromptEvent);
  });
  
  window.addEventListener('appinstalled', () => {
    console.log('App has been installed');
    pwa.clearDeferredPrompt();
  });
});
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
