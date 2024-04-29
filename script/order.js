// $(document).ready(function () {
//   function fetchAndDisplayOrders(url) {
//     $("#orders-container").empty();

//     $.ajax({
//       url: url,
//       type: "GET",
//       success: function (response) {
//         console.log(response);
//         response.orders.forEach(function (order, index) {
//           var orderHTML = `
//                         <tr>
//                             <td>${index + 1}</td>
//                             <td>${order.created_at}</td>
//                             <td>${order.userid}</td>
//                             <td>${order.username}</td>
//                             <td>${order.phone_number}</td>
//                             <td>${order.address}</td>
//                             <td>${order.total_amount}</td>
//                             <td>${order.product_name}</td>
//                             <td>${order.product_price}</td>
//                             <td>${order.product_description}</td>
//                             <td>${order.product_quantity}</td>
//                         </tr>
//                     `;
//           $("#orders-container").append(orderHTML);
//         });
//       },
//       error: function (xhr, status, error) {
//         console.error("Error fetching order details:", error);
//       },
//     });
//   }

//   fetchAndDisplayOrders("http://localhost:3000/orders/admin");
// });


$(document).ready(function () {
  function fetchAndDisplayOrders(url) {
    $("#orders-container").empty();

    $.ajax({
      url: url,
      type: "GET",
      success: function (response) {
        console.log(response);
        var groupedOrders = groupOrdersById(response.orders);
        displayGroupedOrders(groupedOrders);
      },
      error: function (xhr, status, error) {
        console.error("Error fetching order details:", error);
      },
    });
  }

  // Function to group orders by ID
  function groupOrdersById(orders) {
    var groupedOrders = {};
    orders.forEach(function (order) {
      if (!groupedOrders[order.userid]) {
        groupedOrders[order.userid] = [];
      }
      groupedOrders[order.userid].push(order);
    });
    return groupedOrders;
  }

  // Function to display grouped orders
  function displayGroupedOrders(groupedOrders) {
    Object.keys(groupedOrders).forEach(function (userId) {
      var userOrders = groupedOrders[userId];
      var userOrderHTML = `
                <tr>
                    <td colspan="11">User ID: ${userId}</td> <br>
                </tr>
            `;
      userOrders.forEach(function (order, index) {
        userOrderHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${order.created_at}</td>
                        <td>${order.username}</td>
                        <td>${order.phone_number}</td>
                        <td>${order.address}</td>
                        <td>${order.total_amount}</td>
                        <td>${order.product_name}</td>
                        <td>${order.product_price}</td>
                        <td>${order.product_description}</td>
                        <td>${order.product_quantity}</td>
                    </tr>
                `;
      });
      $("#orders-container").append(userOrderHTML);
    });
  }

  fetchAndDisplayOrders("http://localhost:3000/orders/admin");
});
