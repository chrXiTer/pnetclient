interface IHostToSubnetPrefix {
    [propName: string]: string[];
}

let HostToSubnetPrefix:IHostToSubnetPrefix = {
    //"10.145.32.27":["19.27.0.","19.27.16.","19.27.32.","19.27.64.","19.27.128."],
    //"10.145.32.28":["19.28.0.","19.28.16.","19.28.32.","19.28.64.","19.28.128."]
    "10.145.16.1":["16.1.0.","16.1.16.","16.1.32.","16.1.64.","16.1.128."],
    "10.145.16.2":["16.2.0.","16.2.16.","16.2.32.","16.2.64.","16.2.128."],
    "10.145.16.3":["16.3.0.","16.3.16.","16.3.32.","16.3.64.","16.3.128."],
    "10.145.16.4":["16.4.0.","16.4.16.","16.4.32.","16.4.64.","16.4.128."],
    "10.145.16.5":["16.5.0.","16.5.16.","16.5.32.","16.5.64.","16.5.128."],
    "10.145.16.6":["16.6.0.","16.6.16.","16.6.32.","16.6.64.","16.6.128."],
    "10.145.16.7":["16.7.0.","16.7.16.","16.7.32.","16.7.64.","16.7.128."],
    "10.145.16.8":["16.8.0.","16.8.16.","16.8.32.","16.8.64.","16.8.128."],
    "10.145.16.9":["16.9.0.","16.9.16.","16.9.32.","16.9.64.","16.9.128."],
    "10.145.16.10":["16.10.0.","16.10.16.","16.10.32.","16.10.64.","16.10.128."],
    "10.145.16.11":["16.11.0.","16.11.16.","16.11.32.","16.11.64.","16.11.128."],
    "10.145.16.12":["16.12.0.","16.12.16.","16.12.32.","16.12.64.","16.12.128."],
    "10.145.16.13":["16.13.0.","16.13.16.","16.13.32.","16.13.64.","16.13.128."],
    "10.145.16.14":["16.14.0.","16.14.16.","16.14.32.","16.14.64.","16.14.128."],
    "10.145.16.15":["16.15.0.","16.15.16.","16.15.32.","16.15.64.","16.15.128."],
    "10.145.16.16":["16.16.0.","16.16.16.","16.16.32.","16.16.64.","16.16.128."],
    "10.145.16.17":["16.17.0.","16.17.16.","16.17.32.","16.17.64.","16.17.128."],
    "10.145.16.18":["16.18.0.","16.18.16.","16.18.32.","16.18.64.","16.18.128."],
    "10.145.16.19":["16.19.0.","16.19.16.","16.19.32.","16.19.64.","16.19.128."],
    "10.145.16.20":["16.20.0.","16.20.16.","16.20.32.","16.20.64.","16.20.128."],
    "10.145.16.21":["16.21.0.","16.21.16.","16.21.32.","16.21.64.","16.21.128."],
    "10.145.16.22":["16.22.0.","16.22.16.","16.22.32.","16.22.64.","16.22.128."],
    "10.145.16.23":["16.23.0.","16.23.16.","16.23.32.","16.23.64.","16.23.128."],
    "10.145.16.24":["16.24.0.","16.24.16.","16.24.32.","16.24.64.","16.24.128."],
    "10.145.16.25":["16.25.0.","16.25.16.","16.25.32.","16.25.64.","16.25.128."],
    "10.145.16.26":["16.26.0.","16.26.16.","16.26.32.","16.26.64.","16.26.128."]
}

let test100kb = {
getCmdCreateBridgeNet(host:string, hosts:string[]){
    let subnetPrefixs = HostToSubnetPrefix[host]
    // host本机创建网桥的命令
    let c = subnetPrefixs.map((subnetPrefix, index,)=>{return `
docker network create --subnet=${subnetPrefix}0/20 --gateway=${subnetPrefix}1 netb${index+1};
        `.trim()}).join(' ')

    // host本机添加到达其他主机相关网桥的路由命令
    let r = hosts.map((ohost) =>{
        if(ohost == host){
            return ''
        }else{
            let subnetPrefixs = HostToSubnetPrefix[ohost]
            return subnetPrefixs.map((subnetPrefix, index,)=>{return `
route add -net ${subnetPrefix}0/20  gw ${ohost};
            `.trim()}).join(' ')
        }
    }).join(' ')
    let d = `
iptables -P FORWARD ACCEPT; \
iptables -D FORWARD -j DOCKER-ISOLATION; \
sysctl fs.inotify.max_user_watches=91234;
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
route del -net ${subnetPrefix}0/20;
        `.trim()
    }).join(' ')
    return c + r;
},
getCmdCreateContainer(usedNetName:string, host:string, startNo:string, endNo:string){
    let netNo = Number.parseInt((usedNetName.match(/\d+/) || ["-1"])[0])
    if(netNo < 0){return ''}
    let cNamePrefix = 'b' + netNo + '-'
return `
for i in $(seq ${startNo} ${endNo})
do
docker run -itd  --network ${usedNetName} --name ${cNamePrefix}$i alpine:3.8 sh
echo $i
done
`.trim()
},
getCmdDeleteContainer(usedNetName:string, host:string, startNo:string, endNo:string){
    let netNo = Number.parseInt((usedNetName.match(/\d+/) || ["-1"])[0])
    if(netNo < 0){return ''}
    let cNamePrefix = 'b' + netNo + '-'
return `
for i in $(seq ${startNo} ${endNo})
do
docker rm -f ${cNamePrefix}$i alpine:3.8 sh
echo $i
done
`.trim()
}
}

export default test100kb

