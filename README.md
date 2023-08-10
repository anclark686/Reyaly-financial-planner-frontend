# Reyaly Financial Planner Frontend

This app was created as a Capstone project for Ada Developers Academy. This repository is the frontend of a full-stack application, more information below.

### Site

https://reyaly-financial-planner.link

### Demo

- Video Demo: https://vimeo.com/853187509?share=copy
- For a populated interactive demo - contact: reyalytech@gmail.com

## Features

### Master List

- A list of all current expenses, including their amounts and due-dates
- Ability to add, adjust and delete expenses as needed

### Multiple Views

- View pay and expense info in one of four different views;
  - Master List: available on the settings page, her the user has the ability to see all expenses in a list
  - Calendar View: view all expenses and upcoming paydays in a monthly format, with the ability to add expenses by clicking on a date
  - Paycheck View: view expenses for a given paycheck, as well as estimated expected gross and take-home pay, taxes included
  - Account View: view expenses and match them to a listed account to track account balances

### Additional Features

- Authentication: secure login and authentication provided by Auth0, paired with database lookup for user details
- Debt View: lets users visualize their debt pay-off with two plans, debt-avalance and debt-snowball.
- Savings View: a savings calculator to calculate how much interest can be earned over a period of time with or without additional deposits. Also a list of accounts with high APYs is provided
- Currency Converter: gives users the ability to convert between two global currencies, and view the exchange rate
- Export Excel: gives users the ability to export an excel sheet of user details and current expense list - for a more traditional user experience

### Design

- Dark mode available, for those who use night mode. Dark or light mode preferences are saved as a cookie for future use.
- Optimized for both Desktop and Mobile views.

## Project Details

### Configuration

- Serves as a frontend to a Ruby application
  - https://github.com/anclark686/Reyaly-financial-planner-backend
- Vite used as the bundler
- MongoDB as the database
- Deployed view AWS Amplify: https://reyaly-financial-planner.link

### Version Info

- Vue version - 3.3.4 | Vite version - 4.4.7

### System dependencies

- @auth0 - for authentication
- @fullcalendar - for monthly Calendar View
- @popperjs - for bootstrap JS
- axios - for API calls
- bootstrap - for styling
- js-confetti - for easter egg confetti in Calendar View
- pinia - for state management
- vue-router - for page routing
- prettier - for code styling
- typescript - for type casting
- vite - bundler

### Project Setup

- Add environment variables per the .env.template file. Authentication keys can be secured by adding an app at https://auth0.com/
- Install packages:

```sh
npm install
```

#### Compile and Hot-Reload for Development

```sh
npm run dev
```

#### Type-Check, Compile and Minify for Production

```sh
npm run build
```

#### Format files with Prettier

```sh
npm run format
```
