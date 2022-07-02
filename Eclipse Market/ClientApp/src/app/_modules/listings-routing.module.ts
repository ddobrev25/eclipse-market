import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListingCreateGalleryComponent } from "../listings/listing-create/listing-create-gallery/listing-create-gallery.component";
import { ListingCreateGeneralComponent } from "../listings/listing-create/listing-create-general/listing-create-general.component";
import { ListingCreatePreviewComponent } from "../listings/listing-create/listing-create-preview/listing-create-preview.component";
import { ListingCreatePricingComponent } from "../listings/listing-create/listing-create-pricing/listing-create-pricing.component";
import { ListingCreateComponent } from "../listings/listing-create/listing-create.component";
import { ListingsComponent } from "../listings/listings.component";

const routes: Routes = [
    { path: '', component: ListingsComponent, children: [
        { path: 'create', component: ListingCreateComponent, children: [
            { path: '', redirectTo: 'general', pathMatch: 'full'  },
            { path: 'general', component: ListingCreateGeneralComponent },
            { path: 'pricing', component: ListingCreatePricingComponent },
            { path: 'gallery', component: ListingCreateGalleryComponent },
            { path: 'preview', component: ListingCreatePreviewComponent }

        ] }
    ]},
    
    // { path: '**', redirectTo: '', pathMatch: 'full' }
];
  
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ListingRoutingModule {}