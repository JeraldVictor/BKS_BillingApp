<template>
  <div>
    <v-container>
      <h1 class="text-center">Employee</h1>
      <v-card
        :text="edit ? 'Edit Employee' : 'New Employee'"
        max-width="90%"
        class="pa-2 ma-auto mb-2"
      >
        <v-form ref="newEmployeeForm" @submit.prevent>
          <v-text-field
            v-model="name"
            label="Employee name"
            :rules="[(v) => !!v || 'Employee name is required']"
          ></v-text-field>

          <v-text-field
            v-model="phone"
            label="Phone"
            :rules="[(v) => !!v || 'Phone is required']"
            :readonly="edit"
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            :rules="[(v) => !!v || 'Password is required']"
          ></v-text-field>
          <template v-if="!edit">
            <v-btn
              type="submit"
              block
              class="mt-2"
              color="primary"
              @click="createEmployee"
              >Create Employee</v-btn
            >
          </template>
          <template v-else>
            <v-btn
              type="submit"
              block
              class="mt-2"
              color="warning"
              @click="editEmployee"
              >Edit Category</v-btn
            >
          </template>
        </v-form>
      </v-card>

      <v-table fixed-header height="600px">
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Phone</th>
            <th class="text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="employee.length >= 1">
            <tr v-for="(item, index) in employee" :key="index">
              <td>{{ item.name }} ( {{ item.role }} )</td>
              <td>{{ item.phone }}</td>
              <td>
                <v-btn
                  size="x-small"
                  icon="mdi-pencil"
                  color="success"
                  @click="openEdit(item)"
                ></v-btn>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="3">
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
      password: "",
      phone: "",
    };
  },
  created() {
    if (this.CHECK_EMP.role != "admin") {
      this.$router.replace("/Home");
    }
    this.GET_EMPLOYEE();
  },
  computed: {
    ...mapGetters({
      employee: "EMPLOYEE/employee",
      CHECK_EMP: "EMPLOYEE",
    }),
  },
  methods: {
    ...mapActions({
      GET_EMPLOYEE: "EMPLOYEE/GET_EMPLOYEE",
      NEW_EMPLOYEE: "EMPLOYEE/NEW_EMPLOYEE",
      RESET_PASSWORD: "EMPLOYEE/RESET_PASSWORD",
    }),
    async createEmployee() {
      const { valid } = await this.$refs.newEmployeeForm.validate();

      if (valid) {
        let vm = this;
        this.NEW_EMPLOYEE({
          name: this.name,
          phone: this.phone,
          password: this.password,
        }).then((val) => {
          if (val) {
            vm.$refs.newEmployeeForm.reset();
            vm.GET_EMPLOYEE();
          }
        });
      }
    },
    openEdit(item) {
      this.$refs.newEmployeeForm.reset();
      this.id = item.id;
      this.name = item.name;
      this.phone = item.phone;
      this.edit = true;
    },
    async editEmployee() {
      const { valid } = await this.$refs.newEmployeeForm.validate();

      if (valid) {
        console.log({
          id: this.id,
          password: this.password,
        });
        this.RESET_PASSWORD({
          id: this.id,
          password: this.password,
        }).then((val) => {
          if (val) {
            this.id = "";
            this.name = "";
            this.phone = "";
            this.$refs.newEmployeeForm.reset();
            this.edit = false;
          }
        });
        // let vm = this;
        // this.UPDATE_EMPLOYEE({
        //   id: this.id,
        //   name: this.name,
        //   hsnCode: this.hsnCode,
        // }).then((val) => {
        //   if (val) {
        //     this.id = "";
        //     this.edit = false;
        //     vm.$refs.newEmployeeForm.reset();
        //     vm.GET_CATEGORY();
        //   }
        // });
      }
    },
  },
};
</script>

<style></style>
