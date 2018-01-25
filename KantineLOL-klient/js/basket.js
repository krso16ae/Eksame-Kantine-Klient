$(document).ready(() => {

    SDK.User.loadNav();


    const $modalTbody = $("#basket-tbody");
    const $checkoutActions = $("#checkout-actions");
    const $theBasketIsEmptyContainer = $("#the-basket-is-empty-container");

    function loadBasket() {
        const currentUser = SDK.User.current();
        const basket = SDK.Storage.load("basket") || [];
        let total = 0;

        $theBasketIsEmptyContainer.show();

        if (!basket.length) {
            $("#checkout-table-container").hide();
        } else {
            $theBasketIsEmptyContainer.hide();
        }

        basket.forEach(entry => {
            let subtotal = entry.product.productPrice * entry.count;
            total += subtotal;
            $modalTbody.append(`
        <tr>
            <td>${entry.product.productName}</td>
            <td>${entry.count}</td>
            <td>kr. ${entry.product.productPrice}</td>
            <td>kr. ${subtotal}</td>
        </tr>
      `);
        });

        $modalTbody.append(`
      <tr>
        <td colspan="3"></td>
        <td><b>Total</b></td>
        <td>kr. ${total}</td>
      </tr>
    `);

        if (currentUser) {
            $checkoutActions.append(`
      <button class="btn btn-success btn-lg" id="checkout-button">Tjek ud</button>
    `);
        }
        else {
            $checkoutActions.append(`
      <a href="login.html">
        <button class="btn btn-primary btn-lg">Log ind for at tjekke ud</button>
      </a>
    `);
        }
    }

    loadBasket();

    $("#clear-button").click(() => {
        SDK.Storage.remove("basket");
        loadBasket();
    });

    $("#checkout-button").click(() => {
        const basket = SDK.Storage.load("basket");
        SDK.Order.orderRequest({
            createdById: SDK.User.current().id,
            orderItems: basket.map(orderItem => {
                return {
                    count: orderItem.count,
                    productId: orderItem.product.productId
                }
            })
        }, (err, order) => {
            if (err) throw err;
            $("#order-alert-container").find(".alert-success").show();
            SDK.Storage.remove("basket");
            loadBasket();
            $theBasketIsEmptyContainer.hide();
        });
    });

});