import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListingCreateGalleryComponent } from "../listings/listing-create/listing-create-gallery&pricing/listing-create-gallery&pricing.component";
import { ListingCreateGeneralComponent } from "../listings/listing-create/listing-create-general/listing-create-general.component";
import { ListingCreatePreviewComponent } from "../listings/listing-create/listing-create-preview/listing-create-preview.component";
import { ListingCreateComponent } from "../listings/listing-create/listing-create.component";
import { ListingPreviewComponent } from "../listings/listing-preview/listing-preview.component";
import { ListingsComponent } from "../listings/listings.component";

const routes: Routes = [
    { path: '', component: ListingsComponent, children: [
        { path: 'create', component: ListingCreateComponent, children: [
            { path: '', redirectTo: 'general', pathMatch: 'full'  },
            { path: 'general', component: ListingCreateGeneralComponent },
            { path: 'gallery', component: ListingCreateGalleryComponent },
            { path: 'preview', component: ListingCreatePreviewComponent }
        ] }
    ]},
    { path: 'preview', component: ListingPreviewComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
    
    // { path: '**', redirectTo: '', pathMatch: 'full' }
];
  
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ListingRoutingModule {}