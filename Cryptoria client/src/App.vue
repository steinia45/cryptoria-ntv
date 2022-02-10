<template>
  <v-app>
    <v-app-bar app dark>
      <v-container fluid>
        <!-- Þetta er hér til að endurreikna viewport stærð -->
        <v-row v-resize="onResize"></v-row>
        <!-- Hér byrjar navbarinn -->
        <v-row align="center" justify="space-between">
          <div>
            <div>
              <v-img
                alt="Vuetify Logo"
                class="shrink mr-2"
                contain
                src="../public/cryptoIcon.png"
                transition="scale-transition"
                width="25"
              />
            </div>
            <h3 class="scale-font">Cryptoria</h3>
          </div>

          <MenuForNavBar />
        </v-row>
      </v-container>
    </v-app-bar>
    <!-- Notum windowSize til að ákveða hvort við séum í mobile eða desktop view -->

    <!-- Portfolio view skalar sjálfkrafa og er eins í öllum skjástærðum -->
    <v-main class="bg-for-app" v-if="currentAppMode.newPfMode">
      <ManagePortfolios />
    </v-main>

    <v-main class="bg-for-app" v-if="!currentAppMode.newPfMode">
      <!-- Skiptum á milli containera eftir skjástærð -->

      <!-- Large: x > 1280px -->
      <v-container fluid v-if="windowSize.x >= thresholds.lg">
        <v-row class="space-up-top" justify="space-around">
          <v-col cols="3">
            <Portfolio />
          </v-col>
          <v-col cols="3">
            <GlobalCrypto
              v-if="!currentAppMode.sellMode && !currentAppMode.buyMode"
            />
            <BuyComponent v-if="currentAppMode.buyMode" />
            <SellComponent v-if="currentAppMode.sellMode" />
          </v-col>
          <v-col cols="6">
            <Market />
          </v-col>
        </v-row>
      </v-container>

      <!-- Medium: x > 800px && x < 1280-->
      <v-container
        v-if="windowSize.x > thresholds.md && windowSize.x < thresholds.lg"
      >
        <v-row class="space-up-top" justify="space-around">
          <v-col cols="4">
            <Portfolio />
          </v-col>
          <v-col cols="7">
            <GlobalCrypto
              v-if="!currentAppMode.sellMode && !currentAppMode.buyMode"
            />
            <BuyComponent v-if="currentAppMode.buyMode" />
            <SellComponent v-if="currentAppMode.sellMode" />
          </v-col>
          <v-col cols="8">
            <Market />
          </v-col>
        </v-row>
      </v-container>

      <!-- Medium: x =< 800px -->
      <v-container v-if="windowSize.x <= thresholds.md">
        <v-row class="space-up-top" justify="space-around">
          <v-col cols="12">
            <Portfolio />
          </v-col>
          <v-col cols="11">
            <BuyComponent v-if="currentAppMode.buyMode" />
            <SellComponent v-if="currentAppMode.sellMode" />
          </v-col>
          <v-col cols="12">
            <Market
              v-if="!currentAppMode.sellMode && !currentAppMode.buyMode"
            />
          </v-col>
        </v-row>
        <v-row justify="center">
          <GlobalCrypto />
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Portfolio from "./components/Portfolio.vue";
import BuyComponent from "./components/BuyComponent.vue";
import Market from "./components/Market.vue";
import SellComponent from "./components/SellComponent.vue";
import MenuForNavBar from "./components/MenuForNavBar.vue";
import ManagePortfolios from "./components/ManagePortfolios.vue";
import GlobalCrypto from "./components/GlobalCrypto.vue";

export default {
  name: "App",

  components: {
    Portfolio,
    BuyComponent,
    Market,
    SellComponent,
    MenuForNavBar,
    ManagePortfolios,
    GlobalCrypto,
  },

  data: () => ({
    //
    cryptoDataAPIcall: null,
    // Constants fyrir responsive design breakpoints
    windowSize: {
      x: 0,
      y: 0,
    },
    thresholds: {
      xs: 340,
      sm: 540,
      md: 800,
      lg: 1280,
    },
  }),
  methods: {
    //Uppfærum markaðsverð með setInterval
    //Við megum kalla 50 sinnum á mínútu en setjum 10 sekúndna millibil.
    getCryptoMarketData() {
      this.cryptoDataAPIcall = setInterval(() => {
        this.$store.dispatch("getRequestCryptoData");
      }, 10000);
    },
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight };
    },
    showStore() {
      console.log(this.$store.state);
      console.log(
        new Date(Date.now()).toLocaleString("en-GB", { timeZone: "UTC" })
      );
    },
  },
  computed: {
    currentAppMode() {
      return this.$store.state.appMode;
    },
  },
  mounted() {
    this.onResize();
  },
  async created() {
    // Startar intervali sem sækir markaðsgögnin á 10 sek. fresti
    this.getCryptoMarketData();
  },
  // Náum í gögn áður en App.vue verður til verður til
  async beforeCreate() {
    await this.$store.dispatch("getRequestCryptoData");
    await this.$store.dispatch("getRequestCryptoGlobal");
    await this.$store.dispatch("createObjectForPNG");
  },
  beforeDestroy() {
    // Stoppar intervalið fyrir markaðsgögnin
    clearInterval(this.cryptoDataAPIcall);
  },
};
</script>

<style scoped>
.scale-font {
  font-size: (3vw);
}

.space-up-top {
  margin-top: 2vh;
}

.bg-for-app {
  background: #f7971e; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to top,
    #ffd200,
    #f7971e
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to top,
    #ffd200,
    #f7971e
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>
