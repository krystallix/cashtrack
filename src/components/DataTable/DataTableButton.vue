<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { CirclePlus } from 'lucide-vue-next'
import { h, onMounted, ref } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-vue-next'
import { DateFormatter, getLocalTimeZone, type DateValue } from '@internationalized/date'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { z } from 'zod'
import eventBus from '@/event-bus'
import { useToast } from '@/components/ui/toast/use-toast'
import type { Component } from 'vue';
import * as LucideIcons from 'lucide-vue-next';

const { toast } = useToast()

const isDialogOpen = ref(false)

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const value = ref<DateValue>()

const formSchema = toTypedSchema(z.object({
  title: z.string().min(2).max(20).nullable(), // Mengatur panjang maksimum title
  amount: z.number().positive().nullable(), // Mengatur amount menjadi positif
  description: z.string().max(55).optional(),
  category_id: z.number().nullable(), // Mengatur kategori ID
  payment: z.string().max(30).nullable(),
  date: z.coerce.date(), // Mengatur tanggal
})) 

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  try {
    eventBus.emit('loading-state', true);

    const token = localStorage.getItem('token');
    // Mengubah tanggal ke zona waktu WIB (UTC+7)
    const wibDate = new Date(values.date);
    wibDate.setHours(wibDate.getHours() + 7);
    values.date = wibDate;
    await axios.post('https://api.heiji.fun/api/expenses', values, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    eventBus.emit('updated', values);
    toast({
        title: 'Expense Added',
        description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
      });
    isDialogOpen.value = false;
  } catch (error) {
    console.error('Failed to submit expense:', error);
    toast({
        title: 'Failed to Add Expense',
        variant: 'destructive',
        description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(error, null, 2))),
      });
  } finally {
    eventBus.emit('loading-state', false);
  }

});

function addExpense() {
  isDialogOpen.value = true
}
interface Category {
  id: string
  name: string
  icon?: Component
}

const categories = ref<Category[]>([]) // State dengan tipe data yang benar
  async function getCategories() {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get('https://api.heiji.fun/api/categories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    categories.value = response.data.map((category: { id: string, name: string, icon: keyof typeof LucideIcons }) => {
      const iconName = category.icon;
      const IconComponent = LucideIcons[iconName] || null;

      return {
        id: category.id,
        name: category.name,
        icon: IconComponent, // Simpan komponen ikon, bukan string
      };
    });
  } catch (error) {
    console.error('Gagal mengambil kategori:', error)
  }
}


onMounted(() => {
  getCategories()
})

</script>

<template>
  <Button @click="addExpense">
    <CirclePlus class="mr-1 h-2 w-2" />
    Add Expense
  </Button>
  <Dialog v-model:open="isDialogOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Expense</DialogTitle>
        <DialogDescription>
          <p>Transforming Expenses into Insights</p>
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="onSubmit"> <!-- prevent default action here -->
        <div class="pb-1">
          <FormField v-slot="{ componentField }" name="title">
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Title" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="flex flex-row gap-2 py-1">
          <div class="flex-1 py-1">
            <FormField v-slot="{ componentField }" name="amount">
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <div class="relative w-full items-center">
                    <Input type="number" placeholder="Amount" class="pl-10" v-bind="componentField" />
                    <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                      <span class="text-xs text-muted-foreground">IDR</span>
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div class="flex-1 py-1">
            <FormField v-slot="{ componentField }" name="date">
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger as-child>
                      <Button variant="outline" :class="cn(
                        'w-full text-left justify-start font-normal',
                        !value && 'text-muted-foreground',
                      )">
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        {{ value ? df.format(value.toDate(getLocalTimeZone())) : "Pick a date" }}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0">
                      <Calendar v-model="value" initial-focus v-bind="componentField" />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>
        <div class="flex flex-row gap-2 py-1">
          <div class="flex-1">
            <FormField v-slot="{ componentField }" name="category_id">
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        <SelectItem v-for="category in categories" :key="category.id" :value="category.id">
                          <!-- Tampilkan ikon sebelum nama kategori -->
                          <div class="flex items-center space-x-2">
                            <component :is="category.icon" v-if="category.icon" class=" h-4 w-4 text-muted-foreground" />
                            <span>{{ category.name }}</span>
                          </div>
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            
          </div>
          <div class="flex-1">
            <FormField v-slot="{ componentField }" name="payment">
              <FormItem>
                <FormLabel>Payment</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Payment</SelectLabel>
                        <SelectItem value="cash">
                          Cash
                        </SelectItem>
                        <SelectItem value="non-cash">
                          Non-Cash
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>

        <div class="py-1">
          <FormField v-slot="{ componentField }" name="description">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us a little bit this expense." class="resize-none"
                  v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      <DialogFooter>
        <Button class="mt-3" type="submit">
          Submit
        </Button>
      </DialogFooter>
    </form>
    </DialogContent>
  </Dialog>
</template>
