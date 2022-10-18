# SET UP

## BACKOFFICE FRONT

First, copy web-react/.env.example to web-react/.env and fill up the things you need :

```
REACT_APP_GRAPHQL_URI=/graphql
PROXY=http://localhost:4001/graphql

SKIP_PREFLIGHT_CHECK=true

REACT_APP_CLOUDINARY_URL=
REACT_APP_CLOUDINARY_NAME=
REACT_APP_CLOUDINARY_UNSIGNED_PRESET=
REACT_APP_CLOUDINARY_API_KEY=
REACT_APP_CLOUDINARY_API_SECRET=
```

you might need to create your own cloudinary account for test purposes

https://cloudinary.com

## BACKOFFICE BACK

First, copy api/.env.example to api/.env and fill up the things you need :

```
NEO4J_URI=
NEO4J_USER=
NEO4J_PASSWORD=

# Uncomment this line to specify a specific Neo4j database (v4.x+ only)

#NEO4J_DATABASE=neo4j

GRAPHQL_SERVER_HOST=0.0.0.0
GRAPHQL_SERVER_PORT=4001
GRAPHQL_SERVER_PATH=/graphql

#JWT
JWT_SECRET=

ENDPOINT=localhost:3000
KNOW_IT_URL=http://localhost:3001

GOOGLE_AUTH_CLIENT_ID=
GOOGLE_AUTH_CLIENT_SECRET=

#MAILING
MAIL_USER=
MAIL_PASSWORD=
```

you might need to create your own neo4j account for test purposes :

https://neo4j.com/cloud/platform/aura-graph-database/?ref=get-started-dropdown-cta

# RUN

## RUN BACKOFFICE

just run

```bash
npm start
```

if you're having trouble use v16 of node

```bash
nvm install 16
nvm use 16
```

if you're having trouble with prettier run

```bash
npx prettier --write web-react/src api/src
```

# RUN BACK ONLY

```bash
cd api
npm start
```
