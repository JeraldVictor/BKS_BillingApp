<template>
  <v-container>
    <h1 class="text-center">Orders</h1>

    <v-table fixed-header height="600px">
      <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">Total Items</th>
          <th class="text-left">Total</th>
          <th class="text-left">Billed On</th>
          <th class="text-center" width="20%">Action</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="ORDERS.length >= 1">
          <tr v-for="(item, index) in ORDERS" :key="index" class="pointer">
            <td @click="openOrder(item)">{{ item.id }}</td>
            <td @click="openOrder(item)">{{ item.Items.length }}</td>
            <td @click="openOrder(item)">{{ toRupee(item.total) }}</td>
            <td @click="openOrder(item)">{{ toDate(item.placed_on) }}</td>
            <td class="text-right">
              <v-btn color="error" variant="outlined">Cancel</v-btn>
              <v-btn
                size="x-small"
                icon="mdi-pencil"
                color="success"
                class="ml-2"
              ></v-btn>
              <v-btn
                size="x-small"
                icon="mdi-printer"
                color="success"
                class="ml-2"
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

    <v-dialog v-model="orderDialog" width="450px">
      <v-card v-if="selectedOrder.hasOwnProperty('id')">
        <v-card-title>
          <div class="text-center">
            Order
            <b> #{{ selectedOrder.id }} </b>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-table>
            <tbody>
              <tr>
                <td>Bill Type</td>
                <td class="text-right">
                  <b>{{ selectedOrder.billType }}</b>
                </td>
                <td>Status</td>
                <td class="text-right">
                  <b>{{ selectedOrder.status }}</b>
                </td>
              </tr>
              <tr>
                <td>Bill Total</td>
                <td class="text-right">
                  <b>{{ toRupee(selectedOrder.total) }}</b>
                </td>
                <td>Discount</td>
                <td class="text-right">
                  <b>{{ toRupee(selectedOrder.discount) }}</b>
                </td>
              </tr>
              <tr>
                <td colspan="2">Bill Items</td>
                <td colspan="2" class="text-right">
                  <b>{{ selectedOrder.Items.length }}</b>
                </td>
              </tr>
            </tbody>
          </v-table>
          <hr />
          <div>
            <v-table height="500px" fixed-header>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in selectedOrder.Items" :key="i">
                  <td>{{ item.name }}</td>
                  <td>{{ toRupee(item.rate) }}</td>
                </tr>
              </tbody>
            </v-table>
          </div>
          <v-divider></v-divider>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      orderDialog: false,
      selectedOrder: {},
    };
  },
  created() {
    this.GET_ORDERS();
  },
  computed: {
    ...mapGetters({
      ORDERS: "order/order",
    }),
  },
  methods: {
    ...mapActions({
      GET_ORDERS: "order/GET_ORDERS",
    }),
    toDate(item) {
      let d = Date(item);
      d = new Date(d);
      d =
        d.getDate() +
        "-" +
        d.getMonth() +
        1 +
        "-" +
        d.getFullYear() +
        " " +
        (d.getHours() > 12 ? d.getHours() - 12 : d.getHours()) +
        ":" +
        d.getMinutes() +
        " " +
        (d.getHours() >= 12 ? "PM" : "AM");
      return d;
    },
    toRupee(num) {
      let n1, n2;
      num = num + "" || "";
      n1 = num.split(".");
      n2 = n1[1] || null;
      n1 = n1[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
      num = n2 ? n1 + "." + n2 : n1;
      return ` ₹​ ${num}`;
    },
    openOrder(item) {
      this.selectedOrder = item;
      this.orderDialog = true;
    },
  },
};
</script>

<style></style>
