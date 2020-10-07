$( document ).ready(function(){

    //basic
     setInterval(get_product_list, 1000);
    //  setInterval(function() {
    //     get_product_list();
    // }, 100);
    // get_result_price();
    delete_product();
    get_product_list();
    

    //Tab's
        let current_tabs; 
        $( "ul.head_tabs > li" ).click(function() {  
      
            $( "ul.head_tabs > li" ).removeClass("active")
            $(this).addClass("active");

            current_tabs = $(this).attr("data-open-tabs");

            $( ".data_tabs > div" ).removeClass("active");
            $( ".data_tabs > div#"+current_tabs).addClass("active");
        });

    //Choose color & part
        $( "ul.list_option > li" ).click(function() { 
          
            $(this).parent( ".list_option" ).children('li').removeClass("active")
            $(this).addClass("active");
        });
        

    //Search
        $(".btn").click(function() {
            event.preventDefault();

            var znachennie_poiska;

            znachennie_poiska = $("[name='searc']").val();

            if (znachennie_poiska == "") {

                znachennie_poiska = "Enter your search word in the search field!";

            }

            alert(znachennie_poiska);
        });



    $( ".count_product button" ).click(function(){ 
        let current_btn, current_count, new_count;

        current_btn = $(this).attr('data-type');
        current_count = $(".count_product .js_number").val();
       
        if(current_count >0) {
            if(current_btn == 'plus') {
                new_count = +current_count+1;
            } else {
              new_count = 1;
            }
        }
        $(".count_product .js_number").val(new_count);

    });

          
    /*Добавление товара в корзину*/
        $( "a.add_to_cart" ).click(function() {
            event.preventDefault ();

            var check_product_color, check_product_part;

            if($(".products_color .list_option > li").hasClass("active")) {
     
                $(".products_color .list_option").css({'border' : '1px solid transparent'});
                    check_product_color = 1;

            }   else {
                    $(".products_color .list_option").css({'border' : '1px solid red'});
                    alert("Select product color!")
                }

            if($(".products_size .list_option > li").hasClass("active")) {
             
                $(".products_size .list_option").css({'border' : '1px solid transparent'});
                    check_product_part = 1;

             }  else {
                    $(".products_size .list_option").css({'border' : '1px solid red'});
                    alert("Select a part of the product!")
                }

            if (check_product_color == 1 && check_product_part == 1) {
              
                var  name, cena, cvet, razmer, img_src, add_content, kolichestvo, result_price, url, body_cart;

                    $(".cart_ttl").css({"display": "none"});

                    name         = $("h1.ttl.def_color_txt").text();
                    kolichestvo  = $(".count_product .js_number").val();
                    cvet         = $(".products_color ul.list_option li.active span > span").text();
                    razmer       = $(".products_size ul.list_option li.active span > span").text();
                    cena         = $(".product_info .price .cena_za_odin").text();
                    img_src      = $(".product_cont div:first-child > img ").attr("src");
                    url          = $("input[name='url']").val();
                  
                    result_price = cena * kolichestvo;

                    add_content  ='<div class="dannye_tovarov"><a href=""><div class="kartinka_tovara"><img src="'+img_src+'" alt=""></div><div class="opisanie_tovara"><p>'+name+'</p><p class="cart_count"><span>Amount:</span><span>  '+kolichestvo+'</span></p><p class="cart_color_size"><span>'+cvet+'  </span><span>'+razmer+'</span></p><div class="block_price"><span class="originalnaya_cena"><span class="symbol">$</span><span class="cena_za_odin">  '+cena+'</span></span><sup> <span>*</span><span>'+result_price+'</span></sup></div></div></a><div class="udalit_zakaz"><i class="fa fa-trash" aria-hidden="true"></i></div></div>';
                    
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

                        $(".list_option > li").removeClass('active');
                        $(".js_number").val(1);
            }

        }); 

      
        $( ".jq_click > div" ).on("click" , function(event) {
            event.preventDefault();

            $(this).children(".jq_open").slideToggle(300);

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

            get_result_price()

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
                $('.itog').html("$ "+resultat);
                $('span.summa_v_korzine').html("/ "+resultat+ " $");
                $('span.kol_tovarov').html(cout_pro);
            }
    }

});