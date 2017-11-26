$(document).ready(function() {
    var addItem = $('#addItem');
    var removeItem = $('#removeItem');
    var toggleItem = $('.toggle-items');
    var toggleCheckbox = $('.toggleCheckbox')
    var tooggleCounter = 1;
    addItem.click(cloneNode);
    removeItem.click(removeNode);

    toggleCheckbox.each(function() {
        $(this).bootstrapToggle({
            on: 'PARCELL',
            off:'PALLET'
        });
    });

    $('.toggleCheckbox').change(function() {
        if($(this).prop('checked')){
            var thisPalletGroup = $(this).parent().siblings('.b-pallet__group');
            var thisParcelGroup = $(this).parent().siblings('.b-parcel__group');
            thisPalletGroup.addClass('hidden');
            thisParcelGroup.removeClass('hidden');
        } else {
            var thisPalletGroup = $(this).parent().siblings('.b-pallet__group');
            var thisParcelGroup = $(this).parent().siblings('.b-parcel__group');
            thisParcelGroup.addClass('hidden');
            thisPalletGroup.removeClass('hidden');
        }
    });

    function cloneNode(e) {
        e.preventDefault();
        tooggleCounter++;
        $(".toggle-items.hidden" ).clone().appendTo(".b-main").removeClass('hidden');
        $('.toggle-items').attr("id",'toggleItems'+tooggleCounter);
        var toggleCheckbox = $('.toggle-items').find('.toggleCheckbox');
        var toggleCheckboxId = toggleCheckbox.attr('id');
        if(removeItem.hasClass('hidden')) {
            removeItem.removeClass('hidden')
        }
        if(toggleCheckboxId == 'toggle') {
            toggleCheckbox.attr("id",'toggle'+tooggleCounter);
        }
        return tooggleCounter

    }
    function removeNode(e) {
        e.preventDefault();
        $(".b-main .toggle-items:last-child").remove();
        if(toggleItem.length == 0 || $('.toggle-items.hidden:last-child').length == 1) {
            removeItem.addClass('hidden');
        }
    }


});
