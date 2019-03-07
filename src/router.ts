import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from '@/components/user/Login.vue'
import MailReg from '@/components/user/MailReg.vue'
import AddUser from '@/components/user/AddUser.vue'
import PageMainHello from '@/components/PageMainHello.vue'
import PageMainTable from '@/components/PageMainTable.vue'
import PMainSSH from '@/components/PMainSSH.vue'
import ThPEtcdTree from '@/components/th/ThPEtcdTree.vue'
import ThPHostMino from "@/components/th/ThPHostMino.vue"
import ThPMain from '@/components/th/ThPMain.vue'
import ThPDocker from '@/components/th/ThPDocker.vue'

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
      path: '/login',
      name: 'Login',
      component: Login,
    }, 
    {
      path: '/mailreg',
      name: 'MailReg',
      component: MailReg,
    },
    {
      path: '/adduser',
      name: 'AddUser',
      component: AddUser,
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
      component: ThPHostMino
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
    
  ]
})



