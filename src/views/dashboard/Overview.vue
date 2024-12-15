<template>
    <div class="hidden h-full flex-1 flex-col p-2 md:flex">
        <div class="flex items-center justify-between space-y-2 mb-4">
            <div>
                <h2 class="text-2xl font-bold tracking-tight">
                    Hello, {{ useAuthStore().username }}
                </h2>
                <p class="text-muted-foreground">
                    Here&apos;s a summary of your expenses!
                </p>
            </div>
        </div>
        <div class="items-start justify-center gap-4 pt-2 px-8 pb-4 md:grid lg:grid-cols-2 xl:grid-cols-3">
            <TotalExpense />
        </div>
        <div class="items-start justify-center gap-4 rounded-lg p-8 pt-1 md:grid lg:grid-cols-2 xl:grid-cols-3">
            <div class="col-span-2 grid items-start gap-6 lg:col-span-1">
                <Container>
                    <LastMonth />
                </Container>
                
                <Container>
                </Container>
            </div>
            <div class="col-span-2 grid items-start gap-6 lg:col-span-1">
                <Container>
                    <TopSpend />
                </Container>
            </div>
            <div class="col-span-2 grid items-start gap-6 lg:col-span-2 lg:grid-cols-2 xl:col-span-1 xl:grid-cols-1">
                <Container>
                    <LastWeek />
                </Container>
               
            </div>
        </div>
</div>
</template>


<script setup lang="ts">
import { useAuthStore } from '@/store/auth';
import axios from 'axios';
import Container from '@/views/dashboard/overview/Container.vue'
import LastWeek from '@/views/dashboard/overview/LastWeek.vue'
import LastMonth from '@/views/dashboard/overview/LastMonth.vue'
import TopSpend from './overview/TopSpend.vue';
import { onMounted, ref } from 'vue';
import  eventBus  from '@/event-bus';
import { dataResponse } from '@/views/dashboard/overview/Schema';
import TotalExpense from '@/views/dashboard/overview/TotalExpense.vue';
const responseData = ref<dataResponse | null>(null);

// Fungsi untuk mengambil data dari API
async function getOverview(): Promise<void> {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://api.heiji.fun/api/expenses/stat', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Simpan data respons ke variabel reaktif
        responseData.value = response.data;
        eventBus.emit('responseData', responseData.value);
        // console.log(responseData.value);  // Memastikan data yang diterima
    } catch (error) {
        console.error('Failed to fetch expenses:', error);
        responseData.value = null;  // Menetapkan data kosong jika gagal
    }
}

// Panggil fungsi getOverview ketika komponen dimuat
onMounted(() => {
    getOverview();
});

// Export data untuk dapat diakses oleh komponen lain

</script>