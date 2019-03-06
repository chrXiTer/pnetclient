<template>
<div>
    <el-input placeholder="请输入后台url" v-bind:value="backendUrl" v-on:input="onBackendUrlInput">
      <template slot="prepend">后台url</template>
      <el-button slot="append" icon="el-icon-check" v-on:click="chgRootUrl">
        {{isDiff}}</el-button>
    </el-input>


    <el-autocomplete
      class="inline-input"
      v-model="newBackendUrl"
      :fetch-suggestions="querySearch"
      placeholder="请输入内容"
      @select="handleSelect"
    ></el-autocomplete>
</div>
</template>

<script>
export default {
  props:['backendUrl'],
  data () {
    return {
      newBackendUrl: this.backendUrl,
      isDiff: '',
      restaurants:[
        {"value": this.backendUrl}, 
        {"value": "http://localhost:18100"}
      ]
    }
  },
  computed:{
  },
  methods: {
    onBackendUrlInput(evnet){
      this.newBackendUrl = event.target.value
      this.isDiff = this.backendUrl == this.backendUrl ? "" : "请更新"
    },
    chgRootUrl(){
      this.$emit('chgBackendUrl',this.newBackendUrl)     
      this.isDiff = ""
    },


      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        cb(results); // 调用 callback 返回建议列表的数据
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
  }
}
</script>

