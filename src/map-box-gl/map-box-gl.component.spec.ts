import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapBoxGlComponent } from './map-box-gl.component';

describe('MapBoxGlComponent', () => {
  let component: MapBoxGlComponent;
  let fixture: ComponentFixture<MapBoxGlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapBoxGlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapBoxGlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
