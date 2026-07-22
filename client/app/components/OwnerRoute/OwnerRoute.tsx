import { Navigate, Outlet } from 'react-router';

export function OwnerRoute() {
  const userRole = localStorage.getItem('userRole');

  // Если пользователь владелец — пускаем вложенные маршруты
  if (userRole === 'OWNER') {
    return <Outlet />;
  }

  // Если нет прав — перенаправляем на главную
  return <Navigate to="/dashboard" replace />;
}