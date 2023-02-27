<template>
  <v-navigation-drawer rail expand-on-hover permanent>
    <!-- v-model="getNavBar"  -->
    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        v-for="(i, index) in items"
        :key="index"
        :prepend-icon="i.icon"
        :title="i.title"
        :to="i.to"
        active-color="primary"
        density="compact"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      items: [
        // { title: 'Login', icon: 'mdi-login', to: '/' },
        { title: "Home", icon: "mdi-view-dashboard", to: "/Home" },
        { title: "Category", icon: "mdi-shape", to: "/Category" },
        { title: "Products", icon: "mdi-sitemap-outline", to: "/Products" },
        { title: "Orders", icon: "mdi-receipt-text-check", to: "/Orders" },
        { title: "Employee", icon: "mdi-account-group", to: "/Employee" },
        // { title: "About", icon: "mdi-information", to: "/about" },
      ],
    };
  },
  computed: {
    ...mapGetters(["isNavBar", "EMPLOYEE"]),
    getNavBar: {
      get() {
        return this.isNavBar;
      },
      set() {
        this.setNavBar();
      },
    },
  },
  methods: {
    ...mapMutations(["setNavBar"]),
    navItem({ to }) {
      this.$router.push(to);
    },
  },
};
</script>
<style lang="scss"></style>
