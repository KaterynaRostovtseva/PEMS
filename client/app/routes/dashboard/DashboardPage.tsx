/** Кабінет: за роллю показує один із трьох дашбордів. Адреса /dashboard. */
import OwnerDashboard from "~/components/dashboard/OwnerDashboard";
import ManagerDashboard from "~/components/dashboard/ManagerDashboard";
import EmployeeDashboard from "~/components/dashboard/EmployeeDashboard";
import { useAppSelector } from "~/store/hooks";
import { selectAuth } from "~/store/authSlice";

export default function DashboardPage() {
  const { user } = useAppSelector(selectAuth);

  if (user?.role === "OWNER") {
    return <OwnerDashboard />;
  }

  if (user?.role === "MANAGER") {
    return <ManagerDashboard />;
  }

  return <EmployeeDashboard />;
}
