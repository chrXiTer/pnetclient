<template>
  <div style="text-align: left">
    选择网络
    <el-select v-model="usedNetName" placeholder="请选择">
      <el-option 
        v-for="item in optionsNet" :key="item.value" :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-input type="text" v-model="startNo" style="width :100px"><template slot="prepend">startNo</template></el-input>
    <el-input type="text" v-model="endNo" style="width :100px"><template slot="prepend">endNo</template></el-input>
    <el-button-group>
      <el-button v-on:click="create1k">创建容器</el-button>
    </el-button-group>
  </div>
</template>

<script>

import thFunc from '../ts/thFunc'
import thTest from '../ts/cmdStrTpl'

export default {
  props:['hosts', "networks"],
  data () {
    return {
      startNo:1,
      endNo:500,
      usedNetName:""
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
      
      this.hosts.forEach((host) => {
        let cmd = cmdStrTpl.test100k.getCmdToRunNAlpine(host, this.startNo, this.endNo)
        thFunc.execCmdAHost(this, host, cmd, (self, resp) => {
            resp.data = JSON.stringify(resp.data)
            self.$emit('text100kResp', resp)
        })
      })
    }
  }
}
</script>

