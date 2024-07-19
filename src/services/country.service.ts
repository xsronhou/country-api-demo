import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class CountryService {
    private readonly URL = 'https://restcountries.com/v3.1/all';

    constructor(private httpClient: HttpClient) {}

    public getCountry(): Observable<any> {
        return this.httpClient.get(this.URL);
    }
}
