<script setup lang="ts">
import { useAuthStore } from '@/store/auth';
import { Expense } from '@/data/expenses';
import { columns } from '@/data/expenses';
import DataTable  from '@/components/DataTable/DataTable.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import axios from 'axios';
import eventBus from '@/event-bus';
import * as LucideIcons from 'lucide-vue-next';

const data = ref<Expense[]>([])



async function getData(): Promise<Expense[]> {
  try {
    eventBus.emit('loading-state', true);
    // Ambil token dari localStorage (atau tempat lain yang sesuai)
    const token = localStorage.getItem('token');

    // Lakukan request dengan header Authorization
    const response = await axios.get('https://api.heiji.fun/api/expenses', {
      headers: {
        Authorization: `Bearer ${token}`, // Tambahkan token ke header
      },
    });

    data.value = response.data.map((expense: any) => {
      const iconName = expense.category_icon as keyof typeof LucideIcons;
      const IconComponent = LucideIcons[iconName] || null;
      return {
        ...expense,
        category_icon: IconComponent
      };
    });
  } catch (error) {
    console.error('Failed to fetch expenses:', error);
    data.value = []; // Set data sebagai array kosong jika terjadi error
  } finally {
    eventBus.emit('loading-state', false);
  }

  return data.value; // Selalu kembalikan data.value
}

onMounted(() => {
  getData();
  
  // Dengarkan event 'updated' untuk refresh data
  eventBus.on('updated', getData);
});

onUnmounted(() => {
  eventBus.off('updated', getData); // Hapus listener saat komponen di-unmount
});
</script>

<template>
  <div class="h-full flex-1 flex-col p-2 md:flex ">
    <div class="flex items-center justify-between space-y-2 mb-4">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          Hello, {{ useAuthStore().username }}
        </h2>
        <p class="text-muted-foreground">
          Here&apos;s a list of your expenses!
        </p>
      </div>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-full">
          <DataTable :data="data" :columns="columns" />
        </div>
      </div>
    </div>
</template>