import './App.css'
import { createApp } from 'vue'
import App from './App.vue'
import Router from './Router'

const app = createApp(App);
app.use(Router);
app.mount('#app');
