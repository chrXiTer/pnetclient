import util from '../../../lib/cx_util'
import test100kb from './cmdStrTpl/test100kb'
import test1K from './cmdStrTpl/test1k'
import k8s from './cmdStrTpl/k8s'


let hostE = {
cmdSetNsccOwn:`
chown -R nscc /home/nscc
`.trim(),
getCmdCfgDocker:(etcdHostsStr:string) => {
    if(etcdHostsStr=="noetcd"){
        return `
cat << EOF > /etc/docker/daemon.json; systemctl daemon-reload; systemctl restart docker;
{
    "experimental" :true
}
EOF
`.trim()
    }
    let ips = util.getIpsFromStr(etcdHostsStr)
    ips = [ips[0]]  // docker 不可以配置多个etcd地址
    let etcdUrlsStr = ips.map((ip)=>{
        return `etcd://${ip}:2379`
    }).join(",")
    return `
cat << EOF > /etc/docker/daemon.json; systemctl daemon-reload; systemctl restart docker;
{ 
    "experimental" :true,
    "cluster-store":"${etcdUrlsStr}",
    "cluster-advertise":"enp8s0f0:2375"
}
EOF
`.trim()
},
cmdRunCalicoNode:`
/home/nscc/th/calico-2.6.11/calicoctl node run \
    --node-image=quay.io/calico/node:v2.6.11 \
    --config=/home/nscc/th/calico-2.6.11/calico-1.cfg
`.trim(),
cmdChgAptSource:`
cat << EOF > /etc/apt/sources.list
deb http://mirrors.aliyun.com/ubuntu/ xenial main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ xenial-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ xenial-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ xenial-backports main restricted universe multiverse
EOF
`.trim(),
getCmdChgHostName: (hnameNew:string)=> {return `
hnameOld=$(hostname); \
echo ${hnameNew} > /etc/hostname; \
sed -i s/$hnameOld/${hnameNew}/ /etc/hosts; \
hostname ${hnameNew};
`.trim()
},
cmdInstallBaseSoft:`
cd /home/nscc/th/deb/vim-curl-unzip.deb;\
dpkg -i --force-all -B *.deb;
`.trim(),
cmdInstallDocker:`
service docker stop;\
cd /home/nscc/th/deb/vim-curl-unzip.deb;\
dpkg -i --force-all -B *.deb;\
cd /home/nscc/th/deb/docker-17.03.2.deb;\
dpkg -i --force-all -B *.deb;
`.trim(),
cmdInstallK8s:`
cd /home/nscc/th/deb/k8s-1.11.3-adm.deb;\
dpkg -i --force-all -B *.deb;
`.trim()
}

let dockerI = {   // 与容器Image相关的命令
cmdLoadImages:(fromDir:string) => { return `
cd ${fromDir}; \
ls | xargs -n 1 docker load -i
`.trim()
},
cmdDelNoneImages:`
docker image rm  $(docker image ls | grep '<none>' | awk '{print $3}')
`.trim(),
cmdDelStopContainer:`
docker container rm $(docker container ls -aq)
`.trim()
}

let dockerC = {  // 与运行容器相关的命令
getEtcdDeployCmd:(etcdHost:string) => { return `
IP_ADDR=${etcdHost}; \
docker run -d --name etcdv3 \
    --network host \
    -v /root/etcd:/var/etcd \
    k8s.gcr.io/etcd-amd64:3.2.18 \
    /usr/local/bin/etcd \
        --name main \
        --data-dir /var/etcd/main-data \
        --advertise-client-urls http://\${IP_ADDR}:2379 \
        --listen-client-urls http://\${IP_ADDR}:2379 \
        --listen-peer-urls http://0.0.0.0:2380 \
        --auto-compaction-retention 1 \
        --cors "*" 
`.trim()
},
getCmdCreateContainer:(network:string, name:string)=>{return `
docker run -itd --network ${network} --name ${name} nginx:1.15-alpine sh
`.trim()
},
cmdRunCadvisor:`
docker run \
    --publish=8080:8080 -d \
    --network host \
    --volume=/:/rootfs:ro \
    --volume=/var/run:/var/run:rw \
    --volume=/sys:/sys:ro \
    --volume=/var/lib/docker/:/var/lib/docker:ro \
    --volume=/dev/disk/:/dev/disk:ro \
    --detach=true \
    --name=cadvisor google/cadvisor:v0.32.0
`.trim()
}


let dockerE = {  //与容器网络相关的命令
getCreateCalicoNetCmd: (calicoNetName:string, subnet:string) => { return `
docker network create --driver calico --ipam-driver calico-ipam \
    --subnet=${subnet} ${calicoNetName}
`.trim()
},
getCreateOverlayNetCmd: (overlayNetName:string) => {return `
docker network create --driver overlay --attachable  ${overlayNetName}
`.trim()
},
getCreateMacvlanNetCmd: (macvlanNetName: string) => {return `
docker network create --driver macvlan \
    --subnet=10.190.32.0/19 \
    --gateway=10.190.32.1 \
    -o parent=enp8s0f0 ${macvlanNetName}
`.trim()
},
getCreateCalicoIpPoolCmd: (cidr: string) => {return `
cat << EOF | /home/nscc/th/calico-2.6.11/calicoctl create \
    --config=/home/nscc/th/calico-2.6.11/calico-1.cfg -f -
apiVersion: v1
kind: ipPool
metadata:
    cidr: ${cidr}
spec:
    ipip:
        enabled: true
        mode: cross-subnet
    nat-outgoing: true
EOF
`.trim()
}
}

let dockerHttp = {
    cmdBase:'curl --unix-socket /var/run/docker.sock ',
    cmdH:'-H "Content-Type: application/json ',
    cmdImages:'curl --unix-socket /var/run/docker.sock http:/v1.24/images/json',
    networks:'curl --unix-socket /var/run/docker.sock http:/v1.24/networks'
}

let cmdStrTpl = {
test1K:test1K,
hostE:hostE,  //远程执行的命令
test100kb:test100kb,
dockerI:dockerI,
dockerC:dockerC,
dockerE:dockerE,
dockerHttp:dockerHttp,
k8s:k8s
}
export default cmdStrTpl

/*
docker exec -it  nn_1 ip addr
docker exec -it  nn_1 ping -c 2 10.144.0.26;sleep 3
date "+%Y-%m-%d %H:%M:%S %N"
docker exec -it  nn_1 ip addr
docker exec -it  nn_1 ping -c 2 10.144.0.26
*/