import React from 'react'

export default function Wallet() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">钱包管理</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">账户余额</h2>
          <p className="text-3xl font-bold text-blue-600">0.00 USDT</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-bold mb-4">操作</h2>
          <div className="space-y-2">
            <button className="btn-primary w-full">充值</button>
            <button className="btn-secondary w-full">提现</button>
          </div>
        </div>
      </div>
    </div>
  )
}
