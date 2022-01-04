import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SongLyricsListComponent} from './song-lirics-list/song-lyrics-list.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";
import {FlexLayoutModule} from "@angular/flex-layout";
import {SongDetailsComponent} from './song-details/song-details.component';
import {MatButtonModule} from "@angular/material/button";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {CreateSongComponent} from './create-song/create-song.component';
import {SongService} from "./services/song.service";
import {SafePipe} from "./helpers/SafePipe";
import { SongManagementComponent } from './song-management/song-management.component';
import {MatChipsModule} from "@angular/material/chips";
import {BasicAuthInterceptor} from "./_helpers/basic-auth.interceptor";
import {ErrorInterceptor} from "./_helpers/error.interceptor";
import {fakeBackendProvider} from "./_helpers/fake-backend";
import {LoginComponent} from "./login/login.component";

@NgModule({
  declarations: [
    SafePipe,
    AppComponent,
    LoginComponent,
    SongLyricsListComponent,
    SongDetailsComponent,
    CreateSongComponent,
    SongManagementComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatListModule,
    MatCardModule,
    FlexLayoutModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatChipsModule
  ],
  providers: [
    SafePipe,
    SongService,
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
