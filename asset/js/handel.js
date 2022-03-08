var indexJs = 
{
    const: {
        HtmlClientContent: '<div class="input-group mb-3 cs-data-input"><span class="input-group-text cs-input-group-text bd-data bd-name" data-field="name"></span><input type="number"class="form-control bd-data bd-w"placeholder="W" data-field="w" readonly><input type="number"class="form-control bd-data bd-h"placeholder="H" data-field="h" readonly><input type="number"class="form-control bd-data bd-quanlity" placeholder="Số lượng" data-field="quantity"><button class="btn btn-danger cs-btn-remove-item">-</button></div>',
        constantZOOM: 1,
        projectListString: 'woodle_list_private'
    },
    data: {
        config:{
            w:1200,
            h:2400,
            x:360,
            y:720
        },
        client:[]
    },
    projectList:[],

    init: function(){
        $('.cs-setup .cs-data').text("W: "+indexJs.data.config.w + " | "+ "H: "+indexJs.data.config.h + " (đơn vị: mm)");
        // Load dữ liệu đệm
        let sourceProjectList = localStorage.getItem(this.const.projectListString);
        if(sourceProjectList != null){
            indexJs.projectList = JSON.parse(sourceProjectList);
        };
        this.loadProjectList();
        // khởi tạo thiết lập
        indexJs.reload();        
    },
    convertToDisplay: function(value){
        return value*this.const.constantZOOM;
    },
    convertUnitToPercent: function(value, typeValue){
        if(typeValue == 'w' || typeValue == 'x' ){
            return (value/this.data.config.w)*100;
        }
        else
        {
            return (value/this.data.config.h)*100;
        };
    },
    convertRealSize: function(value){
        return value/this.const.constantZOOM;
    },
    reload: function (){
        $('.cs-client-content').html('');
        $.each(indexJs.data.client, function(key,value){
            $('.cs-client-content').append(function () {
                return $(indexJs.const.HtmlClientContent)
                .attr('id', value["id"])
                .find('.bd-data')
                    .each(function (i, dom) {
                        let field = $(dom).data("field"); 
                        if($(dom).is("input")){
                            $(dom).val(value[field]);
                        }else{
                            $(dom).text(key+1);
                            //$(dom).css('background-color',value["bg_color"]);
                        }
                    }).parent();
                    
            });
        });
        $('input.bd-data.bd-quanlity').change(function(){
            let id = $(this).closest('.cs-data-input').attr('id');
            let objRect = indexJs.data.client.find(o=>o.id == id);
            objRect.quantity = this.value;
            
            indexJs.reload();
        });
        $('.cs-btn-remove-item').click(function(){
            let id = $(this).closest('.cs-data-input').attr('id');
            let indexObj = indexJs.data.client.findIndex(function(obj) {
                return obj.id == id;
            });
            if (indexObj !== -1) indexJs.data.client.splice(indexObj, 1);
            indexJs.reload();
        });
        //design auto
        indexJs.designAuto();
    },
    loadProjectList: function(){
        $('.project-list').html('');
        let htmlTable = '<table class="table project-list-table"><thead><tr><th scope="col">#</th><th scope="col">Tên dự án</th><th scope="col">Ngày tạo</th></tr></thead><tbody>{list-source}</tbody></table>';
        let htmlData = '';
        let index = 0;
        indexJs.projectList.sort(function(a, b) {
            return b.localeCompare(a);
        });
        indexJs.projectList.forEach(project => {
            index++;
            let objProject = JSON.parse(localStorage.getItem(project));
            htmlData+='<tr data-id="'+objProject.id+'"><th scope="row">'+index+'</th><td><p class="text-info btn-choose-project cs-pointer">'+objProject.projectName+'</p></td><td>'+objProject.createTime+'</td></tr>';
        });
        htmlTable = htmlTable.replace('{list-source}',htmlData);
        $('.project-list').append($(htmlTable));

        //init event
        $('p.btn-choose-project').click(function(){
            let id = $(this).closest('tr').data('id');
            let objDataProject = localStorage.getItem(id);
            indexJs.mapSourceProject(JSON.parse(objDataProject));
            $('#project-list').modal('hide');
        });
    },
    mapSourceProject: function(data){
        $('input.cs-project-name').prop('data',data);       
        if(data==null)
        {
            $('input.cs-project-name').val('');
            indexJs.data.client = [];
        }
        else
        {
            $('input.cs-project-name').val(data.projectName);
            indexJs.data.client = data.dataSource;
        };
        indexJs.reload();
    },
    designAuto: function(){
        //clear display
        indexJs.clearContentItem();

        //variable
        let regions= [];
        let rects = [];

        let regMain = {
            x: 0,
            y: 0,
            w : this.convertToDisplay(this.data.config.w),
            h : this.convertToDisplay(indexJs.data.config.h)
        }
        // regions.push(regMain);
        //read source and init data        
        $.each(indexJs.data.client, function(key,value){
            for(let i=0; i<value.quantity; i++)
            {
                let  objRect = {
                    name:key + 1,
                    w: indexJs.convertToDisplay(value.w),
                    h: indexJs.convertToDisplay(value.h)
                };
                rects.push(objRect);
            };
        });
        //with sort
        rects.sort(function(a, b) {
            return parseFloat(b.h) - parseFloat(a.h);
        });
        //access main
        let indexRegionParent = 0;
        let contentId = '';
        let rectCount = rects.length;
        let regCount = 0;
        while(rects.length > 0){
            //addition region parent
            if(regions.length == 0)
            {
                regCount++;
                contentId = cs_common.newId();
                indexRegionParent += 1;
                regions.push(regMain);
                indexJs.addContent(contentId,indexRegionParent);
            }
            let indexRegionsLast =regions.length - 1;
            let reg = regions[indexRegionsLast];
            let isDefaultRemove = true;    
            
            for(let i = 0; i < rects.length; i++){
                let rect = rects[i];
                if(reg.w >= rect.w && reg.h >= rect.h)
                {
                    //happy case
                    rects.splice(i,1);
                    let drawRect = {
                        name: rect.name,
                        x : reg.x,
                        y: reg.y,
                        w: rect.w,
                        h: rect.h
                    }

                    indexJs.addContentItem(contentId, drawRect);
                    let regNew1 = {
                        x: reg.x,
                        y: reg.y + rect.h,
                        w: reg.w,
                        h: reg.h - rect.h
                    }, regNew2 = {
                        x: reg.x + rect.w,
                        y: reg.y,
                        w: reg.w - rect.w,
                        h: rect.h
                    };
                                        
                    regions.splice(indexRegionsLast,1);
                    regions.push(regNew1, regNew2);
                    isDefaultRemove = false;                    
                    break;
                }
            }
            if(isDefaultRemove) regions.splice(indexRegionsLast,1);
            regions.removeIf(function(obj, index){
                return obj.w == 0 || obj.h == 0;
            });
            regions.sort(function(a, b) {
                return parseFloat(b.w) - parseFloat(a.w);
            });
        }
        $('span.cs-quantity-cut').html('<b>'+rectCount+'</b>');
        $('span.cs-quantity-big').html('<b>'+regCount+'</b>');

        console.log('regs Len:'+ regions.length);
    },
    addContent: function(contentId, index){
        let contentHtml = '<div class="cs-view-detail" id="'+contentId+'"><div class="cs-view-detail-title">Tấm '+index+'</div><div class="cs-view-detail-content content-'+index+'"></div></div>'
        let $view = $('#view-main');
        $view.append($(contentHtml));
    },
    addContentItem: function(contentId, objRect){
        let $content = $('#'+contentId + ' .cs-view-detail-content');       
        let $itemHtml = $('<div class="rect-item"><small title="'+this.convertRealSize(objRect.w)+'x'+this.convertRealSize(objRect.h)+'">('+this.convertRealSize(objRect.w)+'x'+this.convertRealSize(objRect.h)+')</small></div>').css({
            "left": this.convertUnitToPercent(objRect.x, 'x')  +"%",
            "top": this.convertUnitToPercent(objRect.y, 'y')  +"%",
            "width":  this.convertUnitToPercent(objRect.w, 'w')  +"%",
            "height": this.convertUnitToPercent(objRect.h,'h')  +"%",
        });
        $content.append($itemHtml);
    },
    clearContentItem: function(){
        let $content = $('#view-main');       
        $content.html('');
    },
    zoomView: function(value){
        $('.cs-view').css({"zoom": value+"%"});
    }
};