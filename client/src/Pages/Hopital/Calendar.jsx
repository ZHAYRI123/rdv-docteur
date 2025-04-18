import { useCalendar } from './useCalendar';

const Calendar = () => {
  const {
    currentDate,
    selectedDate,
    setSelectedDate,
    appointments,
    monthNames,
    changeMonth,
    getCalendarDays
  } = useCalendar();

  const formatSelectedDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
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
            {appointments.map((apt, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{apt.time} - {apt.patient}</div>
                  <div className="text-sm text-gray-500">{apt.doctor} - {apt.type}</div>
                </div>
                <button className="text-red-500 hover:text-red-700">
                  Annuler
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Calendar;