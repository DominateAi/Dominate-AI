---
sidebar_position: 2
id: getting-started
title: Getting Started
description: Getting Started with Dominate A.I.
slug: /getting-started
sidebar_label: 'Getting Started'
---

## Installation

Dominate has Frontend and Backend Services.

## Node Version

- node.js v16.20.2
- npm v8.19.4

## Clone the Repository

```
git clone https://gitlab.com/dominate-ai/dominate.git
```

## To Run Backend

Move to the backend directory

```
cd backend
```

Start mongodb on port 27017, redis on port 6379 and minio on ports 9000 and 9001 with below command

```
docker compose -f docker-compose-dev.yml up -d
```
To run the dominate backend

```
npm run local
```

Finally, make sure you get the database connected and redis connected message in the terminal.

## To Run Frontend

From the root directory, run below commands:

```
cd frontend
```
```
npm install --legacy-peer-deps
```
```
npm run start
```

Then open [http://localhost:3000](http://localhost:3000) to view the frontend in the browser.