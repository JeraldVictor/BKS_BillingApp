<template>
  <v-card elevation="3" class="ma-2" height="90vh">
    <template #title>
      <div class="text-center">Products</div>
    </template>
    <template #text>
      <div class="pa-2">
        <div>
          <div>
            <v-form v-model="form" @submit.prevent="searchProduct">
              <v-text-field
                v-model="productName"
                label="Search Product by Name"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                clearable
              ></v-text-field>
              <v-autocomplete
                v-model="productCategory"
                label="Select Product Category"
                variant="outlined"
                clearable
                :items="CATEGORY"
                item-value="id"
                item-title="name"
                placeholder="Select Category"
              ></v-autocomplete>
              <div class="d-flex justify-space-between">
                <v-btn color="error" @click="resetSearch">Reset</v-btn>
                <v-btn type="submit" color="primary">Search</v-btn>
              </div>
            </v-form>
          </div>

          <v-table fixed-header hover height="60vh">
            <thead>
              <tr>
                <th class="text-left">
                  Name <br />
                  <small>( Measurement )</small>
                </th>
                <th class="text-left">MRP</th>
                <th class="text-left">Rate</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="products.length >= 1">
                <tr
                  class="pointer"
                  v-for="(item, i) in products"
                  :key="i"
                  @click="addItemToBill(item)"
                >
                  <td>
                    {{ item.name }} <br />
                    <small>( {{ item.measure }} )</small>
                  </td>
                  <td width="20%">{{ toRupee(item.mrp) }}</td>
                  <td width="20%">{{ toRupee(item.rate) }}</td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td colspan="3" class="text-center">No items found</td>
                </tr>
              </template>
            </tbody>
          </v-table>
        </div>
      </div>
    </template>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      form: false,
      productName: null,
      productCategory: null,
    };
  },
  async created() {
    await Promise.all([this.GET_PRODUCTS(), this.GET_CATEGORY()]);
  },
  computed: {
    ...mapGetters({
      products: "product/homeProducts",
      CATEGORY: "category/category",
    }),
  },
  methods: {
    ...mapActions({
      GET_PRODUCTS: "product/GET_PRODUCTS",
      SEARCH_PRODUCTS: "product/SEARCH_PRODUCTS",
      GET_CATEGORY: "category/GET_CATEGORY",
      ADD_ITEM: "order/ADD_ITEM",
    }),
    ...mapMutations({
      setHomeProducts: "product/setHomeProducts",
    }),
    toRupee(num) {
      let n1, n2;
      num = num + "" || "";
      // works for integer and floating as well
      n1 = num.split(".");
      n2 = n1[1] || null;
      n1 = n1[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
      num = n2 ? n1 + "." + n2 : n1;
      return ` ₹​ ${num}`;
    },
    searchProduct() {
      this.SEARCH_PRODUCTS({
        name: this.productName,
        category_id: this.productCategory,
      });
    },
    resetSearch() {
      this.productCategory = null;
      this.productName = null;
      this.setHomeProducts([]);
    },
    addItemToBill(item) {
      this.ADD_ITEM(item);
    },
  },
};
</script>

<style></style>
