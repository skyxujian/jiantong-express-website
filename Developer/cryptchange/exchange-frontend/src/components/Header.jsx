import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">CryptoEx</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-blue-600">首页</Link>
          <Link to="/trading/BTCUSDT" className="hover:text-blue-600">交易</Link>
          <Link to="/wallet" className="hover:text-blue-600">钱包</Link>
          <Link to="/login" className="btn-primary">登录</Link>
        </div>
      </nav>
    </header>
  )
}
