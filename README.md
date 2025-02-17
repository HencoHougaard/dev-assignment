# Birthday Events Finder

This is a Nuxt.js application that allows users to enter their valid South African ID number and find out any special holidays/events that occur on their birthday. The application uses the Calendarific API to fetch holiday data.

## Features

- Validate South African ID numbers
- Fetch and display holidays/events on the user's birthday
- Store user data and search count in a MySQL database
- Responsive and modern design

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```properties
# Database Configuration
DATABASE_URL="mysql://root:[your_password]@localhost:3306/birthday_events"

# Calendarific API Configuration
NUXT_PUBLIC_CALENDARIFIC_API_KEY="your_calendarific_api_key"
```

Replace `your_calendarific_api_key` with your actual Calendarific API key.

## MySQL Database Setup

1. Start MySQL service:

```bash
brew services start mysql
```

2. Log in to MySQL as root:

```bash
mysql -u root -p
```

3. Create the database:

```sql
CREATE DATABASE birthday_events;
```

## Prisma Setup

1. Run the Prisma migration to create the database tables:

```bash
npx prisma migrate dev --name init
```

2. Access Prisma Studio to see tables and data:

Prisma Studio is up on `http://localhost:5556`:

```bash
npx prisma studio
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

```
