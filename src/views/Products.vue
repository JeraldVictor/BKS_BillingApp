<template>
  <div>
    <v-container>
      <h1 class="text-center">Products</h1>
      <v-card
        :text="edit ? 'Edit Product' : 'New Product'"
        max-width="90%"
        class="pa-2 ma-auto mb-4"
      >
        <v-form ref="newProductForm" @submit.prevent>
          <v-text-field
            v-model="name"
            label="Product name"
            :rules="[(v) => !!v || 'Product name is required']"
          ></v-text-field>
          <v-row>
            <v-col>
              <v-autocomplete
                label="Category"
                :items="category"
                item-value="id"
                item-title="name"
                v-model="category_id"
                :rules="[(v) => !!v || 'Category is required']"
              ></v-autocomplete>
            </v-col>
            <v-col>
              <v-text-field
                v-model="code"
                label="Product Code"
                placeholder="M511110301"
                :rules="[(v) => !!v || 'Product name is required']"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-text-field
            v-model="measure"
            label="Product measurement"
            placeholder="1/2 inch"
            :rules="[(v) => !!v || 'Product name is required']"
          ></v-text-field>
          <v-row>
            <v-col>
              <v-text-field
                v-model="mrp"
                label="Product MRP"
                :rules="[(v) => !!v || 'MRP is required']"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="rate"
                label="Product Rate"
                :rules="[(v) => !!v || 'Rate is required']"
              ></v-text-field>
            </v-col>
          </v-row>

          <template v-if="!edit">
            <v-btn
              type="submit"
              block
              class="mt-2"
              color="primary"
              @click="createProduct"
              >Create Product</v-btn
            >
          </template>
          <template v-else>
            <v-btn
              type="submit"
              block
              class="mt-2"
              color="warning"
              @click="editProduct"
              >Edit Product</v-btn
            >
          </template>
        </v-form>
      </v-card>

      <v-table fixed-header height="600px">
        <thead>
          <tr>
            <th class="font-weight-black font-weight-bold text-left">
              Product Name <br />
              <small>( Measurement )</small>
            </th>
            <th class="font-weight-black font-weight-bold text-left">Code</th>
            <th class="font-weight-black font-weight-bold text-left">
              Category
            </th>
            <th class="font-weight-black font-weight-bold text-left">
              MRP Rate
            </th>
            <th
              width="10%"
              class="font-weight-black font-weight-bold text-left"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="products.length >= 1">
            <tr v-for="(item, index) in products" :key="index">
              <td>
                {{ item.name }} <br />
                <small>( {{ item.measure }} )</small>
              </td>
              <td>{{ item.code }}</td>
              <td>{{ item.category.name }}</td>
              <td>{{ item.mrp }} - {{ item.rate }}</td>
              <td>
                <v-btn
                  size="x-small"
                  icon="mdi-delete"
                  color="error"
                  @click="deleteProduct(item.id)"
                ></v-btn>
                <v-btn
                  size="x-small"
                  icon="mdi-pencil"
                  color="success"
                  class="ml-2"
                  @click="openEdit(item)"
                ></v-btn>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="5">
                <p class="text-overline text-center">No Data found</p>
              </td>
            </tr>
          </template>
        </tbody>
      </v-table>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      edit: false,
      id: "",
      name: "",
      code: "",
      measure: "",
      mrp: "",
      rate: "",
      category_id: null,
    };
  },
  created() {
    this.initComp();
  },
  computed: {
    ...mapGetters({
      category: "category/category",
      products: "product/products",
    }),
  },
  methods: {
    ...mapActions({
      GET_CATEGORY: "category/GET_CATEGORY",
      GET_PRODUCT: "product/GET_PRODUCTS",
      NEW_PRODUCT: "product/NEW_PRODUCTS",
      UPDATE_PRODUCT: "product/UPDATE_PRODUCTS",
      DELETE_PRODUCT: "product/DELETE_PRODUCTS",
    }),
    async initComp() {
      await Promise.all([this.GET_CATEGORY(), this.GET_PRODUCT()]);
    },
    async createProduct() {
      const { valid } = await this.$refs.newProductForm.validate();

      if (valid) {
        let vm = this;
        this.NEW_PRODUCT({
          name: this.name,
          code: this.code,
          measure: this.measure,
          mrp: this.mrp,
          rate: this.rate,
          category_id: this.category_id,
        }).then((val) => {
          if (val) {
            vm.$refs.newProductForm.reset();
            vm.initComp();
          }
        });
      }
    },
    openEdit(item) {
      this.$refs.newProductForm.reset();
      this.id = item.id;
      this.name = item.name;
      this.code = item.code;
      this.measure = item.measure;
      this.mrp = item.mrp;
      this.rate = item.rate;
      this.category_id = item.category_id;
      this.edit = true;
    },
    async editProduct() {
      const { valid } = await this.$refs.newProductForm.validate();

      if (valid) {
        let vm = this;
        this.UPDATE_PRODUCT({
          id: this.id,
          name: this.name,
          code: this.code,
          measure: this.measure,
          mrp: this.mrp,
          rate: this.rate,
          category_id: this.category_id,
        }).then((val) => {
          if (val) {
            this.id = "";
            this.edit = false;
            vm.$refs.newProductForm.reset();
            vm.initComp();
          }
        });
      }
    },
    deleteProduct(id) {
      let vm = this;
      this.DELETE_PRODUCT({ id }).then((val) => {
        if (val) {
          vm.initComp();
        }
      });
    },
  },
  watch: {
    mrp(val) {
      if (val) {
        this.rate = val;
      } else {
        this.rate = 0;
      }
    },
  },
};
</script>

<style></style>
