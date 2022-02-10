<template>
  <div>
    <v-container>
      <v-row justify="center" class="give-me-space">
        <!-- Portfolio selection drop down element -->
        <v-select
          no-data-text="Manage your portfolios in the top right corner!"
          class="shrink"
          eager
          light
          mandatory
          return-object
          @input="changePortfolio"
          :items="$store.state.myPortfolios"
          :value="$store.state.currentPortfolio"
          item-text="portfolioName"
          label="Select a Portfolio"
          outlined
        ></v-select>
      </v-row>
      <!-- Samantekt á valinni portfolio -->
      <v-row justify="start">
        <v-col>
          <template>
            <v-card class="rounded-lg" dark tile>
              <v-list dense>
                <v-container fluid>
                  <v-row justify="center">
                    <v-subheader class="centered-text">
                      <h3>
                        Current Portfolio Value is ${{
                          $store.state.portfolioMarketValue
                        }}
                        <v-spacer></v-spacer>
                        Cash: ${{ currentPortfolio.dollarAmount }}
                      </h3>
                    </v-subheader>
                  </v-row>
                </v-container>
                <v-list-item v-for="item in sumPortfolio" :key="item.token">
                  <!-- Samantekt á núverandi portfolio -->
                  <v-container fluid>
                    <v-row>
                      <v-col cols="8">
                        <v-row>
                          <h3 class="capital-first-letter">
                            {{ item.token }}
                          </h3>
                        </v-row>
                        <v-row justify="start">
                          {{ item.totalValueInTokens }}
                        </v-row>
                        <v-row justify="start">
                          ${{ convertCryptoToMarketValueDollars(item) }}
                        </v-row>
                      </v-col>
                      <v-col cols="4" justify="center" align="center">
                        <v-btn
                          color="primary"
                          small
                          v-on:click="sellRequest(item)"
                        >
                          SELL
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-list-item>
              </v-list>
            </v-card>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Portfolio",

  data: () => ({}),

  methods: {
    async changePortfolio(pf) {
      // Notum async await til þess að aðgerirnar gerist pottþétt í réttri röð
      await this.$store.commit("SET_CURRENT_PORTFOLIO", pf);
      await this.$store.dispatch("getRequestSumPortfolio");
      // Reiknum heildarmarkaðsvirði hér og höldum utan um í state
      this.$store.dispatch("updatePortfolioMarketValue");
      // Hreinsum input fields í buy component svo að það sé erfiðara að svindla
      this.$store.commit("SET_BUY_AMOUNT_DOLLARS", 0);
      this.$store.commit("SET_BUY_AMOUNT_CRYPTO", 0);
    },
    sellRequest(selectedToken) {
      // Resettum input fields í buy form svo að ekki sé hægt að svindla
      this.$store.commit("SET_SELL_AMOUNT_DOLLARS", 0);
      this.$store.commit("SET_SELL_AMOUNT_CRYPTO", 0);
      const ExchangeRate = this.theMarket[selectedToken.token].usd;
      const payload = { ...selectedToken, ExchangeRate };
      this.$store.commit("SET_SELL_CRYPTO", payload);
      const modes = {
        buyMode: false,
        sellMode: true,
        newPfMode: false,
      };
      this.$store.commit("SET_APP_MODE", modes);
    },
    // Reikna current market value á hverri fjárfestingu í portfolionu
    convertCryptoToMarketValueDollars(crypto) {
      const marketValueOfCrypto =
        this.theMarket[crypto.token].usd * crypto.totalValueInTokens;
      const prettyMarketValueOfCrypto = marketValueOfCrypto.toFixed(2);
      return prettyMarketValueOfCrypto;
    },
    update() {
      console.log(this.$store.state);
      //console.log(this.currentPortfolioMarketValue);
      //this.calcTotalValueInDollars();
      //this.$store.dispatch("updatePortfolioMarketValue");
    },
  },

  computed: {
    allPortfolios() {
      return this.$store.state.myPortfolios;
    },
    sumPortfolio() {
      return this.$store.state.prettyPortfolio;
    },
    currentPortfolio() {
      //return this.$store.state.currentPortfolio;
      return this.$store.getters.getCurrentPortfolio;
    },
    theMarket() {
      return this.$store.state.theMarket;
    },
  },
  async mounted() {
    //Náum í allar portfolios frá database um leið og componentinn er mounted
    await this.$store.dispatch("getRequestAllPortfolios");
  },
};
</script>

<style>
.capital-first-letter {
  text-transform: capitalize;
}

.give-me-space {
  padding-top: 2vh;
}

.round-borders {
  border-top-right-radius: 10vw;
}

.centered-text {
  text-align: center;
}
</style>