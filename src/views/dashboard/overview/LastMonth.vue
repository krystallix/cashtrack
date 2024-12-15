<template>
    <Card class="w-full">
        <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
            <CardDescription>{{ totalMonthlyExpenses }}</CardDescription>
        </CardHeader>
        <CardContent>
            <div class="w-full m-4">
                <div class="flex items-center justify-center">
                    <div class="flex items-center mx-2">
                        <Button variant="outline" class="h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100"
                            @click="prevMonth">
                            <ChevronLeft />
                        </Button>
                    </div>
                    <div class="flex items-center">
                        <Popover>
                            <PopoverTrigger class="">
                                <Button variant="outline"
                                    class="w-full justify-between text-sm font-normal text-muted-foreground">
                                    <span>{{ selectedMonth }} - {{ selectedYear }}</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent class="p-4 w-64">
                                <div class="flex items-center justify-between">
                                    <Button variant="ghost" class="text-muted-foreground" @click="prevYear">
                                        <ChevronLeft />
                                    </Button>
                                    <span class="font-semibold">{{ selectedYear }}</span>
                                    <Button variant="ghost" class="text-muted-foreground" @click="nextYear">
                                        <ChevronRight />
                                    </Button>
                                </div>
                                <div class="grid grid-cols-3 gap-2 mt-2">
                                    <Button v-for="(month, index) in months" :key="index" variant="ghost"
                                        class="text-sm text-foreground" @click="selectMonth(month)"
                                        :class="{ 'text-muted-foreground': month !== selectedMonth }">
                                        {{ month.substring(0, 3) }}
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div class="flex items-center mx-2">
                        <Button variant="outline" class="h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100"
                            @click="nextMonth">
                            <ChevronRight />
                        </Button>
                    </div>
                </div>
            </div>
            <div v-if="data.length > 0" class="my-8">
                <DonutChart index="name" :colors="['#2ea195', '#d75748', '#223d53', '#8fbf56', '#a43820', '#4c8c8f', '#f18a64', '#1f556b', '#70a85e', '#b13b53']" :category="'total'" :data="data" :showLegend="false" :type="'pie'" />
            </div>

            <!-- Message if no data -->
            <div v-else class="text-center text-xl font-semibold text-gray-500 mt-8">
                No Expenses on current month
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { DonutChart } from '@/components/ui/chart-donut'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { ref, watch } from 'vue';
import axios from 'axios';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const selectedMonth = ref(new Date().toLocaleString('en-US', { month: 'long' }));
const selectedYear = ref(new Date().getFullYear());

const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
];

const data = ref([]); // Data yang akan ditampilkan di chart
const totalMonthlyExpenses = ref<string>('0');
const selectMonth = (month: string) => {
    selectedMonth.value = month;
};

const prevYear = () => {
    selectedYear.value -= 1;
};

const nextYear = () => {
    selectedYear.value += 1;
};

// Fungsi untuk memilih bulan sebelumnya
const prevMonth = () => {
    const currentMonthIndex = months.indexOf(selectedMonth.value);
    if (currentMonthIndex === 0) {
        // Jika bulan Januari, ubah tahun dan pilih Desember
        selectedYear.value -= 1;
        selectedMonth.value = 'December';
    } else {
        const prevMonthIndex = currentMonthIndex - 1;
        selectedMonth.value = months[prevMonthIndex];
    }
};

// Fungsi untuk memilih bulan berikutnya
const nextMonth = () => {
    const currentMonthIndex = months.indexOf(selectedMonth.value);
    if (currentMonthIndex === months.length - 1) {
        // Jika bulan Desember, ubah tahun dan pilih Januari
        selectedYear.value += 1;
        selectedMonth.value = 'January';
    } else {
        const nextMonthIndex = currentMonthIndex + 1;
        selectedMonth.value = months[nextMonthIndex];
    }
};


const fetchData = async () => {
    try {
        const token = localStorage.getItem('token');
        const monthIndex = months.indexOf(selectedMonth.value) + 1; // Ubah bulan menjadi format angka
        const response = await axios.get(`https://api.heiji.fun/api/categories/monthly?month=${monthIndex}&year=${selectedYear.value}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.length === 0) {
            // Jika data kosong, tampilkan pesan No Expenses
            data.value = [];
            totalMonthlyExpenses.value = "No Expenses on current month";
        } else {
            // Jika ada data, update data dan total
            data.value = response.data.map((item: { category_name: any; total_amount: string; total_expenses: any; }) => ({
                name: item.category_name,      // category_name jadi name
                total: parseFloat(item.total_amount), // total_amount jadi total, pastikan jadi number
                predicted: item.total_expenses,  // total_expenses jadi predicted
            }));

            totalMonthlyExpenses.value = "Total Monthly Expenses: " + response.data.reduce((sum: number, item: { total_amount: string }) => sum + parseFloat(item.total_amount), 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// Watchers untuk menangani perubahan bulan atau tahun
watch([selectedMonth, selectedYear], fetchData, { immediate: true });

</script>
