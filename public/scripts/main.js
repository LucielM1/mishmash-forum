$(document).ready(function () {
  setTimeout(function () {
    $(".flash-messages").fadeOut("slow");
  }, 3000);
  // TODO: test adding button to flash-messages div
  // $('#close_btn').click(function(){ $(".info").fadeOut("slow"); });

  // Set jQuery.validate settings for bootstrap integration
  jQuery.validator.setDefaults({
    highlight: function (element) {
      jQuery(element).closest('.form-group').addClass('has-error');
    },
    unhighlight: function (element) {
      jQuery(element).closest('.form-group').removeClass('has-error');
    },
    errorElement: 'span',
    errorClass: 'label label-danger',
    errorPlacement: function (error, element) {
      if (element.parent('.input-group').length) {
        error.insertAfter(element.parent());
      } else {
        error.insertAfter(element);
      }
    }
  });

  // custom rule to ensure that either image url or image file are selected
  // TODO: revive if/when alternative external image url is implemented
  // $("#new-campground-form").validate({
  //   rules: {
  //     imageLocal: {
  //       require_from_group: [1, ".image-group"]
  //     },
  //     imageExternal: {
  //       require_from_group: [1, ".image-group"]
  //     }
  //   }
  // });
  // $("#edit-campground-form").validate({
  //   rules: {
  //     imageLocal: {
  //       require_from_group: [1, ".image-group"]
  //     },
  //     imageExternal: {
  //       require_from_group: [1, ".image-group"]
  //     }
  //   }
  // });
});
