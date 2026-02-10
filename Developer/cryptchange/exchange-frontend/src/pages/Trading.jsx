import React from 'react'

export default function Trading({ pair }) {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">{pair || 'BTC/USDT'} 交易</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">交易图表</h2>
            <p className="text-gray-500">交易图表 - TODO</p>
          </div>
        </div>
        <div>
          <div className="card">
            <h2 className="text-xl font-bold mb-4">下单</h2>
            <form className="space-y-4">
              <input type="number" placeholder="价格" className="input" />
              <input type="number" placeholder="数量" className="input" />
              <button type="submit" className="btn-primary w-full">买入</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
