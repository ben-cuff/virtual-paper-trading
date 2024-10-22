# Virtual Paper Trading

Welcome to the Virtual Paper Trading project! This application allows users to simulate trading in a risk-free environment using virtual currency. You can view the website at [https://www.virtualpapertrading.com](https://www.virtualpapertrading.com)

## Tech Stack

This project is built using the following technologies:

# Tech Stack

This project is built using the following tech stack:

-   **Programming Language**: TypeScript
-   **Web Framework**: Next.js + React
-   **APIs**:
    -   [www.marketdata.app](https://www.marketdata.app) for stock information
    -   [www.api.virtualpapertrading.com](https://www.api.virtualpapertrading.com) for saving user information
-   **Backend**: Python FastAPI for the main backend and routes using NextJS built in API routes
-   **Database**: PostgreSQL
-   **Authentication**: Auth.js
-   **CSS Framework**: TailwindCSS
-   **Host**: Vercel
-   **Formatting**: prettier
-   **Linting**: ESLint

## Features

-   **Real-time Market Data**: Get up-to-date information on stock prices and market trends.
-   **Portfolio Management**: Track your virtual investments and monitor your portfolio's performance.
-   **Trade Simulation**: Execute buy and sell orders without any financial risk.
-   **Analytics and Reports**: Generate graphs to see a stocks change over time.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/ben-cuff/virtual-paper-trading.git
    ```
2. Navigate to the project directory:
    ```bash
    cd virtual-paper-trading
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Create a `.env.local` file to store your environment variables:
    ```bash
    touch .env.local
    ```

## Usage

1. Start the application:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:3000`.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
