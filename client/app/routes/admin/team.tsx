import React from 'react';
import { useGetUsersQuery, useUpdateUserRoleMutation } from '../../store/userApi'; 


export const TeamManagement: React.FC = () => {
  // Хуки из RTK Query
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [updateRole] = useUpdateUserRoleMutation();

  // Обработчик смены роли
  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await updateRole({ id: userId, role: newRole }).unwrap();
    } catch (err: any) {
      alert(err?.data?.error || 'Ошибка при изменении роли');
    }
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div className="text-red-500">Не удалось загрузить список пользователей</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Управление командой</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Имя</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Текущая роль</th>
            <th className="py-2 px-4 border-b">Действие (Сменить роль)</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id} className="text-center">
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b font-semibold">{user.role}</td>
              <td className="py-2 px-4 border-b">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="MANAGER">Manager</option>
                  <option value="OWNER">Owner</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default TeamManagement;
