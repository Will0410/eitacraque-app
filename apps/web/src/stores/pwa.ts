import { defineStore } from 'pinia'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export const usePwaStore = defineStore('pwa', {
  state: () => ({
    deferredPrompt: null as BeforeInstallPromptEvent | null,
  }),
  actions: {
    setDeferredPrompt(event: BeforeInstallPromptEvent) {
      this.deferredPrompt = event
    },
    clearDeferredPrompt() {
      this.deferredPrompt = null
    },
    async installPWA() {
      if (this.deferredPrompt) {
        // Show the install prompt
        this.deferredPrompt.prompt()
        // Wait for the user to respond to the prompt
        const choiceResult = await this.deferredPrompt.userChoice
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt')
        } else {
          console.log('User dismissed the install prompt')
        }
        this.deferredPrompt = null
      }
    },
  },
})