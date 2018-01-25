$(document).ready(() => {
    SDK.User.loadNav();
    const madListe = $("#madvare-liste");


    SDK.Product.getAllFoods((err, data) => {

//let foods = JSON.parse(SDK.Encryption.encryptDecrypt(data));


        console.log(data);

        data.forEach((food) => {


            madListe.append(`
    <tr>
    <td>${food.productName}</td>
    <td>${food.productPrice}</td>    
    <td><button class="btn btn-success order-button" data-order-id="${food.productId}">Order</button></td>
   </tr>
    `);

            let chk = food.productId;

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
