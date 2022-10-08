import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListingCreateGalleryComponent } from "./listing-create/listing-create-gallery&pricing/listing-create-gallery&pricing.component";
import { ListingCreateGeneralComponent } from "./listing-create/listing-create-general/listing-create-general.component";
import { ListingCreatePreviewComponent } from "./listing-create/listing-create-preview/listing-create-preview.component";
import { ListingCreateComponent } from "./listing-create/listing-create.component";
import { UserListingsComponent } from "./listing-preview/user-listings/user-listings.component";
import { ListingPreviewComponent } from "./listing-preview/listing-preview.component";
import { ListingsComponent } from "./listings.component";

const routes: Routes = [
    { path: '', component: ListingsComponent, children: [
        { path: 'create', component: ListingCreateComponent, children: [
            { path: '', redirectTo: 'general', pathMatch: 'full'  },
            { path: 'general', component: ListingCreateGeneralComponent },
            { path: 'gallery', component: ListingCreateGalleryComponent },
            { path: 'preview', component: ListingCreatePreviewComponent }
        ] },
        { path: 'user', component: UserListingsComponent }
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