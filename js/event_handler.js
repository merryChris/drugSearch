(function($) {
  $('form#search').submit(function(e) {
    e.preventDefault();
    var container = $('.display-container');
    container.find('.detail-container').hide();
    container.find('.result-container').show();
    var counterInfo = $.trim(container.find('.result-header .counter-info')[0].textContent);
    _searchHandler(!counterInfo, 1);
  });

  $('form .back-btn').click(function(e) {
    e.preventDefault();
    var container = $('.display-container');
    container.find('.detail-container').hide();
    container.find('.result-container').slideDown();
  });

  _searchHandler = function(needCounter, pageId) {
    var self = this;
    self.needCounter = needCounter;
    self.pageId = pageId;

    var data = {
        name: $('input#name').val(),
        needCounter: needCounter,
        pageId: pageId
    };
    var successCallback = function(drugs) {
      var container = $('form#search');
      var html = '';

      // Handle Pagination Logic.
      if (self.needCounter === true) {
        var paginationContainer = container.find('.pagination-container').empty();
        var currentPageId = self.pageId;
        container.find('.tab').empty().append('Drugs Overview');
        container.find('.counter-info').empty().append('There are <a class="blue-link">' + drugs.counter + '</a> related items.');
        paginationContainer.append('<a class="page-slot">Previous Page</a>');
        paginationContainer.append(_paginationHandler(currentPageId, Math.ceil(drugs.counter/drugs.unit)));
        paginationContainer.append('<a class="page-slot">Next Page</a>');
        $('form .page-slot').bind('click', _pagingHandler);
      }

      // Handle Content Logic.
      if (drugs.length && drugs.length > 0) {
        for (var i=0; i<drugs.length; i++) {
          var drug = drugs[i];
          var content = '<h3><a class="detail-link" href="#" dfi=' + drug.drug_function_id + '>' + drug.name + ' - ' + drug.company_name + '</a></h3>';
          content += '<span class="infomation">' + drug.approval_num + '</span>';
          html += '<li>' + content + '</li>';
        }
        html = '<ul>' + html + '</ul>';
      }
      container.find('.result-content').empty().append(html);
      $('form .detail-link').bind('click', _showDetailHandler);
    };
    var errorCallback = function(drugs) {
      alert("Search Yamiedie");
    };

    _requestHandler('get', 'engines/search.php', data, successCallback, errorCallback);
  };

  _Handler = function() {
  };

  _requestHandler = function(type, url, data, successCallback, errorCallback) {
    $.ajax({
      type: type,
      url: url,
      data: data,
      dataType: 'json',
      success: successCallback,
      error: errorCallback
    });
  };

  _pagingHandler = function(e) {
    if (e.target) {
      var container = $('form#search').find('.pagination-container');
      var tot = parseInt($('form#search').find('.counter-info .blue-link')[0].textContent);
      var len = container.children().length;
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

      return _searchHandler((aid <= 3 || aid >= len-4), idx);
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
  };

  _showDetailHandler = function(e) {
    if (e.target) {
      var self = this;
      self.container = $('.display-container');

      var data = {
        dfi: $(e.target).attr('dfi'),
      };
      var successCallback = function(drugFunction) {
        var df = drugFunction[0];
        self.container.find('.result-container').slideUp();
        self.container.find('.detail-container').show();

        var content = '<img id="drug-img" src="img/'+df.id+'_'+df.manual_id+'.jpg" onerror="_checkImg()" alt="' + df.name + '">';
        self.container.find('.pic-slot').empty().append(content);

        html = '';
        for(var attr in df) {
          if ($.trim(df[attr])) {
            content = '';
            switch (attr) {
               case 'name': content="【药品名称】"; break;
               case 'drug_components': content="【药品成分】"; break;
               case 'major_function': content="【功能主治】"; break;
               case 'indication' : content="【适应症】"; break;
               case 'usages': content="【用法用量】"; break;
               case 'untoward_reaction': content="【不良反应】"; break;
               case 'contradication': content="【禁忌症】"; break;
               case 'info': content="【注意事项】"; break;
               case 'properties': content="【药理作用】"; break;
               case 'store': content="【贮藏】"; break;
               case 'validity': content="【有效期】"; break;
               case 'approval_num': content="【批准文号】"; break;
               default: break;
            }

            if ($.trim(content)) {
              content = '<div class="drug-tab">' + content + '</div>';
              content += '<div class="drug-detail">' + df[attr] + '</div>';
              html += '<div class="drug-content">' + content + '</div>';
            }
          }
        }

        self.container.find('.info-slot').empty().append(html);
      };
      var errorCallback = function() {
        alert("Display Yamiedie");
      };

      _requestHandler('get', 'engines/detail.php', data, successCallback, errorCallback);
    }
  };

  _checkImg = function() {
    $("#drug-img").attr("src", "img/nopic.jpg");
  }
}).call(this, jQuery);
