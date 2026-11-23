 import { useEffect, useId, useMemo, useRef, useState } from "react"

type Currency = {
  code: string
  name: string
  country?: string
  symbol: string
  decimals: number
}

  type ApiCurrency = {
  iso_code: string
  name: string
  symbol: string | null
  start_date: string | null
  end_date: string | null
}


type ApiRate = {
  date: string
  base: string
  quote: string
  rate: number
}

const API_URL = "https://api.frankfurter.dev/v2"


async function fetchCurrencies(): Promise<Currency[]> {
  const response = await fetch(`${API_URL}/currencies`)

  if (!response.ok) {
    throw new Error("Failed to fetch currencies")
  }

  const data: ApiCurrency[] = await response.json()
   console.log("Currencies received:", data.length)
console.log("Currency data:", data)
  return data.map((item) => ({
    code: item.iso_code,
    name: item.name,
    country: "",
    symbol: item.symbol || item.iso_code,
    decimals: 2,
  }))
}

async function fetchRate(from: string, to: string): Promise<number> {
  const response = await fetch(
    `${API_URL}/rates?base=${from}&quotes=${to}`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch exchange rate")
  }

  const data: ApiRate[] = await response.json()

  if (!data.length) {
    throw new Error("Exchange rate not available")
  }

  return data[0].rate
}

async function fetchRateHistory(
  from: string,
  to: string,
): Promise<ApiRate[]> {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - 7)

  const formatDate = (date: Date) =>
    date.toISOString().slice(0, 10)

  const response = await fetch(
    `${API_URL}/rates?base=${from}&quotes=${to}&from=${formatDate(start)}&to=${formatDate(end)}`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch historical rates")
  }

  return response.json()
}
const currencies: Currency[] = [
  {
    code: "USD",
    name: "US Dollar",
    country: "United States",
    symbol: "$",
    decimals: 2,
  },
  {
    code: "EUR",
    name: "Euro",
    country: "European Union",
    symbol: "€",
    decimals: 2,
  },
  {
    code: "GBP",
    name: "British Pound",
    country: "United Kingdom",
    symbol: "£",
    decimals: 2,
  },
  {
    code: "NGN",
    name: "Nigerian Naira",
    country: "Nigeria",
    symbol: "₦",
    decimals: 2,
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    country: "Canada",
    symbol: "C$",
    decimals: 2,
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    country: "Australia",
    symbol: "A$",
    decimals: 2,
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    country: "Japan",
    symbol: "¥",
    decimals: 0,
  },
  {
    code: "GHS",
    name: "Ghanaian Cedi",
    country: "Ghana",
    symbol: "GH₵",
    decimals: 2,
  },
]


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
 const cryptoIcons = import.meta.glob(
  "../node_modules/cryptocurrency-icons/svg/color/*.svg",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
) as Record<string, string>

function Flag({ code }: { code: string }) {
  const [imageError, setImageError] = useState(false)

  const normalizedCode = code.toLowerCase()

  const cryptoIcon = Object.entries(cryptoIcons).find(
    ([path]) => path.toLowerCase().endsWith(`/${normalizedCode}.svg`)
  )?.[1]

  if (cryptoIcon) {
    return (
      <img
        src={cryptoIcon}
        className="currency-icon"
        alt=""
      />
    )
  }

  if (imageError) {
    return (
      <span className="currency-logo-fallback">
        {code.slice(0, 2)}
      </span>
    )
  }

  return (
    <img
      src={`https://wise.com/web-art/assets/flags/${normalizedCode}.svg`}
      className="currency-icon"
      alt=""
      onError={() => setImageError(true)}
    />
  )
}
function CurrencyPicker({
  currency,
  onSelect,
  label,
  availableCurrencies,
}: {
  currency: Currency
  onSelect: (currency: Currency) => void
  label: string
  availableCurrencies: Currency[]
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const rootRef = useRef<HTMLDivElement>(null)
  const searchId = useId()
  const filtered = availableCurrencies.filter((item) =>
  `${item.code} ${item.name} ${item.country ?? ""}`
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
  history,
}: {
  rate: number
  from: Currency
  to: Currency
  history: ApiRate[]
}) {
  const width = 700
  const height = 170

  const values = history.map((item) => item.rate)
  const hasHistory = values.length > 0

  const high = hasHistory ? Math.max(...values) : 0
  const low = hasHistory ? Math.min(...values) : 0

  const change =
    values.length > 1
      ? ((values[values.length - 1] / values[0]) - 1) * 100
      : 0

  const rising = change >= 0

  const min = hasHistory ? low * 0.999 : 0
  const max = hasHistory ? high * 1.001 : 1
  const range = max - min || 1

  const points = history.map((item, index) => ({
    date: item.date,
    value: item.rate,
    x:
      history.length > 1
        ? (index / (history.length - 1)) * width
        : width / 2,
    y:
      height -
      ((item.rate - min) / range) * (height - 24) -
      12,
  }))

  const line = points
    .map((point, index) =>
      (index === 0 ? "M" : "L") + " " + point.x + " " + point.y
    )
    .join(" ")

  const area = hasHistory
    ? `${line} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`
    : ""

  const id = `chart-${from.code}-${to.code}`

  const formatDate = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })

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

        <div className={`trend-badge ${rising ? "rising" : "falling"}`}>
          {hasHistory
            ? `${rising ? "+" : ""}${change.toFixed(2)}%`
            : "—"}
        </div>
      </div>

      <div className="chart-stats">
        <div>
          <span>Current</span>
          <strong>
            {rate ? rate.toFixed(rate > 100 ? 2 : 4) : "—"}
          </strong>
        </div>
        <div>
          <span>7-day high</span>
          <strong>
            {hasHistory ? high.toFixed(rate > 100 ? 2 : 4) : "—"}
          </strong>
        </div>
        <div>
          <span>7-day low</span>
          <strong>
            {hasHistory ? low.toFixed(rate > 100 ? 2 : 4) : "—"}
          </strong>
        </div>
      </div>

      <div className="chart-wrap">
        {hasHistory ? (
          <>
            <svg
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio="none"
              role="img"
              aria-label={`Historical exchange rate chart for ${from.code} to ${to.code}`}
            >
              <defs>
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2864ff" stopOpacity=".22" />
                  <stop offset="100%" stopColor="#2864ff" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path
                className="chart-grid"
                d="M0 40H700M0 90H700M0 140H700"
              />

              <path d={area} fill={`url(#${id})`} />

              <path
                className={`chart-line ${rising ? "rising" : "falling"}`}
                d={line}
              />

              {points.map((point, index) => (
                <circle
                  key={point.date}
                  className={index === points.length - 1
                    ? "chart-point active"
                    : "chart-point"}
                  cx={point.x}
                  cy={point.y}
                  r={index === points.length - 1 ? 5 : 3}
                />
              ))}
            </svg>

            <div className="chart-labels">
              <span>{formatDate(points[0].date)}</span>
              <span>{formatDate(points[points.length - 1].date)}</span>
            </div>
          </>
        ) : (
          <p>No historical rates available for this currency pair.</p>
        )}
      </div>

      <p className="demo-note">
        Historical reference rates · Source: Frankfurter
      </p>
    </section>
  )
}

export default function App() {
  const [from, setFrom] = useState(currencies[0])
  const [to, setTo] = useState(currencies[1])
  const [rate, setRate] = useState(0)
   const [history, setHistory] = useState<ApiRate[]>([])
const [lastUpdated, setLastUpdated] = useState("")
const [rateLoading, setRateLoading] = useState(false)
const [rateError, setRateError] = useState("")
  const [availableCurrencies, setAvailableCurrencies] =
  useState<Currency[]>(currencies)
  useEffect(() => {
  fetchCurrencies()
    .then((data) => {
      setAvailableCurrencies(data)
    })
    .catch((error) => {
      console.error("Currency loading error:", error)
    })
}, []) 
   useEffect(() => {
  if (from.code === to.code) {
    setRate(1)
    setHistory([])
    setRateError("")
    setLastUpdated("")
    setRateLoading(false)
    return
  }

  let cancelled = false

  setRateLoading(true)
  setRateError("")

  Promise.all([
    fetchRate(from.code, to.code),
    fetchRateHistory(from.code, to.code),
  ])
    .then(([currentRate, historicalRates]) => {
      if (cancelled) return

      setRate(currentRate)
      setHistory(historicalRates)

      if (historicalRates.length) {
        setLastUpdated(
          historicalRates[historicalRates.length - 1].date
        )
      }
    })
    .catch((error) => {
      if (cancelled) return
      console.error("Exchange rate error:", error)
      setRateError("Unable to load exchange rate")
    })
    .finally(() => {
      if (!cancelled) setRateLoading(false)
    })

  return () => {
    cancelled = true
  }
}, [from.code, to.code])
  const [amount, setAmount] = useState("1,000")
  const [dark, setDark] = useState(
    () => localStorage.getItem("convertly-theme") === "dark",
  )

  const numericAmount = Number(amount.replace(/,/g, "")) || 0
const converted = numericAmount * rate
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light"
    localStorage.setItem("convertly-theme", dark ? "dark" : "light")
  }, [dark])

  const convertedText = useMemo(() => {
  if (rateLoading) return "Loading..."
  if (rateError) return "Unavailable"

  return formatNumber(converted, to.decimals)
}, [converted, to.decimals, rateLoading, rateError])

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
          <div className="rate-status" title="Exchange rate information">
  <span className="status-dot" />
  <span>Exchange rates</span>
  <span className="status-time">
    {lastUpdated ? `Rate date: ${lastUpdated}` : "Loading rate date..."}
  </span>
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
          <p>Know what your money is worth in any currency.</p>
        </div>

        <div className="content-grid">
          <section className="converter-card" aria-label="Currency converter">
            <div className="demo-banner">
              <span>EXCHANGE RATE</span>
              <p>Reference rates for informational purposes only. Actual exchange rates may vary.</p>
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
                availableCurrencies={availableCurrencies}
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
                   availableCurrencies={availableCurrencies}
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
                <span>EXCHANGE RATE</span>
                    <strong>
                  {rateLoading
                     ? "Loading exchange rate..."
                   : rateError
                   ? rateError
           : `1 ${from.code} = ${rate.toFixed(rate > 100 ? 2 : 4)} ${to.code}`}
                </strong>
                <small>
                {rateLoading
                ? "Fetching reverse rate..."
                   : rateError || rate === 0
                   ? "Reverse rate unavailable"
                   : `1 ${to.code} = ${(1 / rate).toFixed(4)} ${from.code}`}
                      </small>
              </div>
              <div className="rate-meta">
                <span>
                  <Icon name="shield" size={18} /> Mid-market reference
                </span>
                <span>
              Lastest observation: {lastUpdated || "Unavailable"}
             </span>
              </div>
            </div>
          </section>

          <RateChart
            rate={rate}
            from={from}
            to={to}
            history={history}
          />
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
              <strong>All available currencies</strong>
              <span>Explore supported currencies</span>
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
