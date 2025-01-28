function initUniform() {
    $("input:checkbox, input:radio, input:file").uniform();
}

function init_validation() {
    if ($().validate) {
        $.validator.setDefaults({
            errorElement: 'label', //default input error message container
            errorClass: 'help-block help-block-error', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "", // validate all fields including form hidden input
            invalidHandler: function (event, validator) { //display error alert on form submit 
            },
            highlight: function (element) { // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.form-group').removeClass('has-error'); // set error class to the control group
            },
            success: function (label) {
                label.closest('.form-group').removeClass('has-error'); // set success class to the control group
            }
        });
    }
}

function confirm_box(data, callback, callback2) {
    bootbox.confirm({
        message: "<i class='fa fa-warning'></i> " + data.msg,
        buttons: {
            confirm: {
                label: "<i class='fa fa-check'></i> "+data.btn_ok,
                className: 'btn-flat btn-success'
            },
            cancel: {
                label: "<i class='fa fa-close'></i> "+data.btn_cancel,
                className: 'btn-flat btn-danger'
            }
        },
        callback: function (result) {
            if (result) {
                if (typeof callback == "function") {
                    callback();
                }
            } else {
                if (typeof callback2 == "function") {
                    callback2();
                }
            }
        }
    });
}

$(document).ready(function (e) {
    init_validation();
     $('.remote_modal').on('click',function(){
        $('.modal-content').load($(this).attr('href'),function(){
            $($(this).data('target')).modal({show:true});
        });
    });
    
    $('.modal').on('hidden.bs.modal', function () {
//        $(".modal iframe").attr("src", $(".modal iframe").attr("src"));
        $(this).find(".modal-content").html("");
    });
});

function user_login() {
    var post_data = $("#login-form").serialize();
    $.post(base_url + 'index/verify', post_data, function (res) {
        if (res.status == "1") {
            window.location = res.page;
        } else {
            $('.error_block').html(res.msg).show();
        }
    }, 'json');
}

$(document).on('keypress', ".numberonly", function (event) {
    if (event.which == 8) {
        return true;
    }
    if (event.which < 48 || event.which > 57) {
        event.preventDefault();
    }
});

$(document).on('keypress', ".floatonly", function (event) {
    if (event.which != 46 || $(this).val().indexOf('.') != -1) {
        event.preventDefault();
    }
});

$(document).on('click', ".backBtn", function () {
    parent.history.back();
    return false;
});

$(document).on('click', ".action_logout", function (e) {
    e.preventDefault();
    var pdata = $(this).data();
    confirm_box({msg:pdata.msg, btn_ok: "Yes", btn_cancel: "No"},function () {
        location.href = pdata.url;
    });
});

$(document).on('click', ".action_status", function (e) {
    e.preventDefault();
    var post_data = $(this).data();
    var url = post_data.url;
    confirm_box({msg: post_data.msg, btn_ok: "Yes", btn_cancel: "No"}, function () {
        delete post_data.msg;
        delete post_data.url;
        $.post(url, post_data, function (res) {
            if (res.status == "1") {
                $.gritter.add({title: res.title, text: res.text});
                if ($(".searchBtn").length) {
                    $(".searchBtn").click();
                }else{
                    location.reload();
                }
            }            
        }, 'json');
    });
});

$(document).on('click', ".remove_status", function (e) {
    e.preventDefault();
    var post_data = $(this).data();
    var url = post_data.url;
    var remtr = post_data.remtr;
    var tr=$(this).closest(".trow");
    confirm_box({msg: post_data.msg, btn_ok: "Yes", btn_cancel: "No"}, function () {
        delete post_data.msg;
        delete post_data.url;
        $.post(url, post_data, function (res) {
            if (res.status == "1") {
                $.gritter.add({title: res.title, text: res.text});
                if ($(".searchBtn").length) {
                    $(".searchBtn").click();
                }else if(remtr=="yes"){
                    tr.remove();
                }else{
                    location.reload();
                }
            }            
        }, 'json');
    });
});

$(document).on('click', ".action_modal_payment", function (e) {
    e.preventDefault(); 
    var $this=$(this);
    var parant=$this.closest(".modal-content");
    var btn = parant.find(".btn_save");
    if (btn.hasClass("disabled")) {   return false;   }
    var form = parant.find("form");
    var post_data = form.serialize();
    if (form.valid()) {
        var error_block = parant.find(".error_block");
        var success_block = parant.find(".success_block");
        var url = $this.data("url");
//        confirm_box({msg: $this.data("msg"), btn_ok: "Yes", btn_cancel: "No"}, function () {
            btn.addClass("disabled");
            $.post(url, post_data, function (res) {
                if (res.status == "1") {
                    parant.find(".modal-body").html(res.message+res.content);
                    parant.find(".modal-footer").hide();
                } else {
                    success_block.hide();
                    error_block.html(res.message).hide().fadeIn();
                }
            }, 'json');
//        });
    }
    else{        
        btn.removeClass("disabled");
    }
});

$(document).on('click', ".action_modal_save", function (e) {
    e.preventDefault();  
    var parant=$(this).closest(".modal-content");
    var btn = parant.find(".btn_save");
    if (btn.hasClass("disabled")) {   return false;   }
    btn.addClass("disabled");
    var form = parant.find("form");
    var post_data = form.serialize();
    if (form.valid()) {
        var error_block = parant.find(".error_block");
        var success_block = parant.find(".success_block");
        var btn_close = parant.find(".btn_close");
        var url = $(this).data("url");
        var close = $(this).data("close");        
    
        var addtr = $(this).data("addtr");
        var target=$(this).data("target");
        $.post(url, post_data, function (res) {
            if (res.status == "1") {
                if(addtr=="yes"){
                    $(target).append(res.content);
                }else if ($(".searchBtn").length) {
                    $(".searchBtn").click();
                }else {
                    location.reload();
                }
                if (close == true) {
                    btn_close.click();
                    $.gritter.add({title: res.title, text: res.msg});
                } else {
                    error_block.hide();
                    success_block.html(res.msg).hide().fadeIn();
                    form.trigger("reset");
                }
            } else {
                success_block.hide();
                error_block.html(res.msg).hide().fadeIn();
            }
        }, 'json');
    }else{        
        btn.removeClass("disabled");
    }
});

$(document).on('click', ".action_save_form", function (e) {
    var form = $(this).closest("form");
    var post_data = form.serialize();
    var reload = $(this).data("reload");
    var msg = $(this).data("msg");
    var url = $(this).data("url");
    var nexturl = $(this).data("nexturl");
    var error_show = $(this).data("error_show");
    if (form.valid()) {
        confirm_box({msg: msg, btn_ok: "Yes", btn_cancel: "No"}, function () {
            $.post(url, post_data, function (res) {
                if (res.status == "1") {
                    if (nexturl != '' && nexturl != 'undefined') {
                        var id=(res.token!='undefined')?"?token="+res.token:"";
                        window.location.href = nexturl+id;
                    }
                    if (reload == 'yes') {
                        bootbox.alert(res.msg, function () {
                            location.reload();                            
                        });
                    }
                } else if (res.status == "-1") {
                    bootbox.alert(res.msg, function () {});
                } else {
                    $(".error_block").show().html(res.msg);
                }
            }, 'json');
        });
    } 
    else {
        if (error_show == '1'){
            $('html, body').animate({
                scrollTop: $('.form-group.has-error:first').offset().top - 50
            }, 1500);
        }
    }
});

$(document).on('click', ".action_page_save", function (e) {
    e.preventDefault();
    $("#des").val(CKEDITOR.instances['des'].getData());

    var form = $(this).closest("form");
    var post_data = form.serialize();
    if (form.valid()) {
        var error_block = $(this).closest("form").find(".error_block");
        var success_block = $(this).closest("form").find(".success_block");
        var url = $(this).data("url");
        $.post(url, post_data, function (res) {
            if (res.status == "1") {
                // $.gritter.add({title: res.title, text: res.msg});
                error_block.hide();
                success_block.html(res.msg).hide().fadeIn();
                $("html, body").animate({scrollTop: 0}, 500);
            } else {
                success_block.hide();
                error_block.html(res.msg).hide().fadeIn();
                $("html, body").animate({scrollTop: 0}, 500);
            }
        }, 'json');
    }
});

$(document).on('click', ".action_file_save", function (e) {
    e.preventDefault();
    var form = $(this).find("form");
    var post_data = form.serialize();
    if (form.valid()) {
        var error_block = $(this).closest("form").find(".error_block");
        var success_block = $(this).closest("form").find(".success_block");
        var url = $(this).data("url");
        var formData = new FormData(form[0]);
        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            success: function (data) {
                var res = $.parseJSON(data);
                success_block.hide();
                error_block.hide();
                if (res.status == '1') {
                    error_block.hide();
                    success_block.html(res.msg).hide().fadeIn();
                } else {
                    success_block.hide();
                    error_block.html(res.msg).hide().fadeIn();
                }
            },
            error: function (data) {
            },
            async: false,
            cache: false,
            contentType: false,
            processData: false
        });
        return false;
    }
});

$(document).on('blur', ".checkexist", function (e) {
    var $this = $(this);
    var target =  $this.data('target');
    var uid =  $this.closest('form').find('#uid');
    $.blockUI();
//    $this.closest('.modal-body').block();
    $.post($this.data('url'), {val:$this.val(),uid:uid.val()}, function (res) {
//        $this.closest('.modal-body').unblock();
        $.unblockUI();
        if (res.status == "1") {
            $this.val("");
            $(target).show().html(res.msg);  
        }else{
            $(target).hide().html(""); 
        }          
    }, 'json');
});

$(document).on('change', '.ajax_select', function () {
    var url = $(this).data("url");
    var target_block = $($(this).data("target"));
    var selected = target_block.data("selected");
    var post_data = {id: $(this).val()};
    $.post(url, post_data, function (res) {
        target_block.html(res);
        if (selected != "") {
            target_block.val(selected);
            target_block.change();
        }
    });
});
