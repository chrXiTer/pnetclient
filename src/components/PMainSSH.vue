<template>
  <div>
      <el-button @click="scpToLinux">复制文件到新装的ubuntu</el-button>
      <el-button @click="setRootPassword">设置root密码</el-button>
      <div id="cmdout" v-html="cmdoutContent" 
          style="clear:both background-color: grey; color: white"></div>
  </div>
</template>


<script>
  import axios from 'axios'
  import util from '../lib/cx_util';

  let rootUrl = "http://localhost:5000"

  function handlerRetStr(self, resp){
      let newText = resp.data.replace(/\r\n?/g, '\n')
      const newLines = newText.split('\n')
      let newLinesEncode = newLines.map((e) => {
          return util.htmlEncode(e)
      })
      const newAddStr = newLinesEncode.join("<br/>")
      self.cmdoutContent = self.cmdoutContent + newAddStr
  }

  function sendACmd(self, urlPath){
      const url = rootUrl + urlPath
      axios({method: 'get', url: url}).then(resp => {
        handlerRetStr(self, resp)
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