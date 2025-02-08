import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    private socket$: WebSocketSubject<any>;

    constructor() {
        this.socket$ = webSocket({
            url: `${environment.wsUrl}/chat`,
            openObserver: {
                next: (e: any) => {
                    this.sendMessage("connected")
                }
            },
            closeObserver: {
                next: () => {
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
                    try {
                        return JSON.parse(event.data);

                    } catch (e) {
                        return event.data;
                    }
                } else {
                    return '';
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
        this.sendMessage('Closingg...')
        this.socket$.complete();
    }
}
