import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {data, Language} from '@maptiler/sdk';
import * as maptiler from '@maptiler/sdk';
import {MapService} from "./map.service";
import * as jsonData from "../assets/hanoi.json";
@Component({
  selector: 'app-leaflet-map',
  standalone: true,
  imports: [],
  templateUrl: './leaflet-map.component.html',
  styleUrl: './leaflet-map.component.css'
})
export class LeafletMapComponent implements OnInit, AfterViewInit, OnDestroy {
  private containerId = 'map';
  private map: L.Map | undefined;
  data = jsonData;
  private listMarkers: L.Marker[] = [];

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.map = this.mapService.initMap(this.containerId, [21.028511, 105.804817], 13);
    this.mapService.addTileLayer(this.containerId);
  }
  ngAfterViewInit(): void {
    this.addPolygonFromJson();
    this.addVillasToMap();
  }

  ngOnDestroy(): void {
    this.mapService.destroyMap(this.containerId);
  }

  private addPolygonFromJson(): void {
    const listDistrict = jsonData.level2s;

    listDistrict.forEach((district) => {
      const geoJsonData = {
        type: 'Feature',
        geometry: {
          type: 'MultiPolygon',
          coordinates: district.coordinates,
        },
      };

      this.mapService.addPolygon(this.containerId, geoJsonData, null);
    });
  }
  private addVillasToMap(): void {
    this.listMarkers = this.mapService.clearAllMarkers(this.containerId, this.listMarkers);
    const villas = [
      { name: "Villa 1", latitude: 21.028511, longitude: 105.804817 },
      { name: "Villa 2", latitude: 21.030042, longitude: 105.808444 },
      { name: "Villa 3", latitude: 21.032525, longitude: 105.811609 },
      { name: "Villa 4", latitude: 21.027444, longitude: 105.801377 },
      { name: "Villa 5", latitude: 21.025351, longitude: 105.799414 },
      { name: "Villa 6", latitude: 21.028322, longitude: 105.798249 },
      { name: "Villa 7", latitude: 21.029792, longitude: 105.806133 },
      { name: "Villa 8", latitude: 21.031441, longitude: 105.802974 },
      { name: "Villa 9", latitude: 21.033201, longitude: 105.807295 },
      { name: "Villa 10", latitude: 21.025113, longitude: 105.805009 },
      { name: "Villa 11", latitude: 21.027777, longitude: 105.811221 },
      { name: "Villa 12", latitude: 21.026347, longitude: 105.807439 },
      { name: "Villa 13", latitude: 21.032131, longitude: 105.804095 },
      { name: "Villa 14", latitude: 21.033732, longitude: 105.806001 },
      { name: "Villa 15", latitude: 21.034876, longitude: 105.802345 },
      { name: "Villa 16", latitude: 21.029144, longitude: 105.808732 },
      { name: "Villa 17", latitude: 21.031519, longitude: 105.803333 },
      { name: "Villa 18", latitude: 21.030973, longitude: 105.810498 },
      { name: "Villa 19", latitude: 21.027282, longitude: 105.807938 },
      { name: "Villa 20", latitude: 21.028959, longitude: 105.800877 },
      { name: "Villa 21", latitude: 21.031009, longitude: 105.805477 },
      { name: "Villa 22", latitude: 21.030318, longitude: 105.799102 },
      { name: "Villa 23", latitude: 21.032201, longitude: 105.801917 },
      { name: "Villa 24", latitude: 21.029348, longitude: 105.809444 },
      { name: "Villa 25", latitude: 21.025822, longitude: 105.803478 },
      { name: "Villa 26", latitude: 21.034452, longitude: 105.802927 },
      { name: "Villa 27", latitude: 21.028451, longitude: 105.800007 },
      { name: "Villa 28", latitude: 21.033751, longitude: 105.807731 },
      { name: "Villa 29", latitude: 21.032127, longitude: 105.810501 }
    ];

    this.listMarkers = this.mapService.addMarkers(this.containerId, villas);
  }

}
