import React, { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({ username: '', password: '', confirm: '', regno: '' });
  const [errors, setErrors] = useState<{ username?: string; password?: string; confirm?: string; regno?: string }>({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);
  

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.confirm.trim()) newErrors.confirm = 'Please confirm your password';
    if (formData.password !== formData.confirm) newErrors.confirm = 'Passwords do not match';
    if (!formData.regno.trim()) newErrors.regno = 'Registration number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage({ type: '', text: '' }); }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-4 text-gray-900">Register</h1>

          {message.text && (
            <div className={`mb-4 p-3 rounded text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>{message.text}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
            </div>

            <div>
              <label htmlFor="regno" className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
              <input
                type="text"
                id="regno"
                name="regno"
                value={formData.regno}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  errors.regno ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.regno && <p className="mt-1 text-sm text-red-600">{errors.regno}</p>}
            </div>
      
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>            

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                id="confirm"
                name="confirm"
                value={formData.confirm}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  errors.confirm ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.confirm && <p className="mt-1 text-sm text-red-600">{errors.confirm}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded text-white font-medium ${
                isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;