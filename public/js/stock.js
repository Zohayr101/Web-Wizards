// Alpha Vantage API key (stored here; secure on backend for production)
/**
 * Alpha Vantage API key (stored here; secure on backend for production).
 * @constant {string}
 */
const apiKey = "3NZ62AYDCROUWX3Q";

// Mapping ticker symbols to logo URLs via Clearbit Logo API
/**
 * Mapping ticker symbols to logo URLs via Clearbit Logo API.
 * @constant {Object.<string, string>}
 */
const logos = {
  AAPL: "https://logo.clearbit.com/apple.com",
  MSFT: "https://logo.clearbit.com/microsoft.com",
  AMZN: "https://logo.clearbit.com/amazon.com",
  GOOGL: "https://logo.clearbit.com/google.com",
  TSLA: "https://logo.clearbit.com/tesla.com",
  META: "https://logo.clearbit.com/meta.com",
  NVDA: "https://logo.clearbit.com/nvidia.com",
  JPM: "https://logo.clearbit.com/jpmorganchase.com",
  JNJ: "https://logo.clearbit.com/jnj.com",
  V: "https://logo.clearbit.com/visa.com",
  PG: "https://logo.clearbit.com/pg.com",
  UNH: "https://logo.clearbit.com/unitedhealthgroup.com",
  HD: "https://logo.clearbit.com/homedepot.com",
  VZ: "https://logo.clearbit.com/verizon.com",
  DIS: "https://logo.clearbit.com/disney.com",
  MA: "https://logo.clearbit.com/mastercard.com",
  NFLX: "https://logo.clearbit.com/netflix.com",
  KO: "https://logo.clearbit.com/coca-cola.com",
  PFE: "https://logo.clearbit.com/pfizer.com",
  MRK: "https://logo.clearbit.com/merck.com",
  INTC: "https://logo.clearbit.com/intel.com",
  CSCO: "https://logo.clearbit.com/cisco.com",
  T: "https://logo.clearbit.com/att.com",
  XOM: "https://logo.clearbit.com/exxonmobil.com",
  BA: "https://logo.clearbit.com/boeing.com",
  CRM: "https://logo.clearbit.com/salesforce.com",
  ORCL: "https://logo.clearbit.com/oracle.com",
  IBM: "https://logo.clearbit.com/ibm.com",
  MCD: "https://logo.clearbit.com/mcdonalds.com",
  WMT: "https://logo.clearbit.com/walmart.com",
  CVX: "https://logo.clearbit.com/chevron.com",
  ABT: "https://logo.clearbit.com/abbott.com",
  COST: "https://logo.clearbit.com/costco.com",
  NKE: "https://logo.clearbit.com/nike.com",
  DOW: "https://logo.clearbit.com/dow.com",
  QCOM: "https://logo.clearbit.com/qualcomm.com",
  ADP: "https://logo.clearbit.com/adp.com",
  MDT: "https://logo.clearbit.com/medtronic.com",
  SBUX: "https://logo.clearbit.com/starbucks.com",
  GS: "https://logo.clearbit.com/goldmansachs.com",
  AMGN: "https://logo.clearbit.com/amgen.com",
  LLY: "https://logo.clearbit.com/lilly.com",
  HON: "https://logo.clearbit.com/honeywell.com",
  CAT: "https://logo.clearbit.com/caterpillar.com",
  GE: "https://logo.clearbit.com/ge.com",
  UPS: "https://logo.clearbit.com/ups.com",
  RTX: "https://logo.clearbit.com/raytheon.com",
  BLK: "https://logo.clearbit.com/blackrock.com",
  SPY: "https://logo.clearbit.com/ssga.com",
  VOO: "https://logo.clearbit.com/vanguard.com"
};

/**
 * DOM element for the stock selection dropdown.
 * @constant {HTMLElement}
 */
const stockSelect = document.getElementById("stock-select");

/**
 * DOM element for the time range selection dropdown.
 * @constant {HTMLElement}
 */
const timeRangeSelect = document.getElementById("time-range-select");

/**
 * DOM element for the chart load button.
 * @constant {HTMLElement}
 */
const loadChartButton = document.getElementById("load-chart");

/**
 * DOM canvas element where the stock chart is rendered.
 * @constant {HTMLElement}
 */
const chartCanvas = document.getElementById("stock-chart");

/**
 * DOM element for the loading spinner indicator.
 * @constant {HTMLElement}
 */
const spinner = document.getElementById("spinner");

/**
 * Global Chart.js instance used to render the stock chart.
 * @type {Chart}
 */
let stockChart; // Global Chart.js instance

// Helper function to format dates from YYYY-MM-DD to MM-DD-YYYY
/**
 * Format a date string from 'YYYY-MM-DD' to 'MM-DD-YYYY'.
 *
 * @param {string} dateStr - Date string in the format 'YYYY-MM-DD'.
 * @returns {string} Formatted date string in the format 'MM-DD-YYYY'.
 */
function formatDate(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return `${month}-${day}-${year}`;
}

// Fetch daily time series data
/**
 * Fetch the daily time series data for a given stock symbol from the Alpha Vantage API.
 *
 * @async
 * @param {string} symbol - Stock ticker symbol.
 * @returns {Promise<Object|null>} Promise resolving to daily time series data or null if unavailable.
 */
async function fetchStockTimeSeries(symbol) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data["Time Series (Daily)"]) {
      return data["Time Series (Daily)"];
    } else {
      throw new Error("Data not available or API limit reached");
    }
  } catch (error) {
    console.error("Error fetching time series data:", error);
    alert("Error fetching data: " + error.message);
    return null;
  }
}

// Fetch stock overview data
/**
 * Fetch the stock overview data for a given stock symbol from the Alpha Vantage API.
 *
 * @async
 * @param {string} symbol - Stock ticker symbol.
 * @returns {Promise<Object|null>} Promise resolving to the stock overview data or null if unavailable.
 */
async function fetchStockOverview(symbol) {
  const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && Object.keys(data).length > 0 && !data["Note"]) {
      incrementStocksChecked();
      return data;
    } else {
      console.error("Overview data not available or API limit reached");
      return null;
    }
  } catch (error) {
    console.error("Error fetching stock overview:", error);
    return null;
  }
}

async function incrementStocksChecked() {
  let response = await fetch("/api.stats");
  stats = await response.json();
  if (stats.length === 0) {
    // No stats found, initialize them
    console.log("No stats found. Initializing...");
    const initResponse = await fetch("/api/stats/initialize", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (initResponse.ok) {
        stats = await initResponse.json();
        console.log("Stats initialized:", stats);
    } else {
        console.error("Failed to initialize stats:", initResponse.statusText);
        return;
    }
} else {
    stats = stats[0]; // Assuming stats is an array, take the first entry
}
let id = await stats.id;

stats.stocksChecked++;

const updateResponse = await fetch(`/api/stats/${id}`, {
    method: "PUT",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(stats)
});
if (!updateResponse.ok) {
    console.error(updateResponse.statusText);
}
}

// Update key details section
/**
 * Update the key details section with the stock's data, including price, volume, and overview metrics.
 *
 * @async
 * @param {string} symbol - Stock ticker symbol.
 * @param {string} latestDate - The latest date from the time series data.
 * @param {Object} latestData - Daily time series data corresponding to the latest date.
 * @param {number} avgVolume - Average trading volume over the selected period.
 * @returns {Promise<void>}
 */
async function updateKeyDetails(symbol, latestDate, latestData, avgVolume) {
  const overviewData = await fetchStockOverview(symbol);
  let html = `<table>
    <tr><th colspan="2">Key Details for ${symbol} (${formatDate(latestDate)})</th></tr>`;
  
  html += `<tr><td>Open</td><td>$${parseFloat(latestData["1. open"]).toFixed(2)}</td></tr>`;
  html += `<tr><td>Day Range</td><td>$${parseFloat(latestData["3. low"]).toFixed(2)} - $${parseFloat(latestData["2. high"]).toFixed(2)}</td></tr>`;
  
  if (overviewData) {
    if (overviewData["52WeekHigh"] && overviewData["52WeekLow"]) {
      html += `<tr><td>52 Week Range</td><td>$${parseFloat(overviewData["52WeekLow"]).toFixed(2)} - $${parseFloat(overviewData["52WeekHigh"]).toFixed(2)}</td></tr>`;
    }
    if (overviewData["MarketCapitalization"]) {
      html += `<tr><td>Market Cap</td><td>$${overviewData["MarketCapitalization"]}</td></tr>`;
    }
    if (overviewData["SharesOutstanding"]) {
      html += `<tr><td>Shares Outstanding</td><td>${overviewData["SharesOutstanding"]}</td></tr>`;
    }
    if (overviewData["PERatio"]) {
      html += `<tr><td>P/E Ratio</td><td>${overviewData["PERatio"]}</td></tr>`;
    }
    if (overviewData["EPS"]) {
      html += `<tr><td>EPS</td><td>$${overviewData["EPS"]}</td></tr>`;
    }
    if (overviewData["DividendPerShare"]) {
      html += `<tr><td>Dividend</td><td>$${overviewData["DividendPerShare"]}</td></tr>`;
    }
    if (overviewData["DividendYield"]) {
      html += `<tr><td>Dividend Yield</td><td>${(parseFloat(overviewData["DividendYield"]) * 100).toFixed(2)}%</td></tr>`;
    }
    if (overviewData["ExDividendDate"]) {
      html += `<tr><td>Ex-Dividend Date</td><td>${overviewData["ExDividendDate"]}</td></tr>`;
    }
  }
  
  html += `<tr><td>Average Volume (30 days)</td><td>${Math.round(avgVolume)}</td></tr>`;
  html += `</table>`;
  
  const logoUrl = logos[symbol] || "";
  let logoHtml = "";
  if (logoUrl) {
    logoHtml = `<img src="${logoUrl}" alt="${symbol} Logo" class="company-logo">`;
  }
  
  document.getElementById("key-details-section").innerHTML = `<h2>Key Details</h2>` + logoHtml + html;
}

// Update chart with selected stock and time range
/**
 * Update the stock chart and key details section based on the selected stock symbol.
 *
 * @async
 * @param {string} symbol - Stock ticker symbol.
 * @returns {Promise<void>}
 */
async function updateChart(symbol) {
  spinner.style.display = 'block';
  
  const timeSeries = await fetchStockTimeSeries(symbol);
  if (!timeSeries) {
    spinner.style.display = 'none';
    return;
  }
  
  const numDays = parseInt(timeRangeSelect.value);
  const dates = Object.keys(timeSeries).sort();
  const recentDates = dates.slice(-numDays);
  const prices = recentDates.map(date => parseFloat(timeSeries[date]["4. close"]));
  const volumes = recentDates.map(date => parseInt(timeSeries[date]["5. volume"]));
  const avgVolume = volumes.reduce((acc, vol) => acc + vol, 0) / volumes.length;
  const latestDate = recentDates[recentDates.length - 1];
  const latestData = timeSeries[latestDate];
  
  const chartData = {
    labels: recentDates,
    datasets: [{
      label: `${symbol} Closing Prices`,
      data: prices,
      fill: false,
      borderColor: '#4c6ef5',
      tension: 0.1
    }]
  };
  
  const config = {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      scales: {
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        }
      },
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: `${symbol} Stock Price (${timeRangeSelect.options[timeRangeSelect.selectedIndex].text})`
        }
      }
    }
  };
  
  if (stockChart) {
    stockChart.destroy();
  }
  
  stockChart = new Chart(chartCanvas, config);
  
  updateKeyDetails(symbol, latestDate, latestData, avgVolume);
  
  spinner.style.display = 'none';
}

loadChartButton.addEventListener("click", () => {
  updateChart(stockSelect.value);
});

document.addEventListener("DOMContentLoaded", () => {
  updateChart(stockSelect.value);
});
