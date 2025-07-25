import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Mock registration: just set user in localStorage and context
    const userId = Date.now();
    const userData = {
      id: userId,
      email,
      name: 'New User',
      avatar: 'https://i.ibb.co/rK44TsnC/logo.png',
      tier: role,
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userRole', role);

    if (role === 'Admin') {
      navigate('/admin');
    } else if (role === 'Production Partner') {
      navigate(`/partner-dashboard/${userId}`);
    } else {
      navigate(`/user-dashboard/${userId}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleRegister}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-800 p-2 rounded">
            {error}
          </p>
        )}

        <label htmlFor="reg-email" className="block text-sm text-gray-700 dark:text-gray-200">
          Email
        </label>
        <input
          id="reg-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm"
          required
        />

        <label htmlFor="reg-password" className="block text-sm text-gray-700 dark:text-gray-200">
          Password
        </label>
        <input
          id="reg-password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm"
          required
        />

        <label htmlFor="reg-role" className="block text-sm text-gray-700 dark:text-gray-200">
          Role
        </label>
        <select
          id="reg-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm"
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
          <option value="Production Partner">Production Partner</option>
        </select>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
