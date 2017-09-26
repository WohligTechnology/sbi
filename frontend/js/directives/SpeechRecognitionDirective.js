/**
 * Author: Nizar BOUSEBSI
 * Description: AngularJS directive to process Speech Recognition in your Cordova & Web application.
 * Usage: Add this directive in your Directives folder.
 */

angular.module('app.directives', []).directive('ngSpeechRecognitionStart', function ($timeout, $rootScope,apiService) {
	return {
		restrict: 'A',
		link: function ($scope, $element, $attrs) {
			
			//if($rootScope.browser=="safari") 
			{

			// if($rootScope.browser=="chrome") {
			// 	var recognition = new window.webkitSpeechRecognition();
			// } else if($rootScope.browser=="firefox") {
			// 	//var recognition = new ( SpeechRecognition || webkitSpeechRecognition || mozSpeechRecognition)();
			// 	var recognition = new SpeechRecognition();
			// } else if($rootScope.browser=="safari") {
			// 	var recognition = new window.msSpeechRecognition();
			// }
			// else if($rootScope.browser=="opera") {
			// 	var recognition = new window.oSpeechRecognition();
			// }
			// else if($rootScope.browser=="msie") {
			// 	var recognition = new window.msSpeechRecognition();
			// }
			// else if($rootScope.browser=="android") {
			// 	//alert("android");
			// 	var recognition = new window.webkitSpeechRecognition();
			// }
			// else if($rootScope.browser=="ios") {
			// 	var recognition = new window.webkitSpeechRecognition();
			// }
			var recognition = new window.webkitSpeechRecognition();
			var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
			console.log("start");
			var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
			recognition.continuous = true;
			recognition.interimResults = false;
			ignore_onend = false;
			final_transcript = '';
			recognition.lang = 'en-us';
			
			var recognitionIsAlreadyCalled = false;

			$element.bind('touchstart mousedown', function (event) {
				$scope.isHolded = true;
				$(this).addClass('hover_effect');
				// if (!navigator.getUserMedia) {
				// 	navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
				// }
				// navigator.getUserMedia({audio:true}, function() {
				// 	//event.target.textContent = 'OK';
				// 	console.log("Allow");
				// }, function() {
				// 	console.log("Error");
				// 	//event.target.textContent = 'ERROR';
				// });
				$timeout(function () {
					if ($scope.isHolded) {
						$scope.$apply(function () {

							if ($attrs.ngSpeechRecognitionStart) {
								$scope.$eval($attrs.ngSpeechRecognitionStart)
								
							}

							if (recognitionIsAlreadyCalled === false) {
								recognitionIsAlreadyCalled = true;
								recognition.start();
								
								recognition.onstart = function() {
									recognizing = true;
									console.log("Started event");
								};
							}
						});
					}
				}, 600);
			});

			$element.bind('touchend mouseup', function (event) {
				$scope.isHolded = false;
				// navigator.getUserMedia({audio:false}, function() {
				// 	//event.target.textContent = 'OK';
				// 	console.log("Stop");
				// }, function() {
				// 	console.log("Error");
				// 	//event.target.textContent = 'ERROR';
				// });
				$(this).removeClass('hover_effect');
               // console.log($attrs.ngSpeechRecognitionEnd);
				if ($attrs.ngSpeechRecognitionEnd) {
					
					$scope.$apply(function () {
						
						recognition.onerror = function(event) {
							if (event.error == 'no-speech') {
							ignore_onend = true;
							console.log("No speech");
							}
							if (event.error == 'audio-capture') {
							ignore_onend = true;
							console.log("No mic");
							}
							if (event.error == 'not-allowed') {
								// if (event.timeStamp - start_timestamp < 100) {
								// 	//showInfo('info_blocked');
								// } else {
								// 	//showInfo('info_denied');
								// }
								ignore_onend = true;
							}
						};
						recognition.onresult = function (event) {
                            console.log("display+--",event);
							if (event.results[0][0].transcript !== undefined) {
								$rootScope.transcript = event.results[0][0].transcript;
                                console.log($rootScope.transcript);
								if (typeof $rootScope.transcript === 'string') {
									 for (var i = event.resultIndex; i < event.results.length; ++i) {
										if (event.results[i].isFinal) {
											final_transcript += event.results[i][0].transcript;
										} else {
											interim_transcript += event.results[i][0].transcript;
										}
									}
                                    $scope.$eval($attrs.ngSpeechRecognitionEnd);
                                     console.log($attrs.ngSpeechRecognitionEnd);
								}
							}
						}
						recognition.stop();
						recognitionIsAlreadyCalled = false;
					});
				}
			});
			}
			// /else
			// {
			// 	$element.bind('touchstart mousedown', function (event) {
			// 		apiService.startRecording("").then(function (response){
            //            // console.log(response.data);
			// 			//$rootScope.autocompletelist = response.data.data;
			// 		});
			// 	});
			// 	$element.bind('touchend mouseup', function (event) {
			// 		// apiService.stopRecording("").then(function (response){
            //         //    // console.log(response.data);
			// 		// 	//$rootScope.autocompletelist = response.data.data;
			// 		// });
			// 	});
			// }
		}
	};
})