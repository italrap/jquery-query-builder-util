

(function (root, factory) {
  if (typeof define == 'function' && define.amd) {
    define(['jquery', 'query-builder'], factory);
  }
  else {
    factory(root.jQuery);
  }
}(this, function ($) {
  'use strict';

  var QueryBuilder = $.fn.queryBuilder;
  if (QueryBuilder.regional_custom === undefined) {
    QueryBuilder.regional_custom = {};
  }
  var ignore_case = ' (ignora maiusc.)';
  QueryBuilder.regional_custom['en'] = {
    periods: {
      day: 'last 24 hours',
      days: 'previous n days',
      week: 'previous week',
      month: 'previous month',
    },
  }

  QueryBuilder.regional_custom['it'] = {
    /*
    'add_rule': 'Add rule',
    'add_group': 'Add group',
    'delete_rule': 'Delete',
    'delete_group': 'Delete',
    */
    /* metto solo le icone */
    'add_rule': ' ',
    'add_group': ' ',
    'delete_rule': ' ',
    'delete_group': ' ',
    'collapse': ' ',
    'conditions': {
      'AND': 'AND',
      'OR': 'OR'
    },
    'operators': {
      'equal_ic': 'uguale' + ignore_case,
      'not_equal_ic': 'non uguale' + ignore_case,
      'in_ic': 'in' + ignore_case,
      'not_in_ic': 'non in' + ignore_case,
      'begins_with_ic': 'inizia con' + ignore_case,
      'not_begins_with_ic': 'non inizia con' + ignore_case,
      'contains_ic': 'contiene' + ignore_case,
      'not_contains_ic': 'non contiene' + ignore_case,
      'ends_with_ic': 'finisce con' + ignore_case,
      'not_ends_with_ic': 'non finisce con' + ignore_case,
      'between': 'compreso tra',
      'not_between': 'non compreso tra',
      'period': 'periodo',
      'last_n_minutes': 'ultimi n minuti',
      'before_last_n_minutes': 'precedente agli ultimi n minuti',
      'before_last_n_days': 'precedente agli ultimi n giorni',
      'is': 'è',
      /*
      'less': 'less',
      'less_or_equal': 'less or equal',
      'greater': 'greater',
      'greater_or_equal': 'greater or equal',
      'is_empty': 'is empty',
      'is_not_empty': 'is not empty',
      'is_null': 'is null',
      'is_not_null': 'is not null'
      */
    },
    periods: {
      day: 'ultime 24 ore',
      days: 'ultimi n giorni completi',
      week: 'ultima settimana completa',
      month: 'ultimo mese completo',
    },
    'errors': {
      /*
      'no_filter': 'No filter selected',
      'empty_group': 'The group is empty',
      'radio_empty': 'No value selected',
      'checkbox_empty': 'No value selected',
      'select_empty': 'No value selected',
      'string_empty': 'Empty value',
      'string_exceed_min_length': 'Must contain at least {0} characters',
      'string_exceed_max_length': 'Must not contain more than {0} characters',
      'string_invalid_format': 'Invalid format ({0})',
      'number_nan': 'Not a number',
      'number_not_integer': 'Not an integer',
      'number_not_double': 'Not a real number',
      'number_exceed_min': 'Must be greater than {0}',
      'number_exceed_max': 'Must be lower than {0}',
      'number_wrong_step': 'Must be a multiple of {0}',
      'datetime_empty': 'Empty value',
      'datetime_invalid': 'Invalid date format ({0})',
      'datetime_exceed_min': 'Must be after {0}',
      'datetime_exceed_max': 'Must be before {0}',
      'boolean_not_valid': 'Not a boolean',
      'operator_not_multiple': 'Operator \'{1}\' cannot accept multiple values'
      */
    },
    // 'invert': 'Invert',
    // 'NOT': 'NOT'
  };

}));