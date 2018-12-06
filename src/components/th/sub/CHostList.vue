<template>
<div>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-input placeholder="输入子网地址" v-model="net0"></el-input>
      <el-input type="textarea" :rows="2" placeholder="在此输入该子网内的ip地址列表" v-model="ips0"></el-input>
    </el-col>
    <el-col :span="6">
      <el-input placeholder="输入子网地址" v-model="net1"></el-input>
      <el-input type="textarea" :rows="2" placeholder="在此输入该子网内的ip地址列表" v-model="ips1"></el-input>
    </el-col>
    <el-col :span="6">
      etcd 主机
      <el-input placeholder="etcd 主机ip" v-model="etcdHost0"></el-input>
      操作主机
      <el-input placeholder="操作主机" v-model="mainHost0"></el-input>
    </el-col>
    <el-col :span="6"><el-button @click="onUpdateClick">更新主机信息</el-button> </el-col>
  </el-row>
</div>
</template>

<script>
function getIpFromStr(str){
    let ip = /(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}/g;
    let hosts = str.match(ip) || []
    return hosts
}
export default {
  props:['hostList', "etcdHost", "mainHost"],
  data () {
    return {
      net0: this.hostList[0].net,
      ips0: this.hostList[0].ips.join("\n"),
      net1: this.hostList[1].net,
      ips1: this.hostList[1].ips.join("\n"),
      etcdHost0: this.etcdHost,
      mainHost0: this.mainHost
    }
  },
  computed:{
  },
  methods: {
    onUpdateClick: function(){
      this.$emit('hostsInfoChg', {
        hostList:[
          {net:this.net0, ips:getIpFromStr(this.ips0)}, 
          {net:this.net1, ips:getIpFromStr(this.ips1)}
        ],
        etcdHost:this.etcdHost0,
        mainHost:this.mainHost0
      })
    }
  }
}
</script>
