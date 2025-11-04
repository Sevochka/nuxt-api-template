<template>
  <div class="error">
    <div class="error__info">
      <h1 class="error__code">
        {{ error.statusCode }}
      </h1>
      <p class="error__message">
        {{ message }}
      </p>
    </div>

    <button
      class="error__button"
      to="/"
    >
      Перейти на главную
    </button>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';

const MESSAGES: {
  [key: number]: string; default: string
} = {
  404: 'Хм, такую страницу найти не удалось.',
  default: 'Что-то пошло не так.',
};

const { error } = defineProps<{
  error: NuxtError
}>();

const message = computed(() => {
  return MESSAGES[error.statusCode] || MESSAGES.default;
});
</script>

<style scoped lang="scss">
.error {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  padding: 3.2rem 0;
  height: 100%;
}
</style>
