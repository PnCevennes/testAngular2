import { Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Headers, Http } from '@angular/http';

import 'leaflet';

import FeatureCollection = GeoJSON.FeatureCollection;

import {MapService, DataService} from './map.service'



@Component({
  selector: 'geojson-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  data:Array<any>=[];
  _initialData:Array<any>=[];
  _transformData:Array<any>=[];
  selectedElement:number;

  page = new Page(10, 20,0);

  @Input() columns : Array<any>;

  get initialData() {
    return this._initialData;
  }

  @Input('initialData') 
  set initialData(value:Array<any>) {
    this._initialData = value
    this.transformData = value;
  };

  get transformData():Array<any> {
    return this._transformData;
  };

  set transformData(value:Array<any>) {
    this._transformData = value;
    if (value) this.refreshDataTable();
  };

  @Output() elementSelected = new EventEmitter();
  zoomToMap(id:number) {
    this.elementSelected.emit(id);
  }

  range = (value) => { 
    let a = []; 
    for(let i = 0; i < value; ++i) { 
      a.push(i+1) 
    } 
    return a; 
  };

 sort(column:string, order:boolean): void {
    var dataSorted = this.initialData;
    dataSorted.sort(function(a,b) {
      var x = a[column].toLowerCase();
      var y = b[column].toLowerCase();
      let r = x < y ? -1 : x > y ? 1 : 0;
      if (!order) r = x > y ? -1 : x < y ? 1 : 0;
      return r;
    });
    this.transformData = dataSorted;
  };

  pageUp(): void{
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

  selectElementAtPage(_internal_id:number): void{
    this.selectedElement = _internal_id;
    let newPageIndex:number=0;
    let pos:number;
    //Find element in data
    this.initialData.forEach((item, index) => {
      if (item._internal_id == _internal_id){
        pos = index;
      } 
    });
    //Calculate new page number
    this.goToPage(Math.trunc(pos/this.page.size));
  };

  refreshDataTable(): void {
    this.data = this.transformData.slice(
      this.page.pageNumber*this.page.size,
      (this.page.pageNumber+1)*this.page.size
    );
  }
}


@Component({
  selector: 'main-map',
  templateUrl: './main-map.component.html',
  styleUrls: ['./main-map.component.css']
})
export class MapComponent implements OnInit {
  constructor(    
    private mapService: MapService, 
    private dataService:DataService
  ){};

  map:any;
  private _select_layer:any;

  @Output() elementSelected = new EventEmitter();
  selectInTable(id:number) {
    this.elementSelected.emit(id);
  }

  //Initialiastion de la carte
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
      this.mapService.layer.addTo(this.map);
    });
  };
  //Zoom to layer
  zoomToLayer(e) : void {
      if (this._select_layer) {
        this._select_layer.setStyle(this._select_layer.saveopt);
      }
      var saveopt={fillColor: e.options.fillColor, color: e.options.color};
      this.map.fitBounds(e.getBounds());
      e.setStyle({fillColor: '#3f0', color: '#0f0'});
      this._select_layer = e;
      this._select_layer.saveopt = saveopt;
      this.selectInTable(this._select_layer._leaflet_id);
  };

  //Zoom to map
  zoomToMap(_leaflet_id:number) : void {
      let e = this.mapService.layer._layers[_leaflet_id];
      this.zoomToLayer(e);
  };

  //Filtrer avec la carte
}



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'PQ';
}

@Component({
  selector: 'map-table',
  templateUrl: './map-table.component.html'
})
export class MapTableComponent{

  columns = [
    {'name':'qtd_nom', 'label':'Nom PQ', 'sortOrder':true}
  ]

  constructor(
    private mapService: MapService, 
    private dataService:DataService
  ){}

  @ViewChild(TableComponent)
  private tableComponent: TableComponent;
  @ViewChild(MapComponent)
  private mapComponent: MapComponent;

  relegateZoomToFromMap(_leaflet_id:number) {
    this.tableComponent.selectElementAtPage(_leaflet_id);
  };
  
  relegateZoomToFromTable(_leaflet_id:number) : void  {
    let e = this.mapService.layer._layers[_leaflet_id];
    this.mapComponent.zoomToLayer(e);
  };
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

