import { Component, OnInit } from '@angular/core';
import { MusicaService } from '../musicas.service';
import { MusicService } from '../shared/music.service';
import { Musica } from '../shared/models/musica.model';
import { Playlist } from '../shared/models/playlist.model';
import { ToastrService } from '../shared/toastr.service';

import { Observable } from 'rxjs/Rx';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  musicas: Musica[];
  playlist: Playlist = new Playlist();
  musicasPlaylist: Array<Musica> = new Array<Musica>();
  selectedSongs: Array<Musica> = new Array<Musica>();
  enqueuedDeletion: Musica;

  constructor(private toastr: ToastrService, private musicService: MusicService) { }


  ngOnInit() {

    this.musicService.getMusicas('bruno')
        .subscribe( (data) => this.musicas = data );
  }

  loadPlaylist(nomeUsuario: string) {

    this.musicService.getPlaylist(nomeUsuario)
        .subscribe((data: Playlist) => {
          this.playlist = data;
          this.musicasPlaylist = this.fetchSongsFromPlaylist(data.playlistMusicas);
        });
    this.selectedSongs = [];
  }

  public atualizarPlaylist(musica: Musica): void {

    let index = this.selectedSongs.indexOf(musica);
    if (index < 0) {
      this.selectedSongs.push(musica);
      return;
    }
    this.selectedSongs.splice(index, 1);
  }

  addSongToPlaylist() {

    if (this.selectedSongs.length > 0)
      this.toastr.success("Acabamos de adicionar "+this.selectedSongs.length+" música(s) à sua playlist.", "Adicionando músicas");
    else
      this.toastr.warning("A música desejada não foi selecionada ou já se encontra na playlist.", "Adicionando músicas");
    this.safelyAddSongsToPlaylist();
    this.musicService.putPlaylist(this.playlist.id)
      .subscribe((data: any) => {
        console.log("Put status: ",data.status);
      });
    this.selectedSongs = [];
  }

  removerMusicas() {
    
    if (!this.enqueuedDeletion)
      return;
    let index = this.musicasPlaylist.indexOf(this.enqueuedDeletion);
    
    if (index >= 0) {
      this.musicasPlaylist.splice(index, 1);
      this.musicService.deleteFromPlaylist(this.playlist.id, this.enqueuedDeletion.id)
          .subscribe((data:any) => {
            console.log("Delete status: ",data.status)
            this.toastr.error("A música selecionada foi removida da sua playlist.", "Remoção de música");
          });
    }

    this.enqueuedDeletion = undefined;
  }

  public updateEnqueuedDeletion(musica: Musica) {
    
    if (!musica)
      return;
    this.enqueuedDeletion = musica;
  }

  private safelyAddSongsToPlaylist() {

    this.selectedSongs.forEach((musica: Musica) => {
      if (this.musicasPlaylist.indexOf(musica) < 0)
        this.musicasPlaylist.push(musica);
    });
  }

  private fetchSongsFromPlaylist(playlistSongs: any) {
    let ret: Musica[] = [];
    playlistSongs.forEach(data => {
      ret.push(data.musica);
    })
    return ret;
  }
}
