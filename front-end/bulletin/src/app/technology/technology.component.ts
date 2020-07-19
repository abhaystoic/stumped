import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';
import { SplashService } from '../splash.service';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.css', '../global.css']
})
export class TechnologyComponent implements OnInit {
  technologyNews;
  displayPositiveNews;
  showSplash: boolean = true;

  constructor(private apiService: ApiService, private splashService:SplashService) { }

  ngOnInit(): void {
    setTimeout(() =>this.splashService.updateSplashState(true), 0);
    this.apiService.getTechnologyNews().subscribe((data) => {
      this.technologyNews = data['articles'];
      setTimeout(() =>this.splashService.updateSplashState(true), 2000);
    });
    // setTimeout(() =>{
    //   this.technologyNews = [{"author":null, "negativity": 0.20, "positivity": 0.40, "neutrality": 0.40, "content":"The woman is one of more than 235,000 confirmed coronavirus cases in Spain.(Representational)\r\nMadrid: After months in a Madrid hospital fighting off the virus that nearly killed her, Rosa Maria Fern… [+4592 chars]","description":"After months in a Madrid hospital fighting off the virus that nearly killed her, Rosa Maria Fernandez is now learning the basics again: walking, speaking and using cutlery.","publishedAt":"2020-05-25T12:20:24Z","source":{"id":null,"name":"Ndtv.com"},"title":"After Brush With Death, Coronavirus Survivor Learns To Speak, Walk Again - NDTV","url":"https://www.ndtv.com/world-news/after-brush-with-death-spanish-coronavirus-survivor-learns-to-speak-walk-again-2234876","urlToImage":"https://c.ndtvimg.com/2020-05/b96nfmc4_coronavirus-spain-afp-650_625x300_25_May_20.jpg"},{"author":"PTI","content":null,"description":"India Business News:  The Supreme Court on Monday allowed Air India to keep the middle seats occupied while operating its non-scheduled flights to bring back Indians stran","publishedAt":"2020-05-25T12:20:13Z","source":{"id":"the-times-of-india","name":"The Times of India"},"title":"SC allows Air India to operate flights till June 6 with middle seats filled to fly stranded Indians - Times of India","url":"https://timesofindia.indiatimes.com/business/india-business/sc-allows-air-india-to-fly-for-10-days-with-middle-seats-filled-in-scheduled-aircraft/articleshow/75967561.cms","urlToImage":"https://static.toiimg.com/thumb/msid-75967554,width-1070,height-580,imgsize-91759,resizemode-75,overlay-toi_sw,pt-32,y_pad-40/photo.jpg"},{"author":"Ramesh Babu","content":"Kerala government on Monday constituted a special investigation team (SIT), headed by Ernakulam rural superintendent of police (SP) K Karthick, to probe the attack on a film set by a little known rig… [+1574 chars]","description":"The film set, a replica of a church, erected near a temple at Aluva in Kerala’s central Ernakulam district, was demolished on Sunday night by a group of people owing allegiance to AHA and later they posted a video of the attack on social media.","publishedAt":"2020-05-25T12:14:00Z","source":{"id":null,"name":"Hindustantimes.com"},"title":"Film set vandalised by right-wing group, Kerala CM promises strong action - Hindustan Times","url":"https://www.hindustantimes.com/india-news/film-set-vandalised-by-right-wing-group-kerala-cm-promises-strong-action/story-sUdVmktLtSgQ0usTMNEmvO.html","urlToImage":"https://www.hindustantimes.com/rf/image_size_960x540/HT/p2/2020/05/25/Pictures/_ec78297a-9e80-11ea-8b22-f47c01eaa370.png"},{"author":"Roydon Cerejo","content":"Fujifilm has finally launched it's X-T4 flagship X series mirrorless camera in India, after its global announcement in February. Fujifilm India had an online event where top-level executives made the… [+2998 chars]","description":"Fujifilm has launched the X-T4 mirrorless camera in India for a body-only price of Rs. 1,54,999. The camera succeeds the popular X-T3 camera, which has been hailed as one of the best premium APS-C mirrorless cameras out there.","publishedAt":"2020-05-25T11:32:59Z","source":{"id":null,"name":"Ndtv.com"},"title":"Fujifilm X-T4 Flagship X Series Mirrorless Camera With In-Body Stabilisation Launched in India - Gadgets 360","url":"https://gadgets.ndtv.com/cameras/news/fujifilm-x-t4-camera-india-launch-price-specifications-offers-bundles-2234764","urlToImage":"https://i.gadgets360cdn.com/large/fujifilm_x-t4_india_launch_cover_1590400278775.jpg"},{"author":"Hormaz Fatakia","content":"","description":"HDFC’s Q4 profit fell 22% year-on-year to Rs 2,232.5 crore on the back of net interest income that rose 12.77% to Rs 3,540 crore.","publishedAt":"2020-05-25T11:03:45Z","source":{"id":null,"name":"Bloombergquint.com"},"title":"HDFC Q4 Results: Profit Falls By More Than A Fifth As Provisions Spike - BloombergQuint","url":"https://www.bloombergquint.com/quarterly-earnings/hdfc-q4-results-profit-dips-22-as-covid-19-related-provisions-spike","urlToImage":"https://gumlet.assettype.com/bloombergquint%2F2019-05%2Fdb89cb5c-3fe9-4068-85d7-3eee7478b71a%2Fm1024753.jpg?rect=0%2C51%2C2850%2C1496&w=1200&auto=format%2Ccompress&ogImage=true"},{"author":"Karishma Mehrotra","content":"The fresh findings are an extension of previously published research by Biswas and Distinguished NIBG Professor Partha Majumder. (Source: Getty)A new examination of 327 genome sequences from India sh… [+4034 chars]","description":"This subtype, called A2a, also shows a larger prevalence across the globe — crucial information for vaccine development and disease monitoring from Calcutta’s National Institute of Biomedical Genomics (NIBG).","publishedAt":"2020-05-25T11:02:59Z","source":{"id":null,"name":"Indianexpress.com"},"title":"Early genome sequencing in India shows dominant Covid-19 strain matches global patterns - The Indian Express","url":"https://indianexpress.com/article/coronavirus/covid-19-genome-sequence-india-6426561/","urlToImage":""}];
    //   this.splashService.updateSplashState(false);
    // }, 2000);
  }

}
