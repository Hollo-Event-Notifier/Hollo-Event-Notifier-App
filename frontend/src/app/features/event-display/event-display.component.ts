import {Component} from '@angular/core';
import {SharedModule} from "../../shared/shared.module";
import {repeat} from "rxjs";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-event-display',
  templateUrl: './event-display.component.html',
  styleUrls: ['./event-display.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
  ],
})
export class EventDisplayComponent {
  private readonly days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  ];
  private readonly intervalls = [
    '0-1',
    '1-2',
    '2-3',
    '3-4',
    '4-5',
    '5-6',
    '6-7',
    '7-8',
    '8-9',
    '9-10',
    '10-11',
    '11-12',
    '12-13',
    '13-14',
    '14-15',
    '15-16',
    '16-17',
    '17-18',
    '18-19',
    '19-20',
    '20-21',
    '21-22',
    '22-23',
    '23-24',
  ]

  containerStyle: Record<string, string> = {
    'display': 'grid',
    'grid-template-columns': 'auto repeat(7, 1fr)',
    'grid-template-rows': 'repeat(24, 1fr)',
    'gap': '5px 5px',
    'grid-auto-flow': 'row',
    'grid-template-areas': this.generateAreas()
  }

  private generateAreas(): string {
    let areas: Array<Array<string>>;

    areas

    for (let i = 0; i < ; i++) {

    }

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 24; j++) {
        areas
      }
    }

    return 'areas.toString()';
  }
}
