import {inject, Injectable} from '@angular/core';
import * as L from 'leaflet';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'  // MapService là singleton toàn cục
})
export class MapService {
  private maps: Map<string, L.Map> = new Map();

  // Khởi tạo bản đồ và lưu theo containerId
  initMap(containerId: string, center: [number, number], zoom: number): L.Map {
    const map = L.map(containerId).setView(center, zoom);
    this.maps.set(containerId, map);
    return map;
  }

  setDefaultView(containerId: string){
    const map = this.getMap(containerId);
    map?.setView([21.028511, 105.804817], 13);
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

  addMarkers(containerId: string, villas: Array<{ name: string, latitude: number, longitude: number }>): L.Marker[] {
    this.ensureMapInitialized(containerId);
    let villaMarkers: L.Marker[] = [];

    const map = this.maps.get(containerId)!;

    villas.forEach(villa => {

      const marker = L.marker([villa.latitude, villa.longitude], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.5279 9.33305C7.5279 9.42965 7.60624 9.50805 7.7029 9.50805H9.10873C9.20539 9.50805 9.28373 9.42965 9.28373 9.33305V5.66388C9.28373 5.56722 9.20539 5.48888 9.10873 5.48888H7.7029C7.60624 5.48888 7.5279 5.56722 7.5279 5.66388V9.33305ZM4.89123 9.33305C4.89123 9.42965 4.96957 9.50805 5.06623 9.50805H6.4779C6.57456 9.50805 6.6529 9.42965 6.6529 9.33305V5.66388C6.6529 5.56722 6.57456 5.48888 6.4779 5.48888H5.06623C4.96957 5.48888 4.89123 5.56722 4.89123 5.66388V9.33305ZM2.2604 9.33305C2.2604 9.42965 2.33876 9.50805 2.4354 9.50805H3.84124C3.93789 9.50805 4.01624 9.42965 4.01624 9.33305V5.66388C4.01624 5.56722 3.93789 5.48888 3.84124 5.48888H2.4354C2.33876 5.48888 2.2604 5.56722 2.2604 5.66388V9.33305ZM5.77207 2.9741C6.01707 2.9741 6.20957 3.1666 6.20957 3.40577V3.4116C6.20957 3.6566 6.01707 3.8491 5.77207 3.8491C5.5329 3.8491 5.33457 3.6566 5.33457 3.4116C5.33457 3.17244 5.5329 2.9741 5.77207 2.9741ZM11.2787 11.0008L11.0571 9.97413C10.9929 9.7058 10.7537 9.50805 10.4796 9.50805H10.3337C10.2371 9.50805 10.1587 9.42965 10.1587 9.33305V5.6633C10.1587 5.56664 10.2371 5.48824 10.3337 5.48824H10.5554C10.9521 5.48824 11.2729 5.16746 11.2729 4.77077V4.43244C11.2729 4.18744 11.1504 3.95994 10.9462 3.8316L6.1629 0.751602C5.92373 0.594102 5.6204 0.594102 5.38123 0.746352L0.603738 3.8316C0.393738 3.96635 0.271238 4.18744 0.271238 4.43244V4.77077C0.271238 5.16746 0.592072 5.48824 0.988738 5.48824H1.2104C1.30706 5.48824 1.3854 5.56664 1.3854 5.6633V9.33305C1.3854 9.42965 1.30706 9.50805 1.2104 9.50805H1.06457C0.790405 9.50805 0.551238 9.7058 0.487072 9.97413L0.265405 11.0008C0.224572 11.1757 0.265405 11.3566 0.382072 11.4966C0.492905 11.6366 0.662071 11.7124 0.837071 11.7124H10.7071C10.8879 11.7124 11.0512 11.6366 11.1621 11.4966C11.2787 11.3566 11.3196 11.1757 11.2787 11.0008Z" fill="#73A74A"/>
          </svg> <p>${villa.name}</p>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      });
      marker.addTo(map);

      marker.on('click', () => {
        map.setView([villa.latitude, villa.longitude], 20);
      });
      marker.on('click', () => {
        marker.openPopup();
      });
      villaMarkers.push(marker);
    });
    return villaMarkers;
  }

  clearAllMarkers(containerId: string, listMarkers: L.Marker[]): L.Marker[] {
    this.ensureMapInitialized(containerId);
    const map = this.maps.get(containerId)!;
    listMarkers.forEach(marker => {
      map.removeLayer(marker);
    });

    // Sau khi xóa hết, làm trống mảng marker
    return [];
  }
  // Thêm polygon (geoJSON) vào bản đồ
  addPolygon(containerId: string, geoJsonData: any, style?: L.PathOptions | null): void {
    this.ensureMapInitialized(containerId);
    const map = this.maps.get(containerId)!;
    if (!style) {
      style = this.getDefaultStyle();
    }
    const polygon = L.geoJSON(geoJsonData, { style }).addTo(map);
    polygon.on('click', () => {
      map.fitBounds(polygon.getBounds());
    });
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
