(function (root, factory) {
	if (typeof define == 'function' && define.amd) {
		define(['jquery', 'angular'], factory);
	}
	else if (typeof module === 'object' && module.exports) {
		module.exports = factory(require('jquery'), require('angular'));
	}
	else {
		factory(root.jQuery, root.angular);
	}
}(this, function ($, angular) {

	// (function (window, angular) {
	'use strict';
	angular
		.module('QueryBuilderUtility', [])
		.service('queryBuilderUtility', ['$translate', queryBuilderUtility]);

	function queryBuilderUtility($translate) {

		/** da rimuovere quando saranno disponibili i mapping da python **/
		var decodes = {
			'source': {
				'CX': 'CX',
				'TX': 'TX',
				'BB': 'BB',
				'MOB': 'MOB',
				'RDG': 'RDG',
				'NFV': 'NFV',
				'NMS': 'NMS'
			},
			'severity': {
				'0': 'Clear',
				'1': 'Indeterminate',
				'2': 'Warning',
				'3': 'Minor',
				'4': 'Major',
				'5': 'Critical'
			},
			'originalseverity': {
				'0': 'Clear',
				'1': 'Indeterminate',
				'2': 'Warning',
				'3': 'Minor',
				'4': 'Major',
				'5': 'Critical',
				'6': '1P',
				'7': '2P',
				'8': '3P',
				'9': '4P',
				'10': '5P',
				'11': '6P',
				'12': '7P',
				'13': '8P',
				'14': '9P',
				'15': '10P',
				'16': '11P',
				'17': '12P',
				'18': '1G',
				'19': '2G',
				'20': '3G',
				'21': '4G',
				'22': '5G',
				'23': '6G',
				'24': '7G',
				'25': '8G',
				'26': '9G',
				'27': '10G',
				'28': '11G',
				'29': '12G'
			},
			'category': {
				'0': 'Fault',
				'1': 'Degrado',
				'20': 'Technical Infrastructures',
				'21': 'Technical Infrastructures'
			},
			"correlationtrigger": { "1": "Innesco PDH 565 o PDH 140", "2": "Innesco SDH" },
			"ttrequeststatus": {
				'0': 'Nessuna Richiesta al TTM Associata',
				'1': 'In Carico',
				'2': 'Dispacciato',
				'3': 'In Attesa Chiusura',
				'4': 'Chiusura Disservizio/Indisponibilita',
				'5': 'Chiuso',
				'101': 'In Carico [Allarme Rientrato]',
				'102': 'Dispacciato [Allarme Rientrato]',
				'103': 'In Attesa Chiusura [Allarme Rientrato]',
				'104': 'Chiusura Disservizio [Allarme Rientrato]',
				'105': 'Chiuso [Allarme Rientrato]',
				'-1': 'Inviata Richiesta a TTM',
				'-106': 'Inviata Richiesta a TTM',
				'7': 'Sospeso [NTT Sospeso]',
				'107': 'Sospeso [NTT Sospeso]',
				'201': 'In Carico [Allarme Rientrato]',
				'202': 'Dispacciato [Allarme Rientrato]',
				'203': 'In Attesa Chiusura [Allarme Rientrato]',
				'204': 'Chiusura Disservizio [Allarme Rientrato]',
				'205': 'Chiuso [Allarme Rientrato]',
				'207': 'Sospeso [NTT Sospeso]',
				'300': 'OPENED',
				'301': 'CLOSED',
				'302': 'CANCELED'
			},
			'bbtx_competenza': {
				'0': '',
				'3000': 'Non Determinato',
				'3001': 'InElaborazione',
				'1': '1?',
				'4000': 'Dati',
				'4001': 'Dati-OpBB',
				'4002': 'Dati-OpTX',
				'2000': 'Coda',
				'1000': 'Trasporto',
				'1001': 'Trasporto-OpBB',
				'1002': 'Trasporto-OpTX'
			},
			'bbtx_statotx': {
				'0': '',
				'1': 'NonGestito',
				'2': 'Gestito',
				'3': 'Maintenance',
				'4': 'Rientrato'
			},
			'bbtx_statobb': {
				'0': '',
				'1': 'NonGestito',
				'2': 'Gestito',
				'3': 'Maintenance',
				'4': 'Rientrato'
			}
			// "PRIORITY" : { "0":"BASSA", "1":"MEDIA", "2":"ALTA", "3":"BACKLOG"}
		};
		/*
			"CORRELATIONTRIGGER" : {"1": "Innesco PDH 565 oPDH 140", "2": "Innesco SDH" },
			"PRIORITY" : { "0":"BASSA", "1":"MEDIA", "2":"ALTA", "3":"BACKLOG"}
			};*/


		var service = {
			getQueryBuilderFilters: getQueryBuilderFilters,
			getQueryBuilderOperators: getQueryBuilderOperators,
			getSqlOperators: getSqlOperators,
			createQueryBuilder: createQueryBuilder,
			defaultOptions: {
				labels: { visible: true, readonly: true },
				toggle: { visible: true },
			},
			globalConfig: function (options) {
				this.defaultOptions = angular.merge(this.defaultOptions, options);
			}
		};

		init();
		// addLabelsExtension(QueryBuilder);

		return service;

		var defaultRule = { "id": "1", "field": "1", "type": "number", "input": "text", "operator": "equal", "value": 1 };
		function init() {
			var QueryBuilder = $.fn.queryBuilder;
			QueryBuilder.extend({
				getCustomSQL: function (rules) {
					var result = { sql: '(1=1)' };

					if (!rules) {
						rules = this.getRules({ allow_invalid: true });
					}
					// rules = this.getRules( {allow_invalid:true});

					// if (rules.data) rules.data = undefined;

					// var data = angular.toJson(rules);
					// rules['data'] = angular.fromJson(data);
					rules.rules = cleanUnusedRules(rules.rules);
					// if (rules.rules.length == 0) rules.rules.push(defaultRule);
					if (rules.rules.length > 0) {
						result = this.getSQL(false, false, rules);
						result.sql = "(" + result.sql + ")";
					}

					/*
					if (rules.rules.length>0) {
						var tempRules = angular.fromJson(angular.toJson(rules.rules));
						
						for (var index = rules.rules.length-1; index >=0 ; index--) {
							var rule = rules.rules[index];
							if (! rule.data || !rule.data['enabled']) {
								tempRules.splice(index, 1);
							}
						}
						if (tempRules.length == 0) tempRules.push(defaultRule);
				rules.rules = tempRules;
					}
					*/
					// this.queryBuilder('setRules', rules);
					// $('#builder-basic').queryBuilder('customRules');
					// var result = this.getSQL(false, false, rules);
					// result.sql = "("+result.sql+")";
					//var rules = $('#builder-basic').queryBuilder('getRules');
					// if (rules.data) this.queryBuilder('setRules', rules.data);
					return result;
				}
			});

			function cleanUnusedRules(rules) {
				var tempRules = [];
				if (rules.length > 0) {
					tempRules = angular.copy(rules);
					// tempRules = angular.fromJson(angular.toJson(rules));

					for (var index = rules.length - 1; index >= 0; index--) {
						var rule = rules[index];
						if (rule.field) {
							if (!rule.data || !rule.data['enabled']) {
								tempRules.splice(index, 1);
							}
						} else if (rule.condition) {
							if (!rule.data || !rule.data['enabled']) {
								tempRules.splice(index, 1);
							} else {
								rule.rules = cleanUnusedRules(rule.rules);
								if (rule.rules.length == 0) {
									tempRules.splice(index, 1);
								}
								else {
									tempRules.splice(index, 1, rule);
								}
							}
						}
					}
				}
				//if (tempRules.length == 0) tempRules.push(defaultRule);
				return tempRules;
			}
		}

		/**
		 * 
		 * @param {*} element 
		 * @param {*} filters 
		 * @param {*} options labels{readonly} 
		 * @param {*} lang_code 
		 */
		function createQueryBuilder(element, filters, options, lang_code) {
			var defaultFilter = { "id": "1", "field": "1", "type": "integer", "label": "-----", "input": "number", "unique": true };
			// filters.push(defaultFilter);

			if (!lang_code) {
				lang_code = $translate.use();
			}

			var QueryBuilder = $.fn.queryBuilder;
			var lang;
			if (QueryBuilder.regional_custom)
				lang = QueryBuilder.regional_custom[lang_code];

			if (lang === undefined) {
				lang = {};
			}

			var plugins = {
				'collapse-groups': {
					iconUp: 'glyphicon glyphicon-minus',
					iconDown: 'glyphicon glyphicon-plus',
					namedGroups: false
				}
			};
			var localOptions = angular.merge({
				filters: filters, lang_code: lang_code, display_errors: true
				, operators: service.getQueryBuilderOperators()
				, sqlOperators: service.getSqlOperators()
				, plugins: plugins
				, allow_empty: true
				, saveNativeRules: true
				, lang: lang
				/*, iconUp: 'glyphicon glyphicon-minus', iconDown: 'glyphicon glyphicon-plus', namedGroups: false*/
			}, this.defaultOptions, options);
			if (localOptions.sortable) {
				plugins.sortable = localOptions.sortable;
			}

			$(element).queryBuilder(localOptions);

			function autowidth(el) {
				return (el.value.length == 0 ? "16px;" : (el.value.length + 1) * 8) + "px";
			}


			//$($(element).find('.rules-group-container').find('button').get(2)).hide();
			/*$(element).prepend('<script >function autowidth(el) {return ((el.value.length + 1)*8)+"px";} ' +
						'$(function () {$(".toggleswitch").bootstrapToggle({size: "mini"});});</script>');*/
			// $(element).prepend('<script >function autowidth(el) {return (el.value.length == 0 ? "16px;" : (el.value.length + 1)*8)+"px";} ' 
			// // +			'$(function () {$(".toggleswitch").bootstrapToggle({size: "mini"});});</script>'
			// );

			//Nascondo errori validazione per regole non abilitate
			$(element).on('validateValue.queryBuilder.filter', function (event, value, rule) {
				if (event.value != true) {
					if (rule.data && rule.data.enabled == false) {
						event.value = true;
					}
				}
				return event;
			});

			$(element).on('afterUpdateRuleOperator.queryBuilder', function (event, rule) {
				rule.$el.find('.rule-value-container select').change();
				rule.$el.find('.rule-value-container input').change();
				var operator = rule.$el.find('.rule-operator-container select').val();

				var selects = rule.$el.find('.rule-value-container select[name$=_0]');
				if (operator == 'equal' || operator == 'not_equal') {
					if (selects.attr("multiple")) {
						var val = selects.val();
						selects.removeAttr("multiple");
						if (val && angular.isArray(val)) {
							selects.val(val[0]);
						}
					}
				}
				if (operator == 'in' || operator == 'not_in' || operator == 'in_ic' || operator == 'not_in_ic') {
					if (!selects.attr("multiple")) {
						var val = selects.val();
						$(selects).attr("multiple", "");
						if (val && !angular.isArray(val)) {
							selects.val([val]);
						}
					}
				}
			});

			$(element).on('afterUpdateRuleValue.queryBuilder', function (event, rule) {
				$('#' + rule.id + '_cbx').trigger('change');
				$('#' + rule.id + '_data').trigger('change');
			});

			$(element).on('afterAddGroup.queryBuilder', function (event, group) {
				if (group.id != group.model.root.id) {
					if (localOptions.labels.visible === true) {
						var label = $('#' + group.id + '_data');
						if (label.length == 0) {
							addGroupLabel(event, group);
						}
						else {
							$(label[0]).val('');
						}
					}
					addGroupToggle(event, group);
				}
			});

			/*Marisa*/
			$(element).on('afterCreateRuleFilters.queryBuilder', function (event, rule) {
				var b = rule.$el.find("[name$=_filter]");
				b.focus();
			});

			$(element).on('afterCreateRuleInput.queryBuilder', function (event, rule) {
				addRuleToggle(event, rule);
				if (localOptions.labels.visible === true) {
					var label = $('#' + rule.id + '_data');
					if (label.length == 0) {
						addRuleLabel(event, rule);
					}
					else {
						var labelVal = (rule.filter.label ? rule.filter.label : '');
						console.log(labelVal);
						$(label[0]).val(labelVal);
						if (!rule.data) rule.data = {};
						rule.data['label'] = labelVal;
					}
				}

				rule.$el.find('.rule-value-container [name$=_2]').datetimepicker({
					format: 'YYYY-MM-DD HH:mm:ss', //pluginformat, 
					//showTodayButton: true,
					showClose: true,
					toolbarPlacement: 'top',
					locale: 'it',
					sideBySide: true,
					keepInvalid: true
				});

				// $(".toggleswitch").bootstrapToggle({size: "mini"});
				//$(event.target).find('.rule-operator-container select').trigger('change');

			});

			function addGroupToggle(event, group) {
				if (localOptions.toggle.visible !== true)
					return;
				var enabled = false;
				if (group.data) {
					enabled = (group.data && group.data['enabled'] != undefined ? group.data['enabled'] : false);
				}

				var container = $(group.$el).find('.rules-group-header .group-conditions'); //.drag-handle')
				var toggle = container.find('.toggleswitch');
				if (!toggle || !toggle.length) {
					var input = $('<input>', {
						class: 'toggleswitch',
						'data-onstyle': "success",
						'data-toggle': "toggle",
						type: "checkbox",
						id: group.id + '_cbx',
						name: group.id + '_data_cbx',
						checked: enabled == true,
					});
					// if (enabled == true) { input.prop('checked', 'checked'); }
					container.after(input);
					input.bootstrapToggle({ size: "mini" });
					// container.after('<input class="toggleswitch" data-onstyle="success" data-toggle="toggle" type="checkbox" '+
					// 		 'id="'+group.id+'_cbx" name="'+group.id+'_data_cbx" '+(enabled == true ? 'checked="checked"' : '') +' ></input>');

					// $('#'+group.id+'_cbx')
					input.change({ group: group }, function (parameters, extra) {
						var pgroup = parameters.data.group;

						var value = this.checked;
						if (!pgroup.data) pgroup.data = {};
						var oldValue = pgroup.data['enabled'];
						pgroup.data['enabled'] = value;
						if (!extra && value != oldValue) {
							$("#" + pgroup.id + " input:checkbox[id!='" + pgroup.id + "_cbx']").prop('checked', value);
							//$("#"+pgroup.id +" input:checkbox[id!='"+pgroup.id+"_cbx']").change();
							$("#" + pgroup.id + " input:checkbox[id!='" + pgroup.id + "_cbx']").trigger("change", { group: pgroup });
						}
						/* DA CAPIRE
						if (!extra && value && pgroup.parent) {
							var pgroup = pgroup.parent;
							if (pgroup.level > 1){
						if (!pgroup.data) pgroup.data = {};
						pgroup.data['enabled'] = value;
								$("#"+pgroup.id +" input:checkbox[id!='"+pgroup.id+"_cbx']").prop('checked',value);
						$("#"+pgroup.id +" input:checkbox[id!='"+pgroup.id+"_cbx']").trigger("change", {group: pgroup});
							}

							} else if (!extra && !value && pgroup.parent) {
							var pgroup = pgroup.parent;
							var groupOn = false;
							if (pgroup.level > 1) {
								pgroup.rules.forEach(function(r){
									if (r.data['enabled'] == true) {
										groupOn = true; 
										}
								});
								if (!pgroup.data) pgroup.data = {};
								pgroup.data['enabled'] = groupOn;
										$("#"+pgroup.id +" input:checkbox[id!='"+pgroup.id+"_cbx']").prop('checked',groupOn);
								$("#"+pgroup.id +" input:checkbox[id!='"+pgroup.id+"_cbx']").trigger("change", {group: pgroup});
							}
							}*/

						$(element).queryBuilder('trigger', 'afterUpdateGroupEnabled');
					});
					// $(".toggleswitch").bootstrapToggle({size: "mini"});
				}
			}

			function addGroupLabel(event, group) {
				var label = '';
				if (group.data) {
					label = (group.data && group.data['label'] != undefined ? group.data['label'] : '');
				}
				var labellen = ((label ? label.length : "etichetta".length) + 1) * 8;

				var labelObj = $('<label>', {
					class: 'btn btn-xs btn-primary etichetta'
				});
				labelObj.append('<span><i class="glyphicon glyphicon-tag"></i></span>');

				var container =
					$(group.$el).find('.rules-group-header .group-conditions'); //.drag-handle')

				// container.after(
				// 	'<label class="btn btn-xs btn-primary etichetta"><span><i class="glyphicon glyphicon-tag"></i></span> \
				// 		<input style="width: '+ labellen + 'px; border: none;background-color: transparent;" class="datalabel" placeholder="Nome gruppo" ' +
				// 	'id="' + group.id + '_data" name="' + group.id + '_data" value="' + (label != undefined ? label : '') + '"></input> \
				// 	</label>'
				// );

				var input = $('<input>', {
					style: 'width: ' + labellen + 'px; border: none;background-color: transparent;',
					class: 'datalabel',
					placeholder: 'Nome gruppo',
					id: group.id + '_data',
					name: group.id + '_data',
					value: (label != undefined ? label : ''),
					readOnly: localOptions.labels.readonly == true,
				});
				labelObj.append(input);
				container.after(labelObj);

				input.keypress(function () {
					this.style.width = autowidth(this);
				});
				input.change({ group: group }, function (parameters) {
					this.style.width = autowidth(this);
					var pgroup = parameters.data.group;

					var value = this.value;

					if (!pgroup.data) pgroup.data = {};
					pgroup.data['label'] = value;
				});
			}

			function addRuleToggle(event, rule) {
				if (localOptions.toggle.visible !== true)
					return;
				var container = $(rule.$el).find(".rule-filter-container");
				var toggle = container.find('.toggleswitch');
				if (!toggle || !toggle.length) {
					var enabled = false;
					if (rule.data || rule.filter.data) {
						enabled = (rule.filter.data['enabled'] != undefined ? rule.filter.data['enabled'] : (rule.data && rule.data['enabled'] != undefined ? rule.data['enabled'] : true));
					}

					var input = $('<input>', {
						class: 'toggleswitch',
						'data-onstyle': "success",
						'data-toggle': "toggle",
						type: "checkbox",
						id: rule.id + '_cbx',
						name: rule.id + '_data_cbx',
						checked: enabled == true,
					});
					
					// switch dei filtri delle ov spostato a sx 
					container.before(input);
					
					// '<input class="toggleswitch" data-onstyle="success" data-toggle="toggle" type="checkbox" '+
					// 'id="'+rule.id+'_cbx" name="'+rule.id+'_data_cbx" '+(enabled == true ? 'checked="checked"' : '') +' ></input>');
					// $(".toggleswitch").bootstrapToggle({size: "mini"});
					// container.find('.toggleswitch').bootstrapToggle({size: "mini"});
					input.bootstrapToggle({ size: "mini" });
					input.change({ rule: rule }, function (parameters, extra) {
						var prule = parameters.data.rule;

						var value = this.checked;
						if (!prule.data) prule.data = {};
						prule.data['enabled'] = value;
						if (!extra && value && prule.parent) {
							var pgroup = prule.parent;
							if (pgroup.level > 1) {
								if (!pgroup.data) pgroup.data = {};
								pgroup.data['enabled'] = value;
								$("#" + pgroup.id + '_cbx').prop('checked', value);
								$("#" + pgroup.id + '_cbx').trigger("change", { rule: rule });
							}
						} else if (!extra && !value && prule.parent) {
							var pgroup = prule.parent;
							var groupOn = false;
							if (pgroup.level > 1) {
								pgroup.rules.forEach(function (r) {
									if (r.data && r.data['enabled'] == true) {
										groupOn = true;
									}
								});
								if (!pgroup.data) pgroup.data = {};
								pgroup.data['enabled'] = groupOn;
								$("#" + pgroup.id + '_cbx').prop('checked', groupOn);
								$("#" + pgroup.id + '_cbx').trigger("change", { rule: rule });
							}

						}
						$(element).queryBuilder('trigger', 'afterUpdateRuleEnabled');
					});

				}
			}

			function addRuleLabel(event, rule) {
				var label = '';
				if (rule.data || rule.filter.data) {
					//label = rule.filter.data['label'] != undefined ? rule.filter.data['label'] :  (rule.data ? rule.data['label'] : (rule.filter.label ?  rule.filter.label : ''));
					//enabled = ( rule.filter.data['enabled'] != undefined ? rule.filter.data['enabled'] : (rule.data ? rule.data['enabled'] : true));
					label = rule.filter.data['label'] != undefined ? rule.filter.data['label'] : (rule.data && rule.data['label'] != "" && rule.data['label'] != undefined ? rule.data['label'] : (rule.filter.label ? rule.filter.label : ''));
				}
				var labellen = ((label ? label.length : "etichetta".length) + 1) * 8;
				var container = $(rule.$el).find(".rule-filter-container");
				var labelObj = $('<label>', {
					class: 'btn btn-xs btn-primary etichetta'
				});
				labelObj.append('<span><i class="glyphicon glyphicon-tag"></i></span>');
				var input = $('<input>', {
					style: 'width: ' + labellen + 'px; border: none;background-color: transparent;',
					class: 'datalabel',
					placeholder: 'Nome regola',
					id: rule.id + '_data',
					name: rule.id + '_data',
					value: (label != undefined ? label : ''),
					readOnly: localOptions.labels.readonly == true,
				});
				labelObj.append(input);
				container.prepend(labelObj);

				input.keypress(function (event) {
					event.target.style.width = autowidth(event.target);
				});

				input.change({ rule: rule }, function (parameters) {
					var prule = parameters.data.rule;

					var value = this.value;

					if (!prule.data) prule.data = {};
					prule.data['label'] = value;

					this.style.width = autowidth(this);
				});

				// 	$('#'+rule.id+'_cbx').change({rule: rule}, function (parameters, extra) {
				// 		var prule = parameters.data.rule;

				// 		var value = this.checked;
				// 		if (!prule.data) prule.data = {};
				// prule.data['enabled'] = value;
				// if (! extra && value && prule.parent) {
				// 	var pgroup = prule.parent;
				// 	if (pgroup.level > 1) {
				// 		if (!pgroup.data) pgroup.data = {};
				// 		pgroup.data['enabled'] = value;
				// 		$("#"+pgroup.id+'_cbx').prop('checked',value);
				// 		$("#"+pgroup.id+'_cbx').trigger("change", {rule: rule});
				// 	}
				// } else if (!extra && !value && prule.parent) {
				// 	var pgroup = prule.parent;
				// 	var groupOn = false;
				// 	if (pgroup.level > 1) {
				// 		pgroup.rules.forEach(function(r){
				// 			if (r.data['enabled'] == true) {
				// 				groupOn = true; }
				// 		});
				// 		if (!pgroup.data) pgroup.data = {};
				// 		pgroup.data['enabled'] = groupOn;
				// 		$("#"+pgroup.id+'_cbx').prop('checked',groupOn);
				// 		$("#"+pgroup.id+'_cbx').trigger("change", {rule: rule});
				// 	}

				// } 
				// $(element).queryBuilder('trigger','afterUpdateRuleEnabled');					
				//     });

				/*
					* Esegue un for nelle regole del gruppo quando vengono modificate
					* Da implementare gli off sul gruppo quando tutte le regole sono in off
				pgroup.rules.forEach(function(r){
					console.log("r.data: "+r.data);
				});*/


				$('#' + rule.id + '_cbx').trigger('change');
				$('#' + rule.id + '_data').trigger('change');
			}
		}



		function getDecodedValues(key, mapping) {
			if (mapping) {
				if (Object.prototype.toString.call(mapping) === '[object Array]') {
					var values = {};
					$.each(mapping, function (index, value) {
						values[value] = value;
					});
					return values;
				} else {
					/*
				var values = {};
				$.each(mapping, function (key, value){
					values[value] = key;
				});
				return values;
				*/
					return mapping;
				}
			}
			return decodes[key];
		}

		function getSqlOperators() {
			return {
				equal: { op: '= ?' },
				equal_ic: { op: '= ?', ic: 1 },
				not_equal: { op: '!= ?' },
				not_equal_ic: { op: '!= ?', ic: 1 },
				in: { op: 'IN(?)', sep: ', ' },
				in_ic: { op: 'IN(?)', sep: ', ', ic: 1 },
				not_in: { op: 'NOT IN(?)', sep: ', ' },
				not_in_ic: { op: 'NOT IN(?)', sep: ', ', ic: 1 },
				less: { op: '< ?' },
				less_or_equal: { op: '<= ?' },
				greater: { op: '> ?' },
				greater_or_equal: { op: '>= ?' },
				between: { op: 'BETWEEN ?', sep: ' AND ' },
				not_between: { op: 'NOT BETWEEN ?', sep: ' AND ' },
				begins_with: { op: 'LIKE(?)', mod: '{0}%' },
				begins_with_ic: { op: 'LIKE(?)', mod: '{0}%', ic: 1 },
				not_begins_with: { op: 'NOT LIKE(?)', mod: '{0}%' },
				not_begins_with_ic: { op: 'NOT LIKE(?)', mod: '{0}%', ic: 1 },
				contains: { op: 'LIKE(?)', mod: '%{0}%' },
				contains_ic: { op: 'LIKE(?)', mod: '%{0}%', ic: 1 },
				not_contains: { op: 'NOT LIKE(?)', mod: '%{0}%' },
				not_contains_ic: { op: 'NOT LIKE(?)', mod: '%{0}%', ic: 1 },
				ends_with: { op: 'LIKE(?)', mod: '%{0}' },
				ends_with_ic: { op: 'LIKE(?)', mod: '%{0}', ic: 1 },
				not_ends_with: { op: 'NOT LIKE(?)', mod: '%{0}' },
				not_ends_with_ic: { op: 'NOT LIKE(?)', mod: '%{0}', ic: 1 },
				is_empty: { op: '= \'\'' },
				is_not_empty: { op: '!= \'\'' },
				is_null: { op: 'IS NULL' },
				is_not_null: { op: 'IS NOT NULL' },
				last_n_minutes: {
					op: 'BETWEEN ?', sep: ' AND ',
					sqlFn: function (value) {
						return "BETWEEN (SYSDATE - INTERVAL '" + value + "' minute) AND SYSDATE";
					}
				},
				period: {
					op: 'BETWEEN ?', sep: ' AND ',
					sqlFn: function (values) {
						var subOp = values[0];
						switch (subOp) {
							case 'days':
								return "BETWEEN (TRUNC(SYSDATE) - INTERVAL '" + values[1] + "' day) AND TRUNC(SYSDATE)";
							case 'day':
								return 'BETWEEN SYSDATE - 1 AND SYSDATE';
							case 'week':
								return "BETWEEN TRUNC(SYSDATE,'IW') AND TRUNC(SYSDATE,'IW')+7-1/86400";
							case 'month':
								return "BETWEEN TRUNC(ADD_MONTHS(SYSDATE, -1),'MM') AND (TRUNC(SYSDATE,'MM')-1/86400)";
						}
					}
				},
				before_last_n_minutes: {
					op: '< ?',
					sqlFn: function (value) {
						return "< (SYSDATE - INTERVAL '" + value + "' minute)";
					}
				},
				before_last_n_days: {
					op: '< ?',
					sqlFn: function (value) {
						return "< (SYSDATE - INTERVAL '" + value + "' day)";
					}
				},
				is: { op: 'IN(?)', sep: ', ' ,
                      sqlFn: function (value) {
                        return "IN ("+value+")";
                      }
				}
			};
		}

		function getQueryBuilderOperators() {
			return [
				{ type: 'equal', nb_inputs: 1, multiple: false, apply_to: ['string', 'number', 'datetime', 'boolean'] },
				{ type: 'equal_ic', nb_inputs: 1, multiple: false, apply_to: ['string'] },
				{ type: 'not_equal', nb_inputs: 1, multiple: false, apply_to: ['string', 'number', 'datetime', 'boolean'] },
				{ type: 'not_equal_ic', nb_inputs: 1, multiple: false, apply_to: ['string'] },
				{ type: 'in', nb_inputs: 1, multiple: true, apply_to: ['string', 'number', 'datetime'] },
				{ type: 'in_ic', nb_inputs: 1, multiple: true, apply_to: ['string'] },
				{ type: 'not_in', nb_inputs: 1, multiple: true, apply_to: ['string', 'number', 'datetime'] },
				{ type: 'not_in_ic', nb_inputs: 1, multiple: true, apply_to: ['string'] },
				{ type: 'less', nb_inputs: 1, multiple: false, apply_to: ['number', 'datetime'] },
				{ type: 'less_or_equal', nb_inputs: 1, multiple: false, apply_to: ['number', 'datetime'] },
				{ type: 'greater', nb_inputs: 1, multiple: false, apply_to: ['number', 'datetime'] },
				{ type: 'greater_or_equal', nb_inputs: 1, multiple: false, apply_to: ['number', 'datetime'] },
				{ type: 'between', nb_inputs: 2, multiple: false, apply_to: ['number', 'datetime'] },
				{ type: 'not_between', nb_inputs: 2, multiple: false, apply_to: ['number', 'datetime'] },
				{ type: 'begins_with', nb_inputs: 1, multiple: false, apply_to: ['string'] },
				{ type: 'begins_with_ic', nb_inputs: 1, multiple: false, apply_to: ['string'] },
				{ type: 'not_begins_with', nb_inputs: 1, multiple: false, apply_to: ['string'] },
				{ type: 'not_begins_with_ic', nb_inputs: 1, multiple: false, apply_to: ['string'] },
				{ type: 'contains', nb_inputs: 1, multiple: false, apply_to: ['string'] },
				{ type: 'contains_ic', nb_inputs: 1, multiple: false, apply_to: ['string'] },
				{ type: 'not_contains', nb_inputs: 1, multiple: false, apply_to: ['string'] },
				{ type: 'not_contains_ic', nb_inputs: 1, multiple: false, apply_to: ['string'] },
				{ type: 'ends_with', nb_inputs: 1, multiple: false, apply_to: ['string'] },
				{ type: 'ends_with_ic', nb_inputs: 1, multiple: false, apply_to: ['string'] },
				{ type: 'not_ends_with', nb_inputs: 1, multiple: false, apply_to: ['string'] },
				{ type: 'not_ends_with_ic', nb_inputs: 1, multiple: false, apply_to: ['string'] },
				{ type: 'is_empty', nb_inputs: 0, multiple: false, apply_to: ['string'] },
				{ type: 'is_not_empty', nb_inputs: 0, multiple: false, apply_to: ['string'] },
				{ type: 'is_null', nb_inputs: 0, multiple: false, apply_to: ['string', 'number', 'datetime', 'boolean'] },
				{ type: 'is_not_null', nb_inputs: 0, multiple: false, apply_to: ['string', 'number', 'datetime', 'boolean'] },
				{ type: 'last_n_minutes', nb_inputs: 1, multiple: false, apply_to: ['datetime'] },
				{ type: 'before_last_n_minutes', nb_inputs: 1, multiple: false, apply_to: ['datetime'] },
				{ type: 'before_last_n_days', nb_inputs: 1, multiple: false, apply_to: ['datetime'] },
				{ type: 'period', nb_inputs: 1, multiple: true, apply_to: ['datetime'] },
				{ type: 'is', nb_inputs: 1, multiple: false, apply_to: ['string', 'number'] }
			];
		}

		function getQueryBuilderFilters(items, lang_code) {

			if (!lang_code) {
				lang_code = $translate.use();
			}

			function handleHideShowDatePicker(elem, operator) {
				if (operator == "period") {
					elem.find('[name$=_4]').show();
					elem.find('[name$=_5]').hide();
					elem.find('[name$=_2]').hide();
					elem.find('[name$=_3]').hide();
					// $(rule.$el).find('.rule-value-container [name$=_4]').trigger('change');
				} else {
					elem.find('[name$=_4]').hide();
					elem.find('[name$=_5]').hide();
					if (operator == "last_n_minutes" || operator == "before_last_n_minutes" || operator == "before_last_n_days") {
						elem.find('[name$=_3]').show();
						elem.find('[name$=_2]').hide();
					} else {
						elem.find('[name$=_3]').hide();
						elem.find('[name$=_2]').show();
					}
				}
			}

			var customDateTimePicker = function (qb, rule, name, operator, lang_code) {
				var elems = $(document.createDocumentFragment());
				// var number = name.substr(-2);
				function notifyChanges(event) {
					if (!rule._updating_input) {
						rule._updating_value = true;
						rule.value = qb.getRuleInputValue(rule);
						rule._updating_value = false;
					}
				}
				function changePeriod(event) {
					var element = event.target;
					if ($(element).is(":visible")) {
						var period = $(element).val();
						if (period == "days") {
							var c = rule.$el.find(".rule-value-container [name$=_5]").show();
							if (!c.val()) {
								c.val(1);
							}
						} else {
							rule.$el.find(".rule-value-container [name$=_5]").hide();
						}
					}
				}
				var elem;
				elem = $('<input>', { name: name + '_2' });
				elem.on('change', notifyChanges);
				elems.append(elem);
				elem = $('<input>', { name: name + '_3', type: 'number' });
				elem.on('change', notifyChanges);
				elems.append(elem);
				var select = $('<select>', { name: name + '_4' });
				for (var p in { 'day': 0, 'days': 0, 'week': 0, 'month': 0 }) {
					var o = $('<option>', { value: p }).text(qb.translate('periods', p));
					select.append(o);
				}
				select.on('change', changePeriod);
				select.on('change', notifyChanges);
				elems.append(select);
				elem = $('<input>', { name: name + '_5', type: 'number' });
				elem.on('change', notifyChanges);
				elems.append(elem);
				handleHideShowDatePicker(elems, operator);
				// elem = elems.find('[name$=_5]');
				return elems;
			};
			function isEmpty(obj) {
				if (!obj) return true;
				for (var key in obj) {
					if (obj.hasOwnProperty(key))
						return false;
				}
				return true;
			}

			var filters = [];
			for (var key in items) {
				var filterDef = items[key];
				var type = filterDef.type || filterDef.TYPE;
				var label = filterDef.label || filterDef.name;
				var id = filterDef.nameOrAsName || filterDef.name || key;
				var field = filterDef.field || id;
				var lc = (type == "list" ? { lowercase: '1' } : {});

				if (type === "term" || type == "list") { type = "string"; }

				if (type === "number") { type = "integer"; }

				var filter = { id: id, field: field, type: type, label: label, data: lc };

				var mapping = filterDef.values;
				if (isEmpty(mapping))
					mapping = filterDef.MAPPING_LIST || filterDef.MAPPING_ENUM || "";
				//if (key == 'SOURCE') mapping =  [ "BB", "TX", "CX", "MOB", "RDG"];
				//if (key == 'SEVERITY') mapping =  { "CLEAR" :  0, "INFO" : 1,"WARNING" : 2,"MINOR" : 3,"MAJOR" : 4 ,"CRITICAL" : 5 };
				if (mapping || id in decodes || filterDef.REVERSE_LIST) {
					//alert ("Decode "+key+" Type "+type);
					var valueGetter = function (rule) {
						var el = rule.$el.find('.rule-value-container select[name$=_0]');
						if (rule.operator.nb_inputs == 1) {
							var r = rule.$el.find('.rule-value-container [name$=_0]').val();
							//alert("Valori: "+r);
							return r;
						}
					};
					filter['input'] = "select";
					filter['valueGetter'] = valueGetter;
					if (filterDef.REVERSE_LIST) {
						filter['operators'] = ['is'];
						filter['values'] = filterDef.REVERSE_LIST;
					} else {
						filter['operators'] = ['equal', 'not_equal', 'in', 'not_in', 'is_null', 'is_not_null'];
						filter['values'] = getDecodedValues(id, mapping);
					}
				} else {
					if (type == "integer") {

						var valueGetter = function (rule) {
							if (rule.operator.type == "in" || rule.operator.type == "not_in") {
								var v = rule.$el.find('.rule-value-container input').val();
								var r = v.toString().split(',');
								//alert("Valori: "+r);
								return r;
							}
							if (rule.operator.nb_inputs == 1) {
								var r = rule.$el.find('.rule-value-container [name$=_0]').val();
								//alert("Valori: "+r);
								return r;
							}
							if (rule.operator.nb_inputs == 2) {
								var r = [];
								r.push(rule.$el.find('.rule-value-container [name$=_0]').val());
								r.push(rule.$el.find('.rule-value-container [name$=_1]').val());
								//alert("Between Valori: "+r);
								return r;
							}
						};
						filter['valueGetter'] = valueGetter;
						filter['input'] = "text";
					}
				}

				if (type === "date") {
					var format = (filterDef.format ? filterDef.format : 'YYYY-MM-DD HH:mm:ss');

					var pluginformat = '';
					if (format.indexOf("y") > -1 || format.indexOf("Y") > -1) {
						pluginformat = 'YYYY-MM-DD';
					}

					if (format.indexOf("h") > -1 || format.indexOf("H") > -1) {
						if (pluginformat.length > 0) pluginformat = pluginformat + ' ';
						pluginformat = pluginformat + 'HH:mm:ss';
					}
					var inputFunction = function (rule, name) {
						var qb = this;
						/**/
						var $opcontainer = rule.$el.find('.rule-operator-container select');
						var customObj;
						var operator = $opcontainer.val();
						customObj = customDateTimePicker(qb, rule, name, operator, lang_code);
						if ($opcontainer.attr(name + 'eventAttached') !== true) {
							$opcontainer.attr(name + 'eventAttached', true);
							$opcontainer.on('change', function () {
								var operator = $(this).val();
								var valueContainer = $(rule.$el).find('.rule-value-container');
								handleHideShowDatePicker(valueContainer, operator);
							});
						}


						var $container = rule.$el.find('.rule-value-container');

						$container.on('dp.hide', function (e) {
							//alert("dp.close triggered inside");
							if (e && e.target) {
								//$(e.target).parent().find(".rule-value-container").val($(e.target).val());
								$(e.target).change();
							}
						});
						$container.on('dp.change', function (e) {
							//alert("dp.change triggered inside");
							if (e && e.target) {
								//$(e.target).parent().find(".rule-value-container").val($(e.target).val());
								$(e.target).change();
							}
						});


						return customObj;
					};

					var valueGetter = function (rule) {
						var qb = this;
						if (rule.operator.nb_inputs > 0) {
							if (qb.settings.saveNativeRules) {
								switch (rule.operator.type) {
									case 'period':
										var r = [];
										var period = rule.$el.find('.rule-value-container [name$=_4]').val();
										r.push(period);
										if (period == 'days') {
											var days = rule.$el.find('.rule-value-container [name$=_5]').val() || 1;
											r.push(days);
										}
										return r;
									case 'last_n_minutes':
									case 'before_last_n_minutes':
									case 'before_last_n_days':
										var val = rule.$el.find('.rule-value-container [name$=_3]').val() || 1;
										return val;
								}
							}
							if (rule.operator.nb_inputs == 1) {

								if (rule.operator.type == 'period') {
									var r = [];
									var period = rule.$el.find('.rule-value-container [name$=_4]').val();
									//alert ("period = "+period);
									if (period == 'day') {
										r.push("SYSDATE - 1"); // "NOW - 1"); 
										r.push("SYSDATE"); // "NOW");
									} else if (period == 'days') {
										var days = rule.$el.find('.rule-value-container [name$=_5]').val() || 1;
										rule.$el.find('.rule-value-container [name$=_5]').val(days);
										r.push("TRUNC(SYSDATE) - INTERVAL '" + days + "' day"); //"TRUNC(NOW) - "+days);
										r.push("TRUNC(SYSDATE)"); //"TRUNC(NOW)");
									} else if (period == 'week') {
										r.push("TRUNC(SYSDATE,'IW')");//"TRUNC(NOW,IW)");
										r.push("TRUNC(SYSDATE,'IW')+7-1/86400"); //"TRUNC(TO_DATE(NOW),IW)+7-1 second");
									} else if (period == 'month') {
										r.push("TRUNC(ADD_MONTHS(SYSDATE, -1),'MM')");//"TRUNC(ADD_MONTHS(NOW, -1),MM)");
										r.push("TRUNC(SYSDATE,'MM')-1/86400"); //"TRUNC(NOW,MM)-1 second");
									}
									//alert ("R:"+ r[0]+"-"+r[1]);
									return r;
								} else
									if (rule.operator.type == 'last_n_minutes') {
										//between 
										var r = [];
										var minutes = rule.$el.find('.rule-value-container [name$=_3]').val() || 1;
										rule.$el.find('.rule-value-container [name$=_3]').val(minutes);
										r.push("SYSDATE - INTERVAL '" + minutes + "' minute"); //"NOW - "+minutes+" minute");			
										r.push("SYSDATE"); //"NOW");
										//alert ("R:"+ r[0]+"-"+r[1]);
										return r;
									} else if (rule.operator.type == 'before_last_n_minutes' || rule.operator.type == 'before_last_n_days') {
										//less
										var value = rule.$el.find('.rule-value-container [name$=_3]').val() || 1;
										rule.$el.find('.rule-value-container [name$=_3]').val(value);
										if (rule.operator.type == 'before_last_n_minutes') {
											var value = rule.$el.find('.rule-value-container [name$=_3]').val() || 1;
											return "SYSDATE - INTERVAL '" + value + "' minute";//"NOW - "+value+" minute";			
										} else if (rule.operator.type == 'before_last_n_days') {
											return "TRUNC(SYSDATE) - INTERVAL '" + value + "' day";//"NOW - "+value+" minute";			
										}
									}

								var r = /*"CUSTOM." + */rule.$el.find('.rule-value-container [name$=_2]').val();
								//alert ("R:"+r);
								return r;
							} else {
								var r = [];
								r.push(rule.$el.find('.rule-value-container [name$=_0_2]').val());
								r.push(rule.$el.find('.rule-value-container [name$=_1_2]').val());
								//alert ("R:"+ r[0]+"-"+r[1]);
								return r;
							}
						}
					};
					var valueSetter = function (rule, value) {
						//alert("Value Setter:" +value);
						//alert("op "+rule.operator.type);
						var name = rule.id;
						var operator = rule.operator.type;
						var setted = false;

						if (operator == 'last_n_minutes' || operator == 'before_last_n_minutes' ||
							operator == 'before_last_n_days') {
							var tmpValue = value;
							if (typeof tmpValue === 'string')
								tmpValue = Number.parseInt(tmpValue);
							if (typeof tmpValue === 'number' && tmpValue !== NaN) {
								// rule.$el.find('.rule-operator-container select').val(operator).trigger('change');
								//alert("Value Setter minutes :" +minutes[1]);
								rule.$el.find('.rule-value-container [name=' + name + '_value_0_2]').hide();
								rule.$el.find('.rule-value-container [name=' + name + '_value_0_3]').val(tmpValue).show();
								rule.$el.find('.rule-value-container [name=' + name + '_value_0_4]').hide();
								rule.$el.find('.rule-value-container [name=' + name + '_value_0_5]').hide();
								return;
							}
						} else if (operator == 'period') {
							var val0 = value[0];
							switch (val0) {
								case 'day':
								case 'week':
								case 'month':
									// rule.$el.find('.rule-operator-container select').val(operator).trigger('change');
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_2]').hide();
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_3]').hide();
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_4]').val(val0).show().trigger("change");
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_5]').hide();
									return;
								case 'days':
									var val1 = value[1] || 1;
									if (typeof val1 === 'string')
										val1 = Number.parseInt(val1);
									if (typeof val1 === 'number' && val1 !== NaN) {
										// rule.$el.find('.rule-operator-container select').val(operator).trigger('change');
										rule.$el.find('.rule-value-container [name=' + name + '_value_0_2]').hide();
										rule.$el.find('.rule-value-container [name=' + name + '_value_0_3]').hide();
										rule.$el.find('.rule-value-container [name=' + name + '_value_0_4]').val(val0).show().trigger("change");
										rule.$el.find('.rule-value-container [name=' + name + '_value_0_5]').val(val1).show();
										return;
									}
							}
						}

						if (rule.operator.type == 'less' || rule.operator.type == 'before_last_n_minutes' ||
							rule.operator.type == 'before_last_n_days') {

							var minutes = /SYSDATE - INTERVAL '(\d*)' minute/.exec(value);
							var days = /TRUNC(SYSDATE) - INTERVAL '(\d*)' day/.exec(value);

							if (minutes) {
								//alert("Minutes: "+minutes);
								if (operator != 'before_last_n_minutes')
									rule.$el.find('.rule-operator-container select').val('before_last_n_minutes').trigger('change');

								//alert("Value Setter minutes :" +minutes[1]);
								rule.$el.find('.rule-value-container [name=' + name + '_value_0_3]').val(minutes[1]);
								rule.$el.find('.rule-value-container [name=' + name + '_value_0_3]').show();
								rule.$el.find('.rule-value-container [name=' + name + '_value_0_2]').hide();
								rule.$el.find('.rule-value-container [name=' + name + '_value_0_4]').hide();
								rule.$el.find('.rule-value-container [name=' + name + '_value_0_5]').hide();
								setted = true;
							} else if (days) {
								//alert("Days: "+days);
								if (operator != 'before_last_n_days')
									rule.$el.find('.rule-operator-container select').val('before_last_n_days').trigger('change');

								//alert("Value Setter minutes :" +minutes[1]);
								rule.$el.find('.rule-value-container [name=' + name + '_value_0_3]').val(days[1]);
								rule.$el.find('.rule-value-container [name=' + name + '_value_0_3]').show();
								rule.$el.find('.rule-value-container [name=' + name + '_value_0_2]').hide();
								rule.$el.find('.rule-value-container [name=' + name + '_value_0_4]').hide();
								rule.$el.find('.rule-value-container [name=' + name + '_value_0_5]').hide();
								setted = true;
							}

						} else if (rule.operator.type == 'last_n_minutes' || rule.operator.type == 'period' || rule.operator.type == 'between') {
							//alert ("between");
							if (value && value.length == 1) {
								var val0 = value[0];
								if (operator == 'period') {
									switch (val0) {
										case 'day':
										case 'week':
										case 'month':
											rule.$el.find('.rule-value-container [name=' + name + '_value_0_2]').hide();
											rule.$el.find('.rule-value-container [name=' + name + '_value_0_3]').hide();
											rule.$el.find('.rule-value-container [name=' + name + '_value_0_4]').val(val0).show().trigger("change");
											rule.$el.find('.rule-value-container [name=' + name + '_value_0_5]').hide();
											setted = true;
											break;
									}
								}

							} else if (value && value.length == 2) {
								var val0 = value[0];
								var minutes = /^SYSDATE - INTERVAL '(\d*)' minute$/.exec(val0);
								var days = /^TRUNC\(SYSDATE\) - INTERVAL '(\d*)' day$/.exec(val0);
								var val1 = value[1];
								if (val0 == 'SYSDATE - 1' && val1 == 'SYSDATE') {
									if (operator != 'period')
										rule.$el.find('.rule-operator-container select').val('period').trigger('change');
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_2]').hide();
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_3]').hide();
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_4]').show();
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_5]').hide();
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_4]').val("day").trigger("change");
									setted = true;
								} else if (days && val1 == 'TRUNC(SYSDATE)') {
									if (operator != 'period')
										rule.$el.find('.rule-operator-container select').val('period').trigger('change');
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_2]').hide();
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_3]').hide();
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_4]').show();
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_5]').val(days[1]);
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_5]').show();
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_4]').val("days").trigger("change");
									setted = true;
								} else if (minutes && val1 == 'SYSDATE') {
									if (operator != 'last_n_minutes')
										rule.$el.find('.rule-operator-container select').val('last_n_minutes').trigger('change');
									//alert("Value Setter minutes :" +minutes[1]);
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_3]').val(minutes[1]);
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_3]').show();
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_2]').hide();
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_4]').hide();
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_5]').hide();
									setted = true;
								} else if (val0 == "TRUNC(SYSDATE,'IW')" && val1 == "TRUNC(SYSDATE,'IW')+7-1/86400") {
									//week
									if (operator != 'period')
										rule.$el.find('.rule-operator-container select').val('period').trigger('change');
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_2]').hide();
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_3]').hide();
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_4]').show();
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_5]').hide();
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_4]').val("week").trigger("change");
									setted = true;
								} else if (val0 == "TRUNC(ADD_MONTHS(SYSDATE, -1),'MM')" && val1 == "TRUNC(SYSDATE,'MM')-1/86400") {
									//month
									if (operator != 'period')
										rule.$el.find('.rule-operator-container select').val('period').trigger('change');
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_2]').hide();
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_3]').hide();
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_4]').show();
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_5]').hide();
									rule.$el.find('.rule-value-container [name=' + name + '_value_0_4]').val("month").trigger("change");
									setted = true;
								}

							}
						}
						if (!setted) {
							var valuesArray = [];
							if (rule.operator.nb_inputs == 1) {
								valuesArray = [value];
							} else if (rule.operator.nb_inputs == 2) {
								valuesArray = value;
							}
							valuesArray.forEach(function (val, index) {
								rule.$el.find('.rule-value-container [name$=_' + index + '_2]').show();
								rule.$el.find('.rule-value-container [name$=_' + index + '_3]').hide();
								rule.$el.find('.rule-value-container [name$=_' + index + '_4]').hide();
								rule.$el.find('.rule-value-container [name$=_' + index + '_5]').hide();
								if (/^\d{4}-\d{2}-\d{2}/.exec(val)) {
									rule.$el.find('.rule-value-container [name$=_' + index + '_2]').val(val).trigger('change');
								}
							});
						}
					};

					filter['type'] = "datetime";
					filter['operators'] = ['equal', 'not_equal', 'less', 'less_or_equal',
						'greater', 'greater_or_equal', 'between', 'not_between',
						'last_n_minutes', 'before_last_n_minutes', 'before_last_n_days', 'period', 'is_null', 'is_not_null'];
					filter['input'] = inputFunction;
					filter['valueGetter'] = valueGetter;
					filter['valueSetter'] = valueSetter;
				}

				if (type === "double") {
					filter['validation'] = { step: 0.01 };
				}

				filters.push(filter);
			}
			return filters;
		}
	}
}));
