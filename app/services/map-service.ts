import {Injectable} from '@angular/core';
import {Map} from 'leaflet';
import * as L from 'leaflet';

@Injectable()
export class MapService {
    map: Map;
    
    construct() { }
}