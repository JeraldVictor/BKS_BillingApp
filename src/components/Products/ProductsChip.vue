<template>
  <v-slide-group show-arrows>
    <v-slide-group-item v-for="n in 45" :key="n">
      <v-btn class="ma-2" rounded> Options {{ n }} </v-btn>
    </v-slide-group-item>
  </v-slide-group>
</template>

<script>
export default {};
</script>

<style></style>
