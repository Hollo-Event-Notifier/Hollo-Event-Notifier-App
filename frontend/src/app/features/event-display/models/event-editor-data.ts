import {EventDto} from "../../../core/api";
import {EventEditorMode} from "../enums/event-editor-mode";

export interface EventEditorData {
  event: EventDto;
  mode: EventEditorMode;
}
