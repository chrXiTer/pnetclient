<template>
<div>
    <el-input placeholder="请输入后台url" v-bind:value="backendUrl" v-on:input="onBackendUrlInput">
      <template slot="prepend">后台url</template>
      <el-button slot="append" icon="el-icon-check" v-on:click="chgRootUrl">
        {{isDiff}}</el-button>
    </el-input>
</div>
</template>

<script>
export default {
  props:['backendUrl'],
  data () {
    return {
      newBackendUrl: this.backendUrl,
      isDiff: ''
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
    }

  }
}
</script>

