import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Script } from 'src/app/interfaces/scripts/script.interface';

@Component({
  selector: 'app-script',
  templateUrl: './script.component.html',
  styleUrls: ['./script.component.scss']
})
export class ScriptComponent implements OnInit {
  @Input() script?: Script = undefined;
  @Output() run: EventEmitter<Script> = new EventEmitter<Script>();

  showDescription = false;

  constructor() { }

  ngOnInit(): void {
  }

  runScript() {
    this.run.emit(this.script);
  }
}
