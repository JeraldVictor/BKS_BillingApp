<template>
  <div v-if="!_.isEmpty(ORDER)">
    <div class="text-center">
      <h1>BKS</h1>
      <h3>Electricals</h3>
      <div>
        No: 34, 19-A, 4th East Cross Rd, Gandhi Nagar, Vellore, Tamil Nadu
        632006
        <br />
        Ph: +91 93448 89522 / +91 63807 0606
      </div>
      <div class="mt-5">
        <table>
          <tbody>
            <tr>
              <td>
                <div class="text-left">
                  <p>Customer Name:</p>
                  <p class="ml-5">
                    <b>
                      {{ ORDER.billedTo }}
                    </b>
                  </p>
                  <br />
                  <p>Bill Type:</p>
                  <p class="ml-5">
                    <b>
                      {{ ORDER.billType }}
                    </b>
                  </p>
                </div>
              </td>
              <td>
                <div>
                  Quotation / Bill No : <b>{{ ORDER.id }}</b>
                  <br />
                  Date: {{ toDate(ORDER.placed_on) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-5">
        <table>
          <thead>
            <tr>
              <td>#</td>
              <td>Product</td>
              <td class="text-right">M.R.P</td>
              <td>QTY</td>
              <td class="text-right">Rate</td>
              <td class="text-right">Total</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in ORDER.Items" :key="index">
              <td>{{ index + 1 }}</td>
              <td width="40%" class="text-left">{{ item.name }}</td>
              <td class="text-right">
                {{ toRupee(item.mrp) }}
              </td>
              <td>
                {{ item.qty }}
              </td>
              <td class="text-right">{{ toRupee(item.rate) }}</td>
              <td class="text-right">{{ toRupee(item.total) }}</td>
            </tr>

            <tr>
              <td colspan="7">
                <div class="text-right">
                  Total before Discount
                  <span class="ml-4">
                    <b>
                      {{ toRupee(ORDER.rate) }}
                    </b>
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="7">
                <div class="text-right">
                  Discount
                  <span class="ml-4">
                    <b> - {{ toRupee(ORDER.discount) }} </b>
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="7" class="text-right">
                <div class="d-flex justify-space-between">
                  <div class="braker">
                    No. Of. Items
                    <b>
                      {{ ORDER.Items.length }}
                    </b>
                  </div>
                  <div class="braker">
                    Total <br />
                    {{ toRupee(ORDER.total) }}
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="7" class="text-right">
                <div class="d-flex justify-space-between">
                  <div class="signature2">
                    {{ price_in_words(ORDER.total) }}
                  </div>
                  <div>
                    <div class="signature2">Authorised Signatory<br /></div>
                    <div class="signature1">BKS Electricals <br /></div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      _,
    };
  },
  computed: {
    ...mapGetters({
      ORDER: "order/completedOrder",
    }),
  },
  methods: {
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
    price_in_words(price) {
      var sglDigit = [
          "Zero",
          "One",
          "Two",
          "Three",
          "Four",
          "Five",
          "Six",
          "Seven",
          "Eight",
          "Nine",
        ],
        dblDigit = [
          "Ten",
          "Eleven",
          "Twelve",
          "Thirteen",
          "Fourteen",
          "Fifteen",
          "Sixteen",
          "Seventeen",
          "Eighteen",
          "Nineteen",
        ],
        tensPlace = [
          "",
          "Ten",
          "Twenty",
          "Thirty",
          "Forty",
          "Fifty",
          "Sixty",
          "Seventy",
          "Eighty",
          "Ninety",
        ],
        handle_tens = function (dgt, prevDgt) {
          return 0 == dgt
            ? ""
            : " " + (1 == dgt ? dblDigit[prevDgt] : tensPlace[dgt]);
        },
        handle_utlc = function (dgt, nxtDgt, denom) {
          return (
            (0 != dgt && 1 != nxtDgt ? " " + sglDigit[dgt] : "") +
            (0 != nxtDgt || dgt > 0 ? " " + denom : "")
          );
        };

      var str = "",
        digitIdx = 0,
        digit = 0,
        nxtDigit = 0,
        words = [];
      if (((price += ""), isNaN(parseInt(price)))) str = "";
      else if (parseInt(price) > 0 && price.length <= 10) {
        for (digitIdx = price.length - 1; digitIdx >= 0; digitIdx--)
          switch (
            ((digit = price[digitIdx] - 0),
            (nxtDigit = digitIdx > 0 ? price[digitIdx - 1] - 0 : 0),
            price.length - digitIdx - 1)
          ) {
            case 0:
              words.push(handle_utlc(digit, nxtDigit, ""));
              break;
            case 1:
              words.push(handle_tens(digit, price[digitIdx + 1]));
              break;
            case 2:
              words.push(
                0 != digit
                  ? " " +
                      sglDigit[digit] +
                      " Hundred" +
                      (0 != price[digitIdx + 1] && 0 != price[digitIdx + 2]
                        ? " and"
                        : "")
                  : ""
              );
              break;
            case 3:
              words.push(handle_utlc(digit, nxtDigit, "Thousand"));
              break;
            case 4:
              words.push(handle_tens(digit, price[digitIdx + 1]));
              break;
            case 5:
              words.push(handle_utlc(digit, nxtDigit, "Lakh"));
              break;
            case 6:
              words.push(handle_tens(digit, price[digitIdx + 1]));
              break;
            case 7:
              words.push(handle_utlc(digit, nxtDigit, "Crore"));
              break;
            case 8:
              words.push(handle_tens(digit, price[digitIdx + 1]));
              break;
            case 9:
              words.push(
                0 != digit
                  ? " " +
                      sglDigit[digit] +
                      " Hundred" +
                      (0 != price[digitIdx + 1] || 0 != price[digitIdx + 2]
                        ? " and"
                        : " Crore")
                  : ""
              );
          }
        str = words.reverse().join("");
        str = "Rupees " + str + " Only";
      } else str = "";
      return str;
    },
  },
};
</script>

<style scoped lang="scss">
table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid black;
  td {
    border: 1px solid black;
    padding: 0px 10px;
  }
  .braker {
    margin: 20px 0px;
    font-weight: bold;
  }
  .signature1 {
    font-weight: bold;
  }
  .signature2 {
    margin-top: 40px;
  }
}
// @media print {
//   body {
//     margin: 0;
//     color: #000;
//     background-color: #fff;
//   }
// }
</style>
