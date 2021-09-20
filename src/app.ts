// I added the js-api-loader mostly to handle embedding the API key in the
// without having to put it directly onto the HTML page.

import { Loader } from '@googlemaps/js-api-loader';
import axios from 'axios';

const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;

const GOOGLE_API_KEY: string | any = process.env.API_KEY;

// SET UP GM FROM LOADER
const loader = new Loader({
  apiKey: GOOGLE_API_KEY,
});

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: 'OK' | 'ZERO_RESULTS';
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  // send this to Google's API
  // fetch('')? nah...  Let's use axios
  // Axios comes with an index.d.ts file.  Comes with TS support!
  axios
    .get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${GOOGLE_API_KEY}`
    )
    .then((response) => {
      if (response.data.status !== 'OK') {
        throw new Error('Could not fetch location!');
      }
      loader.load().then(() => {
        const coordinates = new google.maps.LatLng({
          lat: response.data.results[0].geometry.location.lat,
          lng: response.data.results[0].geometry.location.lng,
        });
        console.log(coordinates.lat);
        //const coordinates = response.data.results[0].geometry.location;
        const map = new google.maps.Map(
          document.getElementById('map') as Element,
          {
            center: coordinates,
            zoom: 16,
          } as google.maps.MapOptions
        );

        new google.maps.Marker({ position: coordinates, map: map });
      });
    })
    .catch((err) => {
      alert(err.message);
      console.log(err);
    });
}

form.addEventListener('submit', searchAddressHandler);

// Format for google string:
// https://maps.googleapis.com/maps/api/geocode/outputFormat?parameters
