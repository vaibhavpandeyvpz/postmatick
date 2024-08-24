import axios from "axios";

export async function logOut() {
  return axios.post("/logout").then(({ data }) => data);
}

export async function profile() {
  return axios.get("/me").then(({ data }) => data);
}

export async function status() {
  return axios.get("/status").then(({ data }) => data);
}
