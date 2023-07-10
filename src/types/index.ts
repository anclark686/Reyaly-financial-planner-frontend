export interface Expense {
    id: string,
    name: string,
    amount: number,
    date: number,
    dateStr?: string | undefined,
    dateObj?: Date | undefined
}

export interface Debt {
    id: string,
    name: string,
    type: string,
    owed: number,
    limit: number,
    rate: number,
    payment: number,
}

export interface Paycheck {
    date:string,
    id:string,
}

// export interface User {
//     pay: number;
//     rate: string;
//     frequency: string;
//     hours: number;
// }

// import { type User }from "../types"