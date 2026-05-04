<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
auth.hydrate();
</script>

<template>
  <RouterView />
</template>
