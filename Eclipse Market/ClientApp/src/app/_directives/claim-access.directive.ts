import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appClaimAccess]'
})
export class ClaimAccessDirective {

  constructor(private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef) { }

  @Input()
  set appClaimAccess(searchedClaim: string) {
    this.updateView(searchedClaim);
  }

  updateView(searchedClaim: string) {
    let hasRights = false;
    let userClaims = JSON.parse(localStorage.getItem('claims')!);

    if(searchedClaim && userClaims && userClaims.length){
      userClaims.forEach((claim: string) => {
        if(claim === searchedClaim) {
          hasRights = true;
        } else {
          hasRights = false
        }
      });
    } else if (!searchedClaim) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }

    if(hasRights) {
    } else {
      this.viewContainer.clear();
    }
  }
}
