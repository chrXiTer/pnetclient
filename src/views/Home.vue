<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <PageMainHello msg="Welcome"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PageMainHello from '@/components/PageMainHello.vue'  // @ is an alias to /src


@Component({
  components: {
    PageMainHello,
  },
})
export default class Home extends Vue {}
</script>
