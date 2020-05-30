# Logr 2.0

Simple exampe of a selfmade GA-like tracking setup

## Getting started

### Install dependencies

```sh
npm i
```

### Run in dev mode

```sh
npm run dev
```

## Enabling Geo IP lookup

```sh
cp sample.env .env
```

Get a free Maxmind GeoLite2 license key and insert it into the `.env` file

```sh
npm run download-geoip-db
```
