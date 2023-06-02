import {EventDto} from "../../../core/api";
import {EditorMode} from "../enums/editor-mode";

export interface EventEditorData {
  event: EventDto;
  mode: EditorMode;
}
