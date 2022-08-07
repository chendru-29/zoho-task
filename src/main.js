import { createApp } from 'vue'
import App from './App.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSearch,faArrowRight,faAngleRight,faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap";

import axios from 'axios';
import router from './router'
library.add(faSearch,faArrowRight,faAngleRight,faAngleLeft);

createApp(App)
.use(router)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')


App.prototype.$http = axios;
