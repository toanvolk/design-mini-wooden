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
    $('.btn-save-project').click(function(){
        let projectName = $('input.cs-project-name').val();
        let data = $('input.cs-project-name').prop('data');

        if(projectName.trim() == '')
        {
            $("#toast-save-failed .toast-body").text('Hãy nhập tên dự án.');
            new bootstrap.Toast('#toast-save-failed').show();
            return;
        }
        let objProject= {};
        if(data == null){
            objProject = {
                id:  'woodle_'+ Date.now(),
                projectName: projectName,
                createTime: new Date().toDateStringDisplay(),
            }
            //Lưu danh sách chọn
            indexJs.projectList.push(objProject.id);
            localStorage.setItem(indexJs.const.projectListString, JSON.stringify(indexJs.projectList));
        }
        else
        {
            objProject = $('input.cs-project-name').prop('data');
            objProject['projectName']=projectName;
            objProject['lastModifyTime'] = new Date().toDateStringDisplay();
        }
        //lưu data
        objProject ["isDistinguishWidthAndHeight"] = $('input#distinguish-w-h').prop("checked");
        objProject['dataSource'] = indexJs.data.client;
        let dataString = JSON.stringify(objProject);
        localStorage.setItem(objProject.id, dataString);
        $('input.cs-project-name').prop('data',objProject);
        
        new bootstrap.Toast('#toast-save').show();
    });
    $('.btn-new-project').click(function(){
        $('#create-new-project').modal('hide');
        indexJs.mapSourceProject(null);
        indexJs.reload();
    });
    $('button.area-choose-project-action').click(function(){
        indexJs.loadProjectList();
    });
    $('button.btn-remove-project-warning').click(function(){
        let data = $('input.cs-project-name').prop('data');
        if(data== null)
        {
            alert("Không tìm thấy dự án cần xóa!")
            return;
        }else{
            $('#remove-project-modal').modal('show');
            $('#remove-project-modal .modal-body').html('<p>Chắc xóa dự án <b>'+data.projectName+'</b> ?</p>');
            $('#remove-project-modal button.btn-remove-project').prop('data',data);        
        }
    });
    $('button.btn-remove-project').click(function(){
        let objData = $(this).prop('data');
        console.log(objData);
        

        let indexObj = indexJs.projectList.findIndex(function(value) {
            return value == objData.id;
        });
        if (indexObj !== -1) indexJs.projectList.splice(indexObj, 1);
        //remove obj from storage
        localStorage.removeItem(objData.id);
        localStorage.setItem(indexJs.const.projectListString, JSON.stringify(indexJs.projectList));

        //clear control - change status to create
        indexJs.mapSourceProject(null);
        indexJs.reload();
        $('#remove-project-modal').modal('hide');
    });
    $('button.btn-print-view').click(function(){
        let objConfig = indexJs.data.config.get();        
        let titleHtml = '<p class="cs-view-title"><b>'+$('input.cs-project-name').val().toUpperCase()+'</b></p>';
        $('.cs-view').prepend($(titleHtml));
        let zoomValue = $('.cs-view').css('zoom');
        $('.cs-view').css({"height": "auto", "zoom": objConfig.zoomPrint+"%"});        
        $('#view-main').print();
        $( ".cs-view p.cs-view-title" ).remove();
        $('.cs-view').css({"height": "", "zoom": zoomValue});
    });
    $('input#distinguish-w-h').click(function(){
        indexJs.reload();
    });
    var setupClientModal = document.getElementById('setup-client-modal')
    setupClientModal.addEventListener('shown.bs.modal', function (event) {
        let objConfig = indexJs.data.config.get();
        $('input#zoom-print').val(objConfig['zoomPrint'])
    })
    $('button.btn-save-config').click(function(){
        let zoomValue = $('input#zoom-print').val();
        let objConfig = indexJs.data.config.get();
        objConfig["zoomPrint"] = zoomValue;
        indexJs.data.config.set(objConfig);

        $('#setup-client-modal').modal('hide');
    });
})(indexJs);