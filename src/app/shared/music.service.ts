import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Musica } from '../shared/models/musica.model';
import { Playlist } from '../shared/models/playlist.model';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/map';

@Injectable()
export class MusicService {
	
	private serviceMusicUrl: string = 'http://localhost:9091/api/';
	private servicePlaylistUrl: string = 'http://localhost:9092/api/';

	constructor(private http: Http) {}

	getMusicas(params: string): Observable<Musica[]> {

		return this.http.get(this.serviceMusicUrl +'musicas/'+this.resolveUrl('filtro', params))
					.map((res: Response) => res.json().map((musica: Musica) => new Musica().deserialize(musica)));
	}

	getPlaylist(params: string): Observable<Playlist> {

		return this.http.get(this.servicePlaylistUrl +'playlists/'+this.resolveUrl('user', params))
					.map((playlist: Response) => new Playlist().deserialize(playlist.json()));
	}

	putPlaylist(playlistId: string): Observable<Response> {

		let requestUrl: string = this.servicePlaylistUrl + 'playlists/'+playlistId+'/musicas';
		console.log("Performing PUT request on: " + requestUrl);
		return this.http.put(requestUrl, {});
	}

	deleteFromPlaylist(playlistId: string, musicaId: string): Observable<Response> {

		let requestUrl: string = this.servicePlaylistUrl + 'playlists/'+playlistId+'/musicas/'+musicaId;
		console.log("Performing DELETE request on: " + requestUrl);
		return this.http.delete(requestUrl);
	}

	private resolveUrl(key:string, params: string) {

		if (params.length > 0)
			return "?"+key+"="+params;
		return "";
	}
}