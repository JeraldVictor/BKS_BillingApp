import { HOST, asyncForEach } from "../utils";
import axios from "axios";

export default {
  state: {
    items: [],
    order: [],
    completedOrder: {},
  },
  getters: {
    items(state) {
      return state.items;
    },
    order(state) {
      return state.order;
    },
    completedOrder(state) {
      return state.completedOrder;
    },
  },
  mutations: {
    setItems(state, data) {
      state.items = data;
    },
    setOrder(state, data) {
      state.order = data;
    },
    setCompletedOrder(state, data) {
      state.completedOrder = data;
    },
    setQty(state, { index, qty }) {
      state.items[index].qty = qty;
      state.items[index].total =
        state.items[index].qty * state.items[index].rate;
    },
    setRate(state, { index, value }) {
      state.items[index].rate = value;
      state.items[index].total =
        state.items[index].qty * state.items[index].rate;
    },
    removeItem(state, index) {
      state.items.splice(index, 1);
    },
    addItem(state, data) {
      let check = false;
      for (let element in state.items) {
        if (state.items[element].i_id == data.id) {
          check = true;
          break;
        }
      }
      if (!check) {
        data.qty = 1;
        data.total = Number(data.rate) * Number(data.qty);
        let { id, name, productName, ...otherData } = data;
        state.items.push({
          i_id: id,
          name: productName,
          ...otherData,
        });
      } else {
        throw Error(`"${data.name}" is already in the bill list.`);
      }
    },
  },
  actions: {
    async SET_ITEM({ commit }) {
      await commit("setLoading", true, { root: true });
      try {
        commit("setItems", []);
        return true;
      } catch (error) {
        await commit(
          "setError",
          { title: "Issue found", message: error.message },
          { root: true }
        );
        return false;
      } finally {
        await commit("setLoading", false, { root: true });
      }
    },
    async ADD_ITEM({ commit }, data) {
      await commit("setLoading", true, { root: true });
      try {
        commit("addItem", data);
        return true;
      } catch (error) {
        await commit(
          "setError",
          { title: "Item already exists", message: error.message },
          { root: true }
        );
        return false;
      } finally {
        await commit("setLoading", false, { root: true });
      }
    },
    async NEW_ORDER({ commit }, data) {
      await commit("setLoading", true, { root: true });
      try {
        let { data: resData } = await axios.post(HOST + "/Order", data);
        if (resData.status != 200) {
          throw Error(resData.message);
        }
        await commit(
          "setError",
          {
            message: resData.message + `. Order #${resData.order.id}`,
            title: "Have a look!",
          },
          { root: true }
        );
        await commit("setCompletedOrder", resData.order);
        return true;
      } catch (error) {
        await commit("setError", error, { root: true });
        return false;
      } finally {
        await commit("setLoading", false, { root: true });
      }
    },
    async GET_ORDERS({ commit }) {
      await commit("setLoading", true, { root: true });
      try {
        let { data: resData } = await axios.get(HOST + "/Order");
        if (resData.status != 200) {
          throw Error(resData.message);
        }

        commit("setOrder", resData.orders);

        return true;
      } catch (error) {
        await commit("setError", error, { root: true });
        return false;
      } finally {
        await commit("setLoading", false, { root: true });
      }
    },
    async UPDATE_ORDERS({ commit }, data) {
      await commit("setLoading", true, { root: true });
      try {
        let { data: resData } = await axios.put(HOST + "/Order", data);
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
    async SET_PRINT_ORDER({ commit }, data) {
      await commit("setLoading", true, { root: true });
      try {
        await commit("setCompletedOrder", data);
        return true;
      } catch (error) {
        await commit("setError", error, { root: true });
        return false;
      } finally {
        await commit("setLoading", false, { root: true });
      }
    },
    async SMALL_PRINT_ORDER({ commit }, data) {
      await commit("setLoading", true, { root: true });
      try {
        let { data: resData } = await axios.post("http://localhost:3001", data);
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
