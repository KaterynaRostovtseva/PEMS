import { useState } from "react";
import { useLoginMutation } from "~/store/apiSlice";
import { useNavigate } from "react-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Отправляем запрос на бэкенд
      const result = await login({ email, password }).unwrap();
      
      // Если бэкенд возвращает токен, сохраняем его
      if (result.token) {
        localStorage.setItem("token", result.token);
      }
      
      // Перенаправляем на главную или дашборд
      navigate("/");
    } catch (err) {
      console.error("Failed to login:", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="p-8 bg-gray-800 rounded-xl shadow-lg w-96 space-y-4">
        <h1 className="text-2xl font-bold text-center mb-6">Вход в систему PEMS</h1>
        
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500 text-red-200 rounded text-sm">
            Ошибка авторизации. Проверьте данные.
          </div>
        )}

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition disabled:opacity-50"
        >
          {isLoading ? "Вход..." : "Войти"}
        </button>
      </form>
    </div>
  );
}