import { NgModule } from "@angular/core";
import { ListingCreateGalleryComponent } from "../listings/listing-create/listing-create-gallery&pricing/listing-create-gallery&pricing.component";
import { ListingCreateGeneralComponent } from "../listings/listing-create/listing-create-general/listing-create-general.component";
import { ListingCreatePreviewComponent } from "../listings/listing-create/listing-create-preview/listing-create-preview.component";
import { ListingCreateComponent } from "../listings/listing-create/listing-create.component";
import { UserListingsComponent } from "../listings/listing-preview/user-listings/user-listings.component";
import { ListingPreviewComponent } from "../listings/listing-preview/listing-preview.component";
import { ListingsComponent } from "../listings/listings.component";
import { SharedModule } from "../_shared/shared.module";
import { ListingRoutingModule } from "./listings-routing.module";

@NgModule({
    declarations: [
        ListingsComponent,
        ListingCreateComponent,
        ListingCreateGeneralComponent,
        ListingCreatePreviewComponent,
        ListingCreateGalleryComponent,
        ListingPreviewComponent,
        UserListingsComponent
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
        ListingCreateGalleryComponent,
        ListingPreviewComponent,
        UserListingsComponent
    ]
})
export class ListingModule {}
