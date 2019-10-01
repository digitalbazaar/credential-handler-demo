<template>
  <q-layout>

    <q-layout-header>
      <q-toolbar>
        <q-btn
          flat round dense
          @click="showDrawer = !showDrawer"
          icon="fa-bars"
        />
        <q-toolbar-title @click.native="goHome()">
          Credential Wallet
          <span slot="subtitle">Demo</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer side="left" v-model="showDrawer">
      <q-list no-border link inset-separator>
        <q-list-header>Navigation</q-list-header>
        <q-item to="/">
          <q-item-side icon="fa-home" />
          <q-item-main label="Home" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container style="overflow: auto; max-height: 100vh">
      <router-view/>
    </q-page-container>

    <q-layout-footer>
    </q-layout-footer>

  </q-layout>
</template>
<script>
export default {
  name: 'BrRoot',
  data() {
    return {
      showDrawer: false
    };
  },
  methods: {
    goHome() {
      this.$router.push({path: '/'});
    }
  }
};
</script>
<style>
</style>
