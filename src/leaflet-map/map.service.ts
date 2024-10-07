import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map: L.Map | undefined;

  constructor() {}

  createTileLayer(): L.TileLayer {
    return L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=vi', {
      minZoom: 4,
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      noWrap: true,
    });
  }
  // Khởi tạo bản đồ
  initMap(containerId: string, center: [number, number], zoom: number): L.Map {
    this.map = L.map(containerId).setView(center, zoom);
    return this.map;
  }

  // Thêm lớp bản đồ
  addTileLayer(url: string, options: any): void {
    if (this.map) {
      L.tileLayer(url, options).addTo(this.map);
    }
  }

  // Thêm sự kiện click
  addClickEvent(callback: (e: L.LeafletMouseEvent) => void): void {
    if (this.map) {
      this.map.on('click', callback);
    }
  }

  // Thêm marker
  addMarker(latlng: [number, number], popupContent?: string): L.Marker {
    if (this.map) {
      const marker = L.marker(latlng).addTo(this.map);
      if (popupContent) {
        marker.bindPopup(popupContent);
      }
      return marker;
    }
    throw new Error('Map is not initialized');
  }

  setMap(map: L.Map) {
    this.map = map;
  }
  // Lấy đối tượng map
  getMap(): L.Map | undefined {
    return this.map;
  }
  addPolygon(geoJsonData: any, style?: L.PathOptions | null) {
    if (!this.map) {
      throw new Error('Map is not initialized');
    }
    if (!style) {
      style = this.getStyle();
    }
    const polygon = L.geoJSON(geoJsonData, { style }).addTo(this.map);
    // this.map.fitBounds(polygon.getBounds());
  }
  getStyle() {
    return {
      fillColor: '#a09191',
      weight: 1,
      opacity: 0.5,
      color: '#db1e1e',
      dashArray: '3',
      fillOpacity: 0.5
    };
  }
}
