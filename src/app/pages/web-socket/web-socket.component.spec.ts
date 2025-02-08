import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebSocketComponent } from './web-socket.component';

describe('WebSocketComponent', () => {
  let component: WebSocketComponent;
  let fixture: ComponentFixture<WebSocketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebSocketComponent]
    });
    fixture = TestBed.createComponent(WebSocketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
