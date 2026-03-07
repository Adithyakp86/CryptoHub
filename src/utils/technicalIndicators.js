/**
 * Technical Indicators Calculation Library
 * Provides functions to calculate various technical indicators for cryptocurrency analysis
 */

/**
 * Calculate Simple Moving Average (SMA)
 * @param {number[]} prices - Array of prices
 * @param {number} period - Number of periods for the moving average
 * @returns {number[]} Array of SMA values (NaN for insufficient data)
 */
export const calculateSMA = (prices, period) => {
  if (!prices || prices.length < period) return [];

  const sma = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      sma.push(NaN);
    } else {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
  }
  return sma;
};

/**
 * Calculate Exponential Moving Average (EMA)
 * @param {number[]} prices - Array of prices
 * @param {number} period - Number of periods for the moving average
 * @returns {number[]} Array of EMA values
 */
export const calculateEMA = (prices, period) => {
  if (!prices || prices.length < period) return [];

  const ema = [];
  const multiplier = 2 / (period + 1);

  // First EMA is SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += prices[i];
  }
  ema.push(sum / period);

  // Subsequent EMAs
  for (let i = period; i < prices.length; i++) {
    const newEMA = (prices[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1];
    ema.push(newEMA);
  }

  // Pad with NaN for index alignment
  return Array(period - 1).fill(NaN).concat(ema);
};

/**
 * Calculate Bollinger Bands
 * @param {number[]} prices - Array of prices
 * @param {number} period - Period for the bands (usually 20)
 * @param {number} stdDevMultiplier - Standard deviation multiplier (usually 2)
 * @returns {{sma: number[], upper: number[], lower: number[]}}
 */
export const calculateBollingerBands = (prices, period = 20, stdDevMultiplier = 2) => {
  if (!prices || prices.length < period) return { sma: [], upper: [], lower: [] };

  const sma = calculateSMA(prices, period);
  const upper = [];
  const lower = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      upper.push(NaN);
      lower.push(NaN);
    } else {
      const slice = prices.slice(i - period + 1, i + 1);
      const mean = sma[i];

      // Calculate standard deviation
      const variance = slice.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / period;
      const stdDev = Math.sqrt(variance);

      upper.push(mean + stdDevMultiplier * stdDev);
      lower.push(mean - stdDevMultiplier * stdDev);
    }
  }

  return { sma, upper, lower };
};

/**
 * Calculate Relative Strength Index (RSI)
 * @param {number[]} prices - Array of prices
 * @param {number} period - Period for RSI (usually 14)
 * @returns {number[]} Array of RSI values
 */
export const calculateRSI = (prices, period = 14) => {
  if (!prices || prices.length < period + 1) return [];

  const rsi = [];
  const changes = [];

  // Calculate price changes
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  // Calculate gains and losses
  let avgGain = 0;
  let avgLoss = 0;

  for (let i = 0; i < period; i++) {
    const change = changes[i];
    if (change > 0) avgGain += change;
    else avgLoss += Math.abs(change);
  }

  avgGain /= period;
  avgLoss /= period;

  // First RSI
  let rs = avgGain / (avgLoss || 1);
  rsi.push(100 - 100 / (1 + rs));

  // Calculate RSI for remaining periods using smoothed averages
  for (let i = period; i < changes.length; i++) {
    const change = changes[i];
    if (change > 0) {
      avgGain = (avgGain * (period - 1) + change) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) + Math.abs(change)) / period;
    }

    rs = avgGain / (avgLoss || 1);
    rsi.push(100 - 100 / (1 + rs));
  }

  // Pad with NaN for index alignment
  return Array(period).fill(NaN).concat(rsi);
};

/**
 * Calculate MACD (Moving Average Convergence Divergence)
 * @param {number[]} prices - Array of prices
 * @returns {{macd: number[], signal: number[], histogram: number[]}}
 */
export const calculateMACD = (prices) => {
  if (!prices || prices.length < 26) {
    return { macd: [], signal: [], histogram: [] };
  }

  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);

  // Calculate MACD line
  const macd = [];
  for (let i = 0; i < prices.length; i++) {
    if (!isNaN(ema12[i]) && !isNaN(ema26[i])) {
      macd.push(ema12[i] - ema26[i]);
    } else {
      macd.push(NaN);
    }
  }

  // Calculate Signal line (9-period EMA of MACD)
  let signalStartIndex = -1;
  const validMACD = [];
  for (let i = 0; i < macd.length; i++) {
    if (!isNaN(macd[i])) {
      if (signalStartIndex === -1) signalStartIndex = i;
      validMACD.push(macd[i]);
    }
  }

  const signal = Array(signalStartIndex).fill(NaN);
  const emaSignal = calculateEMA(validMACD, 9);
  signal.push(...emaSignal);

  // Ensure same length
  while (signal.length < prices.length) {
    signal.push(NaN);
  }

  // Calculate Histogram
  const histogram = [];
  for (let i = 0; i < prices.length; i++) {
    if (!isNaN(macd[i]) && !isNaN(signal[i])) {
      histogram.push(macd[i] - signal[i]);
    } else {
      histogram.push(NaN);
    }
  }

  return { macd, signal, histogram };
};

/**
 * Format indicator data for Chart.js dataset
 * @param {number[]} values - Indicator values
 * @param {{label: string, color: string, borderColor?: string, backgroundColor?: string}} config - Styling config
 * @param {number[]} prices - Original prices (for matching lengths)
 * @returns {object} Chart.js dataset configuration
 */
export const createIndicatorDataset = (values, config, prices) => {
  // Ensure array length matches prices
  const paddedValues = new Array(prices.length).fill(null);
  const startIndex = prices.length - values.length;
  for (let i = 0; i < values.length; i++) {
    paddedValues[startIndex + i] = values[i];
  }

  return {
    ...config,
    data: paddedValues,
    fill: false,
    tension: 0.1,
    pointRadius: 0,
    pointHoverRadius: 4,
    borderWidth: 2,
    yAxisID: config.yAxisID || 'y',
  };
};
