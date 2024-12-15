
// Definisikan tipe data yang diterima dari event bus
export interface dataResponse {
    amountsByDate: {
        date: string;
        total_amount: string;
        total_expenses: number;
    }[];
    allCategories: {
        category_id: number;
        category_name: string; 
        category_icon: string;
        total: string;
    }[];
    dailyExpensesThisWeek: {
        date: string;
        total: string;
    }[];
    dailyExpensesLastWeek: {
        date: string;
        total: string;
    }[];
}

export interface Data {
    date: string;
    'Last Week': number;
    'This Week': number;
}