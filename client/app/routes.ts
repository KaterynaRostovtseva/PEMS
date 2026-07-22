import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),

  // Группа маршрутов, защищенная проверкой на OWNER
  layout("components/OwnerRoute/OwnerRoute.tsx", [
    route("admin/team", "routes/admin/team.tsx"),
  ]),
] satisfies RouteConfig;