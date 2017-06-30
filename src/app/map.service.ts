import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import FeatureCollection = GeoJSON.FeatureCollection;

@Injectable()
export class DataService {
  private pqUrl = '/api/pq.js';  // URL to web api
  data:FeatureCollection<any>;
  dataTable:Array<any>=[];

  constructor(private http: Http) { 
  };

  getJsonData(): Promise<any> {
      return this.http.get(this.pqUrl)
                 .toPromise()
                 .then(response => {
                    this.data = response.json();
                 })
                 .catch(this.handleError);
  };

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  };
}

@Injectable()
export class MapService {
  layer:any;
  tableData:Array<any>;
  private _initialtableData:Array<any>;
  
  constructor(
    private http: Http, 
    private dataService:DataService
  ) {}

  createLayer(data, options:{}): void {
      this.layer = new L.GeoJSON(data,options)
      var newData:Array<any>=[];
      Object.keys(this.layer._layers).forEach(key => {
        let a = this.layer._layers[key].feature.properties;
        a['_internal_id'] = this.layer._layers[key]._leaflet_id;
        newData.push(a);
      });
      this.tableData = newData;
      this._initialtableData = newData;
  };
  
  filterWithMapBounds(bounds) {
    var visibleItems = [];
    this.layer.getLayers().forEach((item) => {
        try{
            var _coords = item.getLatLng();
        }
        catch(e){
            var _coords = item.getLatLngs();
        }
        if ((bounds.intersects(_coords)) || (bounds.contains(_coords))) {
            visibleItems.push( this._initialtableData.filter(function(v, index, arr){
            return v._internal_id == item.feature.properties._internal_id
          })[0]);
        }
    });
     this.tableData = visibleItems;
  };

  reinitalizeTableData() {
    this.tableData = this._initialtableData;
  }

}
