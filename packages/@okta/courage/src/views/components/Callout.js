define([
  'okta/underscore',
  'shared/views/BaseView',
  'shared/util/Time'
], function (_, BaseView, Time) {

  function getOption(callout, option) {
    return _.resultCtx(callout.options, option, callout) || _.result(callout, option);
  }

  function getTopClass(callout) {
    var klass = 'infobox clearfix infobox-' + getOption(callout, 'type');
    switch (getOption(callout, 'size')) {
    case 'standard':
      klass += '';
      break;
    case 'slim':
      klass += ' infobox-slim';
      break;
    case 'compact':
      klass += ' infobox-compact';
      break;
    case 'large':
      klass += ' infobox-md';
      break;

    }
    if (getOption(callout, 'dismissible')) {
      klass += ' infobox-dismiss';
    }
    return klass;
  }

  var events = {
    'click .infobox-dismiss-link': function (e) {
      e.preventDefault();
      this.$el.fadeOut(Time.UNLOADING_FADE, _.bind(this.remove, this));
    }
  };

  var template = '\
    {{#if dismissible}}\
      <a class="infobox-dismiss-link" title="Dismiss" href="#">\
        <span class="dismiss-icon"></span>\
      </a>\
    {{/if}}\
    <span class="icon {{icon}}"></span>\
    {{#if title}}<h3>{{title}}</h3>{{/if}}\
    {{#if subtitle}}<p>{{subtitle}}</p>{{/if}}\
    {{#if bullets}}\
      <ul class="bullets">\
      {{#each bullets}}<li>{{this}}</li>{{/each}}\
      </ul>\
    {{/if}}\
  ';

  /**
   * @class src/views/components/Callout
   * @extends module:Okta.View
   */

  var Callout = BaseView.extend(/** @lends src/views/components/Callout.prototype */ {

    /**
     * Custom HTML or view to inject to the callout
     * @type {String|Okta.View}
     */
    content: null,

    /**
     * Size of icon. options are standard, large, compact
     * @type {String}
     */
    size: 'standard',

    /**
     * Type of the callout. Valid values are: info, success, warning, error, tip
     * @type {String}
     */
    type: 'info',

    /**
     * Can the callout be dismissed
     * @type {Boolean}
     */
    dismissible: false,

    /**
     * Callout title
     * @type {String}
     */
    title: null,

    /**
     * Callout subtitle
     * @type {String}
     */
    subtitle: null,

    /**
     * Array of strings to render as bullet points
     * @type {Array}
     */
    bullets: null,

    constructor: function () {
      this.events = _.defaults(this.events || {}, events);

      BaseView.apply(this, arguments);

      this.$el.addClass(getTopClass(this));

      this.template = template;

      var content = getOption(this, 'content');
      if (content) {
        this.add(content);
      }
    },

    getTemplateData: function () {
      var icon = getOption(this, 'type');
      const size = getOption(this, 'size');
      if (icon === 'tip') { // css is inconsistent
        icon = 'light-bulb';
      }
      switch (size) {
      case 'slim':
        icon = '';
        break;
      case 'large':
        icon = [icon, '-', '24'].join('');
        break;
      default:
        icon = [icon, '-', '16'].join('');
      }
      return {
        icon,
        title: getOption(this, 'title'),
        subtitle: getOption(this, 'subtitle'),
        bullets: getOption(this, 'bullets'),
        dismissible: getOption(this, 'dismissible')
      };
    }
  });

  /**
   * @class module:Okta.internal.views.components.Callout
   */
  return /** @lends module:Okta.internal.views.components.Callout */ {
    /**
     * Creates a {@link src/views/components/Callout|Callout}.
     * @static
     * @param {Object} options
     * @param {String|Function} [options.size] Size of icon. options are standard, large, compact, slim
     * @param {String|Okta.View} [options.content] Custom HTML or view to inject to the callout
     * @param {String|Function} [options.title] Callout title
     * @param {String|Function} [options.subtitle] Callout subtitle
     * @param {Array|Function} [options.bullets] Array of strings to render as bullet points
     * @param {Boolean|Function} [options.dismissible] Can the callout be dismissed
     * @param {String|Function} [options.type] Callout type. Valid values are: info, success, warning, error, tip
     *
     * @return {src/views/components/Callout}
     */
    create: function (options) {
      return new Callout(options);
    }
  };


});
