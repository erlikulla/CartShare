import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { toast } from 'sonner';

interface CompletePurchaseDialogProps {
  open: boolean;
  itemName: string;
  onClose: () => void;
  onComplete: (price: number) => void;
}

export function CompletePurchaseDialog({
  open,
  itemName,
  onClose,
  onComplete,
}: CompletePurchaseDialogProps) {
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    onComplete(parsedPrice);
    setPrice('');
    onClose();
  };

  const handleClose = () => {
    setPrice('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Complete Purchase</DialogTitle>
        <DialogContent>
          <div className="mb-4">
            <p className="text-gray-700">
              How much did you pay for <strong>{itemName}</strong>?
            </p>
          </div>
          <TextField
            fullWidth
            label="Price"
            type="number"
            variant="outlined"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            inputProps={{
              min: 0,
              step: 0.01,
            }}
            required
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            className="bg-green-500 hover:bg-green-600"
          >
            Mark as Purchased
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
