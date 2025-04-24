import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
// import './index.css';
import './assets/main.css'
// import './assets/tailwind.css'

createApp(App).use(router).mount('#app');
