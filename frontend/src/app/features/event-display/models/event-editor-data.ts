import {EventDto} from "../../../core/api";
import {EventEditorMode} from "../enums/event-editor-mode";

export interface EventEditorData {
  title: string;
  event: EventDto;
  mode: EventEditorMode;
}
