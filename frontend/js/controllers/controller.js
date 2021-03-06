myApp.controller('HomeCtrl', function ($scope, TemplateService, NavigationService, $timeout,$rootScope,apiService,$cookies) {
        $scope.template = TemplateService.getHTML("content/home.html");
        TemplateService.title = "Home"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        //$scope.categorydropdown = apiService.getCategoryDropdown({});

        
        angular.element(document).ready(function () {
            apiService.get_session({}).then( function (response) {
                $cookies.put("csrftoken",response.data.csrf_token);
                $cookies.put("session_id",response.data.session_id);
                $.jStorage.set("csrftoken",response.data.csrf_token);
                //console.log(response.data);
            });
            // if (navigator.geolocation) {
            //     navigator.geolocation.getCurrentPosition(function(position){
            //         $scope.$apply(function(){
            //             $scope.position = position;
            //             console.log(position);
            //         });
            //     });
            // }
        });
        

        

    })
    .controller('SpeechRecognitionController', function ($scope, $rootScope) {

        var vm = this;

        vm.displayTranscript = displayTranscript;
        vm.transcript = '';
        function displayTranscript() {
            vm.transcript = $rootScope.transcript;
            //console.log("transcript",$rootScope.transcript);
            $(".chatinput").val($rootScope.transcript);
            $rootScope.pushMsg(0,$rootScope.transcript,"");
            //This is just to refresh the content in the view.
            if (!$scope.$$phase) {
                $scope.$digest();
                console.log("transcript",$rootScope.transcript);
            }
        }
        $rootScope.startspeech = function() {
            var recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            console.log("new func");
        // recognition.onresult = function(event) 
            { 
                console.log(event); 
            }
            recognition.start();
        };
        /**
         * Handle the received transcript here.
         * The result from the Web Speech Recognition will
         * be set inside a $rootScope variable. You can use it
         * as you want.
         */
        $rootScope.speechStarted = function() {
            console.log("speech Started");
        };
    

    })

    .controller('LoginCtrl', function ($scope, $uibModalInstance, items) {

        $scope.items = items;
        $scope.loginemail = items.email;
        
    })
    .controller('ChatCtrl', function ($scope, $rootScope,TemplateService, $timeout,$http,apiService,$state,$sce,$cookies,$location,$compile,$uibModal) {
        $rootScope.regEx="/^[0-9]{10,10}$/;"
        var url = $location.absUrl().split('?')[0];
        // console.log(url);
        // console.log(window.parent.location);
         var pId = $location.path().split("/")[3]||"Unknown";    //path will be /person/show/321/, and array looks like: ["","person","show","321",""]
        //console.log(document.baseURI);
        $scope.getParentUrl =function() {
            var isInIframe = (parent !== window),
                parentUrl = null;

            if (isInIframe) {
                parentUrl = document.referrer;
                console.log("in iframe");
            }

            return parentUrl;
        };
        //console.log($scope.getParentUrl());// returns blank if cross domain | if same domain returns null
        var url2 = (window.location != window.parent.location)? document.referrer: document.location.href;
        //console.log(url2);// returns blank if cross domain | returns url
        //console.log(document.referrer);// returns blank if cross domain | returns url
        // if(!window.top.location.href)
        //     console.log("Different domain");
        // else    
        //     console.log("same domain");
        //console.log(Browser.getParentUrl());
        $rootScope.validDomain = false;
        var referrerurl = $scope.getParentUrl();
        // if(referrerurl == null || referrerurl == "http://104.46.103.162:8096/" || referrerurl == "http://localhost/flatlab/")
        //     $rootScope.validDomain = true;
        $rootScope.validDomain = true;
        //$rootScope.validDomain = true;
        // $rootScope.languagelist = [
        //     {id:"en" , name:"English"},
        //     {id:"hi" , name:"Hindi"},
        //     {id:"mr" , name:"Marathi"},
        //     {id:"gu" , name:"Gujarati"},
        //     {id:"ta" , name:"Tamil"},
        // ];
        // $rootScope.selectedLanguage = $rootScope.languagelist[0];
        $scope.formSubmitted = false;
        $scope.loginerror=0;
        $rootScope.isLoggedin = false;
        $rootScope.hasPolicyNo = false;
        $rootScope.showcreate = false;
        $scope.policysuccess = 0;
        $scope.editpolicysuccess = 0;
        $scope.orderCount = 0;
        $scope.viewPage = 1;
        $scope.linkcount = 0;
        $scope.policylist = [];
        $scope.maxrow = 2;
        $scope.shownextlink = false;
        $scope.showprevlink = false;
        $rootScope.$viewmodalInstance = {};
        $rootScope.loginautherror = 0;
        $rootScope.loginSuccess = 0;
        $rootScope.newslist = {};
        $rootScope.newsid="";
        $rootScope.cur_b = "";
        $rootScope.cur_h = "";
        $rootScope.cur_i = "";
        $rootScope.newslist = $.jStorage.get("newslist");
        $rootScope.newsid = $.jStorage.get("newsid");
        $rootScope.$viewmodalInstance2 = {};
        $rootScope.selectmobileSuccess = 0;
        //$rootScope.selectbookmarkerror = 0;
        $rootScope.openappointment = function() {
            $rootScope.$viewmodalInstance2 = $uibModal.open({
                scope: $rootScope,
                animation: true,
                size: 'sm',
                templateUrl: 'views/modal/appointment.html',
                // resolve: {
                //     items: function () {
                //     return callback.data.data;
                //     }
                // },
                //controller: 'ViewCtrl'
            });
               
        };
        $rootScope.selectappointmentCancel = function() {
            //console.log("dismissing");
            $rootScope.$viewmodalInstance2.dismiss('cancel');
        };
        $rootScope.languagelist = [
            {id:"en" , name:"English"},
            {id:"hi" , name:"Hindi"},
            {id:"mr" , name:"Marathi"},
            {id:"gu" , name:"Gujarati"},
            {id:"ta" , name:"Tamil"},
        ];
        $rootScope.selectedLanguage = $rootScope.languagelist[0];
        $rootScope.$viewmodalInstance3 = {};
        $rootScope.selectquoteSuccess = 0;
        //$rootScope.selectbookmarkerror = 0;
        $rootScope.openquote = function() {
            $rootScope.$viewmodalInstance3 = $uibModal.open({
                scope: $rootScope,
                animation: true,
                size: 'sm',
                templateUrl: 'views/modal/quote.html',
                // resolve: {
                //     items: function () {
                //     return callback.data.data;
                //     }
                // },
                //controller: 'ViewCtrl'
            });
               
        };
        $rootScope.selectquoteCancel = function() {
            //console.log("dismissing");
            $rootScope.$viewmodalInstance3.dismiss('cancel');
        };
        $rootScope.submitQuote = function(obj) {
            console.log(obj);
            $rootScope.selectquoteSuccess=1;
            // $timeout(function(){
            //     $rootScope.selectquoteCancel();
            // },2000);
            
            
            //alert("Thank You");
        };
        angular.element(document).ready(function () {
            console.log($.jStorage.get("newsid"),"news");
            //$("#appointment").click(function(){
            $(document).on('click', '#appointment', function(){ 
                $rootScope.openappointment();
            });
            $(document).on('click', '#quote', function(){ 
                $rootScope.openquote();
            });
            if($rootScope.newsid)
            {
                
                
                //console.log($rootScope.newsid);
                if($rootScope.newslist.body.length > 0) 
                {
                    console.log("inside news",$rootScope.newsid);
                    console.log("inside news",$rootScope.newslist.body);
                }
                else
                {
                    console.log("getting news");   
                    apiService.getnews({}).then(function (data){    
                        $rootScope.newslist = data.data.data;
                        $rootScope.newsid = data.data.data.id;
                        console.log(data.data.id);
                        $.jStorage.set("newslist",$rootScope.newslist);
                        $.jStorage.set("newsid",$rootScope.newsid);
                        
                    });
                }
            }
            else
            {
                console.log("getting news2");
                apiService.getnews({}).then(function (response){    
                    $rootScope.newslist = response.data.data;
                    $rootScope.newsid = response.data.data.id;
                    console.log(response.data.data.id,"news");
                    $.jStorage.set("newslist",$rootScope.newslist);
                    $.jStorage.set("newsid",$rootScope.newsid);
                    
                });
            }
        });
        $rootScope.submitAppointment = function(mobileno) {
            console.log(mobileno);
            $rootScope.selectmobileSuccess=1;
            $timeout(function(){
                $rootScope.selectappointmentCancel();
            },2000);
            
            
            //alert("Thank You");
        };
        $rootScope.loginpasswordCancel = function() {
            //console.log("dismissing");
            $rootScope.$viewmodalInstance.dismiss('cancel');
        };
        $scope.toggleedit = function(e) {
            $('.edittoggler').hide(500);
            if($(".editform"+e).is(':visible')) {}
            else
                $(".editform"+e).slideToggle(500);
        };
        $scope.convertdate = function(d) {
            return (new Date(d));
        };
        $scope.getNumber = function(num) {
            return new Array(Math.round(num));   
        };
        $scope.getpage = function(page) {
            $scope.viewPage = page;
            $rootScope.getpolicy($(".skey").val(),$(".sval").val());
        };
        $scope.nextpage = function(page) {
            $scope.viewPage = page +1;
            $rootScope.getpolicy($(".skey").val(),$(".sval").val());
        };
        $scope.prevpage = function(page) {
            $scope.viewPage = page -1;
            $rootScope.getpolicy($(".skey").val(),$(".sval").val());
        };
        $scope.showcreateform = function(key,value) {
            //console.log(key,"key");
            //console.log(value,"value");
            $rootScope.showcreate = true;
        };
        $rootScope.$viewmodalInstance1 = {};
        $rootScope.selectbookmarkerror = 0;
        $rootScope.openviewBookmark = function() {
            $scope.formData = {userid:$.jStorage.get("sessionid")};
            
            
            apiService.viewbookmark($scope.formData).then(function (callback){
                $("#selectbookmark_list").html("");
                
                
                $rootScope.$viewmodalInstance1 = $uibModal.open({
                    scope: $rootScope,
                    animation: true,
                    size: 'sm',
                    templateUrl: 'views/modal/selectbookmark.html',
                    resolve: {
                        items: function () {
                        return callback.data.data;
                        }
                    },
                    controller: 'ViewCtrl'
                });
                
            });
        };
        $rootScope.selectbookmarkCancel = function() {
            //console.log("dismissing");
            $rootScope.$viewmodalInstance1.dismiss('cancel');
        };



        
        $rootScope.getpolicy = function(skey,sval) {
            if($scope.viewPage < 1)
                $scope.viewPage = 1;
            $scope.policylist = [];
            var formData = {orderCount : $scope.orderCount,viewPage:$scope.viewPage,skey:skey,sval:sval};
            console.log(formData);
            apiService.viewpolicy(formData).then(function (callback){
                $scope.linkcount = (callback.data.data.count)/2;
                //console.log($scope.linkcount);
                var viewlist = callback.data.data.data; 
                _.each(viewlist,function(v,k){
                    viewlist[k].expirydate = new Date(v.expirydate); 
                    viewlist[k].inceptiondate = new Date(v.inceptiondate); 
                });
                $scope.policylist =viewlist;
                if(($scope.linkcount/$scope.viewPage) > 1)
                {
                    $scope.shownextlink = true;
                }
                else
                {
                    $scope.shownextlink = false;
                }
                if(($scope.linkcount/$scope.viewPage) == 1)
                {
                    $scope.showprevlink = true;
                }
                else
                {
                    $scope.showprevlink = false;
                }
            });
        };
        $rootScope.createpolicysubmit = function(policyno,inception_date,expiry_date,stamount,agent_name,prem_amount,agent_no,cust_no,cust_email) {
            $scope.formData = {policyno:policyno,inception_date:inception_date,expiry_date:expiry_date,stamount:stamount,agent_name:agent_name,prem_amount:prem_amount,agent_no:agent_no,cust_no:cust_no,cust_email:cust_email,user_id:$cookies.get("session_id")};
            console.log($scope.formData);
            
            apiService.createpolicy($scope.formData).then(function (callback){
                if(callback.data)
                {
                    $scope.policysuccess = 1;
                    // $scope.form.createpolicy.$setPristine();
                    // $scope.form.createpolicy.$setUntouched();
                    $(".createpolicy").find("input[type=text],input[type=email],input[type=number],input[type=date], textarea").val("");
                    console.log("Success");
                }
                else
                {
                    $scope.policysuccess = -1;
                    console.log("Fail");
                }
                    
            });
        };
        $rootScope.editpolicysubmit = function(dataobject) {
            $scope.formData = dataobject;
            apiService.editpolicy($scope.formData).then(function (callback){
                if(callback.data)
                {
                    $scope.editpolicysuccess = 1;
                    // $scope.form.createpolicy.$setPristine();
                    // $scope.form.createpolicy.$setUntouched();
                    //$(".editpolicy").find("input[type=text],input[type=email],input[type=number],input[type=date], textarea").val("");
                    console.log("Success");
                }
                else
                {
                    $scope.editpolicysuccess = -1;
                    console.log("Fail");
                }
                    
            });
        };
        $rootScope.isemp = $.jStorage.get("isemp");
        $rootScope.keys = [
            {id:'' ,name:"Select"},
            {id:'policyno' ,name:"Policy No"},
            {id:'customer_email',name:"Customer Email"},
            {id:'agent_name',name:"Agent Name"},
            {id:'customer_contact_no',name:"Customer Contact No"}
        ];
        $rootScope.haveclaim = function(v,index) {
            console.log(v);
            console.log(index);
            if(v == 1)
            {
                $(".showclaimnoform"+index).show();
                
            }
            else
            {
                $(".showclaimnoform"+index).hide();
            }
            $(".claim_no"+index).val("");
        };
        $rootScope.havegr = function(v,index) {
            console.log(v);
            console.log(index);
            if(v == 1)
            {
                $(".showgrform"+index).show();
                
            }
            else
            {
                $(".showgrform"+index).hide();
            }
            $(".gr_no"+index).val("");
        };
        $rootScope.havepolicy = function(v,index) {
            console.log(v);
            console.log(index);
            if(v == 1)
            {
                $(".showpolicynoform"+index).show();
                
            }
            else
            {
                $(".showpolicynoform"+index).hide();
            }
            $(".policy_no"+index).val("");
        };
        if($.jStorage.get("isLoggedin"))
            $rootScope.isLoggedin = true;
        $scope.login = function(name,email,language)
        {
            $scope.formData = {uname:name,uemail:email,user_input:"",csrfmiddlewaretoken:$rootScope.getCookie("csrftoken"),auto_id:"",auto_value:"",user_id:$cookies.get("session_id")};
            
            apiService.login($scope.formData).then(function (callback){
                //console.log(callback);
                $.jStorage.flush();
                //if(email == "atul@gmail.com" && name == "Atul")
                if(callback.data)
                {
                    angular.forEach(callback.data.tiledlist, function(value, key) {
                        if(value.type=="DTHyperlink")
                        {
                            $rootScope.DthResponse(0,callback.data);
                            $rootScope.isemp = false;
                            $.jStorage.set("isemp",false);
                            $.jStorage.set("id", 1);
                            $.jStorage.set("name", name);
                            $.jStorage.set("email", email);
                            $.jStorage.set("isLoggedin", true);
                            $.jStorage.set("sessionid",value.profile_id);
                            $rootScope.isLoggedin = true;
                            // $("#topic").text(data.data.data.tiledlist[0].topic);
                            // $.jStorage.set("sessiondata",data.data.data.session_obj_data);
                        }
                        if(value.type=="employee form")
                        {
                            //$rootScope.chatlist = [];
                            //$rootScope.pushSystemMsg(0,callback.data);
                            $rootScope.isemp = true;
                            $.jStorage.set("isemp",true);
                           
                            $rootScope.$viewmodalInstance = $uibModal.open({
                                scope: $rootScope,
                                animation: true,
                                size: 'sm',
                                templateUrl: 'views/modal/passwordlogin.html',
                                resolve: {
                                    items: function () {
                                    return {email:email};
                                    }
                                },
                                controller: 'LoginCtrl'
                            });
                            // $("#topic").text(data.data.data.tiledlist[0].topic);
                            // $.jStorage.set("sessiondata",data.data.data.session_obj_data);
                        }
                        else
                        {
                            $.jStorage.set("id", 1);
                            $.jStorage.set("name", name);
                            $.jStorage.set("email", email);
                            $.jStorage.set("isLoggedin", true);
                            $rootScope.isLoggedin = true;
                            $rootScope.isemp = false;
                            $.jStorage.set("isemp",false);
                            $.jStorage.set("sessionid",value.profile_id);
                            //console.log(value.profile_id);
                        }
                        $.jStorage.set("language", language.id);
                    });
                    
                }
                else {
                    $scope.loginerror = -1;
                }
            });
            
        };
        $rootScope.loginsubmit = function(email,password) {
            var formData = {email:email,password:password};
            apiService.loginsubmit(formData).then(function (callback){
                //console.log(callback);
                if(!callback.data.value)
                {
                    $rootScope.loginautherror = -1;
                }
                else
                {
                    $rootScope.loginautherror = 0;
                    $rootScope.loginSuccess = 1;
                    $rootScope.loginpasswordCancel();
                    $rootScope.isemp = true;
                    $.jStorage.set("isemp",true);
                    $.jStorage.set("id", 1);
                    $.jStorage.set("name", name);
                    $.jStorage.set("email", email);
                    $.jStorage.set("isLoggedin", true);
                    $rootScope.isLoggedin = true;
                }
            });
        };
        
        $rootScope.autocompletelist = [];
        $rootScope.chatOpen = false;
        $rootScope.showTimeoutmsg = false;
        $rootScope.firstMsg=false;
        $rootScope.chatmsg = "";
        $rootScope.chatmsgid = "";
        
        $rootScope.msgSelected = false;
        $rootScope.chatlist = [];
        // var mylist = $.jStorage.get("chatlist");
        // if(!mylist || mylist == null)
        //     $rootScope.chatlist = [];
        // else
        //     $rootScope.chatlist = $.jStorage.get("chatlist");
        $rootScope.autolistid="";
        $rootScope.autolistvalue="";
        $rootScope.showMsgLoader=false;
        $rootScope.rate_count= 0;
        $rootScope.getCookie = function(c_name)
		{
			if (document.cookie.length > 0)
			{
				c_start = document.cookie.indexOf(c_name + "=");
				if (c_start != -1)
				{
					c_start = c_start + c_name.length + 1;
					c_end = document.cookie.indexOf(";", c_start);
					if (c_end == -1) c_end = document.cookie.length;
					return unescape(document.cookie.substring(c_start,c_end));
				}
			}
			return "";
		};
        $rootScope.scrollChatWindow = function() {
            $timeout(function(){
                var chatHeight = $("ul.chat").height();
                $('.panel-body').animate({scrollTop: chatHeight});
            });
        };
        $rootScope.iframeHeight = window.innerHeight-53;
        $rootScope.links = [];
        
        $rootScope.getDatetime = function() {
            //return (new Date).toLocaleFormat("%A, %B %e, %Y");
            return currentTime = new Date();
        };
        $rootScope.chatText = "";
        $rootScope.answers = "";
        $rootScope.getAutocomplete = function(chatText) {
            if( $rootScope.answers == "")
            {
                $rootScope.showTimeoutmsg = false;
                // if($rootScope.showTimeoutmsg == false && chatText=="") 
                // {
                //     $timeout(function () {
                //         $rootScope.showTimeoutmsg = true;
                //         msg = {Text:"Any Confusion ? How May I help You ?",type:"SYS_INACTIVE"};
                //         $rootScope.pushSystemMsg(0,msg);
                //     },60000);
                // }
                $rootScope.chatText = chatText;
                if($(".chatinput").val() == "" || $(".chatinput").val() == null)
                    $rootScope.autocompletelist = [];
                else {
                    $rootScope.chatdata = { string:$rootScope.chatText};
                    apiService.getautocomplete($rootScope.chatdata).then(function (response){
                        // console.log(response.data);
                        $rootScope.autocompletelist = response.data.data;
                    });
                }
            }
            //var languageid = $.jStorage.get("language");
            //$scope.formData = {"text": chatText,"language":languageid };
            // apiService.translate($scope.formData).then( function (response) {
            //     //$(".chatinput").val(response.data.data);
            //     console.log(response.data.data);
            // });
        };
        $rootScope.pushSystemMsg = function(id,value) {
            $rootScope.chatmsgid = id;
            $rootScope.chatmsg = value;
            
            $rootScope.chatlist.push({id:"id",msg:value,position:"left",curTime: $rootScope.getDatetime()});
            //$.jStorage.set("chatlist",$rootScope.chatlist);
            $timeout(function(){
                $rootScope.scrollChatWindow();
            });
            $timeout(function(){
                $rootScope.autocompletelist=[];
            },2000);
        };
        $scope.logout = function()
        {
            $.jStorage.flush();
            $rootScope.isemp = false;
            $rootScope.isLoggedin = false;
            $rootScope.chatlist = [];
            $.jStorage.set("showchat",false);
            $rootScope.chatOpen = false;
            $rootScope.links = [];
            //$rootScope.firstMsg = true;
            var msg = {Text:"Hi, How may I help you ?",type:"SYS_FIRST"};
            $rootScope.pushSystemMsg(0,msg); 
        };
        $scope.trustedHtml = function (plainText) {
            return $sce.trustAsHtml(plainText);
        };
        $rootScope.pushQuesMsg = function(id,value) {
            $rootScope.chatmsgid = id;
            $rootScope.chatmsg = value;
            var value2 = $rootScope.links;
            if(value2[id].link != "" )
            {
                var linkdata="";
                var prev_res = false;
                
                final_link = value2[id].link.split("<br>");
                var languageid = $.jStorage.get("language");
                $scope.formData = {"items": final_link,"language":languageid,arr_index:id };
                apiService.translatelink($scope.formData).then( function (response) {
                    value2.queslink=response.data.data.linkdata;
                    value2.queslink = $sce.trustAsHtml(value2.queslink);
                    msg2={"queslink":angular.copy(value2.queslink),type:"cat_faq"};
                    $timeout(function(){
                        $rootScope.chatlist.push({id:id,msg:msg2,position:"left",curTime: $rootScope.getDatetime()});
                        $rootScope.showMsgLoader=false;
                        $rootScope.scrollChatWindow();
                    },2000);
                });
                
            }
            
            else
            {    
                value2.queslink = value2[id].answers.replace(new RegExp("../static/data_excel/", 'g'), adminurl2+'static/data_excel/');
                value2.queslink = $sce.trustAsHtml(value2.queslink);
            
                msg2={"queslink":angular.copy(value2.queslink),type:"cat_faqlink"};
                $timeout(function(){
                    $rootScope.chatlist.push({id:id,msg:msg2,position:"left",curTime: $rootScope.getDatetime()});
                    $rootScope.showMsgLoader=false;
                    $rootScope.scrollChatWindow();
                },2000);
            }
            
            
        };
        
        $rootScope.pushPortalLink= function(id,type) {
            console.log(id,"index");//index of array
            console.log(type,"value");// 0-ion portal ,1-ion app
            $rootScope.chatmsgid = id;
            $rootScope.chatmsg = type;
            var value3 = $rootScope.links;
            if(value3[id].answers != "")
            {
                var answer1 =new Array();
                answer1 = value3[id].answers.split("(2nd)");
                if(type==0)
				    answer1 = answer1[0];
                else if(type==1)
                    answer1 = answer1[1];
                answer1 = answer1.replace("\n", "<br />", "g");
                value3.queslink=answer1;
                
            }
            value3.queslink = $sce.trustAsHtml(value3.queslink);
            //$compile(linkdata)($scope);
            msg2={"queslink":angular.copy(value3.queslink),type:"cat_faqlink"};
            $rootScope.chatlist.push({id:id,msg:msg2,position:"left",curTime: $rootScope.getDatetime()});
            $rootScope.showMsgLoader=false;
            //$.jStorage.set("chatlist",$rootScope.chatlist);
            $timeout(function(){
                $rootScope.scrollChatWindow();
            });
        };
        $rootScope.showChatwindow = function () {
            // newlist = $.jStorage.get("chatlist");
            // if(!newlist || newlist == null)
            // {
            //     $rootScope.firstMsg = false;
            // }
            // else
            // { 
            //     $rootScope.firstMsg = true;
            // }
            //$.jStorage.set("showchat",true);
            if(!$rootScope.firstMsg)
            {
                $rootScope.firstMsg = true;
                msg = {Text:"Hi, How may I help you ?",type:"SYS_FIRST"};
                $rootScope.pushSystemMsg(0,msg);  
            }
            $('#chat_panel').slideDown("slow");
            //$('#chat_panel').find('.panel-body').slideDown("fast");
            //$('#chat_panel').find('.panel-footer').slideDown("slow");
            $('.panel-heading span.icon_minim').removeClass('panel-collapsed');
            $('.panel-heading span.icon_minim').removeClass('glyphicon-plus').addClass('glyphicon-minus');
            $(".clickImage").hide();
            $rootScope.chatOpen = true;
            $rootScope.scrollChatWindow();
        };
        $rootScope.minimizeChatwindow = function() {
            $.jStorage.set("showchat",false);
            $rootScope.showTimeoutmsg = false;
            $rootScope.autocompletelist = [];
            $('#chat_panel').slideUp();
            //$('#chat_panel').find('.panel-body').slideUp("fast");
            //$('#chat_panel').find('.panel-footer').slideUp("fast");
            $('.panel-heading span.icon_minim').addClass('panel-collapsed');
            $('.panel-heading span.icon_minim').addClass('glyphicon-plus').removeClass('glyphicon-minus');
            $(".clickImage").show( "fadeIn");
        };
        $rootScope.pushMsg = function(id,value) {
            $rootScope.msgSelected = true;
            $rootScope.chatmsgid = id;
            $rootScope.chatmsg = value;
            $rootScope.autocompletelist = [];
            $rootScope.chatlist.push({id:"id",msg:value,position:"right",curTime: $rootScope.getDatetime()});
            //console.log("msgid="+id+"chatmsg="+$rootScope.msgSelected);
            $rootScope.getSystemMsg(id,value);
            //$.jStorage.set("chatlist",$rootScope.chatlist);
            $rootScope.msgSelected = false;
            $rootScope.showMsgLoader=true;
            $rootScope.scrollChatWindow();
        };
        $rootScope.pushAutoMsg = function(id,value,answer) {
            $rootScope.msgSelected = true;
            $rootScope.chatmsgid = id;
            $rootScope.chatmsg = value;
            $rootScope.answers = answer;
            console.log(answer);
            
            $rootScope.autocompletelist = [];
            $rootScope.chatlist.push({id:id,msg:value,position:"right",curTime: $rootScope.getDatetime()});
            //console.log("msgid="+id+"chatmsg="+$rootScope.msgSelected);
            var automsg = { Text: answer , type : "SYS_AUTO"};
            $rootScope.chatlist.push({id:id,msg:automsg,position:"left",curTime: $rootScope.getDatetime()});
            $rootScope.showMsgLoader = false;
            //$.jStorage.set("chatlist",$rootScope.chatlist);
            $rootScope.msgSelected = false;
            $rootScope.chatmsgid = "";
            $rootScope.chatmsg = "";
            $rootScope.answers = "";
            $rootScope.chatText="";
            $(".chatinput").val("");
            $timeout(function(){
                $rootScope.autocompletelist = [];
            },1000);
            $rootScope.scrollChatWindow();
        };
        $rootScope.pushQuestionMsg = function(id,value) {
            $rootScope.msgSelected = true;
            $rootScope.chatmsgid = id;
            $rootScope.chatmsg = value;
            $rootScope.autocompletelist = [];
            $rootScope.chatlist.push({id:id,msg:value,position:"right",curTime: $rootScope.getDatetime()});
            $rootScope.getQuestionMsg(id,value);
            $rootScope.msgSelected = false;
            //$rootScope.showMsgLoader=true;
            $rootScope.scrollChatWindow();
        };
        if($.jStorage.get("showchat"))
            $rootScope.showChatwindow();
        else
            $rootScope.minimizeChatwindow();

        $rootScope.claim_noSubmit  = function(claimno,haveclaim) {
            console.log(haveclaim);
            var is_exist = "N";
            if(haveclaim == 1)
                is_exist = "Y";
            
            var formData = {user_input:"",csrfmiddlewaretoken:$rootScope.getCookie("csrftoken"),auto_id:"",auto_value:"",user_id:$cookies.get("session_id"),claim_no:claimno,is_exist:is_exist};
            apiService.claimsubmit(formData).then(function (data){
                angular.forEach(data.data.tiledlist, function(value, key) {
                    if(value.type=="text")
                    {
                        $rootScope.pushSystemMsg(0,data.data);
                        $rootScope.showMsgLoader = false;
                        
                        
                        return false;
                    }
                    if(value.type=="grievance form type")
                    {
                        $rootScope.pushSystemMsg(0,data.data);
                        $rootScope.showMsgLoader = false;
                        
                        
                        return false; 
                    }
                });
            });
        };
        $rootScope.gr_noSubmit  = function(grno,havegr) {
            var is_exist = "N";
            if(havegr == 1)
                is_exist = "Y";
            
            var formData = {user_input:"",csrfmiddlewaretoken:$rootScope.getCookie("csrftoken"),auto_id:"",auto_value:"",user_id:$cookies.get("session_id"),grno:grno,is_exist:is_exist};
            apiService.grsubmit(formData).then(function (data){
                angular.forEach(data.data.tiledlist, function(value, key) {
                    if(value.type=="text")
                    {
                        $rootScope.pushSystemMsg(0,data.data);
                        $rootScope.showMsgLoader = false;
                        
                        
                        return false;
                    }
                });
            });
        };
        $rootScope.policy_noSubmit = function(policyno,havepolicy) {
            console.log(havepolicy);
            var is_exist = "N";
            if(havepolicy == 1)
                is_exist = "Y";
            
            var formData = {user_input:"",csrfmiddlewaretoken:$rootScope.getCookie("csrftoken"),auto_id:"",auto_value:"",user_id:$cookies.get("session_id"),policy_no:policyno,is_exist:is_exist};
            apiService.policysubmit(formData).then(function (data){
                angular.forEach(data.data.tiledlist, function(value, key) {
                    if(value.type=="mobile form type")
                    {
                        $rootScope.pushSystemMsg(0,data.data);
                        $rootScope.showMsgLoader = false;
                        
                        
                        return false;
                    }
                });
            });
        };
        $rootScope.dob_Submit = function(dob) {

            var dt = new Date(dob);
            var date = dt.getDate();
            var month = dt.getMonth();
            var year = dt.getFullYear();
            month= month+1;
            if (month.toString().length == 1) {
                month = "0" + month
            }
            if (date.toString().length == 1) {
                date = "0" + date
            }
            dob= date.toString() + "-" + month.toString() + "-" +year.toString();
            var formData = {user_input:"",csrfmiddlewaretoken:$rootScope.getCookie("csrftoken"),auto_id:"",auto_value:"",user_id:$cookies.get("session_id"),dob:dob};
            apiService.dobsubmit(formData).then(function (data){
                angular.forEach(data.data.tiledlist, function(value, key) {
                    if(value.type=="claim form type")
                    {
                        $rootScope.pushSystemMsg(0,data.data);
                        $rootScope.showMsgLoader = false;
                        
                        
                        return false;
                    }
                    if(value.type=="dob form type")
                    {
                        $rootScope.pushSystemMsg(0,data.data);
                        $rootScope.showMsgLoader = false;
                        
                        
                        return false;
                    }
                    if(value.type=="text")
                    {
                        $rootScope.pushSystemMsg(0,data.data);
                        $rootScope.showMsgLoader = false;
                        return false;
                    }
                });
            });
        };
        $rootScope.mobile_noSubmit = function(mobileno) {
            
            var formData = {user_input:"",csrfmiddlewaretoken:$rootScope.getCookie("csrftoken"),auto_id:"",auto_value:"",user_id:$cookies.get("session_id"),mob_no:mobileno};
            apiService.mobilenosubmit(formData).then(function (data){
                angular.forEach(data.data.tiledlist, function(value, key) {
                    if(value.type=="claim form type")
                    {
                        $rootScope.pushSystemMsg(0,data.data);
                        $rootScope.showMsgLoader = false;
                        
                        
                        return false;
                    }
                    if(value.type=="dob form type")
                    {
                        $rootScope.pushSystemMsg(0,data.data);
                        $rootScope.showMsgLoader = false;
                        
                        
                        return false;
                    }
                    if(value.type=="text")
                    {
                        $rootScope.pushSystemMsg(0,data.data);
                        $rootScope.showMsgLoader = false;
                        return false;
                    }
                    if(value.type=="grievance form type")
                        {
                            $rootScope.pushSystemMsg(0,data.data);
                            $rootScope.showMsgLoader = false;
                            
                            
                            return false; 
                        }
                });
            });
        };
        $rootScope.getDthlinkRes = function(colno,lineno,dthlink) {
            //console.log(colno,lineno,dthlink);
            //mysession = $.jStorage.get("sessiondata");
            var mysession = {};
            //console.log(mysession);
            mysession.DTHlink=dthlink;
            mysession.DTHline=lineno;
            mysession.DTHcol=colno;
            formData = mysession;
            formData.csrfmiddlewaretoken=$rootScope.getCookie("csrftoken");
            formData.user_id=$cookies.get("session_id");
            //console.log(formData);
            apiService.getDthlinkRes(formData).then(function (data){
                angular.forEach(data.data.tiledlist, function(value, key) {
                    if(value.type=="DTHyperlink")
                    {
                        $rootScope.DthResponse(0,data.data);
                        
                        // $("#topic").text(data.data.data.tiledlist[0].topic);
                        // $.jStorage.set("sessiondata",data.data.data.session_obj_data);
                    }
                    if(value.type=="text")
                    {

                        $rootScope.pushSystemMsg(0,data.data);
						$rootScope.showMsgLoader = false;
                        return false;
                        // $("#topic").text(data.data.data.tiledlist[0].topic);
                        // $.jStorage.set("sessiondata",data.data.data.session_obj_data);
                    }
                    
                });
            });
        };
        $rootScope.DthResponse = function(id,data) {
            $rootScope.pushSystemMsg(id,data);
            $rootScope.showMsgLoader = false; 
            // $rootScope.selectTabIndex = 0;
            
            // //var node_data = {"node_data": {"elements": ["Guidelines", "Shifting", "Accessibility", "Charges"], "element_values": ["<br>To define general guidelines to be followed by Branches while processing Account Closure. <br><br> Branch should attempt for retention of account before closing the account as opening a new account is expensive. <br><br> Channels through which Account Closure request is received: <br> 1. Customers In Person (CIP) who walk in to the Branch <br>\n2. Representatives/Bearer of customers who walk in to the Branch <br>\n3. Mail / Drop Box <br><br> Check Documentation and Signature Protocol <br><br> Check Mode of Payment for closure Proceeds <br><br> Check for Customer Handling on receipt of request <br><br> Check Process at Branch \u2013Checks during acceptance of closure form <br><br> Check Process at Branch- Post acceptance of Closure form <br><br> ", "<br>Customer is unwilling to give us another chance  <br>\n1) In case of Issues expressed by the customer where he / she is willing to give the Bank another chance. <br><br>\n2) Branch to attempt fix the problem within 48 hours or 7 days on the outside for extreme cases and revert to the customer. This TAT for revert to be communicated to the customer upfront. <br><br>\n3) Customers to be sent a personalised letter thanking them for their time and an acknowledgement, that we value their business and have remedied whatever caused them to want to leave in the first place. A list of all reasons for closure with the action taken, to be stated.  <br><br>\n4) Once the customer has been retained, the customer letter / form duly marked \u201cNOT FOR CLOSURE \u2013 RETAINED\u201d, along with a copy of the resolution letter to be sent to CPC for filing in the customer record.  <br><br>\n5) Siebel to be updated with the same comment and closed.  <br><br>In case the BOM/SM/BM/ RBM / AM or the branch staff are able / Not able  to retain the customer, then protthe SR which has been created needs to be closed with the Closure Description in Siebel as, \u201cCustomer Retained\u201d. This needs to be done diligently and would be subject to audits.\nCustomer will pay the  necessary amount to regularize the account <br>\nCustomer is unwilling to regularize the account after all attempts then branch user to follow the protocol as detailed in chapter \u201cAccount closure requests with debit balance/TBMS lien.\u201d <br><br>\n1) Where the customer is not willing to continue, Branch to ensure that the complete details on Account closure form and all the checks to be made as detailed in the chapter  \u201cGeneral Guidelines to be followed for Account closure\u201d <br><br>\n2) In case of any incomplete request, the customer needs to be apprised of the requirements and Siebel to be updated accordingly. <br><br>\n3) If the a/c closure request is complete in all respects / once the complete request is received from the customer, the same needs to be sent to CPC, post updating the Siebel <br><br>\n4) Branch to journal of the attempts made to retain the customer. <br><br>\nIn case the BOM/SM/BM/ RBM / AM or the branch staff are able / Not able  to retain the customer, then protthe SR which has been created needs to be closed with the Closure Description in Siebel as, \u201cCustomer Retained\u201d. This needs to be done diligently and would be subject to audits.", "<br>If customer is closing his/ her account due to inconvenient accessibility, solutions like Home Banking, Beat Pick up facility, etc. should be re-iterated. <br>\nIn case customer has an account which he/ she is not eligible for an accessibility offering he/ she is interested in, an upgraded account should be offered especially if account balances justify it (ensure that new AMB/AQBs and NMCs are communicated clearly).Customer is unwilling to give us another chance  <br><br>\n1) In case of Issues expressed by the customer where he / she is willing to give the Bank another chance.  <br><br>\n2) Branch to attempt fix the problem within 48 hours or 7 days on the outside for extreme cases and revert to the customer. This TAT for revert to be communicated to the customer upfront. <br><br>\n3) Customers to be sent a personalised letter thanking them for their time and an acknowledgement, that we value their business and have remedied whatever caused them to want to leave in the first place. A list of all reasons for closure with the action taken, to be stated.  <br><br>\n4) Once the customer has been retained, the customer letter / form duly marked \u201cNOT FOR CLOSURE \u2013 RETAINED\u201d, along with a copy of the resolution letter to be sent to CPC for filing in the customer record.  <br><br>\n5) Siebel to be updated with the same comment and closed.  <br><br>\nIn case the BOM/SM/BM/ RBM / AM or the branch staff are able / Not able  to retain the customer, then protthe SR which has been created needs to be closed with the Closure Description in Siebel as, \u201cCustomer Retained\u201d.  <br><br> This needs to be done diligently and would be subject to audits.  <br><br>\nCustomer is unwilling to give another chance: < <br><br>> Customer will pay the  necessary amount to regularize the account  <br><br>\nCustomer is unwilling to regularize the account after all attempts then branch user to follow the protocol as detailed in chapter \u201cAccount closure requests with debit balance/TBMS lien.\u201d  <br><br>\n1) Where the customer is not willing to continue, Branch to ensure that the complete details on Account closure form and all the checks to be made as detailed in the chapter  \u201cGeneral Guidelines to be followed for Account closure\u201d  <br><br>\n2) In case of any incomplete request, the customer needs to be apprised of the requirements and Siebel to be updated accordingly.  <br><br>\n3) If the a/c closure request is complete in all respects / once the complete request is received from the customer, the same needs to be sent to CPC, post updating the Siebel  <br><br> \n4) Branch to journal of the attempts made to retain the customer.  <br><br>\nIn case the BOM/SM/BM/ RBM / AM or the branch staff are able / Not able  to retain the customer, then protthe SR which has been created needs to be closed with the Closure Description in Siebel as, \u201cCustomer Retained\u201d. This needs to be done diligently and would be subject to audits.C2", "<br>1) Customer expresses concerns on high charges, ascertain the nature of charges levied and recommend an upgraded account where required (e.g. if customer finds DD charges high, up-sell to an account with a higher free DD limit or an account offering At Par cheque facility if usage is on our locations). Communicate the AMB/AQB and NMC to customer clearly. <br><br>\n2) The account can be upgraded/downgrade as per customer requirement by retaining the same account Number  <br><br>\n3) Branch can also explain the benefits of Basic/Small Account and offer conversion to the said  account as it will address their inability to maintain the account.  <br><br>\nCustomer is unwilling to give us another chance  <br><br>\n1) In case of Issues expressed by the customer where he / she is willing to give the Bank another chance.  <br><br>\n2) Branch to attempt fix the problem within 48 hours or 7 days on the outside for extreme cases and revert to the customer. This TAT for revert to be communicated to the customer upfront.  <br><br>\n3) Customers to be sent a personalised letter thanking them for their time and an acknowledgement, that we value their business and have remedied whatever caused them to want to leave in the first place. A list of all reasons for closure with the action taken, to be stated.   <br><br>\n4) Once the customer has been retained, the customer letter / form duly marked \u201cNOT FOR CLOSURE \u2013 RETAINED\u201d, along with a copy of the resolution letter to be sent to CPC for filing in the customer record.  <br><br>\n5) Siebel to be updated with the same comment and closed.  <br><br>\nIn case the BOM/SM/BM/ RBM / AM or the branch staff are able / Not able  to retain the customer, then protthe SR which has been created needs to be closed with the Closure Description in Siebel as, \u201cCustomer Retained\u201d. This needs to be done diligently and would be subject to audits.  <br><br>\nCustomer will pay the  necessary amount to regularize the account   <br><br>\nCustomer is unwilling to regularize the account after all attempts then branch user to follow the protocol as detailed in chapter \u201cAccount closure requests with debit balance/TBMS lien.\u201d  <br><br>\n1) Where the customer is not willing to continue, Branch to ensure that the complete details on Account closure form and all the checks to be made as detailed in the chapter  \u201cGeneral Guidelines to be followed for Account closure\u201d  <br><br>\n2) In case of any incomplete request, the customer needs to be apprised of the requirements and Siebel to be updated accordingly.  <br><br>\n3) If the a/c closure request is complete in all respects / once the complete request is received from the customer, the same needs to be sent to CPC, post updating the Siebel  <br><br>\n4) Branch to journal of the attempts made to retain the customer.  <br><br>\nIn case the BOM/SM/BM/ RBM / AM or the branch staff are able / Not able  to retain the customer, then protthe SR which has been created needs to be closed with the Closure Description in Siebel as, \u201cCustomer Retained\u201d. This needs to be done diligently and would be subject to audits.\n"]}};
            // var ele = new Array("Process");
            // ele2 = [  
            //             "Guidelines",
            //             "Shifting",
            //             "Accessibility",
            //             "Charges"
            //         ];
            // ele=ele.concat(ele2);
            // var ele_val = new Array(data.tiledlist[0]);
            // element_values = [  
            //             "<br>To define general guidelines to be followed by Branches while processing Account Closure. <br><br> Branch should attempt for retention of account before closing the account as opening a new account is expensive. <br><br> Channels through which Account Closure request is received: <br> 1. Customers In Person (CIP) who walk in to the Branch <br>\n2. Representatives/Bearer of customers who walk in to the Branch <br>\n3. Mail / Drop Box <br><br> Check Documentation and Signature Protocol <br><br> Check Mode of Payment for closure Proceeds <br><br> Check for Customer Handling on receipt of request <br><br> Check Process at Branch \u2013Checks during acceptance of closure form <br><br> Check Process at Branch- Post acceptance of Closure form <br><br> ",
            //             "<br>Customer is unwilling to give us another chance  <br>\n1) In case of Issues expressed by the customer where he / she is willing to give the Bank another chance. <br><br>\n2) Branch to attempt fix the problem within 48 hours or 7 days on the outside for extreme cases and revert to the customer. This TAT for revert to be communicated to the customer upfront. <br><br>\n3) Customers to be sent a personalised letter thanking them for their time and an acknowledgement, that we value their business and have remedied whatever caused them to want to leave in the first place. A list of all reasons for closure with the action taken, to be stated.  <br><br>\n4) Once the customer has been retained, the customer letter / form duly marked \u201cNOT FOR CLOSURE \u2013 RETAINED\u201d, along with a copy of the resolution letter to be sent to CPC for filing in the customer record.  <br><br>\n5) Siebel to be updated with the same comment and closed.  <br><br>In case the BOM/SM/BM/ RBM / AM or the branch staff are able / Not able  to retain the customer, then protthe SR which has been created needs to be closed with the Closure Description in Siebel as, \u201cCustomer Retained\u201d. This needs to be done diligently and would be subject to audits.\nCustomer will pay the  necessary amount to regularize the account <br>\nCustomer is unwilling to regularize the account after all attempts then branch user to follow the protocol as detailed in chapter \u201cAccount closure requests with debit balance/TBMS lien.\u201d <br><br>\n1) Where the customer is not willing to continue, Branch to ensure that the complete details on Account closure form and all the checks to be made as detailed in the chapter  \u201cGeneral Guidelines to be followed for Account closure\u201d <br><br>\n2) In case of any incomplete request, the customer needs to be apprised of the requirements and Siebel to be updated accordingly. <br><br>\n3) If the a/c closure request is complete in all respects / once the complete request is received from the customer, the same needs to be sent to CPC, post updating the Siebel <br><br>\n4) Branch to journal of the attempts made to retain the customer. <br><br>\nIn case the BOM/SM/BM/ RBM / AM or the branch staff are able / Not able  to retain the customer, then protthe SR which has been created needs to be closed with the Closure Description in Siebel as, \u201cCustomer Retained\u201d. This needs to be done diligently and would be subject to audits.",
            //             "<br>If customer is closing his/ her account due to inconvenient accessibility, solutions like Home Banking, Beat Pick up facility, etc. should be re-iterated. <br>\nIn case customer has an account which he/ she is not eligible for an accessibility offering he/ she is interested in, an upgraded account should be offered especially if account balances justify it (ensure that new AMB/AQBs and NMCs are communicated clearly).Customer is unwilling to give us another chance  <br><br>\n1) In case of Issues expressed by the customer where he / she is willing to give the Bank another chance.  <br><br>\n2) Branch to attempt fix the problem within 48 hours or 7 days on the outside for extreme cases and revert to the customer. This TAT for revert to be communicated to the customer upfront. <br><br>\n3) Customers to be sent a personalised letter thanking them for their time and an acknowledgement, that we value their business and have remedied whatever caused them to want to leave in the first place. A list of all reasons for closure with the action taken, to be stated.  <br><br>\n4) Once the customer has been retained, the customer letter / form duly marked \u201cNOT FOR CLOSURE \u2013 RETAINED\u201d, along with a copy of the resolution letter to be sent to CPC for filing in the customer record.  <br><br>\n5) Siebel to be updated with the same comment and closed.  <br><br>\nIn case the BOM/SM/BM/ RBM / AM or the branch staff are able / Not able  to retain the customer, then protthe SR which has been created needs to be closed with the Closure Description in Siebel as, \u201cCustomer Retained\u201d.  <br><br> This needs to be done diligently and would be subject to audits.  <br><br>\nCustomer is unwilling to give another chance: < <br><br>> Customer will pay the  necessary amount to regularize the account  <br><br>\nCustomer is unwilling to regularize the account after all attempts then branch user to follow the protocol as detailed in chapter \u201cAccount closure requests with debit balance/TBMS lien.\u201d  <br><br>\n1) Where the customer is not willing to continue, Branch to ensure that the complete details on Account closure form and all the checks to be made as detailed in the chapter  \u201cGeneral Guidelines to be followed for Account closure\u201d  <br><br>\n2) In case of any incomplete request, the customer needs to be apprised of the requirements and Siebel to be updated accordingly.  <br><br>\n3) If the a/c closure request is complete in all respects / once the complete request is received from the customer, the same needs to be sent to CPC, post updating the Siebel  <br><br> \n4) Branch to journal of the attempts made to retain the customer.  <br><br>\nIn case the BOM/SM/BM/ RBM / AM or the branch staff are able / Not able  to retain the customer, then protthe SR which has been created needs to be closed with the Closure Description in Siebel as, \u201cCustomer Retained\u201d. This needs to be done diligently and would be subject to audits.C2",
            //             "<br>1) Customer expresses concerns on high charges, ascertain the nature of charges levied and recommend an upgraded account where required (e.g. if customer finds DD charges high, up-sell to an account with a higher free DD limit or an account offering At Par cheque facility if usage is on our locations). Communicate the AMB/AQB and NMC to customer clearly. <br><br>\n2) The account can be upgraded/downgrade as per customer requirement by retaining the same account Number  <br><br>\n3) Branch can also explain the benefits of Basic/Small Account and offer conversion to the said  account as it will address their inability to maintain the account.  <br><br>\nCustomer is unwilling to give us another chance  <br><br>\n1) In case of Issues expressed by the customer where he / she is willing to give the Bank another chance.  <br><br>\n2) Branch to attempt fix the problem within 48 hours or 7 days on the outside for extreme cases and revert to the customer. This TAT for revert to be communicated to the customer upfront.  <br><br>\n3) Customers to be sent a personalised letter thanking them for their time and an acknowledgement, that we value their business and have remedied whatever caused them to want to leave in the first place. A list of all reasons for closure with the action taken, to be stated.   <br><br>\n4) Once the customer has been retained, the customer letter / form duly marked \u201cNOT FOR CLOSURE \u2013 RETAINED\u201d, along with a copy of the resolution letter to be sent to CPC for filing in the customer record.  <br><br>\n5) Siebel to be updated with the same comment and closed.  <br><br>\nIn case the BOM/SM/BM/ RBM / AM or the branch staff are able / Not able  to retain the customer, then protthe SR which has been created needs to be closed with the Closure Description in Siebel as, \u201cCustomer Retained\u201d. This needs to be done diligently and would be subject to audits.  <br><br>\nCustomer will pay the  necessary amount to regularize the account   <br><br>\nCustomer is unwilling to regularize the account after all attempts then branch user to follow the protocol as detailed in chapter \u201cAccount closure requests with debit balance/TBMS lien.\u201d  <br><br>\n1) Where the customer is not willing to continue, Branch to ensure that the complete details on Account closure form and all the checks to be made as detailed in the chapter  \u201cGeneral Guidelines to be followed for Account closure\u201d  <br><br>\n2) In case of any incomplete request, the customer needs to be apprised of the requirements and Siebel to be updated accordingly.  <br><br>\n3) If the a/c closure request is complete in all respects / once the complete request is received from the customer, the same needs to be sent to CPC, post updating the Siebel  <br><br>\n4) Branch to journal of the attempts made to retain the customer.  <br><br>\nIn case the BOM/SM/BM/ RBM / AM or the branch staff are able / Not able  to retain the customer, then protthe SR which has been created needs to be closed with the Closure Description in Siebel as, \u201cCustomer Retained\u201d. This needs to be done diligently and would be subject to audits.\n"
            //         ]
            // ele_val = ele_val.concat(element_values);
            // //_.insert(ele, "Process", [0]);
            // $rootScope.tabvalue.elements = ele;
            // $rootScope.tabvalue.element_values=ele_val;
            // //$rootScope.$emit("setTabData", $scope.node_data);
           
            
        };
        $rootScope.FAQResponse = function (id,data) {
            $rootScope.pushSystemMsg(id,data);
            $rootScope.showMsgLoader = false; 
        };
        $rootScope.InstructionResponse = function(id,data) {
            $rootScope.pushSystemMsg(id,data);
			console.log(data);
            $('#myCarousel').carousel({
                interval: false,
                wrap: false
            });
            $('#myCarousel').find('.item').first().addClass('active');
            $rootScope.showMsgLoader = false; 
        };
        $rootScope.getQuestionMsg = function (index,value) {
            $rootScope.pushQuesMsg(index,value);
            $rootScope.showMsgLoader = false; 
        };
        $rootScope.getSystemMsg = function(id,value){
            //console.log("id",id);
            //CsrfTokenService.getCookie("csrftoken").then(function(token) {
                $scope.formData = { user_input:value,csrfmiddlewaretoken:$rootScope.getCookie("csrftoken"),auto_id:"",auto_value:"",user_id:$cookies.get("session_id") };
                //var mysessiondata = $.jStorage.get("sessiondata");
                //mysessiondata = mysessiondata.toObject();
                //mysessiondata.data = {id:parseInt(id),Text:value};
				//mysessiondata.data = {id:id,Text:value};
                //$rootScope.formData = mysessiondata;
                $timeout(function(){
                    $(".chatinput").val("");
                });
                //console.log($rootScope.newsid);
                if($rootScope.newsid)
                {
                    if($rootScope.newslist.headline.length > 0) 
                    {
                        
                        $rootScope.cur_b=$rootScope.newslist.body[0];
                        $rootScope.cur_h=$rootScope.newslist.headline[0];
                        $rootScope.cur_i=$rootScope.newslist.image[0];

                        cur_b = $rootScope.cur_b;
                        cur_h = $rootScope.cur_h;
                        cur_i = $rootScope.cur_i;
                        //console.log(cur_b);
                        $(".fancybox-caption").html(cur_b);
                        // _.remove($rootScope.newslist.body, function(cur_b) {
                              
                        // });
                        // _.remove($rootScope.newslist.headline, function(cur_h) {
                              
                        // });
                        // _.remove($rootScope.newslist.image, function(cur_i) {
                              
                        // });
                        $rootScope.newslist.body.shift();
                        $rootScope.newslist.headline.shift();
                        $rootScope.newslist.image.shift();
                       
                        $.jStorage.set("newslist",$rootScope.newslist);
                        $rootScope.newslist = $.jStorage.get("newslist");
                    }
                    else
                    {
                        var formData = {newsid:$rootScope.newsid};
                        apiService.getmorenews({}).then(function (data){    
                            $rootScope.newslist = data.data.data;
                            $rootScope.newsid = data.data.data.id;
                            $.jStorage.set("newslist",$rootScope.newslist);
                            $.jStorage.set("newsid",$rootScope.newsid);
                            
                        });
                    }
                }
                apiService.getCategoryFAQ($scope.formData).then(function (data){
						
                    angular.forEach(data.data.tiledlist, function(value, key) {
                        if(value.type=="text")
                        {
                            data.data.tiledlist[0].Text=$scope.trustedHtml(data.data.tiledlist[0].Text);
                        	$rootScope.pushSystemMsg(0,data.data);
                            $rootScope.showMsgLoader = false;
                            return false;
                        }
                        if(value.type=="form type")
                        {
                            $rootScope.pushSystemMsg(0,data.data);
                            $rootScope.showMsgLoader = false;
                            
                            
                            return false;
                        }
                        if(value.type=="mobile form type")
                        {
                            $rootScope.pushSystemMsg(0,data.data);
                            $rootScope.showMsgLoader = false;
                            
                            
                            return false;
                        }
                        if(value.type=="claim form type")
                        {
                            $rootScope.pushSystemMsg(0,data.data);
                            $rootScope.showMsgLoader = false;
                            
                            
                            return false;
                        }
                        if(value.type=="DTHyperlink")
                        {
                           $rootScope.DthResponse(0,data.data);  
                        }
                        if(value.type=="grievance form type")
                        {
                            $rootScope.pushSystemMsg(0,data.data);
                            $rootScope.showMsgLoader = false;
                            
                            
                            return false; 
                        }
                        if(value.type=="add employee form")
                        {
                            $rootScope.pushSystemMsg(0,data.data);
                            $rootScope.showMsgLoader = false;
                            
                            
                            return false; 
                        }
                        if(value.type=="view employee form")
                        {
                            $rootScope.pushSystemMsg(0,data.data);
                            $rootScope.showMsgLoader = false;
                            
                            
                            return false; 
                        }

                        // if(value.type=="rate card")
                        // {
                        //     $rootScope.pushSystemMsg(0,data.data.data);
                        //     $rootScope.showMsgLoader = false;
                            
                            
                        //     return false;
                        // }
                        // else if(value.type=="Instruction")
                        // {
						// 	$rootScope.InstructionResponse(0,data.data.data);  
                        // }
                        
                    });
                    

                    //$.jStorage.set("sessiondata",data.data.data.session_obj_data);
                }).catch(function (reason) {
                    //console.log(reason);
                    msg = {Text:"Sorry I could not understand",type:"SYS_EMPTY_RES"};
                    $rootScope.pushSystemMsg(0,msg); 
                    $rootScope.showMsgLoader=false;
                });
            //});
            
        };
        
        

        $rootScope.tappedKeys = '';

        $rootScope.onKeyUp = function(e){
            //if(e.key == "ArrowDown" || e.key == "ArrowUp")
            if(e.which == 40 ) // Down arrow
            {
                if($("ul#ui-id-1 li.active").length!=0) {
                    var storeTarget	= $('ul#ui-id-1').find("li.active").next();
                    $("ul#ui-id-1 li.active").removeClass("active");
                    storeTarget.focus().addClass("active");
                    $(".chatinput").val(storeTarget.text());
                    $rootScope.autolistid = $(storeTarget).attr("data-id");
                    $rootScope.autolistvalue = $(storeTarget).attr("data-value");
                    $rootScope.answers = $(storeTarget).attr("data-answers");
                }
                else
                {
                    $('ul#ui-id-1').find("li:first").focus().addClass("active");
                    var storeTarget	= $('ul#ui-id-1').find("li.active");
                    $(".chatinput").val($('ul#ui-id-1').find("li:first").text());
                    $rootScope.autolistid = $('ul#ui-id-1').find("li:first").attr("data-id");
                    $rootScope.autolistvalue = $('ul#ui-id-1').find("li:first").attr("data-value");
                    $rootScope.answers = $(storeTarget).attr("data-answers");
		    	}
                return;
            }
            if(e.which == 38 ) // Up arrow
            {
                if($("ul#ui-id-1 li.active").length!=0) {
                    var storeTarget	= $('ul#ui-id-1').find("li.active").prev();
                    $("ul#ui-id-1 li.active").removeClass("active");
                    storeTarget.focus().addClass("active");
                    $(".chatinput").val(storeTarget.text());
                    $rootScope.autolistid = $(storeTarget).attr("data-id");
                    $rootScope.autolistvalue = $(storeTarget).attr("data-value");
                    $rootScope.answers = $(storeTarget).attr("data-answers");
                }
                else
                {
                    $('ul#ui-id-1').find("li:last").focus().addClass("active");
                    var storeTarget	= $('ul#ui-id-1').find("li.active");
                    $(".chatinput").val($('ul#ui-id-1').find("li:last").text());
                    $rootScope.autolistid = $('ul#ui-id-1').find("li:last").attr("data-id");
                    $rootScope.autolistvalue = $('ul#ui-id-1').find("li:last").attr("data-value");
                    $rootScope.answers = $(storeTarget).attr("data-answers");
		    	}

                return;
            }
            if(e.which == 13) // Enter
            {
                if( $rootScope.answers )
                {
                    $rootScope.pushAutoMsg($rootScope.autolistid,$(".chatinput").val(),$rootScope.answers);
                    $rootScope.autocompletelist = [];
                }
                else if($rootScope.autolistid=="" || $rootScope.autolistid == null)
                {
                    if($(".chatinput").val() != "")
                    {
                        $rootScope.pushMsg("",$(".chatinput").val());
                        $(".chatinput").val("");
                        
                        $rootScope.chatText="";
                    }
                }
                else {
                    $rootScope.pushMsg("",$(".chatinput").val());
                    
                    //$rootScope.pushAutoMsg($rootScope.autolistid,$rootScope.chatText,$rootScope.answers);
                }
                $rootScope.autocompletelist = [];
                //$rootScope.pushMsg("",$(".chatinput").val());
                $(".chatinput").val("");
            }
            if(e.which == 8)
            {
                
                if($(".chatinput").val()=="")
                {
                    $rootScope.autocompletelist = [];
                    $rootScope.chatText = "";
                    $rootScope.autolistid=="";
                    $rootScope.autolistvalue = "";
                    $rootScope.answers = "";
                }
                
            }
            // $rootScope.chatText = "";
            // $rootScope.autolistid=="";
            // $rootScope.autolistvalue = "";
        };
        $rootScope.likeChatClick = function(){
            $timeout(function(){
                $('span.thumbsup').css("color", "#39E61F");
                $('.thumbsdown').css("color", "#1166DD");
            },200);
        };
        $rootScope.$dislikemodalInstance = {};
        $rootScope.dislikesuggestionerror = 0;
        $rootScope.dislikeChatClick = function(){
            $rootScope.$dislikemodalInstance = $uibModal.open({
                scope: $rootScope,
                animation: true,
                size: 'sm',
                templateUrl: 'views/modal/dislikechat.html',
                //controller: 'CommonCtrl'
            });
            $timeout(function(){ 
                $('span.thumbsdown').css("color", "#F32525");
                $('.thumbsup').css("color", "#1166DD");
            },200);
        };
        $rootScope.dislikeCancel = function() {
            //console.log("dismissing");
            $scope.$dislikemodalInstance.dismiss('cancel');
            $('span.thumbsdown').css("color", "#1166DD");
        };
        $rootScope.dislikesuggestionsubmit = function(suggestion){
            console.log("suggestion",suggestion);
            $rootScope.dislikesuggestionSuccess = 1;
            $timeout(function(){
                $rootScope.dislikesuggestionSuccess = 0;
                $rootScope.dislikeCancel();
            },500);
            $('span.thumbsdown').css("color", "#ED6D05");
        };
        $scope.luhnCheck = function(val) {
            var sum = 0;
            for (var i = 0; i < val.length; i++) {
                var intVal = parseInt(val.substr(i, 1));
                if (i % 2 == 0) {
                    intVal *= 2;
                    if (intVal > 9) {
                        intVal = 1 + (intVal % 10);
                    }
                }
                sum += intVal;
            }
            return (sum % 10) == 0;
        };
        //ng-change="getAutocomplete(chatText);"
        $rootScope.validatePolicyNumber = function (number) {
            var regex = new RegExp("^[0-9]{16}$");
            
            if (!regex.test(number))
            {
                console.log(number);
                return false;
            }
            $scope.luhnCheck(number);
        }
       $timeout(function(){
            //$('#chatTabs a:last').tab('show');
       },200);
    })
    
    .controller('FormCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
        $scope.template = TemplateService.getHTML("content/form.html");
        TemplateService.title = "Form"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        $scope.formSubmitted = false;
        // $scope.data = {
        //     name: "Chintan",
        //     "age": 20,
        //     "email": "chinyan@wohlig.com",
        //     "query": "query"
        // };
        $scope.submitForm = function (data) {
            console.log("This is it");
            return new Promise(function (callback) {
                $timeout(function () {
                    callback();
                }, 5000);
            });
        };
    })
    .controller('ViewCtrl', function ($scope, $uibModalInstance, items) {

        $scope.items = items;
        // $scope.selected = {
        //     item: $scope.items[0]
        // };
        var dt = "";
        _.each($scope.items,function(v,k){
            console.log(v);
            dt += "<option value='"+v._id+"'>"+v.name+"</option>";
            
        });
        console.log(dt);
        //$("select#selectbookmark_list").html(dt);
    })
    .controller('GridCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
        $scope.template = TemplateService.getHTML("content/grid.html");
        TemplateService.title = "Grid"; // This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
    })

    // Example API Controller
    .controller('DemoAPICtrl', function ($scope, TemplateService, apiService, NavigationService, $timeout) {
        apiService.getDemo($scope.formData, function (data) {
            console.log(data);
        });
    });