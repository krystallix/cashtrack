<template>
   
</template>

<script setup>
import { ref } from 'vue';
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

const selectMonth = (month) => {
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
</script>
