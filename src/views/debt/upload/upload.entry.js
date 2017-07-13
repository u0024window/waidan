require('bootstrap');
require('./upload.less');
require('./../../common/common.less');
require('datepicker');
require('datepickercss');
require('datepickercn');
require('./../../common/rewardRateToOverdue/index.less');

import React from 'react';
import {render} from 'react-dom';
import RewardRateToOverdue from '../../common/rewardRateToOverdue/index.jsx';
var rewardRateToOverdue;

function showRewardRateToOverdue () {
    var euuid = $enterpriseId.val().split(',')[1];
    var uploadType = $uploadType.val();
    if (euuid && NEW_ADD_DEBT === +uploadType ) {
        $.ajax({
            url: '/api/enterprise/overdueRewardInfo',
            type: 'POST',
            data: {
                uuid: euuid
            },
            success: function(res) {
                if (res && res.error && 0 !== +res.error.returnCode) {
                    alert('服务异常，请刷新页面');
                    return ;
                }
                if (res && res.error && 0 === +res.error.returnCode) {
                    $('#js-rewardRateToOverdue').html('');
                    rewardRateToOverdue = render(
                        <RewardRateToOverdue data={res.data}/>,
                        document.getElementById('js-rewardRateToOverdue')
                    );
                }
            },
            error: function() {
                alert('服务异常');
            }
        })
    }
    else {
        console.log('remove');
        $('#js-rewardRateToOverdue').html('');
    }
}

var url = '/api/debt/upload-submit';
var formData = null;
$('.js-entrustEndDate, .js-entrustBeginDate').datepicker({
    autoclose: true,
    language: 'zh-CN',
    format: "yyyy-mm-dd"
});

var NEW_ADD_DEBT = 1;
var $uploadType = $(".js-uploadType");
$uploadType.on('change', function (){
    var uploadType = $(this).val();
    if (NEW_ADD_DEBT === +uploadType) {
        $(".js-date-wrap").css('display', 'block');
    }
    else {
        $(".js-date-wrap").css('display', 'none');
    }
    showRewardRateToOverdue();
})
var $enterpriseId = $(".js-enterpriseId");

$(".js-enterpriseId").on('change', function (){
    showRewardRateToOverdue();
})
$(".js-submit").on('click', function (e){
    var $this = $(this);
    formData = new FormData($('#uploadForm')[0]);
    var uploadType = $('.js-uploadType').val()
    var enterpriseId = $('.js-enterpriseId').val().split(',')[0]
    if (!enterpriseId) {
        alert('请选择公司');
        return;
    }
    var entrustBeginDate = $('.js-entrustBeginDate').val();
    var entrustEndDate = $('.js-entrustEndDate').val();

    if (1 === +uploadType) {
        if (!(entrustBeginDate && entrustEndDate)) {
            alert('委托时限不能为空');
            return;
        }
    }
    var file = formData.get('uploadFile');
    if (!file || (file && '' === file.name)) {
        alert('请选择文件');
        return ;
    }
	formData.append("enterpriseId", enterpriseId);
    if (1 === +uploadType) {

        var checkResult = rewardRateToOverdue.check();
        if (checkResult.error.returnCode !== 0) {
            alert(checkResult.data[0].msg || '请修改逾期天数与奖金比例!');
            return;
        }

        formData.append("entrustBeginDate", +new Date(entrustBeginDate));
        formData.append("entrustEndDate", +new Date(entrustEndDate));
        formData.append("overdueRewardInfo", rewardRateToOverdue.getResult());
    }
    $this.prop('disabled', true);
	$.ajax({
		url: url,  //server script to process data type: 'POST',
		dataType: 'json',
        type: 'POST',
		// Form data
		data: formData,
		cache: false,
		contentType: false,
		processData: false
    })
    .done(function(res) {
        var data = '';

        if (res && res.error && 0 === res.error.returnCode) {
            data = res.data;
        }
        else if(res && res.error && 0 !== res.error.returnCode) {
            data = res.error.returnUserMessage;
        }
        $('.js-result').text(data);
    })
	.fail(function() {
        alert("服务异常，稍后再试!");
	})
    .always(function (){
        $this.prop('disabled', false);
    })
});

$('#fileUpload').change(function(e){
	var file = this.files[0];
	if (!file) {
		return;	
	}

	formData = new FormData($('#uploadForm')[0]);

});

