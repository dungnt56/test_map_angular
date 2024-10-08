import {inject, Injectable} from '@angular/core';
import * as L from 'leaflet';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'  // MapService là singleton toàn cục
})
export class MapService {
  // Dùng Map để quản lý nhiều bản đồ theo containerId
  private maps: Map<string, L.Map> = new Map();
  // Khởi tạo bản đồ và lưu theo containerId
  initMap(containerId: string, center: [number, number], zoom: number): L.Map {
    const map = L.map(containerId).setView(center, zoom);
    this.maps.set(containerId, map);
    return map;
  }

  // Lấy bản đồ theo containerId
  getMap(containerId: string): L.Map | undefined {
    return this.maps.get(containerId);
  }

  // Kiểm tra nếu bản đồ đã được khởi tạo
  private ensureMapInitialized(containerId: string): void {
    if (!this.maps.has(containerId)) {
      throw new Error('Map is not initialized for container ' + containerId);
    }
  }

  // Thêm lớp tile vào bản đồ
  addTileLayer(containerId: string): void {
    this.ensureMapInitialized(containerId);
    const map = this.maps.get(containerId)!;
    L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=vi', {
      minZoom: 4,
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      noWrap: true
    }).addTo(map);
  }

  // Thêm sự kiện click vào bản đồ
  addClickEvent(containerId: string, callback: (e: L.LeafletMouseEvent) => void): void {
    this.ensureMapInitialized(containerId);
    const map = this.maps.get(containerId)!;
    map.on('click', callback);
  }

  // Thêm marker vào bản đồ
  addMarker(containerId: string, latlng: [number, number], popupContent?: string): L.Marker {
    this.ensureMapInitialized(containerId);
    const map = this.maps.get(containerId)!;
    const marker = L.marker(latlng).addTo(map);
    if (popupContent) {
      marker.bindPopup(popupContent);
    }
    return marker;
  }

  // Thêm polygon (geoJSON) vào bản đồ
  addPolygon(containerId: string, geoJsonData: any, style?: L.PathOptions | null): void {
    this.ensureMapInitialized(containerId);
    const map = this.maps.get(containerId)!;
    if (!style) {
      style = this.getDefaultStyle();
    }
    const polygon = L.geoJSON(geoJsonData, { style }).addTo(map);
    // Có thể gọi map.fitBounds nếu cần tự động zoom theo polygon
    // map.fitBounds(polygon.getBounds());
  }

  // Phong cách mặc định cho polygon
  getDefaultStyle(): L.PathOptions {
    return {
      fillColor: '#ffffff',   // Màu nền (đặt bất kỳ màu nào, nhưng sẽ không hiển thị vì fillOpacity = 0)
      fillOpacity: 0,         // Nền trong suốt
      weight: 1,              // Độ dày của đường viền
      color: '#ff0000',       // Màu viền đỏ
      dashArray: '1, 1',      // Nét đứt (số đầu là chiều dài nét, số thứ hai là khoảng trống giữa các nét)
      opacity: 1
    };
  }

  // Dọn dẹp bản đồ khi component bị hủy
  destroyMap(containerId: string): void {
    this.ensureMapInitialized(containerId);
    const map = this.maps.get(containerId);
    if (map) {
      map.remove();  // Dọn dẹp tài nguyên bản đồ
      this.maps.delete(containerId);  // Xóa bản đồ khỏi Map
    }
  }
}
