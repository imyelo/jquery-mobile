// display the version of jQM
$(document).bind( "pageinit", function() {
	var version = $.mobile.version || "dev",
		words = version.split( "-" ),
		ver = words[0],
		str = (words[1] || "Final"),
		html = "Version " + ver;

	if( str.indexOf( "rc" ) == -1 ){
		str = str.charAt( 0 ).toUpperCase() + str.slice( 1 );
	} else {
		str = str.toUpperCase().replace(".", "");
	}

	if ( $.mobile.version && str ) {
		html += " " + str;
	}

	$( "p.jqm-version" ).html( html );
});

// Turn off AJAX for local file browsing
if ( location.protocol.substr(0,4)  === 'file' ||
     location.protocol.substr(0,11) === '*-extension' ||
     location.protocol.substr(0,6)  === 'widget' ) {

  // Start with links with only the trailing slash and that aren't external links
  var fixLinks = function() {
    $( "a[href$='/'], a[href='.'], a[href='..']" ).not( "[rel='external']" ).each( function() {
      this.href = $( this ).attr( "href" ).replace( /\/$/, "" ) + "/index.html";
    });
  };

  // Fix the links for the initial page
  $(fixLinks);

  // Fix the links for subsequent ajax page loads
  $(document).bind( 'pagecreate', fixLinks );

  // Check to see if ajax can be used. This does a quick ajax request and blocks the page until its done
  $.ajax({
    url: '.',
    async: false,
    isLocal: true
  }).error(function() {
    // Ajax doesn't work so turn it off
    $( document ).bind( "mobileinit", function() {
      $.mobile.ajaxEnabled = false;

      var message = $( '<div>' , {
        'class': "ui-footer ui-bar-e",
        style: "overflow: auto; padding:10px 15px;",
        'data-ajax-warning': true
      });

      message
        .append( "<h3>Note: Navigation may not work if viewed locally</h3>" )
        .append( "<p>The AJAX-based navigation used throughout the jQuery Mobile docs may need to be viewed on a web server to work in certain browsers. If you see an error message when you click a link, try a different browser or <a href='https://github.com/jquery/jquery-mobile/wiki/Downloadable-Docs-Help'>view help</a>.</p>" );

      $( document ).bind( "pagecreate", function( event ) {
        $( event.target ).append( message );
      });
    });
  });
}

// View demo source code
$.fn.viewSourceCode = function(){
	
	var demoId = 0;
	
	return $( this ).each( function(){
		demoId++
		var button = $( "<a href='#jqm-demo-" + demoId + "' data-rel='popup' data-role='button' data-icon='gear' data-mini='true' data-inline='true' data-shadow='false' data-theme='f'>View Source</a>" ),
			popup = $( "<div id='jqm-demo-" + demoId + "' class='jqm-demo' data-role='popup' data-theme='none' data-corners='false' data-position-to='window'>" +
					"<div data-role='collapsible-set' data-inset='false'></div>" +
				"</div>" ),
			collapsibleSet = popup.find( "[data-role='collapsible-set']" ),
			page = $( this ).closest( "[data-role='page']" ),
			html, js, css, collapsibleHTML, collapsibleJS, collapsibleCSS;
		
		if ( $( this ).is( "[data-demo-html='true']" ) ) {
			html = $( "<div></div>" ).append( $( this ).contents().clone() ).html();
			html = html
				.replace( /&/gmi, '&amp;' )
				.replace( /"/gmi, '&quot;' )
				.replace( />/gmi, '&gt;' )
				.replace( /</gmi, '&lt;' );
			collapsibleHTML = $( "<div data-role='collapsible' data-inset='false' data-collapsed='true' data-theme='b' data-iconpos='right' data-content-theme='a'>" +
					"<h1>HTML</h1>" +
					"<pre><code class='language-html'></code></pre>" +
				"</div>" );
			collapsibleHTML.find( "code" ).append( html );
			collapsibleHTML.appendTo( collapsibleSet );
		}
		if ( $( this ).is( "[data-demo-js='true']" ) ) {
			js = $( "<div></div>" ).append( $( "head" ).find( "script" ).contents().clone() ).html();
			js = js
				.replace( /&/gmi, '&amp;' )
				.replace( /"/gmi, '&quot;' )
				.replace( />/gmi, '&gt;' )
				.replace( /</gmi, '&lt;' );
			collapsibleJS = $( "<div data-role='collapsible' data-inset='false' data-collapsed='true' data-theme='f' data-iconpos='right' data-content-theme='a'>" +
					"<h1>JS</h1>" +
					"<pre><code class='language-js'></code></pre>" +
				"</div>" );
			collapsibleJS.find( "code" ).append( js );
			collapsibleJS.appendTo( collapsibleSet );
		}
		if ( $( this ).is( "[data-demo-css='true']" ) ) {
			css = $( "<div></div>" ).append( $( "head" ).find( "style" ).contents().clone() ).html();
			css = css
				.replace( /&/gmi, '&amp;' )
				.replace( /"/gmi, '&quot;' );
			collapsibleCSS = $( "<div data-role='collapsible' data-inset='false' data-collapsed='true' data-theme='e' data-iconpos='right' data-content-theme='a'>" +
					"<h1>CSS</h1>" +
					"<pre><code class='language-css'></code></pre>" +
				"</div>" );
			collapsibleCSS.find( "code" ).append( css );
			collapsibleCSS.appendTo( collapsibleSet );
		}

		collapsibleSet.find( "[data-role='collapsible']" ).first().attr( "data-collapsed", "false" );
		button.appendTo( this );
		popup.appendTo( page );
		
	});
};

$( document ).on( "pagebeforecreate", "[data-role='page']", function(){
	$( this ).find( "[data-demo-html='true'], [data-demo-js='true'], [data-demo-css='true']" ).viewSourceCode();
});
