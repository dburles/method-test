if (Meteor.isClient) {
  Meteor.subscribe('data')
  
  Session.setDefault('called', 0);
  Session.setDefault('received', 0);
  Session.setDefault('returned', 0);
  
  Template.hello.helpers({
    called: function() {
      return Session.get('called');
    },
    
    received: function() {
      return Session.get('received');
    },
    
    returned: function() {
      return Session.get('returned')
    }
  });
  
  Template.hello.events({
    'click input': function () {
      _.times(20, function() {
        Session.set('called', Session.get('called') + 1);
        Meteor.apply('test', [], {
          onResultReceived: function() {
            Session.set('received', Session.get('received') + 1)
          }
        }, function() {
          Session.set('returned', Session.get('returned') + 1);
        });
      });
    }
  });
}

if (Meteor.isServer) {
  var waitFor = function(time) {
    var Future = Npm.require('fibers/future');
    var f = new Future();
    Meteor.setTimeout(function() {
      f.return();
    }, time);
    return f.wait();
  };
  
  var speedLoop = function() {
    for (var i = 0; i < 1000000000; i++);
  }

  var Data = new Meteor.Collection('data');
  var SubData = new Meteor.Collection('subdata')
  Meteor.publish('data', function() {
    var self = this;
    Data.find().observeChanges({
      added: function(id, doc) {
        self.added('users', id, doc);
        
        SubData.find({dataId: id}).observeChanges({
          added: function(id, doc) {
            self.added('subdata', id, doc);
          }
        })
      }
    })
  });

  Meteor.methods({
    test: function() {
      speedLoop();
      var id = Data.insert({})
      SubData.insert({dataId: id});
    }
  });
}
