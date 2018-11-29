<template>
  <div>
    选择宿主机
    <el-select v-model="usedHost" placeholder="请选择">
      <el-option v-for="item in optionsHost" :key="item.value" 
        :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    选择网络
    <el-select v-model="usedNetName" placeholder="请选择">
      <el-option 
        v-for="item in optionsNet" :key="item.value" :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <input type="text" v-model="containerNum"/>
    <el-button-group>
      <el-button v-on:click="create1k">创建容器</el-button>
      <el-button v-on:click="con1kToNet">加入网络</el-button>
      <el-button v-on:click="rm1k">移除容器</el-button>
    </el-button-group>
  </div>
</template>

<script>

import thFunc from '../th'
import thTest from '../thTest'

export default {
  props:['hosts', "networks"],
  data () {
    return {
      containerNum:1000,
      usedNetName:"",
      usedHost:""
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
    create1k(){
      let cmd = thTest.getCmdToRunNNginx(this.containerNum)
      thFunc.execCmdAHost(this, this.usedHost, cmd, (self, resp) => {
          resp.data = JSON.stringify(resp.data)
          self.$emit('text1KResp', resp.data)
      })
    },
    con1kToNet(){
      let cmd = thTest.getCmdConnectToNetwork(this.usedNetName, this.containerNum)
      thFunc.execCmdAHost(this, this.usedHost, cmd, (self,resp) => {
          resp.data = JSON.stringify(resp.data)
          self.$emit('text1KResp', resp.data)
      })
    },
    rm1K(){
      let cmd = thTest.getCmdToRmNNginx(this.containerNum)
      thFunc.execCmdAHost(this, this.usedHost, cmd, (self,resp) => {
          resp.data = JSON.stringify(resp.data)
          self.$emit('text1KResp', resp.data)
      })
    }
  }
}
</script>

