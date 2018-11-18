<template>
  <div>
      <el-input placeholder="请输入后台url" v-bind:value="backendUrl" v-on:input="onBackendUrlInput">
        <template slot="prepend">后台url</template>
        <el-button slot="append" icon="el-icon-check" v-on:click="chgRootUrl">
          {{isDiff}}</el-button>
      </el-input>
      <el-button @click="sendACmd">echo 测试</el-button>
      <el-button @click="deploy4Calico">部署calico（无k8s）到[144,145].26-26</el-button>
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

var thFunc = {
  sonObj: {
    dict1:{
      username:'nscc',
      host:'',
      password:'nsccGZ-KD1810',
      srcResDir:'',
      destResDir:'',
      cmd:''
    },
    hosts:[],
    cmdStr:""
  },
  execCmd:function(self, hosts, cmdStr, callback){
    jsonObj = thFunc.jsonObj
    jsonObj.hosts = hosts
    jsonObj.cmdStr = cmdStr
    var jsonStr = JSON.stringify(jsonObj)
    const url = rootUrl + '/api/execCmd?jsonStr=' + encodeURIComponent(jsonStr)
    axios({method: 'get', url: url}).then(resp => {
        callback(self, resp)
    });
  },
  scpDir:function(self, hosts, parentDir, DirName, callback){
    jsonObj = thFunc.jsonObj
    jsonObj.hosts = hosts
    jsonObj.parentDir = parentDir
    jsonObj.DirName = DirName
    var jsonStr = JSON.stringify(jsonObj)
    const url = rootUrl + '/api/scpDir?jsonStr=' + encodeURIComponent(jsonStr)
    axios({method: 'get', url: url}).then(resp => {
        callback(self, resp)
    });
  },
  scpFile:function(self, hosts, DirPath, DirName, callback){
    jsonObj = thFunc.jsonObj
    jsonObj.hosts = hosts
    jsonObj.DirPath = DirPath
    jsonObj.filename = filename
    var jsonStr = JSON.stringify(jsonObj)
    const url = rootUrl + '/api/scpFile?jsonStr=' + encodeURIComponent(jsonStr)
    axios({method: 'get', url: url}).then(resp => {
        callback(self, resp)
    });
  }
}


let funcSeqs = [ //数组内的函数，将从前至后依次执行
  (gValue, execfuncSeqs)=>{ // 将最新的配置文件同步到各主机
    thFunc.execCmd(gValue.hosts, thFunc.jsonObj.dict1, cmd, execfuncSeqs)
  },
  (gValue, execfuncSeqs)=>{ // 配置docker使用试验特征、以及使用etcd存储(用于2.6.11)
    let cmd = 'cp /home/nscc/th/calico-2.6.11/daemon.json /etc/docker/;'
        + 'systemctl daemon-reload; systemctl restart docker'
    thFunc.execCmd(gValue.hosts, thFunc.jsonObj.dict1, cmd, execfuncSeqs)
  },
  (gValue, execfuncSeqs)=>{ // 在其中一个节点安装 etcd
    let cmd = 'IP_ADDR=' + etcdHost + ';' + 
          'docker run -d --name etcdv3 \
              --network host \
              -v /root/etcd:/var/etcd \
              k8s.gcr.io/etcd-amd64:3.2.18 \
              /usr/local/bin/etcd \
                  --name main \
                  --data-dir /var/etcd/main-data \
                  --advertise-client-urls http://${IP_ADDR}:2379 \
                  --listen-client-urls http://${IP_ADDR}:2379 \
                  --listen-peer-urls http://0.0.0.0:2380 \
                  --auto-compaction-retention 1 \
                  --cors "*" \
          '
    thFunc.execCmd(gValue.etcdHost, thFunc.jsonObj.dict1, cmd, execfuncSeqs)
  },
  (gValue, execfuncSeqs)=>{ // 运行 calico node 2.6.11 容器
    let cmd='/home/nscc/th/calico-2.6.11/calicoctl node run --node-image=quay.io/calico/node:v2.6.11 '
        + '--config=/home/nscc/th/calico-2.6.11/calico-1.cfg'
    thFunc.execCmd(gValue.hosts, thFunc.jsonObj.dict1, cmd, execfuncSeqs)
  },
]

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

  export default {
    data(){
      return {
        backendUrl:rootUrl,
        isDiff: "",
        visible: false,
        cmdoutContent: ""
      }
    },
    methods: {
      onBackendUrlInput(evnet){
        this.backendUrl = event.target.value
        this.isDiff = rootUrl == this.backendUrl ? "" : "请更新"
      },
      chgRootUrl(){
        rootUrl = this.backendUrl
        this.isDiff = ""
      },
      sendACmd(){
        thFunc.execCmd(this, ["10.144.0.20, 10.145.0.20"], "echo 222222", handlerRetStr)
      },
      deploy4Calico(){
          let funcSeqsRev = []
          funcSeqs.forEach((v) => {funcSeqsRev.push(v)})
          let gValue = {
            hosts:["10.144.0.26", "10.144.0.27", "10.145.0.26", "10.145.0.27"],
            etcdHost:"10.144.0.26"
          }
          function execfuncSeqs(self, resp){
            handlerRetStr(self, resp)
            if(funcSeqsRev.length > 0){
              let func = funcSeqsRev.pop()
              func(gValue, execfuncSeqs)
            }
          }
          self = this
          execfuncSeqs(self, {data:"*** start ****\n"})
      }
    }
  }
</script>
