import { Injectable } from '@angular/core';
import { Calendar, DateInput } from '@fullcalendar/core';

@Injectable({
  providedIn: 'root'
})
export class EventQueryService {
  constructor() { }

  getEventsForCurrentView(calendar: Calendar): void {
    const currentView = calendar.view;

    const currentDate: Date = new Date();
    const currentMonthStart: Date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const currentMonthEnd: Date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const previousMonthStart: Date = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() - 1, 1);
    const previousMonthEnd: Date = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth(), 0);
    const nextMonthStart: Date = new Date(currentMonthEnd.getFullYear(), currentMonthEnd.getMonth() + 1, 1);
    const nextMonthEnd: Date = new Date(currentMonthEnd.getFullYear(), currentMonthEnd.getMonth() + 2, 0);

    let startDate: Date;
    let endDate: Date;

    switch (currentView.type) {
      case 'dayGridMonth':
      case 'timeGridWeek':
        startDate = currentMonthStart;
        endDate = currentMonthEnd;
        break;
      case 'timeGridDay':
        startDate = currentView.currentStart as Date;
        endDate = currentView.currentEnd as Date;
        break;
      default:
        startDate = previousMonthStart;
        endDate = nextMonthEnd;
        break;
    }

    this.getEvents(startDate, endDate);
  }

  private getEvents(startDate: Date, endDate: Date): void {
  }
}
