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
        return "docker network create --driver calico --ipam-driver calico-ipam "
         + "--subnet=10.30.0.0/24 "+ calicoNetName
    },
    getCreateOverlayNetCmd: (overlayNetName:string) => {
        return "docker network create --driver overlay " + overlayNetName
    },
    getCreateMacvlanNetCmd: (macvlanNetName: string) => {
        return "docker network create --driver macvlan "
        + "--subnet=10.190.32.0/19 "
        + "--gateway=10.190.32.1 "
        + "-o parent=enp8s0f0 " + macvlanNetName
    },
    getCreateCalicoIpPoolCmd: (cidr: string) => {
        return "cat <<EOF | /home/nscc/th/calico-2.6.11/calicoctl create "
            + "--config=/home/nscc/th/calico-2.6.11/calico-1.cfg -f -\n"
            + "apiVersion: v1\n"
            + "kind: ipPool\n"
            + "metadata:\n"
            +"    cidr: " + cidr + "\n"
            +"spec:\n"
            +"    ipip:\n"
            +"        enabled: false\n"
            +"    nat-outgoing: true\n"
            +"EOF"
    }
}

export default thFunc