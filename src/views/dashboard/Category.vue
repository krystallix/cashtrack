<script setup lang="ts">
import { useAuthStore } from '@/store/auth';
import DataTableCategory from '@/components/DataTable/DataTableCategory.vue';
import { h, onMounted, onUnmounted, ref } from 'vue';
import axios from 'axios';
import { ColumnDef } from '@tanstack/vue-table';
import DropdownAction from '@/components/DataTable/DataTableDropdownCategory.vue';
import eventBus from '@/event-bus';
import { Button } from '@/components/ui/button'
import { DonutChart } from '@/components/ui/chart-donut'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useToast } from '@/components/ui/toast/use-toast'
import * as LucideIcons from 'lucide-vue-next';
import type { Component } from 'vue';
const { toast } = useToast()
interface Category {
  id: string
  name: string
  icon?: Component
}

const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'id', 
    header: () => h('div', 'ID'),
    cell: ({ row }) => {
      return h('div', { class: 'flex space-x-2 items-center' }, [
        h('span', { class: 'max-w-[500px] truncate font-medium' }, row.getValue('id')),
      ]);
    },
  },
  {
    accessorKey: 'name',
    header: () => h('div', 'Category'),
    cell: ({ row }) => {
      const IconComponent = row.original.icon;
      const categoryName = row.getValue('name');

      return h('div', { class: 'flex items-center space-x-2' }, [
        // Tampilkan ikon di depan nama, jika ada
        IconComponent ? h(IconComponent, { class: 'h-5 w-5 text-muted-foreground' }) : null,
        h('span', categoryName as string)
      ]);
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const { id, name } = row.original;
      return h('div', { class: 'relative' }, h(DropdownAction, { category: { id, name } }));
    },
  },
];

const data = ref<Category[]>([]);
const chartData = ref<{ name: string, total: number, predicted: number }[]>([]);

// Ambil data kategori dan statistik pengeluaran
async function getData(): Promise<void> {
  try {
    // Ambil token dari localStorage
    const token = localStorage.getItem('token');

    // Ambil kategori dari API
    const categoriesResponse = await axios.get('https://api.heiji.fun/api/categories', {
      headers: { Authorization: `Bearer ${token}` }
    });
    data.value = categoriesResponse.data.map((category: { id: string, name: string, icon: keyof typeof LucideIcons }) => {
      const iconName = category.icon;
      const IconComponent = LucideIcons[iconName] || null;

      return {
        id: category.id,
        name: category.name,
        icon: IconComponent, // Simpan komponen ikon, bukan string
      };
    });
    // Ambil statistik pengeluaran per kategori dari API
    const statsResponse = await axios.get('https://api.heiji.fun/api/categories/stat', {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Set chartData dengan hasil statistik pengeluaran
    chartData.value = statsResponse.data.map((item: any) => ({
      name: item.category_name,
      total: item.total_expenses,
    }));
    // console.log(chartData.value);
  } catch (error) {
    console.error('Failed to fetch data:', error);
    data.value = []; // Kosongkan data jika terjadi error
  }
}

const formSchema = toTypedSchema(z.object({
  name: z.string().min(2).max(20).nullable(),
  icon: z.string().optional(), // Mengatur panjang maksimum title
})) 

const form = useForm({
  validationSchema: formSchema,
})


const addCategory = form.handleSubmit(async (values: {name: string | null}) => {
  try {
    const token = localStorage.getItem('token');
    await axios.post('https://api.heiji.fun/api/categories', values, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    eventBus.emit('updated-category');
    toast({
        title: 'Category Added',
        description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
      });
  } catch (error) {
    console.error('Failed to submit expense:', error);
  }
});


onMounted(() => {
  getData();
  eventBus.on('updated-category', getData);
});

onUnmounted(() => {
  eventBus.off('updated-category', getData);
});
</script>


<template>
  <div class=" h-full flex-1 flex-col p-2 md:flex">
    <div class="flex items-center justify-between space-y-2 mb-4">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          Hello, {{ useAuthStore().username }}
        </h2>
        <p class="text-muted-foreground">
          Here&apos;s a list of your Categories!
        </p>
      </div>
      </div>
      <div class="flex space-x-2">
        <div class="flex-col flex w-[500px]">
          <div class="flex-1 mb-4">
            <Card>
            <CardHeader>
              <CardTitle>Add Category</CardTitle>
              <CardDescription>
                Add a new category
              </CardDescription>
            </CardHeader>
            <form @submit.prevent="addCategory">
            <CardContent class="grid gap-6">
              <div class="grid gap-2">
                <FormField v-slot="{ componentField }" name="name">
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Name" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="icon">
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Icon ( Optional )" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
            </CardContent>
            <CardFooter class="justify-end space-x-2">
              <Button>Submit</Button>
            </CardFooter>
            </form>
          </Card> 
        </div>
        <div class="flex-1">
          <Card class="h-[500px]">
            <CardContent class="grid overflow-auto max-h-[470px]">
              <DataTableCategory :data="data" :columns="columns" />
            </CardContent>
          </Card>
        </div>
        </div>
          
        <div class="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                Overview of your categories
              </CardDescription>
            </CardHeader>
            <CardContent class="grid gap-6">
              <DonutChart
              index="name"
              :category="'total'"
              :data="chartData"
            />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
</template>