import { Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  isActive: Boolean;
  clientX: number;
  clientY: number;
  angleX: number;
  angleY: number;
  onMouseMove(event: MouseEvent): void {
    this.angleX = event.clientX;
    this.angleY = event.clientY;
    console.log(`client ${this.angleX} ${this.angleY}`);
  }
  onMouseDown(event: MouseEvent) {
    this.isActive = true;
    console.log(`isActive: ${this.isActive}`);
  }
  onMouseUp(event: MouseEvent) {
    this.isActive = false;
    console.log(`isActive: ${this.isActive}`);
  }
}
