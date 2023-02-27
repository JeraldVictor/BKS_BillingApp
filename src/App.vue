<template>
  <v-app>
    <template v-if="$route.path == '/'">
      <v-main>
        <Error />
        <router-view />
      </v-main>
    </template>
    <template v-else>
      <Loading />
      <Error />
      <NavBar />
      <v-app-bar color="primary" density="compact" order="-1">
        <!-- <template #prepend>
          <v-app-bar-nav-icon @click="openNavMenu"></v-app-bar-nav-icon>
        </template> -->
        <v-spacer></v-spacer>
        <v-app-bar-title>BKS</v-app-bar-title>

        <template #append>
          <v-btn icon="mdi-logout" @click="logout"></v-btn>
        </template>
      </v-app-bar>
      <v-main>
        <router-view />
      </v-main>
    </template>
  </v-app>
</template>

<script>
import Loading from "./components/General/Loading.vue";
import Error from "./components/General/Error.vue";
import NavBar from "./components/NavBar.vue";

import { mapActions, mapMutations } from "vuex";
export default {
  components: {
    Loading,
    Error,
    NavBar,
  },
  created() {
    this.CHECK_LOGIN();
  },
  methods: {
    ...mapActions(["LOGOUT", "CHECK_LOGIN"]),
    ...mapMutations(["setNavBar"]),
    logout() {
      let vm = this;
      this.LOGOUT().then((val) => {
        if (val) {
          vm.$router.replace("/");
        }
      });
    },
    openNavMenu() {
      this.setNavBar();
    },
  },
};
</script>
<style lang="scss"></style>
