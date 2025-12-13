import { useState, useCallback } from 'react';
import { doctorService } from '../services/doctorService';

export interface Slot {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: 'available' | 'booked' | 'blocked';
  patient_id?: number;
  patient_name?: string;
}

export const useSlotManagement = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSlots = useCallback(async (startDate?: Date, endDate?: Date) => {
    try {
      setLoading(true);
      setError(null);
      
      const start = startDate || new Date();
      const end = endDate || new Date();
      end.setDate(end.getDate() + 7); // Default to 1 week
      
      const response = await doctorService.getSchedule(start, end);
      
      if (response.success) {
        setSlots(response.data);
      } else {
        setError('Không thể tải lịch làm việc');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải lịch làm việc');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSlot = useCallback(async (slotData: {
    date: string;
    start_time: string;
    end_time: string;
    max_patients?: number;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await doctorService.createSlot(slotData);
      
      if (response?.success) {
        // Reload slots after creation
        await loadSlots();
        return { success: true, data: response };
      } else {
        setError('Không thể tạo slot');
        return { success: false, error: 'Không thể tạo slot' };
      }
    } catch (err) {
      const errorMsg = 'Có lỗi xảy ra khi tạo slot';
      setError(errorMsg);
      console.error(err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [loadSlots]);

  const deleteSlot = useCallback(async (slotId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await doctorService.deleteSlot(slotId);
      
      if (response?.success) {
        // Update local state immediately
        setSlots(prev => prev.filter(slot => slot.id !== slotId));
        return { success: true };
      } else {
        setError('Không thể xóa slot');
        return { success: false, error: 'Không thể xóa slot' };
      }
    } catch (err) {
      const errorMsg = 'Có lỗi xảy ra khi xóa slot';
      setError(errorMsg);
      console.error(err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const blockSlot = useCallback(async (slotId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Assuming we have an API to block a slot
      // For now, we'll just update local state
      setSlots(prev => prev.map(slot => 
        slot.id === slotId ? { ...slot, status: 'blocked' } : slot
      ));
      
      return { success: true };
    } catch (err) {
      setError('Không thể khóa slot');
      console.error(err);
      return { success: false, error: 'Không thể khóa slot' };
    } finally {
      setLoading(false);
    }
  }, []);

  const getSlotsForDate = useCallback((date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return slots.filter(slot => slot.date === dateStr);
  }, [slots]);

  const getSlotsForWeek = useCallback((weekStart: Date) => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    return slots.filter(slot => {
      const slotDate = new Date(slot.date);
      return slotDate >= weekStart && slotDate <= weekEnd;
    });
  }, [slots]);

  return {
    slots,
    loading,
    error,
    loadSlots,
    createSlot,
    deleteSlot,
    blockSlot,
    getSlotsForDate,
    getSlotsForWeek
  };
};