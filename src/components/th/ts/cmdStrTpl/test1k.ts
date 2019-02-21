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

    export default test1K