<template>
  <div>
      加入的网络名
      <el-select v-model="usedNetName" placeholder="请选择">
        <el-option v-for="item in optionsNet" :key="item.value"
          :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      宿主机
      <el-select v-model="usedHost" placeholder="请选择">
        <el-option v-for="item in optionsHost" :key="item.value" 
          :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input placeholder="请输入容器名:" v-model="containerName">
        <template slot="prepend">输入容器名</template>
        <el-button slot="append" v-on:click="createContainer">创建容器</el-button>
      </el-input>
  </div>
</template>

<script>
import thFunc from '../ts/thFunc'
import cmdStrTpl from '../ts/cmdStrTpl'
export default {
  props:['hosts', "networks"],
  data () {
    return {
      usedNetName:"",
      usedHost:"",
      containerName: ""
    }
  },
  computed:{
    optionsNet(){
      return this.networks.map(e => {
        return {value: e, label: e}
      });
    },
    optionsHost(){
      return this.hosts.map(e => {
        return {value: e, label: e}
      });
    }
  },
  methods: {
    createContainer(){
      if(!this.usedNetName || !this.usedHost || !this.containerName){
        return
      }
      let cmd = cmdStrTpl.dockerC.getCmdCreateContainer(this.usedNetName, this.containerName)
      thFunc.execCmdAHost(this, this.usedHost, cmd, (self, resp) => {
        resp.data = JSON.stringify(resp.data)
        self.$emit('text1KResp', resp)
      })
    }
  }
}
</script>

