<template>
  <v-dialog v-model="checkError">
    <div class="center">
      <v-card width="500">
        <template #title>
          {{ Error.title }}
        </template>
        <v-card-text>
          {{ Error.message }}
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="dismissError">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-dialog>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapGetters(['isError', 'Error']),
    checkError: {
      get() {
        return this.isError
      },
      set(val) {
        console.log(val)
        this.dismissError()
      }
    }
  },
  methods: {
    ...mapMutations(['dismissError'])
  }
}
</script>

<style lang="scss" scoped>
.center {
  display: flex;
  justify-content: center;
}
</style>
