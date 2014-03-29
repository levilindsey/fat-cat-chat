/**
 * This module defines a collection of parameters used throughout this app.
 * @module params
 */
(function () {
  var params, moduleParams;

  params = {};

  params.BASE_DIR = '';

  // --- General app parameters --- //

  moduleParams = {};
  params.APP = moduleParams;

  moduleParams.TITLE = 'Fat-Cat Chat';
  moduleParams.VERSION = '0.0.4';
  moduleParams.LICENSE =
      'The MIT License (MIT). Copyright (c) 2014 Levi Lindsey <levi@jackieandlevi.com>.';

  // --- Panel parameters --- //

  moduleParams = {};
  params.PANELS = moduleParams;

  moduleParams.BODY_MARGIN = 16;
  moduleParams.BORDER_THICKNESS = 1;
  moduleParams.USERS_CONSOLE_WIDTH = 200;
//  moduleParams.PRIVATE_CONSOLE_WIDTH = 300;
//  moduleParams.PRIVATE_CONSOLE_HEIGHT = 260;
  moduleParams.TEXT_BOX_PADDING = 2;

  // --- Log parameters --- //

  moduleParams = {};
  params.LOG = moduleParams;

  moduleParams.RECENT_ENTRIES_LIMIT = 80;
  moduleParams.DEBUG = true;
  moduleParams.VERBOSE = false;

  moduleParams.SEPARATOR_LINE =
      '********************************************************************************';

  // --- Sprite parameters --- //

  moduleParams = {};
  params.SPRITES = moduleParams;

  moduleParams.SRC = params.BASE_DIR + '/images/spritesheet_32.png';

  // --- Localization parameters --- //

  params.L18N = {};

  moduleParams = {};
  params.L18N.EN = moduleParams;

  moduleParams.BAD_BROWSER_MESSAGE =
      ':( Sorry, but some of the fancy features of this app may not work on your browser. You should really upgrade to a newer version.';

  moduleParams.HELP_MESSAGES = [
    '&nbsp;- <code class=\'command\'>/help</code>: Type <code class=\'command\'>/help</code> to see a list of the available commands.',
    '&nbsp;- <code class=\'command\'>/rooms</code>: Type <code class=\'command\'>/rooms</code> to see all of the current rooms.',
    '&nbsp;- <code class=\'command\'>/join</code>: Type <code class=\'command\'>/join #&lt;channel_name&gt;</code> to join a new channel. If the channel did not previously exist, it will be created.',
    '&nbsp;- <code class=\'command\'>/msg</code>: Type <code class=\'command\'>/msg &lt;user_name&gt; (&lt;message&gt;)</code> to send a private message to a user.',
    '&nbsp;- <code class=\'command\'>/nick</code>: Type <code class=\'command\'>/nick &lt;new_nickname&gt;</code> to change your nickname.',
    '&nbsp;- <code class=\'command\'>/ping</code>: Type <code class=\'command\'>/ping &lt;user_name&gt;</code> to get the lag time between you and another user.',
    '&nbsp;- <code class=\'command\'>/ignore</code>: Type <code class=\'command\'>/ignore &lt;user_name&gt;</code> to ignore all messages from a user.',
    '&nbsp;- <code class=\'command\'>/leave</code>: Type <code class=\'command\'>/leave</code> to leave the chat room. If you are the last user to leave the channel, it will be removed.',
    '&nbsp;- <code class=\'command\'>/quit</code>: Type <code class=\'command\'>/quit</code> to be removed from the chat server.',
    '&nbsp;- <code class=\'command\'>/link</code>: Type <code class=\'command\'>/link &lt;http[s]://somelink.com&gt; (&lt;message&gt;)</code> anywhere within a message to indicate that the given message should be shown as a hyperlink pointing to the given URL.',
    '&nbsp;- All commands&mdash;except the <code class=\'command\'>/link</code> command&mdash;must be given as the first text in the message.',
    '&nbsp;- Type anything not prefixed with <code class=\'command\'>/</code> in order to send a message to everyone in the room.',
    '&nbsp;- Any word that starts with "http[s]://[...]" will be shown as an active hyperlink within the console.'
  ];

  // --- Bot parameters --- //

  moduleParams = {};
  params.BOT = moduleParams;

  moduleParams.INITIAL_COUNT = 3;

  moduleParams.ACTION_DELAY_MIN = 4000; // milliseconds
  moduleParams.ACTION_DELAY_MAX = 6000; // milliseconds

  moduleParams.ACTION_PROBABILITIES = {};
  moduleParams.ACTION_PROBABILITIES.MSG = 0.1;
  moduleParams.ACTION_PROBABILITIES.LEAVE = 0.01;
  moduleParams.ACTION_PROBABILITIES.QUIT = 0.005;
  moduleParams.ACTION_PROBABILITIES.PUBMSG = 0.635;
  moduleParams.ACTION_PROBABILITIES.JOIN = 0.15;
  moduleParams.ACTION_PROBABILITIES.NICK = 0.1;

  moduleParams.JOIN_CREATE_NEW_ROOM_PROB = 0.2;
  moduleParams.JOIN_ENTER_OLD_ROOM_PROB = 1 - moduleParams.JOIN_CREATE_NEW_ROOM_PROB;

  moduleParams.MSG_CAT_GIF_PROB = 0.3;
  moduleParams.MSG_EMOTICON_PROB = 0.3;
  moduleParams.MSG_TEXT_PROB = 1 - moduleParams.MSG_CAT_GIF_PROB - moduleParams.MSG_EMOTICON_PROB;

  // --- Miscellaneous parameters --- //

  params.TRANSPARENT_GIF_URL = params.BASE_DIR + '/images/empty.gif';
  params.ADD_CSS_TRANSITION_DELAY = 80;
  params.SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  params.ENTER_KEY_CODE = 13;
  params.TWO_PI = Math.PI * 2;
  params.HALF_PI = Math.PI * 0.5;
  params.SMALL_SCREEN_WIDTH_THRESHOLD = 900;
  params.SMALL_SCREEN_HEIGHT_THRESHOLD = 675;

  params.HEARTBEAT_REQUEST_INTERVAL = 4000;
  params.HEARTBEAT_TIMEOUT_DELAY = params.HEARTBEAT_REQUEST_INTERVAL * 2 + 200;

  params.OUT_COMMANDS = {
    help: {
      regex: /^\/help$/,
      replacementRegex: /\/help/g,
      htmlElement: '<code class=\'command\'>/help</code>'
    },
    rooms: {
      regex: /^\/rooms$/,
      replacementRegex: /\/rooms/g,
      htmlElement: '<code class=\'command\'>/rooms</code>'
    },
    join: {
      regex: /^\/join (\S+)$/,
      replacementRegex: /\/join/g,
      htmlElement: '<code class=\'command\'>/join</code>'
    },
    msg: {
      regex: /^\/msg (\S+) \((.*)\)$/,
      replacementRegex: /\/msg/g,
      htmlElement: '<code class=\'command\'>/msg</code>'
    },
    nick: {
      regex: /^\/nick (\S+)$/,
      replacementRegex: /\/nick/g,
      htmlElement: '<code class=\'command\'>/nick</code>'
    },
    ping: {
      regex: /^\/ping (\S+)$/,
      replacementRegex: /\/ping/g,
      htmlElement: '<code class=\'command\'>/ping</code>'
    },
    ignore: {
      regex: /^\/ignore (\S+)$/,
      replacementRegex: /\/ignore/g,
      htmlElement: '<code class=\'command\'>/ignore</code>'
    },
    leave: {
      regex: /^\/leave$/,
      replacementRegex: /\/leave/g,
      htmlElement: '<code class=\'command\'>/leave</code>'
    },
    quit: {
      regex: /^\/quit$/,
      replacementRegex: /\/quit/g,
      htmlElement: '<code class=\'command\'>/quit</code>'
    }
  };

  params.IN_COMMANDS = {
    msg: {
      regex: /^\/msg (\S+) (\S+) \((.*)\)$/
    },
    pubmsg: {
      regex: /^\/pubmsg (\S+) (\S+) \((.*)\)$/
    },
    userleftroom: {
      regex: /^\/userleftroom (\S+) (\S+)$/
    },
    userjoinedroom: {
      regex: /^\/userjoinedroom (\S+) (\S+)$/
    },
    userleftserver: {
      regex: /^\/userleftserver (\S+)$/
    },
    userjoinedserver: {
      regex: /^\/userjoinedserver (\S+)$/
    },
    userchangedname: {
      regex: /^\/userchangedname (\S+) (\S+)$/
    },
    roomcreated: {
      regex: /^\/roomcreated (\S+)$/
    },
    roomdestroyed: {
      regex: /^\/roomdestroyed (\S+)$/
    },
    pong: {
      regex: /^\/pong (\S+) (\S+) (\S+)$/
    },
    heartbeatrequest: {
      regex: /^\/heartbeatrequest (\S+)$/
    },
    heartbeat: {
      regex: /^\/heartbeat (\S+) \((.*)\) \((.*)\) (\/?\S+) \((.*)\)$/
    },
    error: {
      regex: /^\/error (\/?\S+) \((.*)\)$/
    }
  };

  params.LINK_REPLACEMENT = {
    linkRegex: /(?:\/link (\S+) \(([^()]+)\)|(\bhttps?:\/\/\S+\b))/g,
    replacementRegex: /%%/g,
    replacementString: '%%',
    toEscapeRegex: /%/g,
    toEscapeString: '%',
    escapeWithRegex: /\\%/g,
    escapeWithString: '\\%'
  };

  params.NAME_VALIDATION = {
    regex: /^[a-z0-9_]+$/i,
    validChars: 'a-z A-Z 0-9 _'
  };

  params.EMOTICONS = [
    {
      rawString: ':)',
      replacementRegexes: [ /\:\)/g, /\:\-\)/g ],
      html: '<img src=\'' + params.TRANSPARENT_GIF_URL +
          '\' class=\'emoticon happy\' alt=\'Happy emoticon\' />'
    },
    {
      rawString: ':D',
      replacementRegexes: [ /\:D/g, /\:\-D/g ],
      html: '<img src=\'' + params.TRANSPARENT_GIF_URL +
          '\' class=\'emoticon superHappy\' alt=\'Super happy emoticon\' />'
    },
    {
      rawString: ';)',
      replacementRegexes: [ /;\)/g, /;\-\)/g ],
      html: '<img src=\'' + params.TRANSPARENT_GIF_URL +
          '\' class=\'emoticon wink\' alt=\'Wink emoticon\' />'
    },
    {
      rawString: ':\'(',
      replacementRegexes: [ /\:\'\(/g, /\:\'-\(/g, /\:&#x27;\(/g, /\:&#x27;-\(/g ],
      html: '<img src=\'' + params.TRANSPARENT_GIF_URL +
          '\' class=\'emoticon cry\' alt=\'Cry emoticon\' />'
    },
    {
      rawString: ':o',
      replacementRegexes: [ /\:o/g, /\:\-o/g, /\:O/g, /\:\-O/g ],
      html: '<img src=\'' + params.TRANSPARENT_GIF_URL +
          '\' class=\'emoticon surprise\' alt=\'Surprise emoticon\' />'
    },
    {
      rawString: ':/',
      replacementRegexes: [ /\:\//g, /\:\-\//g ],
      html: '<img src=\'' + params.TRANSPARENT_GIF_URL +
          '\' class=\'emoticon uncertain\' alt=\'Uncertain emoticon\' />'
    },
    {
      rawString: 'X(',
      replacementRegexes: [ /x\(/g, /x\-\(/g, /X\(/g, /X\-\(/g ],
      html: '<img src=\'' + params.TRANSPARENT_GIF_URL +
          '\' class=\'emoticon angry\' alt=\'Angry emoticon\' />'
    },
    {
      rawString: ':(',
      replacementRegexes: [ /\:\(/g, /\:\-\(/g ],
      html: '<img src=\'' + params.TRANSPARENT_GIF_URL +
          '\' class=\'emoticon sad\' alt=\'Sad emoticon\' />'
    },
    {
      rawString: 'B)',
      replacementRegexes: [ /B\)/g, /B-\)/g ],
      html: '<img src=\'' + params.TRANSPARENT_GIF_URL +
          '\' class=\'emoticon sunglasses\' alt=\'Sunglasses emoticon\' />'
    },
    {
      rawString: ':P',
      replacementRegexes: [ /\:P/g, /\:\-P/g, /\:p/g, /\:\-p/g ],
      html: '<img src=\'' + params.TRANSPARENT_GIF_URL +
          '\' class=\'emoticon tongue\' alt=\'Tongue emoticon\' />'
    },
    {
      rawString: '<3',
      replacementRegexes: [ /<3/g, /&#x3C;3/g ],
      html: '<img src=\'' + params.TRANSPARENT_GIF_URL +
          '\' class=\'emoticon heart\' alt=\'Heart emoticon\' />'
    },
    {
      rawString: ':|',
      replacementRegexes: [ /\:\|/g, /\:\-\|/g ],
      html: '<img src=\'' + params.TRANSPARENT_GIF_URL +
          '\' class=\'emoticon blank\' alt=\'Blank emoticon\' />'
    }
  ];

  // Cat facts taken from http://facts.randomhistory.com/interesting-facts-about-cats.html
  params.CAT_FACTS = [
    'Cat fact #1: Every year, nearly four million cats are eaten in Asia.',
    'Cat fact #2: On average, cats spend 2/3 of every day sleeping. That means a nine-year-old cat has been awake for only three years of its life.',
    'Cat fact #3: Unlike dogs, cats do not have a sweet tooth. Scientists believe this is due to a mutation in a key taste receptor.',
    'Cat fact #4: When a cat chases its prey, it keeps its head level. Dogs and humans bob their heads up and down.',
    'Cat fact #5: The technical term for a cat\'s hairball is a "bezoar."',
    'Cat fact #6: A group of cats is called a "clowder."',
    'Cat fact #7: Female cats tend to be right pawed, while male cats are more often left pawed. Interestingly, while 90% of humans are right handed, the remaining 10% of lefties also tend to be male.',
    'Cat fact #8: A cat can\'t climb head first down a tree because every claw on a cat\'s paw points the same way. To get down from a tree, a cat must back down.',
    'Cat fact #9: Cats make about 100 different sounds. Dogs make only about 10.',
    'Cat fact #10: A cat\'s brain is biologically more similar to a human brain than it is to a dog\'s. Both humans and cats have identical regions in their brains that are responsible for emotions.',
    'Cat fact #11: There are more than 500 million domestic cats in the world, with approximately 40 recognized breeds.',
    'Cat fact #12: Approximately 24 cat skins can make a coat.',
    'Cat fact #13: While it is commonly thought that the ancient Egyptians were the first to domesticate cats, the oldest known pet cat was recently found in a 9,500-year-old grave on the Mediterranean island of Cyprus. This grave predates early Egyptian art depicting cats by 4,000 years or more.',
    'Cat fact #14: During the time of the Spanish Inquisition, Pope Innocent VIII condemned cats as evil and thousands of cats were burned. Unfortunately, the widespread killing of cats led to an explosion of the rat population, which exacerbated the effects of the Black Death.',
    'Cat fact #15: During the Middle Ages, cats were associated with withcraft, and on St. John\'s Day, people all over Europe would stuff them into sacks and toss the cats into bonfires. On holy days, people celebrated by tossing cats from church towers.',
    'Cat fact #16: Cats are North America\'s most popular pets: there are 73 million cats compared to 63 million dogs. Over 30% of households in North America own a cat.',
    'Cat fact #17: The first cat in space was a French cat named Felicette (a.k.a. Astrocat). In 1963, France blasted the cat into outer space. Electrodes implanted in her brain sent neurological signals back to Earth. She survived the trip.',
    'Cat fact #18: The group of words associated with cat (catt, cath, chat, katze) stem from the Latin catus, meaning domestic cat, as opposed to feles, or wild cat.',
    'Cat fact #19: The term "puss" is the root of the principal word for "cat" in the Romanian term pisica and the root of secondary words in Lithuanian (puz) and Low German puus. Some scholars suggest that "puss" could be imitative of the hissing sound used to get a cat\'s attention. As a slang word for the female pudenda, it could be associated with the connotation of a cat being soft, warm, and fuzzy.',
    'Cat fact #20: Approximately 40,000 people are bitten by cats in the U.S. annually.',
    'Cat fact #21: According to Hebrew legend, Noah prayed to God for help protecting all the food he stored on the ark from being eaten by rats. In reply, God made the lion sneeze, and out popped a cat.',
    'Cat fact #22: A cat\'s hearing is better than a dog\'s. And a cat can hear high-frequency sounds up to two octaves higher than a human.',
    'Cat fact #23: A cat can travel at a top speed of approximately 31 mph (49 km) over a short distance.',
    'Cat fact #24: A cat can jump up to five times its own height in a single bound.',
    'Cat fact #25: Some cats have survived falls of over 65 feet (20 meters), due largely to their "righting reflex." The eyes and balance organs in the inner ear tell it where it is in space so the cat can land on its feet. Even cats without a tail have this ability.',
    'Cat fact #26: A cat rubs against people not only to be affectionate but also to mark out its territory with scent glands around its face. The tail area and paws also carry the cat\'s scent.',
    'Cat fact #27: Researchers are unsure exactly how a cat purrs. Most veterinarians believe that a cat purrs by vibrating vocal folds deep in the throat. To do this, a muscle in the larynx opens and closes the air passage about 25 times per second.',
    'Cat fact #28: When a family cat died in ancient Egypt, family members would mourn by shaving off their eyebrows. They also held elaborate funerals during which they drank wine and beat their breasts. The cat was embalmed with a sculpted wooden mask and the tiny mummy was placed in the family tomb or in a pet cemetery with tiny mummies of mice.',
    'Cat fact #29: In 1888, more than 300,000 mummified cats were found an Egyptian cemetery. They were stripped of their wrappings and carted off to be used by farmers in England and the U.S. for fertilizer.',
    'Cat fact #30: Most cats give birth to a litter of between one and nine kittens. The largest known litter ever produced was 19 kittens, of which 15 survived.',
    'Cat fact #31: Smuggling a cat out of ancient Egypt was punishable by death. Phoenician traders eventually succeeded in smuggling felines, which they sold to rich people in Athens and other important cities.',
    'Cat fact #32: The earliest ancestor of the modern cat lived about 30 million years ago. Scientists called it the Proailurus, which means "first cat" in Greek. The group of animals that pet cats belong to emerged around 12 million years ago.',
    'Cat fact #33: The biggest wildcat today is the Siberian Tiger. It can be more than 12 feet (3.6 m) long (about the size of a small car) and weigh up to 700 pounds (317 kg).',
    'Cat fact #34: The smallest wildcat today is the Black-footed cat. The females are less than 20 inches (50 cm) long and can weigh as little as 2.5 lbs (1.2 kg).',
    'Cat fact #35: Many Egyptians worshipped the goddess Bast, who had a woman\'s body and a cat\'s head.',
    'Cat fact #36: Mohammed loved cats and reportedly his favorite cat, Muezza, was a tabby. Legend says that tabby cats have an "M" for Mohammed on top of their heads because Mohammad would often rest his hand on the cat\'s head.',
    'Cat fact #37: While many parts of Europe and North America consider the black cat a sign of bad luck, in Britain and Australia, black cats are considered lucky.',
    'Cat fact #38: The most popular pedigreed cat is the Persian cat, followed by the Main Coon cat and the Siamese cat.',
    'Cat fact #39: The smallest pedigreed cat is a Singapura, which can weigh just 4 lbs (1.8 kg), or about five large cans of cat food. The largest pedigreed cats are Maine Coon cats, which can weigh 25 lbs (11.3 kg), or nearly twice as much as an average cat weighs.',
    'Cat fact #40: Some Siamese cats appear cross-eyed because the nerves from the left side of the brain go to mostly the right eye and the nerves from the right side of the brain go mostly to the left eye. This causes some double vision, which the cat tries to correct by "crossing" its eyes.',
    'Cat fact #41: Researchers believe the word "tabby" comes from Attabiyah, a neighborhood in Baghdad, Iraq. Tabbies got their name because their striped coats resembled the famous wavy patterns in the silk produced in this city.',
    'Cat fact #42: Cats hate the water because their fur does not insulate well when it\'s wet. The Turkish Van, however, is one cat that likes swimming. Bred in central Asia, its coat has a unique texture that makes it water resistant.',
    'Cat fact #43: The Egyptian Mau is probably the oldest breed of cat. In fact, the breed is so ancient that its name is the Egyptian word for "cat."',
    'Cat fact #44: The costliest cat ever is named Little Nicky, who cost his owner $50,000. He is a clone of an older cat.',
    'Cat fact #45: A cat usually has about 12 whiskers on each side of its face.',
    'Cat fact #46: A cat\'s eyesight is both better and worse than humans. It is better because cats can see in much dimmer light and they have a wider peripheral view. It\'s worse because they don\'t see color as well as humans do. Scientists believe grass appears red to cats.',
    'Cat fact #47: Spanish-Jewish folklore recounts that Adam\'s first wife, Lilith, became a black vampire cat, sucking the blood from sleeping babies. This may be the root of the superstition that a cat will smother a sleeping baby or suck out the child\'s breath.',
    'Cat fact #48: Perhaps the most famous comic cat is the Cheshire Cat in Lewis Carroll\'s Alice in Wonderland. With the ability to disappear, this mysterious character embodies the magic and sorcery historically associated with cats.',
    'Cat fact #49: In the original Italian version of Cinderella, the benevolent fairy godmother figure was a cat.',
    'Cat fact #50: In Holland\'s embassy in Moscow, Russia, the staff noticed that the two Siamese cats kept meowing and clawing at the walls of the building. Their owners finally investigated, thinking they would find mice. Instead, they discovered microphones hidden by Russian spies. The cats heard the microphones when they turned on.',
    'Cat fact #51: The little tufts of hair in a cat\'s ear that help keep out dirt direct sounds into the ear, and insulate the ears are called "ear furnishings."',
    'Cat fact #52: The ability of a cat to find its way home is called "psi-traveling." Experts think cats either use the angle of the sunlight to find their way or that cats have magnetized cells in their brains that act as compasses.',
    'Cat fact #53: Isaac Newton invented the cat flap. Newton was experimenting in a pitch-black room. Spithead, one of his cats, kept opening the door and wrecking his experiment. The cat flap kept both Newton and Spithead happy.',
    'Cat fact #54: The world\'s rarest coffee, Kopi Luwak, comes from Indonesia where a wildcat known as the luwak lives. The cat eats coffee berries and the coffee beans inside pass through the stomach. The beans are harvested from the cat\'s dung heaps and then cleaned and roasted. Kopi Luwak sells for about $500 for a 450 g (1 lb) bag.',
    'Cat fact #55: A cat\'s jaw can\'t move sideways, so a cat can\'t chew large chunks of food.',
    'Cat fact #56: A cat almost never meows at another cat, mostly just humans. Cats typically will spit, purr, and hiss at other cats.',
    'Cat fact #57: A cat\'s back is extremely flexible because it has up to 53 loosely fitting vertebrae. Humans only have 34.',
    'Cat fact #58: Approximately 1/3 of cat owners think their pets are able to read their minds.',
    'Cat fact #59: All cats have claws, and all except the cheetah sheath them when at rest.',
    'Cat fact #60: Two members of the cat family are distinct from all others: the clouded leopard and the cheetah. The clouded leopard does not roar like other big cats, nor does it groom or rest like small cats. The cheetah is unique because it is a running cat; all others are leaping cats. They are leaping cats because they slowly stalk their prey and then leap on it.',
    'Cat fact #61: A cat lover is called an Ailurophilia (Greek: cat+lover).',
    'Cat fact #62: In Japan, cats are thought to have the power to turn into super spirits when they die. This may be because according to the Buddhist religion, the body of the cat is the temporary resting place of very spiritual people.',
    'Cat fact #63: Most cats had short hair until about 100 years ago, when it became fashionable to own cats and experiment with breeding.',
    'Cat fact #64: Cats have 32 muscles that control the outer ear (humans have only 6). A cat can independently rotate its ears 180 degrees.',
    'Cat fact #65: One reason that kittens sleep so much is because a growth hormone is released only during sleep.',
    'Cat fact #66: Cats have about 130,000 hairs per square inch (20,155 hairs per square centimeter).',
    'Cat fact #67: The heaviest cat on record is Himmy, a Tabby from Queensland, Australia. He weighed nearly 47 pounds (21 kg). He died at the age of 10.',
    'Cat fact #68: The oldest cat on record was Crème Puff from Austin, Texas, who lived from 1967 to August 6, 2005, three days after her 38th birthday. A cat typically can live up to 20 years, which is equivalent to about 96 human years.',
    'Cat fact #69: The lightest cat on record is a blue point Himalayan called Tinker Toy, who weighed 1 pound, 6 ounces (616 g). Tinker Toy was 2.75 inches (7 cm) tall and 7.5 inches (19 cm) long.',
    'Cat fact #70: The tiniest cat on record is Mr. Pebbles, a 2-year-old cat that weighed 3 lbs (1.3 k) and was 6.1 inches (15.5 cm) high.',
    'Cat fact #71: A commemorative tower was built in Scotland for a cat named Towser, who caught nearly 30,000 mice in her lifetime.',
    'Cat fact #72: In the 1750s, Europeans introduced cats into the Americas to control pests.',
    'Cat fact #73: The first cat show was organized in 1871 in London. Cat shows later became a worldwide craze.',
    'Cat fact #74: The first cartoon cat was Felix the Cat in 1919. In 1940, Tom and Jerry starred in the first theatrical cartoon "Puss Gets the Boot." In 1981 Andrew Lloyd Weber created the musical Cats, based on T.S. Eliot\'s Old Possum\'s Book of Practical Cats.',
    'Cat fact #75: The normal body temperature of a cat is between 100.5°F and 102.5°F. A cat is sick if its temperature goes below 100°F or above 103°F.',
    'Cat fact #76: A cat has 230 bones in its body. A human has 206. A cat has no collarbone, so it can fit through any opening the size of its head.',
    'Cat fact #77: A cat\'s nose pad is ridged with a unique pattern, just like the fingerprint of a human.',
    'Cat fact #78: If they have ample water, cats can tolerate temperatures up to 133°F.',
    'Cat fact #79: Foods that should not be given to cats include onions, garlic, green tomatoes, raw potatoes, chocolate, grapes, and raisins. Though milk is not toxic, it can cause an upset stomach and gas. Tylenol and aspirin are extremely toxic to cats, as are many common houseplants. Feeding cats dog food or canned tuna that\'s for human consumption can cause malnutrition.',
    'Cat fact #80: A 2007 Gallup poll revealed that both men and women were equally likely to own a cat.',
    'Cat fact #81: A cat\'s heart beats nearly twice as fast as a human heart, at 110 to 140 beats a minute.',
    'Cat fact #82: Cats don\'t have sweat glands over their bodies like humans do. Instead, they sweat only through their paws.',
    'Cat fact #83: In just seven years, a single pair of cats and their offspring could produce a staggering total of 420,000 kittens.',
    'Cat fact #84: Relative to its body size, the clouded leopard has the biggest canines of all animals\' canines. Its dagger-like teeth can be as long as 1.8 inches (4.5 cm).',
    'Cat fact #85: Cats spend nearly 1/3 of their waking hours cleaning themselves.',
    'Cat fact #86: Grown cats have 30 teeth. Kittens have about 26 temporary teeth, which they lose when they are about 6 months old.',
    'Cat fact #87: A cat called Dusty has the known record for the most kittens. She had more than 420 kittens in her lifetime.',
    'Cat fact #88: The largest cat breed is the Ragdoll. Male Ragdolls weigh between 12 and 20 lbs (5.4-9.0 k). Females weigh between 10 and 15 lbs (4.5-6.8 k).',
    'Cat fact #89: Cats are extremely sensitive to vibrations. Cats are said to detect earthquake tremors 10 or 15 minutes before humans can.',
    'Cat fact #90: In contrast to dogs, cats have not undergone major changes during their domestication process.',
    'Cat fact #91: A female cat is called a queen or a molly.',
    'Cat fact #92: In the 1930s, two Russian biologists discovered that color change in Siamese kittens depend on their body temperature. Siamese cats carry albino genes that work only when the body temperature is above 98°F. If these kittens are left in a very warm room, their points won\'t darken and they will stay a creamy white.',
    'Cat fact #93: There are up to 60 million feral cats in the United States alone.',
    'Cat fact #94: The oldest cat to give birth was Kitty who, at the age of 30, gave birth to two kittens. During her life, she gave birth to 218 kittens.',
    'Cat fact #95: The most traveled cat is Hamlet, who escaped from his carrier while on a flight. He hid for seven weeks behind a pane. By the time he was discovered, he had traveled nearly 373,000 miles (600,000 km).',
    'Cat fact #96: The most expensive cat was an Asian Leopard cat (ALC)-Domestic Shorthair (DSH) hybrid named Zeus. Zeus, who is 90% ALC and 10% DSH, has an asking price of £100,000 ($154,000).',
    'Cat fact #97: The cat who holds the record for the longest non-fatal fall is Andy. He fell from the 16th floor of an apartment building (about 200 ft/.06 km) and survived.',
    'Cat fact #98: The richest cat is Blackie who was left £15 million by his owner, Ben Rea.',
    'Cat fact #99: The claws on the cat\'s back paws aren\'t as sharp as the claws on the front paws because the claws in the back don\'t retract and, consequently, become worn.'
  ];

  params.CAT_GIFS = [
    {
      url: 'http://s3-ec.buzzfed.com/static/2013-10/enhanced/webdr02/15/9/anigif_enhanced-buzz-19667-1381844937-10.gif',
      description: 'Genetics gone wrong'
    },
    {
      url: 'http://s3-ec.buzzfed.com/static/2013-10/enhanced/webdr06/15/10/anigif_enhanced-buzz-1376-1381846217-0.gif',
      description: 'Phantom mouse'
    },
    {
      url: 'http://s3-ec.buzzfed.com/static/2013-10/enhanced/webdr05/15/9/anigif_enhanced-buzz-26358-1381845043-13.gif',
      description: '"Off" button'
    },
    {
      url: 'http://s3-ec.buzzfed.com/static/2013-10/enhanced/webdr05/15/9/anigif_enhanced-buzz-26383-1381845104-25.gif',
      description: 'Best laid plans of mice and...'
    },
    {
      url: 'http://s3-ec.buzzfed.com/static/2013-10/enhanced/webdr05/15/9/anigif_enhanced-buzz-19070-1381845280-0.gif',
      description: 'Emotional support'
    },
    {
      url: 'http://s3-ec.buzzfed.com/static/2013-10/enhanced/webdr01/15/9/anigif_enhanced-buzz-27162-1381845360-0.gif',
      description: 'Who says video games are too violent?'
    },
    {
      url: 'http://s3-ec.buzzfed.com/static/2013-10/enhanced/webdr06/15/9/anigif_enhanced-buzz-23859-1381845509-0.gif',
      description: 'Jenga ninja'
    },
    {
      url: 'http://s3-ec.buzzfed.com/static/2013-10/enhanced/webdr02/15/10/anigif_enhanced-buzz-19659-1381845602-0.gif',
      description: 'Time to bounce'
    },
    {
      url: 'http://s3-ec.buzzfed.com/static/2013-10/enhanced/webdr06/15/10/anigif_enhanced-buzz-25498-1381845743-9.gif',
      description: 'Boop'
    },
    {
      url: 'http://s3-ec.buzzfed.com/static/2013-10/enhanced/webdr01/15/10/anigif_enhanced-buzz-27831-1381845794-0.gif',
      description: 'Lesson learned'
    },
    {
      url: 'http://s3-ec.buzzfed.com/static/2013-10/enhanced/webdr01/15/10/anigif_enhanced-buzz-27162-1381845926-2.gif',
      description: 'You\'re done eating, right?'
    },
    {
      url: 'http://25.media.tumblr.com/0e2318bb03b9f3b0b7cae374168d7b97/tumblr_n1fk1bbQVp1qzefipo1_400.gif',
      description: 'Surprise banana!!'
    },
    {
      url: 'http://iheartcatgifs.tumblr.com/post/75817469922',
      description: 'Anticipation'
    },
    {
      url: 'http://25.media.tumblr.com/0798843644c862737ce1258821b5938a/tumblr_mnba38vUWI1qzcv7no1_400.gif',
      description: 'Hey, I\'m drinking here!!'
    },
    {
      url: 'http://24.media.tumblr.com/dbe0061f677bc80faaf7161adb92e2a3/tumblr_mxe6686riK1spy7ono1_500.gif',
      description: 'Tuckered out'
    },
    {
      url: 'http://i.imgur.com/j8fGYzv.gif',
      description: 'A real head-to-head'
    },
    {
      url: 'http://i.imgur.com/AuO1OPu.gif',
      description: 'Surprise potato!!'
    },
    {
      url: 'http://25.media.tumblr.com/6986166623219890aecb766874bcdd14/tumblr_mm8yjcsbK71s8dwazo1_500.gif',
      description: 'That duck does\'t stand a chance'
    },
    {
      url: 'http://25.media.tumblr.com/420098f49a536183c3def29624ed3324/tumblr_mm1gqktIdt1s8dwazo1_400.gif',
      description: 'I\'m awake! I\'m awake!!!'
    },
    {
      url: 'http://24.media.tumblr.com/abbd800a87c984c74b0350dd0a2ab196/tumblr_mls3nrsE6G1s8dwazo1_500.gif',
      description: 'Cat in a box!'
    },
    {
      url: 'http://31.media.tumblr.com/11d0c46350da900fd6b48eb7dba6edec/tumblr_mlks7zsj1W1s8dwazo1_400.gif',
      description: 'Roll out!'
    },
    {
      url: 'http://25.media.tumblr.com/5440fd4c60ff1c009b6f907dfcb3f463/tumblr_mkc1mlBxlD1s3oe2qo1_500.gif',
      description: 'Cat or metronome?'
    }
  ];

  // Cat names taken from http://www.youpet.com/cat-names/
  params.CAT_NAMES = [
    'Kitty',
    'Tiger',
    'Smokey',
    'Shadow',
    'Tigger',
    'Baby',
    'Princess',
    'Max',
    'Oreo',
    'Angel',
    'Bella',
    'Buddy',
    'Gizmo',
    'Midnight',
    'Sassy',
    'Simba',
    'Patches',
    'Precious',
    'Lucky',
    'Lucy',
    'Chloe',
    'Boots',
    'Charlie',
    'Callie',
    'Jack',
    'Sammy',
    'Pepper',
    'Fluffy',
    'Molly',
    'Missy',
    'Kiki',
    'Daisy',
    'Sophie',
    'Garfield',
    'Lily',
    'Cleo',
    'Gracie',
    'Cali',
    'Oliver',
    'Pumpkin',
    'Milo',
    'Toby',
    'Jasper',
    'Sam',
    'Misty',
    'Felix',
    'Sasha',
    'Oscar',
    'Rocky',
    'Bailey',
    'Jasmine',
    'Ginger',
    'Peanut',
    'Bandit',
    'Simon',
    'Mittens',
    'Coco',
    'Harley',
    'Lilly',
    'Boo',
    'Luna',
    'Cookie',
    'Abby',
    'Mimi',
    'Snowball',
    'Salem',
    'Snickers',
    'George',
    'Nala',
    'Sugar',
    'Leo',
    'Casper',
    'Miss_kitty',
    'Trouble',
    'Maggie',
    'Buster',
    'Rascal',
    'Scooter',
    'Samantha',
    'Cuddles',
    'Tinkerbell',
    'Zoey',
    'Sadie',
    'Lola',
    'Willow',
    'Spooky',
    'Bear',
    'Dusty',
    'Bob',
    'Zoe',
    'Chester',
    'Muffin',
    'Mia',
    'Whiskers',
    'Socks',
    'Snuggles',
    'Loki',
    'Sheba',
    'Jinx',
    'Bubba',
    'Frisky'
  ];

  // --- Expose this module --- //

  if (!window.app) window.app = {};
  window.app.params = params;

  console.log('params module loaded');
})();
