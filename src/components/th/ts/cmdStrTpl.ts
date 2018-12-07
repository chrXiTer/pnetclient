let test1K = {
getCmdToRunNNginx(n:number) { return `
cat << EOF | sh -
exec 1>logRun1kNginx.log
date "+%Y-%m-%d %H:%M:%S %N"
for i in \\$(seq 1 ${n}
do
docker run -itd --network none --name nn_\\$i nginx:1.15-alpine sh
done
date "+%Y-%m-%d %H:%M:%S %N"
EOF
`.trim()
},
getCmdConnectToNetwork(networkName:string, n:number){return `
cat << EOF | sh -
exec 1>logConToNet.log
date "+%Y-%m-%d %H:%M:%S %N"
for i in \\$(seq 1 ${n})
do
docker network disconnect none nn_\\$i
docker network connect ${networkName} nn_\\$i
done
date "+%Y-%m-%d %H:%M:%S %N"
EOF
`.trim()
},
getCmdToRmNNginx(n:number){`
cat << EOF | sh -
exec 1>logConToNet.log
date "+%Y-%m-%d %H:%M:%S %N"
for i in \\$(seq 1 ${n})
do
docker rm -f nn_\\$i
done
date "+%Y-%m-%d %H:%M:%S %N"
EOF
`.trim()
}
}

let hostE = {
getCmdCfgDocker:(etcdHost:string) =>{return `
cat << EOF > /etc/docker/daemon.json; systemctl daemon-reload; systemctl restart docker;
{ 
    "experimental" :true,
    "cluster-store":"etcd://${etcdHost}:2379",
    "cluster-advertise":"enp8s0f0:2375"
}
EOF
`.trim()
},
cfgK8sCmd:`
echo 'KUBELET_EXTRA_ARGS="--max-pods=100000 --cadvisor-port=4194"' > /etc/default/kubelet;
systemctl daemon-reload;
systemctl restart kubelet
`.trim(),
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
`.trim(),
cmdLoadImages:`
ls /home/nscc/th/tar | xargs -n 1 docker load -i
`.trim()
}

let k8s = {
masterInit:`
kubeadm init --kubernetes-version=v1.11.3 --token-ttl 0 
    --pod-network-cidr 10.190.224.0/19 
    --service-cidr 10.190.96.0/19
`.trim(),
chgDnsAddr:`
sed -i 's/10.96.0.10/10.190.96.10/g' /var/lib/kubelet/config.yaml
`.trim()
}

let dockerC = {
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
}
}


let dockerE = {
getCreateCalicoNetCmd: (calicoNetName:string) => { return `
docker network create --driver calico --ipam-driver calico-ipam \
    --subnet=10.190.160.0/19 ${calicoNetName}
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
hostE:hostE,
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