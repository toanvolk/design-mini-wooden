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
            alert("Hãy nhập tên dự án.");
            return;
        }
        let objProject= {};
        if(data == null){
            objProject = {
                id:  'woodle_'+ Date.now(),
                projectName: projectName,
                createTime: new Date().toDateStringDisplay()
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
        objProject['dataSource'] = indexJs.data.client;
        let dataString = JSON.stringify(objProject);
        localStorage.setItem(objProject.id, dataString);
        $('input.cs-project-name').prop('data',objProject);

        alert('Lưu thành công!');
    });
    $('.btn-new-project').click(function(){
        $('#create-new-project').modal('hide');
        $('input.cs-project-name').prop('data',null);       
        //clear control
        $('input.cs-project-name').val('');
        indexJs.data.client = [];
        indexJs.reload();
    });
    $('button.area-choose-project-action').click(function(){
        indexJs.loadProjectList();
    });

})(indexJs);