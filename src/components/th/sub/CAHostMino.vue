<template>
  <el-card class="box-card" :body-style="{padding: '3px'}">
    <label style="font-size:small">{{host}}</label>
    <el-button size="mini" @click="refresh" icon="el-icon-refresh" circle></el-button>
    <el-alert v-bind:title="status.title" v-bind:type="status.type" show-icon></el-alert>
    <el-alert v-bind:title="statusPing.title" v-bind:type="statusPing.type" show-icon></el-alert>
  </el-card>
</template>

<script>
import thFunc from '../ts/thFunc'

export default {
  props:['host'],
  data () {
    return {
      status:{
        type:'info',
        title:'ssh未测'
      },
      statusPing:{
        type:'info',
        title:'ping未测'
      }
    }
  },
  mounted() {
    this.refreshSsh()
    this.refreshPing()
  },
  methods: {
    refresh: function(){
      this.refreshSsh()
      this.refreshPing()
    },
    refreshSsh(){
      let nowDate = new Date()
      let nowTime = nowDate.getTime()
      let self = this
      thFunc.gInfo_cahostmino = thFunc.gInfo_cahostmino || {}
      thFunc.gInfo_cahostmino[self.host] = thFunc.gInfo_cahostmino[self.host] || {
        lasrRefreshTime:0,
        status: {
          type:'info',
          title:'ssh未测'
        }
      }
      let gInfoHost = thFunc.gInfo_cahostmino[self.host];
      if(nowTime - gInfoHost.lasrRefreshTime > 30){
        gInfoHost.lasrRefreshTime = nowTime
        thFunc.execCmdAHost(this, this.host, "echo 1231", (self, resp) => {
          if(resp.data.out.search('echo 1231\r\n1231') >=0 ){
            gInfoHost.status = {
              type: "success",
              title: "ssh可通"
            }
          }else{
            gInfoHost.status = {
              type: "error",
              title: "shh不通"
            }
          }
          self.status = gInfoHost.status
          self.$emit('onCAHostminoRefresh', {host:self.host, data:resp.data.retStr})
        })
      }else{
        self.$emit('onCAHostminoRefresh', {
          host:self.host, 
          data:"未刷新：" + gInfoHost.lasrRefreshTime + ": " + nowTime
        })
      }
    },
    refreshPing(){
        let cmd = "ping -c 2 " + this.host
        thFunc.execCmdLocal(this, cmd, (self, resp) => {
          if(resp.data.out.search('bytes from') >=0 ){
            self.statusPing = {
              type: "success",
              title: "ping可通"
            }
          }else{
            self.statusPing = {
              type: "error",
              title: "ping不通"
            }
          }
          self.$emit('onCAHostminoRefresh', {host:self.host, data:resp.data.retStr})
        })
    }
  }
}
</script>
