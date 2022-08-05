<script setup>
import { useGlobalStore } from "../stores/global-store.js";

const globalStore = useGlobalStore();
</script>

<template>
  <div class="google-login">
    <button @click="globalStore.googleLoginWithModal">
      Google Login via modal
    </button>
    <button @click="globalStore.googleLoginWithRedirection">
      Google Login via redirection
    </button>
  </div>
</template>
