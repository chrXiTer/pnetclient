<template>
  <div style="text-align: left">
    选择源主机
    <el-select v-model="srcHost" placeholder="请选择">
      <el-option v-for="item in optionsHost" :key="item.value" 
        :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    选择目的主机
    <el-select v-model="descHost" placeholder="请选择">
      <el-option v-for="item in optionsHost" :key="item.value" 
        :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    选择容器
    <el-select v-model="containerName" placeholder="请选择">
      <el-option 
        v-for="item in optionsNet" :key="item.value" :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-input type="text" v-model="testContainerName" style="width :150px">
        <template slot="prepend">输入测试容器名</template>
        <el-button v-on:click="doCreateTestContainer">创建测试容器</el-button>
    </el-input>
    <el-button v-on:click="genSnapshot">生成快照</el-button>
    <el-button v-on:click="restoreSnapshot">恢复快照</el-button>
    <el-button v-on:click="doMigration">迁移容器</el-button>
  </div>
</template>

<script>

import thFunc from '../ts/thFunc'
import thTest from '../ts/thTest'

export default {
  props:['hosts', "networks"],
  data () {
    return {
      srcHost:"",
      descHost:"",
      containerName:"",
      testContainerName:""
    }
  },
  computed:{
    optionsHost(){
      return this.hosts.map(e => {
        return {value: e, label: e}
      });
    }
  },
  methods: {
    doCreateTestContainer(){
      if(!this.testContainerName){
          return
      }
      let cmd = "docker run -d --name " + this.testContainerName + " --security-opt seccomp:unconfined alpine:3.8 \
         /bin/sh -c 'i=0; while true; do echo $i; i=$(expr $i + 1); sleep 1; done'"
        thFunc.execCmdAHost(this, this.srcHost, cmd, (self, resp) => {
            resp.data = JSON.stringify(resp.data)
            self.$emit('text1KResp', resp)
        })
    },
    genSnapshot(){
      thFunc.genSnapshot(self, this.srcHost, this.descHost, this.testContainerName, (self, resp) => {
          resp.data = JSON.stringify(resp.data)
          self.$emit('text1KResp', resp)
      })
    },
    restoreSnapshot(){
      thFunc.restoreSnapshot(self, this.srcHost, this.descHost, this.testContainerName, (self, resp) => {
          resp.data = JSON.stringify(resp.data)
          self.$emit('text1KResp', resp)
      })
    },
    doMigration(){
      thFunc.liveMigration(self, this.srcHost, this.descHost, this.testContainerName, (self, resp) => {
          resp.data = JSON.stringify(resp.data)
          self.$emit('text1KResp', resp)
      })
    }
  }
}
</script>