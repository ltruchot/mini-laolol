define([
    'dojo/_base/declare',
    'dojo/dom',
    'dojo/fx',    
    'app/_Page',
    'dojo/text!./html/Home.html'
], function(declare, dom, fx, _Page, htmlContent) {
 
    return declare([_Page], {
                
        pageName: "home",

        pageTitle: "Un peu de code simple en Dojo",

        pageContent: htmlContent,
        
        postCreate: function () {
            this.inherited(arguments);
            this.animateDom();
        },

        readtrack: function  (currentLetter) {
			/*switch (tid) {
				case 1: 
					title = "Ko";
					song = "http://laocom.free.fr/3L/3L_audio/ko_kai_1.mp3";
					break;
				case 2: 
					title = "Kho ( Khai/à»„àº‚à»ˆ ) ---> [ Sieng Soung ])";
					song = "http://laocom.free.fr/3L/3L_audio/02_kho_khai_1.mp3";
					break;
				case 3: 
					title = "Kho ( Khouay/àº„àº§àº²àº ) ---> [ Sieng Tam ]";
					song = "http://laocom.free.fr/3L/3L_audio/03_kho_khouay_1.mp3";
					break;
				case 4: 
					title = "Ngo ( Ngou/àº‡àº¹ ) ---> [ Sieng Tam ]";
					song = "http://laocom.free.fr/3L/3L_audio/04_Ngo_Ngou_1.mp3";
					break;
				case 5: 
					title = "Cho ( Choua/àºˆàº»àº§ ) ---> [ Sieng Kaang ]";
					song = "http://laocom.free.fr/3L/3L_audio/05_Cho_Choua_1.mp3";




					
					break;
				case 6: 
					title = "So ( Seua/à»€àºªàº·àº­ ) ---> [ Sieng Soung ]";
					song = "http://laocom.free.fr/3L/3L_audio/06_So_Seua_1.mp3";
					break;
				case 7: 
					title = "Xo ( Xang/àºŠà»‰àº²àº‡ ) ---> [ Sieng Tam ]";
					song = "http://laocom.free.fr/3L/3L_audio/07_Xo_Xang_1.mp3";
					break;
				case 8: 
					title = "Gno ( Gning/àºàº´àº‡ ) ---> [ Sieng Tam ]";
					song = "http://laocom.free.fr/3L/3L_audio/08_Gno_Gnoug_.mp3";
					break;
				case 9: 
					title = "Do ( Dek/à»€àº”àº±àº ) ---> [ Sieng Kaang ]";
					song = "http://laocom.free.fr/3L/3L_audio/09_Do_Dek_1.mp3";
					break;
				case 10: 
					title = "To ( Taa/àº•àº² ) ---> [ Sieng Kaang ]";
					song = "http://laocom.free.fr/3L/3L_audio/10_To_Ta_1.mp3";
					break;
				case 11: 
					title = "Tho ( Thay/à»„àº– ) ---> [ Sieng Soung ]";
					song = "http://laocom.free.fr/3L/3L_audio/11_Tho_Thay_1.mp3";
					break;
				case 12: 
					title = "Tho ( Thoung/àº—àº¸àº‡ ) ---> [ Sieng Tam ]";
					song = "http://laocom.free.fr/3L/3L_audio/12_Tho_Thoung_1.mp3";
					break;
				case 13: 
					title = "No ( Nok/àº™àº»àº ) ---> [ Sieng Tam ]";
					song = "http://laocom.free.fr/3L/3L_audio/13_No_Nok_1.mp3";
					break;
				case 14: 
					title = "Bo ( Beth/à»€àºšàº±àº” ) ---> [ Sieng Kaang ]";
					song = "http://laocom.free.fr/3L/3L_audio/14_Bo_Beth_1.mp3";
					break;
				case 15: 
					title = "Po ( Paa/àº›àº² ) ---> [ Sieng Kaang ]";
					song = "http://laocom.free.fr/3L/3L_audio/15_Po_Pa_1.mp3";
					break;
				case 16: 
					title = "Pho ( Pheung/à»€àºœàº´à»‰àº‡ ) ---> [ Sieng Soung ]";
					song = "http://laocom.free.fr/3L/3L_audio/16_Pho_Pheung_2.mp3";
					break;
				case 17: 
					title = "Fo ( Faa/àºàº² ) ---> [ Sieng Soung ]";
					song = "http://laocom.free.fr/3L/3L_audio/17_Fo_Faa_2.mp3";
					break;
				case 18: 
					title = "Pho ( Phou/àºž àº¹) ---> [ Sieng Tam ]";
					song = "http://laocom.free.fr/3L/3L_audio/18_Pho_Phou_1.mp3";
					break;
				case 19: 
					title = "Fo ( Fai/à»„àºŸ ) ---> [ Sieng Tam ]";
					song = "http://laocom.free.fr/3L/3L_audio/19_Fo_Fai_1.mp3";
					break;
				case 20: 
					title = "Mo ( Maa/àº¡à»‰àº² ) ---> [ Sieng Tam ]";
					song = "http://laocom.free.fr/3L/3L_audio/20_Mo_Ma_1.mp3";
					break;
				case 21: 
					title = "Yo ( Yaa/àº¢àº² ) ---> [ Sieng Kaang ]";
					song = "http://laocom.free.fr/3L/3L_audio/21_Yo_Yaa_1.mp3";
					break;
				case 22: 
					title = "Ro ( Roth/àº£àº»àº” ) ---> [ Sieng Tam ]";
					song = "http://laocom.free.fr/3L/3L_audio/22_Ro_Roth_1.mp3";
					break;
				case 23: 
					title = "Lo ( Ling/àº¥àº´àº‡ ) ---> [ Sieng Tam ]";
					song = "http://laocom.free.fr/3L/3L_audio/23_Lo_Ling_2.mp3";
					break;
				case 24: 
					title = "Vo ( Vii/àº§àºµ ) ---> [ Sieng Tam ]";
					song = "http://laocom.free.fr/3L/3L_audio/24_Vo_Vii_2.mp3";
					break;
				case 25: 
					title = "Ho ( Hai/à»„àº« ) ---> [ Sieng Soung ]";
					song = "http://laocom.free.fr/3L/3L_audio/25_Ho_Hai_1.mp3";
					break;
				case 26: 
					title = "O ( Oo/à»‚àº­ ) ---> [ Sieng Kaang ]";
					song = "http://laocom.free.fr/3L/3L_audio/26_O_OO_1.mp3";
					break;
				case 27: 
					title = "Ho ( Heua/à»€àº®àº·àº­ ) ---> [ Sieng Tam ]";
					song = "http://laocom.free.fr/3L/3L_audio/27_Ho_Heua_2.mp3";
					break;
			}*/
			content = '<p><b><i>' + currentLetter.rom + '</i></b></p>';
			content += '<object type="application/x-shockwave-flash" data="http://laocom.free.fr/3L/dewplayer-multi.swf?autostart=1&amp;bgcolor=f8d14e&amp;son=' + currentLetter.song + '" width="240" height="20">';
			content += '<param name="movie" value="http://laocom.free.fr/3L/dewplayer-multi.swf?autostart=1&amp;bgcolor=f8d14e&amp;son=' + song + '" />';
			content += '</object>';
			document.getElementById('player').innerHTML = content;
		}

    });
 
});
