/** Карта адрес: який URL відкриває який файл. Самі сторінки лежать у routes/. */
import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/HomePage.tsx"),

  layout("components/GuestRoute.tsx", [
    route("login", "routes/LoginPage.tsx"),
    route("forgot-password", "routes/ForgotPasswordPage.tsx"),
    route("register", "routes/RegisterPage.tsx"),
    route("reset-password", "routes/ResetPasswordPage.tsx"),
    route("accept-invite", "routes/AcceptInvitePage.tsx"),
  ]),

  layout("components/ProtectedRoute.tsx", [
    layout("components/AppShell.tsx", [
      route("dashboard", "routes/DashboardPage.tsx"),
      route("profile", "routes/ProfilePage.tsx"),
      layout("components/OwnerManagerRoute.tsx", [
        route("admin/team", "routes/admin/TeamPage.tsx"),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
