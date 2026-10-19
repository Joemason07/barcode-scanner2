
 // Product lookup.
 //
 // Fetches products from the local Scanly API,
 // converts the response into a Scanly product,
 // saves successful scans to history,
 // and displays the result.

 import { app } from './dom.js';
 import { addToHistory } from './state.js';
 import { createProduct } from './data/product.js';
 
 import {
   productItem,
   missingItem,
   errorItem
 } from './pages/item.js';
 
 
 // --------------------------------------------------
 // API configuration
 // --------------------------------------------------
 
 const lookupEndpoint =
   window.SCANLY_CONFIG?.lookupEndpoint?.trim() ||
   'http://localhost:8001/api/product';
 
 
 // --------------------------------------------------
 // Product lookup
 // --------------------------------------------------
 
 /**
  * Looks up a product by barcode.
  *
  * @param {string} code - The product barcode.
  */
 export async function lookupProduct(code) {
   if (!code) {
     return;
   }
 
   try {
     const product = await fetchProduct(code);
 
     if (!product) {
       showMissingProduct(code);
       return;
     }
 
     // Save the successful scan to history.
     addToHistory(product);
 
     // Render the product details.
     app.innerHTML = productItem(product);
 
   } catch (error) {
     console.error('Product lookup failed:', error);
 
     showLookupError(code);
   }
 }
 
 
 // --------------------------------------------------
 // API request
 // --------------------------------------------------
 
 /**
  * Fetches a product from the local Scanly API.
  *
  * Returns null if the barcode is not found.
  *
  * @param {string} code - The product barcode.
  * @returns {Promise<object|null>}
  */
 async function fetchProduct(code) {
   const url =
     `${lookupEndpoint}/${encodeURIComponent(code)}`;
 
   const response = await fetch(url);
 
   // The product does not exist in the database.
   if (response.status === 404) {
     return null;
   }
 
   // Handle unsuccessful API responses.
   if (!response.ok) {
     throw new Error(
       `Catalogue request failed: ${response.status}`
     );
   }
 
   const data = await response.json();
 
   // Convert the API response into Scanly's
   // standard product format.
   return createProduct(data, code);
 }
 
 
 // --------------------------------------------------
 // Product not found
 // --------------------------------------------------
 
 /**
  * Displays the product-not-found page.
  *
  * @param {string} code - The scanned barcode.
  */
 function showMissingProduct(code) {
   app.innerHTML = missingItem(code);
 
   document
     .querySelector('#try-another')
     ?.addEventListener('click', () => {
       location.hash = 'scan';
     });
 }
 
 
 // --------------------------------------------------
 // Lookup error
 // --------------------------------------------------
 
 /**
  * Displays the lookup error page.
  */
 function showLookupError(code) {
   app.innerHTML = errorItem();
 
   document
     .querySelector('#retry-lookup')
     ?.addEventListener('click', () => {
       lookupProduct(code);
     });
 }
 