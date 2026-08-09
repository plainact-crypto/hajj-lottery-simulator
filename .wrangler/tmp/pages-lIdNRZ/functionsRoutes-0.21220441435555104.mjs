import { onRequestPost as __api_attempt_ts_onRequestPost } from "C:\\mohamed osama\\ALL DESKTOP\\PR\\NEW\\hajj-simulator-updated-project\\functions\\api\\attempt.ts"

export const routes = [
    {
      routePath: "/api/attempt",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_attempt_ts_onRequestPost],
    },
  ]