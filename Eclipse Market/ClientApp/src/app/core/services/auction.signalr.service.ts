import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { Bid } from "../models/bid.model";
import { AuctionDataService } from "./store/auction.data.service";

@Injectable({
  providedIn: "root",
})
export class AuctionSignalrService {
  hubConnection?: signalR.HubConnection;
  // private url = 'https://eclipsemarketapi.azurewebsites.net/auctionHub';
  private url = "http://localhost:5001/auctionHub";

  constructor(private auctionDataService: AuctionDataService) {}

  startConnection = (auctionId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const jwt = token !== null ? JSON.parse(token) : "";

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.url}?auctionId=${auctionId}`, {
        accessTokenFactory: () => jwt,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((err: any) => console.log(err));
  };

  stopConnection = () => {
    this.hubConnection?.stop();
  };

  bidCreateListener() {
    this.hubConnection?.on("BidCreateResponse", (resp: Bid) => {
      this.auctionDataService.addBid(resp);
    });
  }
}
