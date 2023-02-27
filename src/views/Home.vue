<template>
  <v-row class="mt-2">
    <v-col cols="4">
      <Products />
    </v-col>
    <v-col>
      <Billing />
    </v-col>
  </v-row>
</template>

<script>
import Billing from "../components/Home/Billing.vue";
import Products from "../components/Home/Products.vue";
export default {
  components: {
    Billing,
    Products,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style></style>
