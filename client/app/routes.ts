/** Карта адрес: який URL відкриває який файл. Сторінки розкладені по папках у routes/. */
import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/home/HomePage.tsx"),

  layout("components/guard/GuestRoute.tsx", [
    route("login", "routes/auth/LoginPage.tsx"),
    route("forgot-password", "routes/auth/ForgotPasswordPage.tsx"),
    route("register", "routes/auth/RegisterPage.tsx"),
    route("reset-password", "routes/auth/ResetPasswordPage.tsx"),
    route("accept-invite", "routes/auth/AcceptInvitePage.tsx"),
  ]),

  layout("components/guard/ProtectedRoute.tsx", [
    layout("components/shell/AppShell.tsx", [
      route("dashboard", "routes/dashboard/DashboardPage.tsx"),
      route("projects", "routes/projects/ProjectListPage.tsx"),
      route("projects/:projectId", "routes/projects/ProjectCardPage.tsx"),
      route("profile", "routes/profile/ProfilePage.tsx"),
      layout("components/guard/OwnerManagerRoute.tsx", [
        route("admin/team", "routes/admin/TeamPage.tsx"),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
