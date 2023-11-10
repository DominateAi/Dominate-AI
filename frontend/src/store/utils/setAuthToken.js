import axios from "axios";

const setAuthToken = (id_token) => {
  // console.log("set auth called", id_token);
  if (id_token) {
    //apply to every request
    axios.defaults.headers.common = { Authorization: `Bearer ${id_token}` };
  } else {
    //Delete auth header
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
