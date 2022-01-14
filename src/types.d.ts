type stock = {
    id: string;
    vendor: string;
    product: string;
    sku: string;
    quantity: string;
    price: string;
    balance: string;
  };

  type product = {
    name: string;
  };

  type vendor = {
    name: string;
  };

 type initialValues = {
    vendor: string;
    product: string;
    quantity: string;
}