(function($) {
  $(function() {
    $('.asset a[rel=edit]').live('click', function() {
      var asset = $(this).closest('.asset');
      if (asset.hasClass('image')) {
        $.get(this.href, function(data) {
          $('<div></div>').html(data).appendTo('body').dialog({
            title: 'Edit image',
            modal: true,
            resizable: false,
            width: 752,
            height: 522,
            buttons: {
              Cancel: function() {
                $(this).dialog('close');
              },
              OK: function() {
                $('form:visible', $(this).closest('.ui-dialog')).trigger('submit');
              }
            },
            open: function() {
              var dialog = this, api;
              $(this).css({ position: 'relative' });
              var refreshControls = function(coords) {
                coords = api.tellSelect();
                var has_selection = coords && coords.w > 0 && coords.h > 0;
                if (has_selection) {
                  $('#asset_crop_selection_width', dialog).val(coords.w);
                  $('#asset_crop_selection_height', dialog).val(coords.h);
                  $('#asset_crop_selection_x', dialog).val(coords.x);
                  $('#asset_crop_selection_y', dialog).val(coords.y);
                  $('.image-selection', dialog).show();
                } else {
                  $('.image-selection', dialog).hide();
                }
                
                var cropping = $('#asset_crop_resize:checked', dialog).length > 0;
                $('div.image-crop', dialog).toggle(cropping);
                
                if (cropping) {
                  var crop_mode = $('div.image-crop ul input:checked', dialog).val();
                  var target_width = parseInt($('#asset_crop_target_width').val() || 0);
                  var target_height = parseInt($('#asset_crop_target_height').val() || 0);
                  
                  if (crop_mode == 'resize_to_fit') {
                    var source_width = has_selection ? coords.w : parseInt($('#asset_image_width').val());
                    var source_height = has_selection ? coords.h : parseInt($('#asset_image_height').val());
                    var scale = Math.min(target_width / source_width, target_height / source_height);
                    $('#asset_crop_final_width', dialog).val(Math.round(source_width * scale));
                    $('#asset_crop_final_height', dialog).val(Math.round(source_height * scale));
                  } else {
                    $('#asset_crop_final_width', dialog).val(target_width);
                    $('#asset_crop_final_height', dialog).val(target_height);
                  }
                } else if (has_selection) {
                  $('#asset_crop_final_width', dialog).val(coords.w);
                  $('#asset_crop_final_height', dialog).val(coords.h);
                } else {
                  $('#asset_crop_final_width', dialog).val($('#asset_image_width', dialog).val());
                  $('#asset_crop_final_height', dialog).val($('#asset_image_height', dialog).val());
                }
              };
              api = $.Jcrop('.image-preview img', {
                boxWidth: 512,
                boxHeight: 440,
                onChange: refreshControls,
                onSelect: refreshControls
              });
              $('#asset_crop_resize, input[type=radio]', dialog).click(refreshControls);
              $('input[type=text]', dialog).bind('input', refreshControls);
              $('div.image-crop :input').change(function() {
                var cropping = $('#asset_crop_resize:checked', dialog).length > 0;
                if (cropping) {
                  var crop_mode = $('div.image-crop ul input:checked', dialog).val();
                  var target_width = parseInt($('#asset_crop_target_width').val() || 0);
                  var target_height = parseInt($('#asset_crop_target_height').val() || 0);

                  api.setOptions({ aspectRatio: crop_mode == 'crop' ? target_width / target_height : 0 });
                }
                refreshControls();
              }).bind('input', function() { $(this).change(); });
              $('.preview.button', dialog).click(function() {
                var has_selection = $('#asset_crop_selection_width', dialog).is(':visible');
                var original_width = parseInt($('#asset_image_width', dialog).val());
                var original_height = parseInt($('#asset_image_height', dialog).val());
                var source_width = has_selection ? parseInt($('#asset_crop_selection_width', dialog).val()) : original_width;
                var source_height = has_selection ? parseInt($('#asset_crop_selection_height', dialog).val()) : original_height;
                var source_x = has_selection ? parseInt($('#asset_crop_selection_x', dialog).val()) : 0;
                var source_y = has_selection ? parseInt($('#asset_crop_selection_y', dialog).val()) : 0;
                var target_width, target_height, scale = 1;

                var cropping = $('#asset_crop_resize', dialog).is(':checked');
                if (cropping) {
                  var crop_mode = $('div.image-crop ul input:checked', dialog).val();
                  target_width = parseInt($('#asset_crop_target_width').val() || 0);
                  target_height = parseInt($('#asset_crop_target_height').val() || 0);
                  if (crop_mode == 'resize_to_fit') {
                    scale = Math.min(target_width / source_width, target_height / source_height, 1.0);
                    target_width = source_width * scale;
                    target_height = source_height * scale;
                  } else {
                    scale = Math.min(Math.max(target_width / source_width, target_height / source_height), 1.0);
                  }
                  suw = target_width / scale;
                  suh = target_height / scale;
                  source_x = source_x + (source_width - suw) / 2;
                  source_y = source_y + (source_height - suh) / 2;
                } else if (has_selection) {
                  target_width = source_width;
                  target_height = source_height;
                } else {
                  target_width = original_width;
                  target_height = original_height;
                }
                
                $('<div class="image-crop-container"><div class="image-crop-mask"><img src="' + $('img', dialog).attr('src') + '" /></div></div>').dialog({
                  modal: true,
                  resizable: true,
                  width:Math.round(target_width),
                  height: Math.round(target_height + 100),
                  buttons: {
                    Close: function() { $(this).dialog('close'); }
                  },
                  close: function() { $(this).remove(); }
                }).find('img').css({
                  position:'absolute',
                  width:Math.round(original_width * scale) + 'px',
                  height:Math.round(original_height * scale) + 'px',
                  left:Math.round(source_x * -scale) + 'px',
                  top:Math.round(source_y * -scale) + 'px'
                }).parent().css({
                  position:'relative',
                  overflow:'hidden',
                  margin:'0px auto',
                  width:Math.round(target_width) + 'px',
                  height:Math.round(target_height) + 'px'
                });
                return false;
              });              
              refreshControls();
            },
            close: function() {
              $(this).remove();
            }
          });
        });
      }
      
      return false;
    });
  });
})(jQuery);