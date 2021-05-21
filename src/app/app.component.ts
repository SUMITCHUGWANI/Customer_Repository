import { Component, OnInit, Input } from '@angular/core';
import { Product } from './product';
import { ProductService } from './productservice';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import {SelectItem} from 'primeng/api';
import {SelectItemGroup} from 'primeng/api';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';


interface Type {
    name: string;
    code: string;
}
interface License {
    type?: Type;
    trial_days?: number;
    machine_count?: number;
    volume_count?: number;
    MsSQL_EC2_count?: number;
    MySQL_EC2_count?: number;
    expiry_date?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
    styles: [`
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `],
    styleUrls: ['./app.component.scss']
})

export class AppComponent {

    productDialog: boolean;

    products: Product[];

    product: Product;

    selectedProducts: Product[];

    submitted: boolean;
    private display: boolean;
    type: Type[];
    // projectForm: FormGroup;
    // minProjectDate = new Date();

    license: License;
    minDate: Date;



    // tslint:disable-next-line:max-line-length
    constructor(private productService: ProductService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {
        this.productService.getProducts().then(data => this.products = data);
        this.minDate = new Date();

        this.type = [{name: 'Trial', code: 'TRI'},
            {name: 'Standard', code : 'STD'},
            {name: 'Advanced', code: 'ADV'},
            {name: 'Enterprise', code: 'ENT'},
            {name: 'Enterprise Plus', code: 'ENTP'}];

        // tslint:disable-next-line:max-line-length
        this.license = {MsSQL_EC2_count: 0, MySQL_EC2_count: 0, expiry_date: '', machine_count: 0,
            trial_days: 0, type: this.type[0], volume_count: 0};
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }
    openNewLicense() {
        // tslint:disable-next-line:max-line-length
        this.license = {MsSQL_EC2_count: 0, MySQL_EC2_count: 0, expiry_date: '', machine_count: 0,
            trial_days: 0, type: this.type[0], volume_count: 0};
        this.display = true;
    }

    // onChange(event) {
    //     if (event.value === 'TRI'){
    //         console.log('You have chosen standard version');
    //
    //     }
    //     // console.log('event:'+event.value);
    // }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products = this.products.filter(val => !this.selectedProducts.includes(val));
                this.selectedProducts = null;
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
            }
        });
    }

    editProduct(product: Product) {
        this.product = {...product};
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + product.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products = this.products.filter(val => val.id !== product.id);
                this.product = {};
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    hideLicense() {
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        if (this.product.name.trim()) {
            if (this.product.id) {
                this.products[this.findIndexById(this.product.id)] = this.product;
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
            } else {
                this.product.id = this.createId();
                this.product.image = 'product-placeholder.svg';
                this.products.push(this.product);
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000});
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }



    saveLicense() {
        this.submitted = true;
        // console.log(this.license);
        console.log(this.license.type);
        console.log(this.license.trial_days);
        console.log(this.license.machine_count);
        console.log(this.license.volume_count);
        console.log(this.license.MsSQL_EC2_count);
        console.log(this.license.MySQL_EC2_count);
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for ( let i = 0; i < 5; i++ ) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
}




