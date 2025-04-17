 // Calendar functionality
 const calendar = {
  currentDate: new Date(),
  
  init() {
      this.renderCalendar();
      document.getElementById('prevMonth').addEventListener('click', () => this.changeMonth(-1));
      document.getElementById('nextMonth').addEventListener('click', () => this.changeMonth(1));
  },

  changeMonth(delta) {
      this.currentDate.setMonth(this.currentDate.getMonth() + delta);
      this.renderCalendar();
  },

  renderCalendar() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      // Update month display
      const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;

      // Clear previous calendar
      const calendarDays = document.getElementById('calendarDays');
      calendarDays.innerHTML = '';

      // Add empty cells for days before the first day of the month
      for (let i = 0; i < firstDay.getDay(); i++) {
          calendarDays.appendChild(this.createDayElement(''));
      }

      // Add days of the month
      for (let day = 1; day <= lastDay.getDate(); day++) {
          const dayElement = this.createDayElement(day);
          calendarDays.appendChild(dayElement);
      }
  },

  createDayElement(day) {
      const div = document.createElement('div');
      div.className = 'aspect-square border rounded-lg p-2 hover:bg-gray-50 cursor-pointer';
      
      if (day) {
          div.innerHTML = `
              <div class="text-right text-sm ${this.isToday(day) ? 'text-blue-500 font-bold' : 'text-gray-700'}">${day}</div>
              <div class="text-xs text-gray-500 mt-1">2 RDV</div>
          `;
          div.addEventListener('click', () => this.showAppointments(day));
      }
      
      return div;
  },

  isToday(day) {
      const today = new Date();
      return day === today.getDate() && 
             this.currentDate.getMonth() === today.getMonth() && 
             this.currentDate.getFullYear() === today.getFullYear();
  },

  showAppointments(day) {
      const selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      document.getElementById('selectedDate').textContent = `Rendez-vous du ${selectedDate.toLocaleDateString('fr-FR', options)}`;
      
      // Example appointments - replace with actual data
      const appointments = [
          { time: '09:00', patient: 'Ahmed abdine', doctor: 'Dr. Mohamed Cheick', type: 'Consultation' },
          { time: '14:30', patient: 'Baraka elmane', doctor: 'Dr. Mohamed Cheick', type: 'Suivi' }
      ];

      const appointmentsList = document.getElementById('appointmentsList');
      appointmentsList.innerHTML = appointments.map(apt => `
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                  <div class="font-medium">${apt.time} - ${apt.patient}</div>
                  <div class="text-sm text-gray-500">${apt.doctor} - ${apt.type}</div>
              </div>
              <button class="text-red-500 hover:text-red-700">Annuler</button>
          </div>
      `).join('');
  }
};

// Initialize calendar when page loads
document.addEventListener('DOMContentLoaded', () => calendar.init());