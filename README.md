# Convertly

*Know what your money is worth in any currency.*

Convertly is a currency converter designed to make checking exchange rates simple and convenient. It allows users to convert amounts between supported currencies, explore historical exchange-rate trends and switch between light and dark themes.

## Features

- Convert amounts between supported currencies.
- Fetch the latest available exchange rates.
- Search and select currencies.
- Swap the selected currencies instantly.
- View historical exchange-rate trends over the last seven days.
- See the latest available rate date.
- Switch between light and dark themes.
- Responsive interface for different screen sizes.

![Convertly Screenshot](public/convertly.png)

## Built With

- React
- TypeScript
- Vite
- CSS
- Frankfurter API

## API and Data Source

Convertly uses the [Frankfurter API](https://frankfurter.dev/) to retrieve exchange rates and historical currency data.

The rates are published reference rates, not real-time trading prices. Actual exchange rates may vary depending on banks and currency exchange providers.

## Getting Started

Follow these steps to run Convertly locally.

### Prerequisites

- Node.js
- npm
- Git

### Installation

Clone the repository:

bash
git clone https://github.com/dev-theodora/convertly.git


Navigate into the project folder:

bash
cd convertly


Install dependencies:

bash
npm install


Start the development server:

bash
npm run dev


Open the local URL displayed in your terminal to view the application.

## Production Build

To create a production build, run:

bash
npm run build


## Project Structure

text
convertly/
├── .figma/
├── .vscode/
├── public/
├── src/
│   ├── App.tsx
│   ├── Main.tsx
│   ├── Index.css
│   └── vite-env.d.ts
├── .gitattributes
├── .gitignore
├── .mise.toml
├── AGENTS.md
├── CLAUDE.md
├── index.html
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── README.md
├── tsconfig.json
└── vite.config.ts


Generated build files (dist) and installed dependencies (node_modules) are excluded.

## Learning Outcomes

Building Convertly provided practical experience with:

- Integrating external APIs using Fetch.
- Managing application state with React Hooks.
- Handling asynchronous operations.
- Working with TypeScript types.
- Displaying historical exchange-rate data.
- Building interactive user interfaces.
- Implementing light and dark themes.
- Using Git and GitHub for version control.
- Creating and testing a production build.

## Author

*Theodora Oduah*

Frontend Developer

[GitHub](https://github.com/dev-theodora)

---

Built as a practical project to explore currency conversion, API integration and modern frontend development.