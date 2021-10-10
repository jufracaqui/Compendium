import { Injectable } from '@angular/core';
import { Config } from 'src/app/interfaces/config/config.interface';
import { InitialState } from 'src/app/interfaces/config/initial-state.interface';
import { Script } from 'src/app/interfaces/scripts/script.interface';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private initialState: InitialState;

  constructor() {
    // @ts-expect-error
    this.initialState = window.initialState;
    /*this.initialState = {
      scripts: [
        {
          config: {
            author: "Fran",
            description: "1 desc jdkfla dfj klds fjdkasñla sdfkj",
            name: "1",
            tab: "fjdkaslñ"
          },
          dir: "asdf"
        },
        {
          config: {
            author: "Fran",
            description: "2 desc jdkfla dfj klds fjdkasñla sdfkj",
            name: "2",
            tab: "fdsa"
          },
          dir: "fdas"
        }
      ],
      config: {
        OSs: [
          "mac",
          "fedora",
        ],
        preferedOs: "mac",
        terminals: [
          "bash",
          "zsh",
        ],
        preferedTerminal: "zsh",
      },
    }; */
  }

  getInitialState(): InitialState {
    return this.initialState;
  }

  getConfig(): Config {
    return this.initialState.config;
  }

  getTabs(): String[] {
    let ret: String[] = [];

    this.initialState.scripts.forEach((script: Script) => {
      const tabName = script.config.tab;
      if (ret.indexOf(tabName) === -1) {
        ret.push(tabName);
      }
    });

    ret = [
      'All',
      ...ret,
      'Config'
    ];

    return ret;
  }
}
