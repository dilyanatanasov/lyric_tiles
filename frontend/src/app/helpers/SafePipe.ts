// Angular
import {Pipe, PipeTransform} from "@angular/core";
import {DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl} from "@angular/platform-browser";

export enum SAFE_PIPE_TYPES_ENUM {
  HTML = "html",
  STYLE = "style",
  SCRIPT = "script",
  URL = "url",
  RESOURCE_URL = "resourceUrl"
}
/**
 * Sanitize HTML
 */
@Pipe({
  name: "safe"
})
export class SafePipe implements PipeTransform {
  /**
   * Pipe Constructor
   *
   * @param _sanitizer: DomSanitezer
   */
  // tslint:disable-next-line
  constructor(protected _sanitizer: DomSanitizer) {
  }

  /**
   * Transform
   *
   * @param value: string
   * @param type: string
   */
  transform(value: string, type: SAFE_PIPE_TYPES_ENUM): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
      case SAFE_PIPE_TYPES_ENUM.HTML:
        return this._sanitizer.bypassSecurityTrustHtml(value);
      case SAFE_PIPE_TYPES_ENUM.STYLE:
        return this._sanitizer.bypassSecurityTrustStyle(value);
      case SAFE_PIPE_TYPES_ENUM.SCRIPT:
        return this._sanitizer.bypassSecurityTrustScript(value);
      case SAFE_PIPE_TYPES_ENUM.URL:
        return this._sanitizer.bypassSecurityTrustUrl(value);
      case SAFE_PIPE_TYPES_ENUM.RESOURCE_URL:
        return this._sanitizer.bypassSecurityTrustResourceUrl(value);
      default:
        return this._sanitizer.bypassSecurityTrustHtml(value);
    }
  }
}
