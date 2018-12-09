<template>
  <div>
    <h2>在此输入后台url</h2>
    <CSetBackendUrl v-bind:backendUrl="thFunc.rootUrl" v-on:chgBackendUrl="thFunc.chgRootUrl"></CSetBackendUrl>
    <h2>在此输入主机列表</h2>
    <CHostList v-bind="hostsInfo" v-on:hostsInfoChg="onHostsInfoChg"></CHostList>      

    <h2>配置及 k8s 网络部署</h2>
    <el-button @click="scpCfgFile">同步配置文件到主机</el-button>
    <el-button @click="setKubelet">更新k8s配置并重启</el-button>
    <el-button @click="masterNodeInit">master 节点 init</el-button>
    <el-button @click="workNodeJoin">work 节点 join</el-button>
    <el-button @click="xxxxx">运行 calico-node </el-button><br />
  </div>
</template>

<script lang="tsx">

import thFunc from './ts/thFunc'
import thFuncK8s from './ts/thFuncK8s'
import CHostList from './sub/CHostList.vue'
import CSetBackendUrl from './sub/CSetBackendUrl.vue'
import { Component, Vue } from 'vue-property-decorator';
import cmdStrTpl from './ts/cmdStrTpl';

@Component({
  components: {
    CHostList,
    CSetBackendUrl
  }
})

export default class ThPK8s extends Vue{
  cmdoutContent = ""
  newNetName = ""
  hostsInfo = {
    hostList: [
      {net:"10.144.0.26/16", ips:["10.144.0.26", "10.144.0.27"]},
      {net:"10.145.0.26/16", ips:["10.145.0.26", "10.145.0.27"]}
    ],
    etcdHostsStr:"10.145.16.32;10.145.16.31;10.145.16.30;",
    mainHost:"10.144.0.26",
  }
  calicoIpPool = "10.190.160.0/19"
  networkList:string[] = []
  thFunc = thFunc

  mounted() {
    let self = this
    thFunc.getBaseInfo(this.hostsInfo.mainHost, (ret:string[])=>{
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
      self.networkList = networkList
    })
  }
  get hosts():string[] {
    let hosts:string[] = []
    this.hostsInfo.hostList.forEach((e) => {hosts = hosts.concat(e.ips)})
    return hosts//[].concat(hosts)
  }
  get optionsNet(){
    return this.networkList.map(e => {
      return {value: e, label: e}
    });
  }
    onHostsInfoChg(newHostsInfoChg:any){
      this.hostsInfo.hostList = newHostsInfoChg.hostList
      this.hostsInfo.etcdHostsStr = newHostsInfoChg.etcdHost || this.hostsInfo.etcdHostsStr
      this.hostsInfo.mainHost = newHostsInfoChg.mainHost || this.hostsInfo.mainHost
    }
    scpCfgFile(){
      thFunc.scpDir(this, this.hosts, '/home/nscc/th/', 'calico-2.6.11', thFunc.handlerRetStr)
    }
    setKubelet(){
      thFunc.execCmd(this, this.hosts, cmdStrTpl.hostE.cfgK8sCmd, thFunc.handlerRetStr)
    }
    masterNodeInit(){

      thFunc.execCmdAHost(self, this.hostsInfo.mainHost, cmdStrTpl.k8s.masterInit, (self,resp:any) => {
          resp.data = JSON.stringify(resp.data)
          thFunc.handlerRetStr(self, resp.data)
          thFunc.execCmdAHost(self, this.hostsInfo.mainHost, cmdStrTpl.k8s.chgDnsAddr, (self,resp:any) => {
            resp.data = JSON.stringify(resp.data)
            thFunc.handlerRetStr(self, resp.data)
          })
      })
    }
    workNodeJoin(){

    }
  }
</script>

<style>
h2 {
  text-align: left
}
</style>
