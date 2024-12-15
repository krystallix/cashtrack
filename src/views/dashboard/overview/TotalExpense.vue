<template>
  <div class="flex-1">
    <Container>
      <Card class="w-full">
        <CardHeader>
          <CardTitle>Last 30 Days Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <ApexCharts type="area" height="220" :options="amountChartOptions" :series="seriesDataAmount" />
        </CardContent>
      </Card>
    </Container>
  </div>
  <div class="flex-1">
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Last 30 Days Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <ApexCharts type="area" height="220" :options="expensesChartOptions" :series="seriesDataExpenses" />
      </CardContent>
    </Card>
  </div>
  <div class="flex-1">
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <ApexCharts type="scatter" height="205" :options="paymentMethodChartOptions" :series="seriesPaymentMethod" />
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import eventBus from '@/event-bus';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ApexCharts from 'vue3-apexcharts';
import axios from 'axios';

interface DataCategory {
  date: string;
  total_amount: string;
  total_expenses: number;
}

interface DataResponse {
  amountsByDate: DataCategory[];
}

const amountChartOptions = ref({
  chart: {
    id: 'amount-chart',
    group: 'group-chart',
    type: 'area',
    height: 220,
    sparkline: { enabled: true },
  },
  tooltip: {
    shared: true, // Agar tooltip berbagi antar series
    intersect: false, // Tooltip akan muncul di setiap titik data
  },
  stroke: {
    curve: 'smooth',
  },
  fill: {
    opacity: 0.3,
  },
  yaxis: {
    min: 0,
  },
  colors: ['#00D8B6', '#008FFB'], // Warna untuk Amount dan Expenses

});

const expensesChartOptions = ref({
  chart: {
    group: 'group-chart',
    id: 'expenses-chart',
    type: 'area',
    height: 220,
    sparkline: { enabled: true },
  },
  tooltip: {
    shared: true, // Agar tooltip berbagi antar series
    intersect: false, // Tooltip akan muncul di setiap titik data
  },
  stroke: {
    curve: 'smooth',
  },
  fill: {
    opacity: 0.3,
  },
  yaxis: {
    min: 0,
  },
  colors: ['#00D8B6', '#008FFB'], // Warna untuk Amount dan Expenses

});

const seriesDataAmount = ref([
  {
    name: 'Amount',
    data: [] as { x: string; y: number }[],
  },
]);

const seriesDataExpenses = ref([
  {
    name: 'Expenses',
    data: [] as { x: string; y: number }[],
  },
]);
const handleResponseData = (dataResponse: DataResponse) => {
  const categories = dataResponse.amountsByDate.map((item) =>
    new Date(item.date).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
  );

  const amountData = dataResponse.amountsByDate.map((item) =>
    parseFloat(item.total_amount)
  );
  const expensesData = dataResponse.amountsByDate.map(
    (item) => item.total_expenses
  );

  // Mengupdate data untuk Amount dan Expenses di masing-masing series
  seriesDataAmount.value = [
    {
      name: 'Amount',
      data: amountData.map((y, index) => ({ x: categories[index], y })),
    },
  ];

  seriesDataExpenses.value = [
    {
      name: 'Expenses',
      data: expensesData.map((y, index) => ({ x: categories[index], y })),
    },
  ];

};


const seriesPaymentMethod = ref([
  {
    name: "Cash",
    data: [],
  },
  {
    name: "Non-Cash",
    data: [],
  },
]);



const paymentMethodChartOptions = {
  chart: {
    type: "scatter",
    height: 220,
    toolbar: {
      show: false,
    },
  },
  xaxis: {
    type: "numeric",
    tickAmount: 10,
    labels: {
      formatter: (val: string) => parseFloat(val).toFixed(1),
    },
  },
  yaxis: {
    tickAmount: 4,
  },
  tooltip: {
    shared: false,
    intersect: true,
  },
};

async function getData(): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('https://api.heiji.fun/api/expenses', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const rawData = response.data;

    // Filter data berdasarkan metode pembayaran
    const cashData = rawData
      .filter((item: any) => item.payment === 'cash')
      .map((item: any) => [
        Number(new Date(item.date).toLocaleDateString('id-ID', {
          day: 'numeric',
        })),
        parseFloat(item.amount),
      ]);

    const nonCashData = rawData
      .filter((item: any) => item.payment === 'non-cash')
      .map((item: any) => [
        Number(new Date(item.date).toLocaleDateString('id-ID', {
          day: 'numeric',
        })),
        parseFloat(item.amount),

      ]);

    // Update seriesPaymentMethod
    seriesPaymentMethod.value = [
      {
        name: 'Cash',
        data: cashData,
      },
      {
        name: 'Non-Cash',
        data: nonCashData,
      },
    ];

    console.log('Updated Series:', seriesPaymentMethod.value);
  } catch (error) {
    console.error('Failed to fetch expenses:', error);
  }
}


console.log(seriesPaymentMethod.value);

// Menangani event pada mounted
onMounted(() => {
  getData();
  const handleEvent = (event: unknown) => {
    handleResponseData(event as DataResponse);
  };
  eventBus.on('responseData', handleEvent);

  // Menghapus event listener saat komponen dihancurkan
  onUnmounted(() => {
    eventBus.off('responseData', handleEvent);
  });
});
</script>