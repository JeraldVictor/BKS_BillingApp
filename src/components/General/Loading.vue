<template>
  <div v-if="isLoading" id="loading">
    <v-progress-circular
      :size="100"
      :width="10"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['isLoading'])
  }
}
</script>

<style scoped>
#loading {
  position: fixed; /* Sit on top of the page content */
  display: flex; /* Hidden by default */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 2;
  justify-content: center;
  align-items: center;
}
</style>
