(function(indexJs){
    indexJs.init();
    $('.btn-nav-add-class').click(function(){
        let w= $('.cs-data-input-nav-w').val();
        let h= $('.cs-data-input-nav-h').val();
        let quantity = $('.cs-data-input-nav-quantity').val();
        if(w > indexJs.data.config.w || h > indexJs.data.config.h)
        {
            alert("Độ rộng hoặc độ cao quá giới hạn khổ.");
            return;
        }
        if(w == 0|| h == 0)
        {
            alert("Hãy nhập chiều rộng và chiều cao.");
            return;
        }     

        let objClass = {
            id : cs_common.newId(),
            w: w,
            h: h,
            bg_color: cs_common.randomColor(),
            quantity: quantity
        };
        
        indexJs.data.client.push(objClass);
        indexJs.reload();
    });
    
})(indexJs);