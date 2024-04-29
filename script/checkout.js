$(document).ready(function(){
        $(".orderbtn").click(function () {
          const userId = $.cookie("userId");
          const address = $(".feedback").val();
          const phoneNumber = $('.input[name="phonenumber"]').val();

          $.ajax({
            url: "http://localhost:3000/updateUserDetails",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
              userId: userId,
              address: address,
              phoneNumber: phoneNumber,
            }),
            success: function (response) {
             console.log("User details updated successfully");
            },
            error: function (xhr, status, error) {
              console.error("Error updating user details:", error);
            },
          });
           $(".body").toggle()
           $(".notifications-container").toggle();
        });
    })

