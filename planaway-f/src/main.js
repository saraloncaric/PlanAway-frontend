import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { FcSearch } from 'oh-vue-icons/icons';
import { FaRegularHeart } from 'oh-vue-icons/icons';
import { FcTodoList } from 'oh-vue-icons/icons';
addIcons(FcSearch);
addIcons(FaRegularHeart);
addIcons(FcTodoList);

const app = createApp(App)
app.component("v-icon", OhVueIcon);
app.use(router)

app.mount('#app')