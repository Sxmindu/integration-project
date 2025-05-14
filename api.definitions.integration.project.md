# API Definitions

- Hostname - `https://books.com`

## Links
- [Get Books](#get-books)
- [Get Book](#get-book)
- [Add Book](#add-book)
- [Update Book](#update-book)
- [Get Book](#delete-book)
- [Get Orders](#get-orders)
- [Get Order](#get-order)
- [Create Order](#create-order)
- [Update Order Status](#update-order-status)
- [Error Template](#error-template)

## Get Books

### Resource

- Method : `GET`
- Endpoint : `https://books.com/books`
- Authrization : `No Auth`
- Scope : `None`

### Request

#### Query Parameters
- `skip`
    - type : integer
    - required : false
- `fetch`
    - type : integer
    - required : false

### Response

#### When Books Available

```json
{
    "Books": [
        {
            "book_id": integer,
            "title": "string",
            "price": double,
            "availability": "string"
        }
    ]
}
```

#### When No Books are Found

```json
{
    "message": "string"
}
```

## Get Book

### Resource

- Method : `GET`
- Endpoint : `https://books.com/books/{book_id}`
- Authrization : `No Auth`
- Scope : `None`

### Request

#### Path Parameters
- `book_id`
    - type : integer
    - required : true

### Response

#### When Book is Available

```json
{
    "book_id": integer,
    "title": "string",
    "price": double,
    "availability": "string"
}
```

#### When Book is Not Found

```json
{
    "message": "string"
}
```

## Add Book

### Resource

- Method : `POST`
- Endpoint : `https://books.com/books`
- Authrization : `Oauth 2.0`
- Scope : `Staff`

### Request

#### Body

```json
{
    "title": "string",
    "price": double,
    "stock_quantity": integer
}
```

### Response

```json
{
    "message" : "string",
    "data": {
        "book_id": integer,
        "title": "string",
        "price": double,
        "stock_quantity": integer
    }
}
```

## Update Book

### Resource

- Method : `PUT`
- Endpoint : `https://books.com/books/{book_id}`
- Authrization : `Oauth 2.0`
- Scope : `Staff`

### Request

#### Path Parameters
- `book_id`
    - type : integer
    - required : true

#### Body

- Upadate Only Price
```json
{
    "price": double,
}
```

- Upadate Only Quantity
```json
{
    "stock_quantity": integer
}
```

- Upadate Both
```json
{
    "price": double,
    "stock_quantity": integer
}
```

### Response

#### When Book is Available

```json
{
    "message" : "string",
    "data": {
        "book_id": integer,
        "title": "string",
        "price": double,
        "stock_quantity": integer
    }
}
```

#### When Book is Not Found for Book ID

```json
{
    "message": "string"
}
```

## Delete Book

### Resource

- Method : `DELETE`
- Endpoint : `https://books.com/books/{book_id}`
- Authrization : `Oauth 2.0`
- Scope : `Staff`

### Request

#### Path Parameters
- `book_id`
    - type : integer
    - required : true

### Response

#### When Book is Available

```json
{
    "message" : "string",
}
```

#### When No Book Found for Book ID

```json
{
    "message": "string"
}
```

## Get Orders

### Resource

- Method : `GET`
- Endpoint : `https://books.com/orders`
- Authrization : `Oauth 2.0`
- Scope : `Staff`

### Request

#### Query Parameters
- `skip`
    - type : integer
    - required : false
- `fetch`
    - type : integer
    - required : false
- `status`
    - type : string
    - required : false

### Response

#### When Orders are Available

```json
{
    "Orders": [
        {
            "order_id": integer,
            "user_email": "string",
            "order_date": "string",
            "book_id": integer,
            "title": "string",
            "price": double,
            "quantity": integer,
            "payment_id": integer,
            "payment_amount": double,
            "payment_status": "string"
        }
    ]
}
```

#### When Orders are Not Found

```json
{
    "message": "string"
}
```

## Get Order

### Resource

- Method : `GET`
- Endpoint : `https://books.com/orders/{order_id}`
- Authrization : `Oauth 2.0`
- Scope : `Staff`

### Request

#### Path Parameters
- `order_id`
    - type : integer
    - required : true

### Response

#### When Order is Available

```json
{
    "order_id": integer,
    "user_email": "string",
    "order_date": "string",
    "book_id": integer,
    "title": "string",
    "price": double,
    "quantity": integer,
    "payment_id": integer,
    "payment_amount": double,
    "payment_status": "string"
}
```

#### When Order is Not Found

```json
{
    "message": "string"
}
```

## Create Order

### Resource

- Method : `POST`
- Endpoint : `https://books.com/books`
- Authrization : `Oauth 2.0`
- Scope : `Customer`

### Request

#### Body

```json
{
    "book_id": integer,
    "user_email": "string",
    "quantity": integer
}
```

### Response

#### Created Order Successfully
```json
{
    "message": "string",
    "data": {
        "order_id": integer,
        "user_email": "string",
        "order_date": "string",
        "book_id": integer,
        "title": "string",
        "price": double,
        "quantity": integer,
        "payment_id": integer,
        "payment_amount": double,
        "payment_status": "string"
    }
}
```

#### Book Not Found | Book Out of Stock | Book Stock Not Enough
```json
{
    "message": "string"
}
```

## Update Order Status

### Resource

- Method : `PUT`
- Endpoint : `https://books.com/orders/{order_id}`
- Authrization : `Oauth 2.0`
- Scope : `Staff`

### Request

#### Path Parameters
- `order_id`
    - type : integer
    - required : true

### Response

#### When Order Completed

```json
{
    "message" : "string",
    "data": {
        "order_id": integer,
        "user_email": "string",
        "order_date": "string",
        "book_id": integer,
        "title": "string",
        "price": double,
        "quantity": integer,
        "payment_id": integer,
        "payment_amount": double,
        "payment_status": "string"
    }
}
```

#### Order Not Found | Order Already Completed

```json
{
    "message": "string"
}
```
## Error Template

```json
{
    "message": "string",
    "error": {
        "code": "string",
        "detail": "string"
    }
}
```