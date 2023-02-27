// import axios from 'axios'
import { useStorage } from "vue3-storage";
import { createStore } from "vuex";
import { HOST } from "../utils";
import axios from "axios";

import Order from "./Order";
import Product from "./Product";
import Category from "./Category";
import Employee from "./Employee";

const storage = useStorage();

export default createStore({
  state: {
    isLoading: false,
    isError: false,
    error: {
      title: "",
      message: "",
    },
    employee: {},
    isLoggedIn: false,
    isNavBar: true,
    session: "",
  },
  getters: {
    isLoggedIn(state) {
      return state.isLoggedIn;
    },
    isNavBar(state) {
      return state.isNavBar;
    },
    isLoading(state) {
      return state.isLoading;
    },
    isError(state) {
      return state.isError;
    },
    Error(state) {
      return state.error;
    },
    EMPLOYEE(state) {
      return state.employee;
    },
  },
  mutations: {
    setLoading(state, data) {
      state.isLoading = data;
    },
    setNavBar(state) {
      state.isNavBar = !state.isNavBar;
    },
    setError(state, data) {
      state.error = {
        title: data.title ? data.title : "Something went wrong..",
        message: data.message,
      };
      state.isError = true;
    },
    dismissError(state) {
      state.error = {
        title: "",
        message: "",
      };
      state.isError = false;
    },
    SET_INIT(state, { session, employee }) {
      state.employee = employee;
      state.session = session;
      state.isLoggedIn = true;
    },
    SET_EMP(state, { employee, session }) {
      storage.setStorageSync("employee", JSON.stringify(employee));
      storage.setStorageSync("session", session);
      state.employee = employee;
      state.isLoggedIn = true;
    },
    SET_LOGOUT(state) {
      storage.clearStorage("employee");
      storage.clearStorage("session");
      state.employee = {};
      state.isLoggedIn = false;
    },
  },
  actions: {
    async LOGIN({ commit }, data) {
      await commit("setLoading", true);
      try {
        let { data: resData } = await axios.post(HOST + "/login", data);
        if (resData.status != 200) {
          throw Error(resData.message);
        }
        // console.log(resData);
        await commit("SET_EMP", resData);
        return true;
      } catch (error) {
        await commit("setError", error);
        return false;
      } finally {
        await commit("setLoading", false);
      }
    },
    async CHECK_LOGIN({ commit }) {
      await commit("setLoading", true);
      try {
        let employee = await storage.getStorageSync("employee");
        let session = await storage.getStorageSync("session");
        if (employee) {
          await commit("SET_INIT", { employee: JSON.parse(employee), session });
          return true;
        } else {
          return false;
        }
      } catch (error) {
        await commit("setError", error);
        return false;
      } finally {
        await commit("setLoading", false);
      }
    },
    async LOGOUT({ commit }) {
      await commit("setLoading", true);
      try {
        await commit("SET_LOGOUT");
        return true;
      } catch (error) {
        await commit("setError", error);
        return false;
      } finally {
        await commit("setLoading", false);
      }
    },
  },
  modules: {
    order: {
      namespaced: true,
      ...Order,
    },
    product: {
      namespaced: true,
      ...Product,
    },
    category: {
      namespaced: true,
      ...Category,
    },
    EMPLOYEE: {
      namespaced: true,
      ...Employee,
    },
  },
});
