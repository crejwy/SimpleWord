;(function ($) {
    var compiled = {};
    $.fn.handlebarsAfter = function (template, data) {
        if (template instanceof jQuery) {
            template = $(template).html();
        }
        compiled[template] = Handlebars.compile(template);
        this.after(compiled[template](data));
    };
    $.fn.handlebars = function (template, data) {
        if (template instanceof jQuery) {
            template = $(template).html();
        }
        compiled[template] = Handlebars.compile(template);
        this.html(compiled[template](data));
    };
})(jQuery);