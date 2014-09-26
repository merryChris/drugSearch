(function($) {
  $('form#search').submit(function(e) {
    e.preventDefault();
    var container = $('form#search');
    var counterInfo = $.trim(container.find('.search-container .counter-info')[0].textContent);
    _requestHandler(!counterInfo, 1);
  });

  _requestHandler = function(needCounter, pageId) {
    var self = this;
    self.needCounter = needCounter;
    self.pageId = pageId;
    var successCallback = function(drugs) {
      var resultContainer = $('form#search').find('.result-container').empty();
      var html = '';

      // Handle Pagination Logic.
      if (self.needCounter === true) {
        var paginationContainer = $('form#search').find('.pagination-container').empty();
        var currentPageId = self.pageId;
        resultContainer.find('.result-counter').empty().append('There are <a class="blue-link">' + drugs.counter + '</a> related items.');
        paginationContainer.append('<a class="page-slot">Previous Page</a>');
        paginationContainer.append(_paginationHandler(currentPageId, Math.ceil(drugs.counter/drugs.unit)));
        paginationContainer.append('<a class="page-slot">Next Page</a>');
        paginationContainer.attr('page-total', drugs.counter);
        $('form .page-slot').bind('click', _pagingHandler);
      }

      // Handle Content Logic.
      if (drugs.length && drugs.length > 0) {
        for (var i=0; i<drugs.length; i++) {
          var drug = drugs[i];
          var content = '<h3><a href="#">' + drug.name + ' - ' + drug.company_name + '</a></h3>';
          content += '<span class="infomation">' + drug.approval_num + '</span>';
          html += '<li>' + content + '</li>';
        }
        html = '<ul>' + html + '</ul>';
      }
      resultContainer.empty().append(html);
    };

    $.ajax({
      type: 'get',
      url: 'engines/search.php',
      data: {
        name: $('input#name').val(),
        needCounter: needCounter,
        pageId: pageId
      },
      dataType: 'json',
      success: successCallback
    });
  };

  _pagingHandler = function(e) {
    if (e.target) {
      var container = $('form#search').find('.pagination-container');
      var len = container.children().length;
      var tot = parseInt(container.attr('page-total'));
      var pid = parseInt(container.find('.active')[0].textContent);
      var aid = _.indexOf(container.children(), container.find('.active')[0]);
      var tid = _.indexOf(container.children(), e.target);
      var idx = pid;

      container.find('.active').removeClass('active');

      if (tid == 0 && aid > 1) aid--, idx--;
      else if (tid == len-1 && pid < tot) aid++, idx++;
      else if (tid > 0 && tid < len-1) aid = tid, idx=parseInt(e.target.textContent);

      for (var i=0;i<container.children().length; i++) {
        if (parseInt(container.children()[i].textContent) == idx) {
          $(container.children()[i]).addClass('active');
          break;
        }
      }

      return _requestHandler((aid <= 3 || aid >= len-4), idx);
    }
  };

  _paginationHandler = function(currentId, totalId, pageToShow) {
    pageToShow |= 10;
    var htmlContent = '';
    var startId = Math.max(1, currentId - Math.floor(pageToShow / 2));
    var endId   = Math.min(totalId, startId + pageToShow - 1);
    if (endId - pageToShow >= 0) startId = Math.min(startId, endId - pageToShow + 1);
    for (var i=startId; i<=endId; i++) {
      if (i === currentId) {
        htmlContent += '<a class="page-slot active">' + i + '</a>';
      } else {
        htmlContent += '<a class="page-slot">' + i + '</a>';
      }
    }

    return htmlContent;
  }
}).call(this, jQuery);
