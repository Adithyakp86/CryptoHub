import React, { useEffect, useState, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
} from '../../utils/technicalIndicators';
import './AdvancedChart.css';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const AdvancedChart = ({ historicaldata, isDark = false }) => {
  const [chartData, setChartData] = useState(null);
  const [indicators, setIndicators] = useState({
    sma20: true,
    sma50: false,
    ema12: false,
    bollingerBands: false,
    rsi: true,
    macd: true,
  });
  const [macdOptions, setMacdOptions] = useState({ showMACD: true, showSignal: true, showHistogram: true });

  const prices = useMemo(() => historicaldata?.prices?.map((p) => p[1]) || [], [historicaldata]);
  const labels = useMemo(
    () =>
      historicaldata?.prices?.map((p) => {
        const date = new Date(p[0]);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }) || [],
    [historicaldata]
  );

  useEffect(() => {
    if (!prices || prices.length === 0) return;

    try {
      const datasets = [];

      // Price line
      datasets.push({
        label: 'Price',
        data: prices,
        borderColor: '#00d9ff',
        backgroundColor: 'rgba(0, 217, 255, 0.05)',
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        tension: 0.1,
        yAxisID: 'y',
        fill: false,
      });

      // SMA 20
      if (indicators.sma20) {
        const sma20Values = calculateSMA(prices, 20);
        datasets.push({
          label: 'SMA 20',
          data: sma20Values,
          borderColor: '#fbbf24',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.1,
          yAxisID: 'y',
          fill: false,
          borderDash: [5, 5],
        });
      }

      // SMA 50
      if (indicators.sma50) {
        const sma50Values = calculateSMA(prices, 50);
        datasets.push({
          label: 'SMA 50',
          data: sma50Values,
          borderColor: '#f97316',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.1,
          yAxisID: 'y',
          fill: false,
          borderDash: [5, 5],
        });
      }

      // EMA 12
      if (indicators.ema12) {
        const ema12Values = calculateEMA(prices, 12);
        datasets.push({
          label: 'EMA 12',
          data: ema12Values,
          borderColor: '#a78bfa',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.1,
          yAxisID: 'y',
          fill: false,
          borderDash: [10, 5],
        });
      }

      // Bollinger Bands
      if (indicators.bollingerBands) {
        const { upper, lower } = calculateBollingerBands(prices, 20, 2);

        // Upper band
        datasets.push({
          label: 'BB Upper',
          data: upper,
          borderColor: 'rgba(239, 68, 68, 0.5)',
          borderWidth: 1,
          pointRadius: 0,
          tension: 0.1,
          yAxisID: 'y',
          fill: false,
          borderDash: [3, 3],
          spanGaps: true,
        });

        // Lower band
        datasets.push({
          label: 'BB Lower',
          data: lower,
          borderColor: 'rgba(239, 68, 68, 0.5)',
          borderWidth: 1,
          pointRadius: 0,
          tension: 0.1,
          yAxisID: 'y',
          fill: '-1',
          fillValue: 0,
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          borderDash: [3, 3],
          spanGaps: true,
        });
      }

      // RSI
      if (indicators.rsi) {
        const rsiValues = calculateRSI(prices, 14);
        datasets.push({
          label: 'RSI (14)',
          data: rsiValues,
          borderColor: '#ec4899',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.1,
          yAxisID: 'y1',
          fill: false,
        });
      }

      // MACD
      if (indicators.macd) {
        const { macd, signal, histogram } = calculateMACD(prices);

        if (macdOptions.showHistogram) {
          const histogramColors = histogram.map((val) => {
            if (isNaN(val)) return 'rgba(0, 0, 0, 0)';
            return val > 0 ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)';
          });

          datasets.push({
            label: 'MACD Histogram',
            data: histogram,
            borderColor: 'transparent',
            backgroundColor: histogramColors,
            borderWidth: 0,
            fill: true,
            fillValue: 0,
            yAxisID: 'y2',
            pointRadius: 0,
            pointBackgroundColor: 'transparent',
            tension: 0.1,
            spanGaps: true,
          });
        }

        if (macdOptions.showMACD) {
          datasets.push({
            label: 'MACD',
            data: macd,
            borderColor: '#06b6d4',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.1,
            yAxisID: 'y2',
            fill: false,
          });
        }

        if (macdOptions.showSignal) {
          datasets.push({
            label: 'MACD Signal',
            data: signal,
            borderColor: '#ef4444',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.1,
            yAxisID: 'y2',
            fill: false,
            borderDash: [5, 5],
          });
        }
      }

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              borderRadius: 4,
              padding: 15,
              color: isDark ? '#e5e7eb' : '#374151',
              font: { size: 11, weight: '500' },
            },
          },
          tooltip: {
            backgroundColor: isDark ? 'rgba(15, 15, 25, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            titleColor: isDark ? '#e5e7eb' : '#1f2937',
            bodyColor: isDark ? '#d1d5db' : '#4b5563',
            borderColor: '#00d9ff',
            borderWidth: 1,
            titleFont: { weight: 'bold' },
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y.toFixed(2);
                }
                return label;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              drawBorder: false,
            },
            ticks: {
              color: isDark ? '#9ca3af' : '#6b7280',
              maxTicksLimit: 10,
              font: { size: 10 },
            },
          },
          y: {
            type: 'linear',
            position: 'left',
            grid: {
              color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              drawBorder: false,
            },
            ticks: {
              color: isDark ? '#9ca3af' : '#6b7280',
              font: { size: 10 },
              callback: function (value) {
                return value.toFixed(0);
              },
            },
            title: {
              display: true,
              text: 'Price',
              color: isDark ? '#d1d5db' : '#374151',
            },
          },
          y1: {
            type: 'linear',
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              color: '#ec4899',
              font: { size: 10 },
              min: 0,
              max: 100,
            },
            title: {
              display: indicators.rsi,
              text: 'RSI',
              color: '#ec4899',
            },
          },
          y2: {
            type: 'linear',
            position: 'right',
            offset: true,
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              color: '#06b6d4',
              font: { size: 10 },
            },
            title: {
              display: indicators.macd,
              text: 'MACD',
              color: '#06b6d4',
            },
          },
        },
      };

      setChartData({
        labels,
        datasets,
        options,
      });
    } catch (error) {
      console.error('Error calculating indicators:', error);
      toast.error('Error calculating indicators');
    }
  }, [prices, labels, indicators, macdOptions, isDark]);

  const toggleIndicator = (key) => {
    setIndicators((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleMACDOption = (key) => {
    setMacdOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!chartData) {
    return <div className="advanced-chart-loading">Loading chart...</div>;
  }

  return (
    <div className="advanced-chart-container">
      {/* Indicator Controls */}
      <div className={`indicator-controls ${isDark ? 'dark' : 'light'}`}>
        <div className="control-section">
          <div className="control-title">Overlays</div>
          <div className="control-items">
            <label className="control-item">
              <input
                type="checkbox"
                checked={indicators.sma20}
                onChange={() => toggleIndicator('sma20')}
              />
              <span>SMA 20</span>
            </label>
            <label className="control-item">
              <input
                type="checkbox"
                checked={indicators.sma50}
                onChange={() => toggleIndicator('sma50')}
              />
              <span>SMA 50</span>
            </label>
            <label className="control-item">
              <input
                type="checkbox"
                checked={indicators.ema12}
                onChange={() => toggleIndicator('ema12')}
              />
              <span>EMA 12</span>
            </label>
            <label className="control-item">
              <input
                type="checkbox"
                checked={indicators.bollingerBands}
                onChange={() => toggleIndicator('bollingerBands')}
              />
              <span>Bollinger Bands</span>
            </label>
          </div>
        </div>

        <div className="control-section">
          <div className="control-title">Indicators</div>
          <div className="control-items">
            <label className="control-item">
              <input
                type="checkbox"
                checked={indicators.rsi}
                onChange={() => toggleIndicator('rsi')}
              />
              <span>RSI (14)</span>
            </label>
            <label className="control-item">
              <input
                type="checkbox"
                checked={indicators.macd}
                onChange={() => toggleIndicator('macd')}
              />
              <span>MACD</span>
            </label>
          </div>
        </div>

        {indicators.macd && (
          <div className="control-section">
            <div className="control-title">MACD Options</div>
            <div className="control-items">
              <label className="control-item">
                <input
                  type="checkbox"
                  checked={macdOptions.showMACD}
                  onChange={() => toggleMACDOption('showMACD')}
                />
                <span>MACD Line</span>
              </label>
              <label className="control-item">
                <input
                  type="checkbox"
                  checked={macdOptions.showSignal}
                  onChange={() => toggleMACDOption('showSignal')}
                />
                <span>Signal Line</span>
              </label>
              <label className="control-item">
                <input
                  type="checkbox"
                  checked={macdOptions.showHistogram}
                  onChange={() => toggleMACDOption('showHistogram')}
                />
                <span>Histogram</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="chart-wrapper" style={{ height: '400px', position: 'relative' }}>
        <Line data={chartData} options={chartData.options} />
      </div>

      {/* Info Panel */}
      <div className={`chart-info-panel ${isDark ? 'dark' : 'light'}`}>
        <div className="info-item">
          <span className="info-label">📊 SMA:</span>
          <span className="info-text">Simple Moving Average - Calculates average price over a period</span>
        </div>
        <div className="info-item">
          <span className="info-label">📈 EMA:</span>
          <span className="info-text">Exponential Moving Average - Weights recent prices more heavily</span>
        </div>
        <div className="info-item">
          <span className="info-label">📉 RSI:</span>
          <span className="info-text">Relative Strength Index - Measures overbought/oversold conditions (0-100)</span>
        </div>
        <div className="info-item">
          <span className="info-label">🔄 MACD:</span>
          <span className="info-text">Moving Average Convergence Divergence - Trend following momentum indicator</span>
        </div>
        <div className="info-item">
          <span className="info-label">📦 Bollinger Bands:</span>
          <span className="info-text">Standard deviation bands around SMA - Indicates volatility</span>
        </div>
      </div>
    </div>
  );
};

export default AdvancedChart;
