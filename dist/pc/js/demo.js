$(document).ready(function () {
  // 弹出层
  window.pop = {};
  var f_lightbox = PA.ui.LightboxV2;
  window.pop.pop_questionnare = new f_lightbox({
    // 答题 弹出层
    target: $('.pop-questionnaire-question'),
    clickMask: false
  })
  window.pop.pop_questionnare_giveup = new f_lightbox({
    // 放弃答题 弹出层
    target: $('.pop-questionnaire-giveup'),
    clickMask: false
  })
  window.pop.pop_questionnare_complete = new f_lightbox({
    // 答题完成 弹出层
    target: $('.pop-questionnaire-complete'),
    clickMask: false
  })
  window.pop.pop_questionnare.show();
  $('.pop-questionnaire-question .cancel').click(function () {
    // 点击 放弃答题
    window.pop.pop_questionnare_giveup.show();
  })
  $('.pop-questionnaire-giveup .confirm').click(function () {
    // 点击 确认放弃答题
    window.pop.pop_questionnare.hide();
  })
  $('.pop-questionnaire-giveup .confirm').click(function () {
    // 点击 确认放弃答题
    window.pop.pop_questionnare.hide();
  })
  $('.pop-questionnaire-complete .btn-box a').click(function () {
    // 点击 <确认提交> <查看账户明细> 按钮
    window.pop.pop_questionnare.hide();
  })

  $(document).on('change', '.question-item li .check-item input', function (event) {
    if ($(this).prop('checked')) {
      $(this).closest('li').addClass('selected');
      if ($(this).attr('type') == 'radio') {
        $(this).closest('li').siblings('.selected').removeClass('selected');
      }
    } else {
      $(this).closest('li').removeClass('selected');
    }
  });

  $(document).on('change', '.question-item input', function (event) {
  if ($(this).prop('checked')) {
    $(".pop-questionnaire-question .btn-questionnaire-grey").removeClass('btn-questionnaire-grey');
  } else {
    if ($('input[name=' + $(this).attr('name') + ']').prop('checked')) {
      $(".pop-questionnaire-question .btn-questionnaire-grey").addClass('btn-questionnaire-grey');
    }
  }
});

  var num_question = 1;
  $('.pop-questionnaire-question .btn-box').click(function (event) {
    // 点击<下一题> || <确定提交>
    if (!$(event.target).closest('.next, .complete').length) {
      return false
    }
    $this = $(event.target).closest('.next, .complete');
    if ($this.is('.btn-questionnaire-grey')) {
      // 如果按钮是灰的 不执行任何操作
      return false;
    }

    if ($this.is('.next')) {
      // 下面是测试换题的js
      if (num_question <= 5) {
        num_question++;
        f_nextQuestion(num_question);
      }
      return false;
    }
    if ($this.is('.complete')) {
      // 点击 提交按钮
      window.pop.pop_questionnare_complete.show();
      return false;
    }

  });

  // 这个函数你根据自己的需要修改
  function f_nextQuestion(num) {
    // 将按钮 变灰
    $('.pop-questionnaire-question .btn-box .next').addClass('btn-questionnaire-grey');

    if (num == 5) {
      // 如果是第五题 修改<下一题> 为<确认提交>
      $('.pop-questionnaire-question .btn-box .next').addClass('complete').removeClass('next').html('确认提交');
    }

    // 填充题目
    $('.question-item .title').html('<span class="num">' + num + '.</span> 问题的标题'); // 标题
    var html = '';
    for (var i = 0; i < num; i++) { // 内容
      html += '<li>';
      html += '<label class="check-item">';
      html += '<input type="checkbox" name="test1"><i class="icon-check"></i><span>';
      html += '问题' + num + '的选项' + i;
      html += '</label>';
      html += '</span>';
      html += '</li>';
    }
    $('.question-item .in-con ul').html(html);

    // 还剩多少题
    $('.pop-questionnaire-question .tip em').html(5 - num);
  }
});
