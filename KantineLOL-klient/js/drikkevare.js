$(document).ready(() => {
    SDK.User.loadNav();
    const drikkeListe = $("#drikkevare-liste");


    SDK.Product.getAllDrinks((err, data) => {

//let foods = JSON.parse(SDK.Encryption.encryptDecrypt(data));


        console.log(data);

        data.forEach((drink) => {




           drikkeListe.append(`
    <tr>
    <td>${drink.productName}</td>
    <td>${drink.productPrice}</td>    
    <td><button class="btn btn-success order-button" data-order-id="${drink.productId}">Order</button></td>
    </tr> `);

            let chk = drink.productId;

            console.log(chk);
            $(".order-button").click(function () {
                console.log("click");
                //$purchaseModal.modal('toggle');
                const productId = $(this).data("order-id");
                const product = data.find(p => p.productId === productId);
                SDK.Product.addToBasket(product);
            })

        })
    })
})

