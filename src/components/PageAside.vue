<template>
  <el-menu :default-openeds="['1']" unique-opened router>

    <el-submenu index="1">
      <template slot="title"><i class="el-icon-menu"></i>容器网络管理</template>
      <el-menu-item-group>
        <!--
        <el-menu-item><a href="http://10.145.0.8:8080/env/1a5/infra/hosts" style="text-decoration:unset;color:black" target="_blank">主机管理</a></el-menu-item>
        <el-menu-item><a href="http://10.145.0.8:8080/env/1a5/infra/containers" style="text-decoration:unset;color:black" target="_blank">容器管理</a></el-menu-item>
        <el-menu-item index="/scope">主机管理2</el-menu-item>
        <el-menu-item><a href="http://localhost:9080/env/1a5/infra/hosts" style="text-decoration:unset;color:black" target="_blank">主机管理</a></el-menu-item>
        <el-menu-item><a href="http://localhost:9080/env/1a5/infra/containers" style="text-decoration:unset;color:black" target="_blank">容器管理</a></el-menu-item>
        -->
        <el-menu-item index="/thr1">主机管理</el-menu-item>
        <el-menu-item index="/thr2">容器管理</el-menu-item>
        <el-menu-item index="/thr3">系统设置</el-menu-item>
        <el-menu-item index="/thr4">存储管理</el-menu-item>
        <el-menu-item index="/thr5">系统日志</el-menu-item>
        <el-menu-item index="/thr6">系统日志</el-menu-item>
        <el-menu-item index="/thr7">系统进程</el-menu-item>

      </el-menu-item-group>
    </el-submenu>

    <el-submenu index="/">
      <template slot="title"><i class="el-icon-message"></i>测试</template>
        <el-menu-item index="/table">测试-table</el-menu-item>
        <el-menu-item index="/home">测试-home</el-menu-item>
        <el-menu-item index="/ssh">系统环境初始化</el-menu-item>
        <el-menu-item index="/ssh2">测试1</el-menu-item>
        <el-menu-item index="/th"><i class="el-icon-message"></i>ThMain</el-menu-item>
        <el-menu-item index="/k8s">k8s</el-menu-item>
        <el-menu-item index="/etcdTree">etcd</el-menu-item>
        <el-menu-item index="/docker">docker</el-menu-item>
        <el-menu-item index="/thHostsMino">thHostsMino</el-menu-item>
    </el-submenu>

    <el-submenu index="3">
      <template slot="title"><i class="el-icon-menu"></i>用户权限管理</template>
      <el-menu-item index="/adduser">用户列表</el-menu-item>
      <el-menu-item index="/adduser">添加用户</el-menu-item>
    </el-submenu>
  </el-menu>

</template>

<!--
cat << EOF > /etc/apt/sources.list
deb http://mirrors.aliyun.com/ubuntu/ xenial main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ xenial-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ xenial-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ xenial-backports main restricted universe multiverse
EOF


-->