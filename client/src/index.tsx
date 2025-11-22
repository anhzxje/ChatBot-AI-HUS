import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./components/App";
import { store } from "./store";
import ThemeContextProvider from "./ThemeContext";

console.log("NODE_ENV", process.env.NODE_ENV);

// === 1. NẠP CSS TOÁN HỌC (KaTeX) ===
// Giúp hiển thị công thức toán đẹp, không bị vỡ
const katexStyle = document.createElement("link");
katexStyle.rel = "stylesheet";
katexStyle.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
document.head.appendChild(katexStyle);

// === 2. NẠP CSS TOÀN CỤC (Fix lỗi 2 thanh trượt) ===
// Giúp thanh trượt nằm sát mép phải và không bị cuộn trang chính
const globalStyle = document.createElement("style");
globalStyle.innerHTML = `
  html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden; /* QUAN TRỌNG: Khóa cuộn trang chính */
  }
`;
document.head.appendChild(globalStyle);

const queryClient = new QueryClient();
const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <ThemeContextProvider> 
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </ThemeContextProvider>
);