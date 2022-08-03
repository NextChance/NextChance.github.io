<script setup>
import { onMounted, computed } from "vue";
import { useGlobalStore } from "../stores/global-store.js";

const globalStore = useGlobalStore();

onMounted(async () => {
  await globalStore.loginApp();

  await globalStore.getEstablishmentReviews();
});

// eslint-disable-next-line no-unused-vars
const reviews = computed(() => globalStore.getReviews);
</script>

<template>
  <main>
    <h2>Review list from establishment 0558c2a4-dc7d-4a57-bc79-b59999d472e0</h2>
    <section class="review-list">
      <div class="item" v-for="review in globalStore.reviews" :key="review.id">
        <p>username: {{ review.user.name }}</p>
        <p>rating: {{ review.rating }}</p>
        <p>text: {{ review.text }}</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.item + .item {
  margin-top: 1rem;
}
</style>
