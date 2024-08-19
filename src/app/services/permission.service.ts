import { Injectable } from '@angular/core';
import {Geolocation, PermissionStatus} from "@capacitor/geolocation";
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private locationPermission = new Subject<boolean>();

  constructor() { }

  public checkGeolocationPermission(): Observable<boolean> {
    Geolocation.checkPermissions().then(this.handlePermissionStatus);
    return this.locationPermission.asObservable();
  }

  private handlePermissionStatus = (status: PermissionStatus) => {
    switch (status.location) {
      case 'prompt' || 'prompt-with-rationale':
        console.log(status);
        Geolocation.requestPermissions({permissions: ['location']}).then(this.handleGeolocationStatus);
        break;
      case 'granted':
        this.handleGeolocationStatus(status);
        break;
      case "denied":
      default:
        Geolocation.requestPermissions({permissions: ['location']}).then(this.handlePermissionStatus);
    }
  };

  private handleGeolocationStatus = (status: PermissionStatus) => {
    if (status.location === 'granted') {
      this.locationPermission.next(true);
    } else {
      this.locationPermission.next(false);
      alert('Du musst der App Zugriff auf deinen Standort geben!');
    }
  };
}
