<template>
<div>
  <el-input v-model="cmd">
    <template slot="prepend">要执行的命令</template>
    <el-button slot="append" icon="el-icon-check" v-on:click="execACmd">执行</el-button>
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
    }
  }
}
</script>