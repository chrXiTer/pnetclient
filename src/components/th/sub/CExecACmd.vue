<template>
<div>
  <h3>要操作的主机</h3>
  <el-input type="textarea" :rows="2" placeholder="输入要操作的主机列表" v-model="hosts"></el-input>
  <el-input v-bind:value="cmd" v-on:input="execACmd">
    <template slot="prepend">要执行的命令</template>
    <el-button slot="append" icon="el-icon-check" v-on:click="execACmd">执行</el-button>
  </el-input>
</div>
</template>

<script>

import thFunc from '../ts/thFunc'

export default {
  data () {
    return {
      hosts:"",
      cmd:""
    }
  },
  methods: {
    execACmd(){
      thFunc.execCmd(this, this.hosts, cmd, (self, resp) => {
        //resp.data = JSON.stringify(resp.data)
        self.$emit('text1KResp', resp)
      })
    }
  }
}
</script>