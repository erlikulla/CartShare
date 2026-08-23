import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { MenuItem } from '@mui/material';
import { toast } from 'sonner';

interface AddItemDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string, quantity: number, category: string) => void;
}

const categories = [
  'Dairy',
  'Produce',
  'Snacks',
  'Meat',
  'Bakery',
  'Beverages',
  'Other',
];

export function AddItemDialog({ open, onClose, onAdd }: AddItemDialogProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState('Other');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter an item name');
      return;
    }

    if (quantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    onAdd(name, quantity, category);
    setName('');
    setQuantity(1);
    setCategory('Other');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setQuantity(1);
    setCategory('Other');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add Grocery Item</DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-2">
            <TextField
              fullWidth
              label="Item Name"
              variant="outlined"
              placeholder="e.g., Milk, Eggs, Bread"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />

            <TextField
              fullWidth
              label="Quantity"
              type="number"
              variant="outlined"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              inputProps={{ min: 1 }}
              required
            />

            <TextField
              fullWidth
              select
              label="Category"
              variant="outlined"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            Add Item
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
