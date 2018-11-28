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
      networkToCon:"",
      networkList:[]
    }
  },
  mounted: function () {
    let self = this
    thFunc.getBaseInfo(this, this.mainHost, (ret)=>{
      let images = JSON.parse(ret[0])
      imagesList = []
      images.forEach((e)=>{
        imagesList = imagesList.concat(e.RepoTags)
      })

      let networks = JSON.parse(ret[0])
      networkList = []
      networks.forEach((e)=>{
        networkList.push(e.Name)
      })
      this.networkList = networkList
    })
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
str = '"[{"Containers":-1,"Created":1541764235,"Id":"sha256:6d982318cb0fe42a419d0a21d780a73c4ca723163b153762708db22beeefb1b5","Labels":{"maintainer":"cx \\u003ccx@663.cn\\u003e"},"ParentId":"","RepoDigests":null,"RepoTags":["quagga1.2-ap3.7:latest"],"SharedSize":-1,"Size":19814376,"VirtualSize":19814376},{"Containers":-1,"Created":1539987201,"Id":"sha256:eb79eb3e019024430a193963e55129733ba2161e6fe3913751b04044d6f46130","Labels":null,"ParentId":"","RepoDigests":null,"RepoTags":["quay.io/calico/node:v3.3.0"],"SharedSize":-1,"Size":75315754,"VirtualSize":75315754},{"Containers":-1,"Created":1539985135,"Id":"sha256:12c23e5f5c5e1352da0b5c495e4ea2a4d52f62612d63cb8a94584b02febe870b","Labels":{"maintainer":"Tom Denham \\u003ctom@tigera.io\\u003e"},"ParentId":"","RepoDigests":null,"RepoTags":["quay.io/calico/cni:v3.3.0"],"SharedSize":-1,"Size":75322848,"VirtualSize":75322848},{"Containers":-1,"Created":1539985084,"Id":"sha256:519ddeede00e42a13e60d0d301d3bcb338e8d2897e16519f16ae705dc9ca3a98","Labels":null,"ParentId":"","RepoDigests":null,"RepoTags":["quay.io/calico/ctl:v3.3.0"],"SharedSize":-1,"Size":35269146,"VirtualSize":35269146},{"Containers":-1,"Created":1539984921,"Id":"sha256:c3b58a38b07a3b73a44e20205104888d630e45398b0b1c2a46cf8f51ddffbb68","Labels":{"maintainer":"Casey Davenport \\u003ccasey@tigera.io\\u003e"},"ParentId":"","RepoDigests":null,"RepoTags":["quay.io/calico/kube-controllers:v3.3.0"],"SharedSize":-1,"Size":56519584,"VirtualSize":56519584},{"Containers":-1,"Created":1539617041,"Id":"sha256:df3b036d669394e0f1a52b32097f9a324e3b7edc4d518ccc31ea01fd061b4399","Labels":{"io.k8s.description":"This is a component of OpenShift Container Platform and provides a meta CNI plugin.","io.k8s.display-name":"Multus CNI","io.openshift.tags":"openshift","maintainer":"cx\\u003ccx@663.cn\\u003e","org.label-schema.build-date":"20180804","org.label-schema.license":"GPLv2","org.label-schema.name":"CentOS Base Image","org.label-schema.schema-version":"1.0","org.label-schema.vendor":"CentOS"},"ParentId":"","RepoDigests":null,"RepoTags":["chrx/multus:v3.1"],"SharedSize":-1,"Size":476694299,"VirtualSize":476694299},{"Containers":-1,"Created":1538508100,"Id":"sha256:aae476eee77d4fd6998c09c3ac5593da3ff26239f383b1189945e34a28a37e11","Labels":{"maintainer":"NGINX Docker Maintainers \\u003cdocker-maint@nginx.com\\u003e"},"ParentId":"","RepoDigests":null,"RepoTags":["nginx:1.15-alpine"],"SharedSize":-1,"Size":17740450,"VirtualSize":17740450},{"Containers":-1,"Created":1536704390,"Id":"sha256:196d12cf6ab19273823e700516e98eb1910b03b17840f9d5509f03858484d321","Labels":null,"ParentId":"","RepoDigests":null,"RepoTags":["alpine:3.8"],"SharedSize":-1,"Size":4413370,"VirtualSize":4413370},{"Containers":-1,"Created":1536518679,"Id":"sha256:be5a6e1ecfa6f24b7124e433102716d1f05a706a04e17df9663910c3dc4c338b","Labels":null,"ParentId":"","RepoDigests":null,"RepoTags":["k8s.gcr.io/kube-proxy-amd64:v1.11.3"],"SharedSize":-1,"Size":97785549,"VirtualSize":97785549},{"Containers":-1,"Created":1536518678,"Id":"sha256:a710d6a925193b5c209aa425095277979df2398a0ac8ea144dcd5e0bf3163ec7","Labels":null,"ParentId":"","RepoDigests":null,"RepoTags":["k8s.gcr.io/kube-controller-manager-amd64:v1.11.3"],"SharedSize":-1,"Size":155275795,"VirtualSize":155275795},{"Containers":-1,"Created":1536518678,"Id":"sha256:3de571b6587bdc6b92499dce1b2f564a93f4772cbdf6a254f8c7656a0e40b7ba","Labels":null,"ParentId":"","RepoDigests":null,"RepoTags":["k8s.gcr.io/kube-apiserver-amd64:v1.11.3"],"SharedSize":-1,"Size":186676561,"VirtualSize":186676561},{"Containers":-1,"Created":1536518678,"Id":"sha256:ca1f38854f740cd8c99cecd7007ce60d6a9b447ffb7e4dc07e2d36dcafe66f50","Labels":null,"ParentId":"","RepoDigests":null,"RepoTags":["k8s.gcr.io/kube-scheduler-amd64:v1.11.3"],"SharedSize":-1,"Size":56799644,"VirtualSize":56799644},{"Containers":-1,"Created":1536273369,"Id":"sha256:c78c348458e32dc68147cb658dd1aa00b2501c03a9b01c36d9e8d6d1736f225c","Labels":null,"ParentId":"","RepoDigests":null,"RepoTags":["quay.io/calico/node:v2.6.11"],"SharedSize":-1,"Size":281230404,"VirtualSize":281230404},{"Containers":-1,"Created":1536186012,"Id":"sha256:cd6d8154f1e16e38493c3c2798977c5e142be5e5d41403ca89883840c6d51762","Labels":null,"ParentId":"","RepoDigests":null,"RepoTags":["ubuntu:bionic"],"SharedSize":-1,"Size":84117621,"VirtualSize":84117621},{"Containers":-1,"Created":1535089187,"Id":"sha256:0dab2435c100b32892e676b9709978617a5472390ac951f764c292950b902b1f","Labels":{"maintainer":"Piotr Bryk \\u003cbryk@google.com\\u003e"},"ParentId":"","RepoDigests":null,"RepoTags":["k8s.gcr.io/kubernetes-dashboard-amd64:v1.10.0"],"SharedSize":-1,"Size":122460923,"VirtualSize":122460923},{"Containers":-1,"Created":1534593467,"Id":"sha256:d9e7bffad290f3b17e741384529c0477f377bfe4b4fc3665c6a65e3a30cf4b52","Labels":{"io.k8s.description":"This is a component of OpenShift Container Platform and provides a meta CNI plugin.","io.k8s.display-name":"Multus CNI","io.openshift.tags":"openshift","maintainer":"Doug Smith \\u003cdosmith@redhat.com\\u003e","org.label-schema.build-date":"20180804","org.label-schema.license":"GPLv2","org.label-schema.name":"CentOS Base Image","org.label-schema.schema-version":"1.0","org.label-schema.vendor":"CentOS"},"ParentId":"","RepoDigests":null,"RepoTags":["nfvpe/multus:v3.1"],"SharedSize":-1,"Size":476693600,"VirtualSize":476693600},{"Containers":-1,"Created":1532610912,"Id":"sha256:72d68eecf40cc460a9e7c6fb87aaeb13e2fb611cab6ed9d0cfdd43129696e836","Labels":null,"ParentId":"","RepoDigests":null,"RepoTags":["k8s.gcr.io/heapster-amd64:v1.5.4"],"SharedSize":-1,"Size":75318342,"VirtualSize":75318342},{"Containers":-1,"Created":1532510961,"Id":"sha256:eb180058aee0e21f347687d53f9d63b9e174b7b589fd2b26bff9499dc19116de","Labels":null,"ParentId":"","RepoDigests":null,"RepoTags":["k8s.gcr.io/heapster-influxdb-amd64:v1.5.2"],"SharedSize":-1,"Size":16515310,"VirtualSize":16515310},{"Containers":-1,"Created":1532510152,"Id":"sha256:25e1da333f76398ddc2a224dfc17ab02014b460a45101b6c77d054cdf2ce5eca","Labels":null,"ParentId":"","RepoDigests":null,"RepoTags":["k8s.gcr.io/heapster-grafana-amd64:v5.0.4"],"SharedSize":-1,"Size":170981547,"VirtualSize":170981547},{"Containers":-1,"Created":1527146932,"Id":"sha256:b3b94275d97cb24e34af9bb70e8582c312596eaa33716b98b46e0dffdab2f6a4","Labels":{},"ParentId":"","RepoDigests":null,"RepoTags":["k8s.gcr.io/coredns:1.1.3"],"SharedSize":-1,"Size":45587362,"VirtualSize":45587362},{"Containers":-1,"Created":1523470985,"Id":"sha256:b8df3b177be232e6de335cd10df2b1c7fb1b3e8e62390e0f25b357b71e97d0fb","Labels":null,"ParentId":"","RepoDigests":null,"RepoTags":["k8s.gcr.io/etcd-amd64:3.2.18"],"SharedSize":-1,"Size":218904307,"VirtualSize":218904307},{"Containers":-1,"Created":1516732160,"Id":"sha256:f0fad859c909baef1b038ef8d2f6e76fc252e25a3d9af37b82ce70623fb7cd6f","Labels":{"maintainer":"Tom Denham \\u003ctom@tigera.io\\u003e"},"ParentId":"","RepoDigests":null,"RepoTags":["quay.io/coreos/flannel:v0.10.0-amd64"],"SharedSize":-1,"Size":44598861,"VirtualSize":44598861},{"Containers":-1,"Created":1513805449,"Id":"sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e","Labels":{},"ParentId":"","RepoDigests":null,"RepoTags":["k8s.gcr.io/pause:3.1"],"SharedSize":-1,"Size":742472,"VirtualSize":742472}]"'
</script>

<style>
h2 {
  text-align: left
}
</style>
