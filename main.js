$(function () {
    let amountToPay, timer, totalAmount = 0;

    function createCard(bicycle) {
        return $(`<div class="col-xs-4 col-sm-4 col-md-4">
                 <div class="thumbnail">
                   <img src="./bicycles/${bicycle.id}.jpg" />
                    <div class="caption">
                     <h3>${bicycle.name.split(' ')[0]}</h3>
                     <p>${bicycle.phone}</p>
                     <p>${bicycle.price}MKD</p>
                      <p>
                    <a href="#" class="btn btn-primary" role="button">Rent this bicycle</a>
                       </p>
                    </div>
                   </div>
            </div>`).on("click", ".btn-primary", function () {
            rentBicycle(bicycle)
        })

    }

    users.forEach(bicycle => $(".page-body .row").append(createCard(bicycle)));

    function rentBicycle(bicycle) {
        // console.log(bicycle)
        $(".btn-primary").attr('disabled', 'true')

        $(".rent-details").animate({
            left: 0,
            opacity: 1
        }, 500)
        $("#rentedFrom").text(bicycle.name)

        let seconds = 0,
            minutes = 0,
            hours = 0;

        // exercise 4
        let timeToStartFrom = JSON.parse(localStorage.getItem("timeRented")) || 0;

        if (localStorage.getItem("timeRented")) {
            timeToStartFrom = (new Date().getTime() - timeToStartFrom) / 1000;
            console.log(timeToStartFrom)
        }
        //logic to calculate price per second (because the init price is per hour)
        let pricePerSecond = bicycle.price / 3600;

        timer = setInterval(() => {
            // increase time each interval iteration
            timeToStartFrom++;
            // calculate current h/m/s
            hours = Math.floor(timeToStartFrom / 3600);
            minutes = Math.floor(timeToStartFrom % 3600 / 60);
            seconds = Math.floor(timeToStartFrom % 3600 % 60);

            $("#hours").text(hours < 10 ? '0' + hours : hours)
            $("#minutes").text(minutes < 10 ? '0' + minutes : minutes)
            $("#seconds").text(seconds < 10 ? '0' + seconds : seconds)
            //calculate how much you need to pay every second
            amountToPay = (timeToStartFrom * pricePerSecond).toFixed(2)

            $("#amountToPay").text(amountToPay)

        }, 1000)
        // exercise 4 (step 4)
        let timeRented = timeToStartFrom == 0 ? new Date().getTime() : localStorage.getItem("timeRented")
        localStorage.setItem("timeRented", timeRented.toString())

        // exercise 4 (step 1)
        localStorage.setItem("rentedBicycle", JSON.stringify(bicycle))
    }

    //exercise 3
    $("#leaveBicycle").click(() => {
        $(".btn-primary").removeAttr('disabled');
        $(".rent-details").animate({
            left: "-100%",
            opacity: 0
        }, 500)
        clearInterval(timer)

        totalAmount = (parseFloat(totalAmount) + parseFloat(amountToPay)).toFixed(2)

        localStorage.setItem("totalAmount", totalAmount);

        //show the total amount in html
        $(".page-header h2").animate({
            opacity: 1
        }, 500)

        $("#totalAmount").text(totalAmount)

        $("#hours").text("00")
        $("#minutes").text("00")
        $("#seconds").text("00")

        // exercise 4 (step 3)
        localStorage.removeItem("rentedBicycle")
        localStorage.removeItem("timeRented")
    })


    if (localStorage.getItem("totalAmount")) {
        // if totalAmount exists in localStorage, then start from that totalAmount instead of 0
        totalAmount = parseFloat(localStorage.getItem("totalAmount"))
        $(".page-header h2").animate({
            opacity: 1
        }, 500)

        $("#totalAmount").text(totalAmount)
    }
    // exercise 4 (step 2)
    if (localStorage.getItem("rentedBicycle")) {
        rentBicycle(JSON.parse(localStorage.getItem('rentedBicycle')));
    }




});