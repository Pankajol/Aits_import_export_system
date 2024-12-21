// new code 14-12-2024
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiUser, FiBriefcase, FiEye, FiEyeOff, FiTruck, FiUsers } from 'react-icons/fi';
import axios from 'axios';

export default function SignIn() {
  const [role, setRole] = useState('Admin'); // State to track selected role
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [isLoading, setIsLoading] = useState(false); // State to manage loading indicator

  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'email' && !validateEmail(value)) {
      setErrors({ ...errors, email: 'Please enter a valid email address' });
    } else if (name === 'password' && value === '') {
      setErrors({ ...errors, password: 'Password cannot be empty' });
    } else {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setFormData({ email: '', password: '' });
    setErrors({ email: '', password: '', general: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrors({
        email: !formData.email ? 'Email is required' : '',
        password: !formData.password ? 'Password is required' : '',
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrors({ ...errors, email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/signin', {
        email: formData.email,
        password: formData.password,
        role,
      });

      const { token } = response.data;
      document.cookie = `token=${token}; path=/; HttpOnly; Secure`;
      localStorage.setItem('token', token);

      const dashboardRedirects = {
        Admin: '/admin',
        Customer: '/customer-dashboard',
        Agent: '/agent-dashboard',
        Supplier: '/supplier-dashboard',
      };

      window.location.href = dashboardRedirects[role] || '/';
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message);
      setErrors({ ...errors, general: 'Invalid credentials' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">SignIn As {role}</h2>

        {/* Role Selector */}
        <div className="mb-6 flex justify-center space-x-4">
          {[
            { name: 'Admin', icon: <FiUser size={18} /> },
            { name: 'Customer', icon: <FiBriefcase size={18} /> },
            { name: 'Agent', icon: <FiUsers size={18} /> },
            { name: 'Supplier', icon: <FiTruck size={18} /> },
          ].map(({ name, icon }) => (
            <button
              key={name}
              type="button"
              className={`relative space-x-2 py-2 px-4 rounded-lg ${
                role === name ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
              onClick={() => handleRoleChange(name)}
            >
              {icon}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-600"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>

          {errors.general && <p className="text-red-500 text-center">{errors.general}</p>}
                     {/* Forgot Password */}
          <Link href="/forgetpassword">
            <div className="flex justify-between items-center">
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
                onClick={() => console.log('Forgot Password?')}
              >
                Forgot Password?
              </button>
            </div>
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-md ${isLoading ? 'bg-gray-400' : 'bg-blue-600'} text-white`}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
          {/* Create Account for Customers */}
        {role !== 'Admin' && (
          <div className="mt-4 text-center">
            <p className="text-sm">
              Don't have an account?{' '}
              <Link href="/signup">
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => console.log('Navigate to Create Account')}
                >
                  Create Account
                </button>
              </Link>
            </p>
          </div>
        )}
        </form>
      </div>
    </div>
  );
}


// 'use client';

// import Link from 'next/link';
// import { useState } from 'react';
// import { FiUser, FiBriefcase, FiEye, FiEyeOff, FiTruck, FiUsers } from 'react-icons/fi';
// import axios from 'axios';

// export default function SignIn() {
//   const [role, setRole] = useState('Admin'); // State to track selected role
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [errors, setErrors] = useState({
//     email: '',
//     password: '',
//   });
//   const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

//   const validateEmail = (email) => {
//     const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     return emailPattern.test(email);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     if (name === 'email' && !validateEmail(value)) {
//       setErrors({ ...errors, email: 'Please enter a valid email address' });
//     } else if (name === 'password' && value === '') {
//       setErrors({ ...errors, password: 'Password cannot be empty' });
//     } else {
//       setErrors({ ...errors, [name]: '' });
//     }
//   };

//   const handleRoleChange = (newRole) => {
//     setRole(newRole);
//     setFormData({
//       email: '',
//       password: '',
//     });
//     setErrors({
//       email: '',
//       password: '',
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     if (!formData.email || !formData.password) {
//       setErrors({
//         email: !formData.email ? 'Email is required' : '',
//         password: !formData.password ? 'Password is required' : '',
//       });
//       return;
//     }
  
//     if (!validateEmail(formData.email)) {
//       setErrors({ ...errors, email: 'Please enter a valid email address' });
//       return;
//     }
  
//     console.log('Submitting login form:', { ...formData, role });
  
//     try {
//       const response = await axios.post('/api/signin', {
//         email: formData.email,
//         password: formData.password,
//         role,
//       });
  
//       const { token } = response.data;
//       document.cookie = `token=${token}; path=/; HttpOnly; Secure`;
//       localStorage.setItem('token', token);
//       window.location.href = '/admin'; // Redirect on success
//     } catch (error) {
//       console.error('Login Error:', error.response?.data || error.message);
//       setErrors({ ...errors, general: 'Invalid credentials' });
//     }
//   };
  
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
//         <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

//         {/* Role Selector */}
//         <div className="mb-6 flex justify-center space-x-4">
//           {[
//             { name: 'Admin', icon: <FiUser size={18} /> },
//             { name: 'Customer', icon: <FiBriefcase size={18} /> },
//             { name: 'Agent', icon: <FiUsers size={18} /> },
//             { name: 'Supplier', icon: <FiTruck size={18} /> },
//           ].map(({ name, icon }) => (
//             <button
//               key={name}
//               type="button"
//               className={` relative space-x-2 py-2 px-4 rounded-lg ${
//                 role === name ? 'bg-blue-600 text-white' : 'bg-gray-200'
//               }`}
//               onClick={() => handleRoleChange(name)}
//             >
//               {icon}
//               {/* <span>{name}</span> */}
//             </button>
//           ))}
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Email Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700" htmlFor="email">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
//           </div>

//           {/* Password Field */}
//           <div className="relative">
//             <label className="block text-sm font-medium text-gray-700" htmlFor="password">
//               Password
//             </label>
//             <input
//               type={showPassword ? 'text' : 'password'} // Toggle between password and text input
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
//               className="absolute right-3 top-9 text-gray-600"
//             >
//               {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
//             </button>
//             {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
//           </div>

          // {/* Forgot Password */}
          // <Link href="/forgetpassword">
          //   <div className="flex justify-between items-center">
          //     <button
          //       type="button"
          //       className="text-sm text-blue-600 hover:underline"
          //       onClick={() => console.log('Forgot Password?')}
          //     >
          //       Forgot Password?
          //     </button>
          //   </div>
          // </Link>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             Sign In
//           </button>
//         </form>

        // {/* Create Account for Customers */}
        // {role !== 'Admin' && (
        //   <div className="mt-4 text-center">
        //     <p className="text-sm">
        //       Don't have an account?{' '}
        //       <Link href="/signup">
        //         <button
        //           type="button"
        //           className="text-blue-600 hover:underline"
        //           onClick={() => console.log('Navigate to Create Account')}
        //         >
        //           Create Account
        //         </button>
        //       </Link>
        //     </p>
        //   </div>
        // )}
//       </div>
//     </div>
//   );
// }

// 'use client';

// import Link from 'next/link';
// import { useState } from 'react';
// import { FiUser, FiBriefcase, FiEye, FiEyeOff, FiTruck, FiUsers } from 'react-icons/fi';
// import axios from 'axios';

// export default function SignIn() {
//   const [role, setRole] = useState('User');
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [errors, setErrors] = useState({ email: '', password: '', general: '' });
//   const [showPassword, setShowPassword] = useState(false);

//   const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     if (name === 'email' && !validateEmail(value)) {
//       setErrors({ ...errors, email: 'Please enter a valid email address' });
//     } else if (name === 'password' && value.trim() === '') {
//       setErrors({ ...errors, password: 'Password cannot be empty' });
//     } else {
//       setErrors({ ...errors, [name]: '' });
//     }
//   };

//   const handleRoleChange = (newRole) => {
//     setRole(newRole);
//     setFormData({ email: '', password: '' });
//     setErrors({ email: '', password: '', general: '' });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.email || !formData.password) {
//       setErrors({
//         email: !formData.email ? 'Email is required' : '',
//         password: !formData.password ? 'Password is required' : '',
//       });
//       return;
//     }

//     if (!validateEmail(formData.email)) {
//       setErrors({ ...errors, email: 'Please enter a valid email address' });
//       return;
//     }

//     try {
//       const response = await axios.post('/api/signin', {
//         email: formData.email,
//         password: formData.password,
//         role,
//       });
//       const { token } = response.data;
//       localStorage.setItem('token', token);
//       window.location.href = role === 'User' ?  '/admin' :'/dashboard';
//     } catch (error) {
//       setErrors({ ...errors, general: error.response?.data?.message || 'Invalid credentials' });
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
//         <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

//         {/* Role Selector */}
//         <div className="mb-6 flex justify-center space-x-4">
//           {[
//             { name: 'User', icon: <FiUser size={18} /> },
//             { name: 'Customer', icon: <FiBriefcase size={18} /> },
//             { name: 'Agent', icon: <FiUsers size={18} /> },
//             { name: 'Supplier', icon: <FiTruck size={18} /> },
//           ].map(({ name, icon }) => (
//             <button
//               key={name}
//               aria-label={`Select ${name} role`}
//               type="button"
//               className={`relative space-x-2 py-2 px-4 rounded-lg ${
//                 role === name ? 'bg-blue-600 text-white' : 'bg-gray-200'
//               }`}
//               onClick={() => handleRoleChange(name)}
//             >
//               {icon}
//             </button>
//           ))}
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Email Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700" htmlFor="email">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
//           </div>

//           {/* Password Field */}
//           <div className="relative">
//             <label className="block text-sm font-medium text-gray-700" htmlFor="password">
//               Password
//             </label>
//             <input
//               type={showPassword ? 'text' : 'password'}
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-9 text-gray-600"
//               aria-label="Toggle Password Visibility"
//             >
//               {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
//             </button>
//             {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
//           </div>

//           {/* General Error */}
//           {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             Sign In
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
