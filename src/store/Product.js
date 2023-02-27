import { HOST } from "../utils";
import axios from "axios";

export default {
  state: {
    products: [],
    homeProducts: [],
  },
  getters: {
    products(state) {
      return state.products;
    },
    homeProducts(state) {
      return state.homeProducts;
    },
  },
  mutations: {
    setProducts(state, data) {
      state.products = data;
    },
    setHomeProducts(state, data) {
      state.homeProducts = data;
    },
  },
  actions: {
    async GET_PRODUCTS({ commit }, data) {
      await commit("setLoading", true, { root: true });
      try {
        let { data: resData } = await axios.get(HOST + "/Product");
        if (resData.status != 200) {
          throw Error(resData.message);
        }
        commit("setProducts", resData.products);
        return true;
      } catch (error) {
        await commit("setError", error, { root: true });
        return false;
      } finally {
        await commit("setLoading", false, { root: true });
      }
    },
    async NEW_PRODUCTS({ commit }, data) {
      await commit("setLoading", true, { root: true });
      try {
        let { data: resData } = await axios.post(HOST + "/Product", data);
        if (resData.status != 200) {
          throw Error(resData.message);
        }
        return true;
      } catch (error) {
        await commit("setError", error, { root: true });
        return false;
      } finally {
        await commit("setLoading", false, { root: true });
      }
    },
    async UPDATE_PRODUCTS({ commit }, data) {
      await commit("setLoading", true, { root: true });
      try {
        let { data: resData } = await axios.put(HOST + "/Product", data);
        if (resData.status != 200) {
          throw Error(resData.message);
        }
        return true;
      } catch (error) {
        await commit("setError", error, { root: true });
        return false;
      } finally {
        await commit("setLoading", false, { root: true });
      }
    },
    async DELETE_PRODUCTS({ commit }, data) {
      await commit("setLoading", true, { root: true });
      try {
        let { data: resData } = await axios.delete(HOST + "/Product", { data });
        if (resData.status != 200) {
          throw Error(resData.message);
        }
        commit("setProducts", resData.products);
        return true;
      } catch (error) {
        await commit("setError", error, { root: true });
        return false;
      } finally {
        await commit("setLoading", false, { root: true });
      }
    },
    async SEARCH_PRODUCTS({ commit }, data) {
      await commit("setLoading", true, { root: true });
      try {
        let { data: resData } = await axios.post(
          HOST + "/Product/Search",
          data
        );
        if (resData.status != 200) {
          throw Error(resData.message);
        }
        commit("setHomeProducts", resData.products);
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
