import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['comment-item'],
  currentUser: Ember.inject.service(),

  actions: {
    deleteComment() {
      if (confirm("Вы уверены, что хотите удалить свой комментарий?")) {
        this.get('comment').deleteRecord();
        this.get('comment').save();
      }
    }
  },

  isCurrentUserAuthor: Ember.computed('currentUser', 'comment', function() {
    return this.get('currentUser.id') === this.get('comment.author.userId');
  })
});