import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { trackPageView } from './utils/umamiAnalytics'
import './assets/css/reset.css'
import './assets/css/tokens.css'
import './assets/css/base.css'

router.afterEach(() => {
  trackPageView()
})

createApp(App).use(router).mount('#app')
