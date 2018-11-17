import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import PageMainHello from '@/components/PageMainHello.vue'
import PageMainTable from '@/components/PageMainTable.vue'
import PMainSSH from '@/components/PMainSSH.vue'
import PMainEtcdTree from '@/components/PMainEtcdTree.vue'
import ThPMain from '@/components/th/ThPMain.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/',
      name: 'PageMainHello',
      component: PageMainHello
    },
    {
      path: '/table',
      name: 'PageMainTable',
      component: PageMainTable
    },
    {
      path: '/ssh',
      name: 'PMainSSH',
      component: PMainSSH
    },
    {
      path: '/etcdTree',
      name: 'PMainEtcdTree',
      component: PMainEtcdTree
    },
    {
      path: '/th',
      name: 'ThPMain',
      component: ThPMain
    }
  ]
})



