import { NgModule } from "@angular/core";
import { ListingCreateGeneralComponent } from "../listings/listing-create/listing-create-general/listing-create-general.component";
import { ListingCreatePreviewComponent } from "../listings/listing-create/listing-create-preview/listing-create-preview.component";
import { ListingCreateComponent } from "../listings/listing-create/listing-create.component";
import { ListingsComponent } from "../listings/listings.component";
import { SharedModule } from "../_shared/shared.module";
import { ListingRoutingModule } from "./listings-routing.module";

@NgModule({
    declarations: [
        ListingsComponent,
        ListingCreateComponent,
        ListingCreateGeneralComponent,
        ListingCreatePreviewComponent,
    ],
    imports: [
        SharedModule,
        ListingRoutingModule,
        
    ],
    exports: [
        ListingsComponent,
        ListingCreateComponent,
        ListingCreateGeneralComponent,
        ListingCreatePreviewComponent,
    ]
})
export class ListingModule {}
