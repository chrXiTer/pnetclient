<template>
<el-tree
  :data="data2"
  :props="defaultProps"
  node-key="id"
  :render-content="renderContent"
  @node-expand="onNodeExpand"	>
</el-tree>
</template>

<script>
  import axios from 'axios'
  var rootUrl = "http://10.0.144.26:2379/v2/keys"

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
      /*
      var newLines = newText.split('\n')
      var newLinesEncode = newLines.map(function(e){
          return util.htmlEncode(e)
      })
      var newAddStr = newLinesEncode.join("<br/>")
      s_this.cmdoutContent = s_this.cmdoutContent + newAddStr
      */
  }

  export default {
    data() {
      return {
        data2: dataTree,
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },

    methods: {
      onNodeExpand(dataObj, node, nodeComponent){
          if(dataObj.dir){
            const url = rootUrl + dataObj.key
            let self = this
            axios({method: 'get',url: url}).then(resp=> {
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
           h("span",
             h("span", node.label),
             h("span", node.data.value),
             h("span", node.data.dir2?"dir":"")
           )
        );
      }
    }
  };
</script>