<template>
<div>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-input placeholder="输入子网地址" v-model="net0"></el-input>
      <el-input type="textarea" :rows="2" placeholder="输入该子网内的ip地址列表" v-model="ips0"></el-input>
    </el-col>
    <el-col :span="6">
      <el-input placeholder="输入子网地址" v-model="net1"></el-input>
      <el-input type="textarea" :rows="2" placeholder="输入该子网内的ip地址列表" v-model="ips1"></el-input>
    </el-col>
    <el-col :span="6">
      <el-input placeholder="etcd 主机ip" v-model="etcdHostsStr">
        <template slot="prepend">etcd主机</template>
      </el-input>
      <el-input placeholder="操作主机" v-model="mainHost">
        <template slot="prepend">操作主机</template>
      </el-input>
    </el-col>
    <el-col :span="6">
      <el-button @click="onUpdateClick">更新主机信息</el-button>
    </el-col>
  </el-row>
  <el-radio-group v-model="curHostInfo" v-on:change="curHostsInfoChg">
    <el-radio-button label="hostsInfo_1"></el-radio-button>
    <el-radio-button label="hostsInfo_2"></el-radio-button>
  </el-radio-group>    
</div>
</template>

<script>

import thFunc from '../ts/thFunc'

export default {
  props:['hostList', "etcdHostsStr", "mainHost"],
  data () {
    return {
      curHostInfo:"hostsInfo_1",
      hostsInfo: JSON.parse(JSON.stringify(thFunc.allHostsInfosTmp["hostsInfo_1"]))
    }
  },
  computed:{
      net0: function(){ return this.hostList[0].net},
      ips0: function(){ return this.hostList[0].ips.join("\n")},
      net1: function(){ return this.hostList[1].net},
      ips1: function(){ return this.hostList[1].ips.join("\n")},
  },
  methods: {
    curHostsInfoChg:function(){
      this.hostsInfo = JSON.parse(JSON.stringify(thFunc.allHostsInfosTmp["hostsInfo_1"]))
    },
    onUpdateClick: function(){
      this.$emit('hostsInfoChg', JSON.parse(JSON.stringify(this.hostsInfo)))
    }
  }
}
</script>
