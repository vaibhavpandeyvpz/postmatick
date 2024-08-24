const path = require("path");
const viteReact = require("@vitejs/plugin-react");

module.exports = {
  root: path.join(__dirname, "web"),
  plugins: [viteReact({ jsxRuntime: "classic" })],
};
