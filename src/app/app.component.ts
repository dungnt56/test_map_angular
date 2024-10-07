import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MapBoxGlComponent} from "../map-box-gl/map-box-gl.component";
import {LeafletMapComponent} from "../leaflet-map/leaflet-map.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MapBoxGlComponent, LeafletMapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
}
