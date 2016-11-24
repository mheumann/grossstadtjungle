import { Map } from 'leaflet';
import * as L from 'leaflet';

export class CenterControl implements L.Control {
    private options: L.ControlOptions;

    constructor(options: L.ControlOptions = {position: 'topleft'}) {
        this.options = options;
    }

    public getPosition(): L.ControlPosition {
        return this.options.position;
    }

    public setPosition(position: L.ControlPosition): this {
        let map = (<any>window)._map;

        if (map) {
            map.removeControl(this);
        }

        this.options.position = position;

        if (map) {
            map.addControl(this);
        }

        return this;
    }

    public getContainer(): HTMLElement {
        return (<any>window)._container;
    }

    public addTo(map: Map): this {
        this.remove();
        (<any>window)._map = map;

        var container = (<any>window)._container = this.onAdd(map),
            pos = this.getPosition(),
            corner = (<any>map)._controlCorners[pos];

        L.DomUtil.addClass(container, 'leaflet-control');

        if (pos.indexOf('bottom') !== -1) {
            corner.insertBefore(container, corner.firstChild);
        } else {
            corner.appendChild(container);
        }

        return this;
    }

    public remove(): this {
        if (!(<any>window)._map) {
            return this;
        }

        L.DomUtil.remove((<any>window)._container);

        if (this.onRemove) {
            this.onRemove((<any>window)._map);
        }

        (<any>window)._map = null;

        return this;
    }

    public onAdd(map: Map): HTMLElement {
        let container = L.DomUtil.create('div', 'leaflet-control-center leaflet-bar');
        L.DomUtil.create('a', 'leaflet-control-center-btn icon-center', container);
        
        return container;
    }

    public onRemove(map: Map): void {
        // nothing to do here
    }
}