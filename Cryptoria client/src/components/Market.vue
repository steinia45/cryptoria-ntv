<template>
  <div>
    <v-container>
      <h1>The Market</h1>

      <v-simple-table dense dark>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Token</th>
              <th class="text-left">24h %</th>
              <th class="text-left">Rate</th>
              <th class="text-left">Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-on:click="updateStoreCryptoSelection(item, name)"
              v-for="(item, name) in cryptodata"
              :key="name"
              @mouseover="showBuyOption(name)"
              @mouseleave="showBuyOption(null)"
            >
              <td class="capitalize-this">
                {{ name }}
              </td>
              <td :class="upOrDown(item.usd_24h_change)">
                {{ item.usd_24h_change.toFixed(2) }}%
              </td>
              <td>$ {{ item.usd.toFixed(2) }}</td>
              <td>
                {{ unix2date(item.last_updated_at) }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <h2 v-if="buyOption">
        Click to buy
        <strong class="capitalize-this">
          {{ buyOption }}
        </strong>
      </h2>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Market",

  data: () => ({
    buyOption: null,
  }),

  methods: {
    upOrDown(value) {
      if (value < 0) {
        return "crypto-red";
      } else if (value == 0) {
        return "crypto-neutral";
      } else {
        return "crypto-green";
      }
    },
    // Þessi function stýrir message sem er sýnt fyrir ofan töfluna við hover á tokens
    showBuyOption(value) {
      this.buyOption = value;
    },
    // Uppfærir núverandi valið token úr crypto töflu yfir í state-ið
    updateStoreCryptoSelection(item, name) {
      // Bætum nafninu á cryptoinu við objectið svo getum sent allt í einu yfir í store
      const payload = { ...item, name };

      this.$store.commit("SET_BUY_CRYPTO", payload);
      // Resettum input fields í buy form svo að ekki sé hægt að svindla
      this.$store.commit("SET_BUY_AMOUNT_DOLLARS", 0);
      this.$store.commit("SET_BUY_AMOUNT_CRYPTO", 0);

      // Breytum app mode í buy svo að réttur component loadist
      const modes = {
        buyMode: true,
        sellMode: false,
        newPfMode: false,
      };
      this.$store.commit("SET_APP_MODE", modes);
    },

    // Breyti unix dateformattinu yfir í læsilegra format í töflunni
    unix2date(data) {
      const date = new Date(data * 1000);
      const hours = this.addZeroToPrettifyTimeValues(date.getHours());
      const minutes = this.addZeroToPrettifyTimeValues(date.getMinutes());
      const seconds = this.addZeroToPrettifyTimeValues(date.getSeconds());
      return hours + ":" + minutes + ":" + seconds;
    },
    // Þessi function bætir 0 fyrir framan tölur ef þess þarf svo að tímaformattið sé fallegra
    addZeroToPrettifyTimeValues(timeValue) {
      // timeValue koma inn sem numbers, þær verða aldrei hærri en 59 og aldrei lægri en 0, alltaf þegar það kemur inn tala frá og með 0 og upp í og með 9 þá bætist 0 fyrir framan hana
      if (timeValue < 10) {
        return "0" + timeValue;
      } else {
        return timeValue;
      }
    },
  },

  computed: {
    cryptodata() {
      return this.$store.state.theMarket;
    },
  },
  mounted() {
    this.$store.dispatch("getRequestCryptoData");
  },
};
</script>

<style>
.capitalize-this {
  text-transform: capitalize;
}

.crypto-red {
  color: rgb(247, 50, 50);
}

.crypto-neutral {
  color: yellow;
}

.crypto-green {
  color: rgb(15, 157, 15);
}
</style>