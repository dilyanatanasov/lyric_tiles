import {Component, OnInit} from "@angular/core";
import {Song, SongLyric, SongUrl} from "../../../../interfaces/Song";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LYRICS_CATEGORY} from "../../../../enums/LYRICS_CATEGORY";
import {SongService} from "../services/song.service";
import {SAFE_PIPE_TYPES_ENUM, SafePipe} from "../helpers/SafePipe";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: "app-song-details",
  templateUrl: "./song-details.component.html",
  styleUrls: ["./song-details.component.scss"]
})
export class SongDetailsComponent implements OnInit {
  private id: string = "";
  public song: Song | undefined = {} as Song;
  public url: SafeUrl | undefined;
  public parts: SongLyric[] = [];
  public form: FormGroup | undefined;

  public categoryType = LYRICS_CATEGORY;
  public safePipeTypes = SAFE_PIPE_TYPES_ENUM;
  private safePipe: SafePipe = new SafePipe(this.domSanitizer);

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private domSanitizer: DomSanitizer,
    public songService: SongService = new SongService()
  ) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params["id"];
    this.getSong(this.id);
  }

  private getSong(id: string) {
    this.http.get(`http://localhost:8000/api/song/${this.id}`)
      .subscribe((song: any) => {
        this.song = song.song;
        console.log({songUrl: song.song.songUrl})
        const reg = new RegExp(/(?<=watch\?v=)(.*?)(?=\&)/);
        const newUrl = "http://youtube.com/embed/" + reg.exec(song.song.songUrl)![0];

        this.url = this.safePipe.transform(newUrl, SAFE_PIPE_TYPES_ENUM.RESOURCE_URL);
        this.initForm();
        for (let lyric of this.song?.lyrics!) {
          this.addSection(lyric.category, lyric.content);
        }
        this.form?.patchValue({
          title: this.song?.title
        });
      })
  }

  private initForm() {
    this.form = new FormGroup({
      "title": new FormControl("", [Validators.required, Validators.maxLength(15)])
    })
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
    console.log({form: this.form})
    for (let index in this.parts) {
      const id = parseInt(index) + 1;
      console.log({value: this.form?.value[`lyric-${id}`]})
      lyrics.push({
        category: this.parts[index].category,
        content: this.form?.value[`lyric-${id}`]
      })
    }
    const song = {
      title: this.form?.value.title,
      lyrics
    }
    console.log({song});
    this.http.put(`http://localhost:8000/api/song/${this.id}`, song)
      .subscribe((song: any) => {})
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
}
