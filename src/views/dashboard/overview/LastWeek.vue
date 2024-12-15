<template>
    <Card class="w-full">
        <CardHeader>
            <CardTitle>This Week</CardTitle>
            <CardDescription>Total Expense: Rp {{ new Intl.NumberFormat('id-ID').format(totalExpense) }}</CardDescription>
            <p class="text-muted-foreground text-xs">{{ percentageChange.toFixed(2) }}% than last week.</p>
        </CardHeader>
        <CardContent>
            <LineChart 
                :data="data" 
                index="date" 
                :categories="['Last Week', 'This Week']" 
                :y-formatter="(tick) => {
                    return typeof tick === 'number' 
                        ? `${new Intl.NumberFormat('id-ID').format(Math.round(tick))}` 
                        : '';
                }" 
            />
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { LineChart } from '@/components/ui/chart-line';
import eventBus from '@/event-bus';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader, 
    CardTitle,
} from '@/components/ui/card'
import { Data, dataResponse } from './Schema';

// Variabel reaktif untuk menyimpan data
const data = ref<Data[]>([]);

// Variabel untuk total pengeluaran dan persentase perubahan
const totalExpense = ref<number>(0);
const percentageChange = ref<number>(0);

// Fungsi untuk format data pengeluaran
const formatExpenseStats = (dailyExpensesThisWeek: any[], dailyExpensesLastWeek: any[]) => {
    const formattedStats: any[] = [];
    const lastWeekMap = new Map(
        dailyExpensesLastWeek.map((expense) => {
            const dateKey = new Date(expense.date).toLocaleString('en-US', { weekday: 'short' });
            return [dateKey, parseFloat(expense.total)];
        })
    );

    const thisWeekMap = new Map(
        dailyExpensesThisWeek.map((expense) => {
            const dateKey = new Date(expense.date).toLocaleString('en-US', { weekday: 'short' });
            return [dateKey, parseFloat(expense.total)];
        })
    );

    totalExpense.value = Array.from(thisWeekMap.values()).reduce((sum, value) => sum + value, 0);
    const lastWeekTotal = Array.from(lastWeekMap.values()).reduce((sum, value) => sum + value, 0);
    const change = ((totalExpense.value - lastWeekTotal) / lastWeekTotal) * 100;
    percentageChange.value = change > 0 ? Number(`${change.toFixed(2)}`) : Number(change.toFixed(2));

    // Daftar hari dalam seminggu
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Loop untuk setiap hari
    daysOfWeek.forEach(day => {
        formattedStats.push({
            date: day,
            'Last Week': lastWeekMap.get(day) || 0,
            'This Week': thisWeekMap.get(day) || 0
        });
    });
    return formattedStats;
};

// Event listener untuk menangani data yang diterima
const handleResponseData = (dataResponse: dataResponse) => {
    if (dataResponse && dataResponse.dailyExpensesThisWeek && dataResponse.dailyExpensesLastWeek) {
        data.value = formatExpenseStats(dataResponse.dailyExpensesThisWeek, dataResponse.dailyExpensesLastWeek);
    }
};

// Menangani event pada mounted
onMounted(() => {
    eventBus.on('responseData', (event: unknown) => {
        handleResponseData(event as dataResponse);
    });
});

// Menghapus event listener saat komponen dihancurkan
onUnmounted(() => {
    eventBus.off('responseData', (event: unknown) => {
        handleResponseData(event as dataResponse);
    });
});
</script>
