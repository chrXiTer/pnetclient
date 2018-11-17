<template>
  <div>
      <el-button @click="sendACmd">复制文件到新装的ubuntu</el-button>
      <el-button @click="sendACmd">设置root密码</el-button>
      <div id="cmdout" v-html="cmdoutContent" 
          style="background-color: grey; color: white"></div>
  </div>
</template>


<script>

var util = {
  /*1.用浏览器内部转换器实现html转码*/
  htmlEncode:function (html){
      var temp = document.createElement ("div");
      //将要转换的字符串设置为这个元素的innerText(ie支持)或者textContent(火狐,google支持)
      (temp.textContent != undefined ) ? (temp.textContent = html) : (temp.innerText = html);
      var output = temp.innerHTML;
      return output;
  },
  /*2.用浏览器内部转换器实现html解码*/
  htmlDecode:function (text){
      var temp = document.createElement("div");
      temp.innerHTML = text;
      //返回这个元素的innerText(ie支持)或者textContent(火狐,google支持),即得到经过HTML解码的字符串了。
      var output = temp.innerText || temp.textContent;
      return output;
  }
};

  import axios from 'axios'
  let rootUrl = "http://localhost"

  function handlerRetStr(self, resp){
      let newText = resp.data.replace(/\r\n?/g, '\n')
      const newLines = newText.split('\n')
      let newLinesEncode = newLines.map((e) => {
          return util.htmlEncode(e)
      })
      const newAddStr = newLinesEncode.join("<br/>")
      self.cmdoutContent = self.cmdoutContent + newAddStr
  }

  function sendACmd_(self){
    var jsonObj = {
      dict1:{
        username:'nscc',
        host:'',
        password:'nsccGZ-KD1810',
        srcResDir:'',
        destResDir:'',
        cmd:''
      },
      hosts:["10.144.0.20, 10.145.0.20"],
      cmdStr:"echo 222222"
    }
    var jsonStr = JSON.stringify(jsonObj)

    const url = rootUrl + '/api/execCmd?jsonStr=' + encodeURIComponent(jsonStr)
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
      sendACmd(){
        sendACmd_(this, "/api/scpFileToLinux")
      }
    }
  }
</script>