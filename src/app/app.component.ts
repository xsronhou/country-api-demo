import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CountryService } from '../services/country.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public readonly PAGE_SIZE = 25;
  private readonly NUMBER_OF_COLUMN = 5;
  private sourceCountryData = [];
  public filteredCountryData = [];
  public displayData: any[] = [[]];
  public selectedCountry: any;
  public currentPage = 1;
  @ViewChild('searchInput') public searchInput!: ElementRef;

  constructor(private countryService: CountryService,
              private modalService: NgbModal) {}

  ngOnInit(): void {
      this.countryService.getCountry().subscribe({
        next: (data) => {
          this.sourceCountryData = data;
          this.filteredCountryData = data;
          this.displayData = this.generateMatrixData(this.filteredCountryData.slice(0, this.PAGE_SIZE));
        },
        error: (err) => console.log(err)
      });
  }

  handlePageChange(pageNumber: number): void {
    const startingRow = (pageNumber - 1) * this.PAGE_SIZE;
    const endingRow = startingRow + this.PAGE_SIZE;
    const records = this.filteredCountryData.slice(startingRow, endingRow);
    this.displayData = this.generateMatrixData(records);
  }

  handleOpenModal(selectedCountry: any, content: TemplateRef<any>): void {
    this.selectedCountry = selectedCountry;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        console.log(`Closed with: ${result}`);
      },
      (reason) => {
        console.log(`Dismissed -> ${reason}`);
      },
    );
  }

  handleSearch(event: any): void {
    const input = event.target.value;
    this.filteredCountryData = this.sourceCountryData.filter((country: any) => {
      return country.name.official.toUpperCase().indexOf(input.toString().toUpperCase()) > - 1
    });
    const endingRow = this.filteredCountryData.length >= this.PAGE_SIZE? this.PAGE_SIZE: this.filteredCountryData.length;
    this.displayData = this.generateMatrixData(this.filteredCountryData.slice(0, endingRow));
    this.currentPage = 1;
  }

  getFirstKey(obj: object): any {
    return Object.keys(obj)[0];
  }

  handleSortASC(): void {
    this.searchInput.nativeElement.value = '';
    this.filteredCountryData = this.sourceCountryData.sort((countryA: any, countryB: any) => countryA.name.official.localeCompare(countryB.name.official));
    const endingRow = this.filteredCountryData.length >= this.PAGE_SIZE? this.PAGE_SIZE: this.filteredCountryData.length;
    this.displayData = this.generateMatrixData(this.filteredCountryData.slice(0, endingRow));
  }

  handleSortDESC(): void {
    this.searchInput.nativeElement.value = '';
    this.filteredCountryData = this.sourceCountryData.sort((countryA: any, countryB: any) => countryB.name.official.localeCompare(countryA.name.official));
    const endingRow = this.filteredCountryData.length >= this.PAGE_SIZE? this.PAGE_SIZE: this.filteredCountryData.length - 1;
    this.displayData = this.generateMatrixData(this.filteredCountryData.slice(0, endingRow));
  }

  generateMatrixData(countryData: any[]): any[] {
    const displayData: any[] = [];
    const rowToDisplay = countryData.length / this.NUMBER_OF_COLUMN;
    for(let i=0; i<rowToDisplay; i++) {
      const result = [];
      for(let j = (i * this.NUMBER_OF_COLUMN); j < (i * this.NUMBER_OF_COLUMN) + this.NUMBER_OF_COLUMN; j++)
        if(countryData[j] != undefined) result.push(countryData[j]);
      displayData.push(result);      
    }
    return displayData;
  }
}