-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  kyc_status VARCHAR(50) DEFAULT 'pending', -- pending, verified, rejected
  kyc_data JSONB,
  two_fa_enabled BOOLEAN DEFAULT FALSE,
  two_fa_secret VARCHAR(255),
  api_key VARCHAR(255) UNIQUE,
  api_secret_hash VARCHAR(255),
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 钱包表
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  address VARCHAR(255) NOT NULL,
  chain_id INTEGER NOT NULL, -- 1=Ethereum, 56=BSC, 195=Tron
  chain_name VARCHAR(50) NOT NULL,
  private_key_encrypted VARCHAR(255), -- 加密存储
  is_active BOOLEAN DEFAULT TRUE,
  balance DECIMAL(40, 18) DEFAULT 0,
  locked_balance DECIMAL(40, 18) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, address, chain_id)
);

-- 交易对表
CREATE TABLE trading_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol VARCHAR(20) UNIQUE NOT NULL, -- BTC/USDT
  base_asset VARCHAR(10) NOT NULL, -- BTC
  quote_asset VARCHAR(10) NOT NULL, -- USDT
  base_contract VARCHAR(255), -- 代币合约地址
  quote_contract VARCHAR(255),
  min_order_amount DECIMAL(40, 18),
  max_order_amount DECIMAL(40, 18),
  price_precision INTEGER DEFAULT 8,
  quantity_precision INTEGER DEFAULT 8,
  taker_fee DECIMAL(10, 6), -- 0.001 = 0.1%
  maker_fee DECIMAL(10, 6),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 订单表
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trading_pair_id UUID NOT NULL REFERENCES trading_pairs(id),
  order_type VARCHAR(10) NOT NULL, -- buy, sell
  price DECIMAL(40, 18) NOT NULL,
  quantity DECIMAL(40, 18) NOT NULL,
  filled_quantity DECIMAL(40, 18) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'open', -- open, partially_filled, filled, cancelled
  time_in_force VARCHAR(10) DEFAULT 'GTC', -- GTC, IOC, FOK
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

-- 交易表
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES users(id),
  seller_id UUID NOT NULL REFERENCES users(id),
  trading_pair_id UUID NOT NULL REFERENCES trading_pairs(id),
  price DECIMAL(40, 18) NOT NULL,
  quantity DECIMAL(40, 18) NOT NULL,
  buyer_fee DECIMAL(40, 18),
  seller_fee DECIMAL(40, 18),
  transaction_hash VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, failed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP
);

-- 充提记录表
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wallet_id UUID NOT NULL REFERENCES wallets(id),
  type VARCHAR(10) NOT NULL, -- deposit, withdraw
  amount DECIMAL(40, 18) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  transaction_hash VARCHAR(255),
  from_address VARCHAR(255),
  to_address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_wallets_address ON wallets(address);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_trades_buyer_id ON trades(buyer_id);
CREATE INDEX idx_trades_seller_id ON trades(seller_id);
CREATE INDEX idx_trades_created_at ON trades(created_at);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
