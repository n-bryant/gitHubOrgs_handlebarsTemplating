(function() {
  "use strict";

  const orgModule = function() {
    const apiKey = 'c9089c2bd03596f23f634b67cfd08b4e42269901';
    const oopsContainer = document.querySelector('.oops');
    const orgsListContainer = document.querySelector('.orgs-list-container')
    const searchForm = document.querySelector('.search-form');

    let currentSearch = '';

    class OrgDetails {
      constructor(orgObj) {
        this.user = currentSearch;
        this.avatar = orgObj.avatar_url;
        this.description = orgObj.description;
        this.name = orgObj.login;
        this.url = `https://github.com/${this.name}`;
        this.build();
      }

      // building list of organizations using handlebars template
      build() {
        const source = $('#org-template').html();
        const template = Handlebars.compile(source);
        const context = {
          avatar: this.avatar,
          description: this.description,
          name: this.name,
          user: this.user,
          url: this.url
        };
        const html = template(context);

        $('.orgs-list-container').append(html);
      }
    };

    // binding event listeners
    function bindEvents() {
      // form submission
      searchForm.addEventListener('submit', () => {
        orgsListContainer.innerHTML = '';
        event.preventDefault();

        currentSearch = event.target[0].value;
        document.querySelector('.query').innerText = currentSearch + ': ';
        if ($('.query-container').hasClass('is-hidden')) {
          $('.query-container').removeClass('is-hidden');
        }

        getOrgData(currentSearch);
        searchForm.reset();
      });
    }

    // calling GitHub API for org data
    function getOrgData(query) {
      query = encodeURIComponent(query);
      $.ajax({
        type: 'GET',
        url: `https://api.github.com/users/${query}/orgs?api_key=${apiKey}`
      }).then((orgs) => {
        let orgsList = orgs;
        if (orgsList.length === 0) {
          $(oopsContainer).removeClass('is-hidden');
        } else {
          if(oopsContainer.classList !== 'oops is-hidden') {
            $('.oops').addClass('is-hidden');
          }
          for(let index = 0; index < orgsList.length; index++) {
            new OrgDetails(orgsList[index]);
          }
        }
        console.log(orgs);
      }).catch((error) => {
        console.log(error);
      });
    }

    // initialize with call to event listener setup
    function init() {
      bindEvents();
    }

    return {
      init: init
    };
  };

  const orgApp = orgModule();
  orgApp.init();
})();
