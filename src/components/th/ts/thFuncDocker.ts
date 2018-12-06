import axios from 'axios'
import thFunc from './thFunc'
import cmdStrTpl from './cmdStrTpl'

type TCallback = (self:any, resp:object)=>void

var thFuncDocker = {
    funcSeqs:[ //数组内的函数，将从前至后依次执行
        (self:any, execfuncSeqs:()=>{})=>{ // 将最新的配置文件同步到各主机
          thFunc.scpDir(self, self.hosts, '/home/nscc/th/', 'calico-2.6.11', execfuncSeqs)
        },
        (self:any, execfuncSeqs:()=>{})=>{ // 配置docker使用试验特征、以及使用etcd存储(用于2.6.11)
          let cmd = cmdStrTpl.hostE.getCmdCfgDocker(self.etcdHost)
          thFunc.execCmd(self, self.hosts, cmd, execfuncSeqs)
        },
        (self:any, execfuncSeqs:()=>{})=>{ // 在其中一个节点安装 etcd
          let cmd = cmdStrTpl.dockerC.getEtcdDeployCmd(self.etcdHost)
          thFunc.execCmd(self, [self.etcdHost], cmd, execfuncSeqs)
        },
        (self:any, execfuncSeqs:()=>{})=>{ // 运行 calico node 2.6.11 容器
            thFuncDocker.runCalico(self, self.hosts, execfuncSeqs)
        },
    ],
    runCalico: (self:any, hosts:Array<string>, callback:TCallback) => {
        thFunc.execCmd(self, hosts, cmdStrTpl.hostE.cmdRunCalicoNode, callback)
    },
    genSnapshot:function(self:any, srcHost:string, descHost:string, containerName:string, callback:TCallback){
        let jsonObj = {
            srcHost:srcHost,
            descHost:descHost,
            containerName:containerName
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
            containerName:containerName
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
            containerName:containerName
        }
        var jsonStr = JSON.stringify(jsonObj)
        const url = thFunc.rootUrl + '/api/liveMigration?jsonStr=' + encodeURIComponent(jsonStr)
        axios({method: 'get', url: url}).then(resp => {
            callback(self, resp)
        });
    }
}
export default thFuncDocker


