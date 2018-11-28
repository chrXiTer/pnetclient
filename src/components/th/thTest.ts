var thTest = {
    getCmdToRunNNginx(n:number) {
        return 'cat << EOF | sh -\n'
            + 'exec 1 > logRun1kNginx.log\n'
            + 'date "+%Y-%m-%d %H:%M:%S %N"\n'
            + 'for i in \\$(seq 1 1000)\n'
            + 'do\n'
            + 'docker run -itd --network none --name nn_\\$1 alpine:3.7 sh\n'
            + 'done\n'
            + 'date "+%Y-%m-%d %H:%M:%S %N"\n'
            + 'EOF'
    },
    getCmdConnectToNetwork(networkName:string){
        return 'cat << EOF | sh -\n'
        + 'exec 1 > logConToNet.log\n'
        + 'date "+%Y-%m-%d %H:%M:%S %N"\n'
        + 'for i in \\$(seq 1 1000)\n'
        + 'do\n'
        + 'docker network connect ' + networkName + 'nn_\\$1\n'
        + 'done\n'
        + 'date "+%Y-%m-%d %H:%M:%S %N"\n'
        + 'EOF'
    }
}
export default thTest