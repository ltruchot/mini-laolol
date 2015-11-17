require(['app/LaoLetterChallenge',
        'dojo/_base/array',
        'dojo/aspect',
        'dojo/dom',
        'dojo/dom-attr',
        'dojo/dom-class',
        'dojo/dom-construct',
        'dojo/json',
        'dojo/NodeList-dom',
        'dojo/NodeList-traverse',
        'dojo/on',
        'dojo/query',
        'dojo/text!/public/json/consonants.json',
        'dojo/text!/public/json/vowels.json',
        'dojo/text!/public/json/numbers.json',
        'dojo/domReady!'
    ],
    function(LaoLetterChallenge, array, aspect, dom, domAttr, domClass, domConstruct, JSON, nlDom, nlTraverse, on, query, jsonConsonants, jsonVowels, jsonNumbers) {
        var handlers = [];
        var games = [];

        //get commons dom elements
        var laoLetterChallengeContainerNode = dom.byId('laoLetterChallengeContainer');
        var laoLetterTabContainerNode = dom.byId('laoLetterTabContainer');
        var globalLoaderNode = dom.byId('globalLoaderNode');

        //consonants challenge construct
        var laoLetterChallengeConsonant = new LaoLetterChallenge(JSON.parse(jsonConsonants), 'consonant');
        domConstruct.place(laoLetterChallengeConsonant.domNode, laoLetterChallengeContainerNode);

        //vowels challenge construct
        var laoLetterChallengeVowel = new LaoLetterChallenge(JSON.parse(jsonVowels), 'vowel');
        domConstruct.place(laoLetterChallengeVowel.domNode, laoLetterChallengeContainerNode);

        //numbers challenge construct
        var laoLetterChallengeNumber = new LaoLetterChallenge(JSON.parse(jsonNumbers), 'number');
        domConstruct.place(laoLetterChallengeNumber.domNode, laoLetterChallengeContainerNode);

        aspect.after(laoLetterChallengeConsonant, 'startup', function() {
            domClass.add(globalLoaderNode, 'hidden');
        });
        laoLetterChallengeConsonant.startup();
        laoLetterChallengeVowel.startup();
        laoLetterChallengeNumber.startup();

        //iterate on all games and configure first display
        games.push(laoLetterChallengeConsonant, laoLetterChallengeVowel, laoLetterChallengeNumber);
        domClass.remove(games[0].domNode, 'hidden');
        handlers.push(on(laoLetterTabContainerNode, '.simple-tab:click', function(event) {
            query('.simple-tab').addClass('inactive');
            var currentTab = query(event.target).closest('.simple-tab');
            domClass.remove(currentTab[0], 'inactive');
            var currentTitle = domAttr.get(currentTab[0], 'title');
            array.forEach(games, function(game) {
                if (game.title === currentTitle) {
                    domClass.remove(game.domNode, 'hidden');
                } else {
                    domClass.add(game.domNode, 'hidden');
                }
            });
        }));
    }
);
