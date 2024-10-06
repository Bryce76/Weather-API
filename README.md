# Weather API

Project URL: https://roadmap.sh/projects/weather-api-wrapper-service

## Overview

This Weather API fetches and returns weather data from a third-party API (Visual Crossing Weather API). It utilizes Redis for caching responses to improve performance and reduce the number of requests made to the external API. The API is built using Node.js, Express, and Axios, and includes rate limiting to prevent abuse.

## Features

- Fetch weather data for a specified city.
- Caching of weather data using Redis, with a 12-hour expiration time.
- Rate limiting to prevent excessive requests.
- Error handling for invalid city names and API failures.

## Technologies Used

- Node.js
- Express
- Axios
- Redis
- dotenv
- express-rate-limit

## Getting Started

### Prerequisites

- Node.js (v12 or later)
- Redis server
- An API key from [Visual Crossing](https://www.visualcrossing.com/weather-api)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Bryce76/Weather-API
   cd weather-api
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory of the project with the following content:

   ```
   API_KEY=<your_visual_crossing_api_key>
   REDIS_URL_PASSWORD=<your_redis_password>
   REDIS_URL_HOST=<your_redis_host>
   REDIS_URL_PORT=<your_redis_port>
   ```

### Usage

1. Start the Redis server.

2. Run the application:

   ```bash
   node app.js
   ```

3. Access the API by navigating to `http://localhost:3000/weather/<city>` in your web browser or using a tool like Postman. Replace `<city>` with the desired city name.

   **Example Request**:

   ```bash
   GET http://localhost:3000/weather/London
   ```

### Rate Limiting

The API is limited to 10 requests per minute per IP address. If the limit is exceeded, the API will respond with a `429 Too Many Requests` error.

### Error Handling

The API handles various error scenarios, including:

- Invalid city names.
- API downtime.
- Cache misses.

In case of an error, the API will return a JSON response with an appropriate error message.
```