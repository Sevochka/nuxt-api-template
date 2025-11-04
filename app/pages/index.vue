<template>
  <div class="index-page">
    <div class="index-page__posts">
      <div
        v-for="post in posts"
        :key="post.id"
        class="index-page__post"
      >
        <Icon
          name="icons:bell"
          style="color: black"
        />

        <span>{{ post.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData } from '#app';
import { storeToRefs } from 'pinia';
import useMainStore from '@/store/main';

const mainStore = useMainStore();
const { posts } = storeToRefs(mainStore);

// useAsyncData выполняется на сервер
useAsyncData(async () => {
  await mainStore.getPosts();
  return true;
});
</script>

<style lang="scss" scoped>
.index-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  overflow: auto;

  &__posts {
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: 2rem;
    gap: 1rem;
  }

  &__post {
    color: green;
    border: 0.2rem solid green;
  }
}
</style>
