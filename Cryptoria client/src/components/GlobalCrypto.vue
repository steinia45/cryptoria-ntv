<template>
  <div class="bg-class">
    <v-container fluid>
      <!-- Takkar sem stjórna hvað er sýnt -->
      <v-row align="center" justify="center">
        <v-btn-toggle
          class="take-me-down-a-little"
          v-model="toggleSelection"
          mandatory
          dark
        >
          <v-btn v-on:click="setViewMode(0)">
            <v-icon>mdi-chart-bar</v-icon>
            Statistics
          </v-btn>
          <v-btn v-on:click="setViewMode(1)">
            <v-icon>mdi-state-machine</v-icon>
            Transactions
          </v-btn>
        </v-btn-toggle>
      </v-row>
      <!-- Statistics hlutinn -->
      <v-row
        v-if="this.viewMode == 0 && globalMarketCapPercentage != 0"
        justify="center"
      >
        <p class="centered-text take-me-down">
          There are
          <strong>{{
            globalMarketCapPercentage.data.active_cryptocurrencies
          }}</strong>
          Cryptocurrencies in the world today being traded in
          <strong>{{ globalMarketCapPercentage.data.markets }}</strong>
          different markets.
        </p>
        <p class="centered-text">
          These are the tokens with the highest market capitalization.
        </p>
        <v-row>
          <v-col>
            <ul v-for="(item, name) in globalWithPNG" :key="name">
              <li class="all-caps no-bullets">
                <v-row class="list-row" align="center">
                  <v-col cols="5">
                    <v-chip
                      @mouseover="showName(item[0].pngName)"
                      @mouseleave="showName(null)"
                      class="my-3 py-4"
                      color="orange"
                      label
                      outlined
                    >
                      <img
                        v-if="item[0].path"
                        :src="require(`@/assets/cryptoIcons/${item[0].path}`)"
                        alt="icon"
                        height="30px"
                      />
                      <h1>{{ name }}</h1>
                    </v-chip>
                  </v-col>
                  <v-col cols="1">
                    <h3>&nbsp;{{ item[0].marketPercentage }}%</h3>
                  </v-col>
                  <v-col align="end" v-if="showToken == item[0].pngName">
                    <h3 class="pad-right">
                      {{ item[0].pngName }}
                    </h3>
                  </v-col>
                </v-row>
              </li>
            </ul>
          </v-col>
        </v-row>
      </v-row>
      <!-- Transaction hlutinn -->
      <v-row v-if="this.viewMode == 1">
        <v-container>
          <v-row justify="center">
            <h3 class="take-me-down">Your last transactions</h3>
          </v-row>
          <v-row v-for="(item, id) in historicalTransactions" :key="id">
            <v-col>
              You {{ item.typeOfTransaction }}
              <strong class="emphasize">{{ item.cryptoSymbol }}</strong>
              for
              <strong class="emphasize"
                >${{ Math.abs(item.dollarBuyAmount) }}</strong
              >
            </v-col>
            <v-col cols="4"> {{ item.date }} </v-col>
          </v-row>
        </v-container>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "GlobalCrypto",

  data: () => ({
    toggleSelection: undefined,
    viewMode: 0, // 0 er Statistics, 1 er Transactions
    showToken: null,
  }),

  methods: {
    // Finnum rétta iconið fyrir tokenið
    setViewMode(value) {
      this.viewMode = value;
    },
    showName(item) {
      this.showToken = item;
    },
  },
  computed: {
    historicalTransactions() {
      return this.$store.state.historicalTransactions;
    },
    globalMarketCapPercentage() {
      return this.$store.state.globalCrypto;
    },
    globalWithPNG() {
      return this.$store.state.globalCryptoWithIcons;
    },
    myTokens() {
      return this.$store.state.tokenNames;
    },
  },
  beforeMount() {
    this.$store.dispatch("getRequestCryptoGlobal");
  },
  mounted() {
    this.$store.dispatch("getRequestLastNTransactions", 10);
  },
};
</script>

<style>
.all-caps {
  text-transform: uppercase;
}

.no-bullets {
  list-style: none;
}

.take-me-down {
  margin-top: 5vh;
}

.take-me-down-a-little {
  margin-top: 2vh;
}

.list-row {
  height: 7vh;
  min-height: 40px;
  margin-bottom: 5px;
}

.emphasize {
  text-transform: capitalize;
}
.pad-right {
  padding-right: 1vw;
}

.bg-class {
  background: rgb(62, 81, 81, 0.6);

  border-radius: 10px;
}
</style>