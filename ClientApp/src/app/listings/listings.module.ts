import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { ListingCreateGalleryComponent } from "./listing-create/listing-create-gallery&pricing/listing-create-gallery&pricing.component";
import { ListingCreateGeneralComponent } from "./listing-create/listing-create-general/listing-create-general.component";
import { ListingCreatePreviewComponent } from "./listing-create/listing-create-preview/listing-create-preview.component";
import { ListingCreateComponent } from "./listing-create/listing-create.component";
import { ListingPreviewComponent } from "./listing-preview/listing-preview.component";
import { UserListingsComponent } from "./listing-preview/user-listings/user-listings.component";
import { ListingRoutingModule } from "./listings-routing.module";
import { ListingsComponent } from "./listings.component";


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
