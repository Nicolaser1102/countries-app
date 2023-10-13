import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { CountriesService } from '../../services/countries.service';
import {switchMap} from 'rxjs';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
  styles: [
  ]
})
export class CountryPageComponent implements OnInit {

  public country?: Country;

  constructor(private activatedRoute:ActivatedRoute,
              private countriesService:CountriesService,
              private router:Router){}


  ngOnInit(): void {
    this.activatedRoute.params
    .pipe(
      //?Objetivo de switchMap = regresa o cambia de observable
      switchMap( ({id}) => this.countriesService.searchByAlphaCode(id))
    )
    //nos suscribimos al nuevo observable (this.countriesService.searchByAlphaCode => result)
    .subscribe( country => {
        if(!country) return this.router.navigateByUrl('');
        return this.country = country;

      });
      }


  }


