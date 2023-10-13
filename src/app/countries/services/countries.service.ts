import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Country } from '../interfaces/country.interface';
import { Observable, catchError, delay, tap,map, of } from 'rxjs';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private apiUrl:string = 'https://restcountries.com/v3.1';

  public cacheStore:CacheStore = {
    byCapital:    { term: '', countries: []},
    byCountries:  { term: '', countries: []},
    byRegion:     { region: '', countries: []},
  }

  constructor(private http:HttpClient) {
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage(){
    localStorage.setItem('cacheStorage', JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorage(){
    if (!localStorage.getItem('cacheStorage') )return;

    this.cacheStore = JSON.parse(localStorage.getItem('cacheStorage')!);
  }

  private getCountriesRequest(url:string): Observable<Country[]>{

    return this.http.get<Country[]>(url)
    .pipe(
      catchError( error => {
        console.log(error)
        return of ([])},
      ),
      // delay(2000),
    );

  }

  searchByAlphaCode(code:string): Observable<Country | null>{

    const url = `${this.apiUrl}/alpha/${code}`;


    return this.http.get<Country[]>(url)
    .pipe(
      //? map() sirve para TRANSFORMAR la información
      map( countries => countries.length > 0 ? countries[0]: null   ),
      catchError( error => {
        console.log(error);
        return of (null)
      })
    );
  }


  searchCapital(term:string): Observable<Country[]>{

    const url = `${this.apiUrl}/capital/${term}`;
    return this.getCountriesRequest(url)
    .pipe(
      //El tap lanza efectos secundarios
      tap( countries => this.cacheStore.byCapital = {term: term, countries: countries}),
      tap(()=> this.saveToLocalStorage())
    );
  }

  searchCountry(term:string): Observable<Country[]>{

    const url = `${this.apiUrl}/name/${term}`;
    return this.getCountriesRequest(url)
    .pipe(
      //El tap lanza efectos secundarios
      tap( countries => this.cacheStore.byCountries = {term: term, countries: countries}),
      tap(()=> this.saveToLocalStorage()),
    );
  }

  searchRegion(region:Region): Observable<Country[]>{

    const url = `${this.apiUrl}/region/${region}`;
    return this.getCountriesRequest(url).pipe(
      //El tap lanza efectos secundarios
      tap( countries => this.cacheStore.byRegion = {region, countries: countries}),
      tap(()=> this.saveToLocalStorage())
    );
  }



}
