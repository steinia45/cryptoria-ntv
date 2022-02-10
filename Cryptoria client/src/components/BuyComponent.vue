<template>
  <div class="bg-class-buy">
    <v-container>
      <v-row>
        <h1>{{ currentPortfolio.portfolioName }}</h1>
        <v-spacer></v-spacer>
        <v-btn v-on:click="exitBuyMode()" small color="error">x</v-btn>
      </v-row>
      <v-row v-if="currentPortfolio == 0">
        <h1>Select a portfolio to continue</h1>
      </v-row>
      <v-row v-else>
        <v-col justify="start">
          <v-row>
            <h3>
              Portfolio Market Value: ${{ $store.state.portfolioMarketValue }}
            </h3>
          </v-row>
          <v-row>
            <v-icon
              :color="calculateROI($store.state.portfolioMarketValue).color"
            >
              {{ calculateROI($store.state.portfolioMarketValue).icon }}
            </v-icon>
            <h3 color="green">
              [{{
                calculateROI($store.state.portfolioMarketValue)
                  .PercentageChange
              }}%
            </h3>
            <h3>]</h3>
          </v-row>
          <v-row>
            <h3>Cash: ${{ currentPortfolio.dollarAmount }}</h3>
          </v-row>
        </v-col>
      </v-row>
      <v-row justify="start">
        <h1>Buying</h1>
      </v-row>
      <v-row class="capital-first-letter" justify="start">
        <h1>{{ cryptoBeingBought.name }} @ ${{ cryptoBeingBought.usd }}</h1>
      </v-row>
      <v-text-field v-model="dollarAmount" label="$" hint="USD"></v-text-field>
      <v-text-field v-model="cryptoAmount" label="Token"></v-text-field>
      <v-row justify="center">
        <v-btn
          dark
          large
          :disabled="buyInputValidation()"
          ripple
          v-on:click="buyTransaction()"
          color="success"
          >Buy</v-btn
        >
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "BuyComponent",

  data: () => ({}),

  methods: {
    buyInputValidation() {
      // False condition fyrst, þar sem við viljum ekki sjá buy takka
      if (
        this.dollarAmount < 0.01 ||
        this.dollarAmount > this.currentPortfolio.dollarAmount ||
        typeof this.dollarAmount === "string" ||
        this.dollarAmount instanceof String ||
        this.currentPortfolio == 0
      ) {
        return true;
      } else {
        return false;
      }
    },
    async buyTransaction() {
      // Þetta verður að vera async svo að allir componentar reflecti rétta stöðu á databaseinu
      // Uppfærum lausafjárstöðu og value á núverandi portfolio
      await this.$store.dispatch("putRequestUpdatePortfolioBuy");
      // Sendum engin gögn héðan yfir í requestuna, heldur látum hana sjálfa sækja úr state
      // og búa til færslu í grunninum úr upplýsingunum sem eru þar
      await this.$store.dispatch("postRequestBuyTransaction");
      // Uppfærum allar portfolios
      await this.$store.dispatch("getRequestAllPortfolios");
      // Uppfæri núverandi möppu
      await this.$store.dispatch("getRequestSetCurrentPortfolio");
      // Sækjum reiknuð gildi fyrir núverandi portfolio, unique summur per token
      await this.$store.dispatch("getRequestSumPortfolio");
      this.$store.dispatch("updatePortfolioMarketValue");
      this.$store.commit("SET_BUY_AMOUNT_CRYPTO", 0);
      this.$store.commit("SET_BUY_AMOUNT_DOLLARS", 0);
      this.exitBuyMode();
    },
    exitBuyMode() {
      // Uppfærir appMode með nýju objecti sem ákveður hvaða components eru visible
      const mode = {
        buyMode: false,
        sellMode: false,
        newPfMode: false,
      };
      this.$store.commit("SET_APP_MODE", mode);
    },
    // Reiknum ROI fyrir portfolio m.v. núverandi markaðsverð
    calculateROI(pfDollarValue) {
      const pChange = (100 * (pfDollarValue - 1000)) / pfDollarValue;
      const dChange = pfDollarValue - 1000;

      if (pChange > 0) {
        return {
          PercentageChange: pChange.toFixed(2),
          DollarChange: dChange.toFixed(2),
          color: "green darken-2",
          icon: "mdi-trending-up",
        };
      } else if (pChange < 0) {
        return {
          PercentageChange: pChange.toFixed(2),
          DollarChange: dChange.toFixed(2),
          color: "red darken-2",
          icon: "mdi-trending-down",
        };
      } else {
        return {
          PercentageChange: 0,
          DollarChange: 0,
          color: "yellow darken-2",
          icon: "mdi-sleep",
        };
      }
    },
  },
  computed: {
    cryptoBeingBought() {
      return this.$store.state.cryptoToBuy;
    },
    // Til að vita á hvaða portfolio þessi kaup skuli vera skráð
    currentPortfolio() {
      return this.$store.state.currentPortfolio;
    },
    // notum two way computed prop fyrir v-model á state, upphæð í dollurum
    // Executum tvær mutations í hvert skipti sem slegið er inn tölur fyrir dollara eða
    // crypto, það er því hægt að kaupa fyrir ákveðna dollara
    // upphæð sem og ákveðna crypto upphæð
    dollarAmount: {
      get() {
        return this.$store.state.buyAmountDollars;
      },
      set(value) {
        this.buyInputValidation();
        const floatValue = parseFloat(value);
        this.$store.commit("SET_BUY_AMOUNT_DOLLARS", floatValue);
        this.$store.commit(
          "SET_BUY_AMOUNT_CRYPTO",
          floatValue / this.cryptoBeingBought.usd
        );
      },
    },

    cryptoAmount: {
      get() {
        return this.$store.state.buyAmountCrypto;
      },
      set(value) {
        const floatValue = parseFloat(value);
        this.$store.commit("SET_BUY_AMOUNT_CRYPTO", floatValue);
        this.$store.commit(
          "SET_BUY_AMOUNT_DOLLARS",
          floatValue * this.cryptoBeingBought.usd
        );
      },
    },
  },
};
</script>

<style>
.capital-first-letter {
  text-transform: capitalize;
}

.bg-class-buy {
  background: rgb(62, 81, 81, 0.6);
  border-radius: 10px;
  padding: 1vw;
}
</style>