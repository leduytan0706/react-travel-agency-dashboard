import { reactRouter } from "@react-router/dev/vite";
import { sentryReactRouter, type SentryReactRouterBuildOptions } from "@sentry/react-router";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import dotenv from 'dotenv';

dotenv.config();

const sentryConfig: SentryReactRouterBuildOptions = {
  org: "tran-nhan-phat",
  project: "react-travelpal",
  // An auth token is required for uploading source maps.
  authToken: process.env.VITE_SENTRY_AUTH_TOKEN
  // ...
};

export default defineConfig(config => {
  return {
    plugins: [tailwindcss(), tsconfigPaths(), reactRouter(), sentryReactRouter(sentryConfig, config)],
    sentryConfig,
    ssr: {
      noExternal: [/@syncfusion/]
    },
    
  };
});
