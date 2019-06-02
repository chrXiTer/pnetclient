<template>
  <el-menu :default-openeds="['1']" unique-opened router>

    <el-submenu index="1">
      <template slot="title"><i class="el-icon-menu"></i>容器网络管理</template>
      <el-menu-item-group>
        <!--
        <el-menu-item><a href="http://10.145.0.8:8080/env/1a5/infra/hosts" style="text-decoration:unset;color:black" target="_blank">主机管理</a></el-menu-item>
        <el-menu-item><a href="http://10.145.0.8:8080/env/1a5/infra/containers" style="text-decoration:unset;color:black" target="_blank">容器管理</a></el-menu-item>
        <el-menu-item index="/scope">主机管理2</el-menu-item>
        <el-menu-item index="/th">ThMain</el-menu-item>
        http://10.145.0.8:8000/env/1a5/infra/container-log?instanceId=1i17206&isPopup=true
        <el-menu-item index="/thHostsMino">系统日志</el-menu-item>
        <el-menu-item index="/docker">系统设置</el-menu-item>
        <el-menu-item index="/th">镜像管理</el-menu-item>
        <el-menu-item index="/etcdTree">存储管理</el-menu-item>
        
        <el-menu-item><a href="http://localhost:9080/env/1a5/infra/hosts" style="text-decoration:unset;color:black" target="_blank">主机管理</a></el-menu-item>
        <el-menu-item><a href="http://localhost:9080/env/1a5/infra/containers" style="text-decoration:unset;color:black" target="_blank">容器管理</a></el-menu-item>
        <el-menu-item><a href="http://10.145.0.8:8000/admin/settings" style="text-decoration:unset;color:black" target="_blank">系统设置</a></el-menu-item>
        <el-menu-item><a href="http://10.145.0.8:8000/env/1a5/infra/storagepools/pools" style="text-decoration:unset;color:black" target="_blank">存储管理</a></el-menu-item>
        <el-menu-item><a href="http://10.145.0.8:8000/env/1a5/infra/container-log?instanceId=1i17206&isPopup=true" style="text-decoration:unset;color:black" target="_blank">系统日志</a></el-menu-item>
        <el-menu-item><a href="http://10.145.0.8:8000/env/1a5/infra/registries" style="text-decoration:unset;color:black" target="_blank">系统日志</a></el-menu-item>
        <el-menu-item><a href="http://10.145.0.8:8000/admin/processes" style="text-decoration:unset;color:black" target="_blank">系统进程</a></el-menu-item>
        -->

        <el-menu-item><a href="http://10.145.0.8:8000/env/1a5/infra/hosts" style="text-decoration:unset;color:black" target="_blank">主机管理</a></el-menu-item>
        <el-menu-item><a href="http://10.145.0.8:8000/env/1a5/infra/containers" style="text-decoration:unset;color:black" target="_blank">容器管理</a></el-menu-item>
        <el-menu-item><a href="http://10.145.0.8:8000/admin/settings" style="text-decoration:unset;color:black" target="_blank">系统设置</a></el-menu-item>
        <el-menu-item><a href="http://10.145.0.8:8000/env/1a5/infra/storagepools/pools" style="text-decoration:unset;color:black" target="_blank">存储管理</a></el-menu-item>
        <el-menu-item><a href="http://10.145.0.8:8000/env/1a5/infra/container-log?instanceId=1i17206&isPopup=true" style="text-decoration:unset;color:black" target="_blank">系统日志</a></el-menu-item>
        <el-menu-item><a href="http://10.145.0.8:8000/env/1a5/infra/registries" style="text-decoration:unset;color:black" target="_blank">系统日志</a></el-menu-item>
        <el-menu-item><a href="http://10.145.0.8:8000/admin/processes" style="text-decoration:unset;color:black" target="_blank">系统进程</a></el-menu-item>

      </el-menu-item-group>
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


    <el-menu-item index="/k8s">k8s</el-menu-item>

      <el-menu-item-group title="分组2">
        <el-menu-item index="2-3">选项3</el-menu-item>
      </el-menu-item-group>
      <el-submenu index="2-4">
        <template slot="title">选项4</template>
        <el-menu-item index="2-4-1">选项4-1</el-menu-item>
      </el-submenu>

-->