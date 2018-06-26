;(function ($) {
    var compiled = {};
    
    $.fn.handlebars = function (template, data,oper) {
        if (template instanceof jQuery) {
            template = $(template).html();
        }
        compiled[template] = Handlebars.compile(template);
		if(oper==undefined){
			this.html(compiled[template](data));
		}else if(oper=="after"){
			this.after(compiled[template](data));
		}else if(oper=="append"){
			this.append(compiled[template](data));
		}
        
    };
})(jQuery);