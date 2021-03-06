import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: ['pageNumber'],
  pageNumber: 0,
  pageSize: 16,

  scrollOnPageChange: Ember.observer('pageNumber', function() {
    Ember.$(window).scrollTop(0);
  }),

  foundCocktails: Ember.computed('recipes.[]', function() {
    return this.get('recipes') && this.get('recipes').get('length') > 0;
  }),

  nextPageNumber: Ember.computed('pages', 'pageNumber', function() {
    return this.get('pageNumber') + 1;
  }),

  previousPageNumber: Ember.computed('pages', 'pageNumber', function() {
    return this.get('pageNumber') - 1;
  }),

  isNextPageExist: Ember.computed('pages', 'pageNumber', function() {
    return this.get('pageNumber') + 1 < this.get('pages').length;
  }),

  isPreviousPageExist: Ember.computed('pages', 'pageNumber', function() {
    return this.get('pageNumber') - 1 >= 0 && this.get('pages').length > 0;
  }),

  pages: Ember.computed('recipes.[]', 'pageSize', function() {
    var pages = [];
    var that = this;
    if (this.get('recipes') != null) {
      var allRecipes = this.get('recipes');
      var index = 0;
      var curPageIndex = 0;
      while (index < allRecipes.get('length')) {
        var page = [];
        while (index < (curPageIndex + 1) * that.get('pageSize') && index < allRecipes.get('length')) {
          page.push(allRecipes.objectAt(index));
          index++;
        }
        pages.push(page);
        curPageIndex++;
      }
    }
    return pages;
  }),

  recipesOnPage: Ember.computed('pages', 'pageNumber', function() {
    return this.get('pages')[this.get('pageNumber')];
  })
});
