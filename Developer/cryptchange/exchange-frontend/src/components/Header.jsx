import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function Header() {
  const navigate = useNavigate()
  const { user, token, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          CryptoEx 🚀
        </Link>

        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-blue-600 transition">
            首页
          </Link>
          <Link to="/trading/BTCUSDT" className="hover:text-blue-600 transition">
            交易
          </Link>
          <Link to="/wallet" className="hover:text-blue-600 transition">
            钱包
          </Link>

          {token && user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">👤 {user.username}</span>
              <button
                onClick={handleLogout}
                className="btn-secondary px-4 py-2"
              >
                登出
              </button>
            </div>
          ) : (
            <div className="space-x-2">
              <Link to="/login" className="btn-secondary px-4 py-2">
                登录
              </Link>
              <Link to="/register" className="btn-primary px-4 py-2">
                注册
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
