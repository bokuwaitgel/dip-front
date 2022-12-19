const axios = require("axios");

const instance = axios.create({
  baseURL: "http://localhost:4000/"
});
let userStorage = localStorage.getItem("user");

if (userStorage) {
  userStorage = JSON.parse(userStorage);
  instance.defaults.headers.common = {
    Authorization: `Bearer ${userStorage.token}`
  };
}

export default instance;
