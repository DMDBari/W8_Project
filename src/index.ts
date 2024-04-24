import { v4 as uuidv4 } from 'uuid';

class Pet {
    private _id: string;
    private _name: string;
    private _price: number;
    private _description: string;
    private _image: string;

    constructor(name: string, price: number, description: string, image: string) {
        this._id = uuidv4();
        this._name = name;
        this._price = price;
        this._description = description;
        this._image = image;
    }

    itemElement(): HTMLElement {
        const itemDiv = document.createElement("div");
        itemDiv.className = "item";
        itemDiv.innerHTML = `
            <h3>${this._name}</h3>
            <img src="${this._image}" alt="${this._name}">  
            <p>${this._description}</p>  
            <p>Price: $${this._price.toFixed(2)}</p>  
            <button onclick="window.shop.addItemToCart('${this._id}')">Add to Cart</button>`;
        return itemDiv;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get price(): number {
        return this._price;
    }

    set price(price: number) {
        this._price = price;
    }

    get description(): string {
        return this._description;
    }

    set description(description: string) {
        this._description = description;
    }
}

class User {
    private _id: string;
    private _name: string;
    private _age: number;
    private _cart: Pet[];

    constructor(name: string, age: number) {
        this._id = uuidv4();
        this._name = name;
        this._age = age;
        this._cart = [];
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get age(): number {
        return this._age;
    }

    set age(age: number) {
        this._age = age;
    }

    get cart(): Pet[] {
        return this._cart;
    }

    addToCart(item: Pet): void {
        this._cart.push(item);
    }

    getCartItems(): Pet[] {
        return this._cart;
    }

    cartTotal(): number {
        return this._cart.reduce((total, item) => total + item.price, 0);
    }
    
removeOneFromCart(itemId: string): void {
    const itemIndex = this._cart.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        this._cart.splice(itemIndex, 1);
    }
}

removeAllFromCart(itemId: string): void {
    this._cart = this._cart.filter(item => item.id !== itemId);
}
}

class Shop {
    private _items: Pet[];
    public static myUser: User | null = null;

    constructor() {
        this._items = [
            new Pet('Puppy', 100, 'Pupper', './images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg'),
            new Pet('Cat', 75, 'Keet', './images/Maine-Coon.jpg'),
            new Pet('Hamster', 50, 'Puff Ball', './images/hamster.jpg'),
            new Pet('Snake', 150, 'Noodle', './images/ball-python.jpg'),
            new Pet('Rat', 45, 'Squeeker', './images/rat.jpg'),
            new Pet('Ferret', 60, 'Fur Noodle', './images/ferret.jpg')
        ];
        this.displayItems();
    }

    displayItems(): void {
        const shopDiv = document.getElementById("shop") as HTMLElement;
        shopDiv.innerHTML = '';
        this._items.forEach(item => shopDiv.appendChild(item.itemElement()));
    }

    static loginUser(name: string, age: number): void {
        this.myUser = new User(name, age);
        document.getElementById('login-section')!.classList.add('hidden');
        document.getElementById('shop-section')!.classList.remove('hidden');
        document.getElementById('cart-section')!.classList.remove('hidden');
    }

    addItemToCart(itemId: string): void {
        if (Shop.myUser) {
            const item = this._items.find(item => item.id === itemId);
            if (item) {
                Shop.myUser.addToCart(item);
                this.updateCart();
            }
        }
    }

    removeOneItemFromCart(itemId: string): void {
        if (Shop.myUser) {
            Shop.myUser.removeOneFromCart(itemId);
            this.updateCart();
        }
    }

    removeAllItemsFromCart(itemId: string): void {
        if (Shop.myUser) {
            Shop.myUser.removeAllFromCart(itemId);
            this.updateCart();
        }
    }

    updateCart(): void {
        const cartDiv = document.getElementById("cart") as HTMLElement;
        cartDiv.innerHTML = '';
    
        if (Shop.myUser) {
            const itemCounts = new Map();
            for (const item of Shop.myUser.getCartItems()) {
                if (!itemCounts.has(item.id)) {
                    itemCounts.set(item.id, { item: item, count: 0 });
                }
                itemCounts.get(item.id).count++;
            }
    
            itemCounts.forEach((value, _) => {
                const itemElement = document.createElement('div');
                itemElement.innerHTML = `
                    <h4>${value.item.name} x${value.count}</h4>
                    <p>Price: $${value.item.price.toFixed(2)} each</p>
                    <button onclick="window.shop.removeOneItemFromCart('${value.item.id}')">Remove One</button>
                    <button onclick="window.shop.removeAllItemsFromCart('${value.item.id}')">Remove All</button>
                `;
                cartDiv.appendChild(itemElement);
            });
    

            const totalElement = document.createElement('p');
            totalElement.textContent = `Total: $${Shop.myUser.cartTotal().toFixed(2)}`;
            cartDiv.appendChild(totalElement);
        } else {
            cartDiv.textContent = 'Your cart is empty.';
        }
    }
}

(window as any).Shop = Shop;
(window as any).shop = new Shop();

document.getElementById('loginButton')?.addEventListener('click', () => {
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const age = parseInt((document.getElementById('age') as HTMLInputElement).value);
    Shop.loginUser(name, age);
});