import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { SnackbarService } from 'src/app/snackbar.service';
import { CategoryComponent } from '../dialog/category/category.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {

  displayedColumns: string[] = ['name' , 'edit'];
  dataSource:any;
  responseMessage:any;


  constructor(private categoryService:CategoryService,
    private ngxService: NgxUiLoaderService,
    private dialog:MatDialog,
    private SnackbarService:SnackbarService,
    private router:Router) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }
  tableData() {
    this.categoryService.getCategorys().subscribe((response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
    },(error:any)=>{
        this.ngxService.stop();
      console.log(error.error?.message);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.SnackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction(){
    const dialogConfog = new MatDialogConfig();
    dialogConfog.data={
      action:'Add'
    };
    dialogConfog.width = "850px";
    const dialogRef = this.dialog.open(CategoryComponent , dialogConfog);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddCategory.subscribe((response)=>{
      this.tableData();
    })
  }
  handleEditAction(values:any){
    const dialogConfog = new MatDialogConfig();
    dialogConfog.data={
      action:'Edit',
      data:values
    };
    dialogConfog.width = "850px";
    const dialogRef = this.dialog.open(CategoryComponent , dialogConfog);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditCatefory.subscribe((response)=>{
      this.tableData();
    })
  }
}
