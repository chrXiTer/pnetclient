<template>
  <div>
    <h2>在此输入后台url</h2>
    <CSetBackendUrl v-bind:backendUrl="thFunc.rootUrl" v-on:chgBackendUrl="thFunc.chgRootUrl"></CSetBackendUrl>
    <h2>在此输入主机列表</h2>
    <CHostList v-bind="hostsInfo" v-on:hostsInfoChg="onHostsInfoChg"></CHostList>      

    <h2>配置及 k8s 网络部署</h2>
    <el-button @click="sendACmd">echo 测试</el-button>
    <el-button @click="scpCfgFile">同步配置文件到主机</el-button>
    <el-button @click="upDocker">更新k8s配置并重启</el-button>
    <el-button @click="xxxxx">master 节点 init</el-button>
    <el-button @click="xxxxx">work 节点 join</el-button>
    <el-button @click="xxxxx">运行 calico-node </el-button><br />
  </div>
</template>

<script lang="tsx">

import thFunc from './ts/thFunc'
import thFuncK8s from './ts/thFuncK8s'
import CHostList from './sub/CHostList.vue'
import CSetBackendUrl from './sub/CSetBackendUrl.vue'
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    CHostList,
    CSetBackendUrl
  }
})

export default class ThPK8s extends Vue{
  cmdoutContent = ""
  newNetName = ""
  hostList = [
    {net:"10.144.0.26/16", ips:["10.144.0.26", "10.144.0.27"]},
    {net:"10.145.0.26/16", ips:["10.145.0.26", "10.145.0.27"]}
  ]
  etcdHost = "10.144.0.26"
  mainHost = "10.144.0.26"
  calicoIpPool = "10.190.160.0/19"
  networkList:string[] = []
  thFunc = thFunc

  mounted() {
    let self = this
    thFunc.getBaseInfo(this, this.mainHost, (ret:string[])=>{
      let images = JSON.parse(ret[0]) as {RepoTags:string}[]
      let imagesList:string[] = []
      images.forEach((e)=>{
        imagesList = imagesList.concat(e.RepoTags as string)
      })

      let networks = JSON.parse(ret[1]) as {Name:string}[]
      let networkList:string[] = []
      networks.forEach((e)=>{
        networkList.push(e.Name as string)
      })
      this.networkList = networkList
    })
  }
  get hosts():string[] {
    let hosts:string[] = []
    this.hostList.forEach((e) => {hosts = hosts.concat(e.ips)})
    return hosts//[].concat(hosts)
  }
  get hostsInfo(){
    return {
      hostList:this.hostList,
      etcdHost:this.etcdHost,
      mainHost:this.mainHost
    }
  }
  get optionsNet(){
    return this.networkList.map(e => {
      return {value: e, label: e}
    });
  }
    onHostsInfoChg(newHostsInfoChg:any){
      this.hostList = newHostsInfoChg.hostList
      this.etcdHost = newHostsInfoChg.etcdHost || this.etcdHost
      this.mainHost = newHostsInfoChg.etcdHost || this.mainHost
    }
    sendACmd(){
      thFunc.execCmd(this, ["10.144.0.20", "10.145.0.20"], "echo 222222", thFunc.handlerRetStr)
    }
    scpCfgFile(){
      thFunc.scpDir(this, this.hosts, '/home/nscc/th/', 'calico-2.6.11', thFunc.handlerRetStr)
    }
    upDocker(){
    }
    xxxxx(){
    }
  }
</script>

<style>
h2 {
  text-align: left
}
</style>
