<template>
  <div>
    <h2 style="clear:both">要操作的主机--当前页有效</h2>
    <el-input type="textarea" :rows="5" placeholder="要监控的主机列表" v-on:blur="onBlur" v-model="hostsStr">
    </el-input>    
    <div v-for="host in hosts" :key="host" class="text item">
      <el-col :span="4">
      <CAHostMino v-bind:host="host" v-on:onCAHostminoRefresh="onCAHostminoRefresh"></CAHostMino>
      </el-col>
    </div>
    <pre id="cmdout" v-html="cmdoutContent" style="background-color: grey; color: white"></pre>
  </div>
</template>

<script>



import thFunc from './ts/thFunc'
import cmdStrTpl from './ts/cmdStrTpl'
import CAHostMino from './sub/CAHostMino.vue'
import CHostsToCopy from './sub/CHostsToCopy.vue'

let allHostStr =`
  10.144.0.21; 10.144.0.22; 10.144.0.23; 10.144.0.24; 10.144.0.25;
  10.144.0.26; 10.144.0.27; 10.144.0.28; 10.144.0.29; 10.144.0.30; 
  10.144.0.31; 
  
  10.145.0.1; 10.145.0.2; 10.145.0.3; 10.145.0.4; 10.145.0.5;
  10.145.0.6; 10.145.0.7; 10.145.0.8; 10.145.0.9; 10.145.0.10; 
  10.145.0.11; 10.145.0.12; 10.145.0.13; 10.145.0.14; 10.145.0.15;
  10.145.0.16; 10.145.0.17; 10.145.0.18; 10.145.0.19; 10.145.0.20; 
  10.145.0.21; 10.145.0.22; 10.145.0.23; 10.145.0.24; 10.145.0.25;
  10.145.0.26; 10.145.0.27; 10.145.0.28; 10.145.0.29; 10.145.0.30; 
  10.145.0.31; 10.145.0.32; 

  10.145.16.1; 10.145.16.2; 10.145.16.3; 10.145.16.4; 10.145.16.5;
  10.145.16.6; 10.145.16.7; 10.145.16.8; 10.145.16.9; 10.145.16.10; 
  10.145.16.11; 10.145.16.12; 10.145.16.13; 10.145.16.14; 10.145.16.15;
  10.145.16.16; 10.145.16.17; 10.145.16.18; 10.145.16.19; 10.145.16.20; 
  10.145.16.21; 10.145.16.22; 10.145.16.23; 10.145.16.24; 10.145.16.25;
  10.145.16.26; 10.145.16.27; 10.145.16.28; 10.145.16.29; 10.145.16.30; 
  10.145.16.31; 10.145.16.32; 

  10.145.64.1; 10.145.64.2; 10.145.64.3; 10.145.64.4; 10.145.64.5;
  10.145.64.6; 10.145.64.7; 10.145.64.8; 10.145.64.9; 10.145.64.10; 
  10.145.64.11; 10.145.64.12; 10.145.64.13; 10.145.64.14; 10.145.64.15;
  10.145.64.16; 10.145.64.17; 10.145.64.18; 10.145.64.19; 10.145.64.20; 
  10.145.64.21; 10.145.64.22; 10.145.64.23; 10.145.64.24; 10.145.64.25;
  10.145.64.26; 10.145.64.27; 10.145.64.28; 10.145.64.29; 10.145.64.30;
  10.145.64.31; 10.145.64.32; 
`

export default {
  data(){
    return {
      hostsStr: allHostStr,
      cmd:"",
      subDir:"th/test/",
      cmdoutContent: "",
      thFunc:thFunc
    }
  },
  computed: {
    hosts: function () {
      let ip = /(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}/g;
      let hosts = this.hostsStr.match(ip) || []
      return hosts
    }
  },
  components:{
    CHostsToCopy,
    CAHostMino
  },
  methods: {
    onBlur(){
      this.hostsStr = this.hostsStr.replace(/\n/g, ";").replace(/\s/g, '').replace(/;;+/g, ";\n")
    },
    onCAHostminoRefresh(data){
      this.cmdoutContent = this.cmdoutContent + data.host + "\n" + data.data + "\n"
    }
  }
}
</script>

<style>
h3 {
  text-align: left;
}
pre {
  float: left;
}
</style>
