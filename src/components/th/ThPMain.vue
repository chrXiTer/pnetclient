<template>
  <div>
      <el-input placeholder="请输入后台url" v-bind:value="backendUrl" v-on:input="onBackendUrlInput">
        <template slot="prepend">后台url</template>
        <el-button slot="append" icon="el-icon-check" v-on:click="chgRootUrl">
          {{isDiff}}</el-button>
      </el-input>
      <el-button @click="sendACmd">echo 测试</el-button><br />
      <el-button @click="scpCfgFile">同步配置文件到主机</el-button>
      <el-button @click="upDocker">更新docker配置并重启</el-button>
      <el-button @click="deployEtcd">部署 Etcd到144.0.26</el-button>
      <el-button @click="runCalico">运行 calico-node</el-button><br />
      <el-button @click="deploy4Calico">[一步完成]部署calico（无k8s）到[144,145].25-26</el-button>
      <el-input placeholder="请输入calico网络名" v-model="calicoNetName">
        <template slot="prepend">calico网络名</template>
        <el-button slot="append" v-on:click="createCalicoNet">创建</el-button>
      </el-input>
      <div id="cmdout" v-html="cmdoutContent" 
          style="background-color: grey; color: white"></div>
  </div>
</template>

<script>
let funcSeqs = [ //数组内的函数，将从前至后依次执行
  (self, gValue, execfuncSeqs)=>{ // 将最新的配置文件同步到各主机
    thFunc.scpDir(self, gValue.hosts, '/home/nscc/th/', 'calico-2.6.11', execfuncSeqs)
  },
  (self, gValue, execfuncSeqs)=>{ // 配置docker使用试验特征、以及使用etcd存储(用于2.6.11)
    let cmd = thFunc.getUpDockerCmd()
    thFunc.execCmd(self, gValue.hosts, cmd, execfuncSeqs)
  },
  (self, gValue, execfuncSeqs)=>{ // 在其中一个节点安装 etcd
    let cmd = thFunc.getEtcdDeployCmd(gValue.etcdHost)
    thFunc.execCmd(self, [gValue.etcdHost], cmd, execfuncSeqs)
  },
  (self, gValue, execfuncSeqs)=>{ // 运行 calico node 2.6.11 容器
    thFunc.runCalico(self, gValue.hosts, execfuncSeqs)
  },
]

import thFunc from './th'

let G_Value = {
  hosts:["10.144.0.26", "10.144.0.27", "10.145.0.26", "10.145.0.27"],
  etcdHost:"10.144.0.26"
}

export default {
  data(){
    return {
      backendUrl:thFunc.rootUrl,
      isDiff: "",
      visible: false,
      cmdoutContent: "",
      calicoNetName:""
    }
  },
  methods: {
    onBackendUrlInput(evnet){
      this.backendUrl = event.target.value
      this.isDiff = thFunc.rootUrl == this.backendUrl ? "" : "请更新"
    },
    chgRootUrl(){
      thFunc.rootUrl = this.backendUrl
      this.isDiff = ""
    },
    sendACmd(){
      thFunc.execCmd(this, ["10.144.0.20", "10.145.0.20"], "echo 222222", thFunc.handlerRetStr)
    },
    deploy4Calico(){
        let funcSeqsRev = []
        funcSeqs.forEach((v) => {funcSeqsRev.push(v)})
        funcSeqsRev.reverse()
        function execfuncSeqs(self, resp){
          handlerRetStr(self, resp)
          if(funcSeqsRev.length > 0){
            let func = funcSeqsRev.pop()
            func(self, G_Value, execfuncSeqs)
          }
        }
        let self = this
        execfuncSeqs(self, {data:"*** start ****\n"})
    },
    scpCfgFile(){
      thFunc.scpDir(this, G_Value.hosts, '/home/nscc/th/', 'calico-2.6.11', thFunc.handlerRetStr)
    },
    upDocker(){
      let cmd = thFunc.getUpDockerCmd()
      thFunc.execCmd(this, G_Value.hosts, cmd, thFunc.handlerRetStr)
    },
    deployEtcd(){
      let cmd = thFunc.getEtcdDeployCmd(etcdHost)
      thFunc.execCmd(this, [G_Value.etcdHost], cmd, (self, resp) => {
          handlerRetStr(self, resp)
      })
    },
    runCalico(){
      thFunc.runCalico(this, G_Value.hosts, thFunc.handlerRetStr)
    },
    createCalicoNet(){
      let hosts = ["10.144.0.26"]
      if(this.calicoNetName == ""){
        return
      }
      let cmd = thFunc.getCreateCalicoNetCmd(this.calicoNetName)
      thFunc.execCmd(this, hosts, cmd, thFunc.handlerRetStr)
      this.calicoNetName = ""
    }
  }
}
</script>