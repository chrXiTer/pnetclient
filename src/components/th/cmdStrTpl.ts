var cmdStrTpl = {
cmdCreateCalicoIpPool:
`cat <<EOF | /home/nscc/th/calico-2.6.11/calicoctl create \
--config=/home/nscc/th/calico-2.6.11/calico-1.cfg -f -
apiVersion: v1
kind: ipPool
metadata:
    cidr: {-{cidr}-}
spec:
    ipip:
        enabled: cross-subnet
    nat-outgoing: true
EOF`,

cmdEtcdDeploy:
`IP_ADDR={-{etcdHost}-};
docker run -d --name etcdv3
    --network host 
    -v /root/etcd:/var/etcd 
    k8s.gcr.io/etcd-amd64:3.2.18 
    /usr/local/bin/etcd 
        --name main 
        --data-dir /var/etcd/main-data 
        --advertise-client-urls http://\${IP_ADDR}:2379 
        --listen-client-urls http://\${IP_ADDR}:2379 
        --listen-peer-urls http://0.0.0.0:2380 
        --auto-compaction-retention 1 
        --cors "*" 
`,

test1K:{
cmdToRunNNginx:
`cat << EOF | sh -
exec 1>logRun1kNginx.log
date "+%Y-%m-%d %H:%M:%S %N"
for i in \\$(seq 1 {-{n}-})
do
docker run -itd --network none --name nn_\\$i nginx:1.15-alpine sh
done
date "+%Y-%m-%d %H:%M:%S %N"
EOF`,
cmdConnectToNetwork:
`cat << EOF | sh -
exec 1>logConToNet.log
date "+%Y-%m-%d %H:%M:%S %N"
for i in \\$(seq 1 {-{n}-})
do
docker network disconnect none nn_\\$i
docker network connect {-{networkName}-} nn_\\$i
done
date "+%Y-%m-%d %H:%M:%S %N"
EOF`,
cmdToRmNNginx:
`cat << EOF | sh -
exec 1>logConToNet.log
date "+%Y-%m-%d %H:%M:%S %N"
for i in \\$(seq 1 {-{n}-})
do
docker rm -f nn_\\$i
done
date "+%Y-%m-%d %H:%M:%S %N"
EOF`
}

}
export default cmdStrTpl

/*
docker exec -it  nn_1 ip addr
docker exec -it  nn_1 ping -c 2 10.144.0.26;sleep 3
date "+%Y-%m-%d %H:%M:%S %N"
docker exec -it  nn_1 ip addr
docker exec -it  nn_1 ping -c 2 10.144.0.26
*/