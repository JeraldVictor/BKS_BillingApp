import { HOST } from "../utils";
import axios from "axios";

export default {
  state: {
    category: [],
  },
  getters: {
    category(state) {
      return state.category;
    },
  },
  mutations: {
    setCategory(state, data) {
      state.category = data;
    },
  },
  actions: {
    async GET_CATEGORY({ commit }, data) {
      await commit("setLoading", true, { root: true });
      try {
        let { data: resData } = await axios.get(HOST + "/Category");
        if (resData.status != 200) {
          throw Error(resData.message);
        }
        commit("setCategory", resData.category);
        return true;
      } catch (error) {
        await commit("setError", error, { root: true });
        return false;
      } finally {
        await commit("setLoading", false, { root: true });
      }
    },
    async NEW_CATEGORY({ commit }, data) {
      await commit("setLoading", true, { root: true });
      try {
        let { data: resData } = await axios.post(HOST + "/Category", data);
        if (resData.status != 200) {
          throw Error(resData.message);
        }
        // commit("setCategory", resData.category);
        return true;
      } catch (error) {
        await commit("setError", error, { root: true });
        return false;
      } finally {
        await commit("setLoading", false, { root: true });
      }
    },
    async UPDATE_CATEGORY({ commit }, data) {
      await commit("setLoading", true, { root: true });
      try {
        let { data: resData } = await axios.put(HOST + "/Category", data);
        if (resData.status != 200) {
          throw Error(resData.message);
        }
        // commit("setCategory", resData.category);
        return true;
      } catch (error) {
        await commit("setError", error, { root: true });
        return false;
      } finally {
        await commit("setLoading", false, { root: true });
      }
    },
    async DELETE_CATEGORY({ commit }, data) {
      await commit("setLoading", true, { root: true });
      try {
        console.log(data);
        let { data: resData } = await axios.delete(HOST + "/Category", {
          data,
        });
        if (resData.status != 200) {
          throw Error(resData.message);
        }
        // await commit(
        //   "setError",
        //   {
        //     title: "Have a look !",
        //     message: resData.message,
        //   },
        //   { root: true }
        // );
        // commit("setCategory", resData.category);
        return true;
      } catch (error) {
        await commit("setError", error, { root: true });
        return false;
      } finally {
        await commit("setLoading", false, { root: true });
      }
    },
  },
};
