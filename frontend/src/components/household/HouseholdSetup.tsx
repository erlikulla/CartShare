import { useState } from 'react';
import { Button, TextField, Card, CardContent } from '@mui/material';
import { Home, Users } from 'lucide-react';
import { toast } from 'sonner';
import { householdService } from '../../services/householdService';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Household {
  id: number;
  name: string;
  inviteCode: string;
}

interface HouseholdSetupProps {
  user: User;
  onComplete: (household: Household) => void;
}

type Mode = 'choose' | 'create' | 'join';

export default function HouseholdSetup({ user, onComplete }: HouseholdSetupProps) {
  const [mode, setMode] = useState<Mode>('choose');
  const [householdName, setHouseholdName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!householdName.trim()) {
      toast.error('Please enter a household name');
      return;
    }

    setLoading(true);
    try {
      const household = await householdService.createHousehold(householdName);
      toast.success(`Household "${householdName}" created! Share your invite code: ${household.inviteCode}`);
      onComplete(household);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create household');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteCode.trim()) {
      toast.error('Please enter an invite code');
      return;
    }

    setLoading(true);
    try {
      const household = await householdService.joinHousehold(inviteCode);
      toast.success('Successfully joined household!');
      onComplete(household);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to join household');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'choose') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #d1fae5, #99f6e4)',
        padding: '1rem'
      }}>
        <div style={{ width: '100%', maxWidth: '48rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
              Welcome, {user.name}!
            </h1>
            <p style={{ color: '#6b7280' }}>Set up your household to start sharing grocery lists</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <Card style={{ cursor: 'pointer' }} onClick={() => setMode('create')}>
              <CardContent style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  backgroundColor: '#d1fae5',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <Home style={{ width: '2rem', height: '2rem', color: '#10b981' }} />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  Create Household
                </h2>
                <p style={{ color: '#6b7280' }}>
                  Start a new household and invite your roommates
                </p>
              </CardContent>
            </Card>

            <Card style={{ cursor: 'pointer' }} onClick={() => setMode('join')}>
              <CardContent style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  backgroundColor: '#ccfbf1',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <Users style={{ width: '2rem', height: '2rem', color: '#14b8a6' }} />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  Join Household
                </h2>
                <p style={{ color: '#6b7280' }}>
                  Enter an invite code to join an existing household
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #d1fae5, #99f6e4)',
        padding: '1rem'
      }}>
        <Card style={{ width: '100%', maxWidth: '28rem' }}>
          <CardContent style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#d1fae5',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Home style={{ width: '2rem', height: '2rem', color: '#10b981' }} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>Create Household</h2>
              <p style={{ color: '#6b7280', marginTop: '0.5rem', textAlign: 'center' }}>
                Give your household a name
              </p>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <TextField
                fullWidth
                label="Household Name"
                variant="outlined"
                placeholder="e.g., The Smith House, Apt 4B"
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                required
              />

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Button
                  type="button"
                  fullWidth
                  variant="outlined"
                  onClick={() => setMode('choose')}
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  style={{ backgroundColor: '#10b981', color: 'white' }}
                >
                  {loading ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, #d1fae5, #99f6e4)',
      padding: '1rem'
    }}>
      <Card style={{ width: '100%', maxWidth: '28rem' }}>
        <CardContent style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              backgroundColor: '#ccfbf1',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Users style={{ width: '2rem', height: '2rem', color: '#14b8a6' }} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>Join Household</h2>
            <p style={{ color: '#6b7280', marginTop: '0.5rem', textAlign: 'center' }}>
              Enter the invite code shared by your roommate
            </p>
          </div>

          <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <TextField
              fullWidth
              label="Invite Code"
              variant="outlined"
              placeholder="e.g., ABC123"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              required
              inputProps={{ style: { textTransform: 'uppercase' } }}
            />

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button
                type="button"
                fullWidth
                variant="outlined"
                onClick={() => setMode('choose')}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                style={{ backgroundColor: '#14b8a6', color: 'white' }}
              >
                {loading ? 'Joining...' : 'Join'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
