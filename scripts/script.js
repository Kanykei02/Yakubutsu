$(document).ready(function() {

    // setInterval(function() {
    //     get_product_list();
    // }, 100);
    setInterval(get_product_list, 1000);
    get_result_price();
    delete_product();
    // get_product_list();
    

   // Поиск
    $(".pokazat_resultat").click(function() {
        event.preventDefault();

        var znachennie_poiska;

        znachennie_poiska = $("[name='poisk']").val();

        if (znachennie_poiska == "") {

            znachennie_poiska = "Enter your search word in the search field!";

        }

        alert(znachennie_poiska);
    });

   //Новая версия отображения меню
    $( ".jq_click > li" ).on("click" , function(event) {
        event.preventDefault();

		$(this).children(".jq_open").slideToggle(300);

    });

    $( ".menu_korzina" ).on("click" , function(event) {

        $( ".menu_korzina ~ .jq_open" ).slideToggle(300);

    });

 
    /*Добавление товара в корзину*/
    $(".product_btns .add_to_cart").click(function(event) {
        event.preventDefault ();

        var  name, cena, cvet, razmer, img_src, add_content, body_cart, result_price;

        $(".cart_ttl").css({"display": "none"});

        name    = $(this).parent(".product_btns").children('input[name="nazvanie_tovara"]').val();
        cena    = $(this).parent(".product_btns").children('input[name="cena"]').val();
        cvet    = $(this).parent(".product_btns").children('input[name="cvet"]').val();
        razmer  = $(this).parent(".product_btns").children('input[name="razmer"]').val();
        


        if($(this).parent(".product_btns").parent(".product_cont").children("a").children(".block_img").hasClass("block_img")) {
           
           img_src = $(this).parent(".product_btns").parent(".product_cont").children("a").children(".block_img").children("img").attr('src');
        } else {
           img_src = $(this).parent(".product_btns").parent(".product_cont").children("a").children(".bs_picture").children("img").attr('src');
        }
        kolichestvo = 1;

        result_price = cena * 1;

        add_content  ='<div class="dannye_tovarov"><a href=""><div class="kartinka_tovara"><img src="http://wp1.j1106265.ndzjp.spectrum.myjino.ru/'+img_src+'" alt=""></div><div class="opisanie_tovara"><p>'+name+'</p><p class="cart_count"><span>Amount:</span><span>  '+kolichestvo+'</span></p><p class="cart_color_size"><span>'+cvet+'  </span><span>'+razmer+'</span></p><div class="block_price"><span class="originalnaya_cena"><span class="symbol">$</span><span class="cena_za_odin">  '+cena+'</span></span><sup> <span>*</span><span>'+result_price+'</span></sup></div></div></a><div class="udalit_zakaz"><i class="fa fa-trash" aria-hidden="true"></i></div></div>';

        $(add_content).appendTo(".listing_zakazov");

        
        body_cart   = $(".block_opisanie_korziny").html();

        $.ajax({
                          
            type: "POST",
            url:  'http://wp1.j1106265.ndzjp.spectrum.myjino.ru/product/cart.php',
            data: { content: body_cart}
        
        }).done(function( msg ) {
            alert("Your item has been successfully added to the cart!");
        });

            get_result_price();
            delete_product();
    });



    /*Скрытие и раскрытие звездочки*/
    $(".product_cont").mouseover(function() {
        $(this).children(".product_btns").css({"display": "block"});
        $(this).children("a").children(".poduct_desk").children(".stars").css({"display": "none"});
    });
    
    $(".product_cont").mouseleave(function() {
        $(this).children(".product_btns").css({"display": "none"});
        $(this).children("a").children(".poduct_desk").children(".stars").css({"display": "block"});
    });

 
    /*Для оптимизации, выбор размера и цвета*/

    $( ".color > span" ).on("click" , function(event) {
        event.preventDefault();

        var get_curr_color;

        get_curr_color = $(this).text();

        $('input[name="cvet"]').val( get_curr_color);

    });

    $( ".size > span" ).on("click" , function(event) {
        event.preventDefault();

        var get_curr_size;

        get_curr_size = $(this).text();

        $('input[name="razmer"]').val( get_curr_size);

    });

    $(".color > span").on("click" , function(event) {

        $(this).css({"border": "1.5px solid red"});

    });

    $(".size > span").on("click" , function(event) {

        $(this).css({"border": "1.5px solid red"});

    });


    //Получение данных из файла с помощью Ajax
        function get_product_list() {
            $.ajax({
                method: "POST",
                url: 'http://wp1.j1106265.ndzjp.spectrum.myjino.ru/product/cart.php',
                dataType: "text",

                success: function (data) {
                if (data !="") {
                    $(".block_opisanie_korziny").html(data);
                  
                }
                    get_result_price();
                    delete_product();
                }
            });
        }


    /*Удаление товара в корзине*/
     function delete_product() {

        $( ".dannye_tovarov" ).on("click" , ".udalit_zakaz" , function(event) {
            $(this).parent(".dannye_tovarov").remove();


            body_cart   = $(".block_opisanie_korziny").html();

            $.ajax({
              
                type: "POST",
                url:  'http://wp1.j1106265.ndzjp.spectrum.myjino.ru/product/cart.php',
                data: { content: body_cart}
            
            });

            get_result_price();

        });

    }


     /* Цикл для получения каждой цены товара в корзине*/

    function get_result_price() {

        var resultat = 0;
        var cout_pro = 0;

            $(".listing_zakazov .dannye_tovarov sup span:nth-child(2)").each(function( index ) {
                resultat =  resultat + parseFloat($(this).text());
            });


            $(".listing_zakazov .dannye_tovarov .cart_count span:nth-child(2)").each(function( index ) {
                cout_pro = cout_pro + parseFloat($(this).text());
            });

            if (resultat == 0) {
                $(".listing_zakazov").html("<span class='cart_ttl'>Sorry, your shopping cart is empty!</span>");
                $('span.summa_v_korzine').html("$ 0");
                $('span.kol_tovarov').html("0");
                $('.itog').html("0");
            }
            else {
                $('.cart_ttl').remove();
                $('.itog').html("$ "+resultat);
                $('span.summa_v_korzine').html("/ "+resultat+ " $");
                $('span.kol_tovarov').html(cout_pro);
            }
    }


});



 