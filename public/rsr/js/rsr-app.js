var //Variables
	appVersion = "1.0.10",

	viewFilePaths = [
		"./views/0.html",
		"./views/1.html",
		"./views/2.html",
		"./views/3.html",
		"./views/4.html",
		"./views/5.html",
	],

	activeView = 0,
	appRunning = false,
	monthsArr = ["January","February","March","April","May","June","July","August","September","October","November","December"],
	today = new Date(),
	stepSummaries = [],
	ignoreInvalid = true,
	accessibleErrors = false,
	activeAlert = false,

	//Data object
	offenderData = {
		offenderTitle: 		"",
		firstName: 			"",
		familyName: 		"",
		sex: 				"",
		birthDate: 			"",
		age: 				"",
		pncId: 				"",
		deliusId: 			"",
		assessmentDate: 	"",
		currentOffenceType: "",
		convictionDate: "",
		sentenceDate: "",
		sexualElement: "",
		violentOffenceCategory: "",
		strangerVictim: "",
		firstSanctionDate: "",
		previousSanctions: "",
		violentSanctions: "",
		sexualOffenceHistory: "",
		mostRecentSexualOffence: "",
		contactAdult: "",
		contactChild: "",
		indecentImage: "",
		paraphilia: "",
		oasysInterview: "",
		//OASys
		useWeapon: "",
		partner: "",
		accommodation: "",
		employment: "",
		relationship: "",
		currentUseOfAlcohol: "",
		bingeDrinking: "",
		impulsivity: "",
		temper: "",
		proCriminal: "",
		domesticViolence: "",
		murder: "",
		wounding: "",
		kidnapping: "",
		firearmPossession: "",
		robbery: "",
		burglary: "",
		anyOtherOffence: "",
		endangerLife: "",
		arson: "",
		totalRSR: "",
		rsrType: "static"
	};

function cleanRequest(x) {
	return {
		sex: x.sex,
		birthDate:x.birthDate,
		age: x.age,
		pncId: x.pncId,
		deliusId: x.deliusId,
		assessmentDate: x.assessmentDate,
		currentOffenceType: x.currentOffenceType,
		convictionDate: x.convictionDate,
		sentenceDate: x.sentenceDate,
		sexualElement: x.sexualElement,
		violentOffenceCategory: x.violentOffenceCategory,
		strangerVictim: x.strangerVictim,
		firstSanctionDate: x.firstSanctionDate,
		previousSanctions: x.previousSanctions,
		violentSanctions: x.violentSanctions,
		sexualOffenceHistory: x.sexualOffenceHistory,
		mostRecentSexualOffence: x.mostRecentSexualOffence,
		contactAdult: x.contactAdult,
		contactChild: x.contactChild,
		indecentImage: x.indecentImage,
		paraphilia: x.paraphilia,
		oasysInterview: x.oasysInterview,
		useWeapon: x.useWeapon,
		accommodation: x.accommodation,
		employment: x.employment,
		relationship: x.relationship,
		currentUseOfAlcohol: x.currentUseOfAlcohol,
		bingeDrinking: x.bingeDrinking,
		impulsivity: x.impulsivity,
		temper: x.temper,
		proCriminal: x.proCriminal,
		domesticViolence: x.domesticViolence,
		murder: x.murder,
		wounding: x.wounding,
		kidnapping:x.kidnapping,
		firearmPossession: x.firearmPossession,
		robbery: x.robbery,
		burglary: x.burglary,
		anyOtherOffence:x.anyOtherOffence,
		endangerLife: x.endangerLife,
		arson: x.arson,
	};
}

function init() {
	function loadViews(a) {
		if (a < viewFilePaths.length) {

			$("#view"+activeView).load(viewFilePaths[activeView], function() {
				activeView++;
				loadViews(activeView);
			});
		} else {
			activeView = 0;

			bindEvents();
		}
	};

	function createViews() {
		var $viewDiv;
		for (var i=0; i < viewFilePaths.length; i++) {
			$viewDiv = $("<div>", {id: "view"+i, css: {display: "block", position: "absolute", left: "-10000px"}, rel: i });
			$viewDiv.appendTo(".main");
		}

		loadViews(activeView);
	};

	$.support.cors = true;
	$(document).ready(function() {
		createViews();
	});
};

function bindEvents() {
	$(document).ready(function(){
		// Set up deeplinking

		//checkURL();


		hashUrl = $.sammy(function() {

					this.get('#', function() {
						quitClear();
					});

					this.get(/\#(.*)/, function() {
						var qStr = this.params['splat'][0];
						if (appRunning && qStr.indexOf("view") != -1 && parseInt(qStr.substr(4, qStr.length)) > 0) {
							switchView(qStr.substr(4, qStr.length));
						} else if (qStr.indexOf("pre") != -1) {
							prePopulate();
							//console.log("PREPOPULATING");
						} else {
							quitClear();
						}

					});

				});

		hashUrl.run('#');



		// Some initial stuff
		window.document.title = "RSR v" + appVersion;
		$('#app-version').html(appVersion);



		// Create arrays from each select to index selected answers
		$("select").each(function(i) {
			if ($(this).attr('id').indexOf('date') == -1 && $(this).attr('id').indexOf('month') == -1 && $(this).attr('id').indexOf('year') == -1 && $(this).attr('id').indexOf('offender_title') == -1) {
				var s = $(this).attr('id').split('_');

				var n = s[0];
				for (var i=1; i<s.length; i++) {
					if (s[i] != undefined && s[i] != '') {
						n += s[i].charAt(0).toUpperCase();
						n += s[i].slice(1);
					}
				}

				offenderData[n + '_options'] = [];

				$(this).children().each(function(j){
					if ($(this).val() != '') {
						offenderData[n + '_options'].push($(this).text());
					}
				});
			}

		});

		$(".progress__label > a, .section-header > a").each(function(index) {
			var l = $(this).prop('href');
			//$(this).prop('href', 'javascript:void(0)');

			$(this).bind("click", function(event) {
				window.location.href = l;
				//getURLParameter();
				//checkURL();
			});
		});

		// Exit button quits the app and composes the data into an email

		$("#view" + String(viewFilePaths.length-1) + " #exit-btn").bind("click touch", function(event) {
			event.preventDefault();
			quitClear();
		});

		// Top title link also quits the app
		$("#proposition-name").bind("click touch", function(event) {
			quitClear();
		});

		// Accessible error messages option
		$("#accessible_errors").bind("click touch", function(event) {
			accessibleErrors = !accessibleErrors;
			//console.log("accessibleErrors: " + accessibleErrors);
		});
		$("#accessible_errors").prop('checked', false);

		jQuery.validateExtend({
				date : {
						required : true,
						conditional : function(value) {
								return isDate($(this).attr('id').split('_')[0]);
						}
				}
		});

		// Add date validation and years to all date picker dropdowns
		$("select[id*='_year']").each(function(index) {

			for (var j=today.getFullYear(); j>=1900; j--) {
				$(this).append("<option value='" + j + "'>" + j + "</option>");
			}
		});

		// Show intro (view0)
		$("#view0")
			.attr("aria-hidden", "false")
			.css({display:"block", position:"relative", left:"0"});
		$("#user-nav")
			.addClass("collapsed-extra-panel")
			.attr("aria-hidden", "true")
			.attr("tabindex", "-1")
			.css("height", "0");


		$('#accessible_errors').attr("tabindex", "-1");
		$('#quitclear').attr("tabindex", "-1");

		$('html, body').animate({ scrollTop: 0}, 800, $.bez([.44,1.37,.57,1]));

		$("#view1").attr("aria-hidden", "true");
		// Testing catch-all AT fix
		$("#view1 *").attr("tabindex", "-1");

		$("#view2").attr("aria-hidden", "true");
		$("#view2 *").attr("tabindex", "-1");

		$("#view3").attr("aria-hidden", "true");
		$("#view3 *").attr("tabindex", "-1");

		$("#view4").attr("aria-hidden", "true");
		$("#view4 *").attr("tabindex", "-1");

		$("#view5").attr("aria-hidden", "true");
		$("#view5 *").attr("tabindex", "-1");


		view1Actions();
		view2Actions();
		view3Actions();
		view4Actions();


		// Start button actions
		$("#view0").find("#submit-btn").bind("click touch", function(event) {

			$("#view1")
			.attr("aria-hidden", "true")
			.css({display:"none", position:"relative", left:"0"});
			$("#view2")
			.attr("aria-hidden", "true")
			.css({display:"none", position:"relative", left:"0"});
			$("#view3")
			.attr("aria-hidden", "true")
			.css({display:"none", position:"relative", left:"0"});
			$("#view4")
			.attr("aria-hidden", "true")
			.css({display:"none", position:"relative", left:"0"});
			$("#view5")
			.attr("aria-hidden", "true")
			.css({display:"none", position:"relative", left:"0"});

			$("#user-nav")
				.removeClass("collapsed-extra-panel")
				.addClass("expanded-extra-panel")
				.attr("aria-hidden", "false")
				.removeAttr("tabindex")
				.css("height", "auto")
				.css("min-height", "49px");

			$('#accessible_errors').removeAttr("tabindex");
			$('#quitclear').removeAttr("tabindex");

			appRunning = true;

			switchView(1);

		});
	});

};

function prePopulate() {
	// View 1
	$('#offender_title').val('Mr').prop('selected', true);
	$('#offender_first_name').val('John');
	$('#offender_family_name').val('Doe');
	$('#offender_sex').val('0').prop('selected', true);
	// DOB
	$('#birth_date').val('1').prop('selected', true);
	$('#birth_month').val('January').prop('selected', true);
	$('#birth_year').val('1970').prop('selected', true);

	$('#offender_pnc').val('1234/1234567W');
	$('#offender_delius').val('W1234567');

	$("#view1 #assessment_date > option[value=" + today.getDate() + "]").prop('selected', true);
	$("#view1 #assessment_month > option[value=" + monthsArr[today.getMonth()] + "]").prop('selected', true);
	$("#view1 #assessment_year > option[value=" + today.getFullYear() + "]").prop('selected', true);

	// View2
	$('#offence_type').val('4').prop('selected', true);

	$('#conviction_date').val('1').prop('selected', true);
	$('#conviction_month').val('January').prop('selected', true);
	$('#conviction_year').val('2010').prop('selected', true);
	$('#sentence_date').val('1').prop('selected', true);
	$('#sentence_month').val('January').prop('selected', true);
	$('#sentence_year').val('2016').prop('selected', true);

	$('#sexual_element').val('1').prop('selected', true);
	//$('#stranger_victim').val('0').prop('selected', true);
	//$('#violent_offence_category').val('0').prop('selected', true);

	// View3
	$('#sanction_date').val('1').prop('selected', true);
	$('#sanction_month').val('January').prop('selected', true);
	$('#sanction_year').val('2004').prop('selected', true);

	$('#previous_sanctions').val('6');
	$('#violent_sanctions').val('4');
	$('#sexual_offence_history').val('1').prop('selected', true);

	$('#most_recent_sexual_offence_date').val('1').prop('selected', true);
	$('#most_recent_sexual_offence_month').val('January').prop('selected', true);
	$('#most_recent_sexual_offence_year').val('2009').prop('selected', true);

	$('#contact_adult').val('2');
	$('#contact_child').val('0');
	$('#indecent_image').val('0');
	$('#paraphilia').val('0')

	// View4
	$('#oasys_interview').val('1').prop('selected', true);

}

function showAccessibleErrors() {
	//console.log("Active alert: " + activeAlert);
	if (!activeAlert) {

		if (accessibleErrors) {
			var msg = '';
			$('#view' + activeView + ' .has-error').find('span.required').each(function(j){
				msg += '<li>' + $(this).text() + '</li>\n';
			});


			if (msg != '') {
				//alert(msg);
				var fullMsg = '<div aria-labelledby="error-heading" class="validation-summary group" id="error-summary" role="alert" tabindex="0" aria-live="assertive"><h2 id="error-heading">Please complete the missing or invalid entries in the form below.</h2><ul>' + '\n' + msg + '</ul></div>';

				$('#view' + activeView + ' .section-header').last().parent().prepend(fullMsg);
				$('#view' + activeView + ' #error-summary').focus();
				$('html, body').animate({ scrollTop: $('#view' + activeView + ' #error-summary').offset().top-30}, 800, $.bez([.44,1.37,.57,1]));
			}
		} else {
			if (typeof $('#view' + activeView + ' .has-error').find('input[type=text], select').first().offset() != 'undefined') {
			//console.log("Scroll to: " + $('#view' + activeView + ' .has-error').offset().top);
			$('#view' + activeView + ' .has-error').find('input[type=text], select').first().focus();

			$('html, body').animate({
				scrollTop: $('#view' + activeView + ' .has-error').find('input[type=text], select').first().offset().top-30
			}, 800, $.bez([.44,1.37,.57,1]));

			// Update to new alert box

			}
		}

		activeAlert = true;

		setTimeout(function(){
			activeAlert = false;
		}, 1500);
	}

}

// View 1 specific events
function view1Actions() {

	$("#view1 #assessment_date > option[value=" + today.getDate() + "]").prop('selected', true);
	$("#view1 #assessment_month > option[value=" + monthsArr[today.getMonth()] + "]").prop('selected', true);
	$("#view1 #assessment_year > option[value=" + today.getFullYear() + "]").prop('selected', true);

	// On submit, validate the form
	$("#view1 #submit-btn").bind("click touch", function(event) {
		$('#view' + activeView + ' #error-summary').remove();
		event.preventDefault();

		offenderData.birthDate = null;
		offenderData.assessmentDate = null;

		offenderData.birthDate = new Date($('#birth_year').val(),$.inArray($('#birth_month').val(), monthsArr), $('#birth_date').val());
		offenderData.assessmentDate = new Date($('#assessment_year').val(), $.inArray($('#assessment_month').val(), monthsArr), $('#assessment_date').val());

		// console.log("**************** OUTPUT *************");
		// moj.Modules.RSRCalc.printSortedOffenderData(offenderData);

		//console.log("offenderData.assessmentDate: " + offenderData.assessmentDate);
		//console.log("offenderData.birthDate: " + offenderData.birthDate);

		if (dateDiffforage(offenderData.assessmentDate, offenderData.birthDate) > 17) {
			ignoreInvalid = true;
			$('span#birth_date-description')
				.removeClass("required")
				.text("")
				.closest('.row').removeClass('has-error').addClass('has-success');
			$('#step1form').submit();
		} else {
			$('span#birth_date-description')
				.addClass("required")
				.text("Offender must be an adult")
				.closest('.row').removeClass('has-success').addClass('has-error');
				showAccessibleErrors();
		}
	});

	$('#step1form').validate({
		onChange: true,
		onBlur: false,
		onSubmit: true,
		sendForm: false,
		invalid : function() {
			//console.log("Invalid fields");
			showAccessibleErrors();
		},
		valid: function() {
			//console.log("VALID fields");

			offenderData.offenderTitle = $('#offender_title').val();
			offenderData.firstName = $('#offender_first_name').val();
			offenderData.familyName = $('#offender_family_name').val();
			offenderData.sex = $('#offender_sex').val();
			offenderData.birthDate = new Date($('#birth_year').val(), $.inArray($('#birth_month').val(), monthsArr), $('#birth_date').val());
			offenderData.age = dateDiffage(today, offenderData.birthDate);
			//offenderData.age = parseInt((today - new Date($('#birth_year').val(), $.inArray($.inArray($('#birth_month').val(), monthsArr), monthsArr), $('#birth_date').val()));
			offenderData.pncId = $('#offender_pnc').val();
			offenderData.deliusId = $('#offender_delius').val();
			offenderData.assessmentDate = new Date($('#assessment_year').val(), $.inArray($('#assessment_month').val(), monthsArr), $('#assessment_date').val());


			var ind = parseInt(offenderData.sex);
			//ind++;

			//console.log("offenderData.sex: " + offenderData.sex);
			//console.log("ind: " + ind);

			if (offenderData.offenderTitle != ' - ') {
				stepSummaries[0] = '<p>The offender is <strong>' + offenderData.offenderTitle  + ' ' + offenderData.firstName + ' ' + offenderData.familyName + '</strong>, <strong>' + offenderData.age + ' year old ' + offenderData.offenderSex_options[ind].toLowerCase() + '</strong>.</p>';
			} else {
				stepSummaries[0] = '<p>The offender is <strong>' + offenderData.firstName + ' ' + offenderData.familyName + '</strong>, <strong>' + offenderData.age + ' year old ' + offenderData.offenderSex_options[ind].toLowerCase() + '</strong>.</p>';
			}


			$('#view2 #offender-details-summary').html(stepSummaries[0]);

			ignoreInvalid = true;
			//window.location.href = './index.html#view1';
			window.location.href = $("#view1 #submit-btn").attr('data-href');
			//window.location.href = $("#view1 #submit-btn").attr('data-href');
			//hashUrl.run('$("#view1 #submit-btn").attr("data-href")');
			//getURLParameter();
				//checkURL();
		},
		eachValidField : function() {
			//if (!$(this).closest('.row').hasClass('date-picker')) {
				$(this).closest('.row').removeClass('has-error').addClass('has-success');
			//}
		},
		eachInvalidField : function() {
			//if (!$(this).closest('.row').hasClass('date-picker')) {
			if ($(this).attr('id') != 'offender_pnc' && $(this).attr('id') != 'offender_delius') {
				$(this).closest('.row').removeClass('has-success').addClass('has-error');
			}
		},
		description : {
			offender_title: {
				required 	: '<span class="required">Title is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			offender_first_name: {
				required 	: '<span class="required">First name is required</span>',
				pattern 	: '<span class="required">First name should only contain letters</span>',
				conditional : '',
				valid 		: ''
				},
			offender_family_name: {
				required 	: '<span class="required">Family name is required</span>',
				pattern 	: '<span class="required">Family name should only contain letters</span>',
				conditional : '',
				valid 		: ''
				},
			offender_sex: {
				required 	: '<span class="required">Offender&rsquo;s sex is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},

			birth_date: {
				required 	: dateErrorMessage('The full birth date is required', 'birth'),
				pattern 	: '',
				conditional : dateErrorMessage('Please enter a valid date', 'birth'),
				valid 		: ''
			},
			/*
			offender_pnc: {
				required 	: '<span class="required">PNC ID is required</span>',
				pattern 	: '<span class="required">PNC ID has a YYYY/NNNNNNND format</span>',
				conditional : '',
				valid 		: '<span class="field-ok"> </span>'
			},

			offender_delius: {
				required 	: '<span class="required">Delius ID is required</span>',
				pattern 	: '<span class="required">Delius ID has a ANNNNNN format</span>',
				conditional : '',
				valid 		: '<span class="field-ok"> </span>'
			},
			*/
			assessment_date: {
				required 	: dateErrorMessage('The full assessment date is required', 'assessment'),
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			assessment_month: {
				required 	: dateErrorMessage('The full assessment date is required', 'assessment'),
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			assessment_year: {
				required 	: dateErrorMessage('The full assessment date is required', 'assessment'),
				pattern 	: '',
				conditional : '',
				valid 		: ''
			}
		}
	});

};

function dateErrorMessage (msg, target)  {
	//
	return '<span class="required" id="' + target + '_date-description">' + msg + '</span>';
}

// View 2 specific events
function view2Actions () {

	setupView2Panels();

	// On submit, validate the form
	$("#view2 #submit-btn").bind("click touch", function(event) {
		$('#view' + activeView + ' #error-summary').remove();
		event.preventDefault();

		//console.log("Datediff: " + dateDiff(offenderData.sentenceDate, offenderData.convictionDate));

		offenderData.convictionDate = new Date($('#conviction_year').val(), $.inArray($('#conviction_month').val(), monthsArr), $('#conviction_date').val());
		offenderData.sentenceDate = new Date($('#sentence_year').val(), $.inArray($('#sentence_month').val(), monthsArr), $('#sentence_date').val());

		//console.log(monthDiff(offenderData.assessmentDate, offenderData.sentenceDate));

		if (isDate('conviction') && isDate('sentence')) {
			if (dateDiff(offenderData.sentenceDate, offenderData.convictionDate) >= 0) {
				ignoreInvalid = true;
				$('span#conviction_date-description')
					.removeClass("required")
					.text("")
					.closest('.row').removeClass('has-error').addClass('has-success');
				$('#step2form').submit();
			} else {
				$('span#conviction_date-description')
					.addClass("required")
					.text("Conviction date must be earlier than sentence date")
					.closest('.row').removeClass('has-success').addClass('has-error');
					showAccessibleErrors();
			}
		} else {
			ignoreInvalid = false;
			$('#step2form').submit();
		}
	});

	$('#step2form').validate({
		onChange: true,
		onBlur: false,
		onSubmit: true,
		sendForm: false,
		invalid : function() {
			//console.log("Invalid fields " + ignoreInvalid);

			if (ignoreInvalid) {
				view2Complete();
			} else {
				//console.log("Invalid fields");

				showAccessibleErrors();
			}
		},
		valid : function() {
			view2Complete();
		},
		eachValidField : function() {
			$(this).closest('.row').removeClass('has-error').addClass('has-success');
		},
		eachInvalidField : function() {
			//console.log("Invalid: " + $(this).prop("id") + "  attr:" + $(this).attr("data-required"));

			if (ignoreInvalid && $(this).attr("data-required")=="true") {
				ignoreInvalid = false;
			}
				$(this).closest('.row').removeClass('has-success').addClass('has-error');
		},
		description : {
			offence_type: {
				required 	: '<span class="required">Offence type is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			conviction_date: {
				required 	: dateErrorMessage('The full conviction date is required', 'conviction'),
				pattern 	: '',
				conditional : dateErrorMessage('Please enter a valid date', 'conviction'),
				valid 		: ''
			},
			sentence_date: {
				required 	: dateErrorMessage('The full sentence date is required', 'sentence'),
				pattern 	: '',
				conditional : dateErrorMessage('Please enter a valid date', 'sentence'),
				valid 		: ''
			},
			sexual_element: {
				required 	: '<span class="required">The sexual element field is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			stranger_victim: {
				required 	: '<span class="required">The stranger victim field is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			violent_offence_category: {
				required 	: '<span class="required">Violent offence category is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			}
		}
	});

};

function view2Complete () {
	//console.log("VALID fields");
	offenderData.currentOffenceType = $('#offence_type').val();
	offenderData.convictionDate = new Date($('#conviction_year').val(), $.inArray($('#conviction_month').val(), monthsArr), $('#conviction_date').val());
	offenderData.sentenceDate = new Date($('#sentence_year').val(), $.inArray($('#sentence_month').val(), monthsArr), $('#sentence_date').val());
	offenderData.sexualElement = $('#sexual_element').val();
	offenderData.strangerVictim = $('#stranger_victim').val();
	offenderData.violentOffenceCategory = $('#violent_offence_category').val();

	var ind = parseInt(offenderData.currentOffenceType);
	//ind++;

	stepSummaries[1] = '<p>The type of offence is <strong>' + offenderData.offenceType_options[ind] + '</strong> ';
	if (offenderData.sexualElement == "0") {
		stepSummaries[1] += 'and <strong>has a sexual element or motivation</strong>.</p>';
	} else {
		stepSummaries[1] += 'and <strong>does not</strong> have a sexual element or motivation.</p>';
	}

	$('#view3 #offender-details-summary').html(stepSummaries[0]);
	$('#view3 #current-offence-summary').html(stepSummaries[1]);

	window.location.href = $("#view2 #submit-btn").attr('data-href');
	ignoreInvalid = true;
	//getURLParameter();
				//checkURL();
}

// View 3 specific events
function view3Actions () {

	setupView3Panels();
	var datesOK = false;
	var addHeight = 0;
	var orHeight = $("#view3 #sexual-offence-history-details").prop("data-original-height");
	//ignoreInvalid = false;

	// On submit, validate the form
	$("#view3 #submit-btn").bind("click touch", function(event) {
		$('#view3 #error-summary').remove();
		event.preventDefault();
		addHeight = 0;
		ignoreInvalid = false;
		datesOK = false;
		$('#step3form').submit();

		if ($('#view3 #sexual-offence-history-details').hasClass('expanded-extra-panel')) {
			//console.log("dateDiff sanction most recent: " + dateDiff(offenderData.firstSanctionDate, offenderData.mostRecentSexualOffence));

			offenderData.mostRecentSexualOffence = new Date($('#most_recent_sexual_offence_year').val(), $.inArray($('#most_recent_sexual_offence_month').val(), monthsArr), $('#most_recent_sexual_offence_date').val());
			offenderData.firstSanctionDate = new Date($('#sanction_year').val(), $.inArray($('#sanction_month').val(), monthsArr), $('#sanction_date').val());
			//console.log("most_recent_sexual_offence: " + offenderData.mostRecentSexualOffence);
			//console.log("Age at fisrt sanction" + dateDiff(offenderData.firstSanctionDate, offenderData.birthDate));
			//if (isDate('sanction') && isDate('most_recent_sexual_offence')) {
				if (dateDiff(offenderData.firstSanctionDate, offenderData.mostRecentSexualOffence) <= 0) {
					//console.log("Later");
					//ignoreInvalid = true;
					$('span#most_recent_sexual_offence-description')
						.removeClass("required")
						.text("")
						.closest('.row').removeClass('has-error').addClass('has-success');
					datesOK = true;
					$('#step3form').submit();
				} else {
					//console.log("Earlier");
					datesOK = false;
					ignoreInvalid = false;
					$('span#most_recent_sexual_offence-description')
						.addClass("required")
						.text("The most recent sexual offence date should be a valid date, later than the first sanction date")
						.closest('.row').removeClass('has-success').addClass('has-error');
						showAccessibleErrors();
				}
			// } else {
			// 	ignoreInvalid = false;
			// 	$('#step3form').submit();
			// }

		} else if ($('#sanction_date').closest('.row').hasClass('has-success') && $('#previous_sanctions').closest('.row').hasClass('has-success') && $('#violent_sanctions').closest('.row').hasClass('has-success') && $('#sexual_offence_history').closest('.row').hasClass('has-success')) {
			//console.log('collapsed');
			ignoreInvalid = true;
			$('#step3form').submit();
		}


	});

	$('#step3form').validate({
		onChange: true,
		onBlur: false,
		onSubmit: true,
		sendForm: false,
		invalid : function() {
			//console.log("Invalid fields " + ignoreInvalid);

			if (ignoreInvalid) {
				view3Complete();
			} else {

				showAccessibleErrors();
			}
		},
		valid : function() {
			if (datesOK || ignoreInvalid) {
				view3Complete();
			}
		},


		eachValidField : function() {
			$(this).closest('.row').removeClass('has-error').addClass('has-success');

			if ($('#view3 #sexual-offence-history-details').hasClass('expanded-extra-panel') && addHeight >= 40) {
				addHeight -= 40;
				$("#view3 #sexual-offence-history-details").css('height', parseInt(orHeight+addHeight) + 'px');
			}

		},
		eachInvalidField : function() {
			if (ignoreInvalid && $(this).prop("data-required")=="true") {
				ignoreInvalid = false;
			}
			$(this).closest('.row').removeClass('has-success').addClass('has-error');
			if ($('#view3 #sexual-offence-history-details').hasClass('expanded-extra-panel')) {
				if (addHeight < $('#view3').find('.expanded-extra-panel > .row').length * 40) {
					addHeight += 40;
				}
				$("#view3 #sexual-offence-history-details").css('height', parseInt(orHeight+addHeight) + 'px');
			}
		},

		description : {
			sanction_date: {
				required 	: dateErrorMessage('The full sanction date is required', 'sanction'),
				pattern 	: '',
				conditional : dateErrorMessage('Please enter a valid date', 'sanction'),
				valid 		: ''
			},

			previous_sanctions: {
				required 	: '<span class="required">The number of previous sanctions is required</span>',
				pattern 	: '<span class="required">The number of previous sanctions should be a number</span>',
				conditional : '',
				valid 		: ''
			},

			violent_sanctions: {
				required 	: '<span class="required">The number of violent sanctions is required</span>',
				pattern 	: '<span class="required">The number of violent sanctions should be a number</span>',
				conditional : '',
				valid 		: ''
			},

			sexual_offence_history: {
				required 	: '<span class="required">The sexual offence history field is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			most_recent_sexual_offence_date: {
				required 	: dateErrorMessage('The date of most recent sexual offence is required', 'most_recent_sexual_offence'),
				pattern 	: '',
				conditional : dateErrorMessage('Please enter a valid date', 'most_recent_sexual_offence'),
				valid 		: ''
			},
			contact_adult: {
				required 	: '<span class="required">The number of contact adult offences is required</span>',
				pattern 	: '<span class="required">The number of contact adult offences should be a number</span>',
				conditional : '',
				valid 		: ''
			},
			contact_child: {
				required 	: '<span class="required">The number of contact child offences is required</span>',
				pattern 	: '<span class="required">The number of contact child offences should be a number</span>',
				conditional : '',
				valid 		: ''
			},
			indecent_image: {
				required 	: '<span class="required">The number of indecent image offences is required</span>',
				pattern 	: '<span class="required">The number of indecent image offences should be a number</span>',
				conditional : '',
				valid 		: ''
			},
			paraphilia: {
				required 	: '<span class="required">The number of paraphilia offences is required</span>',
				pattern 	: '<span class="required">The number of paraphilia offences should be a number</span>',
				conditional : '',
				valid 		: ''
			}
		}
	});
};

function view3Complete () {
	//console.log("VALID fields");
	offenderData.firstSanctionDate = new Date($('#sanction_year').val(), $.inArray($('#sanction_month').val(), monthsArr), $('#sanction_date').val());
	offenderData.previousSanctions = parseInt($('#previous_sanctions').val());
	offenderData.violentSanctions = parseInt($('#violent_sanctions').val());
	offenderData.sexualOffenceHistory = $('#sexual_offence_history').val();
	offenderData.mostRecentSexualOffence = new Date($('#most_recent_sexual_offence_year').val(), $.inArray($('#most_recent_sexual_offence_month').val(), monthsArr), $('#most_recent_sexual_offence_date').val());
	offenderData.contactAdult = parseInt($('#contact_adult').val());
	offenderData.contactChild = parseInt($('#contact_child').val());
	offenderData.indecentImage = parseInt($('#indecent_image').val());
	offenderData.paraphilia = parseInt($('#paraphilia').val());

	var dateSinceFirstSanction = dateDiff(today, offenderData.firstSanctionDate);

	//console.log('dateSinceFirstSanction: ' + dateSinceFirstSanction);

	if (offenderData.previousSanctions=='0') {
		stepSummaries[2] = '<p>The offender has <strong>no previous sanctions</strong>';

	} else {
		stepSummaries[2] = '<p>The offender has <strong>' + offenderData.previousSanctions + ' previous sanction(s)</strong>';
	}

	if (dateSinceFirstSanction > 0) {
		stepSummaries[2] += ' over the last <strong>' + dateSinceFirstSanction + ' year(s)</strong>';
		if (parseInt(offenderData.violentSanctions)>0) {
			stepSummaries[2] += ', including <strong>violent offences</strong>';
		}
		if (offenderData.sexualOffenceHistory == "0") {
			stepSummaries[2] += ', <strong>with a record of statutory sexual offences</strong>';
		} else {
			stepSummaries[2] += ', with <strong>no history</strong> of statutory sexual offences';
		}
	}
	stepSummaries[2] += '.';

	$('#view4 #offender-details-summary').html(stepSummaries[0]);
	$('#view4 #current-offence-summary').html(stepSummaries[1]);
	$('#view4 #criminal-history-summary').html(stepSummaries[2]);

	window.location.href = $("#view3 #submit-btn").attr('data-href');
	ignoreInvalid = true;
	//getURLParameter();
				//checkURL();
}


// View 4 specific events
function view4Actions () {

	setupView4Panels();

	ignoreInvalid = false;
	var addHeight = 0;
	var orHeight = $("#view4 #oasys-details").prop("data-original-height");

	$("#view4 #submit-btn").bind("click touch", function(event) {
		$('#view' + activeView + ' #error-summary').remove();
		event.preventDefault();
		addHeight = 0;
		if($('#oasys_interview').val() == '1') {
			ignoreInvalid = true;
		} else {
			ignoreInvalid = false;
		}
		$('#step4form').submit();
	});

	 $('#step4form').validate({
		onChange: true,
		onBlur: false,
		onSubmit: true,
		sendForm: false,
		invalid : function() {
			//console.log("Invalid fields " + ignoreInvalid);

			if (ignoreInvalid) {
				view4Complete();
			} else {

				showAccessibleErrors();

			}
		},
		valid : function() {
			view4Complete();

		},
		eachValidField : function() {
			$(this).closest('.row').removeClass('has-error').addClass('has-success');
			//ignoreInvalid = false;
			if ($('#oasys_interview').val() == '0' && addHeight >= 40) {
				addHeight -= 40;
				//console.log("addHeight: " + addHeight);
				$("#view4 #oasys-details").css('height', parseInt(orHeight+addHeight) + 'px');
			}

		},
		eachInvalidField : function() {
			if (ignoreInvalid && $(this).prop("data-required")=="true") {
				ignoreInvalid = false;
			}
			$(this).closest('.row').removeClass('has-success').addClass('has-error');
			if ($('#oasys_interview').val() == '0') {
				addHeight += 40;
				//console.log("addHeight: " + addHeight);
				$("#view4 #oasys-details").css('height', parseInt(orHeight+addHeight) + 'px');
			}
		},
		description : {
			oasys_interview: {
				required 	: '<span class="required">The OASys interview field is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			murder: {
				required 	: '<span class="required">The murder field is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			wounding: {
				required 	: '<span class="required">The wounding field is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			burglary: {
				required 	: '<span class="required">The burglary field is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			arson: {
				required 	: '<span class="required">The arson field is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			endager_life: {
				required 	: '<span class="required">The criminal damage field is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			kidnapping: {
				required 	: '<span class="required">The kidnapping field is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			firearm_possession: {
				required 	: '<span class="required">The firearm possession field is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			robbery: {
				required 	: '<span class="required">The robbery field is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			any_other_offence: {
				required 	: '<span class="required">The weapon offence field is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			use_weapon: {
				required 	: '<span class="required">The use of weapon field is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			partner: {
				required 	: '<span class="required">The partner field is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			accommodation: {
				required 	: '<span class="required">The accommodation field is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			employment: {
				required 	: '<span class="required">The employment field is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			relationship: {
				required 	: '<span class="required">The relationship field is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			domestic_violence: {
				required 	: '<span class="required">The domestic violence field is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			current_use_of_alcohol: {
				required 	: '<span class="required">The use of alcohol field is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			binge_drinking: {
				required 	: '<span class="required">The binge drinking field is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			impulsivity: {
				required 	: '<span class="required">The impulsivity field is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			temper: {
				required 	: '<span class="required">The temper field is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			},
			pro_criminal: {
				required 	: '<span class="required">The pro criminal attitude field is required</span>',
				pattern 	: '',
				conditional : '',
				valid 		: ''
			}
		}
	});

};

function view4Complete () {

	if ($('#oasys_interview').val() != "0") {
		stepSummaries[3] = "<p>Offender interview and/or OASys has <strong>not been completed</strong>.</p>";
		offenderData.oasysInterview = 1;
		offenderData.rsrType = "static";
	} else {
		stepSummaries[3] = "<p>Offender interview and/or OASys has been completed.</p>";
		offenderData.oasysInterview = 0;
		offenderData.rsrType = "dynamic";
	}

	offenderData.useWeapon = $('#use_weapon').val();
	offenderData.partner = $('#partner').val();
	offenderData.accommodation = $('#accommodation').val();
	offenderData.employment = $('#employment').val();
	offenderData.relationship = $('#relationship').val();
	offenderData.currentUseOfAlcohol = $('#current_use_of_alcohol').val();
	offenderData.bingeDrinking = $('#binge_drinking').val();
	offenderData.impulsivity = $('#impulsivity').val();
	offenderData.temper = $('#temper').val();
	offenderData.proCriminal = $('#pro_criminal').val();
	offenderData.domesticViolence = $('#domestic_violence').val();
	offenderData.murder = $('#murder').val();
	offenderData.wounding = $('#wounding').val();
	offenderData.kidnapping = $('#kidnapping').val();
	offenderData.firearmPossession = $('#firearm_possession').val();
	offenderData.robbery = $('#robbery').val();
	offenderData.burglary = $('#burglary').val();
	offenderData.anyOtherOffence = $('#any_other_offence').val();
	offenderData.endangerLife = $('#endanger_life').val();
	offenderData.arson = $('#arson').val();

	$('#view5 #offender-details-summary').html(stepSummaries[0]);
	$('#view5 #current-offence-summary').html(stepSummaries[1]);
	$('#view5 #criminal-history-summary').html(stepSummaries[2]);
	$('#view5 #oasys-summary').html(stepSummaries[3]);

	view5Actions();

	window.location.href = $("#view4 #submit-btn").attr('data-href');
	ignoreInvalid = true;
}

function getRSRBand(x) {
	if (x >= 6.9) {
		return 'High';
	}
	if (x >= 3) {
		return 'Medium';
	}

	return 'Low';
}

function updateView5ScoreCard(offenderData, band) {
	scoreCard(
		offenderData.totalRSR,
		band.toLowerCase(),
		band,
		'Likelihood of <strong>serious</strong> reoffending over the next two years.');

	$('#view5 #results_header').text(
		['RSR score',
			'(' + offenderData.rsrType + ')',
			'for',
			offenderData.offenderTitle,
			offenderData.firstName,
			offenderData.familyName
		].join(' '));
}

// View 5 specific events
function view5Actions () {
	$( ".score-card" ).remove();
	$('#download-btn').text('Download data as a .txt file')
		.bind('click touch', function(e) {
			var data = [
				'<form action="/render" method="post" id="renderer">',
			];

			for (var k in offenderData) {
				if (!~k.indexOf('_options')) {
					data.push('<input name="'+ k +'" value="'+ offenderData[k] +'" />');
				}
			}

			data.push('<button type="submit">Submit</button></form>');

			var f = $(data.join(''));
			$(document.body).append(f);
			f.submit();

			return false;
		});

	var n = offenderData.rsrType === "static" ? 0 : 1;

	if (window.browserCalc) {
		offenderData.totalRSR = 100 * moj.Modules.RSRCalc.calculateScore(offenderData)[n].toFixed(4);
		var band = getRSRBand(offenderData.totalRSR);

		updateView5ScoreCard(offenderData, band);

		return;
	}

	$.ajax({
		url: '/calculate',
		type: 'POST',
		contentType:'application/json',
		data: JSON.stringify(cleanRequest(offenderData)),
		dataType:'json',
	})
	.done(function( result ) {
		offenderData.totalRSR = 1 * result.RSRPercentileRisk[n].toFixed(2);
		var band = result.RSRRiskBand[n];

		updateView5ScoreCard(offenderData, band);
	});
};

function setupView2Panels () {
	var orHeight = $("#view2 #stranger-victim-details").height() + 30;

	$("#view2 #stranger-victim-details")
		.prop("data-original-height", orHeight)
		.css("height", "0")
		.attr("aria-hidden", "true")
		.addClass("collapsed-extra-panel");

	unRequireFields("2", ['stranger_victim']);

	orHeight = $("#view2 #violent-offence-details").height() + 30;

	$("#view2 #violent-offence-details")
		.prop("data-original-height", orHeight)
		.css("height", "0")
		.attr("aria-hidden", "true")
		.addClass("collapsed-extra-panel");

	unRequireFields("2", ['stranger_victim', 'violent_offence_category']);

	$("#view2 #sexual_element").change(function(){
		if ($(this).val() == "0") {
			$("#view2 #stranger-victim-details")
				.removeClass("collapsed-extra-panel")
				.addClass("expanded-extra-panel")
				.attr("aria-hidden", "false")
				.css("height", $("#view2 #stranger-victim-details").prop("data-original-height"))
				.find(".row").each( function(i) {
					moj.Modules.effects.highlight($(this));
				});
			requireFields("2", ['stranger_victim']);

			$("#view3 #sexual-offence-history-details")
				.removeClass("collapsed-extra-panel")
				.addClass("expanded-extra-panel")
				.attr("aria-hidden", "false")
				.css("height", $("#view3 #sexual-offence-history-details").prop("data-original-height"))
				.find(".row").each( function(i) {
					moj.Modules.effects.highlight($(this));
				});
			requireFields("3", ['most_recent_sexual_offence_date', 'most_recent_sexual_offence_month', 'most_recent_sexual_offence_year', 'contact_adult', 'contact_child', 'indecent_image', 'paraphilia']);
		} else {
			$("#view3 #sexual-offence-history-details")
				.removeClass("expanded-extra-panel")
				.addClass("collapsed-extra-panel")
				.attr("aria-hidden", "true")
				.css("height", "0");
			unRequireFields("3", ['most_recent_sexual_offence_date', 'most_recent_sexual_offence_month', 'most_recent_sexual_offence_year', 'contact_adult', 'contact_child', 'indecent_image', 'paraphilia']);

			if ($("#view2 #offence_type").val() != "14" && $("#view2 #offence_type").val() != "15") {
				$("#view2 #stranger-victim-details")
					.removeClass("expanded-extra-panel")
					.addClass("collapsed-extra-panel")
					.attr("aria-hidden", "true")
					.css("height", "0");
				unRequireFields("2", ['stranger_victim']);
			}
		}
	});

	$("#view2 #offence_type").change(function(){

		switch($(this).val()) {

			case "14":

				$("#view2 #sexual_element").val('0').prop('selected', true);
				$("#view2 #sexual_element").prop('disabled', true);

				$("#view2 #stranger-victim-details")
					.removeClass("collapsed-extra-panel")
					.addClass("expanded-extra-panel")
					.attr("aria-hidden", "false")
					.css("height", $("#view2 #stranger-victim-details").prop("data-original-height"))
					.find(".row").each( function(i) {
						moj.Modules.effects.highlight($(this));
					});
				requireFields("2", ['stranger_victim']);
				$("#view2 #violent-offence-details")
					.removeClass("expanded-extra-panel")
					.addClass("collapsed-extra-panel")
					.attr("aria-hidden", "true")
					.css("height", "0");
				unRequireFields("2", ['violent_offence_category']);

				// Add expand function for view 3 sexual history details
				$("#view3 #sexual-offence-history-details")
					.removeClass("collapsed-extra-panel")
					.addClass("expanded-extra-panel")
					.attr("aria-hidden", "false")
					.css("height", $("#view3 #sexual-offence-history-details").prop("data-original-height"))
					.find(".row").each( function(i) {
						moj.Modules.effects.highlight($(this));
					});
				requireFields("3", ['most_recent_sexual_offence_date', 'most_recent_sexual_offence_month', 'most_recent_sexual_offence_year', 'contact_adult', 'contact_child', 'indecent_image', 'paraphilia']);

				break;

			case "15":

				$("#view2 #sexual_element").val('0').prop('selected', true);
				$("#view2 #sexual_element").prop('disabled', true);

				$("#view2 #stranger-victim-details")
					.removeClass("collapsed-extra-panel")
					.addClass("expanded-extra-panel")
					.attr("aria-hidden", "false")
					.css("height", $("#view2 #stranger-victim-details").prop("data-original-height"))
					.find(".row").each( function(i) {
						moj.Modules.effects.highlight($(this));
					});
				requireFields("2", ['stranger_victim']);
				$("#view2 #violent-offence-details")
					.removeClass("expanded-extra-panel")
					.addClass("collapsed-extra-panel")
					.attr("aria-hidden", "true")
					.css("height", "0");
				unRequireFields("2", ['violent_offence_category']);

				// Add expand function for view 3 sexual history details
				$("#view3 #sexual-offence-history-details")
					.removeClass("collapsed-extra-panel")
					.addClass("expanded-extra-panel")
					.attr("aria-hidden", "false")
					.css("height", $("#view3 #sexual-offence-history-details").prop("data-original-height"))
					.find(".row").each( function(i) {
						moj.Modules.effects.highlight($(this));
					});
				requireFields("3", ['most_recent_sexual_offence_date', 'most_recent_sexual_offence_month', 'most_recent_sexual_offence_year', 'contact_adult', 'contact_child', 'indecent_image', 'paraphilia']);

				break;

			case "18":

				if($("#sexual_element").val() == "0") {

					$("#view2 #sexual_element")
						.val('0').removeAttr('selected')
						.val('').prop('selected', true)
						.removeAttr('disabled')
						.closest('.row').removeClass('has-error');

					$('#view2 span#sexual_element-description').text('');

					$("#view2 #stranger-victim-details")
						.removeClass("expanded-extra-panel")
						.addClass("collapsed-extra-panel")
						.attr("aria-hidden", "true")
						.css("height", "0");

					unRequireFields("2", ['stranger_victim']);

				}

				$("#view2 #violent-offence-details")
					.removeClass("collapsed-extra-panel")
					.addClass("expanded-extra-panel")
					.attr("aria-hidden", "false")
					.css("height", $("#view2 #violent-offence-details").prop("data-original-height"))
					.find(".row").each( function(i) {
						moj.Modules.effects.highlight($(this));
					});
				requireFields("2", ['violent_offence_category']);



				break;

			default:

				if($("#sexual_element").val() == "0") {

					$("#view2 #sexual_element")
						.val('0').removeAttr('selected')
						.val('').prop('selected', true)
						.removeAttr('disabled')
						.closest('.row').removeClass('has-error');

					$('#view2 span#sexual_element-description').text('');

					$("#view2 #stranger-victim-details")
						.removeClass("expanded-extra-panel")
						.addClass("collapsed-extra-panel")
						.attr("aria-hidden", "true")
						.css("height", "0");

					unRequireFields('2', ['stranger_victim']);

				}

				// Close the sexual offence details panel

				$("#view3 #sexual-offence-history-details")
					.removeClass("expanded-extra-panel")
					.addClass("collapsed-extra-panel")
					.attr("aria-hidden", "true")
					.css("height", "0");
				unRequireFields("3", ['most_recent_sexual_offence_date', 'most_recent_sexual_offence_month', 'most_recent_sexual_offence_year', 'contact_adult', 'contact_child', 'indecent_image', 'paraphilia']);

				$("#view2 #violent-offence-details")
					.removeClass("expanded-extra-panel")
					.addClass("collapsed-extra-panel")
					.attr("aria-hidden", "true")
					.css("height", "0");
				unRequireFields("2", ['stranger_victim','violent_offence_category']);

				break;

		}

	});

}

function setupView3Panels () {
	var orHeight = $("#view3 #sexual-offence-history-details").height() + 30;

	$("#view3 #sexual-offence-history-details")
		.prop("data-original-height", orHeight)
		.css("height", "0")
		.attr("aria-hidden", "true")
		.addClass("collapsed-extra-panel");


	unRequireFields("3", ['most_recent_sexual_offence_date', 'most_recent_sexual_offence_month', 'most_recent_sexual_offence_year', 'contact_adult', 'contact_child', 'indecent_image', 'paraphilia']);

	$("#view3 #sexual_offence_history").change(function(){
		if ($(this).val() == "0") {
			$("#view3 #sexual-offence-history-details")
				.removeClass("collapsed-extra-panel")
				.addClass("expanded-extra-panel")
				.attr("aria-hidden", "false")
				.css("height", $("#view3 #sexual-offence-history-details").prop("data-original-height"))
				.find(".row").each( function(i) {
					moj.Modules.effects.highlight($(this));
				});
			requireFields("3", ['most_recent_sexual_offence_date', 'most_recent_sexual_offence_month', 'most_recent_sexual_offence_year', 'contact_adult', 'contact_child', 'indecent_image', 'paraphilia']);
		} else {
			if ($("#view2 #sexual_element").val()!= "0") {
				$("#view3 #sexual-offence-history-details")
					.removeClass("expanded-extra-panel")
					.addClass("collapsed-extra-panel")
					.attr("aria-hidden", "true")
					.css("height", "0");
				unRequireFields("3", ['most_recent_sexual_offence_date', 'most_recent_sexual_offence_month', 'most_recent_sexual_offence_year', 'contact_adult', 'contact_child', 'indecent_image', 'paraphilia']);
			}
		}
	});

}

function setupView4Panels () {
	var orHeight = $("#view4 #oasys-details").height() + 30;

	$("#view4 #oasys-details")
		.prop("data-original-height", orHeight)
		.css("height", "0")
		.attr("aria-hidden", "true")
		.addClass("collapsed-extra-panel");
	requireFields("4", ['murder', 'wounding', 'burglary', 'arson', 'endager_life', 'kidnapping', 'firearm_possession', 'robbery', 'any_other_offence', 'use_weapon', 'partner', 'accommodation', 'employment', 'relationship', 'domestic_violence', 'current_use_of_alcohol', 'binge_drinking', 'impulsivity', 'temper', 'pro_criminal']);
	unRequireFields("4", ['murder', 'wounding', 'burglary', 'arson', 'endager_life', 'kidnapping', 'firearm_possession', 'robbery', 'any_other_offence', 'use_weapon', 'partner', 'accommodation', 'employment', 'relationship', 'domestic_violence', 'current_use_of_alcohol', 'binge_drinking', 'impulsivity', 'temper', 'pro_criminal']);

	$("#view4 #oasys_interview").change(function(){
		if ($(this).val() == "0") {
			$("#view4 #oasys-details")
				.removeClass("collapsed-extra-panel")
				.addClass("expanded-extra-panel")
				.attr("aria-hidden", "false")
				.css("height", $("#view4 #oasys-details").prop("data-original-height"))
				.find(".row").each( function(i) {
					moj.Modules.effects.highlight($(this));
				});
			requireFields("4", ['murder', 'wounding', 'burglary', 'arson', 'endager_life', 'kidnapping', 'firearm_possession', 'robbery', 'any_other_offence', 'use_weapon', 'partner', 'accommodation', 'employment', 'relationship', 'domestic_violence', 'current_use_of_alcohol', 'binge_drinking', 'impulsivity', 'temper', 'pro_criminal']);
		} else {
			unRequireFields("4", ['murder', 'wounding', 'burglary', 'arson', 'endager_life', 'kidnapping', 'firearm_possession', 'robbery', 'any_other_offence', 'use_weapon', 'partner', 'accommodation', 'employment', 'relationship', 'domestic_violence', 'current_use_of_alcohol', 'binge_drinking', 'impulsivity', 'temper', 'pro_criminal']);
			$("#view4 #oasys-details")
				.removeClass("expanded-extra-panel")
				.addClass("collapsed-extra-panel")
				.attr("aria-hidden", "true")
				.css("height", "0");
		}
	});
}


function setupView0Panels () {

}
function setupView1Panels () {

}
function setupView5Panels () {
	$('.rsr-scores').attr("tabindex", "0");
	$('#results_header').attr("tabindex", "0");
}

function setupPanel (id, triggerId, triggers, targetId, reqFields) {
	// Save the original height of the hidden panel

	if ($("#view" + id + " #" + targetId).prop("data-original-height") == undefined) {
		var orHeight = $("#view" + id + " #" + targetId).height() + 30;
		//console.log(">>>" + targetId + " orHeight: " + orHeight);
		$("#view" + id + " #" + targetId).prop("data-original-height", orHeight);
		$("#view" + id + " #" + targetId).css("height", "0");
		$("#view" + id + " #" + targetId).addClass("collapsed-extra-panel");


		$("#view" + id + " #" + triggerId).change(function(){
			//console.log("Selected: " + $(this).val() + ",  triggers: " + triggers);
			//console.log("inArray: " + $.inArray($(this).val(), triggers));

			//Hardcoded tweak to add: "violent-offence-details", ['violent_offence_category']
			if ( $.inArray($(this).val(), triggers) != -1) {
				if ($.inArray($(this).val(), triggers) == 2) {

				}
				//console.log("Target: " + $("#view" + id + " #" + targetId));

				$("#view" + id + " #" + targetId)
					.removeClass("collapsed-extra-panel")
					.addClass("expanded-extra-panel")
					.css("height", $("#view" + id + "#" + targetId).prop("data-original-height"));

				requireFields(id, reqFields);
				$("#view" + id + " #" + targetId).find("fieldset, div").each( function(i) {
					moj.Modules.effects.highlight($(this));
				});
			} else {
				$("#view" + id + " #" + targetId)
					.removeClass("expanded-extra-panel")
					.addClass("collapsed-extra-panel")
					.css("height", "0");

				unRequireFields(id, reqFields);
			}
		});
	}
};

function requireFields (id, fieldsArr) {
	if (fieldsArr != null) {
		for(var i = 0; i < fieldsArr.length; i++){
					$("#view" + id + ' #' + fieldsArr[i])
						.attr("data-required", "true")
						.removeAttr("tabindex")
						.attr("aria-hidden", "false")
						.attr("data-description", String(fieldsArr[i]))
						.attr("data-describedby", String(fieldsArr[i] + "-description"));
			}
		}
};

function unRequireFields (id, fieldsArr) {
	if (fieldsArr != null) {
		for(var i = 0; i < fieldsArr.length; i++){
					$("#view" + id + ' #' + fieldsArr[i])
						.attr("data-required", "false")
						.attr("tabindex", "-1")
						.attr("aria-hidden", "true")
						.removeAttr("data-description")
						.removeAttr("data-describedby")
						.closest('.row').removeClass('has-error');

					$("#view" + id + ' #' + fieldsArr[i]).val('').attr('selected', true);

					$("#view" + id + ' #' + fieldsArr[i] + '-description').text('');
			}
		}
};

function switchView (id) {

	if (appRunning) {
		if (id == 0) {
			id = 1;
		}
		if (id != activeView) {
			if (id <= (parseInt(activeView)+1)) {
				$("#view"+activeView).fadeOut(250);
				setTimeout(clearPreviousView, 250, id);
			}
		} else if (id > activeView+1){
		}
	} else {
		$("#view" + activeView)
			.attr("aria-hidden", "true")
			.css("display","none");
		$("#view" + activeView + " *").attr("tabindex", "-1");

		$("#view0")
			.attr("aria-hidden", "false")
			.fadeIn(250, function(){
			//$("#view0").find("#submit-btn").removeClass("submit-btn-disabled");
		});

		$("#view0 *").removeAttr("tabindex");
	}
};

function clearPreviousView (id) {

	if (activeView != id) {
		$("#view"+activeView)
			.attr("aria-hidden", "true")
			.css("display","none");

		$("#view" + activeView + " *").attr("tabindex", "-1");

		$("#view"+id)
			.attr("aria-hidden", "false")
			.fadeIn(250);
		//$(window).scrollTop(360);


		$("#view" + id + " *[aria-hidden!='true']").removeAttr("tabindex");

		$('.done').attr("tabindex", "0");

		$('#view' + id + ' form').find('input[type=text], select').first().focus();

		if (id == '5') {
			$('.score-card').attr("tabindex", "0");
			$('#results_header').attr("tabindex", "0");
		}
		// if ($('#view' + activeView).find('select').first().val() != "") {
		// 	resetElements(activeView);
		// }

		$('html, body').animate({ scrollTop: $("#user-nav").offset().top+(261)}, 800, $.bez([.44,1.37,.57,1]));
		activeView = id;
	}
};

function quitClear () {
	offenderData = null;
	offenderData = {};
	activeView = 0;
		switchView(0);
	$("#user-nav")
		.addClass("collapsed-extra-panel")
		.attr("aria-hidden", "true")
		.attr("tabindex", "-1")
		.css("height", "0");

	$('#accessible_errors').attr("tabindex", "-1");
	$('#quitclear').attr("tabindex", "-1");

	if(appRunning) {
		//console.log("reload");
		appRunning = false;
		window.location.reload();
		//window.location.href = "index.html";
	}

};


// TO DO: Accept object parameters instead of UI components...


	function dateDiffforage (d1, d2) {

		// d1 is usually the most recent, d2 the oldest e.g. d1 = 11 Jan 2013, d2 = 1 Dec 2012
		// 1 Dec 2013 - 11 Dec 2012 should return 0 years
		// Subtract years
		// Check if month diff < 0 so that the above should return 0 years diff

		var diff = new Date(d1.getTime() - d2.getTime());

						var result1=(diff.getUTCFullYear() - 1970);
						if(result1==17)
						{

						if(diff.getUTCMonth()>=6)
						{
							result1=result1+1;
						}
						}

		return result1;
	};
	function dateDiffage (d1, d2) {

		// d1 is usually the most recent, d2 the oldest e.g. d1 = 11 Jan 2013, d2 = 1 Dec 2012
		// 1 Dec 2013 - 11 Dec 2012 should return 0 years
		// Subtract years
		// Check if month diff < 0 so that the above should return 0 years diff

		var diff = new Date(d1.getTime() - d2.getTime());

						var result1=(diff.getUTCFullYear() - 1970);
						var month=diff.getUTCMonth();



		return result1 +' yrs and '+ month +' months';
	};
function dateDiff (d1, d2) {

		var result;
		// d1 is usually the most recent, d2 the oldest e.g. d1 = 11 Jan 2013, d2 = 1 Dec 2012
		// 1 Dec 2013 - 11 Dec 2012 should return 0 years
		// Subtract years
		result = (d1.getFullYear() - d2.getFullYear());
		// Check if month diff < 0 so that the above should return 0 years diff
		if (d1.getMonth() - d2.getMonth() < 0) {
			result --;
		} else if (d1.getMonth() - d2.getMonth() == 0 && d1.getDate() - d2.getDate() < 0) { // if month is the same and date has not passed anniversary date
			result --;
		}

		return result;
	};

 function monthDiff (d1, d2) {

	var result;

	result = (d1.getFullYear() - d2.getFullYear()) * 12;
	result += (d1.getMonth() - d2.getMonth());

	return parseInt(result);
}

function isDate (id) {

	var validDate;
	var dd = parseInt($('#' + id + '_date').val());
	var dm = parseInt($.inArray($('#' + id + '_month').val(), monthsArr));
	var dy = parseInt($('#' + id + '_year').val());

	var date = new Date(dy, dm, dd);
	var datePlus = new Date(date.getTime() + 3600000);

	if (date.getFullYear() == dy && date.getMonth() == dm && date.getDate() == dd) {
			validDate = true;
			//return '';
	} else if (datePlus.getFullYear() == dy && datePlus.getMonth() == dm && datePlus.getDate() == dd) {
		validDate = true;
	} else {
			validDate = false;
	}

	if(document.activeElement.id.indexOf(id) != -1) {
		return true;
	} else {
		return validDate;
	}
};

function scoreCard (sc, band, bandLabel, desc) {
	//console.log("the sc is " + sc);
	var scoreNum = sc;

	//parseFloat(Math.round(sc * 100) / 100).toFixed(2);
	// TO DO: add banding
	var html = '';
	html += '<div class="score-card" tabindex="0"><div>';
	html += '<p tabindex="0" class="score-' + band + ' score-xxl">' + scoreNum + '<sup>%</sup></p>';
	//html += '<p class="score-' + band + ' score-xxl">' + Math.round(scoreNum*100)/100 + '<sup>%</sup></p>';
	html += '<p tabindex="0" class="score-' + band + ' score-description-header">' + bandLabel + '</p>';
	html += '<p tabindex="0" class="score-description-text">' + desc + '</p></div></div>';

	$('.rsr-scores').append(html);

	$('.rsr-scores').attr("tabindex", "0");
	$('#results_header').attr("tabindex", "0");
};

moj.Modules.RSRApp = (function() {

  // public
  return {
    init: init,
    dateDiff: dateDiff,
    monthDiff: monthDiff,
    offenderData: offenderData,
    test: "value"
  };

}());
