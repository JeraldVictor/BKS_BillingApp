<template>
  <div>
    <v-container>
      <h1 class="text-center">Category</h1>
      <v-card
        :text="edit ? 'Edit Category' : 'New Category'"
        max-width="90%"
        class="pa-2 ma-auto mb-2"
      >
        <v-form ref="newCategoryForm" @submit.prevent>
          <v-text-field
            v-model="name"
            label="Category name"
            :rules="[(v) => !!v || 'Category name is required']"
          ></v-text-field>

          <v-text-field v-model="hsnCode" label="HSN Code"></v-text-field>
          <template v-if="!edit">
            <v-btn
              type="submit"
              block
              class="mt-2"
              color="primary"
              @click="createCategory"
              >Submit</v-btn
            >
          </template>
          <template v-else>
            <v-btn
              type="submit"
              block
              class="mt-2"
              color="warning"
              @click="editCategory"
              >Edit Category</v-btn
            >
          </template>
        </v-form>
      </v-card>

      <v-table fixed-header height="600px">
        <thead>
          <tr>
            <th class="text-left">Catgeory Name</th>
            <th class="text-left">HSN Code</th>
            <th class="text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="category.length >= 1">
            <tr v-for="(item, index) in category" :key="index">
              <td>{{ item.name }}</td>
              <td>{{ item.hsnCode }}</td>
              <td>
                <v-btn
                  size="x-small"
                  icon="mdi-delete"
                  color="error"
                  @click="deleteCategory(item.id)"
                ></v-btn>
                <v-btn
                  size="x-small"
                  icon="mdi-pencil"
                  color="success"
                  class="ml-2"
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
      hsnCode: "",
    };
  },
  created() {
    this.GET_CATEGORY();
  },
  computed: {
    ...mapGetters({
      category: "category/category",
    }),
  },
  methods: {
    ...mapActions({
      GET_CATEGORY: "category/GET_CATEGORY",
      NEW_CATEGORY: "category/NEW_CATEGORY",
      UPDATE_CATEGORY: "category/UPDATE_CATEGORY",
      DELETE_CATEGORY: "category/DELETE_CATEGORY",
    }),
    async createCategory() {
      const { valid } = await this.$refs.newCategoryForm.validate();

      if (valid) {
        let vm = this;
        this.NEW_CATEGORY({ name: this.name, hsnCode: this.hsnCode }).then(
          (val) => {
            if (val) {
              vm.$refs.newCategoryForm.reset();
              vm.GET_CATEGORY();
            }
          }
        );
      }
    },
    openEdit(item) {
      this.$refs.newCategoryForm.reset();
      (this.id = item.id), (this.name = item.name);
      this.hsnCode = item.hsnCode;
      this.edit = true;
    },
    async editCategory() {
      const { valid } = await this.$refs.newCategoryForm.validate();

      if (valid) {
        let vm = this;
        this.UPDATE_CATEGORY({
          id: this.id,
          name: this.name,
          hsnCode: this.hsnCode,
        }).then((val) => {
          if (val) {
            this.id = "";
            this.edit = false;
            vm.$refs.newCategoryForm.reset();
            vm.GET_CATEGORY();
          }
        });
      }
    },
    deleteCategory(id) {
      let vm = this;
      this.DELETE_CATEGORY({ id }).then((val) => {
        if (val) {
          vm.GET_CATEGORY();
        }
      });
    },
  },
};
</script>

<style></style>
