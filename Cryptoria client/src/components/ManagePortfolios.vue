<template>
  <div>
    <!-- Menu takkar til að velja aðgerðir -->
    <div>
      <v-row align="center" justify="center" class="down-a-bit">
        <v-btn-toggle v-model="toggleSelection" mandatory dark>
          <v-btn v-on:click="setViewMode(0)">
            <v-icon>mdi-plus</v-icon>
            Create
          </v-btn>
          <v-btn v-on:click="setViewMode(1)">
            <v-icon>mdi-minus</v-icon>
            Delete
          </v-btn>
          <v-btn v-on:click="setViewMode(2)">
            <v-icon>mdi-information</v-icon>
            Info
          </v-btn>
        </v-btn-toggle>
      </v-row>
    </div>

    <v-main>
      <!-- Búa til nýja portfolio card -->
      <v-container v-if="this.portfolioMode == 0">
        <v-card dark>
          <v-container fluid fill-height>
            <v-row justify="center">
              <v-col>
                <v-row justify="center" class="a-little-space">
                  <h1 class="centered-text">Create a New Portfolio</h1>
                </v-row>
                <v-row justify="center" class="a-little-space">
                  <h4 class="centered-text">
                    Every portfolio starts out with exactly $1000 in cash. It's
                    up to you to invest and grow your portfolio.
                  </h4>
                </v-row>
                <v-row justify="center">
                  <v-text-field
                    v-on:input="clearMessage()"
                    v-model="pfNewName"
                    color="yellow darken-1"
                    dark
                    class="shrink"
                    label="Portfolio Name"
                    placeholder="Choose wisely..."
                    outlined
                    clearable
                    type="string"
                  ></v-text-field>
                </v-row>
                <v-row v-if="!this.Message" justify="space-around">
                  <v-col fluid align="end">
                    <v-btn v-on:click="createPortfolio()" color="success"
                      >Save</v-btn
                    >
                  </v-col>
                  <v-col fluid justify="start">
                    <v-btn v-on:click="exitPfMode()" color="error">Exit</v-btn>
                  </v-col>
                </v-row>
                <!-- Eftir að portfolio er saved -->
                <v-row align="start" justify="center" v-if="this.Message">
                  <h4 class="centered-text">
                    {{ Message }}
                  </h4>
                </v-row>
                <v-row justify="center" v-if="this.Message">
                  <v-btn
                    class="space-below"
                    v-on:click="exitPfMode()"
                    color="success"
                    >Start investing</v-btn
                  >
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-container>
      <!-- Delete portfolio card -->
      <v-container v-if="this.portfolioMode == 1">
        <v-card dark>
          <v-container fluid fill-height>
            <v-row justify="center">
              <v-col>
                <v-row justify="center" class="a-little-space">
                  <h1>Delete a Portfolio</h1>
                </v-row>
                <v-row justify="center" class="a-little-space">
                  <h4 class="centered-text">
                    Here you can delete portfolios that you are ashamed of.
                    Beware, there is no going back once a portfolio has been
                    deleted.
                  </h4>
                </v-row>
                <v-row justify="center">
                  <v-select
                    class="shrink"
                    eager
                    return-object
                    @input="changePortfolioToDelete"
                    :items="$store.state.myPortfolios"
                    :value="$store.state.portfolioToDelete"
                    item-text="portfolioName"
                    label="Select a Portfolio to Delete"
                    outlined
                  ></v-select>
                </v-row>
                <v-row justify="center" class="space-below">
                  <v-btn
                    class="space-right"
                    v-on:click="deleteThePortfolio()"
                    color="error"
                    >Delete</v-btn
                  >

                  <v-btn
                    class="space-left"
                    v-on:click="exitPfMode()"
                    color="error"
                    >Exit</v-btn
                  >
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-container>
      <!-- Information card  -->
      <v-container v-if="this.portfolioMode == 2">
        <v-card dark>
          <v-container fluid fill-height>
            <v-row justify="center">
              <v-col>
                <v-row justify="center" class="a-little-space">
                  <h1>General Information</h1>
                </v-row>
                <v-row justify="center" class="a-little-space">
                  <h4 class="centered-text">
                    Prices might not reflect realtime marketprice of
                    cryptocurrencies. This product is intended for entertainment
                    purposes only.
                  </h4>
                </v-row>
                <v-row justify="center" class="a-little-space">
                  <h4 class="centered-text">
                    The CoinGecko API is used to fetch prices of crypto
                    currencies and cryptocurrency statistics.
                  </h4>
                </v-row>

                <v-row justify="center">
                  <v-btn
                    class="space-below"
                    v-on:click="exitPfMode()"
                    color="error"
                    >Exit</v-btn
                  >
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-container>
    </v-main>
  </div>
</template>

<script>
export default {
  name: "ManagePortfolios",

  data: () => ({
    Message: null,
    toggleSelection: undefined,
    portfolioMode: 0, // 0 = create, 1 = delete, 2 = information
  }),

  methods: {
    changePortfolioToDelete(pf) {
      // Update-um state svo við höfum aðgang að réttri portfolio í state til að deleta
      this.$store.commit("SET_PORTFOLIO_DELETE", pf);
    },

    setViewMode(value) {
      this.portfolioMode = value;
    },
    exitPfMode() {
      const exitMode = {
        buyMode: false,
        sellMode: false,
        newPfMode: false,
      };
      this.$store.commit("SET_APP_MODE", exitMode);
    },
    async createPortfolio() {
      // Smá sanitation á user input fyrir portfolio nafn
      if (
        this.$store.state.newPortfolioName == null ||
        this.$store.state.newPortfolioName == ""
      ) {
        this.Message = "Please enter a name for your portfolio.";
      } else {
        // Async aðgerðir hér svo að allt gerist í réttri röð
        await this.$store.dispatch("createPortfolio");
        await this.$store.dispatch("getRequestAllPortfolios");
        this.Message = "New Portfolio created!";
      }
    },
    // Hreinsum warning um leið og notandi skrifar aftur í inputtið
    clearMessage() {
      this.Message = null;
    },
    async deleteThePortfolio() {
      // Notum async hér svo að portfolios uppfærist ekki fyrr en eftir að búið er
      // að eyða þeirri sem var valin
      await this.$store.dispatch("deletePortfolioById");
      await this.$store.dispatch("getRequestAllPortfolios");
    },
  },
  computed: {
    pfNewName: {
      get() {
        return this.$store.newPortfolioName;
      },
      set(value) {
        this.$store.commit("SET_NEW_PF_NAME", value);
      },
    },
  },
};
</script>

<style>
.a-little-space {
  margin: 1vw;
}
.a-little-smaller {
  width: 50%;
}
.centered-text {
  text-align: center;
}
.down-a-bit {
  margin-top: 5vw;
}
.down-a-little-bit {
  margin-top: 3vw;
}

.space-below {
  margin-bottom: 3vw;
}

.space-left {
  margin-left: 1vw;
}

.space-right {
  margin-right: 1vw;
}
</style>
