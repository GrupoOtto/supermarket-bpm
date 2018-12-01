# API REST Specification

## 1 Schemas

### 1.1 Errors

#### Error : `Object`

| Property  | Type     | Required | Description                                   |
| --------- | -------- | -------- | --------------------------------------------- |
| `status`  | `Number` | ✔        | One of a server-defined set of error codes.   |
| `message` | `String` | ✔        | A human-readable representation of the error. |

## 2 Endpoints

- `GET: '/products-list'`

  **HTTP Headers**

  | Name            | Type     | Required | Description       |
  | --------------- | -------- | -------- | ----------------- |
  | `authorization` | `String` | ✔        | A JSON Web Token. |

  Retorna la lista completa de productos con su correspondiente precio de acuerdo a las reglas de negocio establecidas.

* `GET: '/prepare-sale'`

  Enpoint para comenzar el proceso de compra.

  **HTTP Headers**

  | Name            | Type     | Required | Description       |
  | --------------- | -------- | -------- | ----------------- |
  | `authorization` | `String` | ✔        | A JSON Web Token. |

  **Body Params**

  | Name           | Type     | Required | Description                                                                                          |
  | -------------- | -------- | -------- | ---------------------------------------------------------------------------------------------------- |
  | `productsCart` | `JSON`   | ✔        | Object which each pair (key, value) represents id of a product and the quantity to buy respectively. |
  | `couponCode`   | `String` | ✔        | Coupon code reference.                                                                               |

  Retorna una lista con los productos de la compra solicitada, cada uno con sus precios actualizados de acuerdo a las reglas de negocio y a la aplicación o no de un cupon válido. Adicionalmente retorna el caseId de la instancia de proceso de bonita ejecutado.

* `GET: '/confirm-sale'`

  Enpoint para continuar y finalizar con el proceso de compra.

  **HTTP Headers**

  | Name            | Type     | Required | Description       |
  | --------------- | -------- | -------- | ----------------- |
  | `authorization` | `String` | ✔        | A JSON Web Token. |

  **Body Params**

  | Name       | Type            | Required | Description                                                                                                                |
  | ---------- | --------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
  | `caseId`   | `String`        | ✔        | An unique id of the bonita process in excecution.                                                                          |
  | `saleInfo` | `String` (JSON) | ✔        | Contains all the information related to the purchase. This includes user and shipment details and credit card information. |

  Retorna la información referida a la compra y el caseId del proceso asociado.

## 3 Private Endpoints

Adicionalmente se implementaron dos endpoints necesarios para lograr la comunicación con bonita. Estos son:

- `PUT: '/resolve'`
- `PUT: '/reject'`

Ambos reciben en un HTTP Header el caseId del proceso.
