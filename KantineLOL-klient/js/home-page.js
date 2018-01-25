$(document).ready(() => {

    SDK.User.loadNav();
    const currentUser = SDK.User.current();
    const $basketTbody = $("#basket-tbody");

    $(".page-header").html(`
    <h1>Hej, ${currentUser.username}</h1>
  `);

    SDK.Order.findMine((err, orders) => {
        if(err) throw err;
        orders.forEach(order => {
            $basketTbody.append(`
            <tr>
            <td>${order.id}</td>
            <td>${parseOrderItems(order.orderItems)}</td>
            <td>kr. ${sumTotal(order.orderItems)}</td>
             </tr>
      `);
        });
    });

    function parseOrderItems(items){
        return items.map(item => {
            return item.count + " x " + item.productName
        }).join(", ");
    }

    function sumTotal(items){
        let total = 0;
        items.forEach(item => {
            total += item.count * item.productPrice
        });
        return total;
    }


});