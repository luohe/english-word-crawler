# Node.js Crawler Project

This project is a Node.js-based web crawler built using TypeScript, Express, and Crawlee. It supports both dynamic and static page scraping, with a modular architecture for data extraction and a robust proxy management system.

## Features

- **Express Framework**: The application is built on Express, providing a simple and flexible web server.
- **Crawlee Framework**: Utilizes Crawlee for web scraping, supporting both PlaywrightCrawler for dynamic pages and CheerioCrawler for static pages.
- **Data Extraction**: Data extraction logic is modularized and can be easily extended with new extractors.
- **SQLite Database**: Data is stored in an SQLite database, with an initialized service for easy setup.
- **Proxy Pool Management**: Includes capabilities for proxy validation, performance tracking, and failure retries.
- **Testing**: Comprehensive unit and integration tests to ensure functionality and reliability.
- **CI/CD Support**: Configured for local development, testing, and PM2 deployment.

## Project Structure

```
nodejs-crawler
├── src
│   ├── app.ts
│   ├── config
│   │   ├── database.ts
│   │   ├── proxyPool.ts
│   │   └── crawlers.ts
│   ├── controllers
│   │   └── crawlerController.ts
│   ├── routes
│   │   └── index.ts
│   ├── services
│   │   ├── proxyService.ts
│   │   ├── dataService.ts
│   │   └── crawlerService.ts
│   ├── extractors
│   │   └── exampleExtractor.ts
│   ├── models
│   │   └── databaseModel.ts
│   ├── middlewares
│   │   └── errorHandler.ts
│   └── utils
│       ├── logger.ts
│       └── validator.ts
├── tests
│   ├── integration
│   │   └── crawler.test.ts
│   └── unit
│       ├── proxyService.test.ts
│       └── dataService.test.ts
├── scripts
│   ├── initDatabase.ts
│   └── validateProxies.ts
├── ecosystem.config.js
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
├── .gitignore
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd nodejs-crawler
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Initialize the database:
   ```
   npm run initDatabase
   ```

## Usage

To start the application, run:
```
npm start
```

You can access the API at `http://localhost:3000`.

## Testing

To run tests, use:
```
npm test
```

## Deployment

For production deployment, use PM2:
```
pm2 start ecosystem.config.js
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License.