# Golden Raspberry Awards API

This API provides information about movies from the Golden Raspberry Awards. It allows you to retrieve producers with the minimum and maximum intervals between their wins.

## Requirements

- Node.js (v22 or higher)
- Docker
- Docker Compose

## Tech Stack

- Express
- Drizzle
- SQLite

## Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd outsera
    ```

## Running the Application

### Using Docker Compose

1.  **Build and start the application:**

    ```bash
    docker-compose up --build
    ```

    This command builds the Docker image and starts the application. The API will be available at `http://localhost:3000`.

### Without Docker

#### Dev

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Start the application:**

    ```bash
    npm run dev
    ```

#### Prod

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Build the application:**

    ```bash
    npm run build
    ```

3.  **Start the application:**

    ```bash
    npm run start
    ```

    The API will be available at `http://localhost:3000`.

## Running Tests

To run the tests, use the following command:

```bash
npm run test:docker
```

Or

```bash
npm test
```

This will execute all unit and integration tests for the application.

## Using the API

Once the application is running, you can access the API at `http://localhost:3000`.

### Example Endpoints

- **Get producers with minimum and maximum win intervals:**

  ```
  GET /api/producers/min-max-intervals
  ```

  **Response:**

  ```json
  {
    "min": [
      {
        "producer": "Producer Name",
        "interval": 1,
        "previousWin": 2000,
        "followingWin": 2001
      }
    ],
    "max": [
      {
        "producer": "Another Producer",
        "interval": 10,
        "previousWin": 1990,
        "followingWin": 2000
      }
    ]
  }
  ```

You can use tools like [RestClient](https://github.com/Huachao/vscode-restclient/blob/master/README.md) or [Postman](https://www.postman.com/) to make requests to the API.

## Importing CSV Data

The application supports importing data from a CSV file. The CSV file should be semicolon-separated and have the following columns:

- `year`: The year of the movie.
- `title`: The title of the movie.
- `studios`: The studios that produced the movie (separated by commas or "and").
- `producers`: The producers of the movie (separated by commas or "and").
- `winner`: "yes" if the movie won the award, otherwise leave it empty.

Example CSV format:

```csv
year;title;studios;producers;winner
1980;Can't Stop the Music;Associated Film Distribution;Allan Carr;yes
1980;Cruising;Lorimar Productions, United Artists;Jerry Weintraub;
1980;The Formula;MGM, United Artists;Steve Shagan;
```

1.  **To import a CSV file run the following command:**

    ```bash
    npm run import:csv:docker "src/database/data/movielist.csv"
    ```

    Or

    ```bash
    npm run import:csv -- "src/database/data/movielist.csv"
    ```
