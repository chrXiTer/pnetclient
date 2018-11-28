<template>
  <div>
    <h2>在此输入后台url</h2>
    <el-input placeholder="请输入后台url" v-bind:value="backendUrl" v-on:input="onBackendUrlInput">
      <template slot="prepend">后台url</template>
      <el-button slot="append" icon="el-icon-check" v-on:click="chgRootUrl">
        {{isDiff}}</el-button>
    </el-input>
    <h2>在此输入主机列表</h2>
    <CHostList v-bind="hostsInfo" v-on:hostsInfoChg="onHostsInfoChg"></CHostList>      

    <h2>配置及 calico 网络部署</h2>
    <el-button @click="sendACmd">echo 测试</el-button>
    <el-button @click="scpCfgFile">同步配置文件到主机</el-button>
    <el-button @click="upDocker">更新docker配置并重启</el-button>
    <el-button @click="deployEtcd">部署 Etcd 到 144.0.26</el-button>
    <el-button @click="runCalico">运行 calico-node </el-button><br />
    <el-button @click="deploy4Calico">[一步完成]部署calico（无k8s）到[144,145].25-26</el-button>
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
    <CCreateContainer></CCreateContainer>
    <h2>1k容器入网测试</h2>
    <el-button-group>
      <el-button v-on:click="create1k">创建 容器</el-button>
      <el-select v-model="networkToCon" placeholder="请选择">
        <el-option
          v-for="item in optionsNet"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button v-on:click="con1kToNet">加入网络</el-button>
    </el-button-group>
    <div id="cmdout" v-html="cmdoutContent" style="background-color: grey; color: white"></div>
  </div>
</template>

<script>

import thFunc from './th'
import thTest from './thTest'
import CHostList from './sub/CHostList.vue'
import CCreateContainer from './sub/CCreateContainer.vue'


export default {
  data(){
    
    return {
      backendUrl:thFunc.rootUrl,
      isDiff: "",
      visible: false,
      cmdoutContent: "",
      newNetName: "",
      hostList: [
        {net:"10.144.0.26/16", ips:["10.144.0.26", "10.144.0.27"]},
        {net:"10.145.0.26/16", ips:["10.145.0.26", "10.145.0.27"]}
      ],
      etcdHost:"10.144.0.26",
      mainHost:"10.144.0.26",
      calicoIpPool:"10.190.160.0/19",
      networkToCon:""
    }
  },
  created: function () {
    thFunc.getBaseInfo(this)
  },
  computed: {
    hosts: function () {
      let hosts = []
      this.hostList.forEach((e) => {hosts = hosts.concat(e.ips)})
      return [].concat(hosts)
    },
    hostsInfo:function(){
      return {
        hostList:this.hostList,
        etcdHost:this.etcdHost,
        mainHost:this.mainHost
      }
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
    onHostsInfoChg(newHostsInfoChg){
      this.hostList = newHostsInfoChg.hostList
      this.etcdHost = newHostsInfoChg.etcdHost || this.etcdHost
      this.mainHost = newHostsInfoChg.etcdHost || this.mainHost
    },
    sendACmd(){
      thFunc.execCmd(this, ["10.144.0.20", "10.145.0.20"], "echo 222222", thFunc.handlerRetStr)
    },
    deploy4Calico(){
        let funcSeqsRev = []
        th.funcSeqs.forEach((v) => {funcSeqsRev.push(v)})
        funcSeqsRev.reverse()
        function execfuncSeqs(self, resp){
          handlerRetStr(self, resp)
          if(funcSeqsRev.length > 0){
            let func = funcSeqsRev.pop()
            func(self, execfuncSeqs)
          }
        }
        let self = this
        execfuncSeqs(self, {data:"*** start ****\n"})
    },
    scpCfgFile(){
      thFunc.scpDir(this, this.hosts, '/home/nscc/th/', 'calico-2.6.11', thFunc.handlerRetStr)
    },
    upDocker(){
      let cmd = thFunc.getUpDockerCmd()
      thFunc.execCmd(this, this.hosts, cmd, thFunc.handlerRetStr)
    },
    deployEtcd(){
      let cmd = thFunc.getEtcdDeployCmd(etcdHost)
      thFunc.execCmd(this, [this.etcdHost], cmd, (self, resp) => {
          handlerRetStr(self, resp)
      })
    },
    runCalico(){
      thFunc.runCalico(this, this.hosts, thFunc.handlerRetStr)
    },
    createCalicoIpPool(){
      if(this.calicoIpPool == ""){
        return 
      }
      let cmd = thFunc.getCreateCalicoIpPoolCmd(this.calicoIpPool)
      thFunc.execCmd(this, [this.mainHost], cmd, thFunc.handlerRetStr)
      this.calicoIpPool = ""
    },
    createCalicoNet(){
      if(this.newNetName == ""){
        return
      }
      let cmd = thFunc.getCreateCalicoNetCmd(this.newNetName)
      thFunc.execCmd(this, [this.mainHost], cmd, thFunc.handlerRetStr)
      this.newNetName = ""
    },
    createOverlayNet(){
      if(this.newNetName == ""){
        return
      }
      let cmd = thFunc.getCreateOverlayNetCmd(this.newNetName)
      thFunc.execCmd(this, [this.mainHost], cmd, thFunc.handlerRetStr)
      this.newNetName = ""
    },
    createMacvlanNet(){
      if(this.newNetName == ""){
        return
      }
      let cmd = thFunc.getCreateMacvlanNetCmd(this.newNetName)
      thFunc.execCmd(this, this.hosts, cmd, thFunc.handlerRetStr)
      this.newNetName = ""
    },
    create1k(){

    },
    con1kToNet(){

    }
  }
}
</script>

<style>
h2 {
  text-align: left
}
</style>
