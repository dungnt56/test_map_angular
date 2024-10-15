import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {data, Language} from '@maptiler/sdk';
import * as maptiler from '@maptiler/sdk';
import {MapService} from "./map.service";
import * as jsonData from "../assets/hanoi.json";
import * as turf from '@turf/turf';
import { FeatureCollection, Point, GeoJsonProperties } from 'geojson';

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

  constructor(private mapService: MapService) {
  }

  ngOnInit(): void {
    this.map = this.mapService.initMap(this.containerId, [21.028511, 105.804817], 13);
    this.mapService.addTileLayer(this.containerId);
    // this.addMarkers();
  }

  ngAfterViewInit(): void {
    this.addPolygonFromJson();
    // this.addPolygonFromJsonCustom();
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

  findDuplicateCoor(district1: any, district2: any){
    // const existsCoor: number[][] = [];
    const existsCoor: number[][] = [];
    district1.coordinates[0][0].forEach((coor: any) => {
      district2.coordinates[0][0].forEach((otherCoor: any) => {
        if (coor[0] === otherCoor[0] && coor[1] === otherCoor[1]) {
          existsCoor.push(coor);
        }
      });
    });
    return existsCoor;
  }

  private addPolygonFromJson(): void {
    this.drawPolygonBorderDistrict();

  // Duyệt qua các quận và thêm vào bản đồ
    const mapCoordinatesRemove = new Map();
    jsonData.level2s.forEach((district, index) => {
      mapCoordinatesRemove.set(index, []);
      jsonData.level2s.forEach((otherDistrict, otherIndex) => {
        if (index != otherIndex) {
          const existCoors = this.findDuplicateCoor(district, otherDistrict);
          if (existCoors.length > 0) {
            mapCoordinatesRemove.get(index).push(existCoors);
          }
        }
      });
    });
    jsonData.level2s.forEach((district, index) => {
      const coordinates = district.coordinates;
      // Tạo đối tượng geojson cho mỗi quận
      const geoJsonFeature = {
        "type": "Feature",
        "geometry": {
          "type": district.type,
          "coordinates": JSON.parse(JSON.stringify(coordinates))
          // "coordinates": coordinates
        }
      };

      const coordinatesToRemove = mapCoordinatesRemove.get(index);
      if (coordinatesToRemove.length > 0) {
        const totalCoorRemove: number[][] = [];
        if (coordinatesToRemove.length > 0) {
          coordinatesToRemove.forEach((coor: any) => {
            totalCoorRemove.push(...coor);
          });
        }
        const resultList = this.extractLinesFromCoordinates(geoJsonFeature.geometry.coordinates[0][0], totalCoorRemove);
        resultList.forEach((lineDraw)=> {
          const listCoor = lineDraw.map(coor => [coor[1], coor[0]]);

          // @ts-ignore
          L.polyline(listCoor, {
            color: 'red',       // Màu của đường
            weight: 3,          // Độ dày của đường
            dashArray: '0, 0',  // Nét liền
          }).addTo(this.map);
        });
        this.mapService.addPolygon(this.containerId, geoJsonFeature, {
          fillOpacity: 0,         // Nền trong suốt
          weight: 0,              // Độ dày của đường viền
          opacity: 0
        });
      }else {
        this.mapService.addPolygon(this.containerId, geoJsonFeature, null);
      }
    });

  }

  extractLinesFromCoordinates(districtCoordinates: number[][], coordinatesToRemove: number[][]): number[][][] {
    const updatedCoordinates = [...districtCoordinates];
    const indicesToRemove = this.getIndicesToRemove(updatedCoordinates, coordinatesToRemove);
    const result = [];

    if (indicesToRemove.length > 0) {
      if (this.isConsecutive(indicesToRemove)) {
        result.push(this.createSingleLine(updatedCoordinates, indicesToRemove));
      } else {
        result.push(...this.createSeparateLines(updatedCoordinates, indicesToRemove));
      }
    }

    return result;
  }

  getIndicesToRemove(coordinates: number[][], coordinatesToRemove: number[][]): number[] {
    return coordinates.reduce((indices, coordinate, index) => {
      if (coordinatesToRemove.some(removeCoordinate => coordinate[0] === removeCoordinate[0] && coordinate[1] === removeCoordinate[1])) {
        indices.push(index);
      }
      return indices;
    }, []).sort((a, b) => a - b);
  }

  createSingleLine(coordinates: number[][], indices: number[]): number[][] {
    return [...coordinates.slice(indices[indices.length - 1]), ...coordinates.slice(0, indices[0]+1)];
  }

  createSeparateLines(coordinates: number[][], indices: number[]): number[][][] {
    const lines = [];

    if (indices[0] !== 0) {
      lines.push(coordinates.slice(0, indices[1]));
    }

    for (let i = 0; i < indices.length; i++) {
      if (indices[i] + 1 !== indices[i + 1]) {
        lines.push(coordinates.slice(indices[i], indices[i + 2]));
      }
    }

    return lines;
  }
  isConsecutive(arr: number[]) {
    arr.sort((a, b) => a - b);
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] - arr[i - 1] !== 1) {
        return false;
      }
    }
    return true;
  }
  extractLinesFromCoordinates1(districtCoordinates: number[][], coordinatesToRemove: number[][]): number[][][] {
    const updatedCoordinates = [...districtCoordinates];

    const listIndexToRemove: number[] = [];
    updatedCoordinates.forEach((coor, index) => {
      coordinatesToRemove.forEach((removeCoor) => {
        if (coor[0] === removeCoor[0] && coor[1] === removeCoor[1] && !listIndexToRemove.includes(index)) {
          listIndexToRemove.push(index);
        }
      });
    });
    listIndexToRemove.sort((a, b) => a - b);
    const resultList: number[][][] = [];
    if (listIndexToRemove.length > 0) {
      if (this.isConsecutive(listIndexToRemove)) {
        const line = [];
        line.push(...updatedCoordinates.slice(listIndexToRemove[listIndexToRemove.length - 1]));
        line.push(...updatedCoordinates.slice(0, listIndexToRemove[0]+1));
        resultList.push(line);
      }else {
        if (listIndexToRemove[0] !== 0) {
          const line = [];
          line.push(...updatedCoordinates.slice(0, listIndexToRemove[1]));
          resultList.push(line);
        }
        for (let i = 0; i < listIndexToRemove.length; i++) {
          if (listIndexToRemove[i] + 1 !== listIndexToRemove[i + 1]) {
            const line = [];
            line.push(...updatedCoordinates.slice(listIndexToRemove[i], listIndexToRemove[i+2]));
            resultList.push(line);
          }
        }
      }
    }
    return resultList;
  }
  drawPolygonBorderDistrict(){
    const listDuplicateCoor: number[][][] = [];
    jsonData.level2s.forEach((district, index) => {
      jsonData.level2s.forEach((otherDistrict, otherIndex) => {
        if (index < otherIndex) {
          const existsCoor: number[][] = [];
          district.coordinates[0][0].forEach((coor) => {
            otherDistrict.coordinates[0][0].forEach((otherCoor) => {
              if (coor[0] === otherCoor[0] && coor[1] === otherCoor[1]) {
                existsCoor.push(coor);
              }
            });
          });
          if (existsCoor.length > 0){
            listDuplicateCoor.push(existsCoor);
          }
        }

      });
    });

    // @ts-ignore
    listDuplicateCoor.forEach((coor) => {
      // @ts-ignore
      const listCoor = coor.map((c) => {
        return [c[1], c[0]];
      });
      if (listCoor.length > 1 && listCoor[0][0] === listCoor[listCoor.length - 1][0] && listCoor[0][1] === listCoor[listCoor.length - 1][1]) {
        listCoor.shift();
      }
      // @ts-ignore
      L.polyline(listCoor, {
        color: 'blue',       // Màu của đường
        weight: 4,          // Độ dày của đường
        dashArray: '5, 10', // Nét đứt nếu cần
      }).addTo(this.map);
    });
    console.log('listDuplicateCoor', listDuplicateCoor);
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

  findSharedBorders(geojson1: any, geojson2: any) {
    const line1 = turf.polygonToLine(geojson1);
    const line2 = turf.polygonToLine(geojson2);
    return  turf.lineIntersect(line1, line2, {removeDuplicates: true, ignoreSelfIntersections: false});
  }
  addPolygonFromJsonCustom() {
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
}
