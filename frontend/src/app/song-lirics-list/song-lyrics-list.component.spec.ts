import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SongLyricsListComponent } from "./song-lyrics-list.component";

describe("SongLiricsListComponent", () => {
  let component: SongLyricsListComponent;
  let fixture: ComponentFixture<SongLyricsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SongLyricsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SongLyricsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
