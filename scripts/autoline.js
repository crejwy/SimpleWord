;
var autoline={};
(function(main){
	var groups={names:[],pisitions:[]};
	main.options={
				widthfrom:10,
				widthto:10,
				linewidth:2,
				panel:"body"
			}
			
	main.drawline=function($ele,pointfrom,pointto,has_chevron_right){		
		if(pointfrom.left==pointto.left){
			$ele.append(Handlebars.compile('<div class="autoline" style="position:absolute;left:{{left}}px;top:{{top}}px;height:{{height}}px;background:black;width:{{linewidth}}px;">{{#if has_chevron_right}}	<span style="font-size: 6px;float: right; margin: -4.5x -1x 0 0;"><i class="fa fa-chevron-right"></i></span>{{/if}}	</div>')({
				left:pointfrom.left,
				top:Math.min(pointfrom.top,pointto.top),
				height:Math.abs(pointfrom.top-pointto.top)==0?0:Math.abs(pointfrom.top-pointto.top)+main.options.linewidth,
				linewidth:main.options.linewidth,
				has_chevron_right:has_chevron_right
			}))
		}else if(pointfrom.top==pointto.top){
			$ele.append(Handlebars.compile('<div class="autoline" style="position:absolute;left:{{left}}px;top:{{top}}px;width:{{width}}px;background:black;height:{{linewidth}}px;">{{#if has_chevron_right}}	<span style="font-size: 6px;float: right; margin: -4.5px -1px 0 0;"><i class="fa fa-chevron-right"></i></span>{{/if}}	</div>')({
				left:Math.min(pointfrom.left,pointto.left),
				top:pointfrom.top,
				width:Math.abs(pointfrom.left-pointto.left),
				linewidth:main.options.linewidth,
				has_chevron_right:has_chevron_right
			}))
		}
	}
	main.resizing=false;
	main.render=function(option){
		if(option){
			$.extend(main.options,option);
		}
		$(window).resize(function() {
			if(!main.resizing){
				main.resizing=true;
				$(".autoline").hide();
				groups={names:[],pisitions:[]};
				autoline.render(main.options);
				setTimeout(function(){					
					main.resizing=false;
				},20);
			}
		});
		
		$("[data-from-group],[data-to-group]").each(function(){
			 var bw_left=parseInt($(this).css("border-left-width").replace("px",""));
			 var bw_top=parseInt($(this).css("border-top-width").replace("px",""));
			 var bw_right=parseInt($(this).css("border-right-width").replace("px",""));
			 var bw_bottom=parseInt($(this).css("border-bottom-width").replace("px",""));
			 var this_width= parseInt($(this).css("width").replace("px",""));
			 var top=$(this).offset().top+parseInt($(this).css("height").replace("px",""))/2+bw_top;
			 var left=$(this).offset().left ;
			
			 var groupname1=$(this).attr("data-from-group");
			 var groupname2=$(this).attr("data-to-group");;		
			 var ingroups=-1;	
			 if(groupname1){
					groupname1.split(',').forEach(function(value){
						ingroups=$.inArray(value,groups.names);						
						if(ingroups==-1){
							ingroups=groups.names.length;
							groups.names.push(value);
							groups.pisitions[ingroups]={group:value,from:[],to:[]};							
						}
						groups.pisitions[ingroups].from.push({top:top,left:left+this_width+bw_left+bw_right});
					});
					
					
			 }
			 if(groupname2){
					groupname2.split(',').forEach(function(value){
						ingroups=$.inArray(value,groups.names);						
						if(ingroups==-1){
							ingroups=groups.names.length;
							groups.names.push(value);
							groups.pisitions[ingroups]={group:value,from:[],to:[]};						
						}
						groups.pisitions[ingroups].to.push({top:top,left:left});
					});
					
			 }
			 
		});
		groups.pisitions.forEach(function(value,index,array){
			var maxfromleft=0;
			var minfromtop=10000;
			var maxfromtop=0;
			var mintoleft=10000;
			var mintotop=10000;
			var maxtotop=0;
			value.from.forEach(function(value,index,array){	
				maxfromleft=Math.max(maxfromleft,value.left);
				minfromtop=Math.min(minfromtop,value.top);
				maxfromtop=Math.max(maxfromtop,value.top);					
			});				
			value.to.forEach(function(value,index,array){	
				mintoleft=Math.min(mintoleft,value.left);
				mintotop=Math.min(mintotop,value.top);
				maxtotop=Math.max(maxtotop,value.top);					
			});
			var middletotop=(maxtotop+mintotop)/2;
			var middlefromtop=(minfromtop+maxfromtop)/2;
			//绘制左侧竖线from-v
			main.drawline($(main.options.panel),{left:maxfromleft+ main.options.widthfrom,top:minfromtop},{left:maxfromleft+main.options.widthfrom,top:maxfromtop});
			//绘制右侧竖线to-v
			main.drawline($(main.options.panel),{left:mintoleft-main.options.widthto,top:mintotop},{left:mintoleft-main.options.widthto,top:maxtotop});
			var concat_middlepoint_left=(mintoleft-main.options.widthto+maxfromleft+main.options.widthfrom)/2;
			//绘制from-v和to-v的连接线
			main.drawline($(main.options.panel),{left:maxfromleft+main.options.widthfrom,top:middlefromtop},{left:concat_middlepoint_left,top:middlefromtop});
			main.drawline($(main.options.panel),{left:concat_middlepoint_left,top:middletotop},{left:mintoleft-main.options.widthto,top:middletotop});
			main.drawline($(main.options.panel),{left:concat_middlepoint_left,top:middlefromtop},{left:concat_middlepoint_left,top:middletotop});
			//绘制左侧横线
			value.from.forEach(function(value,index,array){	
				main.drawline($(main.options.panel),{left:value.left,top:value.top},{left:maxfromleft+main.options.widthfrom,top:value.top});				
			});	
			//绘制右侧横线
			value.to.forEach(function(value,index,array){	
				main.drawline($(main.options.panel),{left:mintoleft-main.options.widthto,top:value.top},{left:value.left,top:value.top},true);					
			});				
		});
	}
})(autoline);