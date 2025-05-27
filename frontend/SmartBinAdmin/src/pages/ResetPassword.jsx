import React from 'react'

const ResetPassword = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm" >
        <h2 className="text-xl font-bold mb-4 text-gray-800">Verify Password Reset OTP Codes</h2>
        <div className="mb-4">
          <label className="block text-gray-600 mb-1" htmlFor="email">
            Employee ID#:
          </label>
          <input
            id="employeeID"
            type="text"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={employeeID}
            onChange={(e) => {}}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-600 mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => {}}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200"
        >
          Login
        </button>
            <div className="mt-10 text-right">
            <Link to="/request-password-reset" className="text-sm text-blue-500 hover:underline">
                Reset my Password
            </Link>
            </div>
      </form>
        
    </div>
  )
}

export default ResetPassword