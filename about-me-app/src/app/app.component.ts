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
  onMouseMove(event: MouseEvent): void {
    this.clientX = event.clientX;
    this.clientY = event.clientY;
    console.log(`client ${this.clientX} ${this.clientY}`);
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
