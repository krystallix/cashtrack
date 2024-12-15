import { ColumnDef } from '@tanstack/vue-table'
import {  ChevronsUpDown } from 'lucide-vue-next'
import { h } from 'vue'
import DropdownAction from '../components/DataTable/DataTableDropdown.vue';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import * as LucideIcons from 'lucide-vue-next';
// export interface Expense {
//     id: string
//     title: string
//     amount: number
//     description: string
//     category: string
//     date: string
//     payment: string
//   }

import { z } from 'zod'

export const expenseSchema = z.object({
  id: z.number().int().nullable(), // Mengubah id menjadi number dan opsional
  title: z.string().min(2).max(20).nullable(), // Mengatur panjang maksimum title
  amount: z.number().positive().nullable(), // Mengatur amount menjadi positif
  description: z.string().max(55).optional(),
  category_id: z.string().nullable(), // Mengatur panjang maksimum description dan opsional
  category_name: z.string(),
  category_icon: z.string(), // Mengatur date menjadi opsional
  payment: z.string().max(30).nullable(), 
  date: z.coerce.date(),
})

export type Expense = z.infer<typeof expenseSchema>
import axios from 'axios'
import { ref } from 'vue'
import eventBus from '../event-bus';

export const Category = ref([])

async function getCategories() {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get('https://api.heiji.fun/api/categories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    eventBus.emit('category-data', response.data);
    Category.value = response.data.map((category: any) => {
      const iconName = category.icon as keyof typeof LucideIcons;
      // Ambil komponen ikon dari LucideIcons berdasarkan nama ikon
      const IconComponent = LucideIcons[iconName] || null;
    
      return {
        value: category.name,
        label: category.name,
        icon: IconComponent, // Simpan komponen ikon, bukan string
      };
    })
  } catch (error) {
    console.error('Gagal mengambil kategori:', error)
    Category.value = []
  }
}

getCategories()




export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: 'title', 
    header: () => h('div', 'Title'),
    cell: ({ row }) => {
     
      return h('div', { class: 'flex space-x-2 items-center' }, [
         h(Badge, { variant: 'outline' }, () => row.original.payment), // Menampilkan label dari kategori di dalam badge
        h('span', { class: 'max-w-[500px] truncate font-medium' }, row.getValue('title')),
      ])
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return h(Button, {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Amount', h(ChevronsUpDown, { class: 'ml-1 h-1 w-1' })])
  },    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('amount'))
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(amount)

      return h('div', { class: 'font-medium' }, formatted)
    },
  },
  {
    accessorKey: 'description',
    header: () => h('div', 'Description'),
    cell: ({ row }) => h('div', row.getValue('description')),
  },
  {
    accessorKey: 'category_name',
    header: () => h('div', 'Category'), 
    cell: ({ row }) => {
      const IconComponent = row.original.category_icon;
      const categoryName = row.getValue('category_name');

      return h('div', { class: 'flex items-center space-x-2' }, [
        IconComponent ? h(IconComponent, { class: 'h-5 w-5 text-muted-foreground' }) : null,
        h('span', categoryName as string)
      ]);
    },
  },
  {
    accessorKey: 'date',
    header: () => h('div', 'Date'),
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      const formatted = date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric', 
        month: 'short',
        year: 'numeric'
      });
      return h('div', formatted);
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const { id, title, amount, description, category_id, payment, date,category_name,
        category_icon} = row.original;
      return h('div', { class: 'relative' }, h(DropdownAction, { 
        expense: { 
          id, 
          title, 
          amount, 
          description, 
          category_id, 
          payment, 
          date,
          category_name,
          category_icon,
        } 
      }));    },
  },
]