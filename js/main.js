(function() {
    "use strict";

    // Define variables
    var hero = $("#hero"),
        work = $("#work"),
        about = $("#about"),
        topTrigger = $(".hero__trigger-button.top"),
        bottomTrigger = $(".hero__trigger-button.bottom"),
        closeBottom = $(".close-button.bottom"),
        closeTop = $(".close-button.top"),
        mute = $(".mute-action");

    // Mobile Detection
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /* =Loader
    -------------------------------------------------------------- */
    $("body").queryLoader2({
        // Loader background color
        backgroundColor: "#fff",
        fadeOutTime: 500,
        onComplete: function() {
            if (!isMobile()) {
                ion.sound.play("ambient");
            }
        }
    });

    /* =Hero
    -------------------------------------------------------------- */
    // Centering function
    function centerInit() {
        hero.css({
            "height": $(window).height()
        });

        $(".hero__content").css({
            "margin-top": ($(window).height() - $(".hero__content").height()) / 2 + "px"
        });

        about.css({
            "height": $(window).height()
        });

        work.css({
            "height": $(window).height()
        });
    }

    // Initialize centering function
    centerInit();
    $(window).resize(centerInit);

    /* =Sound
    -------------------------------------------------------------- */
    if (isMobile()) {
        $(".sound").addClass("isMobile");
    }

    if (!isMobile()) {
        ion.sound({
            sounds: [
                {
                    name: "ambient",
                    loop: true
                }
            ],
            volume: 1,
            multiplay: true,
            path: "audio/",
            preload: true
        });

        mute.click(function() {
          if (mute.hasClass("muted")) {
            mute.removeClass("muted");
            ion.sound.play("ambient");
          } else {
            ion.sound.stop("ambient");
            mute.addClass("muted");
          }

          return false;
        });
    }

    /* =Videos
    -------------------------------------------------------------- */
    $(".ajaxpage").fitVids();

    /* =Page Transitions
    -------------------------------------------------------------- */
    topTrigger.click(function() {
        about.removeClass("idle").addClass("active-screen");
        hero.animate({
            top: 20 + "%"
        }, 500, function() {
        });

        return false;
    });

    closeTop.click(function() {
        about.addClass("idle").removeClass("active-screen");
        hero.animate({
            top: 0
        }, 500, function() {
        });

        return false;
    });

    bottomTrigger.click(function() {
        work.removeClass("idle").addClass("active-screen");
        hero.animate({
            top: - 20 + "%"
        }, 500, function() {
        });

        return false;
    });

    closeBottom.click(function() {
        work.addClass("idle").removeClass("active-screen");
        hero.animate({
            top: 0
        }, 500, function() {
        });

        return false;
    });

    /* =Portfolio Filtering
    -------------------------------------------------------------- */
    var selectedClass;

    $(".filters li").click(function() {
        $(this).addClass("is-checked");
        $(this).siblings().removeClass("is-checked");

        if ($(this).attr("data-filter") === "*") {
            $(".work__content__thumbnails").fadeTo(100, 0);
            $(".project").fadeOut().removeClass('show');
            setTimeout(function() {
              $(".project").fadeIn().addClass('show');
              $(".work__content__thumbnails").fadeTo(300, 1);
            }, 300);
        } else {
            selectedClass = $(this).attr("data-filter");
            $(".work__content__thumbnails").fadeTo(100, 0);
            $(".project").fadeOut().removeClass('show');
            setTimeout(function() {
              $(selectedClass).fadeIn().addClass('show');
              $(".work__content__thumbnails").fadeTo(300, 1);
            }, 300);
        }
    });

    /* =Portfolio Slider
    -------------------------------------------------------------- */
    $(".ajaxpage__slider").unslider();

    /* =Portfolio Sharing
    -------------------------------------------------------------- */
    $.fn.sharePopup = function (e, intWidth, intHeight, blnResize) {

      // Prevent default anchor event
      e.preventDefault();

      // Set values for window
      var intWidth = intWidth || '500';
      var intHeight = intHeight || '400';
      var strResize = (blnResize ? 'yes' : 'no');

      // Set title and open popup with focus on it
      var strTitle = ((typeof this.attr('title') !== 'undefined') ? this.attr('title') : 'Social Share'),
          strParam = 'width=' + intWidth + ',height=' + intHeight + ',resizable=' + strResize,
          objWindow = window.open(this.attr('href'), strTitle, strParam).focus();
    };

    $("a.share").on("click", function(e) {
        $(this).sharePopup(e);
    });

    /* =AJAX Portfolio
    -------------------------------------------------------------- */
    function initializePortfolio() {
        var current,
            next,
            prev,
            target,
            hash,
            url,
            page,
            projectIndex,
            scrollPosition,
            projectLength,
            ajaxLoading = false,
            wrapperHeight,
            pageRefresh = true,
            content = false,
            portfolioGrid = $(".work__content__thumbnails"),
            folderName = "projects";

        $(".ajax-section__project-navigation ul").hide();
        $(".ajax-section__project-close a").hide();

        $(window).bind( "hashchange", function() {
            hash = $(window.location).attr("hash");
            var root = '#!'+ folderName +'/';
            var rootLength = root.length;

            if( hash.substr(0,rootLength) != root ){
                return;
            } else {
                hash = $(window.location).attr("hash");
                url = hash.replace(/[#\!]/g, '' );

                portfolioGrid.find(".project.current").children().removeClass("active");
                portfolioGrid.find(".project.current").removeClass("current");

                $(".work__content").find(".work__content__thumbnails.active-folio").removeClass("active-folio");
                $(".work__content").find(".ajax-section__content.active-ajax, .ajax-section__project-navigation.active-ajax, .ajax-section__project-close.active-ajax, .ajax-section__loader.active-ajax").removeClass("active-ajax");

                portfolioGrid.find('.project a[href="#!' + url + '"]' ).parent().addClass( "current" );
                portfolioGrid.find(".project.current").find('a[href="#!' + url + '"]').addClass("active");

                portfolioGrid.find('.project a[href="#!' + url + '"]' ).parents(".work__content__thumbnails").addClass( "active-folio" );
                $(".active-folio").siblings(".ajax-section").children(".ajax-section__content, .ajax-section__project-navigation, .ajax-section__project-close, .ajax-section__loader").addClass("active-ajax");

                var scrollHelper = $(".initial-position").outerHeight();
                var projectContainer = $(".ajax-section__content.active-ajax");
                var projectNav = $(".ajax-section__project-navigation.active-ajax ul");
                var exitProject = $(".ajax-section__project-close.active-ajax a");

                /* If url is pasted in address bar and refreshed */
                if(pageRefresh == true && hash.substr(0,rootLength) ==  root) {
                    $("#work").stop().animate({scrollTop: 280},800,"easeOutExpo", function(){
                        loadProject();
                    });
                /* Clicking on portfolio grid or through project navigation */
                } else if (pageRefresh == false && hash.substr(0,rootLength) == root) {
                    $("#work").stop().animate({scrollTop: 280},800,"easeOutExpo", function(){
                        if(content == false){
                            loadProject();
                        } else {
                            projectContainer.animate({opacity:0,height:wrapperHeight},function(){
                                loadProject();
                            });
                        }

                        projectNav.fadeOut("100");
                        exitProject.fadeOut("100");
                    });
                /* Using browser back button without refreshing */
                } else if (hash=='' && pageRefresh == false || hash.substr(0,rootLength) != root && pageRefresh == false || hash.substr(0,rootLength) != root && pageRefresh == true) {
                    scrollPosition = hash;
                    $("#work").stop().animate({scrollTop: scrollPosition + "px"},1000,function(){
                        deleteProject();
                    });
                }
            }
        });

        function loadProject(){
            var loader = $(".ajax-section__loader.active-ajax");
            loader.show().removeClass("projectError").html('');

            if(!ajaxLoading) {
                ajaxLoading = true;

                if ($(".work").hasClass("idle")) {
                    $(".work").removeClass("idle").addClass("active-screen");
                }

                var projectContainer = $(".ajax-section__content.active-ajax");

                projectContainer.load( url +' section#ajaxpage', function(xhr, statusText, request){
                    if(statusText == "success"){
                        ajaxLoading = false;
                        page = $("#ajaxpage");

                        $("a.share").on("click", function(e) {
                            $(this).sharePopup(e);
                        });

                        page.imagesLoaded(function() {
                            $(".ajaxpage").fitVids();
                            $(".ajaxpage__slider").unslider();
                            hideLoader();
                        });
                    }

                    if(statusText == "error"){
                        loader.addClass("projectError").append("<p>Loading Error</p>");
                        loader.find("p").slideDown();
                    }
                });
            }
        }

        function hideLoader(){
            var loader = $(".ajax-section__loader.active-ajax");

            loader.delay(400).fadeOut( function(){
                showProject();
            });
        }

        function showProject(){
            var projectContainer = $(".ajax-section__content.active-ajax");
            var projectNav = $(".ajax-section__project-navigation.active-ajax ul");
            var exitProject = $(".ajax-section__project-close.active-ajax a");

            wrapperHeight = projectContainer.children("#ajaxpage").outerHeight() + "px";

            if (content==false){
                wrapperHeight = projectContainer.children("#ajaxpage").outerHeight() + "px";

                projectContainer.animate({opacity:1,height:wrapperHeight}, function(){
                    scrollPosition = $("#work").scrollTop();
                    projectNav.fadeIn();
                    exitProject.fadeIn();
                    content = true;
                });
            } else {
                wrapperHeight = projectContainer.children("#ajaxpage").outerHeight() + "px";
                projectContainer.animate({opacity:1,height:wrapperHeight}, function(){
                    scrollPosition = $("#work").scrollTop();
                    projectNav.fadeIn();
                    exitProject.fadeIn();
                });
            }

            projectIndex = portfolioGrid.find(".project.current").index();
            projectLength = $(".project a").length-1;

            if(projectIndex == projectLength){
                $(".ajax-section__project-navigation .next a").addClass("disabled");
                $(".ajax-section__project-navigation .prev a").removeClass("disabled");
            } else if (projectIndex == 0) {
                $(".ajax-section__project-navigation .next a").removeClass("disabled");
                $(".ajax-section__project-navigation .prev a").addClass("disabled");
            } else {
                $(".ajax-section__project-navigation .next a, .ajax-section__project-navigation .prev a").removeClass("disabled");
            }
        }

        function deleteProject(closeURL){
            var scrollHelper = $(".initial-position").outerHeight();
            var projectContainer = $(".ajax-section__content.active-ajax");
            var projectNav = $(".ajax-section__project-navigation.active-ajax ul");
            var exitProject = $(".ajax-section__project-close.active-ajax a");

            projectNav.fadeOut();
            exitProject.fadeOut();

            if(typeof closeURL!='undefined' && closeURL!='') {
                window.location.hash = '#_';
            }

            projectContainer.animate({opacity:0,height:"0px"},800,"easeOutExpo");
            projectContainer.empty();
            $("#work").stop().animate({scrollTop: scrollHelper + "px"},600);

            $(".work__content").find(".work__content__thumbnails.active-folio").removeClass("active-folio");
            $(".work__content").find(".ajax-section__content.active-ajax, .ajax-section__project-navigation.active-ajax, .ajax-section__project-close.active-ajax, .ajax-section__loader.active-ajax").removeClass("active-ajax");
            portfolioGrid.find(".project.current").children().removeClass("active");
            portfolioGrid.find(".project.current").removeClass("current");
        }

        $(".ajax-section__project-navigation .next a").on("click",function () {
                 
            current = portfolioGrid.find(".project.current");
            next = current.next(".project");
            target = $(next).children("a").attr("href");
            $(this).attr("href", target);

            if (next.length === 0) {
                return false;
            } 

            current.removeClass("current"); 
            current.children().removeClass("active");
            next.addClass("current");
            next.children().addClass("active");
           
        });

        $(".ajax-section__project-navigation .prev a").on("click",function () {
                
            current = portfolioGrid.find(".project.current");
            prev = current.prev(".project");
            target = $(prev).children("a").attr("href");
            $(this).attr("href", target);


            if (prev.length === 0) {
                return false;
            }

            current.removeClass("current");  
            current.children().removeClass("active");
            prev.addClass("current");
            prev.children().addClass("active");

        });

        $(".ajax-section__project-close a").on("click",function (e) {

            var loader = $(".ajax-section__loader.active-ajax"); 
                                
            deleteProject($(this).attr("href"));
            
            portfolioGrid.find(".project.current").children().removeClass("active");
            loader.fadeOut();

            return false;
        });

        pageRefresh = false;
    }

    initializePortfolio();
    $(window).trigger( "hashchange" );
})();
