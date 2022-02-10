import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
//import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // Hægt að breyta hér ef að vefþjónustan keyrir annarsstaðar
    DbApiBaseUrl: "https://localhost:44373/api/",

    // Portfolio variables
    myPortfolios: null,
    prettyPortfolio: null,
    currentPortfolio: 0,
    portfolioMarketValue: null,
    portfolioToDelete: null,
    newPortfolioName: null,

    // Variables frá öðrum vefþjónustum en okkar
    theMarket: null,
    theMarketWithIcons: null,
    globalCrypto: 0,
    globalCryptoWithIcons: null,
    historicalTransactions: null,

    // Variables tengdir kaupa component
    cryptoToBuy: {},
    buyAmountDollars: null,
    buyAmountCrypto: null,

    // Variables tengdir sölu component
    cryptoToSell: {},
    sellAmountDollars: null,
    sellAmountCrypto: null,

    // App modes til að toggla hvaða componentar eru visible
    appMode: {
      buyMode: false,
      sellMode: false,
      newPfMode: false,
    },

    // Source á öll .png files í projectinu (fann ekki reliable API fyrir png icon)
    tokenNames: [
      {
        namePNG: "bitcoin",
        nameShort: "btc",
        path: "bitcoin.png",
      },
      {
        namePNG: "ethereum",
        nameShort: "eth",
        path: "ethereum.png",
      },
      {
        namePNG: "algorand",
        nameShort: "algo",
        path: "algorand.png",
      },
      {
        namePNG: "tether",
        nameShort: "usdt",
        path: "tether.png",
      },
      {
        namePNG: "bnb",
        nameShort: "bnb",
        path: "bnb.png",
      },
      {
        namePNG: "cardano",
        nameShort: "ada",
        path: "cardano.png",
      },
      {
        namePNG: "polkadot",
        nameShort: "dot",
        path: "polkadot.png",
      },
      {
        namePNG: "solana",
        nameShort: "sol",
        path: "solana.png",
      },
      {
        namePNG: "luna",
        nameShort: "luna",
        path: "luna.png",
      },
      {
        namePNG: "xrp",
        nameShort: "xrp",
        path: "xrp.png",
      },
      {
        namePNG: "usdc",
        nameShort: "usdc",
        path: "usdc.png",
      },
    ],
  },
  getters: {
    getAllPortfolios: (state) => state.myPortfolios,
    getCurrentPortfolio: (state) => state.currentPortfolio,
    getAppMode: (state) => state.appMode,
  },
  mutations: {
    // APP MODE MUTATIONS
    SET_APP_MODE(state, mode) {
      state.appMode = mode;
    },

    // PORTFOLIO MUTATIONS
    SET_PORTFOLIO_DELETE(state, portfolio) {
      state.portfolioToDelete = portfolio;
    },
    SET_PORTFOLIOS(state, allPortfolios) {
      state.myPortfolios = allPortfolios;
    },
    SET_CURRENT_PORTFOLIO(state, selectedPortfolio) {
      state.currentPortfolio = selectedPortfolio;
    },
    SET_PORTFOLIO_MARKET_VALUE(state, value) {
      state.portfolioMarketValue = value;
    },
    SET_NEW_PF_NAME(state, value) {
      state.newPortfolioName = value;
    },
    // CRYPTO MARKET DATA MUTATIONS
    SET_CRYPTODATA(state, data) {
      state.theMarket = data;
    },
    SET_GLOBAL_OBJECT_WITH_ICONS(state, data) {
      state.globalCryptoWithIcons = data;
    },
    SET_CRYPTO_MARKET_CAP(state, data) {
      state.globalCrypto = data;
    },
    // BUY TRANSACTION MUTATIONS
    SET_BUY_CRYPTO(state, crypto) {
      state.cryptoToBuy = crypto;
    },
    SET_SUM_PORTFOLIO(state, pf) {
      state.prettyPortfolio = pf;
    },
    SET_BUY_AMOUNT_DOLLARS(state, value) {
      state.buyAmountDollars = value;
    },
    SET_BUY_AMOUNT_CRYPTO(state, value) {
      state.buyAmountCrypto = value;
    },
    // SELL TRANSACTIONS MUTATIONS
    SET_SELL_AMOUNT_DOLLARS(state, value) {
      state.sellAmountDollars = value;
    },
    SET_SELL_AMOUNT_CRYPTO(state, value) {
      state.sellAmountCrypto = value;
    },
    SET_SELL_CRYPTO(state, crypto) {
      state.cryptoToSell = crypto;
    },

    // HISTORICAL TRANSACTIONS
    SET_HIST_TRANS(state, value) {
      state.historicalTransactions = value;
    },
  },
  actions: {
    // Sækir crypto gögnin frá ókeypis CoinGecko API. 50 köll á mínútu max.
    getRequestCryptoData({ commit }) {
      return new Promise((resolve, reject) => {
        axios
          .get(
            "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Cdogecoin%2Csolana%2Ccumrocket%2Cpolkadot%2Ccosmos%2Calgorand&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true"
          )
          .then((response) => {
            commit("SET_CRYPTODATA", response.data);
            resolve(response);
          })
          .catch(function (error) {
            reject(error);
          });
      });
    },
    // Sækir global market cap fyrir valda tokens frá CoinGecko
    getRequestCryptoGlobal({ commit }) {
      return new Promise((resolve, reject) => {
        axios
          .get("https://api.coingecko.com/api/v3/global")
          .then((response) => {
            commit("SET_CRYPTO_MARKET_CAP", response.data);
            resolve(response);
          })
          .catch(function (error) {
            reject(error);
          });
      });
    },

    getRequestAllPortfolios({ commit }) {
      var axios = require("axios");
      var config = {
        method: "get",
        url: this.state.DbApiBaseUrl + "portfolios" + "/",
        headers: {},
      };
      return new Promise((resolve, reject) => {
        axios(config)
          .then((response) => {
            commit("SET_PORTFOLIOS", response.data);

            resolve(response);
          })
          .catch(function (error) {
            console.log(error);
            reject(error);
          });
      });
    },
    // Sækir summu eins tokena per portfolio frá database
    getRequestSumPortfolio({ commit }) {
      var axios = require("axios");
      var config = {
        method: "get",
        url:
          this.state.DbApiBaseUrl +
          "transactions/" +
          "pretty/" +
          this.state.currentPortfolio.id,
        headers: {},
      };
      return new Promise((resolve, reject) => {
        axios(config)
          .then((response) => {
            commit("SET_SUM_PORTFOLIO", response.data);
            resolve(response);
          })
          .catch(function (error) {
            console.log(error);
            reject(error);
          });
      });
    },

    // Til að ná í current útgáfu af núverandi portfolio frá DB
    // eftir post og put breytingar á portfolioinu
    getRequestSetCurrentPortfolio({ commit }) {
      var axios = require("axios");

      var config = {
        method: "get",
        url:
          this.state.DbApiBaseUrl +
          "portfolios/" +
          this.state.currentPortfolio.id,
        headers: {},
      };
      return new Promise((resolve, reject) => {
        axios(config)
          .then(function (response) {
            commit("SET_CURRENT_PORTFOLIO", response.data);
            resolve(response);
          })
          .catch(function (error) {
            console.log(error);
            reject(error);
          });
      });
    },
    // Til að ná í síðustu n færslur
    getRequestLastNTransactions({ commit }, value) {
      var axios = require("axios");

      var config = {
        method: "get",
        url: this.state.DbApiBaseUrl + "transactions/historical/" + value,
        headers: {},
      };
      return new Promise((resolve, reject) => {
        axios(config)
          .then(function (response) {
            resolve(response);
            commit("SET_HIST_TRANS", response.data);
          })
          .catch(function (error) {
            console.log(error);
            reject(error);
          });
      });
    },

    postRequestBuyTransaction() {
      var axios = require("axios");
      var data = JSON.stringify({
        TypeOfTransaction: "Bought",
        CryptoSymbol: this.state.cryptoToBuy.name,
        CryptoValue: this.state.buyAmountCrypto,
        DollarBuyAmount: this.state.buyAmountDollars,
        PortfolioId: this.state.currentPortfolio.id,
        ExchangeRate: this.state.cryptoToBuy.usd,
        Date: new Date(Date.now()).toLocaleString("en-GB", { timeZone: "UTC" }),
      });

      var config = {
        method: "post",
        url: this.state.DbApiBaseUrl + "transactions",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      return new Promise((resolve, reject) => {
        axios(config)
          .then((response) => {
            resolve(response);
            // Uppfæra portfolios í state ef að kaupin ganga í gegn
          })
          .catch(function (error) {
            console.log(error);
            reject(error);
          });
      });
    },
    postRequestSellTransaction() {
      var axios = require("axios");
      var data = JSON.stringify({
        TypeOfTransaction: "Sold",
        CryptoSymbol: this.state.cryptoToSell.token,
        // Setjum neikvæðar tölur hér svo að databaseið summi þetta rétt
        CryptoValue: -this.state.sellAmountCrypto,
        DollarBuyAmount: -this.state.sellAmountDollars,
        PortfolioId: this.state.currentPortfolio.id,
        ExchangeRate: this.state.cryptoToSell.ExchangeRate,
        Date: new Date(Date.now()).toLocaleString("en-GB", { timeZone: "UTC" }),
      });

      var config = {
        method: "post",
        url: this.state.DbApiBaseUrl + "transactions",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      return new Promise((resolve, reject) => {
        axios(config)
          .then((response) => {
            resolve(response);
            // Uppfæra portfolios í state ef að kaupin ganga í gegn
          })
          .catch(function (error) {
            console.log(error);
            reject(error);
          });
      });
    },

    // Breyting á portfolio eftir kaup
    putRequestUpdatePortfolioBuy() {
      var axios = require("axios");
      var data = JSON.stringify({
        Id: this.state.currentPortfolio.id,
        PortfolioName: this.state.currentPortfolio.portfolioName,
        PortfolioValue: 123,
        DollarAmount:
          this.state.currentPortfolio.dollarAmount -
          this.state.buyAmountDollars,
      });
      var config = {
        method: "put",
        url:
          this.state.DbApiBaseUrl +
          "portfolios/" +
          this.state.currentPortfolio.id,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      return new Promise((resolve, reject) => {
        axios(config)
          .then(function (response) {
            resolve(response);
          })
          .catch(function (error) {
            console.log(error);
            reject(error);
          });
      });
    },
    // Breyting á portfolio eftir sölu
    putRequestUpdatePortfolioSell() {
      var axios = require("axios");
      var data = JSON.stringify({
        Id: this.state.currentPortfolio.id,
        PortfolioName: this.state.currentPortfolio.portfolioName,
        PortfolioValue: 123,
        DollarAmount:
          this.state.currentPortfolio.dollarAmount +
          parseFloat(this.state.sellAmountDollars),
      });
      var config = {
        method: "put",
        url:
          this.state.DbApiBaseUrl +
          "portfolios/" +
          this.state.currentPortfolio.id,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      return new Promise((resolve, reject) => {
        axios(config)
          .then(function (response) {
            resolve(response);
          })
          .catch(function (error) {
            console.log(error);
            reject(error);
          });
      });
    },
    // Reiknum heildar markaðsvirði valinnar portfolio og uppfærum í state
    updatePortfolioMarketValue({ commit }) {
      const theMarket = this.state.theMarket;
      const thePortfolio = this.state.currentPortfolio;
      const sumPortfolio = this.state.prettyPortfolio;
      let totalSum = 0;
      for (let i = 0; i < sumPortfolio.length; i++) {
        totalSum +=
          sumPortfolio[i].totalValueInTokens *
          theMarket[sumPortfolio[i].token].usd;
      }
      // Bætum lausafé inn í virði portfolio
      totalSum += thePortfolio.dollarAmount;

      commit("SET_PORTFOLIO_MARKET_VALUE", totalSum.toFixed(0));
    },
    createPortfolio() {
      var axios = require("axios");
      var data = JSON.stringify({
        PortfolioName: this.state.newPortfolioName,
        DollarAmount: 1000,
      });

      var config = {
        method: "post",
        url: this.state.DbApiBaseUrl + "portfolios",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      return new Promise((resolve, reject) => {
        axios(config)
          .then(function (response) {
            resolve(response);
          })
          .catch(function (error) {
            reject(error);
          });
      });
    },
    // Delete portfolio request
    deletePortfolioById() {
      var axios = require("axios");

      var config = {
        method: "delete",
        url:
          this.state.DbApiBaseUrl +
          "portfolios/" +
          this.state.portfolioToDelete.id,
        headers: {
          "Content-Type": "application/json",
        },
      };
      return new Promise((resolve, reject) => {
        axios(config)
          .then(function (response) {
            resolve(response);
          })
          .catch(function (error) {
            console.log(error);
            reject(error);
          });
      });
    },
    //Kallar á mutation sem býr til object þar sem slóðir á png icon eru skráðar
    createObjectForPNG({ commit }) {
      let returnObject = {};
      const cryptoStats = this.state.globalCrypto.data.market_cap_percentage;
      //var lengthCrypto = Object.keys(cryptoStats).length;
      const imagePaths = this.state.tokenNames;

      for (let i = 0; i < imagePaths.length; i++) {
        // for (let j = 0; j < lengthCrypto; j++) {
        if (
          cryptoStats[imagePaths[i].nameShort] ||
          cryptoStats[imagePaths[i].namePNG]
        ) {
          returnObject[imagePaths[i].nameShort] = [
            {
              pngName: imagePaths[i].namePNG,
              path: imagePaths[i].path,
              marketPercentage: cryptoStats[imagePaths[i].nameShort].toFixed(2),
            },
          ];
        } else {
          console.log("error");
        }
      }
      commit("SET_GLOBAL_OBJECT_WITH_ICONS", returnObject);
      // }
    },
  },
});
