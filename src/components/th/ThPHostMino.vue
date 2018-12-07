<template>
  <div>
    <h2 style="clear:both">要操作的主机--当前页有效</h2>
    <el-input type="textarea" :rows="5" placeholder="输入要操作的主机列表" v-on:blur="onBlur" v-model="hostsStr"></el-input>
    <el-card class="box-card">
  <div v-for="o in 4" :key="o" class="text item">
    <el-card class="box-card">
    qqqqqq
    </el-card>
  </div>

    <el-input v-model="cmd">
      <template slot="prepend">要执行的命令</template>
      <el-button slot="append" icon="el-icon-check" v-on:click="execACmd">执行</el-button>
    </el-input>
    <el-input v-model="subDir">
      <template slot="prepend">要同步的文件目录:/home/nscc/</template>
      <el-button slot="append" icon="el-icon-check" v-on:click="syncDir">同步</el-button>
    </el-input>
    <el-button @click="chgAptSource">更新apt源</el-button>
    
    <pre id="cmdout" v-html="cmdoutContent" style="background-color: grey; color: white"></pre>
  </div>
</template>

<script>

import thFunc from './ts/thFunc'
import cmdStrTpl from './ts/cmdStrTpl'
import CSetBackendUrl from './sub/CSetBackendUrl.vue'
import CHostsToCopy from './sub/CHostsToCopy.vue'

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
    CSetBackendUrl,
    CHostsToCopy
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
    }
    
  }
}
</script>

<style>
h3 {
  text-align: left;
}
pre {
  float: left;
}
</style>
