## Survivor Nexus Application

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# run the docker-compose to start the database
$ docker-compose up -d

# development
$ pnpm run start
```

## Test

```bash
# unit tests
$ pnpm run test
```

## Migration notes

```bash
# generate migration
$ prisma migrate dev

# apply migration
$ prisma migrate deploy
```
