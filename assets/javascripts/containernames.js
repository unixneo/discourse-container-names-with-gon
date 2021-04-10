if($('#container-names').length === 0){
    var containers = '<div id="container-names" style="margin:10px;"> Containers: '+gon.global.container_main+', '+gon.global.container_data+'<br>  Disk Space (df) on '+gon.global.diskspace+'</div>';
    $(".admin-content").prepend( containers  );
}