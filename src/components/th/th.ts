import axios from 'axios'
import util from '../../lib/cx_util'
import cmdStrTpl from './cmdStrTpl'

type TCallback = (self:any, resp:object)=>void

var thFunc = {
    handlerRetStr(self:any, resp:any){
        let newText = resp.data.replace(/\r\n?/g, '\n')
        const newLines = newText.split('\n')
        let newLinesEncode = newLines.map((e:string) => {
            return util.htmlEncode(e)
        })
        const newAddStr = newLinesEncode.join("<br/>")
        self.cmdoutContent = self.cmdoutContent + newAddStr
    },
    rootUrl:"http://10.145.0.32:8100",
    jsonObj: {
      dict1:{
        username:'nscc',
        host:'',
        password:'nsccGZ-KD1810',
        srcResDir:'',
        destResDir:'',
        cmd:''
      },
      hosts:[""],
      cmdStr:"",
      parentDir:"",
      dirName:"",
      dirPath:"",
      filename:""
    },
    funcSeqs:[ //数组内的函数，将从前至后依次执行
        (self:any, execfuncSeqs:()=>{})=>{ // 将最新的配置文件同步到各主机
          thFunc.scpDir(self, self.hosts, '/home/nscc/th/', 'calico-2.6.11', execfuncSeqs)
        },
        (self:any, execfuncSeqs:()=>{})=>{ // 配置docker使用试验特征、以及使用etcd存储(用于2.6.11)
          let cmd = thFunc.getUpDockerCmd()
          thFunc.execCmd(self, self.hosts, cmd, execfuncSeqs)
        },
        (self:any, execfuncSeqs:()=>{})=>{ // 在其中一个节点安装 etcd
          let cmd = thFunc.getEtcdDeployCmd(self.etcdHost)
          thFunc.execCmd(self, [self.etcdHost], cmd, execfuncSeqs)
        },
        (self:any, execfuncSeqs:()=>{})=>{ // 运行 calico node 2.6.11 容器
          thFunc.runCalico(self, self.hosts, execfuncSeqs)
        },
      ],
    execCmd:function(self:any, hosts:Array<string>, cmdStr:string, callback:TCallback){
      let jsonObj = thFunc.jsonObj
      jsonObj.hosts = hosts
      jsonObj.cmdStr = cmdStr
      var jsonStr = JSON.stringify(jsonObj)
      const url = thFunc.rootUrl + '/api/execCmd?jsonStr=' + encodeURIComponent(jsonStr)
      axios({method: 'get', url: url}).then(resp => {
          callback(self, resp)
      });
    },
    genSnapshot:function(self:any, srcHost:string, descHost:string, containerName:string, callback:TCallback){
        let jsonObj = {
            srcHost:srcHost,
            descHost:descHost,
            containerName:containerName,
            username:thFunc.jsonObj.dict1.username,
            password:thFunc.jsonObj.dict1.password
        }
        var jsonStr = JSON.stringify(jsonObj)
        const url = thFunc.rootUrl + '/api/genSnapshot?jsonStr=' + encodeURIComponent(jsonStr)
        axios({method: 'get', url: url}).then(resp => {
            callback(self, resp)
        });
    },
    restoreSnapshot:function(self:any, srcHost:string, descHost:string, containerName:string, callback:TCallback){
        let jsonObj = {
            srcHost:srcHost,
            descHost:descHost,
            containerName:containerName,
            username:thFunc.jsonObj.dict1.username,
            password:thFunc.jsonObj.dict1.password
        }
        var jsonStr = JSON.stringify(jsonObj)
        const url = thFunc.rootUrl + '/api/restoreSnapshot?jsonStr=' + encodeURIComponent(jsonStr)
        axios({method: 'get', url: url}).then(resp => {
            callback(self, resp)
        });
    },
    liveMigration:function(self:any, srcHost:string, descHost:string, containerName:string, callback:TCallback){
        let jsonObj = {
            srcHost:srcHost,
            descHost:descHost,
            containerName:containerName,
            username:thFunc.jsonObj.dict1.username,
            password:thFunc.jsonObj.dict1.password
        }
        var jsonStr = JSON.stringify(jsonObj)
        const url = thFunc.rootUrl + '/api/liveMigration?jsonStr=' + encodeURIComponent(jsonStr)
        axios({method: 'get', url: url}).then(resp => {
            callback(self, resp)
        });
    },
    execCmdAHost:function(self:any, host:string, cmdStr:string, callback:TCallback){
        let jsonObj = thFunc.jsonObj
        jsonObj.dict1.host = host
        jsonObj.dict1.cmd = cmdStr
        var jsonStr = JSON.stringify(jsonObj.dict1)
        const url = thFunc.rootUrl + '/api/execCmdAHost?jsonStr=' + encodeURIComponent(jsonStr)
        axios({method: 'get', url: url}).then(resp => {
            callback(self, resp)
        });
    },
    scpDir:function(self:any, hosts:Array<string>, parentDir:string, DirName:string, callback:TCallback){
      let jsonObj = thFunc.jsonObj
      jsonObj.hosts = hosts
      jsonObj.parentDir = parentDir
      jsonObj.dirName = DirName
      var jsonStr = JSON.stringify(jsonObj)
      const url = thFunc.rootUrl + '/api/scpDir?jsonStr=' + encodeURIComponent(jsonStr)
      axios({method: 'get', url: url}).then(resp => {
          callback(self, resp)
      });
    },
    scpFile:(self:any, hosts:Array<string>, dirPath:string, filename:string, callback:TCallback) =>{
      let jsonObj = thFunc.jsonObj
      jsonObj.hosts = hosts
      jsonObj.dirPath = dirPath
      jsonObj.filename = filename
      var jsonStr = JSON.stringify(jsonObj)
      const url = thFunc.rootUrl + '/api/scpFile?jsonStr=' + encodeURIComponent(jsonStr)
      axios({method: 'get', url: url}).then(resp => {
          callback(self, resp)
      });
    },
    getUpDockerCmd:() =>{
        return 'cp /home/nscc/th/calico-2.6.11/daemon.json /etc/docker/;'
          + 'systemctl daemon-reload; systemctl restart docker'
    },
    getEtcdDeployCmd:(etcdHost:string) => { 
        return cmdStrTpl.cmdEtcdDeploy.replace('{-{etcdHost}-}', etcdHost)
    },
    runCalico: (self:any, hosts:Array<string>, callback:TCallback) => {
        let cmd='/home/nscc/th/calico-2.6.11/calicoctl node run --node-image=quay.io/calico/node:v2.6.11 '
        + '--config=/home/nscc/th/calico-2.6.11/calico-1.cfg'
        thFunc.execCmd(self, hosts, cmd, callback)
    },
    getCreateCalicoNetCmd: (calicoNetName:string) => {
        return "docker network create --driver calico --ipam-driver calico-ipam "
         + "--subnet=10.190.160.0/19 "+ calicoNetName
    },
    getCreateOverlayNetCmd: (overlayNetName:string) => {
        return "docker network create --driver overlay --attachable" + overlayNetName
    },
    getCreateMacvlanNetCmd: (macvlanNetName: string) => {
        return "docker network create --driver macvlan "
        + "--subnet=10.190.32.0/19 "
        + "--gateway=10.190.32.1 "
        + "-o parent=enp8s0f0 " + macvlanNetName
    },
    getCreateCalicoIpPoolCmd: (cidr: string) => {
        return cmdStrTpl.cmdCreateCalicoIpPool.replace("{-{cidr}-}", cidr)
    },
    getCmdCreateContainer:(network:string, host:string, name:string)=>{
        return "docker run -itd --network " + network + " --name " + name + " nginx:1.15-alpine sh"
    },
    getBaseInfo: (self:any, host:string, callback:(ret:object)=>void) => {
        let str0 = 'curl --unix-socket /var/run/docker.sock '
        let strH = '-H "Content-Type: application/json '
        let cmd = str0 + 'http:/v1.24/images/json'
        let ret: object[] = []
        thFunc.execCmdAHost(self, host, cmd, (self,resp:any) => {
            let first = resp.data.out.indexOf("[")
            let last = resp.data.out.lastIndexOf("]")
            let jsonStr = resp.data.out.substring(first, last+1)
            ret.push(jsonStr)
            cmd = str0 + 'http:/v1.24/networks'
            thFunc.execCmdAHost(self, host, cmd, (self,resp:any) => {
                let first = resp.data.out.indexOf("[")
                let last = resp.data.out.lastIndexOf("]")
                let jsonStr = resp.data.out.substring(first, last+1)
                ret.push(jsonStr)
                callback(ret)
            })
        })
    }
}

export default thFunc


