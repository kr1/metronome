$(document).ready(function() {
    $(document).on('click', '[data-toggle="modal"]', function(e) {
        e.preventDefault();
        var target = $(this).attr('href') || $(this).data('target');
        openModal(target);
    });

    $(document).on('click', '[data-dismiss="modal"]', function(e) {
        e.preventDefault();
        closeModal($(this).closest('.modal-container'));
    });

    $(document).on('click', '.modal-container', function(e) {
        if (e.target === this) closeModal($(this));
    });

    $(document).on('keydown', function(e) {
        if (e.which === 27) closeModal($('.modal-container.is-open'));
    });
});

function openModal(selector) {
    $('.modal-container.is-open').removeClass('is-open');
    var $modal = $(selector);
    $modal.addClass('is-open');
    $modal.trigger('shown');
}

function closeModal($modal) {
    $modal.removeClass('is-open');
}
