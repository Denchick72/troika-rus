"use strict" // задание строгого режима

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form'); //присваиваем элемент по id = form
    form.addEventListener('submit', formSend);  // при отправки формы переходим в функцию formSend

    async function formSend(e) {
        e.preventDefault(); // запрещаем стандартную отправку формы (при нажатии на кнопку ничего не происходит)
        // Делаем валидацию form (если нужно, чтобы поле было обязательно заполнено и чтобы правильно был написан e-mail (@, .))

        let error = formValidate(form);
        
        let formData = new FormData(form);  // получаем все данные с полей
        formData.append('image', formImage.files[0]);   // добавляем в переменную FormData изображение, полученное при обработке загруженной картинки

        if (error === 0) {  // если форма прошла проверку, делаем отправку с помощью Аякс (Фетч)
            form.classList.add('_sending'); // добавляем класс _sending
            let response = await fetch('form.php', {    // созд перемен response, ждем в нее отправку данных файлом sendmail.php
                method: 'POST', // методом POST
                body: formData  // из formData
            });
            if (response.ok) {  // если отправка данных произошла, то...
                let result = await response.json(); // возвращается json ответ, который мы получаем и выводим пользователю
                alert(result.message);
                formPreview.innerHTML = ''; // форму отправили -> почистили
                form.reset();   // очистили все поля form
                form.classList.remove('_sending');  // забираем класс _sending
            } else {
                alert("Ошибка");
                form.classList.remove('_sending');  // забираем класс _sending
            }
        } else {
            alert('Заполните обязательные поля');
        }
    }

    function formValidate(form) {
        let error = 0;
        let formReq = document.querySelectorAll('._req'); //._req - (require - обязательное поле) - класс объектов из html. Проверяем поля Имя, E-mail и Checkbox

        for (let index = 0; index < formReq.length; index++) {
            const input = formReq[index];
            formRemoveError(input);

            if (input.classList.contains('_email')) {
                if (emailTest(input)) { // если проверка не продена
                    formAddError(input);
                    error++;    // увеличиваем на единицу нашу переменную
                }
            }
            else if (input.getAttribute("type") === "checkbox" && input.checked === false) {    // проверяем наличие checkbox'а
                formAddError(input);
                error++;
            } 
            else {
                if (input.value === '') {   // Проверка заполненности поля в принципе
                    formAddError(input);
                    error++;
                }
            }
        }
        return error;   //либо 0, либо >0

    }
    
    function formAddError(input) { // добавляет объекту и родительскому объекту класс error
        input.parentElement.classList.add('_error');
        input.classList.add('_error');
    }
    function formRemoveError(input) {   // убирает объекту и родительскому объекту класс error
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error');
    }
    
    // Функция проверки e-mail
    function emailTest(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);  // регулярное выражение, проверяющее наличие @, . и количество символов
    }

    // Получаем input файл фотографии в переменную
    const formImage = document.getElementById('formImage');
    // Получаем вид для preview в переменную
    const formPreview = document.getElementById('formPreview');

    // Слушаем изменения в input file
    formImage.addEventListener('change', () => {
        uploadFile(formImage.files[0]); // Вызов функции uploadFile
    })

    // Функция uploadFile
    function uploadFile(file) {
        // Проверяем тип файла
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            alert('Разрешены только изображения');
            formImage.value = '';
            return;
        }
        // Проверим размер файла (<2 Мб)
        if (file.size > 2 * 1024 * 1024) {
            alert('Файл должен быть менее 2 Мб');
            return;
        }

        var reader = new FileReader();
        reader.onload = function(e) {   // когда файл загружен
            formPreview.innerHTML = `<img src="${e.target.result}" alt = "Фото">`;  // формируем изображение src, которое помещаем внутрь div id = "formPreview"
        };
        reader.onerror = function(e) {  // если будет ошибка, пользователь получи сообщение об ошибке
            alert('Ошибка');
        };
        reader.readAsDataURL(file);
    }
});