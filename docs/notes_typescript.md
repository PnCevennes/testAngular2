
# typescript

http://yahiko.developpez.com/tutoriels/introduction-typescript/

* typescript : Superset d'Ecma script 6
* Principales caractéristiques :
  * type
  * Interfaces
  * Classe
  * décorateurs
  * Modules
  * fonctions fléchées
  * templates chaine


# Installation et compilation
```
npm install -g typescript
tsc index.ts #=> Génère un fichier index.js
 ```

# Typage statique
## Annotation de type
```
var prenom :string = 'aaa';
 ```
:string est optionnel; ts fait de l'inférence de type à partir de la déclaration de variable
```
var prenom = 'aaa'; //Prénom est maintenant considéré comme un string
 ```
## Annotation de fonctions
Comme les variables les fonctions typent les paramètres d'entré et de retour
```
function greet(prenom:string):string {
    return prenom;
}
#equivalent
function greet(prenom) {
    return prenom;
}
#paramètres optionel => avec ? après variable
function greet(prenom:string, nomFamille?:string):string {
    return prenom + ' ' + nomFamille;
}
 ```
## Fonction opérateur du rest
tableau de tous les arguments passé à la fonction
```
function greet(prenom:string, ...nomFamille?:string[]):string {
    return prenom+ ' ' + nomFamille.join(' ');
}
 ```
Permet de récupérer tous les arguments passé à la fonction ormis le prénom sous forme d'un tableau. Utile quand on ne connait pas le nombre de paramètre
exemple :  greet('Gérard', 'Dupond', 'Morrel')


## Interfaces
Objet qui permet de définir les type de données
```
interface Personne {
    prenom : string,
    nom : string,
    age : number,
    job? : string
}
var alex :Personne = {
    prenom: 'Alexande', ...
}
function afficherPersonne(personne:Personne){
}
 ```

## Classes

### définition
 * Classe avec constructeur
 * Getter/Setter => disponible uniquement à partir de la version 6

```
class Personne{
  prenom:string;
  nom:string;

  constructor(prenom:string, nom:string){
    this.prenom = prenom;
    this.nom = nom;
  }

  get estMineur() :boolean {
    return this.age < 18? true:false;
  }
}
 ```

## Générateur
```
function* gen(){
  yield 'Salut';
}
 ```

 ## Anonymous function arrow
Permet de définir une fonction anonyme
```
function alertMsg(msg: string) {
  this.msg = msg;
  this.timer = setInterval(
    () => {
      alert(this.msg);
    },
    500);
}

```
L'avantage par rapport à l'actuelle norme de JavaScript (ECMAScript 5), est que la notation fléchée ne change pas la valeur de contexte du mot-clé this à l'intérieur de la fonction anonyme.
