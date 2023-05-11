import {EventMapperService} from './event-mapper.service';
import {EventDto} from "../api";
import {EventInput} from "@fullcalendar/core";

describe('EventMapperService', () => {
  let underTest: EventMapperService;

  beforeEach(() => {
    underTest = new EventMapperService();
  });

  it('should map EventDto to EventInput', () => {
    // Arrange
    const dto: EventDto = {
      id: '1',
      startDate: '2022-05-01T09:00:00Z',
      endDate: '2022-05-01T10:00:00Z',
      title: 'Test Event',
      place: 'Test Place',
      organizer: 'Test Organizer',
      hasPoints: true,
      link: 'http://test.com',
    };
    const expected: EventInput = {
      id: '1',
      start: new Date('2022-05-01T09:00:00Z'),
      end: new Date('2022-05-01T10:00:00Z'),
      title: 'Test Event',
      extendedProps: {
        place: 'Test Place',
        organizer: 'Test Organizer',
        hasPoints: true,
        link: 'http://test.com',
      }
    };

    // Act
    const result = underTest.mapEventDtoToCalendarEvent(dto);
    // Assert
    expect(result).toEqual(expected);
  });

  it('should map calendar event to DTO', () => {
    // Arrange
    const input: EventInput = {
      id: '1',
      start: new Date('2022-05-02T14:30:00.000Z'),
      end: new Date('2022-05-02T16:30:00.000Z'),
      title: 'Test Event',
      extendedProps: {
        place: 'Test Place',
        organizer: 'Test Organizer',
        hasPoints: true,
        link: 'https://example.com',
      },
    };

    // Act
    const result: EventDto = underTest.mapCalendarEventToEventDto(input);

    // Assert
    expect(result).toEqual({
      title: 'Test Event',
      place: 'Test Place',
      organizer: 'Test Organizer',
      hasPoints: true,
      startDate: '2022-05-02T14:30:00.000Z',
      endDate: '2022-05-02T16:30:00.000Z',
      id: '1',
      link: 'https://example.com',
    });
  });
});
