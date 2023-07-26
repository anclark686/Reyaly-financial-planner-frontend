import { createAuth0 } from "@auth0/auth0-vue";
import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/main.css";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

const app = createApp(App);
const pinia = createPinia();

app.use(
  createAuth0({
    domain: domain,
    clientId: clientId,
    authorizationParams: {
      redirect_uri: "http://localhost:5173/dashboard",
      // redirect_uri: "https://main.d1r7v6lmapahca.amplifyapp.com/dashboard",
    },
  })
);

app.use(router);
app.use(pinia);
app.use(createPinia);

app.mount("#app");
