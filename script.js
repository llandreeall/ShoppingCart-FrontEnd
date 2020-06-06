/*eslint-env es6*/

var apiurl; //apiurl contains the product list
apiurl = "http://private-32dcc-products72.apiary-mock.com/product";
var products = new Array();
var selectedProducts = new Array();
var nr = 0;
var valute = "USD", oldValute;
var price, value, total = 0;
var valuteSign = "$";
var cart;
var curr;
var continueButton = document.getElementById('continueButton');

//I use ajax to retrieve data from the api
$.ajax({
        type: 'GET',
        url: apiurl,
        dataType: 'json',
        contentType: 'application/json',
        success: function(data){
            $.each(data, function(i, product) {
                products[i] = product;
                nr = nr + 1;
            });
        },
        error: function (err) {
            alert(err.responseText);
        },
        async: false
    });

//Here is the descending sort of the products by price
products.sort(function(a,b){
    return b.price - a.price;
});

//This function displays the list of products that can be chosen by the user
function showProducts() {
    prod.innerHTML = "";
    products.forEach(function(data,i) {
        price = data.price;
        price = Math.round(price * 100) / 100;
        prod.innerHTML += "<div class=\"product\"><br><br><br><br>&nbsp; " + data.name + 
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font size=\"-1\"><b>Price: </b></font><font color = #00ced1 size=\"-1\"><b>"
        + valuteSign + price + "</b></font>" +
        "<button type=\"button\" class=\"addToCart\" id=" + data.id + " onclick=\"buttonTrigger("+ data.id +")\">"+
        "<i class=\"icon\"></i>" + "Add to cart</button>" +
        "<button type=\"button\" class=\"delete\" id=" + i + " onclick=\"buttonDelete("+ data.id +")\">Delete</button>" +
        " </div><br>";
        
    });
}
//This function displays the products added to the cart
function showSelectedProducts(){
    
        total = 0;
        cart.innerHTML = "<br><br><br><font color=#707070 size=5 style=\"font-family:verdana\">Products in your shopping cart</font><br><br><br>";
        cart.innerHTML += "<br><br><div class=\"space1\"><font color=#707070 size=2 style=\"font-family:verdana\">Product</font></div>" +
        "<div class=\"space2\"><font color=#707070 size=2 style=\"font-family:verdana\">Quantity</font></div>" + 
        "<div class=\"space3\"><font color=#707070 size=2 style=\"font-family:verdana\"> Value</font></div><hr><br>";
        selectedProducts.forEach(function(data,i) {
            value = data.price * data.quantity;
            value = Math.round(value * 100) / 100;
            total += value;
            total = Math.round(total * 100) / 100;
            if(data.description == undefined)
                data.description = "No description";
            cart.innerHTML += " <div class=\"space1\">" + data.name + 
            "<div class=\"tooltip\">i <span class=\"tooltiptext\">" + data.description + "</span></div></div>" +
            "<div class=\"space2\" ><input type=\"text\" id="+data.id/10+" size=4 onkeypress=\"quantityChange(event," +data.id+")\" placeholder=" + 
            data.quantity + ">" + "</div><div class=\"space3\">" + valuteSign + value + "</div><br><br><br><br><hr>";
            
        });
        cart.innerHTML += "<font size=5 style=\"color:#707070;float:right;font-family:verdana;\"><b>Total: " + valuteSign + total + "</b></font>";
        continueButton.innerHTML = "<button type=\"button\" class=\"continue\">Continue</button>";
        if(total == 0){
            cart.innerHTML = "<br><br><br><font color=#707070 size=5 style=\"font-family:verdana\">No products in your shopping cart.</font>";
            continueButton.innerHTML = "";
        } 
}

var prod, drop;
nr = 0;
var buttonId;
//This function is used to change currency via dropdown in right top corner
function changeCurr(){
    oldValute = valute;
    valute = document.getElementById("dropMenu").value;
    
    if(valute == "EUR") {
        valuteSign = "\u20AC";
    }
    else if(valute == "USD") {
        valuteSign = "$";
    }
    else {
        valuteSign = "\u00A3";
    }
    selectedProducts.forEach(function(data,i) {
        data.price = fx.convert(data.price, {from: oldValute, to: valute});
    });
    products.forEach(function(data,i) {
        data.price = fx.convert(data.price, {from: oldValute, to: valute});
    });
    showSelectedProducts();
    showProducts();
}


$(document).ready(new function() {
    //This section of code is executed when the page has loaded
    prod = document.getElementById("prod");
    cart = document.getElementById("shoppingCart");
    showProducts();
    
    if(selectedProducts.length == 0)  {
        cart.innerHTML = "<br><br><br><font color=#707070 size=5 style=\"font-family:verdana\">No products in your shopping cart.</font>"
    }
    drop = document.getElementById("drop");
    drop.innerHTML = "Select currency: <select name=\"dropMenu\" id=\"dropMenu\" onchange=\"changeCurr()\"><option value=\"USD\">USD</option>"+
        "<option value=\"GBP\">GBP</option><option value=\"EUR\">EUR</option></select>";

});

//The variable curr is used to get the currency parameter via URL
curr = getUrlParameter('curr');

var sel = document.getElementById('dropMenu');
var selProd_serialized ;
selProd_serialized= JSON.stringify(selectedProducts);
sessionStorage.setItem("sel", selProd_serialized);

if(curr) {
    //If there is a curr parameter in the URL the code is executed
    selectedProducts = JSON.parse(sessionStorage.getItem("sel"));
    console.log(localStorage.getItem("sel"));
    $("#dropMenu").val(curr);
    changeCurr();
}
//This function adds products to the cart
//If a product is new to the shopping cart then a new element is added to the array "selectedProducts"
//Else it just increments the quantity
function buttonTrigger(buttonName) {
    var aux = 0;
    var found;
    selectedProducts.forEach(function(data,i) {
        if(data.id === buttonName)
        {    aux = 1;
            found = i;
        }
    });
    
    if(aux == 1) //aux == 1 it means that the products already exists in the cart
        selectedProducts[found].quantity += 1;
    else {
        selectedProducts[nr] = products.find(element => element.id==buttonName);
        selectedProducts[nr].quantity = 1;
        nr += 1;
    }
    
    if(selectedProducts) {
        total = 0;
        cart.innerHTML = "<br><br><br><font color=#707070 size=5 style=\"font-family:verdana\">Products in your shopping cart</font><br><br><br>";
        cart.innerHTML += "<br><br><div class=\"space1\"><font color=#707070 size=2 style=\"font-family:verdana\">Product</font></div>" +
        "<div class=\"space2\"><font color=#707070 size=2 style=\"font-family:verdana\">Quantity</font></div>" + 
        "<div class=\"space3\"><font color=#707070 size=2 style=\"font-family:verdana\"> Value</font></div><hr><br>";
        selectedProducts.forEach(function(data,i) {
            value = data.price * data.quantity;
            value = Math.round(value * 100) / 100;
            total += value;
            total = Math.round(total * 100) / 100;
            if(data.description == undefined)
                data.description = "No description";
            cart.innerHTML += " <div class=\"space1\">" + data.name + 
            "<div class=\"tooltip\">i <span class=\"tooltiptext\">" + data.description + "</span></div></div>" +
            "<div class=\"space2\" ><input type=\"text\" id="+data.id/10+" size=4 onkeypress=\"quantityChange(event," +data.id+")\" placeholder=" + 
            data.quantity + ">" + "</div><div class=\"space3\">" + valuteSign + value + "</div><br><br><br><br><hr>";
            
        });
        cart.innerHTML += "<font size=5 style=\"color:#707070;float:right;font-family:verdana;\"><b>Total: " + valuteSign + total + "</b></font>";
        continueButton.innerHTML = "<button type=\"button\" class=\"continue\">Continue</button>";
    } else {
        cart.innerHTML = "<br><br><br><font color=#707070 size=5 style=\"font-family:verdana\">No products in your shopping cart.</font>";
    }
    
    selProd_serialized = JSON.stringify(selectedProducts);
    sessionStorage.setItem("sel", selProd_serialized);

}

//This function changes the quantity attribute depending on the input text in the "Quantity" field
function quantityChange(e, prodId) {
    if (e.which == 13) {  //e.which == enter means that the key pressed is ENTER
        var q = document.getElementById(prodId/10).value; 
        console.log(q);
        total = 0;
        cart.innerHTML = "<br><br><br><font color=#707070 size=5 style=\"font-family:verdana\">Products in your shopping cart</font><br><br><br>";
        cart.innerHTML += "<br><br><div class=\"space1\"><font color=#707070 size=2 style=\"font-family:verdana\">Product</font></div>" +
        "<div class=\"space2\"><font color=#707070 size=2 style=\"font-family:verdana\">Quantity</font></div>" + 
        "<div class=\"space3\"><font color=#707070 size=2 style=\"font-family:verdana\"> Value</font></div><hr><br>";
        selectedProducts.forEach(function(data,i) {
            if(data.id == prodId)
                data.quantity = q;
            value = data.price * data.quantity;
            value = Math.round(value * 100) / 100;
            total += value;
            total = Math.round(total * 100) / 100;
            if(data.description == undefined)
                data.description = "No description";
            cart.innerHTML += " <div class=\"space1\">" + data.name + 
            "<div class=\"tooltip\">i <span class=\"tooltiptext\">" + data.description + "</span></div></div>" +
            "<div class=\"space2\" ><input type=\"text\" id="+data.id/10+" size=4 onkeypress=\"quantityChange(event," +data.id+")\" placeholder=" + 
            data.quantity + ">" + "</div><div class=\"space3\">" + valuteSign + value + "</div><br><br><br><br><hr>";
            
        });
        cart.innerHTML += "<font size=5 style=\"color:#707070;float:right;font-family:verdana;\"><b>Total: " + valuteSign + total + "</b></font>";
        continueButton.innerHTML = "<button type=\"button\" class=\"continue\">Continue</button>";
        
    }
}

//This functions deletes from the shopping cart the product chosen, it's id is passed as a parameter
function buttonDelete(id){
    
    selectedProducts = selectedProducts.filter(function(value, index){ return value.id != id;});
    showSelectedProducts();
        
}


