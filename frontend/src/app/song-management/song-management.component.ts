import {Component, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {Song, SongLyric, SongUrl} from "../../../../interfaces/Song";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LYRICS_CATEGORY} from "../../../../enums/LYRICS_CATEGORY";
import {SAFE_PIPE_TYPES_ENUM, SafePipe} from "../helpers/SafePipe";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {SongService} from "../services/song.service";
import {SONG_ROUTE_TYPE} from "../../../../enums/SONG_ROUTE_TYPE";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER} from '@angular/cdk/keycodes';

export interface Fruit {
  name: string;
}

@Component({
  selector: "app-song-management",
  templateUrl: "./song-management.component.html",
  styleUrls: ["./song-management.component.scss"]
})
export class SongManagementComponent implements OnInit {
  public type: SONG_ROUTE_TYPE | undefined;
  public song: Song | undefined = {} as Song;
  public url: SafeUrl | undefined;
  public songUrl: SongUrl = "";
  public parts: SongLyric[] = [];

  public form: FormGroup | undefined;

  public categoryType = LYRICS_CATEGORY;
  public songRouteType = SONG_ROUTE_TYPE;
  public safePipeTypes = SAFE_PIPE_TYPES_ENUM;

  private id: string = "";
  private safePipe: SafePipe = new SafePipe(this.domSanitizer);

  constructor(
    public songService: SongService = new SongService(),
    private route: ActivatedRoute,
    private http: HttpClient,
    private domSanitizer: DomSanitizer,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.type = this.route.snapshot.params["type"];
    switch (this.type) {
      case SONG_ROUTE_TYPE.CREATE:
        this.initFormCreate();
        break;
      case SONG_ROUTE_TYPE.UPDATE:
        this.id = this.route.snapshot.params["id"];
        this.getSong(this.id);
        break;
    }
    this.form?.get("songUrl")?.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      ).subscribe(val => {
      const reg = new RegExp(/(?<=watch\?v=)(.*?)(?=\&)/);
      const newUrl = "http://youtube.com/embed/" + reg.exec(val)![0] + "?loop=1&playlist=" + reg.exec(val)![0];
      this.url = this.safePipe.transform(newUrl, SAFE_PIPE_TYPES_ENUM.RESOURCE_URL);
    });
  }

  public addSection(category: LYRICS_CATEGORY, content?: string) {
    this.form?.addControl(`lyric-${this.parts.length + 1}`, new FormControl("", [Validators.required, Validators.maxLength(15)]));
    this.form?.patchValue({
      [`lyric-${this.parts.length + 1}`]: content ?? ""
    });
    this.parts.push({
      category,
      content: content ?? ""
    })
  }

  public updateSong() {
    let lyrics = [];
    for (let index in this.parts) {
      const id = parseInt(index) + 1;
      lyrics.push({
        category: this.parts[index].category,
        content: this.form?.value[`lyric-${id}`]
      })
    }
    const song = {
      title: this.form?.value.title,
      theme: this.form?.value.theme,
      lyrics
    }
    this.http.put(`http://localhost:8000/api/song/${this.id}`, song)
      .subscribe();
  }

  public removeSection(index: number) {
    this.parts.map((part, index) => {
      const content = this.form?.value[`lyric-${index + 1}`];
      return part.content = content
    })
    for (let i in this.parts) {
      const id = parseInt(i) + 1;
      this.form?.removeControl(`lyric-${id}`)
    }
    this.parts.splice(index, 1);
    for (let i in this.parts) {
      const id = parseInt(i) + 1;
      this.form?.addControl(`lyric-${id}`, new FormControl("", [Validators.required, Validators.maxLength(15)]));
      this.form?.patchValue({
        [`lyric-${id}`]: this.parts[i].content ?? ""
      });
    }
  }

  public duplicateSection(index: number) {
    this.form?.addControl(`lyric-${this.parts.length + 1}`, new FormControl("", [Validators.required, Validators.maxLength(15)]));
    this.form?.patchValue({
      [`lyric-${this.parts.length + 1}`]: this.parts[index].content ?? ""
    });
    this.parts.push(this.parts[index]);
  }

  public createSong() {
    this.parts.map((part, index) => {
      return part.content = this.form?.value[`lyric-${index + 1}`]
    })
    const song = {
      "title": this.form?.value.title,
      "theme": this.form?.value.theme,
      "lyrics": this.parts,
      "songUrl": this.form?.value.songUrl
    }
    this.http.post(`http://localhost:8000/api/song`, song)
      .subscribe(() => {
        this.router.navigateByUrl("").then(r => console.log(r));
      })
  }

  private initFormCreate() {
    this.form = new FormGroup({
      "title": new FormControl("", [Validators.required, Validators.maxLength(15)]),
      "theme": new FormControl(""),
      "songUrl": new FormControl("", [Validators.required])
    })
  }

  private initFormUpdate() {
    this.form = new FormGroup({
      "title": new FormControl("", [Validators.required, Validators.maxLength(15)]),
      "theme": new FormControl("")
    })
  }

  private getSong(id: string) {
    this.http.get(`http://localhost:8000/api/song/${this.id}`)
      .subscribe((song: any) => {
        this.song = song.song;
        const reg = new RegExp(/(?<=watch\?v=)(.*?)(?=\&)/);
        const newUrl = "http://youtube.com/embed/" + reg.exec(song.song.songUrl)![0] + "?loop=1&playlist=" + reg.exec(song.song.songUrl)![0];

        this.url = this.safePipe.transform(newUrl, SAFE_PIPE_TYPES_ENUM.RESOURCE_URL);
        this.initFormUpdate();
        for (let lyric of this.song?.lyrics!) {
          this.addSection(lyric.category, lyric.content);
        }
        this.form?.patchValue({
          title: this.song?.title,
          theme: this.song?.theme
        });
      })
  }
}

