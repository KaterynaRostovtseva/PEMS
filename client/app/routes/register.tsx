import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useRegisterMutation } from "~/store/apiSlice";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ name, email, password }).unwrap();
      navigate("/login");
    } catch (err) {
      console.error("Failed to register:", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSignup} className="p-8 bg-gray-800 rounded-xl shadow-lg w-96 space-y-4">
        <h1 className="text-2xl font-bold text-center mb-6">Регистрация в PEMS</h1>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500 text-red-200 rounded text-sm">
            Ошибка регистрации. Проверьте введенные данные.
          </div>
        )}

        <div>
          <label className="block text-sm mb-1">Имя</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

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
          {isLoading ? "Создаем аккаунт..." : "Зарегистрироваться"}
        </button>

        <p className="text-sm text-center text-gray-400 mt-4">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
}