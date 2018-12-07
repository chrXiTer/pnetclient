import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import PageMainHello from '@/components/PageMainHello.vue'
import PageMainTable from '@/components/PageMainTable.vue'
import PMainSSH from '@/components/PMainSSH.vue'
import ThPEtcdTree from '@/components/th/ThPEtcdTree.vue'
import ThPHostMino from "@/components/th/ThPHostMino.vue"
import ThPMain from '@/components/th/ThPMain.vue'
import ThPDocker from '@/components/th/ThPDocker.vue'
import ThPK8s from '@/components/th/ThPK8s.vue'

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
      name: 'ThPEtcdTree',
      component: ThPEtcdTree
    },
    {
      path: '/thHostsMino',
      name: 'ThPHostMino',
      component: ThPMain
    },
    {
      path: '/th',
      name: 'ThPMain',
      component: ThPMain
    },
    {
      path: '/docker',
      name: 'ThPDocker',
      component: ThPDocker
    },
    {
      path: '/k8s',
      name: 'ThPK8s',
      component: ThPK8s
    },
    
  ]
})



