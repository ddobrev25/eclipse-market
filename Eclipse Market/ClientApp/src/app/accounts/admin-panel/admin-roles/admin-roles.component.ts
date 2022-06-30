import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IRole, IRoles } from 'src/app/_models/role.model';
import { RoleService } from 'src/app/_services/role.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin-roles',
  templateUrl: './admin-roles.component.html',
  styleUrls: ['./admin-roles.component.scss']
})
export class AdminRolesComponent implements OnInit, OnDestroy {
  roleList: IRoles = [];
  roleAddDialog?: boolean;
  roleEditDialog?: boolean;

  roleGetSubs: Subscription | undefined;
  roleAddSubs: Subscription | undefined;
  roleEditSubs: Subscription | undefined;
  roleDeleteSubs: Subscription | undefined;

  constructor(private roleService: RoleService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) { }

  ngOnInit() {
    this.fetchRoles();
    this.roleAddDialog = false;
    this.roleEditDialog = false;
  }

  roleForm: FormGroup = new FormGroup({
    id: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    claims: new FormControl('', [Validators.required])
  });

  fetchRoles() {
    this.roleGetSubs = this.roleService.getAll().subscribe({
      next: (resp: IRoles) => {
        this.roleList = resp;
        console.log(this.roleList)
      },
      error: err => {
        console.log(err);
      }
    })
  }



  onToggleRoleAddDialog() {
    this.roleAddDialog = true;
    this.roleForm.reset();
  }

  onAddRole() {
    const claims: string = this.roleForm.get('claims')?.value
    console.log(claims)
    console.log(typeof(claims))
    const body = {
      'Id': this.roleForm.get('id')?.value,
      'Name': this.roleForm.get('name')?.value,
      'Claims': claims.split(","),
    }
    console.log(body.Claims)
    this.roleAddSubs = this.roleService.add(body).subscribe({
      complete: ()=> {
        this.messageService.add({severity:'success', detail: 'Ролята е добавена успешно!', life: 3000});
        this.fetchRoles();
        this.roleAddDialog = false;
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  onDiscard() {
    this.roleAddDialog = false;
    this.roleEditDialog = false;
  }

  onToggleRoleEditDialog(role: IRole) {
    this.roleEditDialog = true;
    this.roleForm.patchValue({
      id: role.id,
      name: role.name,
      claims: role.claims
    })
  }

  onEditRole() {
    const claims: string = this.roleForm.get('claims')?.value
    const body = {
      'CurrentId': this.roleForm.get('id')?.value,
      'Name': this.roleForm.get('name')?.value,
      'Claims': claims.split(","),
    }
    this.roleEditSubs = this.roleService.update(body).subscribe({
      complete: () => {
        this.messageService.add({severity:'success', detail: 'Промените са запазени!', life: 3000});
        this.roleEditDialog = false;
        this.fetchRoles();
      },
      error: err => {
        console.log(err);
      }
    })
  }

  onDeleteRole(role: IRole) {
    const body = {
      'Id': role.id
    }
    this.confirmationService.confirm({
      message: `Сигурнили сте, че искате да изтриете ${role.name} ?`,
      header: 'Потвърди',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Да',
      rejectLabel: 'Не',
      accept: () => {
        this.roleDeleteSubs = this.roleService.delete(body).subscribe({
          complete: () => {
            this.messageService.add({severity:'success', detail: 'Ролята е изтрита успешно!', life: 3000});
            this.fetchRoles();
          },
          error: err => {
            console.log(err)
          }
        })
      }
    });
  }

  ngOnDestroy(): void {
    this.roleGetSubs?.unsubscribe();
    this.roleAddSubs?.unsubscribe();
    this.roleEditSubs?.unsubscribe();
    this.roleDeleteSubs?.unsubscribe();
  }

}
