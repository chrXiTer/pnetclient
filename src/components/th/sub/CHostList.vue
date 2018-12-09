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
    <el-col :span="10">
      <el-input placeholder="etcd 主机ip" v-model="etcdHostsStr">
        <template slot="prepend">etcd主机</template>
      </el-input>
      <el-input placeholder="操作主机" v-model="mainHost">
        <template slot="prepend">操作主机</template>
      </el-input>
    </el-col>
  </el-row>
  <el-radio-group v-model="curHostInfoKey" v-on:change="curHostsInfoChg">
    <el-radio-button label="hostsInfo_1"></el-radio-button>
    <el-radio-button label="hostsInfo_2"></el-radio-button>
  </el-radio-group>  
  <el-button @click="onUpdateClick" v-show="upBtnIsShow" type="danger">更新主机信息</el-button>  
</div>
</template>

<script>

import thFunc from '../ts/thFunc'
import util from '../../../lib/cx_util';

export default {
  //props:['hostList', "etcdHostsStr", "mainHost"],
  data () {
    return {
      curHostInfoKey:"hostsInfo_1",
      hostsInfo: JSON.parse(JSON.stringify(thFunc.allHostsInfosTmp["hostsInfo_1"])),
      upBtnIsShow:false
    }
  },
  mounted: function () {
    this.onUpdateClick()
  },
  computed:{
      net0: {
        get: function(){ return this.hostsInfo.hostList[0].net },
        set: function(){ return this.hostsInfo.hostList[0].net; this.upBtnIsShow = true}
      },
      ips0: {
        get: function(){ return this.hostsInfo.hostList[0].ips.join('\n') },
        set: function(newValue){this.hostsInfo.hostList[0].ips = util.getIpsFromStr(newValue);
          this.upBtnIsShow = true
        }
      },
      net1: {
        get: function(){ return this.hostsInfo.hostList[1].net },
        set: function(){ return this.hostsInfo.hostList[1].net; this.upBtnIsShow = true}
      },
      ips1: {
        get: function(){ return this.hostsInfo.hostList[1].ips.join('\n') },
        set: function(newValue){this.hostsInfo.hostList[1].ips = util.getIpsFromStr(newValue)
          this.upBtnIsShow = true
        }
      },
      etcdHostsStr:{
        get: function(){ return this.hostsInfo.etcdHostsStr },
        set: function(newValue) { this.hostsInfo.etcdHostsStr = newValue, this.upBtnIsShow = true}
      },
      mainHost:{
        get: function(){ return this.hostsInfo.mainHost },
        set: function(newValue) { this.hostsInfo.mainHost = newValue, this.upBtnIsShow = true}
      }
  },
  methods: {
    curHostsInfoChg:function(){
      let curHostInfo = thFunc.allHostsInfosTmp[this.curHostInfoKey]
      this.hostsInfo = JSON.parse(JSON.stringify(curHostInfo))
    },
    onUpdateClick: function(){
      this.$emit('hostsInfoChg', JSON.parse(JSON.stringify(this.hostsInfo)))
      this.upBtnIsShow = false
    }
  },
  watch: {
    hostsInfo: function (newHostsInfo, oldHostsInfo) {
      this.upBtnIsShow = true
    }
  },
}
</script>
