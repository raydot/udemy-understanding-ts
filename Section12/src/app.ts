import 'reflect-metadata';
import { plainToClass } from 'class-transformer';

import { Product } from './product.model';

import { validate } from 'class-validator';

// Here are some sweet products, but they're not *our* products.
// What to do?  This could have come from a data source, for instance.
const products = [
  { title: 'Leggings in the Bayou', price: 21.99 },
  { title: 'Canibal 911', price: 28.72 },
  { title: 'A Wench for All Seasons', price: 88.77 },
];

// Let's test our validation decorators
const newProd = new Product('', -100);
validate(newProd).then((errors) => {
  if (errors.length > 0) {
    console.log('VALIDATION ERRORS');
    console.log(errors);
  } else {
    console.log(newProd.getInformation());
  }
});

/*
(2) [ValidationError, ValidationError]
0: ValidationError
children: []
constraints: {isNotEmpty: 'title should not be empty'} /// WOW!
property: "title"
target: Product {title: '', price: -100}
value: ""
[[Prototype]]: Object
1: ValidationError
children: []
constraints: {isPositive: 'price must be a positive number'} /// COOL!
property: "price"
target: Product {title: '', price: -100}
value: -100
[[Prototype]]: Object
length: 2
[[Prototype]]: Array(0)

*/

//const p1 = new Product('The Savage Astronaut', 12.99);

// You could manually remap them, of course:
// const loadedProducts = products.map((prod) => {
//   return new Product(prod.title, prod.price);
// });

// Or use class-transformer!
const loadedProducts = plainToClass(Product, products);

for (const prod of loadedProducts) {
  console.log(prod.getInformation());
}

//console.log(p1.getInformation());
