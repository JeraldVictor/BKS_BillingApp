// const HOST = "http://localhost:3000";
const HOST = "https://api.bks.jerald.dev";

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export { HOST, asyncForEach };
