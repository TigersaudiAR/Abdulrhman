<?php
class QuranForAll extends QuranForAll_API {
	public $siteName;
	public $siteDescription;
	public $siteurl;
	public $logo;
	public $og_logo;
	public $twitter_username;
	public $theme_folder;
	public $default_language;
	public $mod_rewrite_allow;
	public $random_books;
	public $allw_readerform;
	public $default_reader;
	public $default_reader_aya;
	public $allw_listen_surah;
	public $allw_formchange_surah;
	public $is_rtl;
	public $language;
	public $author;
	public $publisher;
	public $language_sound = false;

	public $title;
	public $body_title;
	public $description;
	public $url;
	public $image;
	public $footercode;
	public $headercode;
	public $headertext;
	public $bodycode;
	public $copyright;
	public $breadcrumb_parent;
	public $breadcrumb_title;
	public $hide_breadcrumb;
	public $reader_name;
	public $container_class;
	public $books_source;
	public $books_action_array;
	public $books_rtl;

	public $current_page_protocol;
	public $current_page_site;
	public $current_page_thisfile;
	public $current_page_real_directories;
	public $current_page_num_of_real_directories;
	public $current_page_virtual_directories = array();
	public $current_page_num_of_virtual_directories = array();
	public $current_page_baseurl;
	public $current_page_thisurl;

	public $path;
	public $cache_active;
	public $cache_folder;
	public $sitemap_folder;
	public $cache_time;
	public $cache_allow_create = true;

	public $home_allow_quran = true;
	public $home_allow_tafseer = true;
	public $home_allow_language = true;
	public $home_allow_book = true;
	public $home_sort = array();
	public $quran_col = 3;
	public $tafseer_col = 3;
	public $language_col = 3;
	public $book_parent;
	public $surah_one_line = false;

	public function __construct(){
		$this->logo = 'css/images/og-logo.png';
		$this->og_logo = 'images/og.png';
		$this->container_class = 'container well';
		$this->books_action_array = array('books', 'books_language', 'books_category');
		$this->books_rtl = array('Arabic', 2, 554, 8953, 10698, 10699, 9792, 12779, 12183, 7734, 127, 128, 3536, 11648, 124, 171, 148, 158, 152, 142, 146, 271, 172, 169, 154, 151, 147, 166, 165, 143, 137, 164, 140, 149, 139, 168, 138, 145, 144, 167, 156, 141, 136, 170, 150, 159, 163, 162, 153, 160, 157, 161, 132, 134, 11652, 10225, 125, 179, 176, 178, 175, 173, 177, 180, 174, 126, 181, 182, 185, 184, 183, 130, 129, 473, 133, 131, 10026, 1403, 575, 190, 11691, 195, 187, 428, 193, 9395, 191, 196, 189, 11657, 13345, 192, 188, 14114, 1536, 135, 8988, 13096);
		$this->is_rtl = false;
		$this->current_page_protocol = ( isset($_SERVER['HTTPS']) ? 'https' : 'http' );
		$this->current_page_site = $this->current_page_protocol . '://' . $_SERVER['HTTP_HOST'];
		$this->current_page_thisfile = basename($_SERVER['SCRIPT_FILENAME']);
		$this->current_page_real_directories = $this->cleanUp(explode("/", str_replace($this->current_page_thisfile, "", $_SERVER['PHP_SELF'])));
		$this->current_page_num_of_real_directories = count($this->current_page_real_directories);
		$this->current_page_virtual_directories = array_diff($this->cleanUp(explode("/", str_replace($this->current_page_thisfile, "", $_SERVER['REQUEST_URI']))),$this->current_page_real_directories);
		$this->current_page_num_of_virtual_directories = count($this->current_page_virtual_directories);
		$this->current_page_baseurl = $this->current_page_site . "/" . implode("/", $this->current_page_real_directories) . "/";
		$this->current_page_thisurl = $this->current_page_baseurl . implode("/", $this->current_page_virtual_directories) . "";
		parent::__construct();
	}

	public function baseurl(){
		return rtrim($this->current_page_baseurl, "/");
	}

	public function setSiteName( $str ){
		$this->siteName = $str;
	}

	public function setSiteDescription( $str ){
		$this->siteDescription = $str;
	}

	public function setRewriteRules( $allow ){
		$this->mod_rewrite_allow = $allow;
	}

	public function setSiteUrl( $str ){
		$this->siteurl = $str;
	}

	public function setTheme( $str ){
		$this->theme_folder = $str;
	}

	public function setDefaultLanguage( $str ){
		$this->default_language = $str;
	}

	public function setDirection( $direction ){
		$this->is_rtl = ( $direction == 'rtl' ? true : false );
	}

	public function setRandomBooks( $number ){
		$this->random_books = intval($number);
	}

	public function setTwitterUsername( $username ){
		$this->twitter_username = $username;
	}

	public function setFooterCode( $code ){
		$this->footercode = $code;
	}

	public function setHeaderCode( $code ){
		$this->headercode = $code;
	}

	public function setHeaderText( $text ){
		$this->headertext = $text;
	}

	public function setBodyText( $text ){
		$this->bodycode = $text;
	}

	public function setBooksSource( $url ){
		$this->books_source = $url;
	}

	public function setBreadcrumb( $allow ){
		$this->hide_breadcrumb = $allow;
	}

	public function setAllwReaderForm( $allow ){
		$this->allw_readerform = $allow;
	}

	public function setAllwListenSurah( $allow ){
		$this->allw_listen_surah = $allow;
	}

	public function setallwFormChangeSurah( $allow ){
		$this->allw_formchange_surah = $allow;
	}

	public function setDefaultReader( $number ){
		$this->default_reader = intval($number);
	}

	public function setDefaultReaderAya( $number ){
		$this->default_reader_aya = intval($number);
	}

	public function setQuranColumn( $number ){
		$this->quran_col = intval($number);
	}

	public function setTafseerColumn( $number ){
		$this->tafseer_col = intval($number);
	}

	public function setLanguageColumn( $number ){
		$this->language_col = intval($number);
	}

	public function get_logo(){
		$logo = $this->siteurl.'/'.$this->theme_folder.'/'.$this->logo;
		return $logo;
	}

	public function get_og_logo(){
		$logo = $this->siteurl.'/'.$this->theme_folder.'/'.$this->og_logo;
		return $logo;
	}

	public function seo(){
		$action = ( isset($_GET['action']) ? $_GET['action'] : '' );
		$title = $this->title;
		$body_title = $this->body_title;
		$description = ( empty($this->description) ? $title : $this->description );
		$url = ( empty($this->url) ? $this->siteurl : $this->url );
		$image = ( empty($this->image) ? $this->get_logo() : $this->image );
		$og_image = ( empty($this->image) ? $this->get_og_logo() : $this->image );

		$language = $this->language;
		$author = $this->author;
		$publisher = $this->publisher;

		$local = ( $this->is_rtl() ? 'ar' : 'en_US' );

		$og = '<meta property="og:locale" content="'.$local.'">'."\n";
		$og .= '<meta property="og:type" content="article">'."\n";
		$og .= '<meta property="og:title" content="'.$title.'">'."\n";
		$og .= '<meta property="og:description" content="'.$description.'">'."\n";
		$og .= '<meta property="og:url" content="'.$url.'">'."\n";
		$og .= '<meta property="og:site_name" content="'.$this->siteName.'">'."\n";
		$og .= '<meta property="article:publisher" content="'.$this->siteurl.'">'."\n";
		$og .= '<meta property="article:published_time" content="2019-07-23T07:25:51+00:00">'."\n";
		$og .= '<meta property="article:modified_time" content="2019-07-23T09:33:35+00:00">'."\n";
		$og .= '<meta property="og:updated_time" content="2019-07-23T09:33:35+00:00">'."\n";
		$og .= '<meta property="og:image" content="'.$og_image.'">'."\n";
		$og .= '<meta property="og:image:width" content="2846">'."\n";
		$og .= '<meta property="og:image:height" content="564">'."\n";

		$twitter = '<meta name="twitter:card" content="summary_large_image">'."\n";
		$twitter .= '<meta name="twitter:description" content="'.$description.'">'."\n";
		$twitter .= '<meta name="twitter:title" content="'.$title.'">'."\n";
		$twitter .= '<meta name="twitter:site" content="'.$this->twitter_username.'">'."\n";
		$twitter .= '<meta name="twitter:image" content="'.$og_image.'">'."\n";
		$twitter .= '<meta name="twitter:creator" content="'.$this->twitter_username.'">'."\n";

		$output = '';
		if( !empty($description) ){
			$output .= '<meta name="description" content="'.$description.'">'."\n";
		}
		if( !empty($url) ){
			$output .= '<link rel="canonical" href="'.$url.'">'."\n";
		}
		$output .= '<meta name="author" content="Nwahy.com">'."\n";
		$output .= '<meta name="generator" content="Quran For All V'.$this->version.'">'."\n";

		$output .= $og;
		$output .= $twitter;

		if( $action == 'book' ){
			$output .= '<script type="application/ld+json">
{
      "@context": "https://schema.org",
      "@type": "Book",
      "author": "'.$author.'",
      "bookFormat": "http://schema.org/EBook",
      "datePublished": "2019-07-25",
      "image": "'.$image.'",
      "inLanguage": "'.$language.'",
      "name": "'.$title.'",
      "publisher": "'.$publisher.'"
    }
</script>';
		}else{
			/*
			$output .= '<script type="application/ld+json">
			{
			    "@context": "http://schema.org",
			    "@type": "WebPage",
			    "name": "'.$title.'",
			    "description": "'.$description.'",
			    "publisher": {
			        "@type": "ProfilePage",
			        "name": "'.$this->siteName_en.'"
			    }
			}
			</script>';
			*/

			$output .= '<script type="application/ld+json">
	{
	  "@context": "http://schema.org",
	  "@type": "Article",
		"headline": "'.$title.'",
		"image": "'.$image.'",
	  "author": "'.$this->siteName.'",
		"description": "'.$description.'",
		"publisher": {
	    "@type": "Organization",
	    "name": "Nwahy.com",
	    "logo": {
	      "@type": "ImageObject",
	      "url": "'.$this->get_logo().'"
	    }
	  },
		"mainEntityOfPage": {
		 "@type": "WebPage",
		 "@id": "https://google.com/article"
	 },
	 "datePublished": "2019-07-25",
	 "dateModified": "2019-07-25"
	}
	</script>';
		}

		return $output;
	}

	public function get_version(){
		return $this->version;
	}

	public function get_rtl_languages(){
		return $this->rtl_languages;
	}

	public function get_default_language(){
		return $this->default_language;
	}

	public function get_theme_folder(){
		return $this->theme_folder;
	}

	public function get_theme_folder_url(){
		$site_url = $this->siteurl.'/';
		return $site_url.$this->theme_folder;
	}

	public function get_array_language(){
		return $this->check_languages;
	}

	public function get_language(){
		if( isset($_GET['action']) && in_array($_GET['action'], $this->books_action_array) ){
			$l = 'en';
			$this->default_language = $l;
		}else{
			if( isset($_GET['l']) && !empty($_GET['l']) ){
				if( in_array($_GET['l'], $this->check_languages) ){
					$l = strip_tags($_GET['l']);
				}else{
					$l = 'ar';
				}
			}else{
				if( in_array($this->default_language, $this->check_languages) ){
					$l = $this->default_language;
				}else{
					$l = 'ar';
				}
			}
		}

		return $l;
	}

	public function is_rtl( $check = '' ){
		$lang = $this->get_language();
		$action = ( isset($_GET['action']) ? $_GET['action'] : '' );
		$language_name = ( isset($_GET['name']) ? $_GET['name'] : '' );
		$category_id = ( isset($_GET['category_id']) ? intval($_GET['category_id']) : '' );

		if( !empty($check) && in_array($check, $this->books_rtl) ){
			$this->is_rtl = true;
			return true;
		}

		if( in_array($action, $this->books_action_array) ){
			if( in_array($language_name, $this->books_rtl) || in_array($category_id, $this->books_rtl) ){
				$this->is_rtl = true;
				return true;
			}
		}else{
			if( in_array($lang, $this->get_rtl_languages()) || $lang == 'ar' ){
				$this->is_rtl = true;
				return true;
			}else{
				if( !isset($_GET['l']) ){
					if( in_array($this->get_default_language(), $this->get_rtl_languages()) ){
						$this->is_rtl = true;
						return true;
					}
				}
			}
		}

		return false;
	}

	public function tpl_replace( $text = '' ){
		$page = (int) (!isset($_GET["page"]) ? 1 : $_GET["page"]);
		$extra_title = '';
		if( $page > 1 ){
			$extra_title .= ' | '.word('page').' '.$page;
		}

		$title = ( empty($this->title) ? $this->siteName : $this->title ); //htmlentities()
		$description = ( empty($this->description) ? $this->siteDescription : $this->description );
		if( empty($this->reader_name) ){
			$reader_name = '';
		}else{
			if( isset($_GET['reader_id']) ){
				$reader_name = ' | '.$this->reader_name;
			}else{
				$reader_name = '';
			}
		}
		$site_url = $this->siteurl.'/';

		$text = $this->shortcode($text);

		$headercode = '';
		if( $this->is_rtl() == true || $this->is_rtl == true ){
			$headercode .= '<link rel="stylesheet" type="text/css" href="'.$this->get_theme_folder_url().'/css/bootstrap.rtl.min.css?v=5.1">'."\n";
			$headercode .= '<link rel="stylesheet" type="text/css" href="'.$this->get_theme_folder_url().'/css/style.css?v='.$this->version.'">'."\n";
			$headercode .= '<link rel="stylesheet" type="text/css" href="'.$this->get_theme_folder_url().'/css/rtl.css?v='.$this->version.'">'."\n";
		}else{
			$headercode .= '<link rel="stylesheet" type="text/css" href="'.$this->get_theme_folder_url().'/css/bootstrap.min.css?v=5.1">'."\n";
			$headercode .= '<link rel="stylesheet" type="text/css" href="'.$this->get_theme_folder_url().'/css/style.css?v='.$this->version.'">'."\n";
		}
		$headercode .= '<link rel="stylesheet" type="text/css" href="'.$this->get_theme_folder_url().'/css/all.min.css?v=5.15.4">'."\n";
		$headercode .= '<link rel="stylesheet" type="text/css" href="'.$this->get_theme_folder_url().'/css/hover-min.css?v=2.3.2">'."\n";

		$headercode .= $this->get_hreflang( $this->get_language() );

		$copyright = 'Powered by <a target="_balnk" href="https://nwahy.com">Quran For All</a> V'.$this->get_version().'';

		//$clean = str_replace(array('"', "'", "-", "_", ".", "]", "[", "(", ")", "{", "}", "`", "!", ",", "|", "  ", ";"), array('', "", "", "", "", "", "", "", "", "", "", "", "", "", "", " ", ""), $this->title);
		$search  = array( '{title}', '{sitename}', '{description}','{style}', '{js}', '{bodycode}', '{footercode}', '{code}', '{nav}', '{copyright}', '{lang}', '{container-class}', '{site_url}', '{seo}' );
		$replace = array( $title.$reader_name.$extra_title, $this->siteName, $description.$reader_name.$extra_title, $this->get_theme_folder_url(), $headercode.$this->headercode, $this->bodycode, $this->footercode, $this->headertext, $this->get_navbar(), $copyright.$this->copyright, $this->get_language(), $this->container_class, $site_url, $this->seo() );
		return str_replace($search, $replace, $text);
	}

	public function languages(){
		return $this->api_get_languages();
	}

	public function surah_name( $lang = '' ){
		if( empty($lang) ){
			return $this->api_surah( $this->get_language(), true );
		}else{
			return $this->api_surah( $lang, true );
		}
	}

	public function readers( $reader_id = '' ){
		if( empty($reader_id) ){
			return $this->api_get_readers();
		}else{
			return $this->api_get_reader( $reader_id );
		}
	}

	public function ayah_readers( $reader_id = '' ){
		if( empty($reader_id) ){
			return $this->api_get_ayah_readers();
		}else{
			return $this->api_get_ayah_reader( $reader_id );
		}
	}

	public function tafseer_surah_loop() {
		$l = 'ar';
		$type = ( isset($_REQUEST['type']) && intval($_REQUEST['type']) != 0 ? intval($_REQUEST['type']) : 1 );
		$json_tafseer = $this->api_tafseer();

		if( is_array($json_tafseer['data']) && array_key_exists($type, $json_tafseer['data']) ){
			$tafseer_name = ( isset($json_tafseer['data'][$type]['name']) ? $json_tafseer['data'][$type]['name'] : '' );
			$this->title = $tafseer_name;
			$this->body_title = $tafseer_name;
		}else{
			$this->cache_allow_create = false;
		}

		$tafseer_list = '';
		if( !isset($json_tafseer['error']) && isset($json_tafseer['data']) && count($json_tafseer['data']) > 0 ){
			$tafseer_list .= '<div class="tafseer-list">';
			$tafseer_list .= '<label for="tafseer_list"><strong>'.word('select_tafseer').'</strong></label>';
			$tafseer_list .= '<select class="form-control" name="formt" onchange="location = this.options[this.selectedIndex].value;" id="tafseer_list">';
			$tafseer_list .= '<option value="#">'.word('select_tafseer').'</option>';
			foreach( $json_tafseer['data'] as $keys => $values ){
				$name = ( isset($values['name']) ? $values['name'] : '' );
				$name_en = ( isset($values['name_en']) ? $values['name_en'] : '' );

				$selected = ( $type == $keys ? ' selected' : '' );

				$tafseer_list .= '<option value="'.$this->url( array( 'action' => 'tafseer', 'type' => $keys ) ).'"'.$selected.'>'.$name.'</option>';
			}
			$tafseer_list .= '</select>';
			$tafseer_list .= '</div>';
		}

		$json = $this->surah_name( $l );
		if( !isset($json['error']) && isset($json['data']) && count($json['data']) > 0 ){
			$language_id = ( isset($json['language_id']) ? $json['language_id'] : '' );
			$language_name = ( isset($json['language_name']) ? $json['language_name'] : '' );
			$language_name_ar = ( isset($json['language_name_ar']) ? $json['language_name_ar'] : '' );
			$language_name_en = ( isset($json['language_name_en']) ? $json['language_name_en'] : '' );
			$language_book = ( isset($json['language_book']) ? $json['language_book'] : '' );
			$language_sound = ( isset($json['language_sound']) ? $json['language_sound'] : '' );

			$code = '';
			$code .= $tafseer_list;
			$code .= $this->post_share($language_name.' | '.$this->siteName, $this->url( array( 'action' => 'translate', 'l' => $l ) ));
			$code .= '<div class="row">';
			foreach( $json['data'] as $key => $value ){
				$surah_number = ( isset($value['n']) ? $value['n'] : 0 );
				$surah_name = ( isset($value['name']) ? $value['name'] : '' );
				$surah_count = ( isset($value['ayat']) ? $value['ayat'] : 0 );
				$surah_image = ( isset($value['image']) ? $value['image'] : '' );
				$surah_url = $this->url( array( 'action' => 'tafseer', 'type' => $type, 'surah' => $surah_number ) );

				$code .= '<div class="col-12 col-sm-6 col-md-4">';
				$code .= '<div class="spacer">';
				$code .= '<h5><a title="'.$surah_name.' - '.word('aya_count').' '.$surah_count.'" href="'.$surah_url.'">'.$surah_number.'- '.word('surah_in_title').' '.$surah_name.'</a></h5>';
				$code .= '</div>';
				$code .= '</div>';
			}
			$code .= '</div>';
		}else{
			$this->cache_allow_create = false;
			$code = ( isset($json['error']) && !empty($json['error']) ? $json['error'] : 'Unknown error' );
		}

		return $code;
	}

	public function tafseer_view($surah_id, $ayah_id=1, $tafseer_id=0){
		$json = $this->api_tafseer_view($tafseer_id, $surah_id, $ayah_id, true);
		if( !isset($json['error']) && isset($json['surah_name']) && !empty($json['surah_name']) ){
			$data_tafseer_id = ( isset($json['tafseer_id']) ? $json['tafseer_id'] : 0 );
			$data_tafseer_name = ( isset($json['tafseer_name']) ? $json['tafseer_name'] : '' );
			$data_surah_id = ( isset($json['surah_id']) ? $json['surah_id'] : '' );
			$data_surah_ayat = ( isset($json['surah_ayat']) ? $json['surah_ayat'] : 0 );
			$data_surah_name = ( isset($json['surah_name']) ? $json['surah_name'] : '' );
			$data_ayah_id = ( isset($json['ayah_id']) ? $json['ayah_id'] : 0 );
			$data_aya_text = ( isset($json['aya_text']) ? $json['aya_text'] : '' );
			$data_text = ( isset($json['text']) ? $json['text'] : '' );

			if( empty($data_text) || empty($data_tafseer_name) || $ayah_id > $data_surah_ayat ){
				$this->cache_allow_create = false;
				return '<div class="alert alert-danger mt-3 mb-3" role="alert">'.word('no_data').'</div>';
			}

			$json_tafseer = $this->api_tafseer();
			$tafseer_list = '';
			if( !isset($json_tafseer['error']) && isset($json_tafseer['data']) && count($json_tafseer['data']) > 0 ){
				$tafseer_list .= '<div class="tafseer-list">';
				$tafseer_list .= '<label for="tafseer_list"><strong>'.word('select_tafseer').'</strong></label>';
				$tafseer_list .= '<select class="form-control" name="formt" onchange="location = this.options[this.selectedIndex].value;" id="tafseer_list">';
				$tafseer_list .= '<option value="#">'.word('select_tafseer').'</option>';
				foreach( $json_tafseer['data'] as $keys => $values ){
					$name = ( isset($values['name']) ? $values['name'] : '' );
					$name_en = ( isset($values['name_en']) ? $values['name_en'] : '' );
					$selected = ( $tafseer_id == $keys ? ' selected' : '' );
					if( isset($_GET['ayah']) ){
						$tafseer_url = $this->url( array( 'action' => 'tafseer', 'type' => $keys, 'surah' => $surah_id, 'ayah' => $ayah_id ) );
					}else{
						$tafseer_url = $this->url( array( 'action' => 'tafseer', 'type' => $keys, 'surah' => $surah_id ) );
					}
					$tafseer_list .= '<option value="'.$tafseer_url.'"'.$selected.'>'.$name.'</option>';
				}
				$tafseer_list .= '</select>';
				$tafseer_list .= '</div>';
			}else{
				$tafseer_list = ( isset($json_tafseer['error']) && !empty($json_tafseer['error']) ? $json_tafseer['error'] : 'Unknown error' );
			}

			$ayah_list = '';
			if( $data_surah_ayat > 0 ){
				$ayah_list .= '<div class="ayah-list">';
				$ayah_list .= '<label for="ayah_list"><strong>'.word('select_aya_number').'</strong></label>';
				$ayah_list .= '<select class="form-control" name="formt" onchange="location = this.options[this.selectedIndex].value;" id="ayah_list">';
				$ayah_list .= '<option value="#">'.word('select_aya_number').'</option>';
				for( $a=1; $a <= $data_surah_ayat; ++$a ){
					$ayah_selected = ( $a == $ayah_id ? ' selected' : '' );
					$ayah_list .= '<option value="'.$this->url( array( 'action' => 'tafseer', 'type' => $tafseer_id, 'surah' => $surah_id, 'ayah' => $a ) ).'"'.$ayah_selected.'>'.$a.'</option>';
				}
				$ayah_list .= '</select>';
				$ayah_list .= '</div>';
			}else{
				$ayah_list = '';
			}

			$surah_list = '';
			$json_surah = $this->surah_name( 'ar' );
			if( !isset($json_surah['error']) && isset($json_surah['data']) && count($json_surah['data']) > 0 ){
				$language_id = ( isset($json['language_id']) ? $json['language_id'] : '' );
				$language_name = ( isset($json['language_name']) ? $json['language_name'] : '' );
				$language_name_ar = ( isset($json['language_name_ar']) ? $json['language_name_ar'] : '' );
				$language_name_en = ( isset($json['language_name_en']) ? $json['language_name_en'] : '' );
				$language_book = ( isset($json['language_book']) ? $json['language_book'] : '' );
				$language_sound = ( isset($json['language_sound']) ? $json['language_sound'] : '' );

				$surah_list .= '<div class="surah-list">';
				$surah_list .= '<label for="surah_list"><strong>'.word('select_surah').'</strong></label>';
				$surah_list .= '<select class="form-control" name="formt" onchange="location = this.options[this.selectedIndex].value;" id="surah_list">';
				$surah_list .= '<option value="#">'.word('select_surah').'</option>';
				foreach( $json_surah['data'] as $keys => $values ){
					$surah_number = ( isset($values['n']) ? $values['n'] : 0 );
					$surah_name = ( isset($values['name']) ? $values['name'] : '' );
					$surah_count = ( isset($values['ayat']) ? $values['ayat'] : 0 );
					$surah_name_en = ( isset($values['name_en']) ? $values['name_en'] : '' );
					$surah_url = $this->url( array( 'action' => 'tafseer', 'type' => $tafseer_id, 'surah' => $surah_number, 'ayah' => 1 ) );

					$surah_selected = ( $surah_number == $surah_id ? ' selected' : '' );
					$surah_list .= '<option value="'.$surah_url.'" title="'.$surah_name_en.'"'.$surah_selected.'>'.$surah_name.'</option>';

				}
				$surah_list .= '</select>';
				$surah_list .= '</div>';
			}else{
				$surah_list = ( isset($json_surah['error']) && !empty($json_surah['error']) ? $json_surah['error'] : 'Unknown error' );
			}

			$get_list = '<div class="row">';
			$get_list .= '<div class="col-12 col-md-4">';
			$get_list .= $surah_list;
			$get_list .= '</div>';
			$get_list .= '<div class="col-12 col-md-4">';
			$get_list .= $ayah_list;
			$get_list .= '</div>';
			$get_list .= '<div class="col-12 col-md-4">';
			$get_list .= $tafseer_list;
			$get_list .= '</div>';
			$get_list .= '</div>';

			$title = word('surah').' '.$data_surah_name.' '.$data_tafseer_name.' '.word('aya').' '.$data_ayah_id;

			$this->title = $title;
			$this->body_title = $title;
			$this->breadcrumb_title = word('aya').' '.$data_ayah_id;
			$this->breadcrumb_parent = array(
				array('title' => $data_tafseer_name, 'url' => $this->url( array( 'action' => 'tafseer', 'type' => $tafseer_id ) ) ),
				array('title' => $data_surah_name, 'url' => $this->url( array( 'surah' => $surah_id ) ) ) //'action' => 'tafseer', 'type' => $tafseer_id,
			);
			$this->headercode .= '<link rel="stylesheet" type="text/css" href="'.$this->get_theme_folder_url().'/css/mp3-player-button.css">';
			$this->headercode .= '<script type="text/javascript" src="'.$this->get_theme_folder_url().'/js/soundmanager2-nodebug-jsmin.js"></script>';
			$this->headercode .= '<script type="text/javascript" src="'.$this->get_theme_folder_url().'/js/mp3-player-button.js"></script>';

			$sound_folder = $this->sound_folder_aya( $this->default_reader_aya );
			$audio_file = $this->sound_check_aya($surah_id, $ayah_id, $sound_folder);

			$button = '<div class="listen_aya hvr-bounce-in"><a href="'.$audio_file.'" class="sm2_button" title="Play &quot;coins&quot;"><i class="fa fa-play"></i></a></div>';

			$code = '<div class="tafseer" itemscope itemtype="http://schema.org/Article">';
			$code .= '<div class="changesoraform">';
			$code .= $get_list;
			$code .= $this->post_share($title, $this->url( array( 'action' => 'tafseer', 'type' => $tafseer_id, 'surah' => $surah_id, 'ayah' => $ayah_id ) ));
			$code .= '</div>';
			$code .= '<div class="ayat4tafseer">';
			$code .= $this->fix_char($data_aya_text).' '.$this->ayah_number( $ayah_id );
			$code .= '<p class="ayat4tafseer_info">';
			$code .= word('surah').' <a href="'.$this->url( array( 'surah' => $surah_id ) ).'"><span class="number">'.$data_surah_name.'</span></a> ';
			$code .= $data_tafseer_name;
			$code .= '</p>';
			$code .= $button;
			$code .= '</div>';
			$code .= '<div class="ayat4tafseer_text" id="TAFSEER">'.( empty($data_text) ? word('not_found_tafseer') : nl2br($data_text)).'</div>';
			$code .= '</div>';
		}else{
			$this->cache_allow_create = false;
			$code = ( isset($json['error']) && !empty($json['error']) ? ( $json['error'] == 'empty' ? word('not_found_tafseer') : $json['error'] ) : 'Unknown error' );
		}
		return $code;
	}

	public function tafseer(){
		$surah_id = ( isset($_REQUEST['surah']) && intval($_REQUEST['surah']) < 115 ? intval($_REQUEST['surah']) : 1 );
		$x = ( isset($_REQUEST['reader_id']) ? intval($_REQUEST['reader_id']) : $this->default_reader );
		$aya = ( isset($_REQUEST['ayah']) && intval($_REQUEST['ayah']) != 0 ? intval($_REQUEST['ayah']) : 1 );
		$type = ( isset($_REQUEST['type']) && intval($_REQUEST['type']) != 0 ? intval($_REQUEST['type']) : 1 );

		if( isset($_GET['surah']) && $_GET['surah'] != 0 && $_GET['surah'] < 115 ){
			$code = $this->tafseer_view($surah_id, $aya, $type);
		}else{
			$code = $this->tafseer_surah_loop();
		}
		return $code;
	}

	public function translate(){
		if( isset($_GET['surah']) && $_GET['surah'] != 0 && $_GET['surah'] < 115 ){
			$code = $this->translate_view();
		}else{
			$code = $this->surah_loop();
		}
		return $code;
	}

	public function home_readers_form($surah, $l, $reader_id, $place=0){
		$readers = $this->readers();

		$mb = '';
		if( !isset($readers['error']) && isset($readers['data']) && count($readers['data']) > 0 ){
			if( $place == 1 ){
				$mb = ' mt-3';
			}
			$code = '<div class="reader-list'.$mb.'">';
			$code .= '<label for="reader_list"><strong>'.word('select_qaria').'</strong></label>';
			$code .= '<select class="form-control" name="reader_list" onchange="location = this.options[this.selectedIndex].value;" id="reader_list">';
			$code .= '<option value="#">'.word('select_qaria').'</option>';
			foreach ($readers['data'] as $key => $value) {
				$name = ( isset($value['name']) ? $value['name'] : '' );
				$name_en = ( isset($value['name_en']) ? $value['name_en'] : '' );
				$description = ( isset($value['description']) ? $value['description'] : '' );
				$description_en = ( isset($value['description_en']) ? $value['description_en'] : '' );
				$sound_folder = ( isset($value['sound_folder']) ? $value['sound_folder'] : '' );

				if( $place == 1 ){
					$get_url = $this->url( array( 'surah' => $surah, 'reader_id' => $key ) );
				}else{
					$get_url = $this->url( array( 'action' => 'translate', 'l' => $l, 'surah' => $surah, 'reader_id' => $key ) );
				}

				$get_name = ( in_array($this->get_language(), $this->get_rtl_languages()) ? $name : $name_en );

				$selected = ( $reader_id == $key ? ' selected' : '' );

				if( $reader_id == $key ){
					$this->reader_name = $get_name;
				}
				$code .= '<option value="'.$get_url.'"'.$selected.'>'.$get_name.'</option>';
			}
			$code .= '</select>';
			$code .= '</div>';
		}else{
			$code = ( isset($readers['error']) && !empty($readers['error']) ? $readers['error'] : 'Unknown error' );
		}
		return $code;
	}

	public function home_check_surah($surah, $n, $translatesound=""){
		$readers = $this->readers($n);

		if( !isset($readers['error']) && isset($readers['data']) && count($readers['data']) > 0 ){
			$value = $readers['data'];
			$name = ( isset($value['name']) ? $value['name'] : '' );
			$name_en = ( isset($value['name_en']) ? $value['name_en'] : '' );
			$description = ( isset($value['description']) ? $value['description'] : '' );
			$description_en = ( isset($value['description_en']) ? $value['description_en'] : '' );
			$sound_folder = ( isset($value['sound_folder']) ? $value['sound_folder'] : '' );
		}else{
			$sound_folder = '';
		}

		$surah_number = strlen($surah);

		if($surah_number==1){
			$s1 = '00'.$surah;
		}elseif($surah_number==2){
			$s1 = '0'.$surah;
		}elseif($surah_number==3){
			$s1 = $surah;
		}

		if( !empty($sound_folder) ){
			if($translatesound == ""){
				if(preg_match('/:N:/i', $sound_folder)) {
					$s = str_replace(":N:", $s1, $sound_folder).".mp3";
				}else{
					$s = $sound_folder.$s1.'.mp3';
				}
			}else{
				if(preg_match('/:N:/i', $translatesound)) {
					$s = str_replace(":N:",$s1, $translatesound).".mp3";
				}else{
					$s = ''.$translatesound.$s1.'.mp3';
				}
			}
		}else{
			$s = 'None';
		}

		return $s;
	}

	public function sound_folder_aya($n=16){
		$readers = $this->ayah_readers($n);
		if( !isset($readers['error']) && isset($readers['data']) && count($readers['data']) > 0 ){
			$value = $readers['data'];
			$name = ( isset($value['name']) ? $value['name'] : '' );
			$name_en = ( isset($value['name_en']) ? $value['name_en'] : '' );
			$description = ( isset($value['description']) ? $value['description'] : '' );
			$description_en = ( isset($value['description_en']) ? $value['description_en'] : '' );
			$sound_folder = ( isset($value['sound_folder']) ? $value['sound_folder'] : '' );
			return $sound_folder;
		}else{
			return '';
		}
	}

	public function sound_check_aya($surah, $aya, $folder){
		$surah_number = strlen($surah);
		$aya_number = strlen($aya);

		if($surah_number==1){
			$s1 = '00'.$surah;
		}elseif($surah_number==2){
			$s1 = '0'.$surah;
		}elseif($surah_number==3){
			$s1 = $surah;
		}

		if($aya_number==1){
			$s2 = '00'.$aya;
		}elseif($aya_number==2){
			$s2 = '0'.$aya;
		}elseif($aya_number==3){
			$s2 = $aya;
		}

		if( !empty($folder) ){
			$s = $folder.$s1.$s2.'.mp3';
		}else{
			$s = 'None';
		}

		return $s;
	}

	public function home_form_change_ayah($surah, $from, $to){
		$json = $this->surah_name();
		$surah_count = 0;

		if(isset($_GET['reader_id']) && intval($_GET['reader_id']) != 0){
			$reader = '<input type="hidden" name="reader_id" value="'.intval($_GET['reader_id']).'">';
		}else{
			$reader = '';
		}

		if( isset($json['data']) && is_array($json['data']) ){
			$s = '<div class="changesoraform mt-3 mb-3">';
			$s .= '<form name="form-change" action="" method="post">';
			$s .= '<input type="hidden" name="change" value="1">';
			$s .= '<input type="hidden" name="surah" value="'.$surah.'">';
			$s .= $reader;
			$i = 0;
			$s .= '<div class="row">';

			$s .= '<div class="col">';
			$s .= '<div class="form-group">';
			$s .= '<label for="surah_names">'.word('the_surah').'</label>';
			$s .= '<select id="surah_names" class="form-control" name="sora_link" onchange="location = this.options[this.selectedIndex].value;">';
			foreach( $json['data'] as $key => $value ){
				++$i;
				$get_surah_name = ( isset($value['name']) ? $value['name'] : '' );
				$get_surah_count = ( isset($value['ayat']) ? $value['ayat'] : 0 );
				$selected = ( $surah == $i ? ' selected' : '' );
				if( $surah == $i ){
					$surah_count = $get_surah_count;
				}
				$s .= '<option value="'.$this->url( array( 'surah' => $i ) ).'"'.$selected.'>'.$i.'- '.$get_surah_name.'</option>';
			}
			$s .= '</select>';
			$s .= '</div>';
			$s .= '</div>';

			$s .= '<div class="col">';
			$s .= '<div class="form-group">';
			$s .= '<label for="surah_from">'.word('from').'</label>';
			$s .= '<select id="surah_from" class="form-control" name="f">';
			for($i2=1; $i2<$surah_count+1; $i2++){
				$selected2 = ( $from == $i2 ? ' selected' : '' );
				$s .= '<option value="'.$i2.'"'.$selected2.'>'.$i2.'</option>';
			}
			$s .= '</select>';
			$s .= '</div>';
			$s .= '</div>';

			$s .= '<div class="col">';
			$s .= '<div class="form-group">';
			$s .= '<label for="surah_to">'.word('to').'</label>';
			$s .= '<select id="surah_to" class="form-control" name="t">';
			for($i3=1; $i3<$surah_count+1; $i3++){
				if($to == 0){
					$to = $surah_count;
				}else{
					$to = $to;
				}
				$selected3 = ( $to == $i3 ? ' selected' : '' );
				$s .= '<option value="'.$i3.'"'.$selected3.'>'.$i3.'</option>';
			}
			$s .= '</select>';
			$s .= '</div>';
			$s .= '</div>';

			$s .= '<div class="col">';
			$s .= '<label for="submit">&nbsp</label>';
			$s .= '<button type="submit" class="btn btn-primary form-control" id="submit">'.word('change').'</button>';
			$s .= '</div>';
			$s .= '</div>';

			$s .= '</form>';
			$s .= '</div>';
		}else{
			$s = '';
		}

		return $s;
	}

	public function get_hreflang($language_code='', $notin=''){
		$json = $this->languages();
		if( !isset($json['error']) && isset($json['data']) && count($json['data']) > 0 ){
			$code = '';

			if( empty($language_code) ){
				foreach( $json['data'] as $key => $value ){
					$id = ( isset($value['id']) ? $value['id'] : 0 );
					$name = ( isset($value['name']) ? $value['name'] : '' );
					$name_ar = ( isset($value['name_ar']) ? $value['name_ar'] : '' );
					$name_en = ( isset($value['name_en']) ? $value['name_en'] : '' );
					$file = ( isset($value['file']) ? $value['file'] : '' );
					$book = ( isset($value['book']) ? $value['book'] : '' );
					$more = ( isset($value['more']) ? $value['more'] : '' );
					$source = ( isset($value['source']) ? $value['source'] : '' );
					$lang = ( isset($value['lang']) ? $value['lang'] : '' );
					$getkey = ( isset($value['key']) ? $value['key'] : '' );
					$flag = ( isset($value['flag']) ? $value['flag'] : '' );

					$get_flags = '<img class="flags" src="'.$flag.'" alt="'.$name.'">';

					if($notin != $getkey){
						$code .= '<link rel="alternate" hreflang="'.$getkey.'" title="'.$name.'" href="'.$this->url( array( 'action' => 'translate', 'l' => $getkey ) ).'">';
					}
				}
			}else{
				$code = '<link rel="alternate" hreflang="'.$json['data'][$language_code]['key'].'" title="'.$json['data'][$language_code]['name'].'" href="'.$this->url( array( 'action' => 'translate', 'l' => $json['data'][$language_code]['key'] ) ).'">';
			}
		}else{
			$code = ( isset($json['error']) && !empty($json['error']) ? $json['error'] : 'Unknown error' );
		}

		return '';
	}

	public function get_languages(){
		$json = $this->languages();
		if( !isset($json['error']) && isset($json['data']) && count($json['data']) > 0 ){
			$this->title = word('languages');
			$code = '<div class="row">';
			foreach( $json['data'] as $key => $value ){
				$id = ( isset($value['id']) ? $value['id'] : 0 );
				$name = ( isset($value['name']) ? $value['name'] : '' );
				$name_ar = ( isset($value['name_ar']) ? $value['name_ar'] : '' );
				$name_en = ( isset($value['name_en']) ? $value['name_en'] : '' );
				$file = ( isset($value['file']) ? $value['file'] : '' );
				$book = ( isset($value['book']) ? $value['book'] : '' );
				$more = ( isset($value['more']) ? $value['more'] : '' );
				$source = ( isset($value['source']) ? $value['source'] : '' );
				$lang = ( isset($value['lang']) ? $value['lang'] : '' );
				$getkey = ( isset($value['key']) ? $value['key'] : '' );
				$flag = ( isset($value['flag']) ? $value['flag'] : '' );

				$get_flags = '<img class="flags" src="'.$flag.'" alt="'.$name.'">';

				if( $key != 'ar' ){
					$code .= '<div class="col-12 col-sm-4 col-md-3"><div class="spacer"><h5><a title="'.$name_en.' - '.$name_ar.'" href="'.$this->url( array( 'action' => 'translate', 'l' => $getkey ) ).'">'.$get_flags.' '.$name.'</a></h5></div></div>';
				}

			}
			$code .= '</div>';
		}else{
			$code = ( isset($json['error']) && !empty($json['error']) ? $json['error'] : 'Unknown error' );
		}

		return $code;
	}

	public function get_navbar(){
		$code = '';
		$code .= '<li class="nav-item"><a class="nav-link" href="'.$this->siteurl.'/#quran">'.word('quran').'</a></li>';
		$code .= '<li class="nav-item"><a class="nav-link" href="'.$this->siteurl.'/#tafseer">'.word('tfaseer').'</a></li>';
		$code .= '<li class="nav-item"><a class="nav-link" href="'.$this->siteurl.'/#languages">'.word('languages').'</a></li>';
		$code .= '<li class="nav-item"><a class="nav-link" href="'.$this->url( array( 'action' => 'books') ).'">'.word('books').'</a></li>';
		$code .= '';

		/*
		$navbar_links = array('en', 'fr', 'de', 'es', 'pt', 'ru', 'zh', 'ko', 'id');
		$json = $this->languages();
		if( !isset($json['error']) && isset($json['data']) && count($json['data']) > 0 ){
			$code = '<ul class="navbar-nav">';
			foreach( $json['data'] as $key => $value ){
				$id = ( isset($value['id']) ? $value['id'] : 0 );
				$name = ( isset($value['name']) ? $value['name'] : '' );
				$name_ar = ( isset($value['name_ar']) ? $value['name_ar'] : '' );
				$name_en = ( isset($value['name_en']) ? $value['name_en'] : '' );
				$file = ( isset($value['file']) ? $value['file'] : '' );
				$book = ( isset($value['book']) ? $value['book'] : '' );
				$more = ( isset($value['more']) ? $value['more'] : '' );
				$source = ( isset($value['source']) ? $value['source'] : '' );
				$lang = ( isset($value['lang']) ? $value['lang'] : '' );
				$getkey = ( isset($value['key']) ? $value['key'] : '' );
				$flag = ( isset($value['flag']) ? $value['flag'] : '' );

				$get_flags = '<img src="'.$flag.'" alt="'.$name.'">';

				if( in_array($getkey, $navbar_links) ){
					$code .= '<li class="nav-item"><a class="nav-link" href="'.$this->url( array( 'action' => 'translate', 'l' => $getkey ) ).'">'.$get_flags.' '.$name.' <span class="sr-only">(current)</span></a></li>';
				}

			}
			$code .= '<li class="nav-item"><a class="nav-link" href="language.html"><img src="'.$this->get_theme_folder_url().'/flags/other.png" alt="'.word('more').'"> '.word('more').'</a></li>';
			$code .= '</ul>';
		}else{
			$code = ( isset($json['error']) && !empty($json['error']) ? $json['error'] : 'Unknown error' );
		}
		*/

		return $code;
	}

	public function url($data = ''){
		$mod_rewrite = $this->mod_rewrite_allow;
		$sitr_url = $this->siteurl.'/';
		$fileName = '?'; //index.php
		$allow_action = array( 'home', 'tafseer', 'translate', 'language', 'languages', 'books', 'books_language', 'books_category', 'book' );

		if( is_array($data) ){
			$action = ( isset($data['action']) ? strip_tags($data['action']) : 'home' );
			$type = ( isset($data['type']) ? intval($data['type']) : '' );
			$surah = ( isset($data['surah']) ? intval($data['surah']) : '' );
			$ayah = ( isset($data['ayah']) ? intval($data['ayah']) : '' );
			$language = ( isset($data['l']) ? strip_tags($data['l']) : '' );
			$reader_id = ( isset($data['reader_id']) ? intval($data['reader_id']) : '' );
			$from = ( isset($data['f']) ? intval($data['f']) : '' );
			$to = ( isset($data['t']) ? intval($data['t']) : '' );
			$book_id = ( isset($data['book_id']) ? intval($data['book_id']) : '' );
			$name = ( isset($data['name']) ? strip_tags(strtolower($data['name'])) : '' );
			$category_id = ( isset($data['category_id']) ? intval($data['category_id']) : '' );
			$page = ( isset($data['page']) ? intval($data['page']) : '' );

			$get_action = ( in_array($action, $allow_action) ? 'action='.$action : '' );
			$get_language = ( empty($language) ? '' : '&l='.$language );
			$get_type = ( empty($type) ? '' : '&type='.$type );
			$get_surah = ( empty($surah) ? '' : '&surah='.$surah );
			$get_ayah = ( empty($ayah) ? '' : '&ayah='.$ayah );
			$get_reader_id = ( empty($reader_id) ? '' : '&reader_id='.$reader_id );
			$get_from = ( empty($from) ? '' : '&f='.$from );
			$get_to = ( empty($to) ? '' : '&t='.$to );
			$get_book_id = ( empty($book_id) ? '' : '&book_id='.$book_id );
			$get_name = ( empty($name) ? '' : '&name='.$name );
			$get_category_id = ( empty($category_id) ? '' : '&category_id='.$category_id );
			$get_page = ( empty($page) ? '' : '&page='.$page );

			if( $mod_rewrite ){
				if( $action == 'tafseer' && !empty($surah) && !empty($ayah) && !empty($type) ){
					$url = $sitr_url.sprintf('t-%d-%d-%d.html', $surah, $type, $ayah);
				}elseif( $action == 'tafseer' && !empty($surah) && !empty($type) && empty($ayah) ){
					$url = $sitr_url.sprintf('tafseer-%d-%d.html', $type, $surah);
				}elseif( $action == 'tafseer' && !empty($type) && empty($surah) && empty($ayah) ){
					$url = $sitr_url.sprintf('tafseer-%d.html', $type);
				}elseif( $action == 'translate' && !empty($language) && !empty($surah) && !empty($reader_id) ){
					$url = $sitr_url.sprintf('s-%s-%d-%d.html', $language, $surah, $reader_id);
				}elseif( $action == 'translate' && !empty($language) && !empty($surah) && empty($reader_id) ){
					$url = $sitr_url.sprintf('translate-%s-%d.html', $language, $surah);
				}elseif( $action == 'translate' && !empty($language) && empty($surah) && empty($reader_id) ){
					$url = $sitr_url.sprintf('language-%s.html', $language);
				}elseif( $action == 'languages' ){
					$url = $sitr_url.'languages.html';
				}elseif( $action == 'quran' ){
					$url = $sitr_url.'quran.html';
				}elseif( $action == 'home' && !empty($from) && !empty($to) && !empty($surah) ){
					$url = $sitr_url.sprintf('view-%d,from-%d,to-%d.html', $surah, $from, $to);
				}elseif( $action == 'home' && !empty($surah) && !empty($reader_id) ){
					$url = $sitr_url.sprintf('reader-%d-%d.html', $surah, $reader_id);
				}elseif( $action == 'home' && !empty($surah) ){
					$url = $sitr_url.sprintf('surah-%d.html', $surah);
				}elseif( $action == 'books_language' && !empty($name) && !empty($page) ){
					$url = $sitr_url.sprintf('%s-page-%d.html', $name, $page);
				}elseif( $action == 'books_language' && !empty($name) ){
					$url = $sitr_url.sprintf('books-in-%s.html', $name);
				}elseif( $action == 'books_category' && !empty($category_id) ){
					$url = $sitr_url.sprintf('books-category-%s.html', $category_id);
				}elseif( $action == 'book' && !empty($book_id) ){
					$url = $sitr_url.sprintf('book-%d.html', $book_id);
				}elseif( $action == 'books' ){
					$url = $sitr_url.sprintf('books.html', $book_id);
				}else{
					$url = 'index.html';
				}
			}else{
				if( empty($get_action) ){
					$url = $sitr_url;
				}else{
					$url = $sitr_url.$fileName.$get_action.$get_language.$get_type.$get_surah.$get_ayah.$get_from.$get_to.$get_book_id.$get_name.$get_category_id.$get_page;
				}
			}
			$output = $url;
		}else{
			$output = $sitr_url;
		}

	return $output;
	}

	public function get_breadcrumb( $arr='' ){
		if( !$this->hide_breadcrumb ){
			$code = '<div class="mt-3"></div>';
		}else{
			if( empty($this->breadcrumb_parent) ){
				$links = $arr;
			}else{
				$links = $this->breadcrumb_parent;
			}

			if( empty($this->breadcrumb_title) ){
				$breadcrumb_title = ( empty($this->body_title) ? $this->title : $this->body_title );
			}else{
				$breadcrumb_title = $this->breadcrumb_title;
			}

			if( empty($this->reader_name) ){
				$reader_name = '';
			}else{
				if( isset($_GET['reader_id']) && intval($_GET['reader_id']) != 0 ){
					$reader_name = ' | '.$this->reader_name;
				}else{
					$reader_name = '';
				}
			}

			$page = (int) (!isset($_GET["page"]) ? 1 : $_GET["page"]);
			$extra_title = '';
			if( $page > 1 ){
				$extra_title .= ' | '.word('page').' '.$page;
			}

			if( empty($breadcrumb_title) ){
				$code = '';
			}else{
				$code = '<nav aria-label="breadcrumb" class="custom-breadcrumb">';
				$code .= '<ol class="breadcrumb" itemscope itemtype="http://schema.org/BreadcrumbList">';
				$code .= '<li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">';
				$code .= '<a itemprop="item" href="'.$this->siteurl.'"><span itemprop="name">'.word('home').'</span></a>';
				$code .= '<meta itemprop="position" content="1" />';
				$code .= '</li>';

				$URLs = '';
				$i=1;

				if( isset($links['title']) && isset($links['url']) ){
					$title = ( isset($links['title']) ? $links['title'] : '' );
					$url = ( isset($links['url']) ? $links['url'] : '' );
					if( !empty($title) && !empty($url) ){
						++$i;
						$URLs .= '<li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">';
						$URLs .= '<a itemprop="item" href="'.$url.'"><span itemprop="name">'.$title.'</span></a>';
						$URLs .= '<meta itemprop="position" content="'.$i.'" />';
						$URLs .= '</li>';
					}
				}else{
					if( is_array($links) && count($links) > 0 ){
						foreach( $links as $key => $value ){
							$title = ( isset($value['title']) ? $value['title'] : '' );
							$url = ( isset($value['url']) ? $value['url'] : '' );
							if( !empty($title) && !empty($url) ){
								++$i;
								$URLs .= '<li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">';
								$URLs .= '<a itemprop="item" href="'.$url.'"><span itemprop="name">'.$title.'</span></a>';
								$URLs .= '<meta itemprop="position" content="'.$i.'" />';
								$URLs .= '</li>';
							}
						}
					}
				}

				$code .= $URLs;
				$code .= '<li class="breadcrumb-item active" aria-current="page">';
				$code .= $breadcrumb_title.$reader_name.$extra_title;
				$code .= '</li>';
				$code .= '</ol>';

				$code .= '</nav>';
			}

		}

		return $code;
	}

	public function createfile($filename, $content){
		if (!$handle = fopen($filename, 'w')) {
			$text = '<div class="alert">Can not open this file ('.$filename.')</div>';
		}

		if (fwrite($handle, $content) === FALSE) {
			$text = '<div class="alert">can not write on this file ('.$filename.')</div>';
		}

		$text = '<div class="alert">SiteMap is created<br /><a href="'.$filename.'">'.$filename.'</a></div>';
		fclose($handle);
		return $text;
	}

	public function xml_surah(){
		$xml = '';
		for($i=1; $i<=114; ++$i){
			$xml .= '<url>'."\n";
			$xml .= '<loc>'.htmlentities($this->url( array( 'surah' => $i ) )).'</loc>'."\n";
			$xml .= '</url>'."\n";
		}
		return $xml;
	}

	public function xml_tafseer(){
		$xml = '';
		for($ix=1; $ix<=5; ++$ix){
			$xml .= '<url>'."\n";
			$xml .= '<loc>'.$this->url( array( 'action' => 'tafseer', 'type' => $ix ) ).'</loc>'."\n";
			$xml .= '</url>'."\n";
		}

		for($iz=1; $iz<=5; ++$iz){
			for($i2=1; $i2<=114; ++$i2){
				$xml .= '<url>'."\n";
				$xml .= '<loc>'.$this->url( array( 'action' => 'tafseer', 'type' => $iz, 'surah' => $i2 ) ).'</loc>'."\n";
				$xml .= '</url>'."\n";
			}
		}

		for($i=1; $i<=5; ++$i){
			for($i2=1; $i2<=114; ++$i2){
				for($i3=1; $i3<=$this->aya_count[$i2]; ++$i3){
					$xml .= '<url>'."\n";
					$xml .= '<loc>'.$this->url( array( 'action' => 'tafseer', 'type' => $i, 'surah' => $i2, 'ayah' => $i3 ) ).'</loc>'."\n";
					$xml .= '</url>'."\n";
				}
			}
		}
		return $xml;
	}

	public function xml_language(){
		$xml = '';
		$languages = $this->languages();
		if( !isset($languages['error']) && isset($languages['data']) && count($languages['data']) > 0 ){
			foreach($languages['data'] as $key => $value){
				$id = ( isset($value['id']) ? $value['id'] : 0 );
				$name = ( isset($value['name']) ? $value['name'] : '' );
				$name_ar = ( isset($value['name_ar']) ? $value['name_ar'] : '' );
				$name_en = ( isset($value['name_en']) ? $value['name_en'] : '' );
				$file = ( isset($value['file']) ? $value['file'] : '' );
				$book = ( isset($value['book']) ? $value['book'] : '' );
				$more = ( isset($value['more']) ? $value['more'] : '' );
				$source = ( isset($value['source']) ? $value['source'] : '' );
				$lang = ( isset($value['lang']) ? $value['lang'] : '' );
				$getkey = ( isset($value['key']) ? $value['key'] : '' );
				$flag = ( isset($value['flag']) ? $value['flag'] : '' );

				$t_url = $this->url( array( 'action' => 'translate', 'l' => $getkey ) );

				if($key != "ar"){
					if( !empty($t_url) && $t_url != "index.html" ){
						$xml .= '<url>'."\n";
						$xml .= '<loc>'.$this->url( array( 'action' => 'translate', 'l' => $getkey ) ).'</loc>'."\n";
						$xml .= '</url>'."\n";
					}
				}
			}

			foreach($languages['data'] as $keys => $values){
				$id = ( isset($values['id']) ? $values['id'] : 0 );
				$name = ( isset($values['name']) ? $values['name'] : '' );
				$name_ar = ( isset($values['name_ar']) ? $values['name_ar'] : '' );
				$name_en = ( isset($values['name_en']) ? $values['name_en'] : '' );
				$file = ( isset($values['file']) ? $values['file'] : '' );
				$book = ( isset($values['book']) ? $values['book'] : '' );
				$more = ( isset($values['more']) ? $values['more'] : '' );
				$source = ( isset($values['source']) ? $values['source'] : '' );
				$lang = ( isset($values['lang']) ? $values['lang'] : '' );
				$getkey = ( isset($values['key']) ? $values['key'] : '' );
				$flag = ( isset($values['flag']) ? $values['flag'] : '' );

				if($keys != 'ar'){
					for($i2=1; $i2<=114; ++$i2){
						$xml .= '<url>'."\n";
						$xml .= '<loc>'.$this->url( array( 'action' => 'translate', 'l' => $getkey, 'surah' => $i2 ) ).'</loc>'."\n";
						$xml .= '</url>'."\n";
					}
				}
			}
		}
		return $xml;
	}

	public function xml_body( $code ){
		$xml = '<?xml version="1.0" encoding="utf-8"?>
		<urlset
		      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
		      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
		            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
		<url>
		  <loc>'.$this->siteurl.'</loc>
		</url>'."\n";
		$xml .= $code;
		$xml .= '</urlset>';
		return $xml;
	}

	public function create_xml(){
		$path = $this->path.'/sitemaps';

		$sitemap_surah = 'sitemap-surah.xml';
		$sitemap_tafseer = 'sitemap-tafseer.xml';
		$sitemap_language = 'sitemap-language.xml';

		if( !file_exists($path.'/'.$sitemap_surah) ){
			$this->createfile($path.'/'.$sitemap_surah, $this->xml_body($this->xml_surah()));
		}
		if( !file_exists($path.'/'.$sitemap_tafseer) ){
			$this->createfile($path.'/'.$sitemap_tafseer, $this->xml_body($this->xml_tafseer()));
		}
		if( !file_exists($path.'/'.$sitemap_language) ){
			$this->createfile($path.'/'.$sitemap_language, $this->xml_body($this->xml_language()));
		}
	}

	public function audio_player($url, $auto=0){
		if($auto==1){ $au = ' autoplay'; }else{ $au = ''; }

		$s = '<audio controls'.$au.'>
		  <source src="'.$url.'" type="audio/mpeg">
		  Your browser does not support the audio element.
		</audio>';
		return $s;
	}

	public function json( $url ){
		$json = get_json( $url );
		$status = ( isset($json['status']) ? $json['status'] : '' );
		$msg = ( isset($json['msg']) ? $json['msg'] : '' );

		if( $status == 'ok' && empty($msg) ){
			return $json;
		}else{
			return array( 'error' => $msg );
		}
	}

	public function home_page(){
		$this->hide_breadcrumb = false;
		$this->title = $this->siteName;
		$this->description = $this->siteDescription;
		$this->url = $this->siteurl;
		$this->container_class = 'container-section';

		$quran = '';
		if( $this->home_allow_quran ){
			$quran .= '<div class="section-1" id="quran">';
			$quran .= '<div class="container">';
			$quran .= '<div class="section-content">';
			$quran .= '<div class="section-title">';
			$quran .= '<h1>'.word('select_surah').'</h1>';
			$quran .= '</div>';
			$quran .= '<div class="section-text">';
			$quran .= $this->quran();
			$quran .= '</div>';
			$quran .= '</div>';
			$quran .= '</div>';
			$quran .= '</div>';
		}

		$tafseer = '';
		if( $this->home_allow_tafseer ){
			if( $this->tafseer_col == 1 ){
				$colClass = 'col-6 col-md-12';
			}elseif( $this->tafseer_col == 2 ){
				$colClass = 'col-6 col-md-6';
			}elseif( $this->tafseer_col == 3 ){
				$colClass = 'col-6 col-md-4';
			}elseif( $this->tafseer_col == 4 ){
				$colClass = 'col-6 col-md-3';
			}elseif( $this->tafseer_col == 6 ){
				$colClass = 'col-6 col-md-2';
			}else{
				$colClass = 'col-12 col-md-4';
			}

			$tafseer .= '<div class="section-2" id="tafseer">';
			$tafseer .= '<div class="container">';
			$tafseer .= '<div class="section-content">';
			$tafseer .= '<div class="section-title">';
			$tafseer .= '<h1>'.word('select_tafseer').'</h1>';
			$tafseer .= '</div>';
			$tafseer .= '<div class="section-text">';
			$json_tafseer = $this->api_tafseer();
			if( !isset($json_tafseer['error']) && isset($json_tafseer['data']) && count($json_tafseer['data']) > 0 ){
				$home_tafseer = '<div class="row">';
				foreach( $json_tafseer['data'] as $keys => $values ){
					$t_name = ( isset($values['name']) ? $values['name'] : '' );
					$t_name_en = ( isset($values['name_en']) ? $values['name_en'] : '' );

					$tafseer_url = $this->url( array( 'action' => 'tafseer', 'type' => $keys ) );

					$home_tafseer .= '<div class="'.$colClass.'"><div class="spacer"><h5><a href="'.$tafseer_url.'">'.$t_name.'</a></h5></div></div>';
				}
				$home_tafseer .= '</div>';
			}else{
				$home_tafseer = ( isset($json_tafseer['error']) && !empty($json_tafseer['error']) ? $json_tafseer['error'] : 'Unknown error' );
			}
			$tafseer .= $home_tafseer;
			$tafseer .= '</div>';
			$tafseer .= '</div>';
			$tafseer .= '</div>';
			$tafseer .= '</div>';
		}

		$language = '';
		if( $this->home_allow_language ){
			if( $this->language_col == 1 ){
				$colClassLang = 'col-6 col-md-12';
			}elseif( $this->language_col == 2 ){
				$colClassLang = 'col-6 col-md-6';
			}elseif( $this->language_col == 3 ){
				$colClassLang = 'col-6 col-md-4';
			}elseif( $this->language_col == 4 ){
				$colClassLang = 'col-6 col-md-3';
			}elseif( $this->language_col == 6 ){
				$colClassLang = 'col-6 col-md-2';
			}else{
				$colClassLang = 'col-12 col-md-3';
			}

			$language .= '<div class="section-3" id="languages">';
			$language .= '<div class="container">';
			$language .= '<div class="section-content">';
			$language .= '<div class="section-title">';
			$language .= '<h1>'.word('select_language').'</h1>';
			$language .= '</div>';
			$language .= '<div class="section-text">';
			$json = $this->languages();
			if( !isset($json['error']) && isset($json['data']) && count($json['data']) > 0 ){
				$home_language = '<div class="row">';
				foreach( $json['data'] as $key => $value ){
					$id = ( isset($value['id']) ? $value['id'] : 0 );
					$name = ( isset($value['name']) ? $value['name'] : '' );
					$name_ar = ( isset($value['name_ar']) ? $value['name_ar'] : '' );
					$name_en = ( isset($value['name_en']) ? $value['name_en'] : '' );
					$file = ( isset($value['file']) ? $value['file'] : '' );
					$book = ( isset($value['book']) ? $value['book'] : '' );
					$more = ( isset($value['more']) ? $value['more'] : '' );
					$source = ( isset($value['source']) ? $value['source'] : '' );
					$lang = ( isset($value['lang']) ? $value['lang'] : '' );
					$getkey = ( isset($value['key']) ? $value['key'] : '' );
					$flag = ( isset($value['flag']) ? $value['flag'] : '' );

					$get_flags = '<img class="flags" src="'.$flag.'" alt="'.$name.'">';

					$language_url = $this->url( array( 'action' => 'translate', 'l' => $getkey ) );

					if( $key != 'ar' ){
						$home_language .= '<div class="'.$colClassLang.'"><div class="spacer"><h5><a title="'.$name_en.' - '.$name_ar.'" href="'.$language_url.'">'.$get_flags.' '.$name.'</a></h5></div></div>';
					}

				}
				$home_language .= '</div>';
			}else{
				$home_language = ( isset($json['error']) && !empty($json['error']) ? $json['error'] : 'Unknown error' );
			}
			$language .= $home_language;
			$language .= '</div>';
			$language .= '</div>';
			$language .= '</div>';
			$language .= '</div>';
		}

		$data = array('quran' => $quran, 'tafseer' => $tafseer, 'language' => $language);

		$code = '<div class="home-sections">';
		if( is_array($this->home_sort) && count($this->home_sort) > 0 ){
			foreach( $this->home_sort as $key => $value ){
				if( array_key_exists($value, $data) ){
					$code .= $data[$value];
				}
			}
		}else{
			$code .= $quran;
			$code .= $tafseer;
			$code .= $language;
		}
		$code .= '</div>';
		return $code;
	}

	public function quran(){
		$this->hide_breadcrumb = false;
		$json_surah = $this->surah_name();
		if( !isset($json['error']) && isset($json_surah['data']) && count($json_surah['data']) > 0 ){
			$language_id = ( isset($json_surah['language_id']) ? $json_surah['language_id'] : '' );
			$language_name = ( isset($json_surah['language_name']) ? $json_surah['language_name'] : '' );
			$language_name_ar = ( isset($json_surah['language_name_ar']) ? $json_surah['language_name_ar'] : '' );
			$language_name_en = ( isset($json_surah['language_name_en']) ? $json_surah['language_name_en'] : '' );
			$language_book = ( isset($json_surah['language_book']) ? $json_surah['language_book'] : '' );
			$language_sound = ( isset($json_surah['language_sound']) ? $json_surah['language_sound'] : '' );

			if( $this->quran_col == 1 ){
				$colClass = 'col-6 col-md-12';
			}elseif( $this->quran_col == 2 ){
				$colClass = 'col-6 col-md-6';
			}elseif( $this->quran_col == 3 ){
				$colClass = 'col-6 col-md-4';
			}elseif( $this->quran_col == 4 ){
				$colClass = 'col-6 col-md-3';
			}elseif( $this->quran_col == 6 ){
				$colClass = 'col-6 col-md-2';
			}else{
				$colClass = 'col-6 col-md-4';
			}

			$output = '<div class="row">';
			foreach( $json_surah['data'] as $keyx => $valuex ){
				$surah_number = ( isset($valuex['n']) ? $valuex['n'] : 0 );
				$surah_name = ( isset($valuex['name']) ? $valuex['name'] : '' );
				$surah_count = ( isset($valuex['ayat']) ? $valuex['ayat'] : 0 );

				$surah_url = $this->url( array( 'surah' => $surah_number ) );

				$output .= '<div class="'.$colClass.'">';
				$output .= '<div class="spacer">';
				$output .= '<h5><a title="'.word('surah').' '.$surah_name.' - '.word('aya_count').' '.$surah_count.'" href="'.$surah_url.'">'.$surah_number.'- '.$surah_name.'</a></h5>';
				$output .= '</div>';
				$output .= '</div>';
			}
			$output .= '</div>';
		}else{
			$this->cache_allow_create = false;
			$output = ( isset($json_surah['error']) && !empty($json_surah['error']) ? $json_surah['error'] : 'Unknown error' );
		}

		return $output;
	}

	public function convert_numbers_to_arabic($str){
		$western_arabic = array('0','1','2','3','4','5','6','7','8','9');
		$eastern_arabic = array('٠','١','٢','٣','٤','٥','٦','٧','٨','٩');
		$str = str_replace($western_arabic, $eastern_arabic, $str);
		return $str;
	}

	public function fix_char($str){
		$text = str_replace( array('۟'), array('ْ'), $str);
		return $text;
	}

	public function ayah_number( $n ){
		return '<span class="aya-number">﴿'.$this->convert_numbers_to_arabic($n).'﴾</span>';
	}

	public function home_view_surah(){
		$surah_id = ( isset($_REQUEST['surah']) && intval($_REQUEST['surah']) < 115 ? intval($_REQUEST['surah']) : 1 );
		$from = ( isset($_GET['f']) && intval($_GET['f']) != 0 ? intval($_GET['f']) : 1 );
		$to = ( isset($_GET['t']) && intval($_GET['t']) != 0 ? intval($_GET['t']) : 0 );
		$reader_id = ( isset($_GET['reader_id']) ? intval($_GET['reader_id']) : $this->default_reader );
		$row = ( isset($_GET['row']) ? intval($_GET['row']) : 0 );

		if($surah_id > 114){ $surah_id = 114; }

		if( $this->allw_readerform ){
			$readers_form = $this->home_readers_form($surah_id, 0, $reader_id, 1);
		}

		$audio_url = $this->home_check_surah($surah_id, $reader_id);
		$code = '';
		if( $this->allw_listen_surah ){
			$code .= '<div class="listensora">'.$this->audio_player($audio_url, 0).''.$readers_form.'</div>';
		}
		if( $this->allw_formchange_surah ){
			$code .= $this->home_form_change_ayah($surah_id, $from, $to);
		}

		$json = $this->api_surah_loop($surah_id, '', true);
		if( $json != false && isset($json['data']) && count($json['data']) > 0 ){
			$count = ( isset($json['count']) ? $json['count'] : 0 );
			$surah_id = ( isset($json['surah_id']) ? $json['surah_id'] : 0 );
			$surah_name = ( isset($json['surah_name']) ? $json['surah_name'] : '' );
			$surah_image = ( isset($json['surah_image']) ? $json['surah_image'] : '' );

			$this->title = word('surah').' '.$surah_name;
			$this->body_title = word('surah').' '.$surah_name;
			$this->description = word('surah').' '.$surah_name.' '.word('aya_count').' '.$count;
			$this->breadcrumb_parent = array( 'title' => word('quran'), 'url' => $this->url( array( 'action' => 'quran' ) ) );
			$this->image = $surah_image;
			$this->url = $this->url( array( 'l' => 'ar', 'surah' => $surah_id ) );

			$text = '';
			foreach( $json['data'] as $key => $value ){
				$ayah_number = ( isset($value['ayah_number']) ? $value['ayah_number'] : 0 );
				$ayah_text = ( isset($value['ayah_text']) ? $value['ayah_text'] : '' );
				$ayah_url = $this->url( array( 'action' => 'tafseer', 'type' => 5, 'surah' => $surah_id, 'ayah' => $key ) );

				if( $this->surah_one_line ){
					$text .= '<div class="mt-3"><a href="'.$ayah_url.'"><span class="ayat">'.$this->fix_char($ayah_text).'</span> '.$this->ayah_number( $key ).'</a></div>';
				}else{
					$text .= '<a href="'.$ayah_url.'"><span class="ayat">'.$this->fix_char($ayah_text).'</span> '.$this->ayah_number( $key ).'</a> ';
				}
			
			}

			if( $this->surah_one_line ){
				$div_class = 'surah-text-one-line';
			}else{
				$div_class = 'surah-text';
			}

			$code .= '<div class="'.$div_class.'">';
			$code .= $text;
			$code .= '</div>';
		}else{
			$code .= ( isset($json['error']) && !empty($json['error']) ? $json['error'] : 'Unknown error' );
		}

		return $code;
	}

	public function surah_loop() {
		$l = $this->get_language();
		$classname = ( $l == 'ar' ? 'col-12 col-sm-6 col-md-4' : 'col-12 col-sm-6 col-md-6' );

		$json = $this->surah_name( $l );

		if( $json != false && isset($json['data']) && count($json['data']) > 0 ){
			$language_id = ( isset($json['language_id']) ? $json['language_id'] : '' );
			$language_name = ( isset($json['language_name']) ? $json['language_name'] : '' );
			$language_name_ar = ( isset($json['language_name_ar']) ? $json['language_name_ar'] : '' );
			$language_name_en = ( isset($json['language_name_en']) ? $json['language_name_en'] : '' );
			$language_book = ( isset($json['language_book']) ? $json['language_book'] : '' );
			$language_sound = ( isset($json['language_sound']) ? $json['language_sound'] : '' );
			$language_flag = ( isset($json['language_flag']) ? $json['language_flag'] : '' );

			$this->title = sprintf( word('translation_in'), $language_name_en.' | '.$language_name_en.' | '.$language_name_ar );
			$this->body_title = sprintf( word('translation_in'), $language_name );
			$this->description = sprintf(word('translation_in'), $language_name.' | '.$language_name_en.' | '.$language_name_ar );
			$this->url = $this->url( array( 'action' => 'translate', 'l' => $l ) );
			$this->image = $language_flag;
			$this->breadcrumb_parent = array(
				array('title' => word('languages'), 'url' => $this->url( array( 'action' => 'languages' ) ))
			);

			$code = '';
			if( !empty($language_book) ){
				$code .= '<div class="quran-file"><a title="'.$language_name.' - '.$language_name_en.' - '.$language_name_ar.'" href="'.$language_book.'"><i class="fas fa-file-pdf"></i> '.word('book_download').' '.sprintf( word('translation_in'), $language_name ).'</a></div>';
			}

			$code .= $this->post_share($language_name.' | '.$this->siteName, $this->url( array( 'action' => 'translate', 'l' => $l ) ));
			$code .= '<div class="row">';
			foreach( $json['data'] as $key => $value ){
				$surah_number = ( isset($value['n']) ? $value['n'] : 0 );
				$surah_name = ( isset($value['name']) ? $value['name'] : '' );
				$surah_count = ( isset($value['ayat']) ? $value['ayat'] : 0 );

				$surah_url = ( $l == 'ar' ? $this->url( array( 'surah' => $surah_number ) ) : $this->url( array( 'action' => 'translate', 'l' => $l, 'surah' => $surah_number ) ) );

				$code .= '<div class="'.$classname.'">';
				$code .= '<div class="spacer">';
				$code .= '<h5><a title="'.word('surah').' '.$surah_name.' - '.word('aya_count').' '.$surah_count.'" href="'.$surah_url.'">'.$surah_number.'- '.$surah_name.'</a></h5>';
				$code .= '</div>';
				$code .= '</div>';
			}
			$code .= '</div>';
		}else{
			$code = ( isset($json['error']) && !empty($json['error']) ? $json['error'] : 'Unknown error' );
		}

		return $code;
	}

	public function translate_view() {
		$lang = $this->get_language();
		$surah_id = ( isset($_GET['surah']) && intval($_GET['surah']) != 0 && intval($_GET['surah']) < 115 ? intval($_GET['surah']) : 1 );
		$reader_id = ( isset($_GET['reader_id']) ? intval($_GET['reader_id']) : $this->default_reader );
		$add_more_trans = '';
		if( $lang == 'en' || $lang == 'en_yusuf_ali' ){
			//$add_more_trans .= ',en_transliteration';
		}

		$sound_folder = $this->sound_folder_aya( $this->default_reader_aya );
		$json = $this->api_surah_loop($surah_id, $lang, true);

		if( $json != false && isset($json['data']) && count($json['data']) > 0 ){
			$count = ( isset($json['count']) ? $json['count'] : 0 );
			$surah_id = ( isset($json['surah_id']) ? $json['surah_id'] : 0 );
			$surah_name = ( isset($json['surah_name']) ? $json['surah_name'] : '' );
			$surah_image = ( isset($json['surah_image']) ? $json['surah_image'] : '' );
			$language_name = ( isset($json[$lang]['language_name']) ? $json[$lang]['language_name'] : '' );
			$language_name_ar = ( isset($json[$lang]['language_name_ar']) ? $json[$lang]['language_name_ar'] : '' );
			$language_name_en = ( isset($json[$lang]['language_name_en']) ? $json[$lang]['language_name_en'] : '' );
			$language_book = ( isset($json[$lang]['language_book']) ? $json[$lang]['language_book'] : '' );
			$language_sound = ( isset($json[$lang]['language_sound']) ? $json[$lang]['language_sound'] : '' );
			$language_found_files = ( isset($json[$lang]['language_found_files']) ? $json[$lang]['language_found_files'] : '' );

			if( empty($language_name) ){
				$language_name = ( isset($json['language_name']) ? $json['language_name'] : '' );
			}
			if( empty($language_name_ar) ){
				$language_name_ar = ( isset($json['language_name_ar']) ? $json['language_name_ar'] : '' );
			}
			if( empty($language_book) ){
				$language_book = ( isset($json['language_name_en']) ? $json['language_name_en'] : '' );
			}
			if( empty($language_name_en) ){
				$language_name_en = ( isset($json['language_book']) ? $json['language_book'] : '' );
			}
			if( empty($language_sound) ){
				$language_sound = ( isset($json['language_sound']) ? $json['language_sound'] : '' );
			}
			if( empty($language_found_files) ){
				$language_found_files = ( isset($json['language_found_files']) ? $json['language_found_files'] : '' );
			}

			if( empty($language_name) ){
				$this->cache_allow_create = false;
				return '<div class="alert alert-danger mt-3 mb-3" role="alert">'.word('no_data').'</div>';
			}

			$reader_menu = '';
			if( $this->allw_readerform ){
				if( empty($language_sound) ){
					$audio_url = $this->home_check_surah($surah_id, $reader_id);
				}else{
					$this->language_sound = true;
					$audio_url = $this->home_check_surah($surah_id, $reader_id, $language_sound);
				}
				$reader_menu .= $this->home_readers_form($surah_id, $lang, $reader_id);
			}

			$player = '<div class="row">';
			$player .= '<div class="col-12">';
			$player .= $this->audio_player($audio_url, 0);
			$player .= '</div>';
			$player .= '</div>';

			if( is_array($language_found_files) && in_array($surah_id, $language_found_files) ){
				$audio_play = $player;
			}else{
				if( !empty($language_sound) && empty($language_found_files) ){
					$audio_play = $player;
				}else{
					$audio_play = '';
				}
			}

			$reader_name = '';
			if( isset($_GET['reader_id']) ){
				$reader_name .= ' | '.$this->reader_name;
			}
			$this->title = word('surah').' '.$surah_name.' | '.$language_name;
			$this->body_title = word('surah').' '.$surah_name;
			$this->description = $surah_name;
			$this->url = $this->url( array( 'action' => 'translate', 'l' => $lang, 'surah' => $surah_id ) );
			$this->image = $surah_image;
			$this->breadcrumb_parent = array(
				array('title' => word('languages'), 'url' => $this->url( array( 'action' => 'languages' ) )),
				array('title' => $language_name, 'url' => $this->url( array( 'action' => 'translate', 'l' => $lang ) ))
			);

			$this->headercode .= '<link rel="stylesheet" type="text/css" href="'.$this->get_theme_folder_url().'/css/mp3-player-button.css">';
			$this->headercode .= '<script type="text/javascript" src="'.$this->get_theme_folder_url().'/js/soundmanager2-nodebug-jsmin.js"></script>';
			$this->headercode .= '<script type="text/javascript" src="'.$this->get_theme_folder_url().'/js/mp3-player-button.js"></script>';

			$share_title = $language_name.' - '.word('surah').' '.$surah_name;

			$surah_list = '';
			$json_all_surah = $this->surah_name( $lang );
			if( $json_all_surah != false && isset($json_all_surah['data']) && count($json_all_surah['data']) > 0 ){
				$surah_list .= '<div class="surah-list">';
				$surah_list .= '<label for="surah_list"><strong>'.word('select_surah').'</strong></label>';
				$surah_list .= '<select class="form-control" name="forma" onchange="location = this.options[this.selectedIndex].value;" id="surah_list">';
				$surah_list .= '<option value="#">'.word('select_surah').'</option>';
				foreach( $json_all_surah['data'] as $keys => $values ){
					$n = ( isset($values['n']) ? $values['n'] : 0 );
					$name = ( isset($values['name']) ? $values['name'] : '' );
					$ayat = ( isset($values['ayat']) ? $values['ayat'] : '' );
					$name_en = ( isset($values['name_en']) ? $values['name_en'] : '' );

					$selected = ( $surah_id == $n ? ' selected' : '' );

					$surah_url = ( $lang == 'ar' ? $this->url( array( 'surah' => $n ) ) : $this->url( array( 'action' => 'translate', 'l' => $lang, 'surah' => $n ) ) );

					$surah_list .= '<option value="'.$surah_url.'" title="'.$name_en.'"'.$selected.'>'.$n.' '.$name.' ['.$ayat.']</option>';
				}
				$surah_list .= '</select>';
				$surah_list .= '</div>';
			}

			$languages_list = '';
			$json_languages = $this->languages();
			if( isset($json_languages['data']) && count($json_languages['data']) > 0 ){
				$languages_list .= '<div class="languages-list">';
				$languages_list .= '<label for="languages_list"><strong>'.word('select_language').'</strong></label>';
				$languages_list .= '<select class="form-control" name="forml" onchange="location = this.options[this.selectedIndex].value;" id="languages_list">';
				$languages_list .= '<option value="#">'.word('select_language').'</option>';
				foreach( $json_languages['data'] as $keyl => $valuel ){
					$langs_id = ( isset($valuel['id']) ? $valuel['id'] : 0 );
					$langs_name = ( isset($valuel['name']) ? $valuel['name'] : '' );
					$langs_name_ar = ( isset($valuel['name_ar']) ? $valuel['name_ar'] : '' );
					$langs_name_en = ( isset($valuel['name_en']) ? $valuel['name_en'] : '' );
					$langs_file = ( isset($valuel['file']) ? $valuel['file'] : '' );
					$langs_book = ( isset($valuel['book']) ? $valuel['book'] : '' );
					$langs_source = ( isset($valuel['source']) ? $valuel['source'] : '' );
					$langs_lang = ( isset($valuel['lang']) ? $valuel['lang'] : '' );
					$langs_flag = ( isset($valuel['flag']) ? $valuel['flag'] : '' );
					$langs_key = ( isset($valuel['key']) ? $valuel['key'] : '' );
					$langs_book_api = ( isset($valuel['book_api']) ? $valuel['book_api'] : '' );

					$selected = ( $lang == $langs_key ? ' selected' : '' );

					$langs_url = ( $langs_key == 'ar' ? $this->url( array( 'surah' => $surah_id ) ) : $this->url( array( 'action' => 'translate', 'l' => $langs_key, 'surah' => $surah_id ) ) );

					$languages_list .= '<option title="'.$langs_name_en.' - '.$langs_name.' - '.$langs_name_ar.'" value="'.$langs_url.'"'.$selected.'>'.$langs_name.'</option>';
				}
				$languages_list .= '</select>';
				$languages_list .= '</div>';
			}

			if( !empty($surah_list) || !empty($languages_list) || !empty($reader_menu) ){
				if( empty($surah_list) && empty($reader_menu) ){
					$get_list = $languages_list;
				}elseif( empty($surah_list) && empty($languages_list) ){
					$get_list = $reader_menu;
				}else{
					if( empty($language_sound) ){
						$get_list = '<div class="row mb-3">';
						$get_list .= '<div class="col-12 col-md-6">';
						$get_list .= $surah_list;
						$get_list .= '</div>';
						$get_list .= '<div class="col-12 col-md-3">';
						$get_list .= $languages_list;
						$get_list .= '</div>';
						$get_list .= '<div class="col-12 col-md-3">';
						$get_list .= $reader_menu;
						$get_list .= '</div>';
						$get_list .= '</div>';
					}else{
						$get_list = '<div class="row mb-3">';
						$get_list .= '<div class="col-12 col-md-6">';
						$get_list .= $surah_list;
						$get_list .= '</div>';
						$get_list .= '<div class="col-12 col-md-6">';
						$get_list .= $languages_list;
						$get_list .= '</div>';
						$get_list .= '</div>';
					}
				}
			}else{
				$get_list = '';
			}

			$code = '';
			$code .= $get_list;
			$code .= $audio_play;
			$code .= '<div id="translateindex">';
			$code .= '<h1>'.$language_name.'</h1>';
			$code .= '<div class="englishtext">'.word('surah').' '.$surah_name.' - '.word('aya_count').' '.$count.'</div>';
			$code .= $this->post_share($share_title, $this->url( array( 'action' => 'translate', 'l' => $lang, 'surah' => $surah_id ) ));

			$n = 0;
			foreach( $json['data'] as $key => $value ){
				$ayah_number = ( isset($value['ayah_number']) ? $value['ayah_number'] : 0 );
				$ayah_text = ( isset($value['ayah_text']) ? $value['ayah_text'] : '' );

				$trans_ayah_trans = ( isset($json['translate'][$lang][$key]) ? $json['translate'][$lang][$key] : '' );

				$trans_ayah_trans_en_transliteration = ( isset($json['translate']['en_transliteration'][$key]) ? $json['translate']['en_transliteration'][$key] : '' );
				++$n;

				if($n==1){ $classname='ayat shadow p-3 mb-5 bg-white border border-light'; }else{ $classname='ayat2 shadow p-3 mb-5 bg-light border-light'; $n=0; }
				$audio_file = $this->sound_check_aya($surah_id, $ayah_number, $sound_folder);
				$listen = ''; //$this->audio_player($audio_file, 0);

				$button = '<div class="listen_aya hvr-bounce-in"><a href="'.$audio_file.'" class="sm2_button" title="Play &quot;coins&quot;"><i class="fa fa-play"></i></a></div>';

				$code .= '<div class="'.$classname.'"><p class="hvr-grow">'.$this->fix_char($ayah_text).' '.$this->ayah_number($ayah_number).'</p> '.$button;
				$code .= '<div class="translate"><p class="hvr-wobble-horizontal">'.$trans_ayah_trans.'</p></div>';
				if( $lang == 'en' ){
					if( !empty($trans_ayah_trans_en_transliteration) ){
						$code .= '<div class="translate border border-info bg-white p-3 rounded-lg"><p class="hvr-grow mb-0">'.$trans_ayah_trans_en_transliteration.'</p></div>';
					}
				}
				$code .= '</div>';
			}
			$code .= "</div>";
		}else{
			$this->cache_allow_create = false;
			$code = ( isset($json['error']) && !empty($json['error']) ? $json['error'] : 'Unknown error' );
		}


		return $code;
	}

	public function book_template( $books = array() ){
		if( is_array($books['books']) && count($books['books']) > 0 ){
			if( isset($_GET['type']) ){
				$type = intval($_GET['type']);
			}else{
				$type = ( isset($books['type']) ? $books['type'] : 0 );
			}

			$books_count = ( isset($books['count']) ? $books['count'] : 0 );

			$books_ar = array();
			foreach( $books['books'] as $key => $value ){
				$book_id = ( isset($value['id']) ? $value['id'] : '' );
				$book_title = ( isset($value['title']) ? $value['title'] : '' );
				$book_excerpt = ( isset($value['excerpt']) ? $value['excerpt'] : '' );
				$book_source_url = ( isset($value['source']) ? $value['source'] : '' );
				$book_url = ( isset($value['url']) ? $value['url'] : '' );
				$book_image = ( isset($value['image']) ? $value['image'] : '' );
				$book_author_id = ( isset($value['author_id']) ? $value['author_id'] : '' );
				$book_author_name = ( isset($value['author_name']) ? $value['author_name'] : '' );
				$book_author_url = ( isset($value['author_url']) ? $value['author_url'] : '' );
				$book_download = ( isset($value['file']) ? $value['file'] : '' );
				$book_publisher = ( isset($value['publisher']) ? $value['publisher'] : '' );
				$book_translator = ( isset($value['translator']) ? $value['translator'] : '' );
				$book_language = ( isset($value['language']) ? $value['language'] : '' );
				$alt = ( isset($value['alt']) ? $value['alt'] : '' );
				$read = ( isset($value['read']) ? $value['read'] : '' );
				$download = ( isset($value['download']) ? $value['download'] : '' );

				if( $type == 1 ){
					$code = '<div class="col-12 col-md-6">';

					$code .= '<div class="card mb-4">';
					$code .= '<div class="row no-gutters">';
					$code .= '<div class="col-12 col-md-3">';
					$code .= '<a href="'.$book_url.'"><img src="'.$book_image.'" class="card-img hvr-wobble-to-bottom-right" alt="'.htmlentities($alt).'" title="'.htmlentities($alt).'"></a>';
					$code .= '</div>';
					$code .= '<div class="col-12 col-md-9">';
					$code .= '<div class="card-body">';
					$code .= '<h2 class="card-title"><a href="'.$book_url.'">'.$book_title.'</a></h2>';
					if( $book_title != $book_excerpt ){
						$code .= '<p class="card-text">'.$book_excerpt.'</p>';
					}
					if( !empty($book_author_name) ){
						$code .= '<div class="card-text" title="'.word('book_author').'"><small class="text-muted hvr-forward"><i class="fas fa-user-edit"></i> <a target="_blank" href="'.$book_author_url.'">'.$book_author_name.'</a></small></div>';
					}
					if( !empty($book_publisher) ){
						$code .= '<div class="card-text" title="'.word('book_publisher').'"><small class="text-muted hvr-forward"><i class="fas fa-globe"></i> '.$book_publisher.'</small></div>';
					}
					if( !empty($book_translator) ){
						$code .= '<div class="card-text" title="'.word('book_translator').'"><small class="text-muted hvr-forward"><i class="fas fa-language"></i> '.$book_translator.'</small></div>';
					}
					$code .= '<div class="card-text" title="'.word('book_read').'"><small class="text-muted hvr-forward"><i class="fab fa-readme"></i> <a target="_blank" href="'.$read.'">'.word('book_read').'</a></small></div>';
					$code .= '<div class="card-text" title="'.word('book_download').'"><small class="text-muted hvr-forward"><i class="fas fa-download"></i> <a target="_blank" href="'.$download.'">'.word('book_download').'</a></small></div>';
					$code .= '<div class="card-text" title="'.word('book_source').'"><small class="text-muted hvr-forward"><i class="fas fa-link"></i> <a target="_blank" href="'.$book_source_url.'">'.word('book_source').'</a></small></div>';
					$code .= '</div>';
					$code .= '</div>';
					$code .= '</div>';
					$code .= '</div>';

					$code .= '</div>';
				}elseif( $type == 2 ){
					$code = '<div class="col-12 col-md-6">';

					$code .= '<div class="card mb-4">';
					$code .= '<div class="row no-gutters">';
					$code .= '<div class="col-12 col-md-3">';
					$code .= '<a href="'.$book_url.'"><img src="'.$book_image.'" class="card-img hvr-wobble-to-bottom-right" alt="'.htmlentities($alt).'" title="'.htmlentities($alt).'"></a>';
					$code .= '</div>';
					$code .= '<div class="col-12 col-md-9">';
					$code .= '<div class="card-body">';
					$code .= '<h2 class="card-title"><a href="'.$book_url.'">'.$book_title.'</a></h2>';
					if( $book_title != $book_excerpt ){
						$code .= '<p class="card-text">'.$book_excerpt.'</p>';
					}
					if( !empty($book_author_name) ){
						$code .= '<div class="card-text" title="'.word('book_author').'"><small class="text-muted hvr-forward"><i class="fas fa-user-edit"></i> <a target="_blank" href="'.$book_author_url.'">'.$book_author_name.'</a></small></div>';
					}
					if( !empty($book_publisher) ){
						$code .= '<div class="card-text" title="'.word('book_publisher').'"><small class="text-muted hvr-forward"><i class="fas fa-globe"></i> '.$book_publisher.'</small></div>';
					}
					if( !empty($book_translator) ){
						$code .= '<div class="card-text" title="'.word('book_translator').'"><small class="text-muted hvr-forward"><i class="fas fa-language"></i> '.$book_translator.'</small></div>';
					}

					$code .= '<div class="row mt-3">';
					$code .= '<div class="col-4 col-md-4 hvr-wobble-top"><a target="_blank" href="'.$read.'" class="btn btn-secondary btn-lg btn-block" title="'.word('book_read').'"><i class="fab fa-readme"></i></a></div>';
					$code .= '<div class="col-4 col-md-4 hvr-float-shadow"><a target="_blank" href="'.$download.'" class="btn btn-secondary btn-lg btn-block" title="'.word('book_download').'"><i class="fas fa-download"></i></a></div>';
					$code .= '<div class="col-4 col-md-4 hvr-grow-rotate"><a target="_blank" href="'.$book_source_url.'" class="btn btn-secondary btn-lg btn-block" title="'.word('book_source').'"><i class="fas fa-link"></i></a></div>';
					$code .= '</div>';

					$code .= '</div>';
					$code .= '</div>';
					$code .= '</div>';
					$code .= '</div>';

					$code .= '</div>';
				}elseif( $type == 3 ){
					$code = '<div class="col-12 col-md-2">';
					$code .= '<div class="card mb-4">';
					$code .= '<div class="book-image">';
					$code .= '<a href="'.$book_url.'"><img src="'.$book_image.'" class="card-img-top hvr-wobble-to-bottom-right" alt="'.htmlentities($alt).'" title="'.htmlentities($alt).'"></a>';
					$code .= '<div class="overlay">';
					$code .= '<div class="overlay-text">';
					$code .= '<h2 class="card-title text-center mb-3"><a title="'.htmlentities($book_excerpt).'" href="'.$book_url.'">'.$book_title.'</a></h2>';
					if( $book_title != $book_excerpt ){
						//$code .= '<p class="card-text">'.$book_excerpt.'</p>';
					}
					if( !empty($book_author_name) ){
						$code .= '<div class="card-text" title="'.word('book_author').'"><small class="text-muted hvr-forward"><i class="fas fa-user-edit"></i> <a target="_blank" href="'.$book_author_url.'">'.$book_author_name.'</a></small></div>';
					}
					if( !empty($book_publisher) ){
						$code .= '<div class="card-text" title="'.word('book_publisher').'"><small class="text-muted hvr-forward"><i class="fas fa-globe"></i> '.$book_publisher.'</small></div>';
					}
					if( !empty($book_translator) ){
						$code .= '<div class="card-text" title="'.word('book_translator').'"><small class="text-muted hvr-forward"><i class="fas fa-language"></i> '.$book_translator.'</small></div>';
					}
					$code .= '<div class="row mt-3">';
					$code .= '<div class="col-4 text-center" title="'.word('book_read').'"><small class="text-muted hvr-forward"><a target="_blank" href="'.$read.'"><i class="fab fa-readme"></i></a></small></div>';
					$code .= '<div class="col-4 text-center" title="'.word('book_download').'"><small class="text-muted hvr-forward"><a target="_blank" href="'.$download.'"><i class="fas fa-download"></i></a></small></div>';
					$code .= '<div class="col-4 text-center" title="'.word('book_source').'"><small class="text-muted hvr-forward"><a target="_blank" href="'.$book_source_url.'"><i class="fas fa-link"></i></a></small></div>';
					$code .= '</div>';

					$code .= '</div>';
					$code .= '</div>';
					$code .= '</div>';
					//$code .= '<div class="card-body">';
					//$code .= '<h2 class="card-title"><a title="'.htmlentities($book_excerpt).'" href="'.$book_url.'">'.$book_title.'</a></h2>';
					//$code .= '</div>';
					$code .= '</div>';
					$code .= '</div>';
				}elseif( $type == 4 ){
					$code = '<div class="col-12 col-md-6">';

					$code .= '<div class="card mb-4">';
					$code .= '<div class="row no-gutters">';
					$code .= '<div class="col-12 col-md-3">';
					$code .= '<a href="'.$book_url.'"><img src="'.$book_image.'" class="card-img hvr-wobble-to-bottom-right" alt="'.htmlentities($alt).'" title="'.htmlentities($alt).'"></a>';
					$code .= '</div>';
					$code .= '<div class="col-12 col-md-9">';
					$code .= '<div class="card-body">';
					$code .= '<h2 class="card-title"><a href="'.$book_url.'">'.$book_title.'</a></h2>';
					if( $book_title != $book_excerpt ){
						$code .= '<p class="card-text">'.$book_excerpt.'</p>';
					}
					if( !empty($book_author_name) ){
						//$code .= '<div class="card-text" title="'.word('book_author').'"><small class="text-muted hvr-forward"><i class="fas fa-user-edit"></i> <a target="_blank" href="'.$book_author_url.'">'.$book_author_name.'</a></small></div>';
						$code .= '<div class="card-text" title="'.word('book_author').'"><small class="text-muted hvr-forward"><i class="fas fa-user-edit"></i> '.$book_author_name.'</small></div>';
					}
					if( !empty($book_publisher) ){
						$code .= '<div class="card-text" title="'.word('book_publisher').'"><small class="text-muted hvr-forward"><i class="fas fa-globe"></i> '.$book_publisher.'</small></div>';
					}
					if( !empty($book_translator) ){
						$code .= '<div class="card-text" title="'.word('book_translator').'"><small class="text-muted hvr-forward"><i class="fas fa-language"></i> '.$book_translator.'</small></div>';
					}
					//$code .= '<div class="card-text" title="'.word('book_read').'"><small class="text-muted hvr-forward"><i class="fab fa-readme"></i> <a target="_blank" href="'.$read.'">'.word('book_read').'</a></small></div>';
					//$code .= '<div class="card-text" title="'.word('book_download').'"><small class="text-muted hvr-forward"><i class="fas fa-download"></i> <a target="_blank" href="'.$download.'">'.word('book_download').'</a></small></div>';
					//$code .= '<div class="card-text" title="'.word('book_source').'"><small class="text-muted hvr-forward"><i class="fas fa-link"></i> <a target="_blank" href="'.$book_source_url.'">'.word('book_source').'</a></small></div>';
					$code .= '</div>';
					$code .= '</div>';
					$code .= '</div>';
					$code .= '</div>';

					$code .= '</div>';
				}else{
					$code = '<div class="col-12 col-md-12">';

					$code .= '<div class="card mb-4">';
					$code .= '<div class="row no-gutters">';
					$code .= '<div class="col-12 col-md-2">';
					$code .= '<a href="'.$book_url.'"><img src="'.$book_image.'" class="card-img hvr-wobble-to-bottom-right" alt="'.htmlentities($alt).'" title="'.htmlentities($alt).'"></a>';
					$code .= '</div>';
					$code .= '<div class="col-12 col-md-10">';
					$code .= '<div class="card-body">';
					$code .= '<h2 class="card-title"><a href="'.$book_url.'">'.$book_title.'</a></h2>';
					if( $book_title != $book_excerpt ){
						$code .= '<p class="card-text">'.$book_excerpt.'</p>';
					}
					if( !empty($book_author_name) ){
						$code .= '<div class="card-text" title="'.word('book_author').'"><small class="text-muted hvr-forward"><i class="fas fa-user-edit"></i> <a target="_blank" href="'.$book_author_url.'">'.$book_author_name.'</a></small></div>';
					}
					if( !empty($book_publisher) ){
						$code .= '<div class="card-text" title="'.word('book_publisher').'"><small class="text-muted hvr-forward"><i class="fas fa-globe"></i> '.$book_publisher.'</small></div>';
					}
					if( !empty($book_translator) ){
						$code .= '<div class="card-text" title="'.word('book_translator').'"><small class="text-muted hvr-forward"><i class="fas fa-language"></i> '.$book_translator.'</small></div>';
					}
					$code .= '<div class="card-text" title="'.word('book_read').'"><small class="text-muted hvr-forward"><i class="fab fa-readme"></i> <a target="_blank" href="'.$read.'">'.word('book_read').'</a></small></div>';
					$code .= '<div class="card-text" title="'.word('book_download').'"><small class="text-muted hvr-forward"><i class="fas fa-download"></i> <a target="_blank" href="'.$download.'">'.word('book_download').'</a></small></div>';
					$code .= '<div class="card-text" title="'.word('book_source').'"><small class="text-muted hvr-forward"><i class="fas fa-link"></i> <a target="_blank" href="'.$book_source_url.'">'.word('book_source').'</a></small></div>';
					$code .= '</div>';
					$code .= '</div>';
					$code .= '</div>';
					$code .= '</div>';

					$code .= '</div>';
				}

				$books_ar[] = $code;
			}

			if( $type == 1 || $type == 2 || $type == 3 || $type == 4 ){
				$output = '<div class="books books-type-'.$type.'">';
				$output .= '<div class="row">';
				foreach( $books_ar as $key2 => $value2 ) {
					$output .= $value2;
				}
				$output .= '</div>';
				$output .= '</div>';
			}else{
				$output = '<div class="books books-0">';
				$output .= '<div class="row">';
				foreach( $books_ar as $key2 => $value2 ) {
					$output .= $value2;
				}
				$output .= '</div>';
				$output .= '</div>';
			}
		}else{
			$output = '<div class="alert alert-danger mt-3 mb-3" role="alert">Not Array</div>';
		}

		return $output;
	}

	public function books_languages(){
		$this->title = word('books');
		$this->description = 'Browse books with over 10,000 books';

		$ml = new MUSLIM_LIBRARY( true );
		$json = $ml->languages();

		if( $json != false && isset($json['data']) && count($json['data']) > 0 ){
			$data = '<div class="books-languages">';
			$data .= '<div class="row">';
			foreach( $json['data'] as $key => $value ){
				$title = ( isset($value['title']) ? $value['title'] : '' );
				$lang = ( isset($value['key']) ? $value['key'] : '' );
				$url = $this->url( array( 'action' => 'books_language', 'name' => $lang ) );
				$flag = ( isset($value['flag']) ? $value['flag'] : '' );
				$books_count = ( isset($value['books_count']) ? $value['books_count'] : 0 );

				$categories = '';
				$categories_button = '';
				if( isset($value['categories']) && is_array($value['categories']) ){
					$categories_button .= '<a href="#category'.$key.'" class="cat" data-bs-toggle="modal" data-bs-target="#category'.$key.'"><i class="far fa-folder-open"></i> '.word('book_categories').'</a>';
					$categories .= '<div class="modal fade" id="category'.$key.'" tabindex="-1" role="dialog" aria-labelledby="category'.$key.'Label" aria-hidden="true">';
					$categories .= '<div class="modal-dialog modal-lg modal-dialog-scrollable" role="document">';
					$categories .= '<div class="modal-content">';
					$categories .= '<div class="modal-header">';
					$categories .= '<h5 class="modal-title" id="category'.$key.'Label"><img src="'.$flag.'" alt="'.$title.'" class="mw-100"> '.$title.' categories</h5>';
					$categories .= '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
					$categories .= '</div>';
					$categories .= '<div class="modal-body">';
					$categories .= '<table class="table table-striped table-hover">';
					$categories .= '<thead class="thead-dark">';
					$categories .= '<tr>';
					$categories .= '<th scope="col">#</th>';
					$categories .= '<th scope="col">'.word('title').'</th>';
					$categories .= '<th scope="col">'.word('books').'</th>';
					$categories .= '</tr>';
					$categories .= '</thead>';
					$categories .= '<tbody>';
					$i=0;
					foreach( $value['categories'] as $key2 => $value2 ){
						$category_id = ( isset($value2['id']) ? $value2['id'] : '' );
						$category_name = ( isset($value2['name']) ? $value2['name'] : '' );
						$category_url = $this->siteurl.'/index.php?action=books_category&category_id='.$category_id;
						$category_count = ( isset($value2['books_count']) ? $value2['books_count'] : 0 );
						++$i;

						$categories .= '<tr>';
						$categories .= '<th scope="row">'.$i.'</th>';
						$categories .= '<td class="categories"><a href="'.$category_url.'">'.$category_name.'<a/></td>';
						$categories .= '<td>'.$category_count.'</td>';
						$categories .= '</tr>';
					}
					$categories .= '</tbody>';
					$categories .= '</table>';
					$categories .= '</div>';
					$categories .= '<div class="modal-footer">';
					$categories .= '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>';
					$categories .= '</div>';
					$categories .= '</div>';
					$categories .= '</div>';
					$categories .= '</div>';
				}

				$data .= '<div class="col-12 col-sm-4 col-md-4 col-lg-3 language-loop-bg">';
				$data .= '<div class="language-loop">';
				$data .= '<div class="language-flag hvr-bounce-in"><a href="'.$url.'"><img src="'.$flag.'" alt="'.$title.' books" title="'.$title.' books" class="mw-100"></a></div>';
				$data .= '<h1><a href="'.$url.'" title="'.$title.' books">'.$title.'</a></h1>';
				$data .= '<div class="language-count"><span><i class="far fa-file-pdf"></i> '.$books_count.'</span> '.$categories_button.'</div>';
				$data .= '</div>';
				$data .= $categories;
				$data .= '</div>';
			}
			$data .= '</div>';
			$data .= '</div>';
		}else{
			$error = ( isset($json['error']) ? $json['error'] : ( isset($json['msg']) ? $json['msg'] : word('no_data') ) );
			$data = '<div class="alert alert-danger mt-3 mb-3" role="alert">'.$error.'</div>';
		}
		return $data;
	}

	public function books_language(){
		$language_name = ( isset($_GET['name']) ? strip_tags(ucfirst($_GET['name'])) : '' );
		$ml = new MUSLIM_LIBRARY( true );
		$json = $ml->language( $language_name );

		if( $json != false && !isset($json['error']) ){
			$data = '<div class="languages">';

			$id = ( isset($json['id']) ? $json['id'] : 0 );
			$title = ( isset($json['title']) ? $json['title'] : '' );
			$url = ( isset($json['url']) ? $json['url'] : '' );
			$flag = ( isset($json['flag']) ? $json['flag'] : '' );
			$locale = ( isset($json['locale']) ? $json['locale'] : '' );
			$books_count = ( isset($json['books_count']) ? $json['books_count'] : 0 );
			$books_data = ( isset($json['books_data']) ? $json['books_data'] : '' );

			$this->book_parent = $language_name;
			$this->is_rtl( $language_name );

			$limit = 30;
			$page = (int) (!isset($_GET["page"]) ? 1 : $_GET["page"]);
		  $page = ($page == 0 ? 1 : $page);
		  $perpage = $limit;
		  $startpoint = ($page * $perpage) - $perpage;
			$start = ($startpoint + $limit);

			$lastpage = ceil($books_count / $perpage);

			if( empty($title) || $page > $lastpage ){
				$this->cache_allow_create = false;
				return '<div class="alert alert-danger mt-3 mb-3" role="alert">'.word('no_data').'</div>';
			}

			$this->title = word('books_in').' '.$title;
			$this->description = word('books_in').' '.$title.' '.word('contains').' '.$books_count.' '.word('books');
			$this->url = $this->url( array( 'action' => 'books_language', 'name' => $language_name ) );
			$this->image = $flag;

			$this->breadcrumb_parent = array(
				array('title' => word('books'), 'url' => $this->url( array( 'action' => 'books' ) ) )
			);

			$books = '';

			$books_arr = array();
			$books_text = '';
			if( is_array($books_data) ){
				for( $x=$startpoint; $x < $start; ++$x ){
					$valueb = ( isset($books_data[$x]) ? $books_data[$x] : '' );
					if( !empty($valueb) ){
						$books_arr[] = $valueb;
						$books_text .= $valueb.',';
					}
				}

				$info = array();
				$info['type'] = 1;
				$json_books = $ml->books( rtrim($books_text, ',') );
				foreach ($json_books['data'] as $key3 => $value3) {
					$book_title = ( isset($value3['title']) ? $value3['title'] : '' );
					$book_id = ( isset($value3['id']) ? $value3['id'] : '' );
					$book_excerpt = ( isset($value3['excerpt']) ? $value3['excerpt'] : '' );
					$book_source_url = ( isset($value3['url']) ? $value3['url'].'?lang='.$language_name : '' );
					$book_url = $this->url( array( 'action' => 'book', 'book_id' => $book_id ) );
					$book_image = ( isset($value3['image']) ? $value3['image'] : '' );
					$book_author_id = ( isset($value3['author_id']) ? $value3['author_id'] : '' );
					$book_author_name = ( isset($value3['author_name']) ? $value3['author_name'] : '' );
					$book_download = ( isset($value3['book_url']) ? $value3['book_url'] : '' );
					$book_publisher = ( isset($value3['publisher']) ? $value3['publisher'] : '' );
					$book_translator = ( isset($value3['translator']) ? $value3['translator'] : '' );

					$alt = $book_title;
					if( $book_title != $book_excerpt ){
						$alt .= "\n";
						$alt .= $book_excerpt;
					}
					if( !empty($book_author_name) ){
						$alt .= "\n";
						$alt .= $book_author_name;
					}

					$info['books'][] = array(
						'id' => $book_id,
						'title' => $book_title,
						'excerpt' => $book_excerpt,
						'source' => $book_source_url,
						'url' => $book_url,
						'image' => $book_image,
						'alt' => $alt,
						'author_id' => $book_author_id,
						'author_name' => $book_author_name,
						'author_url' => 'https://www.muslim-library.com/books-author/?author_id='.$book_author_id.'&lang='.$language_name,
						'file' => $book_download,
						'publisher' => $book_publisher,
						'translator' => $book_translator,
						'language' => $language_name,
						'read' => $book_source_url.'&read_id='.$book_id,
						'download' => $book_source_url.'&download_id='.$book_id
					);

				}

				$pagination_url = $this->url( array( 'action' => 'books_language', 'name' => $language_name, 'page' => $page ) );
				$pagination = pagination( $books_count, $perpage, $page, $pagination_url );

				$books = $pagination;
				$books .= $this->book_template( $info );
				$books .= $pagination;
			}

			if( isset($json['categories']['status']) && $json['categories']['status'] == 'error' ){
				$categories = '';
				$categories_button = '';
				$categories_count = '';
			}else{
				$categories = '';
				$categories_button = '';
				$categories_count = '';

				if( isset($json['categories']) && is_array($json['categories']) && count($json['categories']) > 0 ){
					$categories_count = '<span class="cat">'.count($json['categories']).'</span>';
					$categories_button .= '<a href="#category'.$id.'" class="cat" data-bs-toggle="modal" data-bs-target="#category'.$id.'"><i class="far fa-folder-open"></i> '.word('book_categories').'</a>';
					$categories .= '<div class="modal fade" id="category'.$id.'" tabindex="-1" role="dialog" aria-labelledby="category'.$id.'Label" aria-hidden="true">';
					$categories .= '<div class="modal-dialog modal-lg modal-dialog-scrollable" role="document">';
					$categories .= '<div class="modal-content">';
					$categories .= '<div class="modal-header">';
					$categories .= '<h5 class="modal-title" id="category'.$id.'Label"><img src="'.$flag.'" alt="'.$title.'" class="mw-100"> '.$title.'</h5>';
					$categories .= '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';

					$categories .= '</div>';
					$categories .= '<div class="modal-body">';
					$categories .= '<table class="table table-striped table-hover">';
					$categories .= '<thead class="thead-dark">';
					$categories .= '<tr>';
					$categories .= '<th scope="col">#</th>';
					$categories .= '<th scope="col">'.word('title').'</th>';
					$categories .= '<th scope="col">'.word('books').'</th>';
					$categories .= '</tr>';
					$categories .= '</thead>';
					$categories .= '<tbody>';
					$i=0;
					foreach( $json['categories'] as $key2 => $value2 ){
						$category_id = ( isset($value2['id']) ? $value2['id'] : '' );
						$category_name = ( isset($value2['name']) ? $value2['name'] : '' );
						$category_url = $this->url( array( 'action' => 'books_category', 'category_id' => $category_id ) );
						$category_count = ( isset($value2['books_count']) ? $value2['books_count'] : 0 );
						++$i;

						$categories .= '<tr>';
						$categories .= '<th scope="row">'.$i.'</th>';
						$categories .= '<td class="categories"><a href="'.$category_url.'">'.$category_name.'<a/></td>';
						$categories .= '<td>'.$category_count.'</td>';
						$categories .= '</tr>';
					}
					$categories .= '</tbody>';
					$categories .= '</table>';
					$categories .= '</div>';
					$categories .= '<div class="modal-footer">';
					$categories .= '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">close</button>';
					$categories .= '</div>';
					$categories .= '</div>';
					$categories .= '</div>';
					$categories .= '</div>';
				}
			}

			$data .= '<div class="language-loop">';
			$data .= '<div class="language-flag"><a href="'.$url.'"><img src="'.$flag.'" alt="'.$title.' books" title="'.$title.' books" class="mw-100"></a></div>';
			$data .= '<h1><a href="'.$url.'" title="'.$title.' books">'.$title.'</a></h1>';
			$data .= '<div class="language-count"><span><i class="far fa-file-pdf"></i> '.$books_count.'</span>'.$categories_button.'</div>';
			$data .= '</div>';
			$data .= $books;
			$data .= $categories;

			$data .= '</div>';
		}else{
			$this->cache_allow_create = false;
			$error = ( isset($json['error']) ? $json['error'] : ( isset($json['msg']) ? $json['msg'] : word('no_data') ) );
			$data = '<div class="alert alert-danger mt-3 mb-3" role="alert">'.$error.'</div>';
		}
		return $data;
	}

	public function books_category(){
		$category_id = ( isset($_GET['category_id']) ? intval($_GET['category_id']) : 0 );
		$ml = new MUSLIM_LIBRARY( true );
		$json = $ml->category( $category_id );

		$books = '';
		if( $json != false && !isset($json['error']) ){

			$id = ( isset($json['id']) ? $json['id'] : 0 );
			$title = ( isset($json['title']) ? $json['title'] : '' );
			$description = ( isset($json['category_description']) ? $json['category_description'] : '' );
			$books_count = ( isset($json['books_count']) ? $json['books_count'] : 0 );
			$books_data = ( isset($json['books_data']) ? $json['books_data'] : '' );
			$parent_id = ( isset($json['parent_id']) ? $json['parent_id'] : '' );
			$parent_key = ( isset($json['parent_key']) ? $json['parent_key'] : '' );
			$parent_name = ( isset($json['parent_name']) ? $json['parent_name'] : '' );
			$parent_flag = ( isset($json['parent_flag']) ? $json['parent_flag'] : '' );
			$parent_url = $this->url( array( 'action' => 'books_language', 'name' => $parent_key ) );

			$limit = 30;
			$page = (int) (!isset($_GET["page"]) ? 1 : $_GET["page"]);
		  $page = ($page == 0 ? 1 : $page);
		  $perpage = $limit;
		  $startpoint = ($page * $perpage) - $perpage;
			$start = ($startpoint + $limit);

			$lastpage = ceil($books_count / $perpage);
			if( empty($title) || $page > $lastpage ){
				$this->cache_allow_create = false;
				return '<div class="alert alert-danger mt-3 mb-3" role="alert">'.word('no_data').'</div>';
			}

			$this->title = $title;
			$this->description = ( empty($description) ? word('books_in').' '.$title.' '.word('contains').' '.$books_count.' '.word('books') : $description );
			$this->url = $this->url( array( 'action' => 'books_category', 'category_id' => $category_id ) );
			$this->image = $parent_flag;

			$this->book_parent = $parent_key;

			$this->is_rtl( $parent_key );

			$this->breadcrumb_parent = array(
				array('title' => word('books'), 'url' => $this->url( array( 'action' => 'books' ) ) ),
				array('title' => $parent_name, 'url' => $this->url( array( 'action' => 'books_language', 'name' => $parent_key ) ) ),
			);

			$books_arr = array();
			$books_text = '';
			if( is_array($books_data) ){
				for( $x=$startpoint; $x < $start; ++$x ){
					$valueb = ( isset($books_data[$x]) ? $books_data[$x] : '' );
					if( !empty($valueb) ){
						$books_arr[] = $valueb;
						$books_text .= $valueb.',';
					}
				}

				$info = array();
				$info['type'] = 1;
				$json_books = $ml->books( rtrim($books_text, ',') );
				foreach ($json_books['data'] as $key3 => $value3) {
					$book_id = ( isset($value3['id']) ? $value3['id'] : '' );
					$book_title = ( isset($value3['title']) ? $value3['title'] : '' );
					$book_excerpt = ( isset($value3['excerpt']) ? $value3['excerpt'] : '' );
					$book_source_url = ( isset($value3['url']) ? $value3['url'].'?lang='.$parent_key : '' );
					$book_url = $this->url( array( 'action' => 'book', 'book_id' => $book_id ) );
					$book_image = ( isset($value3['image']) ? $value3['image'] : '' );
					$book_author_id = ( isset($value3['author_id']) ? $value3['author_id'] : '' );
					$book_author_name = ( isset($value3['author_name']) ? $value3['author_name'] : '' );
					$book_download = ( isset($value3['book_url']) ? $value3['book_url'] : '' );
					$book_publisher = ( isset($value3['publisher']) ? $value3['publisher'] : '' );
					$book_translator = ( isset($value3['translator']) ? $value3['translator'] : '' );

					$alt = $book_title;
					if( $book_title != $book_excerpt ){
						$alt .= "\n";
						$alt .= $book_excerpt;
					}
					if( !empty($book_author_name) ){
						$alt .= "\n";
						$alt .= $book_author_name;
					}

					$info['books'][] = array(
						'id' => $book_id,
						'title' => $book_title,
						'excerpt' => $book_excerpt,
						'source' => $book_source_url,
						'url' => $book_url,
						'image' => $book_image,
						'alt' => $alt,
						'author_id' => $book_author_id,
						'author_name' => $book_author_name,
						'author_url' => 'https://www.muslim-library.com/books-author/?author_id='.$book_author_id.'&lang='.$parent_key,
						'file' => $book_download,
						'publisher' => $book_publisher,
						'translator' => $book_translator,
						'language' => $parent_key,
						'read' => $book_source_url.'&read_id='.$book_id,
						'download' => $book_source_url.'&download_id='.$book_id
					);

				}

				$pagination_url = $this->url( array( 'action' => 'books_category', 'category_id' => $category_id, 'page' => $page ) );
				$pagination = pagination( $books_count, $perpage, $page, $pagination_url );

				$books = $pagination;
				$books .= $this->book_template( $info );
				$books .= $pagination;
			}

			$data = '<div class="category-books">';
			$data .= '<div class="alert alert-primary mt-0 mb-4" role="alert">'.$title.' '.$books_count.' '.word('books').'</div>';
			$data .= $books;
			$data .= '</div>';
		}else{
			$this->cache_allow_create = false;
			$error = ( isset($json['error']) ? $json['error'] : ( isset($json['msg']) ? $json['msg'] : word('no_data') ) );
			$data = '<div class="alert alert-danger mt-3 mb-3" role="alert">'.$error.'</div>';
		}
		return $data;
	}

	public function book(){
		$book_id = ( isset($_GET['book_id']) ? intval($_GET['book_id']) : 0 );
		$ml = new MUSLIM_LIBRARY( true );
		$json = $ml->book( $book_id );

		if( $json != false && !isset($json['error']) && isset($json['info'][0]) ){
			$json_info = $json['info'][0];

			$language_id = ( isset($json_info['language_id']) ? $json_info['language_id'] : 0 );
			$language_name = ( isset($json_info['name']) ? $json_info['name'] : '' );
			$language_key = ( isset($json_info['language']) ? $json_info['language'] : '' );

			$categories = ( isset($json_info['categories']) ? $json_info['categories'] : '' );
			$category_name = ( isset($categories[0]['name']) ? $categories[0]['name'] : '' );
			$category_description = ( isset($categories[0]['description']) ? $categories[0]['description'] : '' );
			$category_category_id = ( isset($categories[0]['category_id']) ? $categories[0]['category_id'] : '' );

			$this->is_rtl = false;
			$this->default_language = 'en';
			$this->is_rtl( $language_key );
			$this->book_parent = $language_key;

			$value3 = $json['data'];
			$book_title = ( isset($value3['title']) ? $value3['title'] : '' );
			$book_excerpt = ( isset($value3['excerpt']) ? $value3['excerpt'] : '' );
			$book_url = ( isset($value3['url']) ? $value3['url'].'?lang='.$language_key : '' );
			$book_image = ( isset($value3['image']) ? $value3['image'] : '' );
			$book_author_id = ( isset($value3['author_id']) ? $value3['author_id'] : '' );
			$book_author_name = ( isset($value3['author_name']) ? $value3['author_name'] : '' );
			$book_download = ( isset($value3['book_url']) ? $value3['book_url'] : '' );
			$book_publisher = ( isset($value3['publisher']) ? $value3['publisher'] : '' );
			$book_translator = ( isset($value3['translator']) ? $value3['translator'] : '' );

			$alt = $book_title;
			if( $book_title != $book_excerpt ){
				$alt .= "\n";
				$alt .= $book_excerpt;
			}
			if( !empty($book_author_name) ){
				$alt .= "\n";
				$alt .= $book_author_name;
			}

			$this->breadcrumb_parent = array(
				array( 'title' => word('books'), 'url' => $this->url( array( 'action' => 'books' ) ) ),
				array( 'title' => $language_name, 'url' => $this->url( array( 'action' => 'books_language', 'name' => strip_tags($language_key) ) ) ),
				array( 'title' => $category_name, 'url' => $this->url( array( 'action' => 'books_category', 'category_id' => $category_category_id ) ) )
			);

			$this->title = $book_title;
			$this->description = $book_excerpt;
			$this->url = $this->url( array( 'action' => 'book', 'book_id' => $book_id ) );
			$this->image = $book_image;
			$this->language = $language_key;
			$this->author = $book_author_name;
			$this->publisher = $book_publisher;

			$books = '<div class="books">';
			$books .= '<div class="row">';

			$books .= '<div class="col-12 col-md-12">';

			$books .= '<div class="card mb-4">';
			$books .= '<div class="row no-gutters">';
			$books .= '<div class="col-12 col-md-3">';
			$books .= '<img src="'.$book_image.'" class="card-img" alt="'.htmlentities($alt).'" title="'.htmlentities($alt).'">';
			$books .= '</div>';
			$books .= '<div class="col-12 col-md-9">';
			$books .= '<div class="card-body">';
			$books .= '<h1 class="card-title">'.$book_title.'</h1>';
			if( $book_title != $book_excerpt ){
				$books .= '<p class="card-text">'.$book_excerpt.'</p>';
			}
			if( !empty($book_author_name) ){
				$books .= '<div class="card-text" title="'.word('book_author').'"><small class="text-muted"><i class="fas fa-user-edit"></i> <a target="_blank" href="https://www.muslim-library.com/books-author/?author_id='.$book_author_id.'&lang='.$language_key.'">'.$book_author_name.'</a></small></div>';
			}
			if( !empty($book_publisher) ){
				$books .= '<div class="card-text" title="'.word('book_publisher').'"><small class="text-muted"><i class="fas fa-globe"></i> '.$book_publisher.'</small></div>';
			}
			if( !empty($book_translator) ){
				$books .= '<div class="card-text" title="'.word('book_translator').'"><small class="text-muted"><i class="fas fa-language"></i> '.$book_translator.'</small></div>';
			}
			$books .= '<div class="row mt-3">';
			$books .= '<div class="col-4 col-md-4 hvr-float-shadow text-center"><a target="_blank" href="'.$book_url.'&read_id='.$book_id.'" class="btn btn-success btn-lg" title="'.word('book_read').'"><i class="fab fa-readme"></i></a></div>';
			$books .= '<div class="col-4 col-md-4 hvr-float-shadow text-center"><a target="_blank" href="'.$book_url.'&download_id='.$book_id.'" class="btn btn-warning btn-lg" title="'.word('book_download').'"><i class="fas fa-download"></i></a></div>';
			$books .= '<div class="col-4 col-md-4 hvr-float-shadow text-center"><a target="_blank" href="'.$book_url.'" class="btn btn-primary btn-lg" title="'.word('book_source').'"><i class="fas fa-link"></i></a></div>';
			$books .= '</div>';

			$books .= '</div>';
			$books .= '</div>';
			$books .= '</div>';
			$books .= '</div>';

			$books .= '</div>';
			$books .= '</div>';
			$books .= '</div>';

			$data = $books;
		}else{
			$error = ( isset($json['error']) ? $json['error'] : ( isset($json['msg']) ? $json['msg'] : word('no_data') ) );
			$data = '<div class="alert alert-danger mt-3 mb-3" role="alert">'.$error.'</div>';
		}
		return $data;
	}

	public function for_sale(){
		$this->title = 'موقع القرآن الكريم للجميع للبيع';
		$this->url = $this->url( array( 'action' => 'for_sale' ) );

		$output = '<div class="for-sale">';
		$output .= '<div class="alert alert-primary mt-3 mb-3" role="alert">بعد كثرة الرسائل التي وصلتني عن صرف النظر عن بيعه فقد تم صرف النظر عن بيع الموقع وجزى الله خير الجزاء من راسلنا وناشدنا ونصحنا وبارك الله بكم</div>';
		/*
		$output .= '<p><img src="'.$this->siteurl.'/images/for-sale.jpg" class="w-100" alt="'.htmlentities($this->title).'" title="'.htmlentities($this->title).'"></p>';
		$output .= '<p>بسم الله والحمدلله والصلاة والسلام على رسول الله</p>';
		$output .= '<p>موقع <a href="http://www.quran-for-all.com">Quran For All</a> يقدم خدمة نشر كتاب الله وترجمة معاني القرآن الكريم للكثير من اللغات وأيضا يحتوي على عدة تفاسير للقرآن الكريم وكتب بأكثر من 100 لغة وجدير بالذكر أن الموقع يعمل منذ ما يقارب ثمان سنوات.</p>';
		$output .= '<p>بفضل الله عز وجل زيارات الموقع عالية تتراوح ما بين 2000 إلى 3800 زائر يوميا وصفحات الموقع موزعة في محركات البحث ومواقع التواصل الإجتماعي والكثير من مواقع الشبكة العنكبوتية.</p>';
		$output .= '<p>الموقع يقوم بتطوير سكربت القرآن الكريم للجميع بشكل دوري ويتم إنزال النسخة الجديدة للجميع للاستفادة منها حتى وصلنا إلى آخر إصدار وهو الإصدار الرابع ويعمل حاليا فقط على الموقع ولم يتم نشره حتى الآن.</p>';
		$output .= '<p>في هذه النسخة الجديدة طورنا برمجيات API بإمكان مطوري لغات البرمجة الإستفادة منها في برمجة تطبيقات أو مواقع أو أي أفكار أخرى كما تم زيادة عدد الكتب المرفقة مع السكربت إلى أكثر من 10000 كتاب مقسمة على أكثير من 100 لغة.</p>';
		$output .= '<p>كل هذه الزيارات والإنتشار الواسع للسكربت يعمل على استهلاك موارد الموقع وتأتينا تنبيها أحيانا من المستضيف بأن الموقع أصبح يستهلك موارد السيرفر بشكل أكبر ويجب ترقية خطة الإستضافة ولكننا نعمل على تقليل الإستهلاك أحيانا برمجيا دون دفع تكاليف أخرى وأحيانا لا تفلح تلك المحاولات.</p>';
		$output .= '<p>وأيضا أسباب أخرى مادية بحته وعدم التفرغ للموقع من الأسباب الرئيسية لعرض الموقع للبيع</p>';
		$output .= '<p>وإليكم بعض الإحصاءات الخاصة بالموقع عن طريق Google Analytics</p>';
		$output .= '<p><img src="'.$this->siteurl.'/images/google-analytics-001.jpg" class="w-100 border shadow" alt="google-analytics-001"></p>';
		$output .= '<p><img src="'.$this->siteurl.'/images/google-analytics-002.jpg" class="w-100 border shadow" alt="google-analytics-002"></p>';
		$output .= '<p><img src="'.$this->siteurl.'/images/google-analytics-003.jpg" class="w-100 border shadow" alt="google-analytics-003"></p>';
		$output .= '<p><img src="'.$this->siteurl.'/images/google-analytics-004.jpg" class="w-100 border shadow" alt="google-analytics-004"></p>';
		$output .= '<p><img src="'.$this->siteurl.'/images/google-analytics-005.jpg" class="w-100 border shadow" alt="google-analytics-005"></p>';
		$output .= '<p class="mt-4">معلومات عن الموقع:</p>';
		$output .= '<ul>
		<li>عنوان الموقع https://www.quran-for-all.com</li>
		<li>مستضيف الموقع https://www.bluehost.com</li>
		<li>تاريخ إنتهاء الإستضافة 09/2024</li>
		<li>المالك: أحمد العنزي</li>
		<li>البريد الإلكتروني: <a href="mailto:nwahycom@gmail.com">nwahycom@gmail.com</a></li>
		<li>هاتف المالك <a href="tel:+96550885155">0096550885155</a></li>
		<li>الواتساب <a href="https://api.whatsapp.com/send?phone=0096550885155">0096550885155</a></li>
		<li>السعر يرسل عن طريق وسائل الإتصال ولم نقدر سعر للموقع حتى الآن</li>
		</ul>';
		$output .= '<p>لأي استفسار عن الموقع نرجو التواصل عن طريق الإتصال مباشرة أو عن طريق البريد الإلكتروني أو عن طريق الواتساب</p>';
		$output .= '<p></p>';
		$output .= '<p></p>';
		$output .= '<p></p>';
		$output .= '<p></p>';
		$output .= '<p></p>';
		*/
		$output .= '</div>';

		return $this->tpl_content($this->title, $output);
	}

	public function about_script(){
		$this->title = 'تحميل سكربت القرآن الكريم للجميع الإصدار 5';
		$this->url = $this->url( array( 'action' => 'about_script' ) );

		$output = '<div class="for-sale">';
		//$output .= '<p><img src="'.$this->siteurl.'/images/for-sale.jpg" class="w-100" alt="'.htmlentities($this->title).'" title="'.htmlentities($this->title).'"></p>';
		$output .= '<p>بسم الله والحمدلله والصلاة والسلام على رسول الله</p>';
		$output .= '<p>من نعم الله علينا أن يسر لنا العمل في برمجيات تنفعنا في الدارين بإذن الله</p>';
		$output .= '<p>هذا هو سكربت القرآن الكريم للجميع الإصدار 5 بحلة جديدة وميزات كثيرة وتقنيات جديدة</p>';
		$output .= '<p>السكربت مر بالكثير من المراحل والتطويرات حتى وصلنا لهذا الإصدار وجدير بالذكر أن التطويرات كانت على مدى ثمانية سنوات وبفضل الله عز وجل لاقى السكربت استحسان الكثير من أصحاب المواقع وانتشر انتشارا واسعا.</p>';

		$output .= '<h3 class="mt-4 text-primary">ميزات السكربت</h3>';
		$output .= '<ul>
		<li>القرآن الكريم كاملا مقروء ومسموع</li>
		<li>القرآن الكريم مقسم آية آية مع إمكانية سماع الآية لوحدها أو السورة كاملة</li>
		<li>إمكانية الاستماع للسورة بصوت الكثير من القراء</li>
		<li>إمكانية التنقل بين السور والآيات وتغيير القاريء بكل سهولة</li>
		<li>حاصية تتبع مسار الرابط ما يعرف بالـ breadcrumb</li>
		<li>إمكانية مشاركة السورة أو آية أو تفسير وخلافها</li>
		<li>يحتوى على عدة تفاسير</li>
		<li>يحتوى على الكثير من ترجمات معاني القرآن الكريم</li>
		<li>يحتوي على أكثر من 10000 كتاب موزعة على لغات الكتب</li>
		<li>سهل الاستخدام وسريع التصفح</li>
		<li>متوافق مع جميع الشاشات</li>
		</ul>';
		$output .= '<h3 class="mt-4 text-success">الميزات الجديدة</h3>';
		$output .= '<ul>
		<li>إضافة ميزة Open Graph Meta Tags لترتيب البيانات وعرضها في مواقع التواصل الإجتماعي ومحركات البحث</li>
		<li>إضافة ميزة canonical</li>
		<li>إضافة ميزة schema الخاصة بتنظيم البيانات</li>
		<li>استخدام bootstrap الإصدار الأحدث</li>
		<li>استخدام fontawesome الإصدار الأحدث</li>
		<li>تحسين SEO السكربت</li>
		<li>تغيير الثيم</li>
		<li>إضافة واجة تطبيقات JSON API بالإمكان ربط السكربت بتطبيقات الهواتف الذكية</li>
		<li>تحسن أداء السكربت من حيث السرعة والاستجابة</li>
		</ul>';
		$output .= '<h3 class="mt-4 text-primary">متطلبات السكربت</h3>';
		$output .= '<ul>
		<li>إصدار php 7 فما فوق</li>
		</ul>';

		$output .= '<h3 class="mt-4 text-danger">التركيب</h3>';
		$output .= '<ul>
		<li>حمل السكربت</li>
		<li>فك الضغط أو ارفع الملف المضغوط إلى موقعك ثم فك الضغط</li>
		<li>أدخل على مجلد السكربت من خلال المتصفح</li>
		</ul>';

		$output .= '<iframe style="width: 100%; max-width: 560px; min-height: 315px; margin: 0 auto;" src="https://www.youtube.com/embed/083h9ZRI8Aw?si=k73nKoJ3mjc-NYUP" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';

		$output .= '<h3 class="mt-4 text-danger">ملاحظات</h3>';
		$output .= '<ul>
		<li>جميع الملفات الصوتية يتم استدعاؤها من الخارج وغير مرفقة مع السكربت</li>
		<li>جميع ملفات الكتب والأغلفة عن طريق موقع <a target="_blank" href="https://www.muslim-library.com">المكتبة الإسلامية الإسلامية الإلكترونية الشاملة</a></li>
		<li>السكربت كان مدفوعا وليس مجانيا منذ العام 2019 أما الآن في تاريخ 29/8/2023 سيكون مجانا للجميع ونسأل الله أن يغنينا من فضله ويبارك لنا ويكون هذا العمل خالصا لوجهه الكريم</li>
		<li>مسار الـ API الخاص بالسكربت كالتالي http://yoursite/api/quran/?action=surah</li>
		<li>حجم السكربت كاملا تقريبا 200 ميغابايت</li>
		</ul>';

		$output .= '<h3 class="mt-4 text-success">تحميل السكربت</h3>';
		$output .= '<p><a class="btn btn-primary" target="_blank" href="https://www.quran-for-all.com/download/quranforall-V5.zip" role="button"><i class="fas fa-download"></i> تحميل</a></p>';

		$output .= '<p>والله الموفق</p>';
		$output .= '</div>';

		return $this->tpl_content($this->title, $output);
	}

	public function tpl_check($filename=""){
		$full_path = $this->get_theme_folder().'/'.$filename;

		$report = '';
		$error = 0;
		if( !file_exists($this->get_theme_folder()) ){
			$report .= '<div style="text-align:center;">FOLDER TEMPLATES <b>'.$this->get_theme_folder().'</b> NOT FOUND</div>';
			$error = 1;
		}

		if( !file_exists($full_path) ){
			$report .= '<div style="text-align:center;">FILE TEMPLATE '.strip_tags($filename).' NOT FOUND INSIDE FOLDER '.$this->get_theme_folder().'</div>';
			$error = 1;
		}

		if($error == 1){
			return $report;
		}else{
			return $error;
		}
	}

	public Function shortcode_callback($m) {
		return word($m[1]);
	}

	public Function shortcode($text){
		$reg = "/LANG\[([0-9a-z_]*?)\]/";
		if( empty($text) ){
			$out = $text;
		}else{
			//$out = preg_replace_callback( $reg, "self::shortcode_callback", $text );
			$out = preg_replace_callback($reg, array($this, 'shortcode_callback'), $text);
		}
		return $out;
	}

	public function get_php_version(){
		$code = phpversion();
		return $code;
	}

	public function tpl_header(){
		$filename = 'header.htm';
		if($this->tpl_check($filename) == 0){
			$full_path = $this->get_theme_folder().'/'.$filename;
			$writefile = fopen($full_path,"r");
			$read = fread($writefile,filesize($full_path));
			if( !empty($this->headertext) ){
				$read = str_replace('q-col-header col-md-12 text-center', 'q-col-header col-12 col-md-4', $read);
			}
			$code = $this->tpl_replace($read);
			fclose ($writefile);
		}else{
			$code = $this->tpl_check($filename);
		}
		return $code;
	}

	public function tpl_footer(){
		$filename = 'footer.htm';
		if($this->tpl_check($filename) == 0){
			$full_path = $this->get_theme_folder().'/'.$filename;
			$writefile = fopen($full_path,"r");
			$read = fread($writefile,filesize($full_path));
			$code = $this->tpl_replace($read);
			fclose ($writefile);
		}else{
			$code = $this->tpl_check($filename);
		}
		return $code;
	}

	public function tpl_content($title, $content){
		$filename = 'content.htm';
		if($this->tpl_check($filename) == 0){
			$full_path = $this->get_theme_folder().'/'.$filename;
			$writefile = fopen($full_path,"r");
			$read = fread($writefile,filesize($full_path));
			$code = str_replace(array('{title}', '{content}', '{style}'), array($title, $content, $this->get_theme_folder_url()), $read);
			fclose ($writefile);
		}else{
			$code = $this->tpl_check($filename);
		}
		return $code;
	}

	public function Template_view($right="", $left=""){
		$code = $this->tpl_header();
		$code .= $this->get_breadcrumb();
		$code .= '<div class="row">';
		$code .= '<div class="col-md-8">';
		$code .= $right;
		$code .= '</div>';
		$code .= '<div class="col-md-4">';
		$code .= $left;
		$code .= '</div>';
		$code .= '</div>';
		$code .= $this->tpl_footer();
		return $code;
	}

	public function Template_view_full($content){
		$code = $this->tpl_header();
		$code .= $this->get_breadcrumb();
		$code .= $content;
		$code .= $this->tpl_footer();
		return $code;
	}

	public function output(){
		$action = ( isset($_GET['action']) ? $_GET['action'] : 'home' );
		$surah_id = ( isset($_GET['surah']) && intval($_GET['surah']) != 0 && intval($_GET['surah']) < 115 ? intval($_GET['surah']) : 1 );
		$reader_id = ( isset($_GET['reader_id']) ? intval($_GET['reader_id']) : $this->default_reader );
		$aya = ( isset($_REQUEST['ayah']) && intval($_REQUEST['ayah']) != 0 ? intval($_REQUEST['ayah']) : 1 );
		$type = ( isset($_REQUEST['type']) && intval($_REQUEST['type']) != 0 ? intval($_REQUEST['type']) : 1 );
		$lang = $this->get_language();
		$language_name = ( isset($_GET['name']) ? strip_tags($_GET['name']) : '' );
		$category_id = ( isset($_GET['category_id']) ? intval($_GET['category_id']) : 0 );
		$page =  ( isset($_GET['page']) ? intval($_GET['page']) : 1 );

		if( $action == 'translate' ){
			if( $this->get_language() == 'ar' ){
				$cfl = 'translate-ar.html';
				if( $this->read_cache_file($cfl) == '' ){
					$output = $this->Template_view_full( $this->tpl_content(word('select_surah'), $this->quran()) );
					$this->create_cache_file($cfl, $output);
				}else{
					$output = $this->read_cache_file($cfl);
				}
			}else{
				if( isset($_GET['surah']) ){
					$cfl = 'translate-'.$lang.'-surah-'.$surah_id.'.html';
				}else{
					$cfl = 'translate-'.$lang.'.html';
				}
				if( $this->read_cache_file($cfl) == '' ){
					//word('select_language')
					$translate = $this->translate();
					$output = $this->Template_view_full( $this->tpl_content($this->body_title, $translate) );
					$this->create_cache_file($cfl, $output);
				}else{
					$output = $this->read_cache_file($cfl);
				}
			}
		}elseif( $action == 'tafseer' ){
			if( isset($_GET['surah']) && isset($_REQUEST['ayah']) ){
				$cfl = 'tafseer-'.$type.'-surah-'.$surah_id .'-ayah-'.$aya.'.html';
			}elseif( isset($_GET['surah']) && !isset($_REQUEST['ayah']) ){
				$cfl = 'tafseer-'.$type.'-surah-'.$surah_id .'.html';
			}else{
				$cfl = 'tafseer-'.$type.'.html';
			}
			if( $this->read_cache_file($cfl) == '' ){
				$tafseer = $this->tafseer();
				$output = $this->Template_view_full( $this->tpl_content($this->title, $tafseer) );
				$this->create_cache_file($cfl, $output);
			}else{
				$output = $this->read_cache_file($cfl);
			}
		}elseif( $action == 'languages' ){
			$cfl = 'languages.html';
			if( $this->read_cache_file($cfl) == '' ){
				$output = $this->Template_view_full( $this->tpl_content(word('select_language'), $this->get_languages()) );
				$this->create_cache_file($cfl, $output);
			}else{
				$output = $this->read_cache_file($cfl);
			}
		}elseif( $action == 'quran' ){
			$this->title = word('quran');
			$this->description = word('quran');
			$this->url = $this->url( array( 'action' => 'quran' ) );
			$cfl = 'quran.html';
			if( $this->read_cache_file($cfl) == '' ){
				$output = $this->Template_view_full( $this->tpl_content($this->title, $this->quran()) );
				$this->create_cache_file($cfl, $output);
			}else{
				$output = $this->read_cache_file($cfl);
			}
		}elseif( $action == 'home' && isset($_GET['surah']) ){
			$cfl = 'surah-'.$surah_id.'.html';
			if( $this->read_cache_file($cfl) == '' ){
				$content = $this->home_view_surah();
				$output = $this->Template_view_full( $this->tpl_content($this->body_title, $content ) );
				$this->create_cache_file($cfl, $output);
			}else{
				$output = $this->read_cache_file($cfl);
			}
		}elseif( $action == 'books' ){
			$cfl = 'books-languages.html';
			if( $this->read_cache_file($cfl) == '' ){
				$output = $this->Template_view_full( $this->books_languages() );
				$this->create_cache_file($cfl, $output);
			}else{
				$output = $this->read_cache_file($cfl);
			}
		}elseif( $action == 'books_language' ){
			if( $page > 1 ){
				$cfl = 'books-'.$language_name.'-page-'.$page.'.html';
			}else{
				$cfl = 'books-'.$language_name.'.html';
			}
			if( $this->read_cache_file($cfl) == '' ){
				$output = $this->Template_view_full( $this->books_language() );
				$this->create_cache_file($cfl, $output);
			}else{
				$output = $this->read_cache_file($cfl);
			}
		}elseif( $action == 'books_category' ){
			if( $page > 1 ){
				$cfl = 'books-category-'.$category_id.'-page-'.$page.'.html';
			}else{
				$cfl = 'books-category-'.$category_id.'.html';
			}

			if( $this->read_cache_file($cfl) == '' ){
				$books_category = $this->books_category();
				$output = $this->Template_view_full( $books_category );
				$this->create_cache_file($cfl, $output);
			}else{
				$output = $this->read_cache_file($cfl);
			}
		}elseif( $action == 'book' ){
			$book = $this->book();
			$output = $this->Template_view_full( $book );
		}elseif( $action == 'for_sale' ){
			$output = $this->Template_view_full( $this->for_sale() );
		}elseif( $action == 'about_script' ){
			$output = $this->Template_view_full( $this->about_script() );
		}else{
			//$pages = $this->moshaf_pages_loop();
			$cfl = 'home.html';
			if( $this->read_cache_file($cfl) == '' ){
				$output = $this->Template_view_full( $this->home_page() );
				$this->create_cache_file($cfl, $output);
			}else{
				$output = $this->read_cache_file($cfl);
			}
			$this->create_xml();
		}

		return $output;
	}

	public function cleanUp($array){
		$cleaned_array = array();
		foreach($array as $key => $value){
			$qpos = strpos($value, "?");
			if($qpos !== false){ break; }
				if($key != "" && $value != ""){ $cleaned_array[] = $value; }
		}
		return $cleaned_array;
	}

	public function check_cache_dir( $folder = '') {
		$dir_name = ( empty($folder) ? $this->cache_folder : $folder );
		$msg = array();
		if( !file_exists($dir_name) ){
			$msg[] = 'is not found.';
			if( !mkdir($dir_name, 0775, true) ){
				$msg[] = 'Failed to create folder.';
			}
		}
		if( !is_dir($dir_name) ){
			$msg[] = 'is not directory.';
		}
		if( !is_readable($dir_name) ){
			$msg[] = 'is not readable.';
		}
		if( !is_writable($dir_name) ){
			$msg[] = 'is not writable.';
		}
		if( !chmod($dir_name, 0775) ){
			$msg[] = 'must be readable and writeable.';
		}
		if( count($msg) > 0 ){
			$code = '<h3>'.strip_tags($dir_name).'</h3>';
			foreach($msg as $value){
				$code .= '<div class="alert alert-danger"><p>'.$value.'</p></div>';
			}
		}else{
			$code = '';
		}
		return $code;
	}

	public function create_cache_file($file_name='', $content='' ){
		if( $this->cache_active && $this->cache_allow_create ){
			$cache_folder = $this->cache_folder;
			$get_file_name = $cache_folder.$file_name;

			$msg = '';
			$err = 0;

			$prefix = '<!-- This file is cache ( Name: '.$file_name.') Added '.date('j-n-Y h:i:s A',time()).' -->'."\n";

			if( $cache_folder == "" ){
				return $this->check_cache_dir($cache_folder);
			}else{
				if( file_exists($get_file_name) ){
					unlink($get_file_name);
				}

				$handle = fopen($get_file_name, 'w');

				if ( !$handle ){
					$msg .= 'Cannot open file ('.$get_file_name.')';
					$err = 1;
				}

				if ( fwrite($handle, $content) === FALSE ) {
					$msg .= 'Cannot write to file ('.$get_file_name.')';
					$err = 1;
				}

				if( $err != 1 ) {
					$text = 1;
					fclose($handle);
				}else{
					$text = $msg;
				}
				return $get_file_name;
			}
		}else{
			$msg = '';
			return $msg;
		}
	}

	public function expire_cache_file($file_path='', $folder=''){
		$cache_folder = ( empty($folder) ? $this->cache_folder : $folder );
		$file_name = $cache_folder.$file_path;
		$current_file = ( file_exists($file_name) ? $file_name : '' );
		if( $current_file == '' ){
			return false;
		}else{
			$file_time = filemtime($file_name);
			$file_expire = ( empty($this->cache_time) ? $file_time + 86400 : $file_time + $this->cache_time );
			if( time() > $file_expire ){
				return true;
			}else{
				return false;
			}
		}
	}

	public function read_cache_file($file_path=''){
		if( $this->expire_cache_file($file_path) ){
			return '';
		}
		if( $this->cache_active ){
			$cache_folder = $this->cache_folder;
			$file_name = $cache_folder.$file_path;
			$current_file = ( file_exists($file_name) ? $file_name : '' );

			if( $current_file == '' ){
				$get_file_name = '';
			}else{
				$file_time = filemtime($file_name);
				$file_expire = ( empty($this->cache_time) ? $file_time + 86400 : $file_time + $this->cache_time );
				//$file_time2 = filemtime($file_name);
				$prefix = '<!-- Cached copy ( Name: '.$file_path.' ), generated '.date('j-n-Y h:i:s A', $file_time).' '.$file_expire.' == '.time().' -->'."\n";

				if( time() > $file_expire ){
					unlink($file_name);
					$current_file = '';
				}

    			if( !empty($current_file) ){
					if( function_exists('file_get_contents') ){
						$get_content = file_get_contents($current_file);
						if( trim($get_content) == "" ){
							$get_file_name = '';
						}else{
							$get_file_name = $prefix.$get_content;
						}
						$handle = fopen($current_file, "r");
						$contents = fread($handle, filesize($current_file));
						$get_file_name = ( trim($contents) == "" ? '' : $prefix.$contents );
						fclose($handle);
						if( $contents == '' ){
							$get_file_name = 'file_get_contents functions are not available and fread function are not working.';
						}
					}
    			}else{
    				$get_file_name = '';
    			}
			}
		}else{
			$get_file_name = '';
		}
		return $get_file_name;
	}

	public function remove_cache_file($file_path='', $folder = ''){
			$cache_folder = ( empty($folder) ? $this->cache_folder : $folder );
			$file_name = $cache_folder.$file_path;
			$current_file = ( file_exists($file_name) ? $file_name : '' );

			if( $current_file == '' ){
				return '';
			}else{
				if( unlink($current_file) ){
					return ''; //"success";
				}else{
					return '';
				}
			}
	}

	function post_share($titles='', $links=''){
		if( empty($this->twitter_username) ){
			$twitter_via = '';
		}else{
			$twitter_via = '&amp;via='.str_replace('@', '', $this->twitter_username);
		}

		$title = htmlentities(urlencode($titles));
		$url = urlencode($links);

		$code = '<div class="share">';
		$code .= '<h5>'.word('share').'</h5>';
		$code .= '<div class="share-content">';
		$code .= '<a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u='.$url.'&title='.$title.'"><i class="fab fa-facebook-square" aria-hidden="true"></i></a>';
		$code .= '<a target="_blank" href="https://twitter.com/intent/tweet?text='.$title.'&amp;url='.$url.''.$twitter_via.'"><i class="fab fa-twitter-square" aria-hidden="true"></i></a>';
		$code .= '<a target="_blank" href="https://pinterest.com/pin/create/bookmarklet/?media=[MEDIA]&url='.$url.'&is_video=false&description='.$title.'"><i class="fab fa-pinterest-square" aria-hidden="true"></i></a>';
		$code .= '<a target="_blank" href="https://www.reddit.com/submit?url='.$url.'&title='.$title.'"><i class="fab fa-reddit-square" aria-hidden="true"></i></a>';
		$code .= '<a target="_blank" href="https://www.linkedin.com/shareArticle?mini=true&url='.$url.'&title='.$title.'&source="><i class="fab fa-linkedin"></i></a>';
		$code .= '<a target="_blank" href="https://www.tumblr.com/share?v=3&u='.$url.'&t='.$title.'"><i class="fab fa-tumblr-square" aria-hidden="true"></i></a>';
		$code .= '<a target="_blank" href="https://api.whatsapp.com/send?text='.strip_tags($titles).' '.$url.'"><i class="fab fa-whatsapp-square"></i></a>';
		$code .= '<a href="mailto:?subject='.$title.'&amp;body='.$url.'."><i class="fas fa-envelope-square"></i></a>';
		$code .= '</div>';
		$code .= '</div>';

		return $code;
	}

	public function moshaf_pages_loop(){
		$surah = $this->surah_name();
		$surah = ( isset($surah['data']) && is_array($surah['data']) ? $surah['data'] : '' );
		$aya_count = $this->aya_count;
		$html = '<table  class="table bg-white text-black">';
		$html .= '<tbody>';
		$i=0;
		foreach( $this->moshaf_pages() as $key => $value ){
			$i++;
			foreach( $value as $k => $v ){
				$ayat = ( isset($aya_count[$k]) ? intval($aya_count[$k]) : 0 );
				$surah_name = ( !empty($surah) && isset($surah[$k]['name']) ? $surah[$k]['name'] : $k );
				$f = ( isset($v['f']) ? intval($v['f']) : 1 );
				$t = ( isset($v['t']) ? intval($v['t']) : 2 );
				$html .= '<tr>';
				$html .= '<td>';
				$html .= $i.'- '.$key.': '.$k.' - '.$surah_name.' - from '.$f.' to '.$t;
				$html .= '</td>';
				$html .= '</tr>';
			}
		}
		$html .= '</tbody>';
		$html .= '</table >';
		return $html;
	}
}
?>
