# FUTURE

> The Future of Work is Remote

## 🐣 Introduction

* Generate a json file (for parsing) from [900+ Startups hiring Remotely in 2019 - by Remotive.io](https://docs.google.com/spreadsheets/d/1TLJSlNxCbwRNxy14Toe1PYwbCTY7h0CNHeer9J0VRzE)
* Search query with Google engine based on ATS SaaS

## 📦 Requirements

### [csv2json](https://www.npmjs.com/package/csv2json)

```sh
❯ yarn global add csv2json
❯ npm i -g csv2json
```

### Anonymous proxies for Google

```sh
❯ docker run -d -p 8118:8118 -p 2090:2090 -e tors=25 -e privoxy=1 zeta0/alpine-tor
```

## 🕹️ Usage

### Get json of startups hiring remotely

```sh
❯ make startups
```

### Index (ES) query for ATS SaaS from Google results

```sh
❯ make ats -- --query "javascript+engineer+remote"
```
