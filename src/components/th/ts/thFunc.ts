import axios from 'axios'
import util from '../../../lib/cx_util'
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
        host:'',
        cmd:''
      },
      hosts:[""],
      cmdStr:"",
      parentDir:"",
      dirName:"",
      dirPath:"",
      filename:""
    },
    chgRootUrl:function(newBackendUrl:string){
        thFunc.rootUrl = newBackendUrl
    },
    execCmd:function(self:any, hosts:Array<string>, cmdStr:string, callback:TCallback){
        if(hosts.length == 0){
            return
        }
        let jsonObj = thFunc.jsonObj
        jsonObj.hosts = hosts
        jsonObj.cmdStr = cmdStr
        var jsonStr = JSON.stringify(jsonObj)
        const url = thFunc.rootUrl + '/api/execCmd?jsonStr=' + encodeURIComponent(jsonStr)
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
    execCmdLocal:function(self:any, cmdStr:string, callback:TCallback){
        let jsonObj = {cmd:cmdStr}
        var jsonStr = JSON.stringify(jsonObj)
        const url = thFunc.rootUrl + '/api/execCmdLocal?jsonStr=' + encodeURIComponent(jsonStr)
        axios({method: 'get', url: url}).then(resp => {
            callback(self, resp)
        });
    },
    scpDir:function(self:any, hosts:Array<string>, parentDir:string, DirName:string, callback:TCallback){
        if(hosts.length == 0){
            return
        }
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
    getImages: (host:string, ret:string[], callback:(ret:string[])=>void) => {
        thFunc.execCmdAHost(self, host, cmdStrTpl.dockerHttp.cmdImages, (self,resp:any) => {
            let first = resp.data.out.indexOf("[")
            let last = resp.data.out.lastIndexOf("]")
            let jsonStr = resp.data.out.substring(first, last+1)
            ret.push(jsonStr)
            callback(ret)
        })
    },
    getNetworks: (host:string, ret:string[], callback:(ret:string[])=>void) => {
        thFunc.execCmdAHost(self, host, cmdStrTpl.dockerHttp.networks, (self,resp:any) => {
            let first = resp.data.out.indexOf("[")
            let last = resp.data.out.lastIndexOf("]")
            let jsonStr = resp.data.out.substring(first, last+1)
            ret.push(jsonStr)
            callback(ret)
        })
    },
    getBaseInfo: (host:string, callback:(ret:string[])=>void) => {
        let ret: string[] = []
        thFunc.getImages(host, ret, (ret) =>{
            thFunc.getNetworks(host, ret, callback)       
        })
    },

    allHostsInfosTmp:{
        hostsInfo_1: {
          hostList: [
            {net:"10.144.0.26/24", ips:["10.144.0.26", "10.144.0.27"]},
            {net:"10.145.0.26/24", ips:["10.145.0.26", "10.145.0.27"]}
          ],
          etcdHostsStr:"10.144.0.26;",
          mainHost:"10.144.0.26",
        },
        hostsInfo_2:{
          hostList: [
            {net:"10.145.16.0/24", ips:[
                "10.145.16.1", "10.145.16.2", "10.145.16.3", "10.145.16.4", "10.145.16.5",
                "10.145.16.6", "10.145.16.7", "10.145.16.8", "10.145.16.9", "10.145.16.10",
                "10.145.16.11", "10.145.16.12", "10.145.16.13", "10.145.16.14", "10.145.16.15",
                "10.145.16.16", "10.145.16.17", "10.145.16.18", "10.145.16.19", "10.145.16.20",
                "10.145.16.21", "10.145.16.22", "10.145.16.23", "10.145.16.24", "10.145.16.25",
                "10.145.16.26", "10.145.16.27", "10.145.16.28", 
            ]},
            {net:"10.145.32.0/24", ips:[
                "10.145.32.3","10.145.32.4","10.145.32.5",
                "10.145.32.6","10.145.32.7","10.145.32.8","10.145.32.9","10.145.32.10",
                "10.145.32.11","10.145.32.12",
                "10.145.32.15","10.145.32.16","10.145.32.17","10.145.32.18","10.145.32.19",
                "10.145.32.20","10.145.32.21","10.145.32.22","10.145.32.23","10.145.32.24",]}
          ],
          etcdHostsStr:"10.145.16.32;10.145.16.31;10.145.16.30;",
          mainHost:"10.145.16.1",
        }
    }
}

export default thFunc


