<template>
  <div style="text-align: left">
    <el-button v-on:click="createBridgeNet">创建 bridge 网络</el-button>
    <br/>
    网络名
    <el-select v-model="usedNetName" placeholder="请选择">
      <el-option v-for="item in optionsNet" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-input type="text" v-model="startNo" style="width :150px"><template slot="prepend">startNo</template></el-input>
    <el-input type="text" v-model="endNo" style="width :150px"><template slot="prepend">endNo</template></el-input>
    <el-button-group>
      <el-button v-on:click="deleteBridgeNet">删除 bridge 网络</el-button>
      <el-button v-on:click="createContainer">创建容器</el-button>
      <el-button v-on:click="deleteContainer">删除容器</el-button>
    </el-button-group>
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
      startNo:1,
      endNo:500
    }
  },
  computed:{
    optionsNet(){
      return this.networks.filter((network) => {
        return network.search(/^netb/) >= 0
      }).map(e => {
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
    createBridgeNet(){
      this.hosts.forEach((host, index, hosts) => {
        let cmd = cmdStrTpl.test100kb.getCmdCreateBridgeNet(host, hosts)
        thFunc.execCmdAHost(this, host, cmd, (self, resp) => {
            resp.data = JSON.stringify(resp.data)
            self.$emit('text100kResp', resp)
            self.$emit('needRefreshNetList')
        })
      })
    },
    deleteBridgeNet(){
      this.hosts.forEach((host, index, hosts) => {
        let cmd = cmdStrTpl.test100kb.getCmdDeleteBridgeNet(this.usedNetName, host, hosts)
        thFunc.execCmdAHost(this, host, cmd, (self, resp) => {
            resp.data = JSON.stringify(resp.data)
            self.$emit('text100kResp', resp)
            self.$emit('needRefreshNetList')
        })
      })
    },
    createContainer(){
      this.hosts.forEach((host) => {
        let cmd = cmdStrTpl.test100kb.getCmdCreateContainer(this.usedNetName, host, this.startNo, this.endNo)
        thFunc.execCmdAHost(this, host, cmd, (self, resp) => {
            resp.data = JSON.stringify(resp.data)
            self.$emit('text100kResp', resp)
        })
      })
    },
    deleteContainer(){
      this.hosts.forEach((host) => {
        let cmd = cmdStrTpl.test100kb.getCmdDeleteContainer(this.usedNetName, host, this.startNo, this.endNo)
        thFunc.execCmdAHost(this, host, cmd, (self, resp) => {
            resp.data = JSON.stringify(resp.data)
            self.$emit('text100kResp', resp)
        })
      })
    },
  }
}
</script>

