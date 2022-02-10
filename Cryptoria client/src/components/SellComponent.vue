<template>
  <div class="bg-class-sell">
    <v-container>
      <v-row>
        <h1 class="space-and-align">{{ currentPortfolio.portfolioName }}</h1>
        <v-spacer></v-spacer>
        <v-btn v-on:click="exitSellMode()" small color="error">x</v-btn>
      </v-row>
      <v-row>
        <v-col>
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
          <v-row>
            <h1>Selling</h1>
          </v-row>
          <v-row class="capital-first-letter" justify="start">
            <h1>
              {{ cryptoBeingSold.token }} @ ${{ cryptoBeingSold.ExchangeRate }}
            </h1>
          </v-row>
        </v-col>
        <!-- % Buttons til að stjórna hversu mikið af crypto fer í sölu (tokens) -->
        <v-col cols="2">
          <v-row justify="center">
            <h5 class="space-and-align">% of your Token</h5>
          </v-row>
          <v-row justify="space-between">
            <v-btn
              width="100%"
              v-on:click="setAmountCrypto(1)"
              small
              class="rounded-0"
              v-bind:class="button5"
              >100%</v-btn
            >
            <v-btn
              width="100%"
              v-on:click="setAmountCrypto(0.75)"
              small
              class="rounded-0"
              v-bind:class="button4"
              >75%</v-btn
            >

            <v-btn
              width="100%"
              v-on:click="setAmountCrypto(0.5)"
              small
              class="rounded-0"
              v-bind:class="button3"
              >50%</v-btn
            >
            <v-btn
              width="100%"
              v-on:click="setAmountCrypto(0.25)"
              small
              class="rounded-0"
              v-bind:class="button2"
              >25%</v-btn
            >
            <v-btn
              width="100%"
              v-on:click="setAmountCrypto(0)"
              small
              class="rounded-0"
              v-bind:class="button1"
              >0%</v-btn
            >
          </v-row>
        </v-col>
      </v-row>
      <!-- user inputs fyrir dollara og crypto upphæðir -->
      <v-row>
        <v-text-field
          witdh="50%"
          v-model="cryptoAmountSell"
          label="Token"
        ></v-text-field>
        <v-text-field
          v-model="dollarAmountSell"
          label="$"
          hint="USD"
        ></v-text-field>
      </v-row>
      <v-row justify="center">
        <v-btn
          color="success"
          :disabled="sellInputValidation()"
          dark
          large
          v-on:click="sellTransaction()"
          >Sell</v-btn
        >
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "SellComponent",
  data: () => ({
    button1: {
      "light-green darken-1": true,
      "light-green lighten-5": false,
    },
    button2: {
      "light-green darken-1": false,
      "light-green lighten-4": true,
      "light-green lighten-5": false,
    },
    button3: {
      "light-green darken-1": false,
      "light-green lighten-4": false,
      "light-green lighten-5": true,
    },
    button4: {
      "light-green darken-1": false,
      "light-green lighten-4": false,
      "light-green lighten-5": false,
    },
    button5: {
      "light-green darken-1": false,
      "light-green lighten-4": false,
      "light-green lighten-5": false,
    },
  }),

  methods: {
    // Function sem stýrir því hvort að "Sell" takkinn sjáist eða ekki
    sellInputValidation() {
      // False condition fyrst, þar sem við viljum ekki sjá buy takka
      if (
        // Amount verður að vera jákvæð tala
        // token/dollar amount í völdum token má ekki fara yfir það sem notandi á
        // í núverandi portfolio á þessum tímapunkti
        this.dollarAmountSell < 0.01 ||
        this.cryptoAmountSell < 0.000000000001 ||
        this.cryptoAmountSell >
          this.$store.state.cryptoToSell.totalValueInTokens
      ) {
        return true;
      } else {
        return false;
      }
    },
    async sellTransaction() {
      // Þetta verður að vera async svo að allir componentar reflecti rétta stöðu á databaseinu
      // Uppfærum lausafjárstöðu og value á núverandi portfolio
      await this.$store.dispatch("putRequestUpdatePortfolioSell");
      // Sendum engin gögn héðan yfir í requestuna, heldur látum hana sjálfa sækja úr state
      // og búa til færslu í grunninum úr upplýsingunum sem eru þar
      await this.$store.dispatch("postRequestSellTransaction");
      // Uppfærum allar portfolios
      await this.$store.dispatch("getRequestAllPortfolios");
      // Uppfæri núverandi möppu
      await this.$store.dispatch("getRequestSetCurrentPortfolio");
      // Sækjum reiknuð gildi fyrir núverandi portfolio, unique summur per token
      await this.$store.dispatch("getRequestSumPortfolio");
      this.$store.dispatch("updatePortfolioMarketValue");
      this.$store.commit("SET_SELL_AMOUNT_CRYPTO", 0);
      this.$store.commit("SET_SELL_AMOUNT_DOLLARS", 0);
      this.exitSellMode();
    },
    exitSellMode() {
      // Uppfærir appMode með nýju objecti sem ákveður hvaða components eru visible
      const mode = {
        buyMode: false,
        sellMode: false,
        newPfMode: false,
      };
      this.$store.commit("SET_APP_MODE", mode);
      this.$store.commit("SET_SELL_CRYPTO", null);
    },
    setAmountCrypto(perc) {
      // Logic til að halda utan um litina á % tökkum
      if (perc == 0) {
        // 0%
        this.button1["light-green darken-1"] = true;
        this.button1["light-green lighten-5"] = false;
        // 25%
        this.button2["light-green darken-1"] = false;
        this.button2["light-green lighten-4"] = true;
        this.button2["light-green lighten-5"] = false;
        // 50%
        this.button3["light-green darken-1"] = false;
        this.button3["light-green lighten-4"] = false;
        this.button3["light-green lighten-5"] = true;
        // 75%
        this.button4["light-green darken-1"] = false;
        this.button4["light-green lighten-4"] = false;
        this.button4["light-green lighten-5"] = false;
        // 100%
        this.button5["light-green darken-1"] = false;
        this.button5["light-green lighten-4"] = false;
        this.button5["light-green lighten-5"] = false;
      } else if (perc == 0.25) {
        // 0%
        this.button1["light-green darken-1"] = true;
        this.button1["light-green lighten-5"] = false;
        // 25%
        this.button2["light-green darken-1"] = true;
        this.button2["light-green lighten-4"] = false;
        this.button2["light-green lighten-5"] = false;
        // 50%
        this.button3["light-green darken-1"] = false;
        this.button3["light-green lighten-4"] = true;
        this.button3["light-green lighten-5"] = false;
        // 75%
        this.button4["light-green darken-1"] = false;
        this.button4["light-green lighten-4"] = false;
        this.button4["light-green lighten-5"] = true;
        // 100%
        this.button5["light-green darken-1"] = false;
        this.button5["light-green lighten-4"] = false;
        this.button5["light-green lighten-5"] = false;
      } else if (perc == 0.5) {
        // 0%
        this.button1["light-green darken-1"] = true;
        this.button1["light-green lighten-5"] = false;
        // 25%
        this.button2["light-green darken-1"] = true;
        this.button2["light-green lighten-4"] = false;
        this.button2["light-green lighten-5"] = false;
        // 50%
        this.button3["light-green darken-1"] = true;
        this.button3["light-green lighten-4"] = false;
        this.button3["light-green lighten-5"] = false;
        // 75%
        this.button4["light-green darken-1"] = false;
        this.button4["light-green lighten-4"] = true;
        this.button4["light-green lighten-5"] = false;
        // 100%
        this.button5["light-green darken-1"] = false;
        this.button5["light-green lighten-4"] = false;
        this.button5["light-green lighten-5"] = true;
      } else if (perc == 0.75) {
        // 0%
        this.button1["light-green darken-1"] = true;
        this.button1["light-green lighten-5"] = false;
        // 25%
        this.button2["light-green darken-1"] = true;
        this.button2["light-green lighten-4"] = false;
        this.button2["light-green lighten-5"] = false;
        // 50%
        this.button3["light-green darken-1"] = true;
        this.button3["light-green lighten-4"] = false;
        this.button3["light-green lighten-5"] = false;
        // 75%
        this.button4["light-green darken-1"] = true;
        this.button4["light-green lighten-4"] = false;
        this.button4["light-green lighten-5"] = false;
        // 100%
        this.button5["light-green darken-1"] = false;
        this.button5["light-green lighten-4"] = true;
        this.button5["light-green lighten-5"] = false;
      } else if (perc == 1) {
        // 0%
        this.button1["light-green darken-1"] = true;
        this.button1["light-green lighten-5"] = false;
        // 25%
        this.button2["light-green darken-1"] = true;
        this.button2["light-green lighten-4"] = true;
        this.button2["light-green lighten-5"] = false;
        // 50%
        this.button3["light-green darken-1"] = true;
        this.button3["light-green lighten-4"] = false;
        this.button3["light-green lighten-5"] = false;
        // 75%
        this.button4["light-green darken-1"] = true;
        this.button4["light-green lighten-4"] = false;
        this.button4["light-green lighten-5"] = false;
        // 100%
        this.button5["light-green darken-1"] = true;
        this.button5["light-green lighten-4"] = false;
        this.button5["light-green lighten-5"] = false;
      } else {
        console.log("Button selection error");
      }

      this.$store.commit(
        "SET_SELL_AMOUNT_CRYPTO",
        this.cryptoBeingSold.totalValueInTokens * perc
      );
      let amountInDollars =
        this.currentMarket[this.cryptoBeingSold.token].usd *
        this.cryptoBeingSold.totalValueInTokens *
        perc;
      this.$store.commit("SET_SELL_AMOUNT_DOLLARS", amountInDollars.toFixed(2));
    },
    calculateROI(pfDollarValue) {
      const pChange = (100 * (pfDollarValue - 1000)) / pfDollarValue;
      const dChange = pfDollarValue - 1000;

      if (pChange > 0) {
        return {
          PercentageChange: pChange.toFixed(3),
          DollarChange: dChange.toFixed(3),
          color: "green darken-2",
          icon: "mdi-trending-up",
        };
      } else if (pChange < 0) {
        return {
          PercentageChange: pChange.toFixed(3),
          DollarChange: dChange.toFixed(3),
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
    currentMarket() {
      return this.$store.state.theMarket;
    },
    currentPortfolio() {
      return this.$store.state.currentPortfolio;
    },
    cryptoBeingSold() {
      return this.$store.state.cryptoToSell;
    },
    // Þessi v-modela bæði input við state variable
    dollarAmountSell: {
      get() {
        return this.$store.state.sellAmountDollars;
      },
      set(value) {
        const floatValue = parseFloat(value);
        this.$store.commit("SET_SELL_AMOUNT_DOLLARS", floatValue);
        this.$store.commit(
          "SET_SELL_AMOUNT_CRYPTO",
          floatValue / this.cryptoBeingSold.ExchangeRate
        );
      },
    },
    cryptoAmountSell: {
      get() {
        return this.$store.state.sellAmountCrypto;
      },
      set(value) {
        const floatValue = parseFloat(value);
        this.$store.commit("SET_SELL_AMOUNT_CRYPTO", floatValue);
        this.$store.commit(
          "SET_SELL_AMOUNT_DOLLARS",
          floatValue * this.cryptoBeingSold.ExchangeRate
        );
      },
    },
  },
};
</script>

<style>
.space-and-align {
  text-align: center;
  padding-bottom: 1vh;
}

.bg-class-sell {
  background: rgb(62, 81, 81, 0.6);
  border-radius: 10px;
  padding: 1vw;
}
</style>