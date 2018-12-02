import cmdStrTpl from './cmdStrTpl'
var thTest = {
    getCmdToRunNNginx(n:number) {
        return cmdStrTpl.test1K.cmdToRunNNginx.replace('{-{n}-}', n.toString())
    },
    getCmdConnectToNetwork(networkName:string, n:number){
        return cmdStrTpl.test1K.cmdConnectToNetwork
            .replace('{-{networkName}-}', networkName)
            .replace('{-{n}-}', n.toString())
    },
    getCmdToRmNNginx(n:number){
        return cmdStrTpl.test1K.cmdToRmNNginx.replace('{-{n}-}', n.toString())
    }
}
export default thTest
