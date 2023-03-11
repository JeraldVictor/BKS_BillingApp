<template>
  <v-container>
    <h1 class="text-center">Orders</h1>

    <v-table fixed-header height="80vh">
      <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">Customer</th>
          <th class="text-left">Total Items</th>
          <th class="text-left">Total</th>
          <th class="text-center">Bill Type</th>
          <th class="text-left">Billed On</th>
          <th class="text-center">Status</th>
          <th class="text-center" width="20%">Action</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="ORDERS.length >= 1">
          <tr v-for="(item, index) in ORDERS" :key="index" class="pointer">
            <td @click="openOrder(item)">{{ index + 1 }}</td>
            <td @click="openOrder(item)">{{ item.billedTo }}</td>
            <td @click="openOrder(item)">{{ item.Items.length }}</td>
            <td @click="openOrder(item)">{{ toRupee(item.total) }}</td>
            <td @click="openOrder(item)">
              <div class="text-center">
                <v-chip
                  :variant="
                    item.status == 'QUOTATION' ? 'outlined' : 'elevated'
                  "
                  :color="
                    item.status == 'CREDIT'
                      ? 'warning'
                      : item.status == 'COMPLETED'
                      ? 'primary'
                      : 'error'
                  "
                >
                  {{ item.billType }}
                </v-chip>
              </div>
            </td>
            <td @click="openOrder(item)">{{ toDate(item.placed_on) }}</td>
            <td class="text-center">
              <template v-if="item.status == 'CREDIT'">
                <v-btn
                  color="primary"
                  @click="
                    updateOrderStatus({
                      billType: item.billType,
                      status: 'COMPLETED',
                      id: item.id,
                    })
                  "
                  >Completed</v-btn
                >
              </template>
              <template v-else-if="item.status == 'COMPLETED'">
                <v-btn
                  color="error"
                  variant="outlined"
                  @click="
                    updateOrderStatus({
                      billType: item.billType,
                      status: 'CANCELED',
                      id: item.id,
                    })
                  "
                  >Cancel</v-btn
                >
              </template>
              <template v-else> <p>-</p> </template>
            </td>
            <td class="text-center">
              <v-btn
                icon="mdi-post-outline"
                color="success"
                class="ml-2"
                @click="smallPrint(item)"
              ></v-btn>
              <v-btn
                icon="mdi-printer"
                color="primary"
                class="ml-2"
                @click="a4Print(item)"
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

    <v-dialog v-model="orderDialog" width="550px">
      <v-card v-if="selectedOrder.hasOwnProperty('id')">
        <v-card-title>
          <div class="text-center">
            Order
            <b> #{{ selectedOrder.id }} </b>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <h1 class="text-center">BKS</h1>
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
                <td>Total before discount</td>
                <td class="text-right">
                  <b>{{ toRupee(selectedOrder.rate) }}</b>
                </td>
                <td>Discount</td>
                <td class="text-right">
                  <b>{{ toRupee(selectedOrder.discount) }}</b>
                </td>
              </tr>
              <tr>
                <td>Customer</td>
                <td class="text-right">
                  <b>{{ selectedOrder.billedTo }}</b>
                </td>
                <td>Billed on</td>
                <td>{{ toDate(selectedOrder.placed_on) }}</td>
              </tr>
              <tr>
                <td>Bill Items</td>
                <td class="text-right">
                  <b>{{ selectedOrder.Items.length }}</b>
                </td>
                <td>Bill Total</td>
                <td class="text-right">
                  <b>{{ toRupee(selectedOrder.total) }}</b>
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
                  <th>Qty</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in selectedOrder.Items" :key="i">
                  <td width="50%">{{ item.name }}</td>
                  <td>{{ item.qty }}</td>
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
import { mapActions, mapGetters, mapMutations } from "vuex";
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
      UPDATE_ORDER: "order/UPDATE_ORDERS",
      SET_PRINT_ORDER: "order/SET_PRINT_ORDER",
      SMALL_PRINT_ORDER: "order/SMALL_PRINT_ORDER",
    }),
    ...mapMutations({
      setCompletedOrder: "order/setCompletedOrder",
    }),
    toDate(item) {
      let d = new Date(item);
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
    updateOrderStatus({ billType, status, id }) {
      this.UPDATE_ORDER({
        billType,
        status,
        id,
      }).then((val) => {
        if (val) {
          this.GET_ORDERS();
        }
      });
    },
    smallPrint(item) {
      this.SMALL_PRINT_ORDER(item);
    },
    a4Print(item) {
      this.SET_PRINT_ORDER(item).then((val) => {
        window.print();
      });
    },
  },
};
</script>

<style></style>
