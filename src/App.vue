<template>
  <div id="app">
    <el-container style="border: 1px solid #eee">
      <el-header style="text-align: right; font-size: 12px">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link home_userinfo" style="display: flex;align-items: center">
              {{user.name}}<i><img id=userface v-if="user.userface!=''" :src="user.userface"/></i>
            </span>
            <el-dropdown-menu slot="dropdown" v-if="user.name!='未登录'">
              <el-dropdown-item command="profile">个人中心 </el-dropdown-item>
              <el-dropdown-item command="setting">设置</el-dropdown-item>
              <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
            </el-dropdown-menu>
            <el-dropdown-menu slot="dropdown" v-if="user.name=='未登录'">
              <el-dropdown-item command="login">登录 </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
      </el-header>
      
      <el-container>
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
          <page-aside></page-aside>
        </el-aside>
          
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>  
    
    <div id="nav"><!--
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
      -->
    </div>
  </div>
</template>

<script>
import PageAside from '@/components/PageAside'

export default {
  name: 'App',
  components: {
    PageAside,
  },
  computed: {
    user(){
      return this.$store.state.user;
    }
  },
  methods:{
      handleCommand(cmd){
        var self = this;
        if(cmd == 'logout'){
          this.$confirm('注销登录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            self.getRequest("/logout");
            self.$store.commit('logout');
            self.$router.replace({path: '/'});
          }).catch(() => {
            self.$message({
              type: 'info',
              message: '取消'
            });
          });
        }else if(cmd == 'profile'){
          this.$router.push({path: '/profile'});
        }else if(cmd == 'setting'){
          this.$router.push({path: '/profile'});
        }else if(cmd == 'login'){
          this.$router.push({path: '/login'});
        }
      }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.userface {
  width: 40px;
  height: 40px;
  margin-right: 5px;
  margin-left: 5px;
  border-radius: 40px
}
</style>
