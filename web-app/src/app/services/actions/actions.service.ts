import { Injectable } from '@angular/core';
import { Script } from 'src/app/interfaces/scripts/script.interface';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  constructor() { }

  updateConfig(config: Object) {
    // @ts-expect-error
    return window.updateConfig(JSON.stringify({a: 1, b: 2}));
  }

  runScript(script: Script) {
    // @ts-expect-error
    return window.runScript(script)
  }
}
