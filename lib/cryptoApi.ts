// Crypto API Service
// Uses CoinGecko API (free, open-source)
// Docs: https://www.coingecko.com/en/api

export interface CoinInfo {
  id: string;
  symbol: string;
  name: string;
  color: string;
}

export interface CoinPrice {
  id: string;
  usd: number;
  usd_24h_change: number;
  usd_24h_vol: number;
  usd_market_cap: number;
}

export interface SparklineData {
  price: number;
  timestamp: number;
}

// Default tracked coins - includes all required cryptos
export const TRACKED_COINS: CoinInfo[] = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", color: "#F7931A" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", color: "#627EEA" },
  { id: "solana", symbol: "SOL", name: "Solana", color: "#00FFA3" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", color: "#C2A633" },
  { id: "pepe", symbol: "PEPE", name: "Pepe", color: "#4CAF50" },
  { id: "bonk", symbol: "BONK", name: "Bonk", color: "#FF6B35" },
  { id: "ripple", symbol: "XRP", name: "XRP", color: "#23292F" },
  { id: "binancecoin", symbol: "BNB", name: "BNB", color: "#F3BA2F" },
  { id: "sui", symbol: "SUI", name: "Sui", color: "#6FB3F8" },
  { id: "mpox", symbol: "POX", name: "POX", color: "#9B59B6" },
  { id: "fantom", symbol: "FT", name: "Fantom", color: "#1969FF" },
];

// API Configuration
const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";
const API_TIMEOUT = 5000; // 5 seconds

// Fetch simple price data
export async function fetchSimplePrices(
  coinIds: string[],
): Promise<Record<string, CoinPrice>> {
  const ids = coinIds.join(",");
  const url = `${COINGECKO_BASE_URL}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Transform to our format
    const result: Record<string, CoinPrice> = {};
    for (const [id, priceData] of Object.entries(data)) {
      const pd = priceData as Record<string, number>;
      result[id] = {
        id,
        usd: pd.usd || 0,
        usd_24h_change: pd.usd_24h_change || 0,
        usd_24h_vol: pd.usd_24h_vol || 0,
        usd_market_cap: pd.usd_market_cap || 0,
      };
    }

    return result;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout");
    }
    throw error;
  }
}

// Generate sparkline from price data (mock for now - real implementation would fetch historical data)
export function generateSparkline(
  basePrice: number,
  change24h: number,
  points: number = 24,
): number[] {
  const data: number[] = [];
  let current = basePrice * (1 - Math.abs(change24h) / 100);

  for (let i = 0; i < points; i++) {
    const variance = (Math.random() - 0.5) * basePrice * 0.02;
    current += variance + (basePrice * Math.abs(change24h)) / 100 / points;
    data.push(current);
  }

  return data;
}

// Format price for display
export function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  }
  if (price >= 1) {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  });
}

// Format large numbers
export function formatMarketCap(value: number): string {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  }
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  return formatPrice(value);
}

// Get all crypto data with prices
export interface CryptoData {
  coin: CoinInfo;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  sparkline: number[];
}

export async function fetchCryptoData(
  coins: CoinInfo[] = TRACKED_COINS,
): Promise<CryptoData[]> {
  const coinIds = coins.map((c) => c.id);
  const prices = await fetchSimplePrices(coinIds);

  return coins.map((coin) => {
    const priceData = prices[coin.id];
    const price = priceData?.usd || 0;
    const change24h = priceData?.usd_24h_change || 0;

    return {
      coin,
      price,
      change24h,
      marketCap: priceData?.usd_market_cap || 0,
      volume24h: priceData?.usd_24h_vol || 0,
      sparkline: generateSparkline(price, change24h),
    };
  });
}

// Fallback mock data
export function getMockCryptoData(
  coins: CoinInfo[] = TRACKED_COINS,
): CryptoData[] {
  return coins.map((coin) => ({
    coin,
    price: Math.random() * 1000 + 100,
    change24h: (Math.random() - 0.5) * 10,
    marketCap: Math.random() * 1e12,
    volume24h: Math.random() * 1e10,
    sparkline: generateSparkline(
      Math.random() * 1000 + 100,
      (Math.random() - 0.5) * 10,
    ),
  }));
}
