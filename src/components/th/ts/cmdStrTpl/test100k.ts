let test100k = {
getCmdToRunNAlpine(network:string, host:string, startNo:number, endNo:number) { 
    let hostStr = host.replace(/\./g, '_').trim()
    return `
cat << EOF | sh -
for i in \\$(seq ${startNo} ${endNo})
do
docker run -itd --network ${network} --name ${hostStr}_no_\\$i alpine:3.8 sh
done
EOF
`.trim()
},
getCmdToRmNAlpine(host:string, startNo:number, endNo:number) { 
    let hostStr = host.replace(/\./g, '_').trim()
    return `
cat << EOF | sh -
for i in \\$(seq ${startNo} ${endNo})
do
docker rm -f ${hostStr}_no_\\$i 
done
EOF
`.trim()
}
}

export default test100k