import axios from "axios";

export async function download(id) {
  return axios.get(`/images/${id}`).then(({ data }) => data);
}

export async function draw(contentType, content, prompt) {
  return axios
    .post("/draw", { contentType, content, prompt })
    .then(({ data }) => data);
}

export async function idea(contentType, content) {
  return axios.post("/idea", { contentType, content }).then(({ data }) => data);
}

export async function images(q) {
  return axios.get("/images", { params: { q } }).then(({ data }) => data);
}

export async function logOut() {
  return axios.post("/logout").then(({ data }) => data);
}

export async function post(contentType, title, content, image) {
  return axios.post("/post", { contentType, title, content, image });
}

export async function profile() {
  return axios.get("/me").then(({ data }) => data);
}

export async function status() {
  return axios.get("/status").then(({ data }) => data);
}

export async function search(provider, q) {
  return axios
    .get("/search", { params: { provider, q } })
    .then(({ data }) => data);
}

export async function write(url, prompt) {
  return axios.post("/write", { url, prompt }).then(({ data }) => data);
}
