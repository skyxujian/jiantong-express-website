import React from 'react'

export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">加密货币交易所</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">交易对</h2>
          <p>BTC/USDT, ETH/USDT, BNB/USDT...</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-bold mb-4">24小时成交</h2>
          <p>$0.00</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-bold mb-4">活跃用户</h2>
          <p>0</p>
        </div>
      </div>
    </div>
  )
}
