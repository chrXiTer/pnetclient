<template>
  <div>
  <h2>在此输入后台url-所有页面有效</h2>
  <CSetBackendUrl v-bind:backendUrl="thFunc.rootUrl" v-on:chgBackendUrl="thFunc.chgRootUrl"></CSetBackendUrl>
  <h2>执行命令--同步文件夹</h2>
      <h3>以下下供复制用</h3>
<pre>
靳鹏飞装的calico
  10.145.0.1
  10.145.0.2
  10.145.0.3
  10.145.0.4
  10.145.0.5

靳鹏飞装的k8s
  10.145.0.6
  10.145.0.7
  10.145.0.8
</pre>
<pre>
  预留
  10.145.0.7
  10.145.0.8
  10.144.0.21

没有，协议测试用去
  10.144.0.1-20

k8s反射器(quagga k8s集群外)
  10.145.0.22 145机框
  10.144.0.22 144机框
</pre>
<pre>
k8s工作节点2
(移出状态，根据情况加入或移出)
  10.145.0.11
  10.145.0.12
  10.145.0.13
  10.145.0.14
  10.145.0.15
  10.145.0.16
  10.145.0.17
  10.145.0.18
  10.145.0.19
  10.145.0.20
</pre>
<pre>
k8s 的 master
  10.145.0.21 

k8s的工作节点1.1
  10.145.0.23
  10.145.0.24
  10.145.0.25

k8s的工作节点1.2
  10.144.0.23
  10.144.0.24
  10.144.0.25
</pre>

<pre>
  calico+docker跨机框集群
  10.144.0.26
  10.144.0.27  
  10.145.0.26
  10.145.0.27
</pre>

    <h3 style="clear:both">要操作的主机--当前页有效</h3>
    <el-input type="textarea" :rows="5" placeholder="输入要操作的主机列表" v-on:blur="onBlur" v-model="hostsStr"></el-input>
    <el-input v-model="cmd">
      <template slot="prepend">要执行的命令</template>
      <el-button slot="append" icon="el-icon-check" v-on:click="execACmd">执行</el-button>
    </el-input>
    <el-input v-model="subDir">
      <template slot="prepend">要同步的文件目录:/home/nscc/</template>
      <el-button slot="append" icon="el-icon-check" v-on:click="syncDir">同步</el-button>
    </el-input>
    <el-button @click="chgAptSource">更新apt源</el-button>
    <el-button @click="chgHostName">修改主机名</el-button>
    <div id="cmdout" v-html="cmdoutContent" style="background-color: grey; color: white"></div>
  </div>
</template>

<script>

import thFunc from './ts/thFunc'
import cmdStrTpl from './ts/cmdStrTpl'
import CSetBackendUrl from './sub/CSetBackendUrl.vue'

export default {
  data(){
    return {
      hostsStr:"",
      cmd:"",
      subDir:"th/test/",
      cmdoutContent: "",
      thFunc:thFunc
    }
  },
  computed: {
    hosts: function () {
      let ip = /(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}/g;
      let hosts = this.hostsStr.match(ip) || []
      return hosts
    }
  },
  components:{
    CSetBackendUrl
  },
  methods: {
    onBlur(){
      this.hostsStr = this.hostsStr.replace(/\n/g, ";").replace(/\s/g, '').replace(/;;+/g, ";\n")
    },
    execACmd(){
      thFunc.execCmd(this, this.hosts, this.cmd, thFunc.handlerRetStr)
    },
    chgAptSource(){
        thFunc.execCmd(this, this.hosts, cmdStrTpl.hostE.cmdChgAptSource, thFunc.handlerRetStr)
    },
    chgHostName(){
      this.hosts.map((host)=>{
        let h4ns = host.split(".")
        let newHostName = `n-${h4ns[1]}-${h4ns[2]}-${h4ns[3]}`
        let cmd = cmdStrTpl.hostE.getCmdChgHostName(newHostName)
        thFunc.execCmdAHost(this, this.hosts, cmd, thFunc.handlerRetStr)
      })
    },
    syncDir(){
      this.subDir = this.subDir.replace(/\s/g, '').replace(/\/$/, '')
      let index = this.subDir.lastIndexOf("/")
      let dir1 = '/home/nscc/'
      let dir2 = this.subDir
      if(index >=0){
        dir1 = dir1 + this.subDir.substring(0, index)
        dir2 = this.subDir.substring(index)
      }
      thFunc.scpDir(this, this.hosts, dir1, dir2, thFunc.handlerRetStr)
    }
  }
}
</script>

<style>
h2 {
  text-align: left;
}
pre {
  float: left;
}
</style>
