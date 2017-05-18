import { Component, OnInit} from '@angular/core';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Headers, Http } from '@angular/http';

import 'leaflet';

import {MapService, DataService} from './map.service'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'PQ';
  map:any;
  d:any;
  _select_layer;

  constructor(
    private mapService: MapService, 
    private dataService:DataService
  ){}

  ngOnInit(): void {
   this.map = L.map('map').setView([44.28, 3.60], 10);

   L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
       attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
   }).addTo(this.map);

   var oneach = function onEachFeature(feature, layer) {
       layer.on({ click: ():void => {this.zoomToPq(layer)}});
   }.bind(this);

   this.dataService.getJsonData().then(() => {
     this.mapService.createLayer(this.dataService.data, {onEachFeature: oneach});
     this.d = this.mapService.layer;this.d.addTo(this.map)
    });
 }

 zoomToPq(e) : void {
    if (this._select_layer) {
      this._select_layer.setStyle(this._select_layer.saveopt);
    }
    var saveopt={fillColor: e.options.fillColor, color: e.options.color};
    this.map.fitBounds(e.getBounds());
    e.setStyle({fillColor: '#3f0', color: '#0f0'});
    this._select_layer = e;
    this._select_layer.saveopt = saveopt;
 }
}
