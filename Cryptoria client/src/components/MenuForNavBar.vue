<template>
  <div>
    <v-btn
      class="black--text"
      color="orange lighten-1"
      v-on:click="setNewPfMode()"
    >
      <v-icon>mdi-cash</v-icon>
      Portfolios</v-btn
    >
  </div>
</template>

<script>
export default {
  name: "MenuForNavBar",

  methods: {
    setNewPfMode() {
      const pfMode = {
        buyMode: false,
        sellMode: false,
        newPfMode: true,
      };
      this.$store.commit("SET_APP_MODE", pfMode);
    },
  },
};
</script>

<style>
</style>