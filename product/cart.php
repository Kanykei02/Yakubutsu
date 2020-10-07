<?php

    ini_set('error_reporting', E_ALL);
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);

    $get_product = file_get_contents("http://wp1.j1106265.ndzjp.spectrum.myjino.ru/product/cart/list_product.txt");

    echo $get_product;


    if (!empty($_POST['content'])) {
         
        $fd = fopen("cart/list_product.txt", 'w') or die ("не удалось открыть файл!");

        $get_product = $_POST['content'];
        fwrite($fd, $get_product);
        fclose($fd);
    }

?>