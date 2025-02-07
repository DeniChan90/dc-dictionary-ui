import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'languages'
})
export class LanguagesPipe implements PipeTransform {

    transform(value: any[], filter: any): unknown {
        if (!value || !filter) {
            return value;
        }
        return value.filter((item: any) => item.lang.code !== filter.defaultLang);
    }

}
