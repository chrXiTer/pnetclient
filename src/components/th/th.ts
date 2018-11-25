import axios from 'axios'
import util from '../../lib/cx_util'

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
    rootUrl:"http://localhost",
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
    scpFile:function(self:any, hosts:Array<string>, dirPath:string, filename:string, callback:TCallback){
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
        return 'IP_ADDR=' + etcdHost + ';' + 
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
    },
    runCalico: (self:any, hosts:Array<string>, callback:TCallback) => {
        let cmd='/home/nscc/th/calico-2.6.11/calicoctl node run --node-image=quay.io/calico/node:v2.6.11 '
        + '--config=/home/nscc/th/calico-2.6.11/calico-1.cfg'
        thFunc.execCmd(self, hosts, cmd, callback)
    },
    getCreateCalicoNetCmd: (calicoNetName:string) => {
        return "docker network create --driver calico --ipam-driver calico-ipam " + calicoNetName
    }
}

export default thFunc