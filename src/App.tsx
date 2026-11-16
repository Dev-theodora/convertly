import { useEffect, useId, useMemo, useRef, useState } from "react"

type Currency = {
  code: string
  name: string
  country: string
  symbol: string
  usdRate: number
  decimals: number
}

const currencies: Currency[] = [
  {
    code: "USD",
    name: "US Dollar",
    country: "United States",
    symbol: "$",
    usdRate: 1,
    decimals: 2,
  },
  {
    code: "EUR",
    name: "Euro",
    country: "European Union",
    symbol: "€",
    usdRate: 0.9217,
    decimals: 2,
  },
  {
    code: "GBP",
    name: "British Pound",
    country: "United Kingdom",
    symbol: "£",
    usdRate: 0.7894,
    decimals: 2,
  },
  {
    code: "NGN",
    name: "Nigerian Naira",
    country: "Nigeria",
    symbol: "₦",
    usdRate: 1512.4,
    decimals: 2,
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    country: "Canada",
    symbol: "C$",
    usdRate: 1.3618,
    decimals: 2,
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    country: "Australia",
    symbol: "A$",
    usdRate: 1.5182,
    decimals: 2,
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    country: "Japan",
    symbol: "¥",
    usdRate: 149.62,
    decimals: 0,
  },
  {
    code: "GHS",
    name: "Ghanaian Cedi",
    country: "Ghana",
    symbol: "GH₵",
    usdRate: 15.48,
    decimals: 2,
  },
]

const chartOffsets = [-0.0042, -0.0015, -0.0022, 0.0012, 0.0038, 0.0021, 0]
const dayLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "TODAY"]

function Icon({
  name,
  size = 20,
}: {
  name: "swap" | "search" | "chevron" | "sun" | "moon" | "shield" | "trend" | "check"
  size?: number
}) {
  const paths = {
    swap: (
      <>
        <path d="M7 7h11m0 0-3-3m3 3-3 3M17 17H6m0 0 3 3m-3-3 3-3" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    chevron: <path d="m8 10 4 4 4-4" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
      </>
    ),
    moon: <path d="M20 15.4A8.4 8.4 0 0 1 8.6 4 8.5 8.5 0 1 0 20 15.4Z" />,
    shield: (
      <path d="M12 3 5 6v5c0 4.5 2.8 8.5 7 10 4.2-1.5 7-5.5 7-10V6l-7-3Z" />
    ),
    trend: (
      <>
        <path d="m4 16 5-5 4 3 7-8" />
        <path d="M15 6h5v5" />
      </>
    ),
    check: <path d="m6 12 4 4 8-8" />,
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

function Flag({ code }: { code: string }) {
  return (
    <span className={`flag flag-${code.toLowerCase()}`} aria-hidden="true">
      <i />
    </span>
  )
}

function CurrencyPicker({
  currency,
  onSelect,
  label,
}: {
  currency: Currency
  onSelect: (currency: Currency) => void
  label: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const rootRef = useRef<HTMLDivElement>(null)
  const searchId = useId()
  const filtered = currencies.filter((item) =>
    `${item.code} ${item.name} ${item.country}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", close)
    document.addEventListener("keydown", escape)
    return () => {
      document.removeEventListener("mousedown", close)
      document.removeEventListener("keydown", escape)
    }
  }, [])

  return (
    <div className="currency-picker" ref={rootRef}>
      <button
        className="currency-trigger"
        type="button"
        onClick={() => {
          setOpen((value) => !value)
          setQuery("")
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Choose ${label} currency, currently ${currency.name}`}
      >
        <Flag code={currency.code} />
        <span className="currency-trigger-copy">
          <strong>{currency.code}</strong>
          <span>{currency.name}</span>
        </span>
        <Icon name="chevron" size={18} />
      </button>

      {open && (
        <div className="currency-menu">
          <div className="menu-heading">
            <strong>Select currency</strong>
            <span>Search by country, name or code</span>
          </div>
          <label className="search-box" htmlFor={searchId}>
            <Icon name="search" size={18} />
            <input
              id={searchId}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search currencies"
              autoFocus
            />
          </label>
          <div
            className="currency-options"
            role="listbox"
            aria-label="Currencies"
          >
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={item.code === currency.code}
                  className="currency-option"
                  key={item.code}
                  onClick={() => {
                    onSelect(item)
                    setOpen(false)
                  }}
                >
                  <Flag code={item.code} />
                  <span className="option-main">
                    <strong>{item.code}</strong>
                    <span>{item.name}</span>
                  </span>
                  <span className="option-country">{item.country}</span>
                  {item.code === currency.code && (
                    <span className="selected-check">
                      <Icon name="check" size={16} />
                    </span>
                  )}
                </button>
              ))
            ) : (
              <p className="no-results">No currencies found</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function formatNumber(value: number, decimals = 2) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number.isFinite(value) ? value : 0)
}

function RateChart({
  rate,
  from,
  to,
}: {
  rate: number
  from: Currency
  to: Currency
}) {
  const width = 700
  const height = 170
  const points = chartOffsets.map((offset, index) => ({
    x: (index / (chartOffsets.length - 1)) * width,
    value: rate * (1 + offset),
  }))
  const values = points.map((point) => point.value)
  const min = Math.min(...values) * 0.999
  const max = Math.max(...values) * 1.001
  const plotted = points.map((point) => ({
    ...point,
    y: height - ((point.value - min) / (max - min)) * (height - 24) - 12,
  }))
  const line = plotted
    .map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`)
    .join(" ")
  const area = `${line} L ${width} ${height} L 0 ${height} Z`
  const id = `chart-${from.code}-${to.code}`
  const high = Math.max(...values)
  const low = Math.min(...values)
  const change = (values[values.length - 1] / values[0] - 1) * 100

  return (
    <section className="chart-card" aria-labelledby="trend-title">
      <div className="chart-header">
        <div>
          <div className="eyebrow-row">
            <Icon name="trend" size={17} />
            <span>7-DAY TREND</span>
          </div>
          <h2 id="trend-title">
            {from.code} to {to.code}
          </h2>
        </div>
        <div className="trend-badge">+{Math.abs(change).toFixed(2)}%</div>
      </div>
      <div className="chart-stats">
        <div>
          <span>Current</span>
          <strong>{rate.toFixed(rate > 100 ? 2 : 4)}</strong>
        </div>
        <div>
          <span>7-day high</span>
          <strong>{high.toFixed(rate > 100 ? 2 : 4)}</strong>
        </div>
        <div>
          <span>7-day low</span>
          <strong>{low.toFixed(rate > 100 ? 2 : 4)}</strong>
        </div>
      </div>
      <div className="chart-wrap">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={`Seven day demonstration exchange rate chart for ${from.code} to ${to.code}`}
        >
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2864ff" stopOpacity=".22" />
              <stop offset="100%" stopColor="#2864ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className="chart-grid" d="M0 40H700M0 90H700M0 140H700" />
          <path d={area} fill={`url(#${id})`} />
          <path className="chart-line" d={line} />
          {plotted.map((point, index) => (
            <circle
              key={index}
              className={
                index === plotted.length - 1
                  ? "chart-point active"
                  : "chart-point"
              }
              cx={point.x}
              cy={point.y}
              r={index === plotted.length - 1 ? 5 : 3}
            />
          ))}
        </svg>
        <div className="chart-labels">
          {dayLabels.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </div>
      <p className="demo-note">
        <span>DEMO</span> Historical values are illustrative and not intended
        for trading.
      </p>
    </section>
  )
}

export default function App() {
  const [from, setFrom] = useState(currencies[0])
  const [to, setTo] = useState(currencies[1])
  const [amount, setAmount] = useState("1,000")
  const [dark, setDark] = useState(
    () => localStorage.getItem("convertly-theme") === "dark",
  )

  const numericAmount = Number(amount.replace(/,/g, "")) || 0
  const rate = to.usdRate / from.usdRate
  const converted = numericAmount * rate

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light"
    localStorage.setItem("convertly-theme", dark ? "dark" : "light")
  }, [dark])

  const convertedText = useMemo(
    () => formatNumber(converted, to.decimals),
    [converted, to.decimals],
  )

  const updateAmount = (value: string) => {
    const cleaned = value.replace(/[^\d.]/g, "")
    const [whole = "", ...rest] = cleaned.split(".")
    const decimal = rest.length ? `.${rest.join("").slice(0, 2)}` : ""
    const formattedWhole = whole ? Number(whole).toLocaleString("en-US") : ""
    setAmount(`${formattedWhole}${decimal}`)
  }

  const addAmount = (addition: number) => {
    setAmount(formatNumber(numericAmount + addition, 0))
  }

  const swap = () => {
    setFrom(to)
    setTo(from)
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#" aria-label="Convertly home">
          <span className="brand-mark">
            <span>C</span>
          </span>
          <span>Convertly</span>
        </a>
        <div className="header-actions">
          <div className="rate-status" title="Rates are demonstration data">
            <span className="status-dot" />
            <span>Demo rates</span>
            <span className="status-time">Updated 2 min ago</span>
          </div>
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setDark((value) => !value)}
            aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
          >
            <span className={!dark ? "active" : ""}>
              <Icon name="sun" size={17} />
            </span>
            <span className={dark ? "active" : ""}>
              <Icon name="moon" size={16} />
            </span>
          </button>
        </div>
      </header>

      <main>
        <div className="intro">
          <span className="intro-kicker">SIMPLE. FAST. TRANSPARENT.</span>
          <h1>
            Convert currencies <em>instantly.</em>
          </h1>
          <p>Clear exchange rates for wherever life takes you.</p>
        </div>

        <div className="content-grid">
          <section className="converter-card" aria-label="Currency converter">
            <div className="demo-banner">
              <span>DEMONSTRATION DATA</span>
              <p>Sample rates for preview purposes — not live market rates.</p>
            </div>

            <div className="field-block">
              <label htmlFor="from-amount">YOU SEND</label>
              <div className="amount-row">
                <div className="amount-input-wrap">
                  <span className="amount-symbol">{from.symbol}</span>
                  <input
                    id="from-amount"
                    inputMode="decimal"
                    value={amount}
                    onChange={(event) => updateAmount(event.target.value)}
                    aria-label={`Amount in ${from.name}`}
                  />
                </div>
                <CurrencyPicker
                  currency={from}
                  onSelect={setFrom}
                  label="source"
                />
              </div>
            </div>

            <div className="swap-divider">
              <span />
              <button
                type="button"
                onClick={swap}
                aria-label={`Swap ${from.code} and ${to.code}`}
              >
                <Icon name="swap" size={21} />
              </button>
              <span />
            </div>

            <div className="field-block">
              <label htmlFor="to-amount">THEY RECEIVE</label>
              <div className="amount-row">
                <div className="amount-input-wrap output">
                  <span className="amount-symbol">{to.symbol}</span>
                  <input
                    id="to-amount"
                    value={convertedText}
                    readOnly
                    aria-label={`Converted amount in ${to.name}`}
                  />
                </div>
                <CurrencyPicker
                  currency={to}
                  onSelect={setTo}
                  label="destination"
                />
              </div>
            </div>

            <div className="quick-row">
              <span>Quick add</span>
              <div>
                {[10, 50, 100, 500].map((value) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => addAmount(value)}
                  >
                    +{value}
                  </button>
                ))}
              </div>
            </div>

            <div className="rate-panel">
              <div className="rate-main">
                <span>DEMONSTRATION RATE</span>
                <strong>
                  1 {from.code} = {rate.toFixed(rate > 100 ? 2 : 4)} {to.code}
                </strong>
                <small>{`1 ${to.code} = ${(1 / rate).toFixed(4)} ${from.code}`}</small>
              </div>
              <div className="rate-meta">
                <span>
                  <Icon name="shield" size={18} /> Mid-market reference
                </span>
                <span>Last updated 2 min ago</span>
              </div>
            </div>
          </section>

          <RateChart rate={rate} from={from} to={to} />
        </div>

        <div className="trust-row">
          <div>
            <span className="trust-icon">
              <Icon name="shield" size={19} />
            </span>
            <p>
              <strong>No hidden fees</strong>
              <span>See exactly what you get</span>
            </p>
          </div>
          <div>
            <span className="trust-icon">
              <Icon name="trend" size={19} />
            </span>
            <p>
              <strong>Mid-market rates</strong>
              <span>Fair reference pricing</span>
            </p>
          </div>
          <div>
            <span className="trust-icon">
              <Icon name="check" size={19} />
            </span>
            <p>
              <strong>8 currencies</strong>
              <span>More coming soon</span>
            </p>
          </div>
        </div>
      </main>

      <footer>
        <span>© 2025 Convertly</span>
        <span>For informational purposes only</span>
      </footer>
    </div>
  )
}
