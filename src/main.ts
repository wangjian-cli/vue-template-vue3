import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import '@/assets/style/reset.css';
import defaultCover from '@/directives/defaultCover';
import tolerant from '@/directives/tolerant';
createApp(App)
  .use(router)
  .directive('defaultCover', defaultCover)
  .directive('tolerant', tolerant)
  .mount('#app');
