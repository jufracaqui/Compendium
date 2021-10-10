import { Component, OnInit } from '@angular/core';
import { ActionsService } from 'src/app/services/actions/actions.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { Config } from 'src/app/interfaces/config/config.interface';

@Component({
  selector: 'app-config-editor',
  templateUrl: './config-editor.component.html',
  styleUrls: ['./config-editor.component.scss']
})
export class ConfigEditorComponent implements OnInit {
  configBackup: Config;

  constructor(
    private config: ConfigService,
    private actions: ActionsService,
  ) {
    this.configBackup = {...this.getConfig()};
  }

  ngOnInit(): void {

  }

  getConfig(): Config {
    return this.config.getConfig();
  }

  getOSs(): String[] {
    return this.getConfig().OSs;
  }

  saveConfig() {
    this.actions.updateConfig(this.configBackup);
  }

  addOS(newOs: String) {
    this.configBackup.OSs.push(newOs);
  }

  deleteOs(index: Number) {
    this.configBackup.OSs = this.configBackup.OSs.filter((_, i) => i !== index);
  }

  addTerminal(newTerminal: String) {
    this.configBackup.terminals.push(newTerminal);
  }

  deleteTerminal(index: Number) {
    this.configBackup.terminals = this.configBackup.terminals.filter((_, i) => i !== index);
  }
}
