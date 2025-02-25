# Grocery Optimizer - Client  

## Description  
The **Grocery Optimizer - Client** is the front-end application that allows users to input their shopping cart and receive optimized store visits based on product availability and pricing. It communicates with the **Grocery Optimizer HUB** via a **REST API**.  

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [npm](https://www.npmjs.com/) (version 6.x or higher)

## Setup  
This project depends on:  
- **GroceryOptimizer HUB**: [GitHub Repo](https://github.com/GroceryOptimizer/hub)  

### Steps to Set Up (Development)  
1. Clone the repository:  
   ```sh
   git clone https://github.com/GroceryOptimizer/client.git  
   ```  
2. Navigate to the project directory:  
   ```sh
   cd client  
   ```  
3. Install dependencies:  
   ```sh
   npm install  
   ```  
4. Start the development server:  
   ```sh
   npm run dev  
   ```  
5. Open your browser and go to:  
   ```
   http://localhost:3000/v1/shop  
   ```
   
## Available Pages

The application offers several pages to enhance your shopping experience. You can access them directly:

- **Shop**: `http://localhost:3000/v1/shop`

*Note: Ensure the development server is running before accessing these pages.*

## Steps to Build for Production  
1. Build the project:  
   ```sh
   npm run build  
   ```  
2. Serve the built application locally:  
   ```sh
   npm run preview  
   ```  
3. Deploy the contents of the `dist` folder to a web server or hosting service.  

## API Reference  

### `POST /api/hub`  
**Description:** Sends a shopping cart to the HUB and retrieves optimized store visits.  

**Request Body:**  
```json
{
  "cart": [
    {
      "name": "milk"
    },
    {
      "name": "ham"
    }
  ]
}
```  

**Response:**  
```json
[
  {
    "storeId": 2,
    "store": {
      "id": 2,
      "name": "Coop",
      "location": {
        "latitude": 40.3,
        "longitude": 32.1
      }
    },
    "stockItems": [
      {
        "product": {
          "name": "ham"
        },
        "price": 50
      }
    ]
  }
]
```  

## Usage  
- Ensure the **Grocery Optimizer HUB** is running before starting the client.  
- Use the UI to input a shopping cart and get optimized vendor visits.  

## Contributors  
- [KikiBerg](https://github.com/KikiBerg)  
- [Raiu](https://github.com/Raiu)  
- [RikiRhen](https://github.com/RikiRhen)  
- [Syldriem](https://github.com/Syldriem)  
- [vikkoooo](https://github.com/vikkoooo)  
