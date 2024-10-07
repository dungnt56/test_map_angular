import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MapBoxGlComponent} from "../map-box-gl/map-box-gl.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MapBoxGlComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
}
