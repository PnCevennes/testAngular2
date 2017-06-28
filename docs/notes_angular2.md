# Angular2

## Tests
 * test unitaires écrits avec Jasmine
 * exécutées avec Karma
 * test d'intégration exécuté avec Protractor


## Angular cli
 * Ligne de commande pour simplifier les tâches de dev
 * fonctionnalités :
  * génération projet
  * génération composant
  * ...

```
npm install agular-cli -g
ng new DemoApp
ng serve
```

## composants
L'application est un arbre de composants modulaires

Composant :
 * objet réutilisable constitué de : code (classe) + HTML (template)
 * offre un selecteur : exemple <mon-comp></mon-comp>

```
//Imports
import {Component} for '@angular/core';
import {DataService} for './data.service';

//Décorateurs
@Component({
  selector : 'mon-comp',
  templateUrl : 'mon-comp.component.html'
  })

//Classe
export class MonCompComponent {

}

```  

### Démarage : bootstrap
Permet le chargement des composants par l'application

## Templates
### rendering
```
<!-- {{expression}}-->
<div>
{{ product.name}}
</div>
```
### Binding sur les propriétés
One way binding sur les propriétés du DOM
```
<!-- [propriété]-->
<div [hidden]="isHidden"></div>
```
### Evénements
```
<!-- (event) -->
<button (click)="sort($event)" >Sort</button>
```

### Binding Bi-directionnel
One way binding sur les propriétés du DOM
```
<!-- [(ngModel)]-->
<input type="text" [(ngModel)]="personne.nom"></input>
```

### Directives Built-in
```
<!-- *ngDir-->
<div *ngIf="isVisible">
  <tr *ngFor="let personne of personnes">...</tr>
</div>
```

### Pipes
Pour formater les données (equivalent à filter)
Plusieurs pipes build-in : uppercase, slice, date, ...


## Composants et Templates
Les composants d'appuient sur des décorateurs pour définir les métadatas
```
@Component({
  selector : 'mon-comp', // <mon-comp></mon-comp>
  templateUrl : 'mon-comp.component.html',
  directives : [RouterLink, SortByDirective],
  pipes : [CapitalizePipe, TrimePipe]
  })
export class MonCompComponent {
  constructor(private dataService : dataService) {}
}
```
Récapitulatif :
https://angular.io/docs/ts/latest/guide/cheatsheet.html

## Services
Classe js offrant des fonctionnalités réutilisables
Implémentés comme des singletons
Indépendant des composants
Peut être utilisé par des composants par injection dépendance
Peut utiliser d'autre services par injection de dépendance
### Création
```
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
@Injectable
export class PersonnesService{
  constructor(private _http:Http){}
    getPersonnes(){...}
}
```
### Utilisation
```
@Component({
  selector : 'personnes',
  templateUrl : 'personnes-list.component.html',
  providers:[PersonnesService]
})

export class PersonnesServiceListComponent {
  personnes: Personne[]
  constructor(private _personnesService:PersonnesService) {}
  ngOnInit(){
    this._personnesService.getPersonnes()
      .subscribe((data:Personne[]) =>{
        this.personnes = data;
      })
  }
}
```
### Principaux hook
 * ngOnChanges : input property value changes
 * ngOnInit : Intialisation step
 * ngDoCheck : Every change detection cycle
 * ngOnDestroy : before destruction


### Http
```
//main.ts
import {bootstrap} from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';
import {AppComponent} from './app/'
bootstrap(AppComponent, [HTTP_PROVIDERS]);
//Passer HTTP_PROVIDERS comme dépendance pour l'app au complet

```

## Constantes
const MACST: String[] = ['a', 'b'];

## Intégration de lib tierce
### Leaflet
http://stackoverflow.com/questions/40460138/angular-2-import-of-external-leaflet-typescript-definition

```
npm install @types/geojson @types/leaflet leaflet --save
```
Ce qui rajoute les lignes suivantes dans package.json
```
"dependencies": {
......
"@types/geojson": "0.0.31",
"@types/leaflet": "^1.0.40",
"leaflet": "^1.0.2",
.......
}
```

Dans le fichier angular-cli.json rajouter l'appel au css de leaflet
```
"styles": [
  .....
  "../node_modules/leaflet/dist/leaflet.css"
],
```

## Composants et directives 

- Directives semblable à un composant mais sans template

- Déclaration via des décorateur 
  - @Component
  - @Directive
  
### Selecteurs
- types : 
   - éléments (plutôt réservé au component) ```footer```
   - classe : ```.altert```
   - attribut avec ou sans valeur ```[color]``` ou ```[color=red]``` 
   - combinaison éléments/classe/attribut
    ```
    @Directive({
     selector:'[myAtt]'
    })
    export class myAttDir {...}
    
    //Usage
    <div myAtt></div>
    ```
  
### Input
Permet de fournir les propriétés aux composants/directives enfants
Attribut ```input``` permet de spécifier les paramètres sous la forme d'un tableau ```['nomInterne : nomExterne']```
```
@Directive({
 selector:'[myAtt]',
 inputs : ['text: myText']
})
export class myAttDir {
 set text(value) {...} //Permet d'être notifié quand la propriété est modifiée
}

//Usage
<div myAtt myText='Message trop cool'></div>
```
