

$(document).ready(function(){

    function fetchAndDisplayProducts(url) {
        $('#products-container').empty();

        $.ajax({
            url: url,
            type: 'GET',
            success: function(response) {
                $.each(response, function(index, product) {
                    var productHTML = `
                        <div class="checkbox-wrapper-16">
                            <label class="checkbox-wrapper">
                                <input class="checkbox-input" type="checkbox">
                                <span class="checkbox-tile">
                                    <span class="name">${product.name}</span><br>
                                    <span class="describe">${product.description}</span><br>
                                    <img src="data:image/jpeg;base64,${arrayBufferToBase64(product.image.data)}" alt="water image" class="image">
                                    <span class="price">${product.price}</span>
                                    <span class="checkbox-icon">
                                        <rect fill="none" height="256" width="256"></rect>
                                        <polygon stroke-width="12" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" fill="none" points="72 40 184 40 240 104 128 224 16 104 72 40"></polygon>
                                        <polygon stroke-width="12" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" fill="none" points="177.091 104 128 224 78.909 104 128 40 177.091 104"></polygon>
                                        <line stroke-width="12" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" fill="none" y2="104" x2="240" y1="104" x1="16"></line>
                                    </span>
                                </span>
                            </label>
                        </div>
                    `;
                    $('#products-container').append(productHTML);
                });
            },
            error: function(xhr, status, error) {
                console.error('Error fetching product details:', error);
            }
        });

        function arrayBufferToBase64(buffer) {
            var binary = '';
            var bytes = new Uint8Array(buffer);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        }
    }
   

    $('#all').click(function() {
        $('#number').text('0')
        fetchAndDisplayProducts('http://localhost:3000/products');
    });

    $('#all').click();

    $('#sparkling').click(function() {
        $('#number').text('0')
        fetchAndDisplayProducts('http://localhost:3000/products/sparkling');
    });

    $('#flavored').click(function() {
        $('#number').text('0')
        fetchAndDisplayProducts('http://localhost:3000/products/flavored');
    });

    $('#products-container').on('change', '.checkbox-input', function() {
        var checkedCount = $('.checkbox-input:checked').length;
        $('#number').text(checkedCount);
    });
});

$('#products-container').on('change', '.checkbox-input', function() {
    updateCart();
});


$('#selected-products-container').on('click', '.counter button', function() {
    updateQuantityAndPrice($(this));
});



function updateCart() {
    let totalPrice = 0;
    let selectedProductsHTML = '';

        // Iterate over checked checkboxes
        $('.checkbox-input:checked').each(function() {
            const productContainer = $(this).closest('.checkbox-wrapper-16');
            const productName = productContainer.find('.name').text();
            const productImageSrc = productContainer.find('.image').attr('src');
            const productDescription = productContainer.find('.describe').text();
            const priceText = productContainer.find('.price').text();
            const priceWithoutCurrency = priceText.replace(' Naira', '').replace(',', '');
            const productPrice = parseFloat(priceWithoutCurrency);
            const quantity = 1;

            const totalPricePerItem = productPrice * quantity;
            totalPrice += totalPricePerItem;

            // Add the product to the cart HTML
            selectedProductsHTML += `
            <div class="pricee">
            <span class="namee"> ${productName} </span><br>
            <span class="describee"> ${productDescription}</span><br>
            <img src="${productImageSrc}" alt="water image" class="imagee">
           <span class="priceb" data-initial-price="${productPrice}" >${totalPricePerItem.toLocaleString('en-US', { style: 'currency', currency: 'NGN' })}</span>
            <div class="counter input-group">
                <button class="decrement">-</button>
                <input type="number" value="${quantity}" class="input" readonly >
                <button  class="increment">+</button>
              </div>
            </div>`;
    
        $('.totamount').text(totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'NGN' }));
    
        $('#selected-products-container').html(selectedProductsHTML);

    });
    }

    function updateQuantityAndPrice(button) {
        const input = button.siblings('input[type="number"]');
        const currentValue = parseInt(input.val());
        const initialPriceText = button.closest('.pricee').find('.priceb').attr('data-initial-price');
        const initialPriceWithoutCurrency = initialPriceText.replace('NGN', '').replace(/\u00A0/g, '').replace(',', '');
        const initialProductPrice = parseFloat(initialPriceWithoutCurrency);
        
        if (button.hasClass('decrement')) {
            if (currentValue > 1) {
                input.val(currentValue - 1);
            }
        } else if (button.hasClass('increment')) {
            input.val(currentValue + 1);
        }
    
        const newQuantity = parseInt(input.val());
    
        const newTotalPrice = initialProductPrice * newQuantity;
        button.closest('.pricee').find('.priceb').text(newTotalPrice.toLocaleString('en-US', { style: 'currency', currency: 'NGN' }));
    
        let totalAmount = 0;
        $('.priceb').each(function() {
            totalAmount += parseFloat($(this).text().replace('NGN', '').replace(',', ''));
        });
        
        $('.totamount').text(totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'NGN' }));
    }



    
    $('.checkoutbtn').click(function() {

            const userId = $.cookie("userId");
            const username = $.cookie("username");
            if (!userId) {
              alert("Please log in to place an order.");
              window.location.href = "http://localhost:5500/html/login.html";
              return; 
            }
        const orders = [];
        $('.pricee').each(function() {
            const productName = $(this).find('.namee').text();
            const productDescription = $(this).find('.describee').text();
            const productPrice = $(this).find('.priceb').text();
            const input = $(this).find('input[type="number"]');
            const productQuantity = parseInt(input.val());
            
            orders.push({
                product_name: productName,
                product_description: productDescription,
                product_price: productPrice,
                product_quantity: productQuantity});
        });
        const totalAmount = $('.totamount').text();


        $.ajax({
            url: 'http://localhost:3000/orders',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ orders: orders, total_amount: totalAmount, userId: userId }),
            success: function(response) {
              console.log('Orders submitted successfully');
              alert(`Order for ${username} worth ${totalAmount} has been placed, please provide more details to complete your order`);
              window.location.href = "http://localhost:5500/html/checkout.html"; 
            },
            error: function(xhr, status, error) {
              console.error('Error submitting orders:', error);
            }
          });
    });
    

const all = document.getElementById("all");
const sparkling = document.getElementById("sparkling");
const flavored = document.getElementById("flavored");

all.addEventListener("click", showAll);
sparkling.addEventListener("click", showSparkling);
flavored.addEventListener("click", showFlavored);
function showAll(){
    all.classList.add("active");
    sparkling.classList.remove("active");
    flavored.classList.remove("active");
}
function showSparkling(){
    all.classList.remove("active");
    sparkling.classList.add("active");
    flavored.classList.remove("active");
}
function showFlavored(){
    all.classList.remove("active");
    sparkling.classList.remove("active");
    flavored.classList.add("active");

}


$(document).ready(function(){
    $('.cartbtn').click(function(){
        $('.productss').toggle();
        $('.cartbtn').toggle();
        $('.cartbtn2').toggle();
        $('.card').toggle();
    });
});

$(document).ready(function(){
    $('.cartbtn2').click(function(){
        $('.productss').toggle();
        $('.cartbtn').toggle();
        $('.cartbtn2').toggle();
        $('.card').toggle();
    });
});

// $(document).ready(function(){
//     $('.checkoutbtn').click(function(){
//         $('.card-content').each(function(){
//         const cartContainer = $(this).closest('.pricee');
//         const productName = cartContainer.find('.namee').text();
//         console.log(productName)
//     });
// })});