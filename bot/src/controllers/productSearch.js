let findProducts = function(searchQuery){
    // call product search api here
    // format the response in following format

    // sample product json format
    let product = {
        productName : "Classic White T-Shirt",
        productDescription : "100% Soft and Luxurious Cotton",
        productDescription2 : "Price is $25 and carried in sizes (S, M, L, and XL)",
        productImage : "https://cdn2.iconfinder.com/data/icons/flat-jewels-icon-set/128/0011_T-Shirt.png"
    };
    
    // return array of product based on the search results
    return [product, product, product];
};
module.exports = findProducts ; 