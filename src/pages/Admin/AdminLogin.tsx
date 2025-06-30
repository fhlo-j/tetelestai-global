import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from '@/hooks/use-toast'

const Login = () => {
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === '@tetelestaiAdminMain') {
      localStorage.setItem('adminAuth', 'true')
      navigate('/admin')
    } else {
      toast({
        title: 'Validation Error',
        description: 'Incorrect password. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://res.cloudinary.com/dhgtx9k3d/image/upload/v1745539782/tetelestai_logo_1_vybw1t.jpg"
            alt="Logo"
            className="h-16 w-16 object-contain"
          />
        </div>

        {/* Message */}
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          Admin Panel Login
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Please enter the admin password to access the dashboard.
        </p>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
