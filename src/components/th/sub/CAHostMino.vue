<template>
  <el-card class="box-card">
    <label>{{host}}</label><el-button size="mini" @click="refresh" icon="el-icon-refresh" circle></el-button>
    <el-alert v-bind:title="status.title" v-bind:type="status.type" show-icon></el-alert>
  </el-card>
</template>

<script>
import thFunc from '../ts/thFunc'

export default {
  props:['host'],
  data () {
    return {
      lastRefreshTime:0,
      status:{
        type:'info',
        title:'检测中'
      }
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    refresh: function(){
      let nowDate = new Date()
      let nowTime = nowDate.getTime()
      self = this
      if(nowTime - self.lastRefreshTime > 20){
        self.lastRefreshTime = nowTime
        thFunc.execCmd(this, [this.host], "echo l23l", (self, resp) => {
          if(resp.data.search('echo 1231\r\n1231') >=0 ){
            self.status = {
              type: "success",
              title: "可连通"
            }
          }
          self.$emit('onCAHostminoRefresh', {host:self.host, data:resp.data})
        })
      }else{
        self.$emit('onCAHostminoRefresh', {
          host:self.host, 
          data:"未刷新：" + self.lastRefreshTime + ": " + nowTime
        })
      }
    }
  }
}
</script>
