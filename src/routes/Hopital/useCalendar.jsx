import { useState, useCallback } from 'react';

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState([
    { time: '09:00', patient: 'Ahmed abdine', doctor: 'Dr. Mohamed Cheick', type: 'Consultation' },
    { time: '14:30', patient: 'Baraka elmane', doctor: 'Dr. Mohamed Cheick', type: 'Suivi' }
  ]);

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const changeMonth = useCallback((delta) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + delta);
      return newDate;
    });
  }, []);

  const isToday = useCallback((day) => {
    const today = new Date();
    return day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear();
  }, [currentDate]);

  const getCalendarDays = useCallback(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push({ isEmpty: true });
    }
    
    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push({
        day,
        isEmpty: false,
        isToday: isToday(day),
        appointments: 2 // Replace with actual count from your data
      });
    }
    
    return days;
  }, [currentDate, isToday]);

  return {
    currentDate,
    selectedDate,
    setSelectedDate,
    appointments,
    monthNames,
    changeMonth,
    getCalendarDays
  };
};