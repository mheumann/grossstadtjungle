import { Map } from 'leaflet';
import * as L from 'leaflet';

export class CenterControl extends L.Control {
    public onAdd(map: Map): HTMLElement {
        const container = L.DomUtil.create('div', 'leaflet-control-center leaflet-bar');
        const button = L.DomUtil.create('a', 'leaflet-control-center-btn', container);
        const icon = L.DomUtil.create('ion-icon', '', button);
        icon.name = 'locate-outline';

        return container;
    }

    public onRemove(map: Map): void {
        // nothing to do here
    }
}
