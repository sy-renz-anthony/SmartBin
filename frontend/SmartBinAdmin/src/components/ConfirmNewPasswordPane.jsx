import { useState, useEffect } from "react"

const ConfirmNewPasswordPane = ({submitNewPasswordFunction}) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    
  return (
    <>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Input your New Password</h2>
        <div className="mb-4">
          <label className="block text-gray-600 mb-1" htmlFor="email">
            New Password:
          </label>
          <input
            id="newPassword"
            type="password"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newPassword}
            onChange={(e) => {setNewPassword(e.target.value)}}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-600 mb-1" htmlFor="password">
            Confirm New Password:
          </label>
          <input
            id="confirmNewPassword"
            type="password"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={confirmNewPassword}
            onChange={(e) => {setConfirmNewPassword(e.target.value)}}
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 active:bg-blue-900 transition duration-200" onClick={(e)=>submitNewPasswordFunction(newPassword, confirmNewPassword, e)}>
          Reset Password
        </button>
      </>
  )
}

export default ConfirmNewPasswordPane