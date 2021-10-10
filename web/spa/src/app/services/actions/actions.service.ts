import { Injectable } from '@angular/core';
import { Script } from 'src/app/interfaces/scripts/script.interface';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  constructor() { }

  updateConfig(config: Object) {
    // @ts-expect-error
    return window.updateConfig(config);
  }

  runScript(script: Script) {
    // @ts-expect-error
    return window.runScript(script)
  }
}
