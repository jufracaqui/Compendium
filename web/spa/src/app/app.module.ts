import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ConfigEditorComponent } from './components/config-editor/config-editor.component';
import { MultipleTagInputComponent } from './components/multiple-tag-input/multiple-tag-input.component';
import { ScriptComponent } from './components/script/script.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfigEditorComponent,
    MultipleTagInputComponent,
    ScriptComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
