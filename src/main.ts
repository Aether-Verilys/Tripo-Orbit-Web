import { createApp } from 'vue';
import { MotionPlugin } from '@vueuse/motion';
import i18n from './i18n';
import App from './App.vue';
import './index.css';

const app = createApp(App);
app.use(MotionPlugin);
app.use(i18n);
app.mount('#root');
