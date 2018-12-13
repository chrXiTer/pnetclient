interface IHostToSubnetPrefix {
    [propName: string]: string[];
}

let HostToSubnetPrefix:IHostToSubnetPrefix = {
    "10.145.0.27":["19.27.0.","19.27.16.","19.27.32.","19.27.64.","19.27.128."],
    "10.145.0.28":["19.28.0.","19.28.16.","19.28.32.","19.28.64.","19.28.128."]
}

let test100kb = {
getCmdCreateBridgeNet(host:string, hosts:string[]){
    let subnetPrefixs = HostToSubnetPrefix[host]
    // host本机创建网桥的命令
    let c = subnetPrefixs.map((subnetPrefix, index,)=>{return `
docker network create --subnet=${subnetPrefix}.0/20 --gateway=${subnetPrefix}.1 netb${index+1};
        `.trim()}).join(' ')

    // host本机添加到达其他主机相关网桥的路由命令
    let r = hosts.map((ohost) =>{
        if(ohost == host){
            return ''
        }else{
            let subnetPrefixs = HostToSubnetPrefix[ohost]
            return subnetPrefixs.map((subnetPrefix, index,)=>{return `
route add -net ${subnetPrefix}.0/20  gw ${ohost};
            `.trim()}).join(' ')
        }
    }).join(' ')
    let d = `
iptables -D FORWARD -j DOCKER-ISOLATION;
`.trim()
    return c + r + d;
},
getCmdDeleteBridgeNet(usedNetName:string, host:string, hosts:string[]){
    let subnetPrefixs = HostToSubnetPrefix[host]
    // host本机删网桥的命令
    let c = `
docker network rm ${usedNetName}
`.trim()
    // host本机删除到达其他主机对应网桥的路由命令
    let r = hosts.map((ohost) =>{
        if(ohost == host){
            return ''
        }
        let netNo = Number.parseInt((usedNetName.match(/\d+/) || ["-1"])[0])
        if(netNo < 0){
            return ''
        }
        let subnetPrefix = HostToSubnetPrefix[ohost][netNo - 1]
        return `
route del -net ${subnetPrefix}.0/20;
        `.trim()
    }).join(' ')
    return c + r;
},
createContainer(usedNetName:string, host:string, startNo:string, endNo:string){
    let netNo = Number.parseInt((usedNetName.match(/\d+/) || ["-1"])[0])
    if(netNo < 0){return ''}
    let cNamePrefix = 'b' + netNo + '-'
return `
for i in $(seq ${startNo} ${endNo})
do
docker run -itd  --network ${usedNetName} --name ${cNamePrefix}$i alpine:3.8 sh
echo $i
done
`
},
deleteContainer(usedNetName:string, host:string, startNo:string, endNo:string){
    let netNo = Number.parseInt((usedNetName.match(/\d+/) || ["-1"])[0])
    if(netNo < 0){return ''}
    let cNamePrefix = 'b' + netNo + '-'
return `
for i in $(seq ${startNo} ${endNo})
do
docker rm ${cNamePrefix}$i alpine:3.8 sh
echo $i
done
`
}
}

export default test100kb

