<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Trash2 } from 'lucide-vue-next'
import { ref } from 'vue';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useToast } from '@/components/ui/toast/use-toast';
import { h } from 'vue';
import eventBus from '@/event-bus';

const { toast } = useToast()

const props = defineProps<{
  category: Category;
}>();


interface Category {
  id: string
  name: string
}

// Dialog state
const isDeleteDialogOpen = ref(false);

// Delete expense function
const deleteSubmit = async () => {
  try {
    eventBus.emit('loading-state', true);
    const token = localStorage.getItem('token');
    if (token && props.category.id) {
      await axios.delete(`https://api.heiji.fun/api/categories/${props.category.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Emit event to notify other parts of the app
      eventBus.emit('updated-category', props.category.id);
      
      // Show success toast
      toast({
        title: 'Category Deleted',
        description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(props.category.id, null, 2))),
      });

      // Close delete dialog
      isDeleteDialogOpen.value = false;
    } else {
      toast({
        title: 'Failed to Delete Category',
        variant: 'destructive',
        description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, 'Category ID or Token not found')),
      });

      console.error("category id or token not found");
    }
  } catch (error) {
    toast({
        title: 'Failed to Delete Category',
        variant: 'destructive',
        description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(error, null, 2))),
      });
    console.error('Failed to delete category:', error);
  } finally {
    eventBus.emit('loading-state', false);
  }
};

// const value =
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
          :value="props.category.id"
        />
        <DialogFooter>
          <Button variant="outline" @click="isDeleteDialogOpen = false">Cancel</Button>
          <Button type="submit">Delete</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>

  <!-- Edit Expense Dialog -->

 
</template>
