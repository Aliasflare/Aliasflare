import './App.css'
import { createApp } from 'vue'
import App from './App.vue'
import Router from './Router'
import { destinationStore } from '@/api/DestinationStore';
import { aliasStore } from './api/AliasStore';

const app = createApp(App);
app.use(Router);
app.mount('#app');

//@ts-ignore
window.destinationStore = destinationStore;
//@ts-ignore
window.aliasStore = aliasStore;