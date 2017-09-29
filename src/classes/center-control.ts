import { Map } from 'leaflet';
import * as L from 'leaflet';

export class CenterControl extends L.Control {
    public onAdd(map: Map): HTMLElement {
        let container = L.DomUtil.create('div', 'leaflet-control-center leaflet-bar');
        L.DomUtil.create('a', 'leaflet-control-center-btn icon-center', container);
        
        return container;
    }

    public onRemove(map: Map): void {
        // nothing to do here
    }
}