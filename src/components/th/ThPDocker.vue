<template>
  <div>
    <h2>在此输入后台url</h2>
    <CSetBackendUrl v-bind:backendUrl="thFunc.rootUrl" v-on:chgBackendUrl="thFunc.chgRootUrl"></CSetBackendUrl>
    <h2>在此输入主机列表</h2>
    <CHostList v-on:hostsInfoChg="onHostsInfoChg"></CHostList>  
    <h2>配置及 calico 网络部署</h2>
    <el-button @click="sendACmd">echo 测试</el-button>
    <el-button @click="scpCfgFile">同步配置文件到主机</el-button>
    <el-button @click="deployEtcd">部署 Etcd 到</el-button>
    <el-button @click="runCalico">运行 calico-node </el-button><br />
    <el-button @click="deploy4Calico">[一步完成]部署calico（无k8s</el-button>
    <el-input placeholder="10.145.16.32;10.145.16.31;10.145.16.30;" v-bind:value="hostsInfo.etcdHostsStr">
      <template slot="prepend">输入etcd主机列表</template>
      <el-button slot="append" icon="el-icon-check" v-on:click="upDocker">更新docker配置并重启</el-button>
    </el-input>
    <el-input placeholder="10.190.160.0/19" v-bind:value="calicoIpPool">
      <template slot="prepend">请输入calico ipPool cidr</template>
      <el-button slot="append" icon="el-icon-check" v-on:click="createCalicoIpPool">创建calico ipPood</el-button>
    </el-input>
    <h2>创建网络</h2>
    <el-input placeholder="请输入网络名:" v-model="newNetName">
      <template slot="prepend">输入网络名</template>
    </el-input>
    <el-button-group>
      <el-button v-on:click="createCalicoNet">创建 calico 网络</el-button>
      <el-button v-on:click="createOverlayNet">创建 overlay 网络</el-button>
      <el-button v-on:click="createMacvlanNet">创建 macvlan 网络</el-button>
    </el-button-group>
    <h2>创建容器</h2>
    <CCreateContainer v-bind:hosts="hosts" v-bind:networks="networkList"></CCreateContainer>
    <h2>容器迁移</h2>
    
    <h2>1k容器入网测试</h2>
     <CTest1K v-bind:hosts="hosts" v-bind:networks="networkList" v-on:text1KResp="onText1KResp"></CTest1K>
    <div id="cmdout" v-html="cmdoutContent" style="background-color: grey; color: white"></div>
  </div>
</template>

<script>

import thFunc from './ts/thFunc'
import cmdStrTpl from './ts/cmdStrTpl'
import thFuncDocker from './ts/thFuncDocker'
import CHostList from './sub/CHostList.vue'
import CCreateContainer from './sub/CCreateContainer.vue'
import CTest1K from './sub/CTest1K.vue'
import CSetBackendUrl from './sub/CSetBackendUrl.vue'

export default {
  data(){
    return {
      cmdoutContent: "",
      newNetName: "",
      hostsInfo: JSON.parse(JSON.stringify(thFunc.allHostsInfosTmp["hostsInfo_1"])),
      calicoIpPool:"10.190.160.0/19",
      networkList:[],
      thFunc:thFunc
    }
  },
  mounted: function () {
    let self = this
    thFunc.getBaseInfo(this.hostsInfo.mainHost, (ret)=>{
      let images = JSON.parse(ret[0])
      let imagesList = []
      images.forEach((e)=>{
        imagesList = imagesList.concat(e.RepoTags)
      })

      let networks = JSON.parse(ret[1])
      let networkList = []
      networks.forEach((e)=>{
        networkList.push(e.Name)
      })
      self.networkList = networkList
    })
  },
  computed: {
    hosts: function () {
      let hosts = []
      this.hostsInfo.hostList.forEach((e) => {hosts = hosts.concat(e.ips)})
      return [].concat(hosts)
    },
    optionsNet(){
      return this.networkList.map(e => {
        return {value: e, label: e}
      });
    }
  },
  components:{
    CHostList,
    CCreateContainer,
    CTest1K,
    CSetBackendUrl,
  },
  methods: {
    onHostsInfoChg(newHostsInfoChg){
      this.hostsInfo = {
        hostList: newHostsInfoChg.hostList,
        etcdHostsStr: newHostsInfoChg.etcdHostsStr || this.hostsInfo.etcdHostsStr,
        mainHost: newHostsInfoChg.mainHost || this.hostsInfo.mainHost
      }
    },

    onText1KResp(resp){
      thFunc.handlerRetStr(this, resp)
    },
    sendACmd(){
      thFunc.execCmd(this, ["10.144.0.20", "10.145.0.20"], "echo 222222", thFunc.handlerRetStr)
    },
    deploy4Calico(){
      /*
        let funcSeqsRev = []
        thFuncDocker.funcSeqs.forEach((v) => {funcSeqsRev.push(v)})
        funcSeqsRev.reverse()
        function execfuncSeqs(self, resp){
          thFunc.handlerRetStr(self, resp)
          if(funcSeqsRev.length > 0){
            let func = funcSeqsRev.pop()
            func(self, execfuncSeqs)
          }
        }
        let self = this
        execfuncSeqs(self, {data:"*** start ****\n"})
      */
    },
    scpCfgFile(){
      thFunc.scpDir(this, this.hosts, '/home/nscc/th/', 'calico-2.6.11', thFunc.handlerRetStr)
    },
    upDocker(){
      let cmd = cmdStrTpl.hostE.getCmdCfgDocker(this.hostsInfo.etcdHostsStr)
      thFunc.execCmd(this, this.hosts, cmd, thFunc.handlerRetStr)
    },
    deployEtcd(){
      /*
      let cmd = cmdStrTpl.dockerC.getEtcdDeployCmd(this.etcdHost)
      thFunc.execCmd(this, [this.etcdHostsStr], cmd, (self, resp) => {
          thFunc.handlerRetStr(self, resp)
      })
      */
    },
    runCalico(){
      thFunc.runCalico(this, this.hosts, thFunc.handlerRetStr)
    },
    createCalicoIpPool(){
      if(this.calicoIpPool == ""){
        return 
      }
      let cmd = cmdStrTpl.dockerE.getCreateCalicoIpPoolCmd(this.calicoIpPool)
      thFunc.execCmd(this, [this.mainHost], cmd, thFunc.handlerRetStr)
      this.calicoIpPool = ""
    },
    createCalicoNet(){
      if(this.newNetName == ""){
        return
      }
      let cmd = cmdStrTpl.dockerE.getCreateCalicoNetCmd(this.newNetName)
      thFunc.execCmd(this, [this.mainHost], cmd, thFunc.handlerRetStr)
      this.newNetName = ""
    },
    createOverlayNet(){
      if(this.newNetName == ""){
        return
      }
      let cmd = thFunc.dockerE.getCreateOverlayNetCmd(this.newNetName)
      thFunc.execCmd(this, [this.mainHost], cmd, thFunc.handlerRetStr)
      this.newNetName = ""
    },
    createMacvlanNet(){
      if(this.newNetName == ""){
        return
      }
      let cmd = cmdStrTpl.dockerE.getCreateMacvlanNetCmd(this.newNetName)
      thFunc.execCmd(this, this.hosts, cmd, thFunc.handlerRetStr)
      this.newNetName = ""
    }
  }
}
</script>

<style>
h2 {
  text-align: left
}
</style>
