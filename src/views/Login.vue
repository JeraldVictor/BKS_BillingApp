<template>
  <div class="login">
    <div>
      <v-card class="mx-auto" variant="outlined" width="450">
        <template #title>
          <div class="text-center text-decoration-underline heading">BKS</div>
        </template>
        <template #subtitle>
          <div class="text-center">Login</div>
        </template>

        <template #text>
          <v-form v-model="form" @submit.prevent="LoginUser">
            <div class="mb-2">
              <v-text-field
                v-model="phone"
                label="Phone Number"
                variant="outlined"
                prepend-inner-icon="mdi-phone"
                :readonly="isLoading"
                placeholder="9XXXXXXXXXX"
                :rules="[required, phoneValidate]"
              ></v-text-field>
              <v-text-field
                v-model="password"
                :readonly="isLoading"
                :rules="[required]"
                variant="outlined"
                prepend-inner-icon="mdi-lock"
                label="Password"
                placeholder="Enter your password"
                type="password"
              ></v-text-field>
            </div>

            <div class="text-center mb-4">
              <v-btn
                :disabled="!form"
                :loading="isLoading"
                block
                color="primary"
                variant="outlined"
                @click="LoginUser"
                >Login</v-btn
              >
            </div>
          </v-form>
          <div class="text-center mutted">&copy; Jerald Victor</div>
        </template>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data: () => ({
    form: false,
    phone: "",
    password: "",
  }),
  created() {
    this.CHECK_LOGIN().then((val) => {
      if (this.isLoggedIn) {
        this.$router.replace("/Home");
      }
    });
  },
  computed: {
    ...mapGetters(["isLoading", "isLoggedIn"]),
  },
  methods: {
    ...mapActions({ SERRVER_LOGIN: "LOGIN", CHECK_LOGIN: "CHECK_LOGIN" }),
    phoneValidate(v) {
      return /^[0-9]{10}$/.test(v) || "Enter valid Phone Number";
    },
    required(v) {
      return !!v || "This Field is required";
    },
    LoginUser() {
      if (!this.form) return;

      this.SERRVER_LOGIN({
        phone: this.phone,
        password: this.password,
      }).then((val) => {
        if (this.isLoggedIn) {
          this.$router.replace("/Home");
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.login {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: center;
  .heading {
    font-size: larger;
    font-weight: bolder;
    font-style: italic;
  }
  .mutted {
    font-weight: bold;
    font-style: italic;
    font-family: "Dancing Script", cursive;
  }
}
</style>
