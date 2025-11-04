import { defineStore } from 'pinia';
import type { MainState } from '~~/app/types/store/main';

const useMainStore = defineStore('main', () => {
  const api = useApi();

  const posts = ref<MainState['posts']>([]);

  const getPosts = async () => {
    posts.value = [];
  };

  return {
    posts,
    getPosts,
  };
});

export default useMainStore;
