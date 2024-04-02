import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrl: './info-page.component.scss'
})
export class InfoPageComponent {
  constructor(
    private route: ActivatedRoute,
  ) {}

  public detalis: string = '';
    
  ngOnInit() {
    this.route.params.subscribe(params => {
        const value = params['value'];
        this.detalis = value;
        console.log('Received value:', this.detalis);
    });
  }
}
