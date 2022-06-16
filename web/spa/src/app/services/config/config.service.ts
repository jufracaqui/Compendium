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
    this.fixInitialState();
    /*this.initialState = {
      scripts: [
        {
          config: {
            author: "Fran",
            description: "1 desc jdkfla dfj klds fjdkasñla sdfkj",
            name: "1",
            tab: "1"
          },
          dir: "asdf"
        },
        {
          config: {
            author: "Fran",
            description: "2 desc jdkfla dfj klds fjdkasñla sdfkj",
            name: "2",
            tab: "1"
          },
          dir: "fdas"
        },
        {
          config: {
            author: "Fran",
            description: "1 desc jdkfla dfj klds fjdkasñla sdfkj",
            name: "1",
            tab: "2"
          },
          dir: "asdf"
        },
        {
          config: {
            author: "Fran",
            description: "2 desc jdkfla dfj klds fjdkasñla sdfkj",
            name: "2",
            tab: "2"
          },
          dir: "fdas"
        },
        {
          config: {
            author: "Fran",
            description: "1 desc jdkfla dfj klds fjdkasñla sdfkj",
            name: "1",
            tab: "3"
          },
          dir: "asdf"
        },
        {
          config: {
            author: "Fran",
            description: "2 desc jdkfla dfj klds fjdkasñla sdfkj",
            name: "2",
            tab: "3"
          },
          dir: "fdas"
        },
        {
          config: {
            author: "Fran",
            description: "1 desc jdkfla dfj klds fjdkasñla sdfkj",
            name: "1",
            tab: "4"
          },
          dir: "asdf"
        },
        {
          config: {
            author: "Fran",
            description: "2 desc jdkfla dfj klds fjdkasñla sdfkj",
            name: "2",
            tab: "4"
          },
          dir: "fdas"
        },
        {
          config: {
            author: "Fran",
            description: "1 desc jdkfla dfj klds fjdkasñla sdfkj",
            name: "1",
            tab: "aassddff"
          },
          dir: "asdf"
        },
        {
          config: {
            author: "Fran",
            description: "2 desc jdkfla dfj klds fjdkasñla sdfkj",
            name: "2",
            tab: "qqwweerr"
          },
          dir: "fdas"
        },
        {
          config: {
            author: "Fran",
            description: "1 desc jdkfla dfj klds fjdkasñla sdfkj",
            name: "1",
            tab: "zzxxccvv"
          },
          dir: "asdf"
        },
        {
          config: {
            author: "Fran",
            description: "2 desc jdkfla dfj klds fjdkasñla sdfkj",
            name: "2",
            tab: "5"
          },
          dir: "fdas"
        },
        {
          config: {
            author: "Fran",
            description: "1 desc jdkfla dfj klds fjdkasñla sdfkj",
            name: "1",
            tab: "6"
          },
          dir: "asdf"
        },
        {
          config: {
            author: "Fran",
            description: "2 desc jdkfla dfj klds fjdkasñla sdfkj",
            name: "2",
            tab: "7777777777777"
          },
          dir: "fdas"
        },
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
        afterScriptParameters: [],
        beforeScriptParameters: [],
      },
    };*/
  }

  fixInitialState() {
    //this.initialState.config.beforeScriptParameters = this.initialState.config.beforeScriptParameters || [];
    //this.initialState.config.afterScriptParameters = this.initialState.config.afterScriptParameters || [];
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
