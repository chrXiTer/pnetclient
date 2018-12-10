<template>
  <div>
    <h2 style="clear:both">要操作的主机--当前页有效</h2>
    <el-input type="textarea" :rows="5" placeholder="要监控的主机列表" v-on:blur="onBlur" v-model="hostsStr">
    </el-input>    
    <div v-for="host in hosts" :key="host" class="text item">
      <el-col :span="3">
      <CAHostMino v-bind:host="host" v-on:onCAHostminoRefresh="onCAHostminoRefresh"></CAHostMino>
      </el-col>
    </div>
    <div id="cmdout" v-html="cmdoutContent" 
      style="clear:both; background-color:grey; color:white; font-size:small">
    </div>
  </div>
</template>

<script>



import thFunc from './ts/thFunc'
import util from '../../lib/cx_util';
import cmdStrTpl from './ts/cmdStrTpl'
import CAHostMino from './sub/CAHostMino.vue'
import CHostsToCopy from './sub/CHostsToCopy.vue'

let allHostStr =`
  10.144.0.21; 10.144.0.22; 10.144.0.23; 10.144.0.24; 10.144.0.25;
  10.144.0.26; 10.144.0.27; 10.144.0.28; 10.144.0.29; 10.144.0.30; 
  10.144.0.31; 10.144.0.32; 
  
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

  10.145.32.1; 10.145.32.2; 10.145.32.3; 10.145.32.4; 10.145.32.5;
  10.145.32.6; 10.145.32.7; 10.145.32.8; 10.145.32.9; 10.145.32.10; 
  10.145.32.11; 10.145.32.12; 10.145.32.13; 10.145.32.14; 10.145.32.15;
  10.145.32.16; 10.145.32.17; 10.145.32.18; 10.145.32.19; 10.145.32.20; 
  10.145.32.21; 10.145.32.22; 10.145.32.23; 10.145.32.24; 10.145.32.25;
  10.145.32.26; 10.145.32.27; 10.145.32.28; 10.145.32.29; 10.145.32.30;
  10.145.32.31; 10.145.32.32; 
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
      return util.getIpsFromStr(this.hostsStr)
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
      thFunc.handlerRetStr(this, {data:data.host + "\n" + data.data + "\n"})
      //this.cmdoutContent = this.cmdoutContent + data.host + "\n" + data.data + "\n"
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
