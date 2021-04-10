if (!document.getElementById('container-names')  && document.getElementsByClassName("admin-content").length > 0)
{
    var my_div = document.createElement('div');
    my_div.setAttribute("id", "container-names");
    my_div.style.margin = "10px";
    my_div.innerHTML = 'Containers: '+gon.global.container_main+', '+gon.global.container_data+'<br>  Disk Space (df) on '+gon.global.diskspace;
    var element = document.getElementsByClassName("admin-content");
    element[0].prepend(my_div);
}