Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

$(document).ready(function() {

  $('#search').submit(function(e){

    // clear the results
    $('#results').empty();

    // form query string
    var query = 'http://api.discogs.com/database/search?type=release&format=vinyl&title=' + encodeURIComponent($('input[name="search"]').val()); 

    // show the results 
    $.getJSON(query,function(data){
      $.each(data.results,function(ii,result) {
        $('#results').append('<li><img src="' + result.thumb + '"><p>' + result.title + ' | ' + result.year +  ' <a href="#" data-resource="' + result.resource_url + '"></a></p></li>')
        console.log(result);
      });
    })

    e.preventDefault(); 
  });

  $('#results').on('click','a',function(e){

    var createRecord = function (data) {

      // create the record 
      var Record = Parse.Object.extend('Record');
      var record = new Record(); 

      var user_relation = record.relation('user'); 
      user_relation.add(Parse.User.current());

      record.set('discogsId',data.id);
      record.set('discogsURL',data.resource_url);
      record.set('image',data.images[0].resource_url);
      record.set('recordName',data.title);
      record.set('recordLabel',data.labels[0].name);
      record.set('recordArtist',data.artists[0].name);
      record.set('recordYear',data.year);

      record.save(null,{
        success: function(record) {          
          console.log("saved");
        }, 
        error: function(record, error) {
          console.log("error");
        }

      })
    };

    var resource_url = $(this).data('resource');

    $.getJSON(resource_url,function(data){
      createRecord(data);
    });

    return false;
  })

});