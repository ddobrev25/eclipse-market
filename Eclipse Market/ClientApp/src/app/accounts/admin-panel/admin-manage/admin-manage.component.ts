import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { RoleGetAllResponse } from 'src/app/core/models/role.model';
import { DeleteRequest, User, User$, UserGetAllResponse, UserUpdateRequest } from 'src/app/core/models/user.model';
import { RoleService } from 'src/app/core/services/http/role.service';
import { UserService } from 'src/app/core/services/http/user.service';

@Component({
  selector: 'app-admin-manage',
  templateUrl: './admin-manage.component.html',
  styleUrls: ['./admin-manage.component.scss']
})
export class AdminManageComponent implements OnInit, OnDestroy {
  @ViewChild('at') accountsTable!: any;
  accounts?: UserGetAllResponse;
  roleList?: RoleGetAllResponse;

  accountsChanged: boolean = false;

  deleteSubs : Subscription | undefined;
  editSubs : Subscription | undefined;
  accountSubs : Subscription | undefined;
  roleSubs : Subscription | undefined;
  
  accountDialog?: boolean;
  //need to fix
  accountForEdit: User | undefined;

  constructor(private userService: UserService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private roleService: RoleService
              // private adminService: AdminService
              ) { }

  ngOnInit(): void {
    this.FetchAccounts();
  }


  editForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.maxLength(50), Validators.minLength(2), Validators.required]),
    lastName: new FormControl('', [Validators.maxLength(50), Validators.minLength(2), Validators.required]),
    userName: new FormControl('', [Validators.maxLength(50), Validators.minLength(3), Validators.required]),
    email: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+.[a-z]{2,3}')]),
    password: new FormControl('', [Validators.maxLength(50), Validators.minLength(6),Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$'), Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
  });

  clearTable(table: Table) {
    table.clear();
  }
  applyFilterGlobal($event: Event, stringVal: any) {
    this.accountsTable.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
  FetchAccounts() {
    if(
      // !this.adminService.accounts || 
      this.accountsChanged) {
      this.accountSubs = this.userService.getAll().subscribe({
        next: (resp: UserGetAllResponse) => {
          // this.adminService.accounts = resp;
          this.accounts = resp;
          this.accountsChanged = false;
        }
      })
    } else {
      // this.accounts = this.adminService.accounts;
    }

  }
  FetchRoles() {
    if(
      true
      // !this.adminService.roles
      ) {
      this.roleSubs = this.roleService.getAll().subscribe({
        next: (resp: RoleGetAllResponse) => {
          // this.adminService.roles = resp;
          this.roleList = resp;
        },
        error: err => { 
          console.log(err);
        }
      })
    } else {
      // this.roleList = this.adminService.roles;
    }

  }

  onSelectAccount(user: User) {
    this.accountDialog = true;
    this.accountsChanged = true;
    this.FetchRoles();
    this.accountForEdit = user;
  }
  onEditAccount() {
    if(!this.accountForEdit) return;

    let roleId;
    if(this.editForm.get('role')?.value === this.accountForEdit.roleName) {
      roleId = 0;
    } else {
      roleId = this.editForm.get('role')?.value
    }
    const body: UserUpdateRequest = {
      id: this.accountForEdit.id!,
      firstName: this.editForm.get('firstName')?.value,
      lastName: this.editForm.get('lastName')?.value,
      userName: this.editForm.get('userName')?.value,
      email: this.editForm.get('email')?.value,
      password: this.editForm.get('password')?.value,
      phoneNumber: this.editForm.get('phoneNumber')?.value,
      roleId: roleId,
      imageBase64String: 'need to fix'
    };
    this.resetEditForm();
    this.editSubs = this.userService.update(body).subscribe({
      error: err => {
        console.log(err)
      },
      complete: () => {
        this.accountsChanged = true;
        this.FetchAccounts();
        this.accountDialog = false;
        this.messageService.add({severity:'success', detail: 'Промените са запазени!', life: 3000});
      }
    });
  }

  onDeleteUser(user: User) {
    if(!user) return;

    let body: DeleteRequest = {
      id: user.id!
    }
    this.confirmationService.confirm({
        message: `Сигурнили сте, че искате да изтриете ${user.userName} ?`,
        header: 'Потвърди',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Да',
        rejectLabel: 'Не',
        accept: () => {
            this.deleteSubs = this.userService.delete(body).subscribe({
              error: (err) => {
                console.log(err)
              },
              complete: () => {
                this.accountsChanged = true;  
                this.messageService.add({severity:'success', detail: 'Акаунтът е изтрит успешно!', life: 3000});
                this.FetchAccounts();
              }
            })
        }
    });
  }
  
  onDiscard() {
    this.accountDialog = false;
    this.resetEditForm();
  }

  resetEditForm() {
    this.editForm.patchValue({
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
      phoneNumber: '',
      role: '',
    })
  }

  ngOnDestroy(): void {
    this.deleteSubs?.unsubscribe();
    this.accountSubs?.unsubscribe();
  }

}
  
