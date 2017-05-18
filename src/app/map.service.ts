import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DataService {
  private pqUrl = '/api/pq.js';  // URL to web api
  data:{};
  constructor(private http: Http) { 
  }

  getJsonData(): Promise<any> {
      return this.http.get(this.pqUrl)
                 .toPromise()
                 .then(response => {
                   this.data = response.json()
                 })
                 .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}

@Injectable()
export class MapService {
  layer:any;
  constructor(
    private http: Http, 
    private dataService:DataService
  ) {}

  createLayer(data, options:{}): void {
      this.layer = new L.GeoJSON(data,options)
  }

}
