import React from 'react';

const Home = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 text-xl font-bold shadow">
        My App Header
      </header>

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-gray-100 p-4 border-r border-gray-300">
          <ul className="space-y-2">
            <li className="hover:text-blue-600 cursor-pointer">Dashboard</li>
            <li className="hover:text-blue-600 cursor-pointer">Profile</li>
            <li className="hover:text-blue-600 cursor-pointer">Settings</li>
            <li className="hover:text-blue-600 cursor-pointer">Logout</li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-white">
          <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
          <p>This is your main content area.</p>
        </main>
      </div>
    </div>
  )
}

export default Home