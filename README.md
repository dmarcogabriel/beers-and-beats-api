# Beers and Beats API

## Description

It's a microsservice with a basic CRUD and a endpoint that returns the ideal beer according to the temperature given. It also returns a playlist based on the beer style.

It integrates with Spotify API to get playlists and tracks.

## Installation

```bash
$ yarn install
```

## Running the app

Before running any of the scripts bellow, don't forget to create a `.env` file with a mongo db uri and your spotify's client id and client secret.

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test:watch

# test coverage
$ yarn test:cov
```

## Documentation
After running the API, you can find it [HERE](http://localhost:3000/api).
