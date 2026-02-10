import React from 'react'

export default function Register() {
  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: 实现注册逻辑
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">注册</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="用户名" className="input" required />
          <input type="email" placeholder="邮箱" className="input" required />
          <input type="password" placeholder="密码" className="input" required />
          <input type="password" placeholder="确认密码" className="input" required />
          <button type="submit" className="btn-primary w-full">注册</button>
        </form>
      </div>
    </div>
  )
}
