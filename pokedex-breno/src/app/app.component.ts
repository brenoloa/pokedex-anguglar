import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NgForOf, NgIf, NgOptimizedImage, TitleCasePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  nomePokemon: string = '';
  dadosPokemon: any = null;
  erro: boolean = false;

  spritesAnimados: string[] = [];
  spriteAtual: number = 0;
  intervalo: any;

  constructor(private http: HttpClient) {}

  buscarPokemon() {
    const nome = this.nomePokemon.toLowerCase().trim();
    if (!nome) return;

    this.http.get(`https://pokeapi.co/api/v2/pokemon/${nome}`).subscribe({
      next: (res: any) => {
        this.dadosPokemon = res;
        this.erro = false;
        this.configurarAnimacaoSprites(res.id);
      },
      error: () => {
        this.dadosPokemon = null;
        this.erro = true;
        clearInterval(this.intervalo);
      }
    });
  }

  configurarAnimacaoSprites(id: number) {
    const base = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue`;
    this.spritesAnimados = [
      `${base}/${id}.png`,
      `${base}/gray/${id}.png`,
      `${base}/transparent/${id}.png`,
    ];

    this.spriteAtual = 0;
    clearInterval(this.intervalo);
    this.intervalo = setInterval(() => {
      this.spriteAtual = (this.spriteAtual + 1) % this.spritesAnimados.length;
    }, 500); // troca a cada 0.5 segundos
  }
}
