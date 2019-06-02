<template>
  <el-menu :default-openeds="['1']" unique-opened router>

    <el-submenu index="2">
      <template slot="title"><i class="el-icon-menu"></i>TH</template>
      <el-menu-item-group>
        <template slot="title">th</template>
        <el-menu-item index="http://localhost:9040/">主机管理</el-menu-item>
        <el-menu-item index="/home">容器管理</el-menu-item>
        <el-menu-item index="/ssh">容器镜像管理</el-menu-item>
        <el-menu-item index="/ssh2">测试1</el-menu-item>
        <el-menu-item index="/th">ThMain</el-menu-item>
        <el-menu-item index="/docker">ThDocker</el-menu-item>
        <el-menu-item index="/etcdTree">ThEtcdTree</el-menu-item>
        <el-menu-item index="/thHostsMino">thHostsMino</el-menu-item>
        <el-menu-item index="/k8s">k8s</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="分组2">
        <el-menu-item index="2-3">选项3</el-menu-item>
      </el-menu-item-group>
      <el-submenu index="2-4">
        <template slot="title">选项4</template>
        <el-menu-item index="2-4-1">选项4-1</el-menu-item>
      </el-submenu>
    </el-submenu>
  </el-menu>
</template>

<!--
      <el-submenu index="/">
      <template slot="title"><i class="el-icon-message"></i>测试</template>
        <el-menu-item index="/table">测试-table</el-menu-item>
        <el-menu-item index="/home">测试-home</el-menu-item>
        <el-menu-item index="/ssh">系统环境初始化</el-menu-item>
        <el-menu-item index="/ssh2">测试1</el-menu-item>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title"><i class="el-icon-menu"></i>用户权限管理</template>
      <el-menu-item index="/adduser">用户列表</el-menu-item>
      <el-menu-item index="/adduser">添加用户</el-menu-item>
    </el-submenu>
    <el-menu-item index="/th"><i class="el-icon-message"></i>ThMain</el-menu-item>
-->