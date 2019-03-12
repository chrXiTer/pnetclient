<template>
<div>
  <el-input v-model="cmd">
    <template slot="prepend">要执行的命令</template>
    <el-button slot="append" icon="el-icon-check" v-on:click="execACmd">执行</el-button>
    <el-button slot="append" icon="el-icon-check" v-on:click="execACmd2">执行2</el-button>
  </el-input>
</div>
</template>

<script>

import thFunc from '../ts/thFunc'

export default {
  props:['hosts'],
  data () {
    return {
      cmd:""
    }
  },
  methods: {
    execACmd(){
      thFunc.execCmd(this, this.hosts, this.cmd, (self, resp) => {
        self.$emit('cmdOutUpdate', resp)
      })
    },
    execACmd2(){ // 对所有主机都执行某条命令，每一个主机都服务端发送一条请求
      let self = this
      this.hosts.map((host)=>{
        thFunc.execCmdAHost(self, host, self.cmd, (self, resp) => {
          resp.data = JSON.stringify(resp.data)
          self.$emit('cmdOutUpdate', resp)
        })
      })
    },
  }
}
</script>