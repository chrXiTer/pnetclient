<template>
  <div>
    <h2>在此输入后台url-所有页面有效</h2>
    <CSetBackendUrl v-bind:backendUrl="thFunc.rootUrl" v-on:chgBackendUrl="thFunc.chgRootUrl"></CSetBackendUrl>
    <h3>以下供复制用</h3>
    <CHostsToCopy></CHostsToCopy>
    <h2 style="clear:both">要操作的主机--当前页有效</h2>
    <el-input type="textarea" :rows="5" placeholder="输入要操作的主机列表" v-on:blur="onBlur" v-model="hostsStr"></el-input>
    <el-input v-model="cmd">
      <template slot="prepend">要执行的命令</template>
      <el-button slot="append" icon="el-icon-check" v-on:click="execACmd">执行</el-button>
      <el-button slot="append" icon="el-icon-check" v-on:click="execACmd2">执行2</el-button>
    </el-input>
    <el-button @click="setNsccOwn">设置/home/nscc所有文件归nscc所有</el-button><br/>

    <CListDir v-bind:dialogVisible="dirDialogVisible" v-on:curDirChg="onCurDirChg" v-on:onClose="onCurDirDialogClose"></CListDir>
    <el-tag>{{curDirText}}</el-tag>
    <el-button type="primary" plain  size="small" v-on:click="openCurDirDialog">修改目录</el-button>
    <el-button slot="append" v-on:click="scpDir">scp同步</el-button>
    <el-button slot="append" v-on:click="rsyncDir">rsync同步</el-button>
    <el-button slot="append" v-on:click="loadImageDir">load所有image</el-button><br/>

    <el-button @click="delNoneImage">删除 none image</el-button>
    <el-button @click="chgAptSource">更新apt源</el-button>
    <el-button @click="chgHostName">修改主机名</el-button>
    <el-button @click="installBaseSoft">安装基础软件vim-curl-unzip</el-button>
    <el-button @click="installDocker">安装docker</el-button>
    <el-button @click="loadImages">载入容器镜像</el-button>
    <el-button @click="installK8s">安装k8s</el-button>
    <el-button v-on:click="cmdoutContent=''">清空 cmdout</el-button>
    <div id="cmdout" v-html="cmdoutContent" style="clear:both; background-color: grey; color: white"></div>
  </div>
</template>

<script>

import thFunc from './ts/thFunc'
import util from '../../lib/cx_util';
import cmdStrTpl from './ts/cmdStrTpl'
import CSetBackendUrl from './sub/CSetBackendUrl.vue'
import CHostsToCopy from './sub/CHostsToCopy.vue'
import CListDir from '../sub/CListDir.vue'

export default {
  data(){
    return {
      dirDialogVisible:false,
      hostsStr:"",
      cmd:"",
      subDir:"/home/nscc/th/test/",
      cmdoutContent: "",
      thFunc:thFunc,
      curDirText: "将处理的文件目录:" + "/home/nscc/th/test/"
    }
  },
  computed: {
    hosts: function () {
      return util.getIpsFromStr(this.hostsStr)
    }
  },
  components:{
    CSetBackendUrl,
    CHostsToCopy,
    CListDir
  },
  methods: {
    openCurDirDialog(){
      this.dirDialogVisible=true
    },
    onCurDirDialogClose(){
      this.dirDialogVisible=false
    },
    onCurDirChg(newValue){
      this.curDirText = "将处理的文件目录:" + newValue
      this.subDir = newValue
      
    },
    onBlur(){
      this.hostsStr = this.hostsStr.replace(/\n/g, ";").replace(/\s/g, '').replace(/;;+/g, ";\n")
    },
    execACmd(){  // 对所有主机都执行某条命令，总共向服务端发送一条请求
      thFunc.execCmd(this, this.hosts, this.cmd, thFunc.handlerRetStr)
    },
    execACmd2(){ // 对所有主机都执行某条命令，每一个主机都服务端发送一条请求
      let self = this
      this.hosts.map((host)=>{
        thFunc.execCmdAHost(self, host, self.cmd, (self, resp) => {
          resp.data = JSON.stringify(resp.data)
          thFunc.handlerRetStr(self, resp)
        })
      })
    },
    setNsccOwn(){
      thFunc.execCmd(this, this.hosts, cmdStrTpl.hostE.cmdSetNsccOwn, thFunc.handlerRetStr)
    },
    chgAptSource(){
        thFunc.execCmd(this, this.hosts, cmdStrTpl.hostE.cmdChgAptSource, thFunc.handlerRetStr)
    },
    chgHostName(){
      let self = this
      this.hosts.map((host)=>{
        let h4ns = host.split(".")
        let newHostName = `n-${h4ns[1]}-${h4ns[2]}-${h4ns[3]}`
        let cmd = cmdStrTpl.hostE.getCmdChgHostName(newHostName)
        thFunc.execCmdAHost(self, host, cmd, (self, resp) => {
          resp.data = JSON.stringify(resp.data)
          thFunc.handlerRetStr(self, resp)
        })
      })
    },
    installBaseSoft(){
      thFunc.execCmd(this, this.hosts, cmdStrTpl.hostE.cmdInstallBaseSoft, thFunc.handlerRetStr)
    },
    installDocker(){
      thFunc.execCmd(this, this.hosts, cmdStrTpl.hostE.cmdInstallDocker, thFunc.handlerRetStr)
    },
    installK8s(){
      thFunc.execCmd(this, this.hosts, cmdStrTpl.hostE.cmdInstallK8s, thFunc.handlerRetStr)
    },
    loadImages(){
      thFunc.execCmd(this, this.hosts, cmdStrTpl.dockerI.cmdLoadImages('/home/nscc/th/tar'), thFunc.handlerRetStr)
    },
    scpDir(){
      this.subDir = this.subDir.replace(/\s/g, '').replace(/\/$/, '')
      let index = this.subDir.lastIndexOf("/")
      let dir1 = this.subDir.substring(0, index)
      let dir2 = this.subDir.substring(index)
      thFunc.scpFile(this, this.hosts, dir1, dir2, thFunc.handlerRetStr)
    },
    rsyncDir(){
      this.subDir = this.subDir.replace(/\s/g, '').replace(/\/$/, '')
      let index = this.subDir.lastIndexOf("/")
      let dir1 = this.subDir.substring(0, index)
      let dir2 = this.subDir.substring(index)
      thFunc.rsyncFile(this, this.hosts, dir1, dir2, thFunc.handlerRetStr)
    },
    loadImageDir(){
      this.subDir = this.subDir.replace(/\s/g, '').replace(/\/$/, '')
      thFunc.execCmd(this, this.hosts, cmdStrTpl.dockerI.cmdLoadImages(this.subDir), thFunc.handlerRetStr)
    },
    delNoneImage(){
      thFunc.execCmd(this, this.hosts, cmdStrTpl.dockerI.cmdDelNoneImages, thFunc.handlerRetStr)
    }
  }
}
</script>

<style>
h3 {
  text-align: left;
}
pre {
  float: left;
}
</style>
