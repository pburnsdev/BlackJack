import { Component, OnInit } from '@angular/core';
import { Card, Deck } from '../constants/deck';

export class Hand {
  cards: Array<Card> = [];
  count: number = 0;
  busted: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  workingDeck: Deck;
  dealersHand = new Hand();
  myHand = new Hand();
  stillDrawing: boolean;
  finishedGameMessage: string;
  myCount: number;
  dealerBlackJack: boolean;
  myBlackJack: boolean;

  constructor() { }

  ngOnInit() {
    this.newGame();
  }

  newGame() {
    this.stillDrawing = true;
    this.workingDeck = new Deck();
    for (const card of this.workingDeck.cards) {
      if (card.number === 14) {
        card.value = 11;
      } else if (card.number > 10 && card.number < 14) {
        card.value = 10;
      } else {
        card.value = card.number;
      }
    }
    this.dealersHand.cards = [];
    this.myHand.cards = [];
    this.dealersHand.count = 0;
    this.myHand.count = 0;
    this.finishedGameMessage = null;
    this.deal();
  }

  deal() {
    this.hit(this.myHand);
    this.hit(this.dealersHand);
    this.hit(this.myHand);
    this.hit(this.dealersHand);
    this.dealerBlackJack = this.dealersHand.count === 21;
    this.myBlackJack = this.myHand.count === 21;
  }

  hit(hand: Hand) {
    const newCard = this.workingDeck.cards.splice(Math.random() * this.workingDeck.cards.length, 1)[0];
    hand.cards.push(newCard);
    hand.count += newCard.value;
    if (this.myHand.cards.find(c => c.number === 14)) {
      this.handleAces(hand);
    }
    hand.busted = hand.count > 21;
  }

  handleAces(hand: Hand) {
    const ace = hand.cards.find(c => c.number === 14 && c.value === 11);
    if (!ace) {return;}
    if (hand.count > 21) {
      ace.value = 1;
      hand.count -=10;
    }
  }

  stay() {
    this.stillDrawing = false;
    if (!this.dealersHand.busted && this.dealersHand.count > 15) {
      this.finishedGameMessage = (this.myHand.count > this.dealersHand.count) ? 'You Win!' : 'You lose :(';
      return;
    }
    setTimeout(() => {
      if (this.dealersHand.count < 16) {
        this.hit(this.dealersHand);
        this.stay();
      }
    }, 2000);
  }

}

