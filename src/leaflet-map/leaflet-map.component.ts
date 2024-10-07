import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import * as L from 'leaflet';
import { Language } from '@maptiler/sdk';
import * as maptiler from '@maptiler/sdk';
import {MapService} from "./map.service";
@Component({
  selector: 'app-leaflet-map',
  standalone: true,
  imports: [],
  templateUrl: './leaflet-map.component.html',
  styleUrl: './leaflet-map.component.css'
})
export class LeafletMapComponent implements OnInit, AfterViewInit {
  private map: L.Map | undefined;

  ngOnInit(): void {
    this.initMap();
  }
  constructor(private elementRef: ElementRef,
              private mapService: MapService) { }



  private initMap(): void {
    this.map = L.map('map').setView([21.027, 105.854], 12);
    this.mapService.createTileLayer().addTo(this.map);
  }

  ngAfterViewInit() {
  }
}
