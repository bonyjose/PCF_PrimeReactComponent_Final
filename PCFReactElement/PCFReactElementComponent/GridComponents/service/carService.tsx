import axios from 'axios';

export class CarService {
    
    getCarsSmall() {
        return axios.get('cars-small.json')
                .then((res:any) => res.data.data);
    }

    getCarsMedium() {
        return axios.get('./data/cars-medium.json')

                .then((res:any) => res.data.data);
    }

    getCarsLarge() {
        return axios.get('./data/cars-large.json')
                .then((res:any) => res.data.data);
    }
}