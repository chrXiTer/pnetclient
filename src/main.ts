import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import util from './lib/cx_util'

Vue.config.productionTip = false
Vue.use(ElementUI);

router.beforeEach((
  to, from: any, 
  next: { (): void; (arg0: { path: string; query: { redirect: string; }; }): void; (): void; (): void; })=> {
  if (to.name == 'Login') {
    next();
    return;
  }
  var name = store.state.user.name;
  if (name === '未登录') {
    if (to.meta.requireAuth || to.name == null) {
      next({path: '/', query: {redirect: to.path}})
    } else {
      next();
    }
  } else {
    next();
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
