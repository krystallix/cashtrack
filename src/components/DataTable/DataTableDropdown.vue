<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, FilePenLine, Trash2 } from 'lucide-vue-next'
import { ref, watch } from 'vue';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast/use-toast'
import axios from 'axios';
import eventBus from '@/event-bus'
import { h } from 'vue';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-vue-next'
import { DateFormatter, type DateValue } from '@internationalized/date'
import { cn } from '@/lib/utils'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Expense } from '@/data/expenses';
import { CalendarDate, getLocalTimeZone } from '@internationalized/date';
import * as LucideIcons from 'lucide-vue-next';

const { toast } = useToast()


const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})
const props = defineProps<{
  expense: Expense;
}>();


// Form data should not be wrapped in a `ref` for `useForm`
const formData = {
  id: props.expense.id,
  title: props.expense.title,
  amount: props.expense.amount,
  description: props.expense.description,
  category_id: Number(props.expense.category_id),
  payment: props.expense.payment,
  date: props.expense.date,
};

// Adjusting form schema to ensure proper validation
const formSchema = toTypedSchema(z.object({
  id: z.number().nullable(),
  title: z.string().min(2).max(20).nullable(),
  amount: z.number().positive().nullable(),
  description: z.string().max(55).optional(),
  category_id: z.number().nullable(),
  payment: z.string().max(30).nullable(),
  date: z.coerce.date(),
}));

// Now pass formData directly, not wrapped in a ref
const form = useForm({
  validationSchema: formSchema,
  initialValues: formData,
});

const editSubmit = form.handleSubmit(async (values) => {
  try {
    eventBus.emit('loading-state', true);
    const token = localStorage.getItem('token');
    const updatedValues = {
  ...values,
  date: value.value ? (() => {
    const date = value.value.toDate(getLocalTimeZone());
    date.setHours(date.getHours() + 7); // Mengubah ke WIB (UTC+7)
    return date.toISOString();
  })() : values.date,
};

    // console.log(updatedValues)
    await axios.put(`https://api.heiji.fun/api/expenses/${formData.id}`, updatedValues, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    eventBus.emit('updated');
    toast({
      title: 'Expense Updated',
      description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(updatedValues, null, 2))),
    });
    isEditDialogOpen.value = false;
  } catch (error) {
    toast({
      title: 'Failed to Update Expense',
      description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(error, null, 2))),
      variant: 'destructive',
    });
    console.error('Failed to submit expense:', error);
  } finally {
    eventBus.emit('loading-state', false);
  }
});

// Dialog state
const isDeleteDialogOpen = ref(false);
const isEditDialogOpen = ref(false);

// Delete expense function
const deleteSubmit = async () => {
  try {
    eventBus.emit('loading-state', true);
    const token = localStorage.getItem('token');
    if (token && formData.id) {
      await axios.delete(`https://api.heiji.fun/api/expenses/${formData.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Emit event to notify other parts of the app
      eventBus.emit('updated');
      
      // Show success toast
      toast({
        title: 'Expense Deleted',
        description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(formData.id, null, 2))),
      });

      // Close delete dialog
      isDeleteDialogOpen.value = false;
    } else {
      toast({
        title: 'Failed to Delete Expense',
        description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, 'Expense ID or Token not found')),
        variant: 'destructive',
      });
      console.error("Expense id or token not found");
    }
  } catch (error) {
    toast({
        title: 'Failed to Delete Expense',
        description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(error, null, 2))),
        variant: 'destructive',
      });
    console.error('Failed to delete expense:', error);
  } finally {
    eventBus.emit('loading-state', false);
  }
};

// const value = ref<DateValue>()
  const value = ref<DateValue | undefined>(undefined);


interface Category {
  id: string
  icon: string
  name: string
}

const categories = ref<Category[]>([]) // State with correct type
async function fetchCategories() {
  try {
    const token = localStorage.getItem('token');

    // Make request with Authorization header
    const response = await axios.get('https://api.heiji.fun/api/categories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
    console.error('Failed to fetch categories:', error);
  }
}




watch(isEditDialogOpen, (newVal) => {
  fetchCategories()
  if (newVal) {
    let parsedDate = null;
    if (props.expense.date) {
      const date = new Date(props.expense.date);
      parsedDate = new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    }

    // Mengonversi CalendarDate ke objek Date
    const dateValue = parsedDate ? parsedDate.toDate(getLocalTimeZone()) : undefined;

    form.setValues({
      id: props.expense.id,
      title: props.expense.title,
      amount: props.expense.amount ? Number(props.expense.amount.toString().replace(',', '')) : 0,
      description: props.expense.description,
      category_id: Number(props.expense.category_id),
      payment: props.expense.payment,
      date: dateValue, // Menggunakan objek Date
    });
    // Mengatur nilai untuk Calendar
    value.value = parsedDate ? parsedDate : undefined;
  }
});

</script>


<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="isEditDialogOpen = true"><FilePenLine class="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
      <DropdownMenuItem @click="isDeleteDialogOpen = true"><Trash2 class="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <!-- Delete Expense Dialog -->
  <Dialog v-model:open="isDeleteDialogOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Expense</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this expense? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <!-- Form for deleting the expense -->
      <form @submit.prevent="deleteSubmit">
        <!-- Hidden input for expense id -->
        <Input
          class="w-full"
          id="id"
          name="id"
          type="hidden"
          :value="formData.id"
        />
        <DialogFooter>
          <Button variant="outline" @click="isDeleteDialogOpen = false">Cancel</Button>
          <Button type="submit">Delete</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>

  <!-- Edit Expense Dialog -->

  <Dialog v-model:open="isEditDialogOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogDescription>
          <p>Transforming Expenses into Insights</p>
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="editSubmit">
        <div class="pb-1">
          <FormField v-slot="{ componentField }" name="id">
            <FormItem>
              <FormLabel>ID</FormLabel>
              <FormControl>
                <Input type="number" disabled v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="py-1">
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
            <FormField name="date">
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
                      <Calendar 
                        v-model="value as DateValue" 
                        initial-focus
                      />
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
