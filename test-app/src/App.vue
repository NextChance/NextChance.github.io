<script setup>
import { computed, onBeforeMount, ref } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { useGlobalStore } from "./stores/global-store.js";

const globalStore = useGlobalStore();

onBeforeMount(async () => {
  globalStore.getLoginDataFromRedirection();
});

const counter = ref(0);

const isNavigationShown = computed(() => {
  return counter.value >= 5;
});

</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/nofakes-logo.svg"
      width="100"
      @click="counter++"
    />

    <div v-if="!globalStore.user">Usuario no logado</div>
    <div v-else>
      <p>{{ globalStore.user.name }}</p>
      <p>{{ globalStore.user.pointsAmount }} tokens</p>
      <p>{{ globalStore.user.totalReviews }} reviews</p>
      <img :src="globalStore.user.image.url" alt="" />
      <button @click="globalStore.firebaseLogout">logout</button>
    </div>

    <div class="wrapper" v-if="isNavigationShown">
      <nav>
        <RouterLink to="/">Login</RouterLink>
        <RouterLink to="/simple-review-list">Simple Review List</RouterLink>
        <RouterLink
          to="/review-list-by-establishment-id?establishmentId=8bd461e1-305f-42c0-bd9d-fa925a17db31"
          >Review List by Establishment id</RouterLink
        >
        <RouterLink to="/create-review">Create Review</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
