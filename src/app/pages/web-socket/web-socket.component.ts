import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/api/auth/auth.service';
import { WebSocketService } from 'src/app/core/web-socket/web-socket.service';

@Component({
    selector: 'app-web-socket',
    templateUrl: './web-socket.component.html',
    styleUrls: ['./web-socket.component.scss']
})
export class WebSocketComponent implements OnInit, OnDestroy {
    public messages: any[] = [];
    public form = new UntypedFormGroup({
        message: new UntypedFormControl(null)
    });

    private messageSubscription: Subscription | undefined;

    get message() {
        return this.form.controls['message'];
    }

    constructor(
        public authService: AuthService,
        private webSocketService: WebSocketService,
        private datePipe: DatePipe,
    ) { }


    ngOnInit() {
        this.messageSubscription = this.webSocketService.getMessages().subscribe(
            (message: any) => {
                if (typeof message === 'string' || typeof message === 'number') {
                    console.log('message', message)
                } else {
                    this.messages.push(message);
                }
            }
        );
    }

    sendMessage() {
        const userData = this.authService.tokenData;

        const message = {
            type: 'message', data: {
                message: this.message.value,
                user: `${userData.first_name} ${userData.last_name}`,
                userId: userData.User_id,
                created: this.datePipe.transform(new Date(), 'HH:mm:ss')
            }
        };
        this.webSocketService.sendMessage(message);
        this.message.setValue("");
    }


    ngOnDestroy() {
        this.messageSubscription?.unsubscribe();
        this.webSocketService.closeConnection();
    }
}
