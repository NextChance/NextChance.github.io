<script setup>
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useGlobalStore } from "../stores/global-store.js";

const props = defineProps({
  establishmentId: String,
});

const globalStore = useGlobalStore();

onMounted(async () => {
  if (!props.establishmentId) {
    alert("Error, establishmentId not set via query param");
    const router = useRouter();
    router.push("/");
  } else {
    await globalStore.loginApp();
    await globalStore.getReviewsByEstablishmentId(props.establishmentId);
  }
});

// eslint-disable-next-line no-unused-vars
const reviews = computed(() => globalStore.getReviews);
</script>

<template>
  <main>
    <h2>Review list from establishment {{ props.establishmentId }}</h2>
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
