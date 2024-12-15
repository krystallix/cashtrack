<template>
    <Card class="w-full">
        <CardHeader>
            <CardTitle>Top Spend</CardTitle>
            <CardDescription>This is a list of your top spend categories this week.</CardDescription>
        </CardHeader>
        <CardContent>
            <ApexCharts type="bar" height="300" :options="chartOptions" :series="totalAmount" />
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import eventBus from '@/event-bus';
import ApexCharts from 'vue3-apexcharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface DataCategory {
    category_id: number;
    category_name: string;
    category_icon: string;
    total: string;
}

interface DataResponse {
    allCategories: DataCategory[];
    dailyExpensesThisWeek: { date: string; total: string }[];
    dailyExpensesLastWeek: { date: string; total: string }[];
}

const categories = ref<DataCategory[]>([]);
const categoryNames = ref<string[]>([]);

const totalAmount = ref([{ name: '', data: [] as number[] }]);

const chartOptions = ref({
    chart: {
        type: 'bar',
        height: 100,
        toolbar: { show: false },
        horizontal: true,
    },
    tooltip: {
        followCursor: true,
        onDatasetHover: {
            highlightDataSeries: true,
        },
        shared: false, // Hilangkan nama series
        

    },
    fill: {
        colors: ['#171717'],
    },
    plotOptions: {
        bar: {
            horizontal: true,
            borderRadius: 8, // Mengatur border radius pada ujung bar
            borderRadiusApplication: 'end',
        },
    },
    dataLabels: {
        enabled: false,
    },
    xaxis: {
        categories: categoryNames,
    },
});


const handleResponseData = (dataResponse: DataResponse) => {
    // console.log(dataResponse.allCategories);
    categories.value = dataResponse.allCategories;
    
    // Update chart data
    totalAmount.value = [{
        name: '',
        data: categories.value.map(category => parseFloat(category.total) as number)
    }];

    // Update chart categories
    categoryNames.value.push(...categories.value.map(category => category.category_name));
    console.log(categoryNames.value);
}

onMounted(() => {
    eventBus.on('responseData', (event: unknown) => {
        handleResponseData(event as DataResponse);
    });
});

onUnmounted(() => {
    eventBus.off('responseData', (event: unknown) => {
        handleResponseData(event as DataResponse);
    });
});
</script>