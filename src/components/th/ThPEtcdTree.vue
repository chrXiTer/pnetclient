<template>
<div>
  <el-input placeholder="输入etcd的url" v-model="backendUrl">
        <template slot="prepend">etcd的url</template>
        <el-button slot="append" icon="el-icon-check" v-on:click="onChgEtcdUrl"></el-button>
  </el-input>

  <el-tree :data="data2" :props="defaultProps" node-key="id"
    :render-content="renderContent" @node-expand="onNodeExpand"	>
  </el-tree>
</div>
</template>

<script>
  import axios from 'axios'
  let id = 1000;
  var dataTree = [{
          id: 1,
          key:"/",
          label: '/',
          value:"...",
          dir:true,
          dir2:true,
          children: [
              {
              id: 30001,
              label: '...',
          }
          ]
        }]

  function handlerRetStr(s_this, resp, dataObj, node, nodeComponent){
      const newData = resp.data.node
      if(newData.dir){
          dataObj.dir2 = true
          dataObj.children = []
          let id = dataObj.id * 10
          if(newData.nodes){    
            for(let subData of newData.nodes){
                dataObj.children.push({
                        id: id,
                        key:subData.key,
                        label: subData.key.replace(newData.key, ""),
                        value: subData.value || "...",
                        dir:true,
                        dir2:false,
                        children: [
                            {
                            id: 30001,
                            label: '...',
                        }
                    ]
                })
                id = id + 1
            }
          }else{
              //空目录无需处理
          }
      }else{
          dataObj.dir2 = false
          dataObj.value = newData.value
      }
  }

  export default {
    data() {
      return {
        rootUrl:"http://10.144.0.26:2379/v2/keys",
        backendUrl:"http://10.144.0.26:2379/v2/keys",
        data2: dataTree,
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },

    methods: {
      onChgEtcdUrl(){
        this.rootUrl = this.backendUrl
      },
      onNodeExpand(dataObj, node, nodeComponent){
          if(dataObj.dir){
            const url = this.rootUrl + dataObj.key
            let self = this
            axios({method: 'get',url: url}).then(resp=> {
                //var resp = { data:{dir:true, nodes:[{key:"123456"}, {key:"456789"}]}}
                handlerRetStr(self, resp, dataObj, node, nodeComponent)
            });
          }
      },

      renderContent(h, { node, data, store }) {
        return (
            /*
            <span>
              <span>{node.label}</span>
              <span style="color:red"> {node.data.value}</span>
              <span style="color:yellow"> {node.data.dir2?"dir":""}</span>
            </span>
            */
           h("span",[
             h("span", node.label),
             h("span", {style: {color: "red"}}, node.data.value),
             h("span", {style: {color: "green"}}, node.data.dir2?"dir":"")]
           )
        );
      }
    }
  };
</script>