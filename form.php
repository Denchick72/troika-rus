<?php
    // Подключаем файлы из папки PHPMailer
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    require 'phpmailer/src/Exception.php';
    require 'phpmailer/src/PHPMailer.php';

    //Объявляем плагин PHPMailer
    $mail = new PHPMailer(true);
    $mail -> CharSet = 'UTF-8'; // Настраиваем кодировку
    $mail -> setLanguage('ru', 'phpmailer/language/');  // Подключаем языковой файл для вывода ошибок на понятном языке
    $mail -> IsHTML(true);  // Включаем возможности использование HTML-тегов в письме

    // НАСТРОЙКА ПИСЬМА
    // От кого письмо
    $mail -> setFrom('denkaraev@gmail.com', 'Фрилансер по жизни');

    // Кому отправим
    $mail -> addAddress('denkaraev@mail.ru');   // можно укзаать больше 1 адресата
    
    // Тема письма
    $mail -> Subject = 'Привет! Это "Фрилансер по жизни"';

    // Рука
    $hand = "Правая";
    if($_POST['hand'] == "left") {
        $hand = "Левая";
    }

    // Тело письма
    $body = '<h1>Встречаейте супер письмо!</h1>';

    if(trim(!empty($_POST['name']))) {  // Если поле не пустое, то...
        $body .= '<p><strong>Имя:</strong> '.$_POST['name'].'</p>'; // . - соединение 2-ух строк в php
    }

    if(trim(!empty($_POST['email']))) { // Если поле не пустое, то...
        $body .= '<p><strong>E-mail:</strong> '.$_POST['email'].'</p>';
    }

    if(trim(!empty($_POST['hand']))) {  // Если поле не пустое, то...
        $body .= '<p><strong>Рука:</strong> '.$_hand.'</p>';
    }

    if(trim(!empty($_POST['age']))) {   // Если поле не пустое, то...
        $body .= '<p><strong>Возраст:</strong> '.$_POST['age'].'</p>';
    }

    if(trim(!empty($_POST['message']))) {   // Если поле не пустое, то...
        $body .= '<p><strong>Сообщение:</strong> '.$_POST['message'].'</p>';
    }

    // Прикрепить файл
    if (!empty($_FILES['image']['tmp_name'])) { // проверка наличия файла
        // Путь загрузки файла
        $filePath = __DIR__ . "/files/" . $_FILES['image']['name'];
        // загружаем файл
        if (copy($_FILES['image']['tmp_name'], $filePath)) {    // если копирование файла в папку/на сервер произошло успешно, то...
            $fileAttach = $filePath;
            $body .= '<p><strong>Фото в приложении</strong></p>';   // добавляем в тело письма строку
            $mail -> addAttachment($fileAttach);    // в плагин добавляем файл
        }
    }

    $mail -> Body = $body;  // переменная body присваивается в плагин

    // Отправляем
    if (!$mail -> send()) { // если форма не отправилась, то ...
        $message = 'Ошибка';
    } else {    // если форма отправилась, то ...
        $message = 'Данные отправлены!';
    }

    $response = ['message' => $message];    // формируем файл json

    header('Content-type: application/json');
    echo json_encode($response);    // возвращаем обратно в java script
?>