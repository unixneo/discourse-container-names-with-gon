(function () {
    if (!document.getElementById('container-names'))
    {
        var my_div = document.createElement('div');
        my_div.setAttribute("id", "container-names");
        my_div.style.margin = "10px";
        my_div.innerHTML = 'Containers: '+gon.global.container_main+', '+gon.global.container_data+'<br>  Disk Space (df) on '+gon.global.diskspace;
        var element = document.getElementsByClassName("admin-content");
        if (element.length > 0) {
            element[0].prepend(my_div);
        }
    }
})();