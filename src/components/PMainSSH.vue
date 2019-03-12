<template>
  <div>
      <el-button @click="scpToLinux">复制文件到新装的ubuntu</el-button>
      <el-button @click="setRootPassword">设置root密码</el-button>
      <div id="cmdout" v-html="cmdoutContent" 
          style="clear:both; background-color: grey; color: white"></div>
  </div>
</template>


<script>
  import axios from 'axios'
  import util from '../lib/cx_util';
  import thFunc from './th/ts/thFunc'

  let rootUrl = "http://localhost:5000"

  function sendACmd(self, urlPath){
      const url = rootUrl + urlPath
      axios({method: 'get', url: url}).then(resp => {
        thFunc.handlerRetStr(self, resp)
      });
  }
  export default {
    data(){
      return {
        visible: false,
        cmdoutContent: ""
      }
    },
    methods: {
      scpToLinux(){
        sendACmd(this, "/api/scpFileToLinux")
      },
      setRootPassword(){
        sendACmd(this, "/api/setRootPassword")
      }
    }
  }
</script>