import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './PortfolioChart.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PortfolioChart = ({ portfolioData }) => {
  const chartRef = useRef(null);

  // Detect theme changes and update chart
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          // Theme changed, update chart if it exists
          if (chartRef.current) {
            chartRef.current.update();
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Generate chart data based on actual portfolio data
  const generateChartData = (data) => {
    if (!data || !data.summary || !data.investments) {
      // Return empty chart if no data
      return {
        labels: ['No Data'],
        values: [0],
        currentValue: 0,
        totalReturn: 0
      };
    }

    // Extract values from the summary object
    const currentValue = data.summary.totalCurrentValue || 0;
    const totalInvested = data.summary.totalInvested || 0;
    const investments = data.investments || [];
    
    if (investments.length === 0) {
      return {
        labels: ['No Investments'],
        values: [0],
        currentValue: 0,
        totalReturn: 0
      };
    }

    // Sort investments by purchase date
    const sortedInvestments = investments
      .filter(inv => inv.purchaseDate) // Only include investments with purchase dates
      .sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate));

    if (sortedInvestments.length === 0) {
      return {
        labels: ['No Purchase Dates'],
        values: [0],
        currentValue: 0,
        totalReturn: 0
      };
    }

    // Create chart data based on actual purchase dates
    const labels = [];
    const values = [];
    
    // Add starting point (before first investment)
    if (sortedInvestments.length > 0) {
      const firstDate = new Date(sortedInvestments[0].purchaseDate);
      const beforeFirstDate = new Date(firstDate);
      beforeFirstDate.setDate(beforeFirstDate.getDate() - 7); // 1 week before first investment
      
      labels.push(beforeFirstDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      values.push(0); // Start with $0
    }

    // Add each investment purchase date
    let cumulativeValue = 0;
    sortedInvestments.forEach(investment => {
      const purchaseDate = new Date(investment.purchaseDate);
      cumulativeValue += investment.totalInvested || 0;
      
      labels.push(purchaseDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      values.push(cumulativeValue);
    });

    // Add current date with current total value
    const today = new Date();
    labels.push(today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    values.push(currentValue);

    const totalReturn = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0;

    return {
      labels,
      values,
      currentValue,
      totalReturn
    };
  };

  const chartData = generateChartData(portfolioData);
  const { labels, values, currentValue, totalReturn } = chartData;

  // Add console.log for debugging
  console.log('PortfolioChart - portfolioData:', portfolioData);
  console.log('PortfolioChart - chartData:', chartData);

  // Ensure we have valid data for the chart
  const validLabels = labels && labels.length > 0 ? labels : ['No Data'];
  const validValues = values && values.length > 0 ? values : [0];

  const data = {
    labels: validLabels,
    datasets: [
      {
        label: 'Portfolio Value',
        data: validValues,
        borderColor: 'var(--color-primary)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'var(--color-primary)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#111827',
        bodyColor: '#111827',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        displayColors: false,
        cornerRadius: 8,
        padding: 12,
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toLocaleString()}`;
          }
        },
        // Fix for tooltip disappearing
        mode: 'index',
        intersect: false,
        animation: {
          duration: 200
        },
        // Additional fixes for tooltip stability
        enabled: true,
        position: 'nearest',
        backgroundColor: function(context) {
          // Use explicit colors instead of CSS variables
          // Check if dark mode is active
          const isDarkMode = document.documentElement.classList.contains('dark-mode');
          return isDarkMode ? '#2C2C3A' : '#ffffff';
        },
        titleColor: function(context) {
          const isDarkMode = document.documentElement.classList.contains('dark-mode');
          return isDarkMode ? '#F1F1F1' : '#111827';
        },
        bodyColor: function(context) {
          const isDarkMode = document.documentElement.classList.contains('dark-mode');
          return isDarkMode ? '#F1F1F1' : '#111827';
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'var(--border-color)',
          borderColor: 'var(--border-color)',
        },
        ticks: {
          color: 'var(--text-secondary)',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: 'var(--border-color)',
          borderColor: 'var(--border-color)',
        },
        ticks: {
          color: 'var(--text-secondary)',
          font: {
            size: 12
          },
          callback: function(value) {
            return '$' + (value / 1000) + 'K';
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    // Fix for tooltip stability
    hover: {
      mode: 'index',
      intersect: false
    },
    // Additional configuration for better tooltip behavior
    elements: {
      point: {
        hoverRadius: 8,
        radius: 6
      }
    }
  };

  return (
    <div className="portfolio-chart">
      <div className="chart-header">
        <h3>Portfolio Performance (12 Months)</h3>
        <div className="chart-stats">
          <div className="stat">
            <span className="stat-label">Current Value</span>
            <span className="stat-value">${currentValue.toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Return</span>
            <span className={`stat-value ${totalReturn >= 0 ? 'positive' : 'negative'}`}>
              {totalReturn.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
      <div className="chart-container">
        {validValues.length > 1 ? (
          <Line data={data} options={options} ref={chartRef} />
        ) : (
          <div className="no-chart-data">
            <p>No portfolio data available</p>
            <p>Add some investments to see your performance chart</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioChart;
