import { Component } from '@angular/core';
import { Http, Response, RequestOptions, Headers} from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  formGroup: FormGroup;
  searchGroup: FormGroup;
  post: any;
  search:any;
  selectedEntry: any;

  title = 'Burgers';
  data: any = {};
  findedData: any = {};

  private apiURL = 'https://fast-sea-98150.herokuapp.com';

  constructor(private formBuilder: FormBuilder, private http: Http) {
    this.formGroup = formBuilder.group({
      'burger_name': [null, Validators.required],
      'burger_size': [null],
      'burger_imageUrl': [null, Validators.required],
      'burger_ingredients': [null, Validators.required],
      'burger_sauces': [null]
    });

    this.searchGroup = formBuilder.group({
      'search_input': [null, Validators.required],
      'byName': [],
      'byIngredients': [],
      'byId': []
    });

    this.getContacts();
    this.getHomePage();
  }

  getHomePage() {
    return this.http.get(this.apiURL + '/burgers').map((response: Response) => response.json());
  }

  getContacts() {
    this.getHomePage().subscribe(data => {
      console.log(data);
      this.data = data;
    });
  }

  createBurger(post) {
    var burgerName = post.burger_name;
    var burgerSize = post.burger_size || 'small';
    var imageUrl = post.burger_imageUrl;
    var ingredients = post.burger_ingredients;
    var sauces = post.burger_sauces || [];

    console.log('Burger name = ' + burgerName);
    console.log('Burger size = ' + burgerSize);
    console.log('Burger image = ' + imageUrl);
    console.log('Burger ingredients = ' + ingredients);
    console.log('Burger sauces = ' + sauces);

    var headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');

    var options = new RequestOptions({headers: headers});

    this.http.post(this.apiURL + '/burger/add', {
      name: burgerName,
      burgerSize: burgerSize,
      imageUrl: imageUrl,
      sauces: sauces,
      ingredients: ingredients
    }, options).subscribe(response => console.log(response));
  }

  searchBurger(post) {
    var searchText = post.search_input;
    var url = this.apiURL;

    if (this.selectedEntry === 3) {
      // Search by Id
      url = url + '/burger/id/' + searchText;
    } else if (this.selectedEntry === 2) {
      // Search by ingredients
      url = url + '/burger/ingredients/' + searchText;
    } else {
      // Search by name
      url = url + '/burger/' + searchText;
    }

    this.http.get(url).map((response: Response) => response.json()).subscribe(responseData => {
      if (this.selectedEntry === 2) {
        this.findedData = responseData;
      } else {
        var customArray = [];
        customArray.push(responseData);

        this.findedData = customArray;
      }
    });;
  }

  onSelectionChange(value) {
    this.selectedEntry = value;
  }

}
