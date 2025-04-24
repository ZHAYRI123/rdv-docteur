import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Fetch appointments from the database
  const fetchAppointments = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/rdv/getAllRdv', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Erreur lors du chargement des rendez-vous');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch appointments when the component mounts
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

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

  const getAppointmentsForDay = useCallback((day) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, day);
    const dateString = date.toISOString().split('T')[0];

    return appointments.filter(appointment => 
      appointment.date.startsWith(dateString)
    ).length;
  }, [appointments, currentDate]);

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
        appointments: getAppointmentsForDay(day)
      });
    }
    
    return days;
  }, [currentDate, isToday, getAppointmentsForDay]);

  return {
    currentDate,
    selectedDate,
    setSelectedDate,
    appointments,
    monthNames,
    changeMonth,
    getCalendarDays,
    loading,
    fetchAppointments
  };
};