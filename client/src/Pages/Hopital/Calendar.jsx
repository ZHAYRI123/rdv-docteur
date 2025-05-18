import { useCalendar } from './useCalendar';
import { toast } from 'react-toastify';

const Calendar = () => {
  const {
    currentDate,
    selectedDate,
    setSelectedDate,
    appointments,
    monthNames,
    changeMonth,
    getCalendarDays,
    fetchAppointments
  } = useCalendar();

  const formatSelectedDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/rdv/deleteRdv/${appointmentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          toast.success('Rendez-vous annulé avec succès');
          fetchAppointments(); // Refresh the appointments list
        } else {
          toast.error('Erreur lors de l\'annulation du rendez-vous');
        }
      } catch (error) {
        console.error('Error canceling appointment:', error);
        toast.error('Erreur de connexion au serveur');
      }
    }
  };


  return (
    <section className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Gestion des Rendez-vous</h2>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => changeMonth(-1)}
            className="bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
          >
            &lt;
          </button>
          <span className="text-lg font-medium">
            {`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
          <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}

        {getCalendarDays().map((dayInfo, index) => (
          <div
            key={index}
            className={`aspect-square border rounded-lg p-2 ${
              dayInfo.isEmpty ? '' : 'hover:bg-gray-50 cursor-pointer'
            }`}
            onClick={() => {
              if (!dayInfo.isEmpty) {
                setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), dayInfo.day));
              }
            }}
          >
            {!dayInfo.isEmpty && (
              <>
                <div className={`text-right text-sm ${
                  dayInfo.isToday ? 'text-blue-500 font-bold' : 'text-gray-700'
                }`}>
                  {dayInfo.day}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {dayInfo.appointments} RDV
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Rendez-vous du {formatSelectedDate(selectedDate)}
          </h3>
          <div className="space-y-3">
            {appointments
              .filter(apt => new Date(apt.date).toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0])
              .map((apt) => (
                <div key={apt._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">
                      {apt.heure} - {apt.patient?.nom} {apt.patient?.prenom}
                    </div>
                    <div className="text-sm text-gray-500">
                      Dr. {apt.docteur?.nom} {apt.docteur?.prenom}
                    </div>
                    <div className="text-sm text-gray-500">
                      Symptômes: {apt.symptoms}
                    </div>
                    <div className="text-sm text-gray-500">
                      Status: {apt.status}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCancelAppointment(apt._id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              ))}
            {appointments.filter(apt => 
              new Date(apt.date).toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0]
            ).length === 0 && (
              <div className="text-center text-gray-500">
                Aucun rendez-vous pour cette date
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Calendar;