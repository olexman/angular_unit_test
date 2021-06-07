import { Component } from "@angular/core";
import { ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

export class DOMHelper <T> {
    private fixture: ComponentFixture <T>;
    constructor(fixture: ComponentFixture <T>){
      this.fixture = fixture;
    }
  
    /** get text */
    singleText(tagName: string): string {
      /** query takes first element of tagName */
      const h2Element = this.fixture.debugElement.query(By.css(tagName));
      if (h2Element) {
        return h2Element.nativeElement.textContent;
      }
    }
  
    count(tagName: string): number {
      /** query takes first element of tagName */
      const elements = this.fixture.debugElement.queryAll(By.css(tagName));
      return elements.length;
    }
  
    countText(tagName: string, text: string):number {
      const elements = this.fixture.debugElement.queryAll(By.css(tagName));
      return elements.filter(el => el.nativeElement.textContent === text).length;
    }
  }