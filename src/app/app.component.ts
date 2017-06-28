import { Component, OnInit} from '@angular/core';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Headers, Http } from '@angular/http';

import 'leaflet';

import FeatureCollection = GeoJSON.FeatureCollection;

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
  initialData:Array<any>=[];
  data:any;
  _select_layer;
  page = new Page(10, 20,0);
  columns = [
    {'name':'qtd_nom', 'label':'Nom PQ', 'sortOrder':true}
  ]
  range = (value) => { 
    let a = []; 
    for(let i = 0; i < value; ++i) { 
      a.push(i+1) 
    } 
    return a; 
  };

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
       layer.on({ click: ():void => {this.zoomToLayer(layer)}});
   }.bind(this);

   this.dataService.getJsonData().then(() => {
     this.mapService.createLayer(this.dataService.data, {onEachFeature: oneach});
     this.d = this.mapService.layer;
     this.d.addTo(this.map);
      Object.keys(this.d._layers).forEach(key => {
          let a = this.d._layers[key].feature.properties;
          a['_leaflet_id'] = this.d._layers[key]._leaflet_id;
          this.initialData.push(a)
      });
      console.log(this.initialData);
     this.refreshDataTable();
    });
    
 };

 zoomToLayer(e) : void {
    if (this._select_layer) {
      this._select_layer.setStyle(this._select_layer.saveopt);
    }
    var saveopt={fillColor: e.options.fillColor, color: e.options.color};
    this.map.fitBounds(e.getBounds());
    e.setStyle({fillColor: '#3f0', color: '#0f0'});
    this._select_layer = e;
    this._select_layer.saveopt = saveopt;
    this.selectElementAtPage(this._select_layer._leaflet_id);
 };

 zoomToMap(_leaflet_id:number) : void {
    let e = this.d._layers[_leaflet_id];
    this.zoomToLayer(e);
 };


 sort(column:string, order:boolean) : void {
    this.data = this.initialData;
    this.data.sort(function(a,b) {
      var x = a[column].toLowerCase();
      var y = b[column].toLowerCase();
      let r = x < y ? -1 : x > y ? 1 : 0;
      if (!order) r = x > y ? -1 : x < y ? 1 : 0;
      return r;
    });
    this.refreshDataTable();
  };

  pageUp():void{
    this.page.pageNumber += 1;
    this.refreshDataTable();
  };

  pageDown(): void{
    if(this.page.pageNumber == 0) return;
    this.page.pageNumber -= 1;
    this.refreshDataTable();
  };
  
  goToPage(i:number): void{
    this.page.pageNumber = i;
    this.refreshDataTable();
  };

  selectElementAtPage(_leaflet_id:number): void{
    let newPageIndex:number=0;
    let pos:number;
    //Find element in data
    this.initialData.forEach((item, index) => {
      if (item._leaflet_id == _leaflet_id){
        pos = index;
      } 
    });
    //Calculate new page number
    this.goToPage(Math.trunc(pos/this.page.size));
  };

  refreshDataTable():void {
    this.data = this.initialData.slice(
      this.page.pageNumber*this.page.size,
      (this.page.pageNumber+1)*this.page.size
    );
  }
}

export class Page {
    //size The number of elements in the page
    //totalElements The total number of elements
    //pageNumber The current page number
    private _pages:number;
    constructor (private _size: number, public totalElements: number, public pageNumber: number) {
      this._pages = totalElements/_size;
    }
    get size():number {
        return this._size;
    }
    set size(size:number) {
      if ((!size) || (size ===0)) size=1;
      this._size = size;
      this._pages= this.totalElements/this._size;
    }
    get pages():number {
      return this._pages;
    }
}