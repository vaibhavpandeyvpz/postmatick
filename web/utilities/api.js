import axios from "axios";

export async function logOut() {
  return axios.post("/logout").then(({ data }) => data);
}

export async function news(q) {
  return axios.get("/news", { params: { q } }).then(({ data }) => data);
}

export async function post(text, media, visibility = "PUBLIC") {
  return axios.post("/post", { text, media, visibility });
}

export async function profile() {
  return axios.get("/me").then(({ data }) => data);
}

export async function status() {
  return axios.get("/status").then(({ data }) => data);
}

export async function upload() {
  return axios.post("/upload");
}

export async function write(url, imageUrl) {
  return axios
    .post("/write", { url, image_url: imageUrl })
    .then(({ data }) => data);
}
