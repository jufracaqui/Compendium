import { Component, OnInit } from '@angular/core';
import { Script } from './interfaces/scripts/script.interface';
import { ActionsService } from './services/actions/actions.service';
import { ConfigService } from './services/config/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  activePanel = 0;
  scripts: Script[] = [];
  filterText = '';

  constructor(
    private config: ConfigService,
    private actions: ActionsService
  ) {}

  ngOnInit(): void {
    this.scripts = this.config.getInitialState().scripts;
  }

  getPanels(): String[] {
    return this.config.getTabs();
  }

  setActivePanel(index: number) {
    this.activePanel = index;

    this.setFilteredScripts();
  }

  isPanelActive(index: number): boolean {
    return index === this.activePanel;
  }

  setFilteredScripts() {
    if (this.activePanel === 0) {
      this.scripts =  this.config.getInitialState().scripts;
    } else {
      this.scripts = this.config.getInitialState().scripts
      .filter(script => script.config.tab === this.config.getTabs()[this.activePanel]);
    }

    if (this.filterText) {
      this.scripts = this.scripts.filter(script => script.config.name.search(this.filterText));
    }
  }

  runScript(script: Script) {
    this.actions.runScript(script);
  }

  search(text: Event) {
    this.filterText = (text.target as HTMLInputElement).value;
    this.setFilteredScripts();
  }
}
