<template>
<div>
  <p>{{curDir}}</p>
  <el-tree :data="data2" :props="defaultProps" node-key="id"
    :render-content="renderContent" @node-expand="onNodeExpand"	>
  </el-tree>
</div>
</template>

<script>
import axios from 'axios'
import thFunc from '@/components/th/ts/thFunc';

let id = 1000;
var dataTree = [{
    id: 1,
    key: "/home/nscc",
    label: '/',
    value: "...",
    dir: true,
    children: [{
        id: 30001,
        label: '...',
    }]
}]

function handlerRetStr(s_this, resp, dataObj, t){
    const newData = resp.data
    if(newData.t != t){
        return
    }
    for(let item of newData.dirs){
        dataObj.children.push({
            id: id,
            key: dataObj.key + "/" + item.name,
            label: item.name,
            value: item.name,
            dir: item.isDir,
            children: [{
                id: 30001,
                label: '...',
            }]
        })
        id = id + 1
    }
}

export default {
    data() {
        return {
            data2: dataTree,
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            curDir: "/home/nscc"
        }
    },

    methods: {
        onNodeExpand(dataObj, node, nodeComponent){
            if(dataObj.dir){
                this.curDir = dataObj.key
                const reqVar = {
                    dir:dataObj.key,
                    t:Date.now()
                }
                const jsonStr = JSON.stringify(reqVar)
                const url = thFunc.rootUrl + "/api/listDir?jsonStr=" + encodeURIComponent(jsonStr)
                let self = this
                axios({method: 'get', url: url}).then(resp=> {
                    handlerRetStr(self, resp, dataObj, reqVar.t)
                });
            }
        },
        renderContent(h, { node, data, store }) {
            return (
                h("span",[
                    h("span", node.label),
                    h("span", {style: {color: "red"}}, node.data.value),
                    h("span", {style: {color: "green"}}, node.data.dir?"dir":"")]
                )
            );
        }
    }
};
</script>