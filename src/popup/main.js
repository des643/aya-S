import { createApp } from 'vue';
import '@/common/styles/frame.scss';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import Popup from './popup.vue';

const app = createApp(Popup);
app.use(ElementPlus);
app.mount('#app');
