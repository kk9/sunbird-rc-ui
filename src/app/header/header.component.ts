import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AppConfig } from '../app.config';
import { SchemaService } from '../services/data/schema.service';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from "../../app/services/theme/theme.service";

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  @Input() headerFor: string = 'default';
  @Input() tab: string;
  logo;
  languages: any;
  headerSchema;
  langCode: string;
  lang;
  themeName: string;
  constructor(
    public router: Router, private config: AppConfig, public schemaService: SchemaService,
    public translate: TranslateService, private themeService: ThemeService
  ) { }

  async ngOnInit() {
    this.languages = JSON.parse(localStorage.getItem('languages'));
    this.langCode = localStorage.getItem('setLanguage');
    this.themeName = localStorage.getItem('themeName');

    if (!this.themeName) {
      localStorage.setItem('themeName', "default");
    }

    this.logo = this.config.getEnv('logoPath');
    this.schemaService.getHeaderJSON().subscribe(async (HeaderSchemas) => {
      var filtered = HeaderSchemas.headers.filter(obj => {
        return Object.keys(obj)[0] === this.headerFor;
      });
      this.headerSchema = filtered[0][this.headerFor];
    }, (error) => {
      console.error('headers.json not found in src/assets/config/ - You can refer to examples folder to create the file')
    });
  }

  languageChange(lang) {
    if (this.langCode != lang.target.value) {
      lang = lang.target.value;
      localStorage.setItem('setLanguage', lang);
      window.location.reload();
    }
  }

  changeTheme() {
    if (this.themeName == 'default') {
      this.themeName = "dark";
    } else {
      this.themeName = "default";
    }

    this.themeService.setTheme(this.themeName);
    localStorage.setItem('themeName', this.themeName);


  }

}

