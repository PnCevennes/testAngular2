import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent, TableComponent,MapComponent,MapTableComponent } from './app.component';
import {MapService, DataService} from './map.service';

import { MaterialModule } from '@angular/material';
import {FlexLayoutModule} from "@angular/flex-layout";

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    MapComponent,
    MapTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,FlexLayoutModule
  ],
  providers: [MapService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
