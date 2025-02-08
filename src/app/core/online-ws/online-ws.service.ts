import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OnlineWsService {
    public socket$: WebSocketSubject<any>;

    constructor() {
        this.socket$ = webSocket({
            url: `${environment.wsUrl}/online`,
            openObserver: {
                next: (e: any) => {
                    this.sendMessage("connected")
                }
            },
            closeObserver: {
                next: () => {
                    console.log("Close observer...")
                    this.sendMessage("CLOSED CONNECTION")
                }
            },
            closingObserver: {
                next: (e: any) => {
                    this.sendMessage("disconnected")
                }
            },
            deserializer(event: any) {
                if (event?.data) {
                    return event.data;
                } else {
                    return event;
                }

            }
        });
    }

    sendMessage(message: any) {
        this.socket$.next(message);
    }

    getMessages(): Observable<any> {
        return this.socket$.asObservable();
    }

    closeConnection() {
        this.socket$.complete();
    }
}

