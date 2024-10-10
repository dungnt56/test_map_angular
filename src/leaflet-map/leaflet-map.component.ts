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
  private map!: L.Map;
  data = jsonData;
  private listMarkers: L.Marker[] = [];
  // markers: L.Marker[] = [];
  minZoomForMarkers = 13;

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.map = this.mapService.initMap(this.containerId, [21.028511, 105.804817], 13);
    this.mapService.addTileLayer(this.containerId);
    // this.addMarkers();
  }
  ngAfterViewInit(): void {
    this.addPolygonFromJson();
    this.addVillasToMap();
    this.map.on('zoomend', () => {
      this.toggleMarkersBasedOnZoom();
    });
  }

  ngOnDestroy(): void {
    this.mapService.destroyMap(this.containerId);
  }

  // addMarkers(): void {
  //   // Ví dụ thêm một số marker cho địa chỉ
  //   const marker1 = L.marker([21.0285, 105.8542]).bindPopup('Hà Nội').addTo(this.map);
  //   const marker2 = L.marker([21.0379, 105.8336]).bindPopup('Địa chỉ khác').addTo(this.map);
  //
  //   // Lưu các marker vào danh sách markers
  //   this.markers.push(marker1);
  //   this.markers.push(marker2);
  // }
  toggleMarkersBasedOnZoom(): void {
    const currentZoom = this.map.getZoom();

    this.listMarkers.forEach(marker => {
      if (currentZoom >= this.minZoomForMarkers) {
        if (!this.map.hasLayer(marker)) {
          marker.addTo(this.map);  // Hiển thị marker nếu zoom đủ lớn
        }
      } else {
        if (this.map.hasLayer(marker)) {
          this.map.removeLayer(marker);  // Ẩn marker nếu zoom nhỏ hơn mức yêu cầu
        }
      }
    });
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
      { name: "Villa 1", latitude: 21.076613, longitude: 105.804690 },
      { name: "Villa 2", latitude: 21.064254, longitude: 105.799443 },
      { name: "Villa 3", latitude: 21.029973, longitude: 105.851917 },
      { name: "Villa 4", latitude: 21.011527, longitude: 105.832765 },
      { name: "Villa 5", latitude: 21.025351, longitude: 105.799414 },
      { name: "Villa 6", latitude: 21.052961, longitude: 105.841210 },
      { name: "Villa 7", latitude: 21.029792, longitude: 105.806133 },
      { name: "Villa 8", latitude: 21.039675, longitude: 105.837836 },
    ];

    this.listMarkers = this.mapService.addMarkers(this.containerId, villas);
  }

}
