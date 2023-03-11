<template>
  <div>
    <v-card elevation="3" class="ma-2" height="90vh">
      <template #title>
        <v-row>
          <v-col>
            <small>
              Billed By <b>{{ EMPLOYEE.name }}</b>
            </small>
          </v-col>
          <v-col>
            <div class="text-center">Payable: {{ toRupee(total) }}</div>
          </v-col>
        </v-row>
      </template>
      <template #text>
        <v-form ref="newOrder" @submit.prevent="CreateBill">
          <div class="py-2">
            <div class="products">
              <v-row>
                <v-col cols="3">Name</v-col>
                <v-col cols="2" class="text-center">QTY</v-col>
                <v-col cols="2" class="text-right">MRP</v-col>
                <v-col cols="2" class="text-center">Rate</v-col>
                <v-col cols="2" class="text-right">Total</v-col>
                <v-col cols="1" class="text-center">Delete</v-col>
              </v-row>
              <v-divider class="ma-2"></v-divider>
              <div class="product_items">
                <v-row v-for="(item, i) in Items" :key="i" align="center">
                  <v-col cols="3">
                    <p class="product_name">
                      {{ item.name }} <br />
                      <small>( {{ item.measure }} )</small>
                    </p>
                  </v-col>
                  <v-col cols="2">
                    <div class="d-flex justify-center">
                      <v-btn
                        size="x-small"
                        icon="mdi-minus"
                        color="primary"
                        rounded="pill"
                        @click="lessQty(i)"
                      ></v-btn>
                      <p class="pa-2">{{ item.qty }}</p>

                      <v-btn
                        size="x-small"
                        icon="mdi-plus"
                        color="primary"
                        rounded="pill"
                        @click="addQty(i)"
                      ></v-btn>
                    </div>
                  </v-col>
                  <v-col cols="2" class="text-right">{{
                    toRupee(item.mrp)
                  }}</v-col>
                  <v-col cols="2" class="text-center px-0">
                    <input
                      type="number"
                      class="rate"
                      min="0"
                      :value="item.rate"
                      @change="($event) => newValueChanged(i, $event)"
                    />
                    <span class="pl-2">₹​</span>
                  </v-col>
                  <v-col cols="2" class="text-right">
                    {{ toRupee(item.total) }}</v-col
                  >
                  <v-col cols="1" class="text-center">
                    <v-btn
                      size="x-small"
                      icon="mdi-delete"
                      color="error"
                      rounded="pill"
                      @click="deleteItem(i)"
                    ></v-btn
                  ></v-col>
                </v-row>
              </div>
            </div>

            <div>
              <v-divider></v-divider>
              <v-table>
                <tbody>
                  <tr>
                    <th>Discount by %</th>
                    <td>
                      <input
                        type="number"
                        class="rate"
                        min="0"
                        v-model="discount_percent"
                      />
                      <span class="pl-2">%</span>
                    </td>
                    <th>Discount By Rate(₹​)</th>
                    <td>
                      <input
                        type="number"
                        class="rate"
                        min="0"
                        v-model="discount_rate"
                      />
                      <span class="pl-2">₹​</span>
                    </td>
                  </tr>
                  <tr>
                    <th>Total by MRP</th>
                    <td>{{ toRupee(mrp) }}</td>
                    <th>Discount</th>
                    <td>{{ toRupee(discount) }}</td>
                  </tr>
                  <tr>
                    <th>Total by Rate</th>
                    <td>{{ toRupee(rate) }}</td>
                    <th>Total after Discount</th>
                    <td>{{ toRupee(total) }}</td>
                  </tr>
                  <tr>
                    <td>Bill Type</td>
                    <td>
                      <v-select
                        label="Bill Type"
                        v-model="billType"
                        :items="billTypeList"
                        variant="underlined"
                        density="compact"
                        single-line
                        :rules="[(v) => !!v || 'Bill Type is Needed']"
                      ></v-select>
                    </td>
                    <td>Message/Reminder</td>
                    <td>
                      <input
                        v-model="message"
                        type="text"
                        class="rate"
                        style="width: 100%"
                      />
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>
            <v-row>
              <!-- <v-col>
                <v-btn
                  block
                  color="error"
                  rounded
                  :disabled="Number(total) < 1"
                  @click="creditBill"
                  >Credit</v-btn
                >
              </v-col> -->
              <v-col>
                <v-btn
                  block
                  color="primary"
                  rounded
                  :disabled="Number(total) < 1"
                  @click="A4Bill"
                  >A4 Bill</v-btn
                >
              </v-col>
              <v-col>
                <v-btn
                  block
                  color="primary"
                  rounded
                  type="submit"
                  :disabled="Number(total) < 1"
                  >Small Bill</v-btn
                >
              </v-col>
            </v-row>
          </div>
        </v-form>
      </template>
    </v-card>
    <v-dialog v-model="creditBillModel" width="350px">
      <v-card>
        <v-card-text>
          <v-form ref="newCustomer" @submit.prevent="submitCreditBill">
            <v-text-field
              v-model="billedTo"
              label="Customer Name"
              :rules="[(v) => !!v || 'Customer Name is required']"
            ></v-text-field>
            <br />
            <v-row>
              <v-col>
                <v-btn color="error" block @click="creditBillModel = false"
                  >Close Dialog</v-btn
                >
              </v-col>
              <v-col>
                <v-btn color="primary" type="submit" block>Save Bill</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      billingForm: false,
      billedTo: "",
      billType: "CASH",
      billTypeList: ["CASH", "CREDIT", "QUOTATION", "OTHER"],
      total: "0",
      discount: "0",
      rate: "0",
      mrp: "0",
      message: "",
      discount_percent: "0",
      discount_rate: "0",
      creditBillModel: false,
      status: "",
      printType: "",
    };
  },
  created() {
    this.calculateData();
    this.SET_PRINT_ORDER({});
  },
  computed: {
    ...mapGetters({
      Items: "order/items",
      completedOrder: "order/completedOrder",
      EMPLOYEE: "EMPLOYEE",
    }),
  },
  methods: {
    ...mapActions({
      NEW_ORDER: "order/NEW_ORDER",
      SET_ITEM: "order/SET_ITEM",
      SMALL_PRINT_ORDER: "order/SMALL_PRINT_ORDER",
      SET_PRINT_ORDER: "order/SET_PRINT_ORDER",
    }),
    ...mapMutations({
      REMOVE_ITEM: "order/removeItem",
      SET_COMPLETE: "order/setCompletedOrder",
      setQty: "order/setQty",
      setRate: "order/setRate",
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
    CreateOrder() {
      return this.NEW_ORDER({
        billedBy: this.EMPLOYEE.name,
        billType: this.billType,
        total: this.total,
        discount: this.discount,
        rate: this.rate,
        mrp: this.mrp,
        message: this.message,
        discount_percent: this.discount_percent,
        discount_rate: this.discount_rate,
        billedTo: this.billedTo,
        Items: this.Items,
      });
    },
    printBill() {
      if (this.printType == "A4") {
        window.print();
      } else {
        this.SMALL_PRINT_ORDER(this.completedOrder);
      }
    },
    resetBill() {
      this.SET_ITEM([]);
      this.total = "0";
      this.discount = "0";
      this.rate = "0";
      this.mrp = "0";
      this.message = "";
      this.discount_percent = "0";
      this.discount_rate = "0";
      this.billedTo = "";
      this.billType = "CASH";
      this.status = "";
      this.printType = "";
      this.creditBillModel = false;
      this.$refs.newOrder.reset();
    },
    async A4Bill() {
      const { valid } = await this.$refs.newOrder.validate();

      if (valid) {
        this.printType = "A4";
        if (this.billType == "QUOTATION" || this.billType == "CREDIT") {
          if (this.billType == "CREDIT") {
            this.status = "CREDIT";
          }
          this.creditBill();
          return;
        }
        let value = await this.CreateOrder();
        if (value) {
          this.printBill();
          this.resetBill();
        }
      }
    },
    async CreateBill() {
      const { valid } = await this.$refs.newOrder.validate();

      if (valid) {
        if (this.billType == "QUOTATION" || this.billType == "CREDIT") {
          if (this.billType == "CREDIT") {
            this.status = "CREDIT";
          }
          this.creditBill();
          return;
        }
        let value = await this.CreateOrder();
        if (value) {
          this.SMALL_PRINT_ORDER(this.completedOrder);
          this.resetBill();
        }
      }
    },
    calculateData() {
      this.mrp = 0;
      this.rate = 0;
      this.total = 0;
      this.Items.forEach((item) => {
        // MRP Calculation
        this.mrp = Number(this.mrp) + Number(item.mrp);
        // Rate Calculation
        this.rate = Number(this.rate) + Number(item.rate);
        // total Calculation
        this.total = Number(this.total) + Number(item.total);
      });

      // discount %
      this.discount = 0;
      if (this.discount_percent && this.total) {
        this.discount =
          (Number(this.total) * Number(this.discount_percent)) / 100;
        this.total = Number(this.total) - this.discount;
      }

      // discount rupee
      if (this.discount_rate && this.total) {
        this.total = Number(this.total) - Number(this.discount_rate);
        this.discount = this.discount_rate;
      }

      // Round off total
      this.total = Math.round(Number(this.total));
    },
    addQty(index) {
      this.setQty({ index, qty: 1 + Number(this.Items[index].qty) });
    },
    lessQty(index) {
      if (Number(this.Items[index].qty) > 1) {
        this.setQty({ index, qty: Number(this.Items[index].qty) - 1 });
      }
    },
    deleteItem(index) {
      this.REMOVE_ITEM(index);
    },
    newValueChanged(index, e) {
      this.setRate({ index, value: e.target.value });
    },
    creditBill() {
      this.billedTo = "";
      this.status = "CREDIT";
      this.creditBillModel = true;
    },
    async submitCreditBill() {
      // Modal
      const { valid } = await this.$refs.newCustomer.validate();
      if (valid) {
        this.creditBillModel = false;
        let value = await this.CreateOrder();
        if (value) {
          this.printBill();
          this.resetBill();
        }
      }
    },
  },
  watch: {
    discount_percent(val) {
      if (val) {
        this.discount_rate = 0;
      }

      this.calculateData();
    },
    discount_rate(val) {
      if (val) {
        this.discount_percent = 0;
      }
      this.calculateData();
    },
    Items: {
      deep: true,
      handler() {
        this.calculateData();
      },
    },
  },
};
</script>

<style scoped lang="scss">
.rate {
  border: 1px solid gray;
}
.products {
  width: 100%;
  .product_items {
    height: 50vh;
    overflow-y: scroll;
    overflow-x: hidden;
  }
}
</style>
