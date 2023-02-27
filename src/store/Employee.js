import { HOST } from "../utils";
import axios from "axios";

export default {
  state: {
    employee: [],
  },
  getters: {
    employee(state) {
      return state.employee;
    },
  },
  mutations: {
    setEmployee(state, data) {
      state.employee = data;
    },
  },
  actions: {
    async GET_EMPLOYEE({ commit }, data) {
      await commit("setLoading", true, { root: true });
      try {
        let { data: resData } = await axios.get(HOST + "/Employee");
        if (resData.status != 200) {
          throw Error(resData.message);
        }
        // console.log(resData);
        commit("setEmployee", resData.employee);
        return true;
      } catch (error) {
        await commit("setError", error, { root: true });
        return false;
      } finally {
        await commit("setLoading", false, { root: true });
      }
    },
    async NEW_EMPLOYEE({ commit }, data) {
      await commit("setLoading", true, { root: true });
      try {
        let { data: resData } = await axios.post(HOST + "/Employee", data);
        if (resData.status != 200) {
          throw Error(resData.message);
        }
        // commit("setEmployee", resData.Employee);
        return true;
      } catch (error) {
        await commit("setError", error, { root: true });
        return false;
      } finally {
        await commit("setLoading", false, { root: true });
      }
    },
    async RESET_PASSWORD({ commit }, data) {
      await commit("setLoading", true, { root: true });
      try {
        let { data: resData } = await axios.post(
          HOST + "/Employee/Reset",
          data
        );
        if (resData.status != 200) {
          throw Error(resData.message);
        }
        await commit(
          "setError",
          {
            title: "Have a look !",
            message: resData.message,
          },
          { root: true }
        );
        // commit("setEmployee", resData.Employee);
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
