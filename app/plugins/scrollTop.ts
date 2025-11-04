export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:start', () => {
    window.scrollTo(0, 0);
  });
});
