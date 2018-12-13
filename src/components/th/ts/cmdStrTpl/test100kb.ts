interface IHostToSubnetPrefix {
    [propName: string]: string[];
}

let HostToSubnetPrefix:IHostToSubnetPrefix = {
    "10.145.16.27":["19.27.32"]
}

function f(host:string, hosts:string[]){
    let subnetPrefixs = HostToSubnetPrefix[host]
    let c = subnetPrefixs.map((subnetPrefix, index,)=>{return `
docker network create --subnet=${subnetPrefix}.0/20 --gateway=${subnetPrefix}.1 netb${index+1};
        `.trim()}).join(' ')
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
    return c + r;
}