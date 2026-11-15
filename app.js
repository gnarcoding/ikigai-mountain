/* The Ikigai Mountain · gnarcoding.com */
(function () {
  "use strict";
  /* ------------------------------------------------------------------ */
  /* The journey: every stop on the trail                                */
  /* ------------------------------------------------------------------ */

  var TRAILHEADS = {
    love: {
      title: "Base Camp: Something You Can't Stop Doing",
      feels: "You start with something you can't stop doing. A kid who draws on every surface, a teenager rebuilding an engine in the driveway, someone writing songs no one will hear. Nobody pays for it, nobody needs it, and you aren't good yet. None of that matters at the trailhead. It's yours, and that's enough to start walking.",
      voice: "This is just something I like. It's not a plan.",
      signs: ["You lose whole afternoons to it without noticing.", "You'd do it even if nobody ever saw the result.", "People around you call it a phase."],
      through: "Don't wait for the other three circles before you start. Follow the love and pay attention to where it pulls you. The trail will carry you to the other faces soon enough, and they're harder to climb without something you care about in your pack.",
      question: "What did you love doing before anyone told you what you should do?"
    },
    good: {
      title: "Base Camp: Something That Came Easily",
      feels: "You start with something that came easily. Numbers, people, fixing things, explaining things. A teacher noticed, or a boss did. Being good early is a real head start. It can also choose your path for you before you've had a chance to choose it yourself.",
      voice: "I'm good at it, so I guess this is my thing.",
      signs: ["People come to you for one specific kind of help.", "You've never asked yourself whether you enjoy it.", "Praise for it feels nice but a little hollow."],
      through: "Use the head start, and stay curious about whether you actually like it. Talent opens doors. It doesn't tell you which ones to walk through. Keep a note of the moments you feel alive while using it, and the moments you feel nothing.",
      question: "What are you good at that you've never asked yourself whether you enjoy?"
    },
    needs: {
      title: "Base Camp: Something You Can't Unsee",
      feels: "You start with something that bothers you about the world. You saw it up close: a sick parent, a broken school, a neighborhood that got left behind, an animal no one was looking after. You have no skill for fixing it and no way to be paid for it. You have the conviction that it matters, and that conviction is heavy to carry.",
      voice: "Someone should do something about this.",
      signs: ["One problem keeps coming back into your conversations.", "You get angry when other people shrug it off.", "You read about it late at night."],
      through: "That someone could be you, eventually. For now, stay close to the problem and learn everything you can about it. Talk to the people who live with it. The care you feel is the compass for the whole climb, so don't let it go numb.",
      question: "What problem do you notice that other people seem to walk past?"
    },
    paid: {
      title: "Base Camp: The Job You Needed",
      feels: "You start where most people start: with a job, because you needed money. Rent, family, debt, survival. This is the most crowded trailhead on the mountain and there is no shame in it. Money first is how most real lives begin, and anyone who tells you otherwise probably had a safety net.",
      voice: "I don't have the luxury of following my passion.",
      signs: ["Your first question about any job is what it pays.", "You've never had a stretch of time without needing income.", "Talk of “finding your purpose” makes you roll your eyes."],
      through: "Fair enough. Let the paycheck carry you for now and keep one eye open for the other faces. Every job teaches you something you're good at, something you hate and something the world needs. Write those down as you go. They're the map for later.",
      question: "What has your work so far taught you about what you're good at?"
    }
  };

  var FACE_STOPS = {
    love: [
      {
        title: "The Weekend Hobby",
        feels: "You found the thing that makes time disappear. You'd do it for free, and right now you are doing it for free, in the cracks: late at night, on Saturdays, in the notes app on your commute. It's the best part of your week and it lives at the edges of it. Every Monday it gets shoved back in the drawer, and a little part of you goes in with it.",
        voice: "This is just for fun. Real life is the other stuff.",
        signs: ["You talk about it with more energy than you talk about your job.", "You lose track of time doing it and feel guilty afterward.", "You've never shown anyone what you've made."],
        through: "Treat it as real before it's profitable. Give it a protected slot on your calendar, the same way you'd protect a meeting with your boss. Finish one small thing and show it to one person. A hobby starts to become a path the moment someone else sees it.",
        question: "If no one ever paid you for this, would you still want it in your life every week?"
      },
      {
        title: "The Joy Tax",
        feels: "You took the leap. You're good at it now, and it even helps people. But the money isn't there yet, and the moment you start trying to make it pay, something changes. The thing you used to run toward becomes a thing you have to do. Deadlines, clients, invoices, numbers. You start to resent the work you once couldn't wait to get back to, and that resentment scares you more than being broke.",
        voice: "If I really loved it, this wouldn't feel like work.",
        signs: ["You haven't done it just for yourself in months.", "You check the numbers before you check how you feel about the work.", "You've started to dread the thing you used to daydream about."],
        through: "Keep one corner of it unmonetized: something you make that will never be sold, posted or graded. Separate the craft from the business on purpose, with different hours and different spaces if you can manage it. The pressure doesn't mean you chose wrong. It means love now has a job, and it needs a day off like anyone else.",
        question: "What part of this would you protect even if it cost you money?"
      },
      {
        title: "Burying the Dream Version",
        feels: "Somewhere along the way you built a picture of how this would look. The big stage, the bestseller, the studio with your name over the door. You're high on the mountain now, and the real version looks smaller and stranger than the picture. To keep climbing you have to grieve the fantasy, and grief is the right word. It hurts to let go of a life that never existed.",
        voice: "If it doesn't look like I imagined, I failed.",
        signs: ["You compare your real life to a version that only exists in your head.", "Small wins feel like proof that you settled.", "You avoid people who knew about the big dream."],
        through: "Write down the dream version, all of it. Then circle the parts that were about the work itself and cross out the parts that were about being seen. Usually the work is still here, waiting for you. Let the applause go and keep the craft. The real version has something the dream never had: it exists.",
        question: "What did you actually want from the dream: the work, or the way people would look at you?"
      }
    ],
    good: [
      {
        title: "The Clumsy Years",
        feels: "Getting good takes longer than anyone tells you. For a long stretch your taste is ahead of your ability. You can see that your work isn't good yet, and you can't fix it yet. Nobody is watching, nobody is clapping, and progress is too slow to feel. This is where most people quit, and most of them quit right before it starts to click.",
        voice: "If I were meant for this, it would come easier.",
        signs: ["You know exactly what's wrong with your work and can't make it right yet.", "You compare your first year to someone else's tenth.", "You've quit and restarted the same skill more than once."],
        through: "Count reps, not results. Set a volume goal you control (fifty sketches, a hundred sales calls, ten full drafts) and let quality grow out of quantity. Keep your early work so you can look back at it later. The gap between taste and skill only closes by doing a lot of the work badly first.",
        question: "What would you practice if you knew no one would judge the first hundred tries?"
      },
      {
        title: "The Competence Trap",
        feels: "You got good, and now that's the problem. Everyone knows you as the person who does this one thing well, so that's all they ever ask you for. It pays. It's comfortable. You even enjoy it some days. But you can feel your own reputation boxing you in, and every year it gets harder to be seen as anything else. You start to wonder whether this skill is serving anyone, or just keeping you busy.",
        voice: "I can't throw away everything I've built.",
        signs: ["People introduce you by your skill, not your name.", "You say yes to the same kind of work because it's easy money.", "You're the go-to person for something you stopped caring about."],
        through: "Your skill is portable even if your title isn't. Look for one place where your old strength can serve a new direction, and take a single project there. Say no to one request you could do in your sleep. Every no buys a little time for the thing you'd rather be known for.",
        question: "If you had to be known for something different five years from now, what would you want it to be?"
      },
      {
        title: "The Plateau",
        feels: "Mastery has a quiet cost. Once you're very good, the work stops changing you. The rush of learning is gone, the challenges repeat, and you start to wonder whether any of it matters beyond your own satisfaction. You love it, you're paid for it, you're excellent at it, and still there's a hollow ring when you ask who it's really for.",
        voice: "I've already figured this out. There's nothing left here for me.",
        signs: ["You haven't been bad at anything in a long time.", "Praise for your work doesn't land anymore.", "You catch yourself asking whether this even helps anyone."],
        through: "Point the skill at somebody. Teach it, give it away, or aim it at a problem bigger than your craft. Mastery that serves no one goes stale. Mastery that serves someone keeps growing, because other people's problems are never the same twice. Pick one person or one cause and make your excellence theirs for a season.",
        question: "Who would be better off if you taught them everything you know?"
      }
    ],
    needs: [
      {
        title: "Too Big to Touch",
        feels: "You saw something wrong in the world and you can't unsee it. Hunger, loneliness, a broken system, a dying river. It matters more than almost anything else you could be doing, and it's so much bigger than you that every action feels like a drop in the ocean. You care deeply and feel completely useless at the same time, and that combination wears you down.",
        voice: "Unless I can fix all of it, nothing I do counts.",
        signs: ["You read about the problem every night and do nothing about it the next day.", "You feel guilty spending time or money on yourself.", "You talk about the problem more than you work on it."],
        through: "Shrink the problem until your hands fit around it. Not “homelessness” but one shelter, one Tuesday night, one person. Find the smallest version you can actually touch and touch it every week. Scale is a later problem. Contact is the first one.",
        question: "What is the smallest piece of this you could help with this month?"
      },
      {
        title: "Out of Your Depth",
        feels: "Now you're in it. You love the work, it matters, and people are even paying you for it. But you're not sure you're good enough. Real people depend on you, and you feel like you're making it up as you go. Every mistake feels heavier because it lands on someone who needed you to get it right.",
        voice: "Any day now they'll realize I don't know what I'm doing.",
        signs: ["You over-prepare for everything and still feel unprepared.", "You hide what you don't know instead of asking.", "You feel more relief than pride when something goes well."],
        through: "Caring got you in the door. Skill keeps you in the room. Find the people who are better at this than you and learn from them out loud: get a mentor, take the course, ask the obvious question in the meeting. Being new isn't fraud. Pretending you're not new is where the damage happens.",
        question: "What one skill would make you twice as useful to the people you serve?"
      },
      {
        title: "Giving Until Empty",
        feels: "This is the cliff the kindest people fall off. You've given so much to the cause and the people in it that there's nothing left for you. Your sleep, your friendships, your body and your own joy all went into the work. You can't help everyone, and some part of you still hasn't accepted that. So you keep pouring from a cup that went dry months ago.",
        voice: "If I rest, someone gets hurt.",
        signs: ["You feel numb about things that used to break your heart.", "You can't remember the last time you did something just for you.", "Saying no feels like abandoning someone."],
        through: "You are part of the world that needs care, so put yourself on the list. Decide what you can sustain for ten years, not ten weeks, and give that. Let the help you give be smaller and steadier. Accept that you'll help some people and not all of them. A burned-out helper helps no one.",
        question: "What would you need in order to keep doing this work for the next ten years?"
      }
    ],
    paid: [
      {
        title: "Anything That Pays",
        feels: "The bills don't wait for you to find your purpose. So you take the job, then the extra shift, then the side gig. It's honest and it's necessary, and it eats the hours you'd need to figure out anything else. You're too tired at night to want more than rest, and the years start to blur together.",
        voice: "Someday, when things are stable, I'll figure out what I actually want.",
        signs: ["You can't remember the last time you chose your work.", "Your only goal for work is that it pays more.", "“Someday” has been on your calendar for years."],
        through: "Money first is a reasonable place to start. Just don't let it be the only direction. Build a small buffer, even one month of expenses, so fear stops making every decision for you. Then spend one hour a week on anything from the other three faces. The paycheck buys you time, so spend a little of it on yourself.",
        question: "If money were handled for six months, what would you try?"
      },
      {
        title: "The Golden Handcuffs",
        feels: "You're doing well. The salary is good, the work is useful, and you're competent at it. The raise came, then the title, then the bonus that vests in three years. Every reward makes leaving more expensive. You're not unhappy enough to go and not happy enough to stay, so you stay, and another year goes by.",
        voice: "I'd be crazy to walk away from this.",
        signs: ["You calculate what you'd lose before you think about what you'd gain.", "Your lifestyle has grown to match every raise.", "You count the days until the next vesting date."],
        through: "Find out what your freedom actually costs. Write down the number you need to live on, not the number you've gotten used to. Lower your fixed costs while you're still comfortable, because that's when it's easiest. The handcuffs are mostly lifestyle. Loosen them and the door gets closer.",
        question: "What is the real number you need to live on, and how far is it from what you spend now?"
      },
      {
        title: "The Comfortable Hollow",
        feels: "From the outside, you've made it. Useful work, good pay, real skill. Nobody would pity you, and that's what makes this stop so lonely. The emptiness has no obvious cause, so it's hard to explain and easy to dismiss. Sunday nights carry a low dread you can't quite name, and you feel ungrateful for wanting more than a good life.",
        voice: "What right do I have to complain?",
        signs: ["You're good at work you don't care about.", "Your best energy goes to things outside your job.", "You feel guilty for wanting more than you have."],
        through: "Gratitude and wanting more can live in the same person. Look at what lights you up outside of work and ask what small piece of it could come inside. Ask for the project that interests you, even if it's extra at first. Love doesn't have to replace the work all at once. It can start by leaking into it.",
        question: "What part of your week do you look forward to, and how could a little of it get into your work?"
      }
    ]
  };

  var RIDGE_STOPS = {
    passion: [
      {
        title: "The Beautiful Thing No One Asked For",
        feels: "You love it and you're good at it now. You made something real and you're proud of it. Then you put it out into the world and nothing happens. Nobody needed it, nobody was waiting for it, and the silence is louder than criticism would have been. There's a special loneliness in doing excellent work that nobody notices.",
        voice: "If it were good enough, people would find it.",
        signs: ["You make things for an audience that doesn't exist yet.", "You blame the algorithm, the market or the timing.", "You've never asked anyone what they actually need."],
        through: "Turn around and look at people instead of at your work. Ask ten people what they're struggling with in your area, and listen without pitching. Make the next thing for one of them. Craft becomes valuable when it meets a need, and needs are found by listening, not by polishing.",
        question: "Who would miss your work if it disappeared tomorrow?"
      },
      {
        title: "The Starving-Artist Story",
        feels: "There's a story you inherited somewhere: that real art suffers, that wanting money ruins it, that selling is selling out. It sounds noble and it keeps you broke. You undercharge, you hide your prices, you feel dirty sending an invoice. Quietly, you've started treating poverty as proof of your integrity.",
        voice: "If I do it for money, I'll ruin it.",
        signs: ["You feel embarrassed talking about prices.", "You give your work away and then resent it.", "You admire artists who suffered more than artists who thrived."],
        through: "Look for people who make the kind of work you love and also make a living. They exist in every field. Study exactly how they do it. Money isn't a verdict on your art. It's what lets you keep making it. Put a price on one thing this month and say it out loud without apologizing.",
        question: "Whose career would you happily have, and how do they actually pay their bills?"
      },
      {
        title: "Making It About Them",
        feels: "This turn is quiet and hard. To go higher, your passion has to stop being only about you. Your craft was self-expression, and now it has to become service. That can feel like losing something precious. Your taste runs into other people's needs, and some of the time you have to let their needs win.",
        voice: "If I change it for them, it isn't mine anymore.",
        signs: ["Feedback feels like an attack on who you are.", "You'd rather be misunderstood than adjust.", "You judge the work only by how it feels to make."],
        through: "Keep your voice and change your aim. The same skill, pointed at someone's real problem, still sounds like you. Start with one collaboration where the brief comes from someone else. You'll find the craft gets more interesting, not less, when it has to work for somebody.",
        question: "How could the thing you love making solve a problem for someone you care about?"
      }
    ],
    profession: [
      {
        title: "Good at the Wrong Thing",
        feels: "You fell into a skill, got good at it, and the market rewarded you. Then momentum took over. Each job led to the next one in the same direction, because that's what you were qualified for. You're successful at something you never actually chose, and it's hard to complain about a career that keeps going up.",
        voice: "This is what I'm qualified for, so this is what I do.",
        signs: ["You'd struggle to explain why you chose this career.", "Your next job is just a bigger version of your last one.", "You envy people with less money and more excitement."],
        through: "Separate the skill from the industry. List the five things you're actually good at, without job titles. Then picture each of them in three different fields that interest you. You don't have to start over. Most of this climb is carrying what you already have to a better place.",
        question: "If you listed your skills without job titles, where else could they go?"
      },
      {
        title: "Naming Your Price",
        feels: "You know you're good. You probably know you're underpaid. But asking for more feels greedy, risky or rude, so you wait to be noticed. You hope someone will offer what you're worth so you never have to say it out loud. They almost never do, and every year you wait, the gap compounds.",
        voice: "If I ask for more, they'll realize I'm not worth it.",
        signs: ["You found out a peer earns more and said nothing.", "You offer a discount before anyone asks for one.", "You let other people decide what your work is worth."],
        through: "Get the real numbers: what people with your skill earn, what clients pay elsewhere. Write your number down and say it out loud until it stops sounding strange. Then ask once, calmly, with your evidence. The worst answer is usually no, and you already have no.",
        question: "What would you charge if you were the one paying for this work?"
      },
      {
        title: "The Title That Became You",
        feels: "You've done this long enough that it became your identity. Director. Engineer. The one who knows. Changing course now means losing status as well as income, and losing status feels like losing yourself. People will ask what happened. You'd have to be a beginner again, in front of people who used to look up to you.",
        voice: "Without this title, who am I?",
        signs: ["You introduce yourself with your job title first.", "You fear what former colleagues would think if you changed course.", "Being a beginner again sounds humiliating."],
        through: "You are not your title. You're the person who earned it, and that person can earn something else. Practice describing what you care about instead of what you do. Find one low-stakes place to be a beginner, a class or a side project, and get used to that feeling again before you need it.",
        question: "How would you introduce yourself if you weren't allowed to mention your job?"
      }
    ],
    vocation: [
      {
        title: "The Job You Fell Into",
        feels: "You took the work because it was there. A family business, a stable field, the first offer that came along. The world needs it and it pays, and that is not nothing. But you didn't really choose it, you aren't great at it yet, and some days you feel like a passenger in your own life.",
        voice: "This is just what people like me do.",
        signs: ["You describe your work as “what I ended up doing.”", "You do the minimum well enough to stay.", "You rarely think about your work outside work hours."],
        through: "Choose it again, or choose to leave. Either one is a choice, and a chosen path feels completely different from an accidental one. If you stay, decide to get excellent at one part of it. If you go, start the exit plan this month. Drifting is the only option that costs you everything.",
        question: "If you were starting today, would you pick this work on purpose?"
      },
      {
        title: "Duty Without Joy",
        feels: "People need you. Patients, students, customers, a team, a family. The work is good and important, and you don't love it. Then the guilt arrives: how can you not love something this useful? So you stay out of duty, and duty slowly turns into a resentment you can't admit to anyone.",
        voice: "People are counting on me, so what I want doesn't matter.",
        signs: ["You feel guilty for not loving important work.", "Your obligations have quietly replaced your goals.", "You're tired in a way that rest doesn't fix."],
        through: "Duty is a good reason to start and a poor reason to stay forever. Look for the slice of the work that does move you, even a little, and ask for more of it. Then talk honestly with one person about how you really feel. Resentment shrinks once it's said out loud.",
        question: "Which part of this work would you keep if you could drop the rest?"
      },
      {
        title: "Learning to Love the Work",
        feels: "Here's the surprise near the top: sometimes love comes after skill. As you get better at useful work, it can start to feel like yours. But that only happens if you stay curious, and curiosity is hard when you've already decided the work is beneath your passion. This stop asks you to give the work a real chance before you write it off.",
        voice: "If I don't love it already, I never will.",
        signs: ["You've written the work off without ever getting really good at it.", "You notice small moments of pride and dismiss them.", "You're waiting for a passion to arrive instead of building one."],
        through: "Get deliberately excellent at one piece of the job and watch how your feelings change. Love tends to grow where you have mastery, some control over how you work, and a clear view of the people you help. Keep a note of the moments you feel proud. You may be closer to the top than you think.",
        question: "What would change if you became the best in your workplace at one part of this job?"
      }
    ],
    mission: [
      {
        title: "The Volunteer's Dilemma",
        feels: "You found a cause you love, and the world needs it. So you give it your nights and weekends, for free. It's the most meaningful thing you do, it's unpaid, and you're still learning how to do it well. You're living two lives at once, and you wonder how long you can keep doing what matters most in your spare time.",
        voice: "Good work should be its own reward.",
        signs: ["Your most meaningful work starts after your real job ends.", "You're tired from running two lives at once.", "You feel guilty for wishing it paid."],
        through: "Look at who does this work for a living. Organizations, grants, roles and fellowships often exist that volunteers never see. Learn the skills those roles require. Treat your volunteering as training for the job you want, not just a gift you give away.",
        question: "Who gets paid to do what you do for free, and what do they know that you don't?"
      },
      {
        title: "Good Intentions Aren't a Skill",
        feels: "Caring is the fuel. It isn't the engine. You've discovered that helping well is technical: it takes data, process, patience, writing, fundraising and management. Passion made you show up. Now you're learning that showing up without skill can waste the time of the very people you're trying to help.",
        voice: "My heart is in the right place, so the results will follow.",
        signs: ["Your projects start strong and fizzle out.", "You avoid the boring parts: budgets, reports, follow-up.", "You measure your effort instead of the outcome."],
        through: "Respect the boring skills. Pick the unglamorous one that's holding you back the most and learn it properly. Measure what actually changes for the people you serve, not how hard you worked. The fastest way to honor a cause is to get competent at it.",
        question: "What boring skill would multiply the good you do?"
      },
      {
        title: "Asking to Be Paid for Doing Good",
        feels: "You're close to the top, and the last knot is money. You've done good work cheaply or for free for so long that asking to be paid feels like a betrayal. Isn't mission work supposed to be a sacrifice? But martyrdom burns people out, and it turns important missions into hobbies for the few who can afford them.",
        voice: "Taking money for this would make it less pure.",
        signs: ["You underprice your work because the cause is good.", "You believe sacrifice proves you're sincere.", "You can't afford to keep doing the work you love."],
        through: "Sustainable missions pay their people. Being paid lets you do the work longer and better. Build the case for funding: the outcomes, the costs, the value created. Then ask a funder, an employer or a client to pay fairly. The cause deserves a version of you that can stay.",
        question: "What would it take for this mission to support you for the long haul?"
      }
    ]
  };

  var FALSE_SUMMIT = {
    title: "The False Summit",
    feels: "You've got all four circles at once: love, skill, need and pay. You expected fireworks. Instead it feels ordinary. The work is still work, and some days are still hard. Then something shifts. A client leaves, your industry changes, or you change, and one circle slips out of place. Every climber knows this ridge. You can see the top, and there's still more mountain.",
    voice: "If this were really it, I'd feel happy all the time.",
    signs: ["You have what you wanted and still feel restless.", "You keep waiting for the moment it all clicks into place forever.", "A change knocks one circle loose and you panic."],
    through: "Ikigai isn't a state you hold. It's a balance you keep finding. Expect the circles to drift, and check them each season to see which one is slipping. Small corrections keep you near the top. When something moves, you haven't failed. You're still climbing.",
    question: "Which of your four circles needs attention this season?"
  };

  var SUMMIT_STOP = {
    title: "Ikigai",
    feels: "生き甲斐, a reason for being. In Japan the word is small and everyday. It isn't a grand destiny. It's the reason you get up in the morning, the thing that makes the days feel worth it. You reached it by walking every face of the mountain, more than once. None of those laps were detours. Each one is part of why you're standing here.",
    voice: "From up here, the four faces read as one shape.",
    voiceLabel: "What the summit shows you",
    signs: ["Mondays feel like a continuation, not an interruption.", "You can see how every hard stop shaped the work you do now.", "You'd do the work for less, and you still get paid for it."],
    signsLabel: "You might be here if",
    through: "You don't stay on a summit. Life changes, and you'll go around again: new skills, new needs, new loves. The second climb is different, because now you know the mountain. From here you can also see who's still at the bottom, and point them toward the trail.",
    throughLabel: "What comes next",
    question: "Who could you help find their own way up?"
  };

  /* ------------------------------------------------------------------ */
  /* Circles, zones and ridges                                           */
  /* ------------------------------------------------------------------ */

  // Circle order: 0 love (north), 1 good at (west), 2 world needs (east), 3 paid for (south).
  var D = 0.42, R = 1.0;
  var SIDES = [
    { key: "love",  name: "What you love",            short: "Love",        side: "Love side",        word: "love",  css: "--love",  u: 0,  v: D,  ang: 90,  L: 0.63, C: 0.165, h: 18 },
    { key: "good",  name: "What you're good at",      short: "Good at",     side: "Good-at side",     word: "skill", css: "--good",  u: -D, v: 0,  ang: 180, L: 0.76, C: 0.145, h: 72 },
    { key: "needs", name: "What the world needs",     short: "World needs", side: "World-needs side", word: "need",  css: "--needs", u: D,  v: 0,  ang: 0,   L: 0.58, C: 0.13,  h: 245 },
    { key: "paid",  name: "What you can be paid for", short: "Paid for",    side: "Paid-for side",    word: "pay",   css: "--paid",  u: 0,  v: -D, ang: 270, L: 0.64, C: 0.135, h: 152 }
  ];

  // Keyed by bitmask: love 1, good 2, needs 4, paid 8.
  var ZONES = {
    0:  "The lowlands",
    1:  "Pure love",
    2:  "Untapped skill",
    4:  "A need you see",
    8:  "A paycheck",
    3:  "Passion",
    5:  "Mission",
    12: "Vocation",
    10: "Profession",
    7:  "Full, but broke",
    13: "Exciting, but shaky",
    14: "Comfortable, but empty",
    11: "Satisfied, but useless?",
    15: "Ikigai"
  };

  var RIDGES = {
    passion:    { name: "Passion",    mask: 3,  ang: 135 },
    mission:    { name: "Mission",    mask: 5,  ang: 45 },
    vocation:   { name: "Vocation",   mask: 12, ang: 315 },
    profession: { name: "Profession", mask: 10, ang: 225 }
  };

  function ridgeAt(deg) {
    var a = ((Math.round(deg) % 360) + 360) % 360;
    if (a === 45) return "mission";
    if (a === 135) return "passion";
    if (a === 225) return "profession";
    return "vocation";
  }

  function listJoin(words, last) {
    if (words.length <= 1) return words.join("");
    return words.slice(0, -1).join(", ") + " " + last + " " + words[words.length - 1];
  }
  function zoneWords(mask) {
    if (mask === 0) return "outside every circle";
    if (mask === 15) return "all four circles at once";
    var have = [], miss = [];
    SIDES.forEach(function (s, i) { (mask & (1 << i) ? have : miss).push(s.word); });
    return listJoin(have, "and") + ", no " + listJoin(miss, "or");
  }

  /* ------------------------------------------------------------------ */
  /* Terrain math                                                        */
  /* ------------------------------------------------------------------ */

  var E = 0.14, HS = 0.38, EXT = 2.6;

  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function smooth(a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }

  function hBase(u, v) {
    var h = 0;
    for (var i = 0; i < 4; i++) {
      var dx = u - SIDES[i].u, dy = v - SIDES[i].v;
      var d = Math.sqrt(dx * dx + dy * dy);
      var m = 1 - smooth(R - E, R + E, d);
      h += m * (0.55 + 0.45 * Math.max(0, 1 - d / (R + E)));
    }
    var r2 = u * u + v * v;
    h += 0.85 * Math.exp(-r2 / (2 * 0.17 * 0.17));
    h += 0.28 * Math.exp(-r2 / (2 * 1.15 * 1.15));
    return h;
  }

  function hash(x, y) {
    var h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }
  function vnoise(x, y) {
    var xi = Math.floor(x), yi = Math.floor(y);
    var xf = x - xi, yf = y - yi;
    var sx = xf * xf * (3 - 2 * xf), sy = yf * yf * (3 - 2 * yf);
    var a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
  }
  function fbm(x, y) {
    var s = 0, amp = 0.5, f = 1;
    for (var o = 0; o < 4; o++) { s += amp * vnoise(x * f, y * f); f *= 2.03; amp *= 0.5; }
    return s / 0.9375;
  }
  function hFull(u, v) {
    var hb = hBase(u, v);
    var n = fbm(u * 2.6 + 11.3, v * 2.6 + 7.1) - 0.5;
    var ridge = 1 - Math.abs(fbm(u * 5.1 - 3.7, v * 5.1 + 2.2) * 2 - 1);
    var fade = 1 - smooth(3.0, 4.3, hb);
    return hb + 0.2 * (1 - 0.65 * (1 - fade)) * n + 0.05 * ridge * fade;
  }
  function worldY(u, v) { return HS * hFull(u, v); }

  function maskAt(u, v) {
    var m = 0;
    for (var i = 0; i < 4; i++) {
      var dx = u - SIDES[i].u, dy = v - SIDES[i].v;
      if (dx * dx + dy * dy < R * R) m |= 1 << i;
    }
    return m;
  }

  function oklch(L, C, h) {
    var a = C * Math.cos(h * Math.PI / 180), b = C * Math.sin(h * Math.PI / 180);
    var l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    var m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    var s_ = L - 0.0894841775 * a - 1.2914855480 * b;
    var l = l_ * l_ * l_, m = m_ * m_ * m_, s = s_ * s_ * s_;
    var r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    var g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    var bb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
    function f(x) { x = clamp(x, 0, 1); return x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055; }
    return [f(r), f(g), f(bb)];
  }
  function toHex(rgb) {
    return "#" + rgb.map(function (x) { return Math.round(clamp(x, 0, 1) * 255).toString(16).padStart(2, "0"); }).join("");
  }

  function chromaFactor(W) {
    if (W <= 1) return 1;
    if (W <= 2) return 1 - 0.05 * (W - 1);
    if (W <= 3) return 0.95 - 0.33 * (W - 2);
    return 0.62 - 0.52 * (W - 3);
  }

  // A clean swatch for a zone, used for ridge pins and dots.
  function mixHex(mask) {
    var a = 0, b = 0, W = 0, Ls = 0, Cs = 0;
    SIDES.forEach(function (s, i) {
      if (!(mask & (1 << i))) return;
      var hr = s.h * Math.PI / 180;
      a += Math.cos(hr); b += Math.sin(hr); Ls += s.L; Cs += s.C; W++;
    });
    return toHex(oklch(Ls / W, (Cs / W) * chromaFactor(W) * 1.05, Math.atan2(b, a) * 180 / Math.PI));
  }

  var GROUND = oklch(0.62, 0.018, 235);

  function colorAt(u, v, hb, out) {
    var a = 0, b = 0, W = 0, Ls = 0, Cs = 0;
    for (var i = 0; i < 4; i++) {
      var s = SIDES[i];
      var dx = u - s.u, dy = v - s.v;
      var d = Math.sqrt(dx * dx + dy * dy);
      var w = 1 - smooth(R - 0.03, R + 0.03, d);
      if (w > 0) {
        var hr = s.h * Math.PI / 180;
        a += w * Math.cos(hr); b += w * Math.sin(hr);
        Ls += w * s.L; Cs += w * s.C; W += w;
      }
    }
    var grain = fbm(u * 9 + 4, v * 9 - 2) - 0.5;
    out[3] = clamp(1 - W, 0, 1);
    if (W < 1e-4) {
      out[0] = GROUND[0] + grain * 0.05; out[1] = GROUND[1] + grain * 0.05; out[2] = GROUND[2] + grain * 0.05;
      return;
    }
    var hue = Math.atan2(b, a) * 180 / Math.PI;
    var L = Ls / W, C = (Cs / W) * chromaFactor(W);
    var t = clamp(hb / 4.4, 0, 1);
    L += 0.15 * (t - 0.3) + grain * 0.06;
    var snow = smooth(3.1, 3.85, W);
    L = L + (0.965 - L) * snow;
    C = C + (0.014 - C) * snow;
    if (snow > 0.5) hue = hue + (85 - hue) * (snow - 0.5) * 2;
    var rgb = oklch(L, C, hue);
    var gb = clamp(1 - W, 0, 1);
    out[0] = rgb[0] + (GROUND[0] - rgb[0]) * gb;
    out[1] = rgb[1] + (GROUND[1] - rgb[1]) * gb;
    out[2] = rgb[2] + (GROUND[2] - rgb[2]) * gb;
  }

  /* ------------------------------------------------------------------ */
  /* Scene                                                               */
  /* ------------------------------------------------------------------ */

  var stageEl = document.getElementById("stage");
  var canvas = document.getElementById("scene");
  var labelsEl = document.getElementById("labels");
  var tipEl = document.getElementById("tip");
  var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  var renderer = null;
  try {
    if (typeof THREE !== "undefined") renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  } catch (err) { renderer = null; }
  var hasGL = !!renderer;
  if (!hasGL) {
    var msg = document.createElement("div");
    msg.className = "nogl";
    msg.textContent = "The mountain needs WebGL to draw. The full trail guide is still here to read.";
    stageEl.appendChild(msg);
  }

  var scene, camera, terrainUniforms, trailUniforms;
  var pinGroup, climber, halo, flag;
  var sideMats, pinOutlineMat, stemMat, headGeo, ringGeo, stemGeo, trailMat;

  if (hasGL) {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(34, 1, 0.05, 60);

    var N = 240;
    var verts = (N + 1) * (N + 1);
    var pos = new Float32Array(verts * 3);
    var col = new Float32Array(verts * 3);
    var map = new Float32Array(verts * 2);
    var gnd = new Float32Array(verts);
    var tmp = [0, 0, 0, 0];
    var k = 0, i, j;
    for (j = 0; j <= N; j++) {
      for (i = 0; i <= N; i++) {
        var u = -EXT + (2 * EXT * i) / N;
        var v = EXT - (2 * EXT * j) / N;
        var hb = hBase(u, v);
        pos[k * 3] = u; pos[k * 3 + 1] = HS * hFull(u, v); pos[k * 3 + 2] = -v;
        colorAt(u, v, hb, tmp);
        col[k * 3] = tmp[0]; col[k * 3 + 1] = tmp[1]; col[k * 3 + 2] = tmp[2];
        map[k * 2] = u; map[k * 2 + 1] = v;
        gnd[k] = tmp[3];
        k++;
      }
    }
    var idx = new Uint32Array(N * N * 6);
    var q = 0;
    for (j = 0; j < N; j++) {
      for (i = 0; i < N; i++) {
        var a0 = j * (N + 1) + i, b0 = a0 + 1, c0 = a0 + (N + 1), d0 = c0 + 1;
        idx[q++] = a0; idx[q++] = c0; idx[q++] = b0;
        idx[q++] = b0; idx[q++] = c0; idx[q++] = d0;
      }
    }
    var tGeo = new THREE.BufferGeometry();
    tGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    tGeo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    tGeo.setAttribute("aMap", new THREE.BufferAttribute(map, 2));
    tGeo.setAttribute("aGround", new THREE.BufferAttribute(gnd, 1));
    tGeo.setIndex(new THREE.BufferAttribute(idx, 1));
    tGeo.computeVertexNormals();

    terrainUniforms = {
      uLight: { value: new THREE.Vector3(-0.4, 0.8, 0.45).normalize() },
      uFog: { value: new THREE.Color("#e8edf2") },
      uC: { value: SIDES.map(function (s) { return new THREE.Vector2(s.u, s.v); }) },
      uR: { value: R },
      uExposure: { value: 1 },
      uTop: { value: 0 }
    };
    var terrainMat = new THREE.ShaderMaterial({
      uniforms: terrainUniforms,
      transparent: true,
      extensions: { derivatives: true },
      vertexShader: [
        "attribute vec3 aColor;",
        "attribute vec2 aMap;",
        "attribute float aGround;",
        "varying vec3 vColor;",
        "varying vec3 vN;",
        "varying vec2 vMap;",
        "varying float vY;",
        "varying float vGround;",
        "void main() {",
        "  vColor = aColor; vN = normal; vMap = aMap; vY = position.y; vGround = aGround;",
        "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
        "}"
      ].join("\n"),
      fragmentShader: [
        "uniform vec3 uLight;",
        "uniform vec3 uFog;",
        "uniform vec2 uC[4];",
        "uniform float uR;",
        "uniform float uExposure;",
        "uniform float uTop;",
        "varying vec3 vColor;",
        "varying vec3 vN;",
        "varying vec2 vMap;",
        "varying float vY;",
        "varying float vGround;",
        "void main() {",
        "  vec3 n = normalize(vN);",
        "  float lam = max(dot(n, uLight), 0.0);",
        "  float hemi = 0.5 + 0.5 * n.y;",
        "  vec3 c = vColor * (0.34 + 0.22 * hemi + 0.62 * lam) * uExposure;",
        "  float ln = 0.0;",
        "  for (int i = 0; i < 4; i++) {",
        "    float dd = length(vMap - uC[i]);",
        "    float w = fwidth(dd);",
        "    ln = max(ln, 1.0 - smoothstep(w * 0.5, w * 1.7, abs(dd - uR)));",
        "  }",
        "  c = mix(c, vec3(1.0), ln * (0.5 + 0.25 * uTop));",
        "  float hc = vY / 0.055;",
        "  float cw = fwidth(hc);",
        "  float cq = abs(fract(hc + 0.5) - 0.5);",
        "  float cl = 1.0 - smoothstep(cw * 0.4, cw * 1.4, cq);",
        "  c *= 1.0 - 0.16 * cl * (1.0 - 0.6 * vGround);",
        "  c = mix(c, uFog, vGround * 0.55);",
        "  float rr = length(vMap);",
        "  c = mix(c, uFog, smoothstep(1.55, 2.25, rr));",
        "  gl_FragColor = vec4(c, 1.0 - smoothstep(1.95, 2.45, rr));",
        "}"
      ].join("\n")
    });
    var terrain = new THREE.Mesh(tGeo, terrainMat);
    terrain.renderOrder = 1;
    scene.add(terrain);

    trailUniforms = {
      uProg: { value: 0 },
      uDash: { value: new THREE.Color("#ffffff") },
      uWalk: { value: new THREE.Color("#ffd47e") },
      uEdge: { value: new THREE.Color("#1b2230") }
    };
    trailMat = new THREE.ShaderMaterial({
      uniforms: trailUniforms,
      vertexShader: [
        "varying vec2 vUv;",
        "varying vec3 vNv;",
        "void main() {",
        "  vUv = uv; vNv = normalize(normalMatrix * normal);",
        "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
        "}"
      ].join("\n"),
      fragmentShader: [
        "uniform float uProg;",
        "uniform vec3 uDash;",
        "uniform vec3 uWalk;",
        "uniform vec3 uEdge;",
        "varying vec2 vUv;",
        "varying vec3 vNv;",
        "void main() {",
        "  bool walked = vUv.x <= uProg;",
        "  if (!walked && fract(vUv.x * 300.0) < 0.42) discard;",
        "  float rim = 1.0 - abs(normalize(vNv).z);",
        "  vec3 core = walked ? uWalk : uDash;",
        "  gl_FragColor = vec4(mix(core, uEdge, smoothstep(0.45, 0.92, rim)), 1.0);",
        "}"
      ].join("\n")
    });

    pinGroup = new THREE.Group();
    scene.add(pinGroup);
    pinOutlineMat = new THREE.MeshBasicMaterial({ color: 0x1b2230, side: THREE.BackSide });
    stemMat = new THREE.MeshBasicMaterial({ color: 0x1b2230 });
    headGeo = new THREE.SphereGeometry(0.026, 16, 12);
    ringGeo = new THREE.SphereGeometry(0.034, 16, 12);
    stemGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.11, 6);
    stemGeo.translate(0, 0.055, 0);

    climber = new THREE.Group();
    var climberCore = new THREE.Mesh(new THREE.SphereGeometry(0.03, 18, 14), new THREE.MeshBasicMaterial({ color: 0xfff2d2 }));
    var climberRing = new THREE.Mesh(new THREE.SphereGeometry(0.041, 18, 14), new THREE.MeshBasicMaterial({ color: 0x1b2230, side: THREE.BackSide }));
    climber.add(climberRing, climberCore);
    var haloCanvas = document.createElement("canvas");
    haloCanvas.width = haloCanvas.height = 64;
    var hctx = haloCanvas.getContext("2d");
    var grad = hctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,226,150,0.85)");
    grad.addColorStop(0.35, "rgba(255,206,110,0.35)");
    grad.addColorStop(1, "rgba(255,206,110,0)");
    hctx.fillStyle = grad;
    hctx.fillRect(0, 0, 64, 64);
    halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(haloCanvas), transparent: true, depthWrite: false }));
    halo.scale.set(0.24, 0.24, 1);
    halo.renderOrder = 10;
    climber.add(halo);
    scene.add(climber);

    flag = new THREE.Group();
    var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.22, 6), stemMat);
    pole.position.y = 0.11;
    var flagGeo = new THREE.BufferGeometry();
    flagGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array([0, 0.22, 0, 0.12, 0.185, 0, 0, 0.15, 0]), 3));
    flag.add(pole, new THREE.Mesh(flagGeo, new THREE.MeshBasicMaterial({ color: 0xffc75f, side: THREE.DoubleSide })));
    flag.visible = false;
    flag.position.set(0, worldY(0, 0), 0);
    scene.add(flag);
  }

  /* ------------------------------------------------------------------ */
  /* Trail and stops                                                     */
  /* ------------------------------------------------------------------ */

  var PHI_END = 3.35;
  var NS = 1400;
  var R_KEYS = [[0, 1.52], [0.1, 1.2], [0.25, 1.17], [1.0, 1.04], [1.25, 0.88], [2.0, 0.82], [2.25, 0.75], [3.0, 0.69], [PHI_END, 0.0]];
  var SUMMIT_HEX = "#e0b44e", TRAILHEAD_HEX = "#7d8696";

  function rawR(phi) {
    for (var i = 0; i < R_KEYS.length - 1; i++) {
      var A = R_KEYS[i], B = R_KEYS[i + 1];
      if (phi <= B[0]) return A[1] + (B[1] - A[1]) * (phi - A[0]) / (B[0] - A[0]);
    }
    return 0;
  }

  function sideIndexAtAngle(deg) {
    var a = ((deg % 360) + 360) % 360;
    var best = 0, bestD = 999;
    for (var i = 0; i < 4; i++) {
      var dd = Math.abs(((a - SIDES[i].ang + 540) % 360) - 180);
      if (dd < bestD) { bestD = dd; best = i; }
    }
    return best;
  }
  function sampleAt(phi) { return Math.round((phi / PHI_END) * (NS - 1)); }

  var trail = null;
  var stops = [];

  function buildJourney(startIdx) {
    // Trail geometry
    var startAng = SIDES[startIdx].ang * Math.PI / 180;
    var rs = new Float32Array(NS), sm = new Float32Array(NS), W = 22, i, o;
    for (i = 0; i < NS; i++) rs[i] = rawR((i / (NS - 1)) * PHI_END);
    for (i = 0; i < NS; i++) {
      var s = 0, c = 0;
      for (o = -W; o <= W; o++) { s += rs[clamp(i + o, 0, NS - 1)]; c++; }
      sm[i] = s / c;
    }
    sm[NS - 1] = 0;
    var us = new Float32Array(NS), vs = new Float32Array(NS), ys = new Float32Array(NS), phis = new Float32Array(NS);
    var pts = [];
    for (i = 0; i < NS; i++) {
      var phi = (i / (NS - 1)) * PHI_END;
      var th = startAng + 2 * Math.PI * phi;
      var u = sm[i] * Math.cos(th), v = sm[i] * Math.sin(th);
      us[i] = u; vs[i] = v; phis[i] = phi;
      ys[i] = worldY(u, v) + 0.014;
      if (hasGL) pts.push(new THREE.Vector3(u, ys[i], -v));
    }
    var cumLen = new Float32Array(NS), cumCost = new Float32Array(NS);
    for (i = 1; i < NS; i++) {
      var dx = us[i] - us[i - 1], dz = vs[i] - vs[i - 1], dy = ys[i] - ys[i - 1];
      var dl = Math.sqrt(dx * dx + dy * dy + dz * dz);
      cumLen[i] = cumLen[i - 1] + dl;
      cumCost[i] = cumCost[i - 1] + dl * (1 + 5 * (dl > 0 ? Math.max(0, dy) / dl : 0));
    }
    var hexes = [];
    var tmpc = [0, 0, 0, 0];
    for (i = 0; i < NS; i += 14) { colorAt(us[i], vs[i], hBase(us[i], vs[i]), tmpc); hexes.push({ i: i, hex: toHex(tmpc.slice(0, 3)) }); }

    if (trail && trail.mesh) { scene.remove(trail.mesh); trail.mesh.geometry.dispose(); }
    var curve = null, mesh = null;
    if (hasGL) {
      curve = new THREE.CatmullRomCurve3(pts, false, "centripetal");
      curve.arcLengthDivisions = 7000;
      mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 2600, 0.011, 6, false), trailMat);
      scene.add(mesh);
    }
    trail = {
      startIdx: startIdx, curve: curve, mesh: mesh,
      us: us, vs: vs, ys: ys, phis: phis, cumLen: cumLen, cumCost: cumCost,
      totalLen: cumLen[NS - 1], totalCost: cumCost[NS - 1], hexes: hexes
    };

    // Stops
    stops = [];
    function add(stop, sample) {
      stop.sample = sample;
      stop.mask = maskAt(us[sample], vs[sample]);
      stop.cost = cumCost[sample];
      stop.arc = cumLen[sample] / trail.totalLen;
      stop.n = stops.length + 1;
      stops.push(stop);
    }
    var startSide = SIDES[startIdx];
    add({ id: "trailhead", kind: "trailhead", data: TRAILHEADS[startSide.key], lap: 0, cssColor: "var(--ink-soft)", hex: TRAILHEAD_HEX,
          place: "Trailhead · " + startSide.side }, 0);
    var faceVisits = [0, 0, 0, 0], ridgeVisits = { passion: 0, mission: 0, vocation: 0, profession: 0 };
    for (var kk = 1; kk <= 24; kk++) {
      var deg = startSide.ang + kk * 45;
      var lap = Math.ceil(kk / 8);
      if (kk % 2 === 0) {
        var si = sideIndexAtAngle(deg);
        add({ id: SIDES[si].key + "-" + (faceVisits[si] + 1), kind: "face", side: si, lap: lap, data: FACE_STOPS[SIDES[si].key][faceVisits[si]++],
              cssColor: "var(" + SIDES[si].css + ")", hex: cssVar(SIDES[si].css) || "#888888",
              place: "Lap " + lap + " · " + SIDES[si].side }, sampleAt(kk / 8));
      } else {
        var rk = ridgeAt(deg);
        var rhex = mixHex(RIDGES[rk].mask);
        add({ id: rk + "-" + (ridgeVisits[rk] + 1), kind: "ridge", ridge: rk, lap: lap, data: RIDGE_STOPS[rk][ridgeVisits[rk]++],
              cssColor: rhex, hex: rhex,
              place: "Lap " + lap + " · Crossing " + RIDGES[rk].name }, sampleAt(kk / 8));
      }
    }
    add({ id: "false-summit", kind: "false", lap: 4, data: FALSE_SUMMIT, cssColor: "var(--summit)", hex: SUMMIT_HEX, place: "Final ascent" }, sampleAt(3.2));
    add({ id: "summit", kind: "summit", lap: 5, data: SUMMIT_STOP, cssColor: "var(--summit)", hex: SUMMIT_HEX, place: "Summit" }, NS - 1);

    // Pins
    if (hasGL) {
      while (pinGroup.children.length) pinGroup.remove(pinGroup.children[0]);
      var matCache = {};
      stops.forEach(function (st) {
        if (st.kind === "summit") return;
        var p = pts[st.sample];
        var mat = matCache[st.hex] || (matCache[st.hex] = new THREE.MeshBasicMaterial({ color: new THREE.Color(st.hex) }));
        var g = new THREE.Group();
        g.position.copy(p);
        var head = new THREE.Mesh(headGeo, mat), ring = new THREE.Mesh(ringGeo, pinOutlineMat);
        head.position.y = ring.position.y = 0.11;
        g.add(new THREE.Mesh(stemGeo, stemMat), ring, head);
        pinGroup.add(g);
        st.head = head; st.ring = ring;
        st.top = new THREE.Vector3(p.x, p.y + 0.11, p.z);
      });
      var last = stops[stops.length - 1];
      last.top = new THREE.Vector3(0, worldY(0, 0) + 0.22, 0);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Story rendering                                                     */
  /* ------------------------------------------------------------------ */

  var stopsEl = document.getElementById("stops");
  var indexEl = document.getElementById("index");
  var sections = [];

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function heldHtml(mask) {
    return '<span class="held" role="img" aria-label="Holding ' + bitCount(mask) + ' of 4 circles">' +
      SIDES.map(function (s, i) { return '<i class="' + (mask & (1 << i) ? "on" : "") + '" style="--c: var(' + s.css + ')"></i>'; }).join("") +
      "</span>";
  }
  function bitCount(m) { var n = 0; while (m) { n += m & 1; m >>= 1; } return n; }

  function renderStory() {
    var total = stops.length;
    stopsEl.innerHTML = stops.map(function (st) {
      var d = st.data;
      return '<li class="stop" id="stop-' + st.n + '" style="--c: ' + st.cssColor + '">' +
        '<span class="dot" aria-hidden="true"></span>' +
        '<p class="stop-kicker">Stop ' + st.n + " of " + total + " · " + esc(st.place) + "</p>" +
        '<h2 class="stop-title">' + esc(d.title) + "</h2>" +
        '<p class="where">' + heldHtml(st.mask) + "<span>Standing in <b>" + esc(ZONES[st.mask]) + "</b> · " + esc(zoneWords(st.mask)) + "</span></p>" +
        '<p class="feels">' + esc(d.feels) + "</p>" +
        '<figure class="voice"><figcaption>' + esc(d.voiceLabel || "The voice that keeps you here") + "</figcaption><blockquote>“" + esc(d.voice) + "”</blockquote></figure>" +
        '<div class="signs"><h3>' + esc(d.signsLabel || "You might be here if") + "</h3><ul>" +
          d.signs.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul></div>" +
        '<div class="through"><h3>' + esc(d.throughLabel || "The way through") + "</h3><p>" + esc(d.through) + "</p></div>" +
        '<p class="carry"><span>Carry this up</span>' + esc(d.question) + "</p>" +
        "</li>";
    }).join("");

    var groups = [["Trailhead", function (s) { return s.lap === 0; }],
                  ["Lap 1", function (s) { return s.lap === 1; }],
                  ["Lap 2", function (s) { return s.lap === 2; }],
                  ["Lap 3", function (s) { return s.lap === 3; }],
                  ["Final ascent and summit", function (s) { return s.lap >= 4; }]];
    indexEl.innerHTML = groups.map(function (g) {
      return '<li class="lap-row">' + g[0] + "</li>" + stops.filter(g[1]).map(function (st) {
        return '<li><button type="button" data-stop="' + st.n + '" style="--c: ' + st.cssColor + '">' +
          '<span class="n">' + st.n + "</span><i></i>" +
          '<span class="t">' + esc(st.data.title) + "</span>" +
          '<span class="z">' + esc(ZONES[st.mask]) + "</span></button></li>";
      }).join("");
    }).join("");

    sections = [{ el: document.getElementById("intro"), kind: "intro" }];
    stops.forEach(function (st) { sections.push({ el: document.getElementById("stop-" + st.n), kind: "stop", stop: st }); });
    sections.push({ el: document.getElementById("outro"), kind: "outro" });
    activeSec = -1;
    scrollDirty = true;
    applyYouBadges();
    decorateStopsWithListen();
  }

  indexEl.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-stop]");
    if (b) goToStop(parseInt(b.getAttribute("data-stop"), 10));
  });

  function goToSection(si) {
    var s = sections[clamp(si, 0, sections.length - 1)];
    if (s) s.el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }
  function goToStop(n) { goToSection(n); }

  document.getElementById("begin").addEventListener("click", function () { goToStop(1); });
  document.getElementById("toIndex").addEventListener("click", function () {
    document.getElementById("index").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  });
  document.getElementById("prevStop").addEventListener("click", function () { goToSection(Math.max(0, activeSec - 1)); });
  document.getElementById("nextStop").addEventListener("click", function () { goToSection(Math.min(sections.length - 1, activeSec + 1)); });

  /* ------------------------------------------------------------------ */
  /* Start chips                                                         */
  /* ------------------------------------------------------------------ */

  var startsEl = document.getElementById("starts");
  var startIdx = 0;
  var startBtns = SIDES.map(function (s, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "start";
    b.setAttribute("role", "radio");
    b.setAttribute("aria-checked", String(i === startIdx));
    b.innerHTML = '<i style="--c: var(' + s.css + ')"></i>' + s.short;
    b.addEventListener("click", function () {
      if (startIdx === i) return;
      startIdx = i;
      startBtns.forEach(function (x, xi) { x.setAttribute("aria-checked", String(xi === i)); });
      buildJourney(i);
      renderStory();
      drawProfile();
      climbCost = 0;
      if (hasGL) {
        var a = s.ang * Math.PI / 180;
        var target = Math.atan2(Math.cos(a), -Math.sin(a)) - 0.45;
        goal.theta = cam.theta + wrapPi(target - cam.theta);
        lastInteract = performance.now();
      }
    });
    startsEl.appendChild(b);
    return b;
  });

  /* ------------------------------------------------------------------ */
  /* Labels                                                              */
  /* ------------------------------------------------------------------ */

  var labels = [];
  var hereLabel = null;
  var tagBox = null;
  function measureTag() {
    var t = document.querySelector(".stage-tag");
    tagBox = t && t.offsetWidth ? { x: t.offsetLeft, y: t.offsetTop, w: t.offsetWidth, h: t.offsetHeight } : null;
  }
  function overTag(x, y, w, h) {
    if (!tagBox) return false;
    return x - w / 2 < tagBox.x + tagBox.w + 6 && x + w / 2 > tagBox.x - 6 && y - h / 2 < tagBox.y + tagBox.h + 6 && y + h / 2 > tagBox.y - 6;
  }
  function measureLabels() { labels.forEach(function (L) { L.w = L.el.offsetWidth; L.h = L.el.offsetHeight; }); if (hereLabel) hereLabel.w = hereLabel.el.offsetWidth; measureTag(); }
  function addLabel(html, cls, u, v, lift, always) {
    var el = document.createElement("div");
    el.className = "lbl " + cls;
    el.innerHTML = html;
    labelsEl.appendChild(el);
    var L = { el: el, w: 0, pos: hasGL ? new THREE.Vector3(u, worldY(u, v) + lift, -v) : null, dir: { x: u, z: -v }, always: !!always };
    var len = Math.hypot(u, v) || 1; L.dir.x /= len; L.dir.z /= len;
    labels.push(L);
    return L;
  }
  if (hasGL) {
    SIDES.forEach(function (s) {
      var a = s.ang * Math.PI / 180, r = 1.56;
      addLabel('<i style="--c: var(' + s.css + ')"></i>' + s.name, "lbl-side", r * Math.cos(a), r * Math.sin(a), 0.05);
    });
    Object.keys(RIDGES).forEach(function (key) {
      var z = RIDGES[key], a = z.ang * Math.PI / 180, r = 1.0;
      addLabel(z.name, "lbl-zone", r * Math.cos(a), r * Math.sin(a), 0.03);
    });
    addLabel('<span lang="ja">生き甲斐</span> · Ikigai', "lbl-summit", 0, 0, 0.17, true);
    var hereEl = document.createElement("div");
    hereEl.className = "lbl lbl-here";
    hereEl.style.opacity = 0;
    labelsEl.appendChild(hereEl);
    hereLabel = { el: hereEl, w: 0 };
  }

  /* ------------------------------------------------------------------ */
  /* Camera                                                              */
  /* ------------------------------------------------------------------ */

  var cam = { theta: Math.PI - 0.6, phi: 1.04, radius: 6.3, ty: 0.5 };
  var goal = { theta: cam.theta, phi: cam.phi, radius: cam.radius, ty: cam.ty };
  var lastInteract = -1e9;
  var width = 1, height = 1, aspect = 1;
  var baseMode = "overview", viewOverride = null;

  function wrapPi(a) { a = (a + Math.PI) % (2 * Math.PI); if (a < 0) a += 2 * Math.PI; return a - Math.PI; }

  function effectiveMode() {
    if (viewOverride === "above") return "above";
    if (viewOverride === "mountain" && baseMode === "above") return "overview";
    return baseMode;
  }

  function setViewButtons() {
    var above = effectiveMode() === "above";
    document.getElementById("viewMountain").setAttribute("aria-pressed", String(!above));
    document.getElementById("viewAbove").setAttribute("aria-pressed", String(above));
  }
  document.getElementById("viewMountain").addEventListener("click", function () { viewOverride = "mountain"; lastInteract = -1e9; setViewButtons(); });
  document.getElementById("viewAbove").addEventListener("click", function () { viewOverride = "above"; setViewButtons(); });

  var profileH = 0;
  function resize() {
    if (!hasGL) return;
    var rect = stageEl.getBoundingClientRect();
    width = Math.max(1, rect.width); height = Math.max(1, rect.height);
    aspect = width / height;
    renderer.setSize(width, height, false);
    camera.aspect = aspect;
    profileH = document.getElementById("profile").getBoundingClientRect().height + 20;
    camera.setViewOffset(width, height, 0, profileH * 0.42, width, height);
    camera.updateProjectionMatrix();
    measureLabels();
    drawProfile();
    scrollDirty = true;
  }

  function applyCamera() {
    var fit = Math.max(1, 0.96 / aspect);
    var r = cam.radius * fit;
    var sp = Math.sin(cam.phi);
    camera.position.set(r * sp * Math.sin(cam.theta), cam.ty + r * Math.cos(cam.phi), r * sp * Math.cos(cam.theta));
    camera.lookAt(0, cam.ty, 0);
    var fx = -Math.cos(cam.theta), fz = Math.sin(cam.theta);
    var tx = Math.sin(cam.theta), tz = Math.cos(cam.theta);
    terrainUniforms.uLight.value.set(fx * 0.55 + tx * 0.5, 0.85, fz * 0.55 + tz * 0.5).normalize();
    terrainUniforms.uTop.value = 1 - smooth(0.1, 0.6, cam.phi);
  }

  function applyTheme() {
    if (!hasGL) return;
    var fog = cssVar("--fog");
    if (fog) terrainUniforms.uFog.value.set(fog);
    var ex = parseFloat(cssVar("--exposure"));
    terrainUniforms.uExposure.value = isNaN(ex) ? 1 : ex;
    if (trail) drawProfile();
  }
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    if (mq.addEventListener) mq.addEventListener("change", applyTheme);
    else if (mq.addListener) mq.addListener(applyTheme);
  }
  new MutationObserver(applyTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class", "style"] });

  /* ------------------------------------------------------------------ */
  /* Elevation profile                                                   */
  /* ------------------------------------------------------------------ */

  var profileEl = document.getElementById("profile");
  var prof = { X: null, Y: null, w: 0, h: 0, stopX: [] };
  var svgNS = "http://www.w3.org/2000/svg";

  function drawProfile() {
    if (!trail) return;
    var rect = profileEl.getBoundingClientRect();
    var w = rect.width, h = rect.height;
    if (w < 20 || h < 20) return;
    var compact = h < 70;
    var padL = 14, padR = 14, padT = compact ? 8 : 24, padB = compact ? 7 : 10;
    var ymin = Infinity, ymax = -Infinity, i;
    for (i = 0; i < NS; i++) { if (trail.ys[i] < ymin) ymin = trail.ys[i]; if (trail.ys[i] > ymax) ymax = trail.ys[i]; }
    function X(arc) { return padL + arc * (w - padL - padR); }
    function Y(y) { return padT + (1 - (y - ymin) / (ymax - ymin)) * (h - padT - padB); }
    prof.X = X; prof.Y = Y; prof.w = w; prof.h = h;

    var line = "", step = 4;
    for (i = 0; i < NS; i += step) line += (i ? "L" : "M") + X(trail.cumLen[i] / trail.totalLen).toFixed(1) + "," + Y(trail.ys[i]).toFixed(1);
    line += "L" + X(1).toFixed(1) + "," + Y(trail.ys[NS - 1]).toFixed(1);
    var area = line + "L" + X(1).toFixed(1) + "," + (h - padB + 2) + "L" + X(0).toFixed(1) + "," + (h - padB + 2) + "Z";

    var stopsG = trail.hexes.map(function (c) {
      return '<stop offset="' + (trail.cumLen[c.i] / trail.totalLen).toFixed(4) + '" stop-color="' + c.hex + '"/>';
    }).join("");

    var laps = "";
    [1, 2, 3].forEach(function (L) {
      var x = X(trail.cumLen[sampleAt(L)] / trail.totalLen);
      laps += '<line class="p-lap" x1="' + x.toFixed(1) + '" x2="' + x.toFixed(1) + '" y1="' + (compact ? 2 : 6) + '" y2="' + (h - 4) + '"/>';
    });
    if (!compact) {
      var marks = [[0, "LAP 1"], [1, "LAP 2"], [2, "LAP 3"], [3, "TOP"]];
      marks.forEach(function (m) {
        var x = X(trail.cumLen[sampleAt(m[0])] / trail.totalLen) + 6;
        laps += '<text class="p-lap-label" x="' + x.toFixed(1) + '" y="15">' + m[1] + "</text>";
      });
    }

    prof.stopX = [];
    var dots = stops.map(function (st) {
      var x = X(st.arc), y = Y(trail.ys[st.sample]);
      prof.stopX.push(x);
      return '<circle class="p-stop" data-n="' + st.n + '" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (compact ? 3.2 : 4.2) + '" fill="' + st.hex + '"/>';
    }).join("");

    profileEl.innerHTML =
      '<svg xmlns="' + svgNS + '" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + " " + h + '" aria-hidden="true">' +
      '<defs><linearGradient id="pgrad" x1="' + X(0) + '" x2="' + X(1) + '" y1="0" y2="0" gradientUnits="userSpaceOnUse">' + stopsG + "</linearGradient></defs>" +
      laps +
      '<path d="' + area + '" fill="url(#pgrad)" opacity="0.92"/>' +
      '<path class="p-line" d="' + line + '"/>' +
      '<line class="p-here" id="pHere" x1="0" x2="0" y1="' + (compact ? 2 : 6) + '" y2="' + (h - 4) + '"/>' +
      dots +
      (youStop ? (function () {
        var yx = X(youStop.arc), yy = Y(trail.ys[youStop.sample]) - (compact ? 5 : 8);
        return '<path class="p-you" d="M' + (yx - 5).toFixed(1) + "," + (yy - 8).toFixed(1) + " L" + (yx + 5).toFixed(1) + "," + (yy - 8).toFixed(1) + " L" + yx.toFixed(1) + "," + yy.toFixed(1) + ' Z"/>';
      })() : "") +
      '<circle class="p-climber" id="pClimber" r="' + (compact ? 4 : 5) + '" cx="0" cy="0"/>' +
      "</svg>";
    prof.here = document.getElementById("pHere");
    prof.climber = document.getElementById("pClimber");
    prof.dots = Array.prototype.slice.call(profileEl.querySelectorAll(".p-stop"));
    prof.lastArc = -1;
    prof.lastActive = -2;
  }

  function nearestStopX(x) {
    var best = -1, bd = Infinity;
    prof.stopX.forEach(function (sx, i) { var d = Math.abs(sx - x); if (d < bd) { bd = d; best = i; } });
    return { i: best, d: bd };
  }
  profileEl.addEventListener("pointermove", function (e) {
    if (!prof.stopX.length) return;
    var rect = profileEl.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var hit = nearestStopX(x);
    if (hit.i < 0 || hit.d > 16) { tipEl.hidden = true; return; }
    var st = stops[hit.i];
    showTip("<b>Stop " + st.n + " · " + esc(st.data.title) + "</b>" + esc(st.place), e.clientX, e.clientY, true);
  });
  profileEl.addEventListener("pointerleave", function () { tipEl.hidden = true; });
  profileEl.addEventListener("click", function (e) {
    var rect = profileEl.getBoundingClientRect();
    var hit = nearestStopX(e.clientX - rect.left);
    if (hit.i >= 0) goToStop(stops[hit.i].n);
  });

  function updateProfile(arc, activeIdx) {
    if (!prof.here) return;
    if (Math.abs(arc - prof.lastArc) > 0.0005) {
      prof.lastArc = arc;
      var x = prof.X(arc);
      var c = costToSample(arc);
      prof.here.setAttribute("x1", x.toFixed(1)); prof.here.setAttribute("x2", x.toFixed(1));
      prof.climber.setAttribute("cx", x.toFixed(1)); prof.climber.setAttribute("cy", prof.Y(trail.ys[c]).toFixed(1));
    }
    if (activeIdx !== prof.lastActive) {
      prof.lastActive = activeIdx;
      prof.dots.forEach(function (d, i) {
        var on = i === activeIdx;
        d.classList.toggle("on", on);
        d.setAttribute("r", on ? 7 : (prof.h < 70 ? 3.2 : 4.2));
      });
    }
  }
  function costToSample(arc) {
    var target = arc * trail.totalLen, lo = 0, hi = NS - 1;
    while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (trail.cumLen[mid] <= target) lo = mid; else hi = mid; }
    return lo;
  }

  /* ------------------------------------------------------------------ */
  /* Tooltip                                                             */
  /* ------------------------------------------------------------------ */

  function showTip(html, clientX, clientY, above) {
    var rect = stageEl.getBoundingClientRect();
    tipEl.innerHTML = html;
    tipEl.hidden = false;
    var tw = tipEl.offsetWidth, th = tipEl.offsetHeight;
    var x = clientX - rect.left, y = clientY - rect.top;
    var tx = clamp(x + 14, 8, rect.width - tw - 8);
    var ty = above ? clamp(y - th - 14, 8, rect.height - th - 8) : clamp(y + 16, 8, rect.height - th - 8);
    tipEl.style.transform = "translate(" + tx + "px," + ty + "px)";
  }

  /* ------------------------------------------------------------------ */
  /* Scroll: the page is the climb                                       */
  /* ------------------------------------------------------------------ */

  var activeSec = -1, scrollDirty = true;
  var climbCost = 0, climbTarget = 0;
  var tagKicker = document.getElementById("tagKicker");
  var tagTitle = document.getElementById("tagTitle");
  var prevBtn = document.getElementById("prevStop"), nextBtn = document.getElementById("nextStop");
  var stageWrap = document.querySelector(".stage-wrap");

  window.addEventListener("scroll", function () { scrollDirty = true; }, { passive: true });

  function isNarrow() { return window.innerWidth <= 900; }

  function updateScroll() {
    if (!sections.length) return;
    var vh = window.innerHeight, thr;
    if (isNarrow()) {
      var sh = stageWrap.getBoundingClientRect().height;
      thr = sh + (vh - sh) * 0.3;
    } else thr = vh * 0.46;
    var act = 0;
    for (var s = 0; s < sections.length; s++) {
      if (sections[s].el.getBoundingClientRect().top < thr) act = s; else break;
    }
    var sec = sections[act];
    var r = sec.el.getBoundingClientRect();
    var t = clamp((thr - r.top) / Math.max(1, r.height), 0, 1);

    if (sec.kind === "intro") {
      baseMode = "overview";
      climbTarget = 0;
    } else if (sec.kind === "outro") {
      baseMode = "above";
      climbTarget = trail.totalCost;
    } else {
      var st = sec.stop;
      var next = stops[st.n];
      baseMode = st.kind === "summit" ? "above" : "follow";
      climbTarget = next ? st.cost + (next.cost - st.cost) * smooth(0.55, 1.0, t) : st.cost;
    }

    if (act !== activeSec) {
      activeSec = act;
      viewOverride = null;
      setViewButtons();
      sections.forEach(function (x, i) {
        if (x.kind !== "stop") return;
        x.el.classList.toggle("active", i === act);
        x.el.classList.toggle("passed", i < act);
      });
      if (sec.kind === "intro") {
        tagKicker.textContent = "The whole trail";
        tagTitle.textContent = stops.length + " stops, 3 laps, 1 summit";
      } else if (sec.kind === "outro") {
        tagKicker.textContent = "Seen from above";
        tagTitle.textContent = "Every lap circled the same center";
      } else {
        tagKicker.textContent = "Stop " + sec.stop.n + " of " + stops.length + " · " + sec.stop.place;
        tagTitle.textContent = sec.stop.data.title;
      }
      prevBtn.disabled = act === 0;
      measureTag();
      nextBtn.disabled = act === sections.length - 1;
      if (hereLabel) {
        if (sec.kind === "stop" && sec.stop.kind !== "summit") {
          hereLabel.el.innerHTML = '<b style="--c: ' + sec.stop.hex + '">' + sec.stop.n + "</b>" + esc(sec.stop.data.title);
          hereLabel.w = hereLabel.el.offsetWidth;
          hereLabel.stop = sec.stop;
        } else {
          hereLabel.stop = null;
        }
      }
      maybeNudge();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Pointer on the mountain                                             */
  /* ------------------------------------------------------------------ */

  var pointers = new Map();
  var drag = null, pinchDist = 0, moved = 0;
  var hoverXY = null, hoverDirty = false;
  var raycaster = hasGL ? new THREE.Raycaster() : null;
  var ndc = hasGL ? new THREE.Vector2() : null;
  var v3 = hasGL ? new THREE.Vector3() : null;

  function localXY(e) {
    var rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top, cx: e.clientX, cy: e.clientY };
  }

  if (hasGL) {
    canvas.addEventListener("pointerdown", function (e) {
      canvas.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, localXY(e));
      moved = 0;
      if (pointers.size === 1) drag = localXY(e);
      if (pointers.size === 2) {
        var ps = Array.from(pointers.values());
        pinchDist = Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y);
      }
    });
    canvas.addEventListener("pointermove", function (e) {
      var p = localXY(e);
      if (pointers.has(e.pointerId)) {
        var prev = pointers.get(e.pointerId);
        pointers.set(e.pointerId, p);
        if (pointers.size === 2) {
          var ps = Array.from(pointers.values());
          var dd = Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y);
          if (pinchDist > 0) goal.radius = clamp(goal.radius * pinchDist / dd, 3.2, 10);
          pinchDist = dd;
          moved += 10;
          lastInteract = performance.now();
        } else if (drag) {
          var dx = p.x - prev.x, dy = p.y - prev.y;
          moved += Math.abs(dx) + Math.abs(dy);
          if (moved > 4) {
            canvas.classList.add("dragging");
            goal.theta -= dx * 0.0065;
            goal.phi = clamp(goal.phi - dy * 0.005, 0.02, 1.38);
            lastInteract = performance.now();
            tipEl.hidden = true;
          }
        }
        return;
      }
      if (e.pointerType === "mouse") { hoverXY = p; hoverDirty = true; }
    });
    var endPointer = function (e) {
      var wasDrag = moved > 4;
      var p = localXY(e);
      pointers.delete(e.pointerId);
      if (pointers.size === 0) { drag = null; canvas.classList.remove("dragging"); }
      if (!wasDrag && e.type === "pointerup") handleClick(p);
    };
    canvas.addEventListener("pointerup", endPointer);
    canvas.addEventListener("pointercancel", endPointer);
    canvas.addEventListener("pointerleave", function () { hoverXY = null; tipEl.hidden = true; canvas.classList.remove("pointing"); });
    canvas.addEventListener("wheel", function (e) {
      if (!e.ctrlKey) return;
      e.preventDefault();
      goal.radius = clamp(goal.radius * Math.exp(e.deltaY * 0.0012), 3.2, 10);
      lastInteract = performance.now();
    }, { passive: false });
  }

  function terrainHit(x, y) {
    ndc.set((x / width) * 2 - 1, -(y / height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    var o = raycaster.ray.origin, d = raycaster.ray.direction;
    var step = 0.02, t = 0;
    for (var s = 0; s < 1200; s++) {
      t += step;
      var px = o.x + d.x * t, py = o.y + d.y * t, pz = o.z + d.z * t;
      if (py < -0.2) return null;
      if (Math.abs(px) > EXT || Math.abs(pz) > EXT) { if (t > 4 && py < 0.4) return null; continue; }
      if (py <= worldY(px, -pz)) {
        var lo = t - step, hi = t;
        for (var b = 0; b < 10; b++) {
          var m = (lo + hi) / 2;
          if (o.y + d.y * m <= worldY(o.x + d.x * m, -(o.z + d.z * m))) hi = m; else lo = m;
        }
        return { x: o.x + d.x * hi, y: o.y + d.y * hi, z: o.z + d.z * hi, t: hi };
      }
    }
    return null;
  }

  function pinAt(x, y) {
    var best = null, bestD = 16;
    stops.forEach(function (st) {
      if (!st.top) return;
      v3.copy(st.top).project(camera);
      if (v3.z > 1) return;
      var sx = (v3.x * 0.5 + 0.5) * width, sy = (-v3.y * 0.5 + 0.5) * height;
      var dd = Math.hypot(sx - x, sy - y);
      if (dd < bestD) {
        var hit = terrainHit(sx, sy);
        if (hit && hit.t < camera.position.distanceTo(st.top) - 0.08) return;
        best = st; bestD = dd;
      }
    });
    return best;
  }

  function handleClick(p) {
    var st = pinAt(p.x, p.y);
    if (st) goToStop(st.n);
  }

  function updateHover() {
    if (!hoverXY || drag) return;
    var st = pinAt(hoverXY.x, hoverXY.y);
    if (st) {
      canvas.classList.add("pointing");
      showTip("<b>Stop " + st.n + " · " + esc(st.data.title) + "</b>" + esc(st.place) + " · click to read", hoverXY.cx, hoverXY.cy, false);
      return;
    }
    canvas.classList.remove("pointing");
    var hit = terrainHit(hoverXY.x, hoverXY.y);
    if (hit && Math.hypot(hit.x, hit.z) < 1.55) {
      var m = maskAt(hit.x, -hit.z);
      showTip("<b>" + esc(ZONES[m]) + "</b>" + esc(zoneWords(m)), hoverXY.cx, hoverXY.cy, false);
    } else {
      tipEl.hidden = true;
    }
  }

  /* ------------------------------------------------------------------ */
  /* Loop                                                                */
  /* ------------------------------------------------------------------ */

  function placeClimber(cost) {
    var cc = trail.cumCost, lo = 0, hi = NS - 1;
    while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (cc[mid] <= cost) lo = mid; else hi = mid; }
    var span = cc[hi] - cc[lo];
    var t = span > 0 ? clamp((cost - cc[lo]) / span, 0, 1) : 0;
    var arc = (trail.cumLen[lo] + (trail.cumLen[hi] - trail.cumLen[lo]) * t) / trail.totalLen;
    if (hasGL) {
      var p = trail.curve.getPointAt(clamp(arc, 0, 1));
      climber.position.set(p.x, p.y + 0.03, p.z);
      trailUniforms.uProg.value = arc;
    }
    return arc;
  }

  function updateLabels() {
    var cx = camera.position.x, cz = camera.position.z, cl = Math.hypot(cx, cz) || 1;
    cx /= cl; cz /= cl;
    var topness = 1 - smooth(0.15, 0.6, cam.phi);
    for (var i = 0; i < labels.length; i++) {
      var L = labels[i];
      v3.copy(L.pos).project(camera);
      if (v3.z > 1) { L.el.style.opacity = 0; continue; }
      var x = (v3.x * 0.5 + 0.5) * width, y = (-v3.y * 0.5 + 0.5) * height;
      var half = (L.w || 0) / 2 + 8;
      x = clamp(x, half, Math.max(half, width - half));
      var face = L.always ? 1 : clamp((L.dir.x * cx + L.dir.z * cz + 0.3) / 0.55, 0, 1);
      var op = Math.max(face, topness);
      if (overTag(x, y, L.w || 0, L.h || 22)) op *= 0.1;
      L.el.style.opacity = op.toFixed(3);
      L.el.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) translate(-50%,-50%)";
    }
    if (hereLabel) {
      var st = hereLabel.stop;
      if (!st || !st.top) { hereLabel.el.style.opacity = 0; return; }
      v3.copy(st.top).project(camera);
      var hx = (v3.x * 0.5 + 0.5) * width, hy = (-v3.y * 0.5 + 0.5) * height;
      var hh = (hereLabel.w || 0) / 2 + 8;
      hx = clamp(hx, hh, Math.max(hh, width - hh));
      hereLabel.el.style.opacity = v3.z > 1 ? 0 : 1;
      hereLabel.el.style.transform = "translate(" + hx.toFixed(1) + "px," + hy.toFixed(1) + "px) translate(-50%,-150%)";
    }
  }

  var last = performance.now();
  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (scrollDirty) { scrollDirty = false; updateScroll(); }

    var diff = climbTarget - climbCost;
    if (reduceMotion) climbCost = climbTarget;
    else {
      var maxStep = dt * Math.max(trail.totalCost / 20, Math.abs(diff) * 2.6);
      climbCost += Math.sign(diff) * Math.min(Math.abs(diff), maxStep);
    }
    var arc = placeClimber(climbCost);
    updateProfile(arc, activeSec - 1);

    if (hasGL) {
      flag.visible = climbCost >= trail.totalCost - 1e-4;
      var mode = effectiveMode();
      var idle = now - lastInteract;
      if (mode === "follow") {
        if (idle > 2500) {
          var az = Math.atan2(climber.position.x, climber.position.z) + 0.3;
          goal.theta = cam.theta + wrapPi(az - cam.theta);
          goal.phi = 0.98;
          goal.radius = isNarrow() ? 6.0 : 4.7;
          goal.ty = 0.25 + climber.position.y * 0.6;
        }
      } else if (mode === "above") {
        if (idle > 2500) {
          goal.phi = 0.02;
          goal.theta = cam.theta - wrapPi(cam.theta);
          goal.radius = 5.7;
          goal.ty = 0.4;
        }
      } else {
        if (idle > 2500) {
          goal.phi = 1.04;
          goal.radius = 6.3;
          goal.ty = 0.5;
          if (!reduceMotion && idle > 4000) goal.theta += dt * 0.07;
        }
      }

      var f = 1 - Math.exp(-dt * (mode === "follow" ? 2.4 : 3.2));
      if (reduceMotion) f = 1;
      cam.theta += (goal.theta - cam.theta) * f;
      cam.phi += (goal.phi - cam.phi) * f;
      cam.radius += (goal.radius - cam.radius) * f;
      cam.ty += (goal.ty - cam.ty) * f;
      applyCamera();

      halo.material.opacity = 0.75 + (reduceMotion ? 0 : 0.25 * Math.sin(now * 0.004));
      var activeStop = sections[activeSec] && sections[activeSec].stop;
      stops.forEach(function (st) {
        if (!st.head) return;
        var on = st === activeStop;
        var s = on ? 1.5 + (reduceMotion ? 0 : 0.12 * Math.sin(now * 0.006)) : 1;
        st.head.scale.setScalar(s);
        st.ring.scale.setScalar(s);
      });

      renderer.render(scene, camera);
      updateLabels();
      updateYou(now);
      if (hoverDirty) { hoverDirty = false; updateHover(); }
    }
    requestAnimationFrame(frame);
  }

  /* ------------------------------------------------------------------ */
  /* Trail journal: questions, saved answers, a reading                  */
  /* ------------------------------------------------------------------ */

  var JOURNAL_STEPS = [
    { key: "love", face: "The north face", name: "What you love", label: "Love", css: "var(--love)",
      intro: "Start with what pulls you. Answer from your actual week, not the one you wish you had.",
      qs: [
        { id: "love_scale", type: "scale", label: "How much of your week goes to things you genuinely love?", lo: "Almost none", hi: "Most of it" },
        { id: "love_hours", type: "text", label: "What could you do for hours without noticing the time?", hint: "Be specific: “fixing old bikes,” not “being creative.”" },
        { id: "love_before", type: "text", label: "What did you love doing before anyone told you what you should do?" }
      ] },
    { key: "good", face: "The west face", name: "What you're good at", label: "Good at", css: "var(--good)",
      intro: "Now the craft. What can you actually do, and what are you still learning?",
      qs: [
        { id: "good_scale", type: "scale", label: "How confident are you in the skills you use most?", lo: "Still clumsy", hi: "Very confident" },
        { id: "good_asked", type: "text", label: "What do people come to you for help with?" },
        { id: "good_growing", type: "text", label: "What skill are you still clumsy at, but really want?" }
      ] },
    { key: "needs", face: "The east face", name: "What the world needs", label: "World needs", css: "var(--needs)",
      intro: "Look outward. What would be a little better because you showed up?",
      qs: [
        { id: "needs_scale", type: "scale", label: "How connected does your work feel to a need you care about?", lo: "Not at all", hi: "Deeply" },
        { id: "needs_problem", type: "text", label: "What problem do you notice that other people seem to walk past?" },
        { id: "needs_who", type: "text", label: "Who do you most want to help, and with what?" }
      ] },
    { key: "paid", face: "The south face", name: "What you can be paid for", label: "Paid for", css: "var(--paid)",
      intro: "Be honest about money. It's one of the four faces for a reason.",
      qs: [
        { id: "paid_scale", type: "scale", label: "How secure do you feel about money right now?", lo: "Very stretched", hi: "Very secure" },
        { id: "paid_now", type: "text", label: "What do you get paid for today, and how do you feel about it?" },
        { id: "paid_ask", type: "text", label: "What would you charge for if you weren't afraid to ask?" }
      ] },
    { key: "climb", face: "The climb", name: "Where you are now", label: "The climb", css: "var(--summit)",
      intro: "Last part. Look at the whole mountain and be honest about where you're standing.",
      qs: [
        { id: "climb_stop", type: "stop", label: "Which stop sounds most like you right now?", hint: "Pick the one that stings a little. “Not sure” is fine too." },
        { id: "climb_voice", type: "text", label: "What's the voice in your head that keeps you where you are?", hint: "Write the sentence the way it sounds in your head." },
        { id: "climb_year", type: "text", label: "If the next year went well, what would be different?" }
      ] }
  ];
  var ALL_QS = [];
  JOURNAL_STEPS.forEach(function (s) { s.qs.forEach(function (q) { ALL_QS.push(q); }); });
  var CIRCLE_KEYS = ["love", "good", "needs", "paid"];
  var CIRCLE_NAMES = { love: "What you love", good: "What you're good at", needs: "What the world needs", paid: "What you can be paid for" };
  var CIRCLE_CSS = { love: "var(--love)", good: "var(--good)", needs: "var(--needs)", paid: "var(--paid)" };

  var portalEl = document.getElementById("portal");
  var portalBody = document.getElementById("portalBody");
  var portalSteps = document.getElementById("portalSteps");
  var saveStatusEl = document.getElementById("saveStatus");
  var jBack = document.getElementById("jBack");
  var jNext = document.getElementById("jNext");
  var lastReadingEl = document.getElementById("lastReading");

  var J = { ready: false, db: null, uid: null, sample: null, saveTimer: null, saving: false, again: false, opener: null };
  var journal = { answers: {}, step: 0 };
  var entries = [];          // saved readings, newest first
  var localEntries = [];     // readings kept for this visit when saving isn't possible
  var viewing = null;        // the reading on screen
  var portalStep = 0;        // 0 welcome, 1-5 sections, 6 reading
  var reading = { busy: false, ctl: null, error: "" };
  var confirmFresh = false, confirmDelete = null;
  var youStop = null;

  function allEntries() { return localEntries.concat(entries); }
  function sameEntry(a, b) { return a === b || (!!a && !!b && a.createdAt === b.createdAt); }
  var readyWaiters = [];
  function whenReady(fn) { if (J.ready) fn(); else readyWaiters.push(fn); }
  function latestEntry() { var a = allEntries(); return a.length ? a[0] : null; }
  function stopById(id) { for (var i = 0; i < stops.length; i++) if (stops[i].id === id) return stops[i]; return null; }
  function answered(q) {
    var v = journal.answers[q.id];
    if (q.type === "scale") return typeof v === "number";
    if (q.type === "stop") return !!v;
    return typeof v === "string" && v.trim().length > 0;
  }
  function countAnswered() { return ALL_QS.filter(answered).length; }
  function fmtDate(iso) {
    try { return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }); }
    catch (e) { return ""; }
  }
  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }

  /* ---------- Saving ---------- */

  function draftRef() { return J.db.doc("data/users/" + J.uid + "/journal"); }
  function entriesRef() { return draftRef().collection("entries"); }

  function setStatus(text) { saveStatusEl.textContent = text; }
  function baseStatus() {
    if (!J.ready) return "Checking whether answers can be saved…";
    if (J.db) return "Saved in this browser only";
    return "Not saved: this browser isn't allowing it, so answers last until you close the page";
  }

  function scheduleSave() {
    if (!J.db) { setStatus(baseStatus()); return; }
    setStatus("Saving…");
    clearTimeout(J.saveTimer);
    J.saveTimer = setTimeout(saveDraft, 800);
  }
  function saveDraft() {
    if (!J.db) return;
    if (J.saving) { J.again = true; return; }
    J.saving = true;
    var body = { answers: JSON.parse(JSON.stringify(journal.answers)), step: portalStep, updatedAt: new Date().toISOString() };
    draftRef().set(body).then(function () {
      setStatus("Saved in this browser only");
    }, function (e) {
      var code = e && e.code;
      if (code === "invalid_argument" || code === "revoked" || code === "not_granted") {
        J.db = null;
        setStatus("Your access to this page doesn't allow saving, so answers last until you close it");
      } else if (code === "quota_exceeded") {
        setStatus("This browser's storage is full. Delete an old reading to save again.");
      } else {
        setStatus("Couldn't save just now. Your answers are still here.");
      }
    }).then(function () {
      J.saving = false;
      if (J.again) { J.again = false; saveDraft(); }
    });
  }

  /* ---------- Saving in this browser ---------- */

  // A small store with the same shape the journal uses, kept in localStorage.
  // Nothing here ever leaves the visitor's browser.
  function makeLocalDb() {
    var KEY_DRAFT = "ikigai-mountain:journal";
    var KEY_READINGS = "ikigai-mountain:readings";
    var MAX_READINGS = 40;
    try {
      localStorage.setItem("ikigai-mountain:probe", "1");
      localStorage.removeItem("ikigai-mountain:probe");
    } catch (e) { return null; }

    function read(key, fallback) {
      try { var raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
      catch (e) { return fallback; }
    }
    function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
    function failure(e) {
      var full = e && (e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED" || e.code === 22);
      return { code: full ? "quota_exceeded" : "unavailable" };
    }
    function newestFirst(a, b) {
      return String(b.data && b.data.createdAt).localeCompare(String(a.data && a.data.createdAt));
    }
    function readings() {
      var list = read(KEY_READINGS, []);
      return Array.isArray(list) ? list.filter(function (x) { return x && x.id && x.data; }) : [];
    }

    var listeners = [];
    function snapshot() {
      var list = readings().sort(newestFirst);
      return { docs: list.map(function (x) { return { id: x.id, exists: true, data: function () { return x.data; } }; }) };
    }
    function emit() { var s = snapshot(); listeners.forEach(function (fn) { fn(s); }); }
    // Keep two open tabs in step.
    window.addEventListener("storage", function (e) { if (e.key === KEY_READINGS) emit(); });

    var readingsRef = {
      orderBy: function () { return readingsRef; },
      limit: function () { return readingsRef; },
      onSnapshot: function (fn) {
        listeners.push(fn);
        setTimeout(function () { fn(snapshot()); }, 0);
        return function () { listeners = listeners.filter(function (x) { return x !== fn; }); };
      },
      add: function (data) {
        return new Promise(function (resolve, reject) {
          try {
            var id = "r" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
            var list = readings();
            list.push({ id: id, data: data });
            list.sort(newestFirst);
            write(KEY_READINGS, list.slice(0, MAX_READINGS));
            resolve({ id: id });
            setTimeout(emit, 0);
          } catch (e) { reject(failure(e)); }
        });
      },
      doc: function (id) {
        return {
          delete: function () {
            return new Promise(function (resolve, reject) {
              try {
                write(KEY_READINGS, readings().filter(function (x) { return x.id !== id; }));
                resolve();
                setTimeout(emit, 0);
              } catch (e) { reject(failure(e)); }
            });
          }
        };
      }
    };
    var draft = {
      get: function () {
        var d = read(KEY_DRAFT, null);
        return Promise.resolve({ exists: !!d, data: function () { return d || undefined; } });
      },
      set: function (body) {
        return new Promise(function (resolve, reject) {
          try { write(KEY_DRAFT, body); resolve(); } catch (e) { reject(failure(e)); }
        });
      },
      collection: function () { return readingsRef; }
    };
    return { doc: function () { return draft; } };
  }

  Promise.resolve().then(function connectStore() {
    var db = makeLocalDb();
    J.sample = null;
    if (!db) { finishInit(); return; }
    J.db = db; J.uid = "local";
    var typedBefore = Object.keys(journal.answers).length > 0;
    draftRef().get().then(function (snap) {
      if (snap.exists && !typedBefore) {
        var d = snap.data() || {};
        journal.answers = JSON.parse(JSON.stringify(d.answers || {}));
      }
      finishInit();
    }, function () { finishInit(); });
    entriesRef().orderBy("createdAt", "desc").limit(40).onSnapshot(function (snap) {
      entries = snap.docs.map(function (d) { var x = d.data(); return { id: d.id, createdAt: x.createdAt, reading: x.reading, source: x.source }; })
        .filter(function (x) { return x.reading && x.reading.stopId; });
      if (viewing && viewing.id && !entries.some(function (x) { return x.id === viewing.id; }) && localEntries.indexOf(viewing) < 0) viewing = null;
      else if (viewing) entries.forEach(function (x) { if (sameEntry(x, viewing)) viewing = x; });
      onEntriesChanged();
    });
  }).catch(function () { finishInit(); });

  function finishInit() {
    if (J.ready) return;
    J.ready = true;
    setStatus(baseStatus());
    readyWaiters.splice(0).forEach(function (fn) { fn(); });
    if (!portalEl.hidden) renderPortal();
    onEntriesChanged();
  }
  // If the viewer never answers, carry on without saving.
  setTimeout(function () { if (!J.ready) finishInit(); }, 12000);

  function onEntriesChanged() {
    var latest = latestEntry();
    if (!viewing && latest && portalStep === 6 && !reading.busy) viewing = latest;
    applyYouBadges();
    drawProfile();
    renderLastReading();
    if (!portalEl.hidden && (portalStep === 0 || portalStep === 6)) renderPortal();
  }

  /* ---------- "You are here" on the page ---------- */

  function applyYouBadges() {
    var latest = latestEntry();
    youStop = latest ? stopById(latest.reading.stopId) : null;
    Array.prototype.forEach.call(document.querySelectorAll(".stop.is-you"), function (n) { n.classList.remove("is-you"); });
    if (youStop) {
      var li = document.getElementById("stop-" + youStop.n);
      if (li) li.classList.add("is-you");
    }
    if (hasGL && youGroup) {
      youGroup.visible = !!youStop;
      if (youStop) {
        if (youStop.kind === "summit") youGroup.position.set(0, worldY(0, 0) + 0.01, 0);
        else youGroup.position.set(youStop.top.x, youStop.top.y - 0.105, youStop.top.z);
      }
    }
  }

  function renderLastReading() {
    var latest = latestEntry();
    var st = latest ? stopById(latest.reading.stopId) : null;
    if (!st) { lastReadingEl.hidden = true; return; }
    lastReadingEl.hidden = false;
    lastReadingEl.innerHTML = "";
    var span = document.createElement("span");
    span.innerHTML = "Your last reading put you at <b></b>.";
    span.querySelector("b").textContent = "Stop " + st.n + ", " + st.data.title;
    var go = el('<button type="button" class="linkish">Go there</button>');
    go.addEventListener("click", function () { goToStop(st.n); });
    var open = el('<button type="button" class="linkish">Open the reading</button>');
    open.addEventListener("click", function (e) { viewing = latest; openPortal(6, e.currentTarget); });
    lastReadingEl.append(span, go, open);
  }

  var youGroup = null, youPulse = null, youLabel = null;
  if (hasGL) {
    youGroup = new THREE.Group();
    var ringMat = new THREE.MeshBasicMaterial({ color: 0xffc75f });
    var ring = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.01, 8, 48), ringMat);
    ring.rotation.x = -Math.PI / 2;
    var pulseMat = new THREE.MeshBasicMaterial({ color: 0xffc75f, transparent: true, opacity: 0.5, depthWrite: false });
    youPulse = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.006, 8, 48), pulseMat);
    youPulse.rotation.x = -Math.PI / 2;
    youPulse.renderOrder = 11;
    youGroup.add(ring, youPulse);
    youGroup.visible = false;
    scene.add(youGroup);
    youLabel = document.createElement("div");
    youLabel.className = "lbl lbl-you";
    youLabel.textContent = "You are here";
    youLabel.style.opacity = 0;
    labelsEl.appendChild(youLabel);
  }

  function updateYou(now) {
    if (!youGroup) return;
    if (!youStop) { youLabel.style.opacity = 0; return; }
    var t = reduceMotion ? 0.5 : (now % 1800) / 1800;
    var s = 1 + t * 1.6;
    youPulse.scale.set(s, s, s);
    youPulse.material.opacity = 0.55 * (1 - t);
    v3.copy(youGroup.position).project(camera);
    if (v3.z > 1) { youLabel.style.opacity = 0; return; }
    var x = (v3.x * 0.5 + 0.5) * width, y = (-v3.y * 0.5 + 0.5) * height;
    x = clamp(x, 60, Math.max(60, width - 60));
    youLabel.style.opacity = 1;
    youLabel.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) translate(-50%, 55%)";
  }

  /* ---------- Opening and closing ---------- */

  function openPortal(step, opener) {
    J.opener = opener || document.activeElement;
    if (typeof step === "number") portalStep = step;
    else portalStep = 0;
    if (portalStep === 6 && !viewing) viewing = latestEntry();
    confirmFresh = false; confirmDelete = null;
    portalEl.hidden = false;
    document.documentElement.style.overflow = "hidden";
    renderPortal();
    setStatus(baseStatus());
    var t = document.getElementById("portalTitle");
    if (t) t.focus();
  }
  function closePortal() {
    portalEl.hidden = true;
    document.documentElement.style.overflow = "";
    if (J.saveTimer) { clearTimeout(J.saveTimer); saveDraft(); }
    if (J.opener && J.opener.focus) J.opener.focus();
  }
  document.getElementById("portalClose").addEventListener("click", closePortal);
  portalEl.addEventListener("click", function (e) { if (e.target === portalEl) closePortal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !portalEl.hidden) closePortal(); });
  Array.prototype.forEach.call(document.querySelectorAll("[data-open-journal]"), function (b) {
    b.addEventListener("click", function (e) { openPortal(undefined, e.currentTarget); });
  });

  function goStep(n) {
    portalStep = clamp(n, 0, 6);
    confirmFresh = false; confirmDelete = null;
    if (portalStep === 6 && !viewing && !reading.busy) viewing = latestEntry();
    renderPortal();
    portalBody.scrollTop = 0;
    if (J.db) scheduleSave();
  }
  jBack.addEventListener("click", function () { goStep(portalStep - 1); });
  jNext.addEventListener("click", function () {
    if (portalStep === 5) { goStep(6); runReading(); return; }
    if (portalStep === 6) {
      var st = viewing ? stopById(viewing.reading.stopId) : null;
      if (st) { closePortal(); goToStop(st.n); }
      return;
    }
    goStep(portalStep + 1);
  });

  /* ---------- Rendering the portal ---------- */

  function renderPortal() {
    // Step bar
    portalSteps.innerHTML = "";
    JOURNAL_STEPS.concat([{ label: "Your reading", css: "var(--summit)" }]).forEach(function (s, i) {
      var n = i + 1;
      var b = document.createElement("button");
      b.type = "button";
      b.style.setProperty("--c", s.css);
      var done = n < 6 ? s.qs.some(answered) : !!latestEntry();
      if (done) b.classList.add("done");
      if (n === portalStep) b.setAttribute("aria-current", "step");
      b.innerHTML = "<span></span>";
      b.querySelector("span").textContent = s.label;
      b.setAttribute("aria-label", s.label);
      b.addEventListener("click", function () { goStep(n); });
      portalSteps.appendChild(b);
    });

    portalBody.innerHTML = "";
    if (portalStep === 0) renderWelcome();
    else if (portalStep <= 5) renderSection(JOURNAL_STEPS[portalStep - 1]);
    else renderReadingStep();

    jBack.hidden = portalStep === 0;
    jNext.hidden = false;
    jNext.disabled = false;
    if (portalStep === 0) jNext.textContent = countAnswered() ? "Continue" : "Begin";
    else if (portalStep < 5) jNext.textContent = "Next";
    else if (portalStep === 5) jNext.textContent = "Read my climb";
    else {
      jNext.textContent = "Show me on the mountain";
      jNext.hidden = !viewing || reading.busy;
    }
  }

  function renderWelcome() {
    var n = countAnswered();
    var latest = latestEntry();
    var latestStop = latest ? stopById(latest.reading.stopId) : null;
    var saveLine = !J.ready ? "Checking whether this browser can save your answers\u2026"
      : J.db ? "Your answers save in this browser as you type. Nothing is sent anywhere: there's no account and no server, so nobody else can read them. Clearing your browser data erases them."
      : "This browser isn't letting the page save (a private window can do that), so your answers last until you close the page.";
    var readLine = "When you finish, the journal places you at a stop on the mountain and shows your four circles, what stands out in your answers, your next stop and three steps for the next month.";

    var w = el('<div class="welcome"></div>');
    w.appendChild(el("<h3>Find where you are on the mountain</h3>"));
    w.appendChild(el("<p>Fifteen questions, one face at a time, then a reading. Most people take about ten minutes. There are no right answers, only honest ones, and you can skip anything.</p>"));
    var facts = el('<ul class="facts"></ul>');
    [saveLine, readLine, "Every reading is kept, so you can come back in a few months, answer again and see how far you've moved."].forEach(function (t) {
      var li = document.createElement("li"); li.textContent = t; facts.appendChild(li);
    });
    w.appendChild(facts);

    if (latestStop) {
      var p = el('<p class="last-reading"></p>');
      var s = document.createElement("span");
      s.innerHTML = "Last reading, <span></span>: <b></b>";
      s.querySelector("span").textContent = fmtDate(latest.createdAt);
      s.querySelector("b").textContent = "Stop " + latestStop.n + ", " + latestStop.data.title;
      var open = el('<button type="button" class="linkish">Open it</button>');
      open.addEventListener("click", function () { viewing = latest; goStep(6); });
      p.append(s, open);
      w.appendChild(p);
    }

    if (n > 0) {
      var row = el('<div class="row"></div>');
      var info = document.createElement("span");
      info.textContent = n + " of " + ALL_QS.length + " questions answered.";
      info.style.color = "var(--ink-soft)";
      row.appendChild(info);
      if (!confirmFresh) {
        var fresh = el('<button type="button" class="linkish">Start fresh</button>');
        fresh.addEventListener("click", function () { confirmFresh = true; renderPortal(); });
        row.appendChild(fresh);
      } else {
        var c = el('<span class="confirm">Clear every answer? Your saved readings stay. </span>');
        var yes = el('<button type="button" class="ghost">Clear answers</button>');
        var no = el('<button type="button" class="linkish">Keep them</button>');
        yes.addEventListener("click", function () { journal.answers = {}; confirmFresh = false; scheduleSave(); renderPortal(); });
        no.addEventListener("click", function () { confirmFresh = false; renderPortal(); });
        c.append(yes, no);
        row.appendChild(c);
      }
      w.appendChild(row);
    }
    portalBody.appendChild(w);
  }

  function renderSection(step) {
    var wrap = document.createElement("div");
    wrap.style.setProperty("--c", step.css);
    var head = el('<div class="j-head"><p class="j-face"><i></i><span></span></p><h3 class="j-title"></h3><p class="j-intro"></p></div>');
    head.querySelector("span").textContent = step.face;
    head.querySelector(".j-title").textContent = step.name;
    head.querySelector(".j-intro").textContent = step.intro;
    wrap.appendChild(head);

    step.qs.forEach(function (q) {
      var box = el('<div class="q"></div>');
      var fid = "q_" + q.id;
      if (q.type === "scale") {
        var lab = el('<span class="q-label"></span>');
        lab.id = fid + "_label";
        lab.textContent = q.label;
        box.appendChild(lab);
        var v = journal.answers[q.id];
        var row = el('<div class="scale"><input type="range" min="0" max="10" step="1"><span class="scale-val"></span></div>');
        var input = row.querySelector("input");
        var out = row.querySelector(".scale-val");
        input.id = fid;
        input.setAttribute("aria-labelledby", lab.id);
        input.value = typeof v === "number" ? v : 5;
        var paint = function () {
          var cur = journal.answers[q.id];
          row.classList.toggle("unset", typeof cur !== "number");
          if (typeof cur === "number") { out.textContent = cur + "/10"; out.classList.remove("unset"); input.setAttribute("aria-valuetext", cur + " out of 10"); }
          else { out.textContent = "—"; out.classList.add("unset"); input.setAttribute("aria-valuetext", "Not answered"); }
        };
        input.addEventListener("input", function () { journal.answers[q.id] = parseInt(input.value, 10); paint(); scheduleSave(); });
        paint();
        box.appendChild(row);
        var ends = el('<div class="scale-ends"><span></span><span></span></div>');
        ends.children[0].textContent = "0 · " + q.lo;
        ends.children[1].textContent = q.hi + " · 10";
        box.appendChild(ends);
      } else if (q.type === "stop") {
        var lab2 = el("<label></label>");
        lab2.setAttribute("for", fid);
        lab2.textContent = q.label;
        box.appendChild(lab2);
        if (q.hint) { var h2 = el('<p class="hint"></p>'); h2.textContent = q.hint; box.appendChild(h2); }
        var sel = document.createElement("select");
        sel.id = fid;
        var none = document.createElement("option"); none.value = ""; none.textContent = "Choose a stop"; sel.appendChild(none);
        var unsure = document.createElement("option"); unsure.value = "unsure"; unsure.textContent = "Not sure"; sel.appendChild(unsure);
        var groups = [["Trailhead", 0], ["Lap 1", 1], ["Lap 2", 2], ["Lap 3", 3], ["Final ascent", 4], ["Summit", 5]];
        groups.forEach(function (g) {
          var og = document.createElement("optgroup"); og.label = g[0];
          stops.filter(function (s) { return s.lap === g[1]; }).forEach(function (s) {
            var o = document.createElement("option");
            o.value = s.id;
            o.textContent = s.n + ". " + s.data.title + "  (" + s.place + ")";
            og.appendChild(o);
          });
          sel.appendChild(og);
        });
        sel.value = journal.answers[q.id] || "";
        sel.addEventListener("change", function () { journal.answers[q.id] = sel.value; scheduleSave(); });
        box.appendChild(sel);
      } else {
        var lab3 = el("<label></label>");
        lab3.setAttribute("for", fid);
        lab3.textContent = q.label;
        box.appendChild(lab3);
        if (q.hint) { var h3 = el('<p class="hint"></p>'); h3.textContent = q.hint; box.appendChild(h3); }
        var ta = document.createElement("textarea");
        ta.id = fid;
        ta.maxLength = 2000;
        ta.value = journal.answers[q.id] || "";
        ta.addEventListener("input", function () { journal.answers[q.id] = ta.value; scheduleSave(); });
        box.appendChild(ta);
      }
      wrap.appendChild(box);
    });
    portalBody.appendChild(wrap);
  }

  function renderReadingStep() {
    if (reading.busy) {
      var wk = el('<div class="working"><h3>Reading your climb…</h3>' +
        '<p>Looking at every answer to find where you’re standing.</p>' +
        '<svg viewBox="0 0 420 90" aria-hidden="true"><path class="w-path" d="M10 80 C 80 78, 90 50, 150 52 S 230 70, 260 40 S 340 30, 410 10"/>' +
        '<path class="w-walk" d="M10 80 C 80 78, 90 50, 150 52 S 230 70, 260 40 S 340 30, 410 10"/></svg></div>');
      var stop = el('<button type="button" class="ghost">Stop</button>');
      stop.addEventListener("click", function () { if (reading.ctl) reading.ctl.abort(); });
      wk.appendChild(stop);
      portalBody.appendChild(wk);
      return;
    }
    if (!viewing) {
      var n = countAnswered();
      var rd = el('<div class="ready"><h3></h3><p></p></div>');
      rd.querySelector("h3").textContent = n ? "Ready for your reading" : "Answer a few questions first";
      rd.querySelector("p").textContent = n
        ? "You've answered " + n + " of " + ALL_QS.length + " questions. The more you write, the more specific the reading can be."
        : "The reading is built from your answers. Start with the north face.";
      if (reading.error) { var er = el('<p class="error-note"></p>'); er.textContent = reading.error; rd.appendChild(er); }
      var go = el('<button type="button" class="cta"></button>');
      go.textContent = n ? "Read my climb" : "Go to the first question";
      go.addEventListener("click", function () { if (n) runReading(); else goStep(1); });
      rd.appendChild(go);
      portalBody.appendChild(rd);
      renderHistory();
      return;
    }
    renderReading(viewing);
    renderHistory();
  }

  function circleSvg(c) {
    var centers = { love: [100, 72], good: [72, 100], needs: [128, 100], paid: [100, 128] };
    var out = '<svg viewBox="0 0 200 200" role="img" aria-label="Your four circles, sized by strength">';
    CIRCLE_KEYS.forEach(function (k) {
      var r = 16 + clamp(Number(c[k]) || 0, 0, 10) * 4.4;
      out += '<circle cx="' + centers[k][0] + '" cy="' + centers[k][1] + '" r="' + r.toFixed(1) + '" fill="' + CIRCLE_CSS[k] + '" fill-opacity="0.34" stroke="' + CIRCLE_CSS[k] + '" stroke-width="2"/>';
    });
    out += '<circle cx="100" cy="100" r="3.5" fill="var(--ink)"/></svg>';
    return out;
  }

  function renderReading(entry) {
    var r = entry.reading;
    var st = stopById(r.stopId);
    var next = r.nextStopId ? stopById(r.nextStopId) : null;
    var box = el('<div class="reading"></div>');

    var kicker = el('<p class="r-kicker"></p>');
    kicker.textContent = "Your reading · " + fmtDate(entry.createdAt);
    box.appendChild(kicker);
    var title = el('<h3 class="r-title"></h3>');
    title.textContent = st ? "Stop " + st.n + ": " + st.data.title : "Your stop";
    box.appendChild(title);
    if (st) {
      var place = el('<p class="r-place"></p>');
      place.textContent = st.place + " · standing in " + ZONES[st.mask];
      box.appendChild(place);
    }
    if (r.why) { var why = el('<p class="r-why"></p>'); why.textContent = r.why; box.appendChild(why); }
    if (r.movement) { var mv = el('<p class="r-movement"></p>'); mv.textContent = r.movement; box.appendChild(mv); }
    if (r.care) {
      var care = el('<div class="care"><b>Before anything else</b><span></span></div>');
      care.querySelector("span").textContent = r.care;
      box.appendChild(care);
    }

    var circ = el('<div class="r-circles"></div>');
    circ.innerHTML = circleSvg(r.circles || {});
    var bars = el('<ul class="r-bars"></ul>');
    CIRCLE_KEYS.forEach(function (k) {
      var v = clamp(Math.round(Number((r.circles || {})[k]) || 0), 0, 10);
      var li = el('<li><span class="nm"><i></i><span></span></span><span class="val"></span><span class="bar"><b></b></span></li>');
      li.style.setProperty("--c", CIRCLE_CSS[k]);
      var label = CIRCLE_NAMES[k];
      li.querySelector(".nm span").textContent = label;
      if (r.strongest === k || r.growing === k) {
        var tag = el('<span class="tag"></span>');
        tag.textContent = r.strongest === k ? "strongest" : "needs attention";
        li.querySelector(".nm").appendChild(tag);
      }
      li.querySelector(".val").textContent = v + "/10";
      li.querySelector(".bar b").style.width = (v * 10) + "%";
      bars.appendChild(li);
    });
    circ.appendChild(bars);
    box.appendChild(circ);

    function block(label, node) {
      var b = el('<div class="r-block"><h4></h4></div>');
      b.querySelector("h4").textContent = label;
      b.appendChild(node);
      box.appendChild(b);
    }
    if (r.summary) { var p = document.createElement("p"); p.textContent = r.summary; block("Where you are", p); }
    if (r.voice) { var bq = document.createElement("blockquote"); bq.textContent = "“" + r.voice + "”"; block("The voice holding you here", bq); }
    if (r.patterns && r.patterns.length) {
      var ul = el('<ul class="r-list"></ul>');
      r.patterns.forEach(function (t) { var li = document.createElement("li"); li.appendChild(document.createElement("span")).textContent = t; ul.appendChild(li); });
      block("What showed up in your answers", ul);
    }
    if (next) {
      var nx = el('<div class="r-next"><b></b><button type="button" class="linkish">Read it</button></div>');
      nx.querySelector("b").textContent = "Stop " + next.n + ": " + next.data.title;
      nx.querySelector("button").addEventListener("click", function () { closePortal(); goToStop(next.n); });
      block("Your next stop", nx);
    }
    if (r.steps && r.steps.length) {
      var ol = el('<ol class="r-list"></ol>');
      r.steps.forEach(function (t) { var li = document.createElement("li"); li.appendChild(document.createElement("span")).textContent = t; ol.appendChild(li); });
      block("For the next month", ol);
    }
    if (r.question) { var q = el('<p class="r-carry"></p>'); q.textContent = r.question; box.appendChild(q); }
    if (r.note) {
      var src = el('<p class="r-source"></p>');
      src.textContent = r.note;
      box.appendChild(src);
    }
    if (reading.error) { var er = el('<p class="error-note"></p>'); er.textContent = reading.error; box.appendChild(er); }

    var actions = el('<div class="r-actions"></div>');
    if (st) {
      var show = el('<button type="button" class="cta">Show me on the mountain</button>');
      show.addEventListener("click", function () { closePortal(); goToStop(st.n); });
      actions.appendChild(show);
    }
    var again = el('<button type="button" class="ghost">Read again with my latest answers</button>');
    again.addEventListener("click", runReading);
    var edit = el('<button type="button" class="ghost">Change my answers</button>');
    edit.addEventListener("click", function () { goStep(1); });
    var talk = el('<a class="ghost" href="/book">Talk it through: book an hour</a>');
    actions.append(again, edit, talk);
    box.appendChild(actions);
    portalBody.appendChild(box);
  }

  function renderHistory() {
    var all = allEntries();
    if (!all.length) return;
    var h = el('<div class="history"><h4 style="margin:0 0 8px;font-size:11.5px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--ink-soft)">Your readings</h4><ol></ol></div>');
    var ol = h.querySelector("ol");
    all.forEach(function (entry) {
      var st = stopById(entry.reading.stopId);
      var li = document.createElement("li");
      if (sameEntry(entry, viewing)) li.classList.add("on");
      var open = el('<button type="button" class="h-open"><span class="h-date"></span><span class="h-stop"><span></span><span class="h-dots"></span></span></button>');
      open.querySelector(".h-date").textContent = fmtDate(entry.createdAt) ;
      open.querySelector(".h-stop span").textContent = st ? "Stop " + st.n + " · " + st.data.title : "A stop on an earlier trail";
      var dots = open.querySelector(".h-dots");
      CIRCLE_KEYS.forEach(function (k) {
        var v = clamp(Number((entry.reading.circles || {})[k]) || 0, 0, 10);
        var i = document.createElement("i");
        i.style.setProperty("--c", CIRCLE_CSS[k]);
        i.style.opacity = (0.2 + v / 12.5).toFixed(2);
        dots.appendChild(i);
      });
      open.addEventListener("click", function () { viewing = entry; reading.error = ""; renderPortal(); portalBody.scrollTop = 0; });
      li.appendChild(open);
      if (confirmDelete === entry) {
        var c = el('<span class="confirm"></span>');
        var yes = el('<button type="button" class="h-del">Delete</button>');
        var no = el('<button type="button" class="h-del">Keep</button>');
        yes.addEventListener("click", function () { deleteEntry(entry); });
        no.addEventListener("click", function () { confirmDelete = null; renderPortal(); });
        c.append(yes, no);
        li.appendChild(c);
      } else {
        var del = el('<button type="button" class="h-del">Delete</button>');
        del.setAttribute("aria-label", "Delete the reading from " + fmtDate(entry.createdAt));
        del.addEventListener("click", function () { confirmDelete = entry; renderPortal(); });
        li.appendChild(del);
      }
      ol.appendChild(li);
    });
    portalBody.appendChild(h);
  }

  function deleteEntry(entry) {
    confirmDelete = null;
    if (sameEntry(viewing, entry)) viewing = null;
    var li = localEntries.indexOf(entry);
    if (li >= 0) { localEntries.splice(li, 1); onEntriesChanged(); renderPortal(); return; }
    if (J.db && entry.id) {
      entriesRef().doc(entry.id).delete().catch(function () { setStatus("Couldn't delete that reading just now."); });
    }
    renderPortal();
  }

  /* ---------- The reading ---------- */

  function stopFromCircles(c) {
    var mask = 0;
    CIRCLE_KEYS.forEach(function (k, i) { if ((c[k] || 0) >= 6) mask |= 1 << i; });
    if (mask === 0) return "trailhead";
    if (mask === 15) return "false-summit";
    var single = { 1: "love-1", 2: "good-1", 4: "needs-1", 8: "paid-1" };
    if (single[mask]) return single[mask];
    var ridge = { 3: "passion-1", 5: "mission-1", 12: "vocation-1", 10: "profession-1" };
    if (ridge[mask]) return ridge[mask];
    var triple = { 7: "love-2", 11: "good-2", 13: "needs-2", 14: "paid-2" };
    if (triple[mask]) return triple[mask];
    // Opposite faces only (love + needs is a ridge; good + needs or love + paid are not neighbours)
    var best = CIRCLE_KEYS.slice().sort(function (a, b) { return (c[b] || 0) - (c[a] || 0); })[0];
    return best + "-1";
  }

  /* ---------- The reading, worked out in the browser ---------- */

  function hasText(v) { return typeof v === "string" && v.trim().length > 0; }
  function clip(s, max) {
    s = String(s).replace(/\s+/g, " ").trim().replace(/[.!?\s]+$/, "");
    if (s.length <= max) return s;
    var cut = s.slice(0, max);
    var sp = cut.lastIndexOf(" ");
    return (sp > max * 0.6 ? cut.slice(0, sp) : cut).replace(/[,;:\s]+$/, "") + "…";
  }
  function q(s) { return "“" + clip(s, 80) + "”"; }
  function lower(s) { return s.charAt(0).toLowerCase() + s.slice(1); }
  function firstSentences(text, n) {
    var parts = String(text).match(/[^.!?]+[.!?]+(\s|$)/g) || [text];
    return parts.slice(0, n).join("").trim();
  }
  function dayOf(iso) {
    try { return new Date(iso).toLocaleDateString(undefined, { month: "long", day: "numeric" }); }
    catch (e) { return "your last visit"; }
  }

  var GROW_STEPS = {
    love: function (a) {
      return hasText(a.love_hours)
        ? "Put one protected hour on your calendar this week for " + q(a.love_hours) + ", and treat it like a meeting you can't move."
        : "Put one protected hour on your calendar this week for the thing you'd do for free, and treat it like a meeting you can't move.";
    },
    good: function (a) {
      return hasText(a.good_growing)
        ? "Do twenty small reps of " + q(a.good_growing) + " this month. Count reps, not results."
        : "Pick one skill you want and do twenty small reps of it this month. Count reps, not results.";
    },
    needs: function (a) {
      return hasText(a.needs_problem)
        ? "Spend one hour this month close to " + q(a.needs_problem) + ". Volunteer, talk to someone who lives with it, or read their side of it."
        : "Spend one hour this month close to a problem you care about. Volunteer, talk to someone who lives with it, or read their side of it.";
    },
    paid: function (a) {
      return hasText(a.paid_ask)
        ? "Write down a real price for " + q(a.paid_ask) + " and say it out loud to one person this month."
        : "Write down the number you actually need to live on, then compare it with what you earn and spend now.";
    }
  };

  var CARE_WORDS = /suicid|kill myself|end my life|end it all|want to die|wanna die|self[- ]?harm|hurt myself|cutting myself|no reason to live|better off dead/;

  function quickReading() {
    var a = journal.answers;
    var c = {}, scored = [];
    CIRCLE_KEYS.forEach(function (k) {
      var v = a[k + "_scale"];
      if (typeof v === "number") { c[k] = v; scored.push(k); } else c[k] = 5;
    });

    var pick = a.climb_stop;
    var picked = !!(pick && pick !== "unsure" && stopById(pick));
    var scoreStop = stopById(stopFromCircles(c));
    var st = picked ? stopById(pick) : scoreStop;
    var sorted = CIRCLE_KEYS.slice().sort(function (x, y) { return c[y] - c[x]; });
    var strongest = sorted[0], growing = sorted[3];
    var gap = c[strongest] - c[growing];
    var has = function (k) { return !!(st.mask & (1 << CIRCLE_KEYS.indexOf(k))); };

    // Why this stop
    var why;
    if (picked) {
      why = "You picked this stop yourself, and the stop that stings is usually the right one.";
    } else {
      var highs = CIRCLE_KEYS.filter(function (k) { return c[k] >= 6; }).map(function (k) { return lower(CIRCLE_NAMES[k]); });
      if (!highs.length) why = "None of your circles scored above 5 yet, so you're near the start of the trail. That's where every climb begins.";
      else if (highs.length === 4) why = "All four circles scored 6 or higher. That puts you near the top, where the work is keeping them in balance.";
      else why = "You rated " + listJoin(highs, "and") + " at 6 or higher, and the rest lower. That puts you here.";
    }

    // Movement since last time
    var movement = "";
    var prev = latestEntry();
    var prevStop = prev ? stopById(prev.reading.stopId) : null;
    if (prevStop) {
      var moved = st.n - prevStop.n, when = dayOf(prev.createdAt);
      if (moved > 0) movement = "Since your reading on " + when + ", you've climbed " + moved + (moved === 1 ? " stop" : " stops") + ", up from Stop " + prevStop.n + ".";
      else if (moved < 0) movement = "Since your reading on " + when + ", you're " + (-moved) + (moved === -1 ? " stop" : " stops") + " lower than Stop " + prevStop.n + ". Sliding back is part of every climb.";
      else movement = "You're at the same stop as your reading on " + when + ". Some stops take more than one season.";
      var pc = prev.reading.circles || {}, best = null;
      CIRCLE_KEYS.forEach(function (k) {
        var d = c[k] - (Number(pc[k]) || 0);
        if (!best || Math.abs(d) > Math.abs(best.d)) best = { k: k, d: d };
      });
      if (best && Math.abs(best.d) >= 2) movement += " The biggest change is in " + lower(CIRCLE_NAMES[best.k]) + ", " + (best.d > 0 ? "up " : "down ") + Math.abs(best.d) + ".";
    }

    // What stands out
    var patterns = [];
    if (scored.length >= 2) {
      patterns.push("Your strongest circle is " + lower(CIRCLE_NAMES[strongest]) + " at " + c[strongest] + "/10, and the one that most needs attention is " + lower(CIRCLE_NAMES[growing]) + " at " + c[growing] + "/10." +
        (gap >= 5 ? " A gap that wide usually means one face is carrying the rest of the climb." : gap <= 2 ? " They're close together, so you're climbing fairly evenly." : ""));
    }
    if (picked && scored.length >= 2 && st.mask && st.mask !== 15) {
      if (!has(strongest)) patterns.push("The stop you picked doesn't stand on your strongest circle, " + lower(CIRCLE_NAMES[strongest]) + ". You may be underrating what you already have.");
      else if (has(growing) && c[growing] <= 4) patterns.push("The stop you picked leans on " + lower(CIRCLE_NAMES[growing]) + ", which you rated " + c[growing] + "/10. That tension is worth sitting with.");
    }
    if (picked && scored.length >= 2 && scoreStop && scoreStop.id !== st.id) {
      patterns.push("Your scores alone would put you near Stop " + scoreStop.n + ", " + scoreStop.data.title + ". Read both and notice which one stings more.");
    }
    if (hasText(a.love_hours) && hasText(a.needs_problem)) {
      patterns.push("You could spend hours on " + q(a.love_hours) + ", and you notice " + q(a.needs_problem) + ". Ask whether there's a version of the first that serves the second.");
    } else if (hasText(a.good_asked) && hasText(a.paid_ask)) {
      patterns.push("People already come to you for " + q(a.good_asked) + ", and you'd charge for " + q(a.paid_ask) + " if you weren't afraid to ask. Where those overlap, you have a price to name.");
    }
    var skipped = ALL_QS.length - countAnswered();
    if (skipped >= 5) patterns.push("You skipped " + skipped + " questions. The reading gets more specific the more you write.");

    var allText = ALL_QS.map(function (qq) { return typeof a[qq.id] === "string" ? a[qq.id] : ""; }).join(" ").toLowerCase();
    var care = CARE_WORDS.test(allText)
      ? "Some of what you wrote sounds really heavy. If you're thinking about hurting yourself, please reach out to someone you trust today. In the US you can call or text 988 to reach the Suicide & Crisis Lifeline at any hour, or contact your local crisis line wherever you are."
      : "";

    return {
      stopId: st.id,
      nextStopId: stops[st.n] ? stops[st.n].id : "",
      why: why,
      movement: movement,
      summary: st.data.feels,
      voice: (hasText(a.climb_voice) ? clip(a.climb_voice, 240) : st.data.voice).replace(/^["“]+|["”]+$/g, ""),
      circles: c,
      strongest: scored.length >= 2 ? strongest : "",
      growing: scored.length >= 2 ? growing : "",
      patterns: patterns.slice(0, 4),
      steps: [
        firstSentences(st.data.through, 2),
        GROW_STEPS[growing](a),
        "Write your answer to the question below somewhere you'll see it. Come back in a month, take the journal again and see how you've moved."
      ],
      question: st.data.question,
      care: care,
      note: ""
    };
  }

  function runReading() {
    if (reading.busy) return;
    if (!countAnswered()) { goStep(1); return; }
    reading.error = "";
    if (J.saveTimer) { clearTimeout(J.saveTimer); saveDraft(); }

    var finish = function (r, source) {
      var entry = { createdAt: new Date().toISOString(), source: source, reading: r };
      reading.busy = false; reading.ctl = null;
      if (J.db) {
        entriesRef().add({ createdAt: entry.createdAt, source: source, reading: r, answers: JSON.parse(JSON.stringify(journal.answers)), startSide: SIDES[startIdx].key })
          .then(function (ref) {
            entry.id = ref.id;
          }, function () {
            localEntries.unshift(entry);
            setStatus("This reading couldn't be saved, so it lasts until you close the page.");
            onEntriesChanged();
          });
      } else {
        localEntries.unshift(entry);
      }
      viewing = entry;
      onEntriesChanged();
      if (!portalEl.hidden) { portalStep = 6; renderPortal(); portalBody.scrollTop = 0; }
    };

    if (!J.ready) {
      reading.busy = true;
      renderPortal();
      whenReady(function () { reading.busy = false; runReading(); });
      return;
    }
    finish(quickReading(), "browser");
  }

  /* ------------------------------------------------------------------ */
  /* A gentle nudge toward booking a call                                */
  /* ------------------------------------------------------------------ */

  // Shows once, after the visitor has read a couple of stops and spent a
  // little time on the page. "Maybe later" or a click through to /book keeps
  // it away for two weeks. It steps aside at the end of the trail, which has
  // its own booking card, and never covers the journal.
  var NUDGE_KEY = "ikigai-mountain:nudge-quiet-until";
  var NUDGE_QUIET_MS = 14 * 24 * 60 * 60 * 1000;
  var NUDGE_MIN_STOP = 2;
  var NUDGE_MIN_MS = 10000;
  var nudgeEl = document.getElementById("nudge");
  var nudgeState = { shown: false, done: false, loadedAt: performance.now() };

  function nudgeIsQuiet() {
    try { return Number(localStorage.getItem(NUDGE_KEY) || 0) > Date.now(); } catch (e) { return false; }
  }
  function nudgeQuiet() {
    try { localStorage.setItem(NUDGE_KEY, String(Date.now() + NUDGE_QUIET_MS)); } catch (e) { /* stays quiet for this visit */ }
  }
  function showNudge() {
    if (!nudgeEl || nudgeState.shown || nudgeState.done || nudgeIsQuiet()) return;
    nudgeState.shown = true;
    nudgeEl.hidden = false;
    requestAnimationFrame(function () { requestAnimationFrame(function () { nudgeEl.classList.add("in"); }); });
  }
  function hideNudge() {
    if (!nudgeEl || nudgeState.done) return;
    nudgeState.done = true;
    nudgeEl.classList.remove("in");
    setTimeout(function () { nudgeEl.hidden = true; }, reduceMotion ? 0 : 320);
  }
  function maybeNudge() {
    if (!nudgeEl || nudgeState.done) return;
    var sec = sections[activeSec];
    if (!sec) return;
    if (sec.kind === "outro") { if (nudgeState.shown) hideNudge(); return; }
    if (sec.kind !== "stop" || sec.stop.n < NUDGE_MIN_STOP) return;
    if (!portalEl.hidden) return;
    if (playerEl && !playerEl.hidden) return;
    var wait = NUDGE_MIN_MS - (performance.now() - nudgeState.loadedAt);
    if (wait > 0) { setTimeout(maybeNudge, wait + 50); return; }
    showNudge();
  }
  if (nudgeEl) {
    document.getElementById("nudgeLater").addEventListener("click", function () { nudgeQuiet(); hideNudge(); });
  }
  // Anyone who heads to the booking page from anywhere here has seen the offer.
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href="/book"]');
    if (a) nudgeQuiet();
  });

  /* ------------------------------------------------------------------ */
  /* Read aloud                                                          */
  /* ------------------------------------------------------------------ */

  // Narration is recorded ahead of time (scripts/narrate.mjs) and listed in
  // audio/manifest.json. Until that file exists, none of this shows.
  var playerEl = document.getElementById("player");
  var listenAllBtn = document.getElementById("listenAll");
  var AUD = { manifest: null, el: null, currentId: null, seeking: false };
  var RATES = [1, 1.25, 1.5, 0.75];
  var PREF_RATE = "ikigai-mountain:listen-rate";
  var PREF_AUTO = "ikigai-mountain:listen-autoplay";
  function prefGet(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function prefSet(k, v) { try { localStorage.setItem(k, String(v)); } catch (e) { /* not saved */ } }
  AUD.rate = Number(prefGet(PREF_RATE, "1")) || 1;
  if (RATES.indexOf(AUD.rate) < 0) AUD.rate = 1;
  AUD.auto = prefGet(PREF_AUTO, "1") !== "0";

  var ICON = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z"/></svg>'
  };

  function fmtTime(s) {
    if (!isFinite(s) || s < 0) s = 0;
    var m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return m + ":" + (sec < 10 ? "0" : "") + sec;
  }
  function audioIdFor(st) { return st.kind === "trailhead" ? "trailhead-" + SIDES[startIdx].key : st.id; }
  function audioFor(st) { return AUD.manifest ? AUD.manifest.sections[audioIdFor(st)] || null : null; }
  function stopByAudioId(id) {
    for (var i = 0; i < stops.length; i++) if (audioIdFor(stops[i]) === id) return stops[i];
    return null;
  }
  function neighbor(st, dir) {
    for (var i = st.n - 1 + dir; i >= 0 && i < stops.length; i += dir) if (audioFor(stops[i])) return stops[i];
    return null;
  }
  function isPlaying() { return !!(AUD.el && !AUD.el.paused && !AUD.el.ended); }

  function decorateStopsWithListen() {
    if (!AUD.manifest) return;
    stops.forEach(function (st) {
      var li = document.getElementById("stop-" + st.n);
      if (!li) return;
      var old = li.querySelector(".listen");
      if (old) old.remove();
      var a = audioFor(st);
      if (!a) return;
      var b = document.createElement("button");
      b.type = "button";
      b.className = "listen";
      b.dataset.audioId = audioIdFor(st);
      b.innerHTML = '<span class="listen-ic"></span><span class="listen-label"></span><span class="listen-dur"></span>';
      b.querySelector(".listen-dur").textContent = fmtTime(a.seconds);
      b.addEventListener("click", function () {
        var s = stopByAudioId(b.dataset.audioId);
        if (!s) return;
        if (AUD.currentId === b.dataset.audioId && isPlaying()) AUD.el.pause();
        else playStop(s);
      });
      li.querySelector(".stop-title").after(b);
    });
    syncListenUi();
  }

  function syncListenUi() {
    var playing = isPlaying();
    Array.prototype.forEach.call(document.querySelectorAll(".listen"), function (b) {
      var on = b.dataset.audioId === AUD.currentId && playerEl && !playerEl.hidden;
      var live = on && playing;
      b.classList.toggle("on", on);
      b.querySelector(".listen-ic").innerHTML = live ? ICON.pause : ICON.play;
      b.querySelector(".listen-label").textContent = live ? "Pause" : on ? "Resume" : "Listen";
      b.setAttribute("aria-label", (live ? "Pause" : on ? "Resume" : "Listen to") + " this stop");
    });
    if (!playerEl) return;
    var pb = document.getElementById("plPlay");
    pb.innerHTML = playing ? ICON.pause : ICON.play;
    pb.setAttribute("aria-label", playing ? "Pause" : "Play");
    if ("mediaSession" in navigator) navigator.mediaSession.playbackState = playing ? "playing" : "paused";
  }

  function ensureAudio() {
    if (AUD.el) return AUD.el;
    var el = new Audio();
    el.preload = "metadata";
    el.addEventListener("play", syncListenUi);
    el.addEventListener("pause", syncListenUi);
    el.addEventListener("loadedmetadata", function () {
      el.playbackRate = AUD.rate;
      document.getElementById("plDur").textContent = fmtTime(el.duration);
    });
    el.addEventListener("timeupdate", function () {
      if (AUD.seeking) return;
      document.getElementById("plTime").textContent = fmtTime(el.currentTime);
      var seek = document.getElementById("plSeek");
      seek.value = el.duration ? Math.round((el.currentTime / el.duration) * 1000) : 0;
      seek.setAttribute("aria-valuetext", fmtTime(el.currentTime) + " of " + fmtTime(el.duration));
    });
    el.addEventListener("ended", function () {
      syncListenUi();
      var st = stopByAudioId(AUD.currentId);
      var next = st && AUD.auto ? neighbor(st, 1) : null;
      if (!next) return;
      var following = sections[activeSec] && sections[activeSec].stop === st;
      playStop(next);
      if (following) goToStop(next.n);
    });
    AUD.el = el;
    if ("mediaSession" in navigator) {
      var ms = navigator.mediaSession;
      var on = function (action, fn) { try { ms.setActionHandler(action, fn); } catch (e) { /* unsupported */ } };
      on("play", function () { el.play(); });
      on("pause", function () { el.pause(); });
      on("seekbackward", function () { skip(-15); });
      on("seekforward", function () { skip(15); });
      on("seekto", function (d) { if (d && isFinite(d.seekTime)) el.currentTime = d.seekTime; });
      on("previoustrack", function () { var s = stopByAudioId(AUD.currentId); var p = s && neighbor(s, -1); if (p) playStop(p); });
      on("nexttrack", function () { var s = stopByAudioId(AUD.currentId); var n = s && neighbor(s, 1); if (n) playStop(n); });
    }
    return el;
  }

  function skip(sec) {
    if (!AUD.el) return;
    var d = AUD.el.duration || 0;
    AUD.el.currentTime = Math.max(0, Math.min(d ? d - 0.2 : 0, AUD.el.currentTime + sec));
  }

  function showPlayer() {
    if (!playerEl || !playerEl.hidden) return;
    playerEl.hidden = false;
    document.body.classList.add("has-player");
    if (nudgeState.shown && !nudgeState.done) hideNudge();
    sizePlayer();
    requestAnimationFrame(function () { requestAnimationFrame(function () { playerEl.classList.add("in"); }); });
  }
  function closePlayer() {
    if (AUD.el) AUD.el.pause();
    playerEl.classList.remove("in");
    playerEl.hidden = true;
    document.body.classList.remove("has-player");
    syncListenUi();
  }
  function sizePlayer() {
    var story = document.getElementById("story");
    if (story) document.documentElement.style.setProperty("--story-w", story.getBoundingClientRect().width + "px");
  }
  window.addEventListener("resize", sizePlayer);

  function playStop(st) {
    var a = audioFor(st);
    if (!a) return;
    var el = ensureAudio();
    var id = audioIdFor(st);
    if (AUD.currentId !== id) {
      AUD.currentId = id;
      el.src = "/audio/" + a.file + "?v=" + a.hash;
      el.defaultPlaybackRate = AUD.rate;
      el.playbackRate = AUD.rate;
      document.getElementById("plKicker").textContent = "Stop " + st.n + " of " + stops.length + " · " + st.place;
      document.getElementById("plTitle").textContent = st.data.title;
      document.getElementById("plTime").textContent = "0:00";
      document.getElementById("plDur").textContent = fmtTime(a.seconds);
      document.getElementById("plSeek").value = 0;
      if ("mediaSession" in navigator && window.MediaMetadata) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: st.data.title,
          artist: "Stop " + st.n + " · The Ikigai Mountain",
          album: "gnarcoding.com",
          artwork: [{ src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
        });
      }
    }
    showPlayer();
    var p = el.play();
    if (p && p.catch) p.catch(function () { syncListenUi(); });
    syncListenUi();
  }

  if (playerEl) {
    document.getElementById("plPlay").addEventListener("click", function () {
      if (!AUD.el) return;
      if (isPlaying()) AUD.el.pause(); else AUD.el.play();
    });
    document.getElementById("plBack").addEventListener("click", function () { skip(-15); });
    document.getElementById("plFwd").addEventListener("click", function () { skip(15); });
    document.getElementById("plClose").addEventListener("click", closePlayer);
    var seek = document.getElementById("plSeek");
    seek.addEventListener("input", function () {
      AUD.seeking = true;
      if (AUD.el && AUD.el.duration) document.getElementById("plTime").textContent = fmtTime((seek.value / 1000) * AUD.el.duration);
    });
    seek.addEventListener("change", function () {
      if (AUD.el && AUD.el.duration) AUD.el.currentTime = (seek.value / 1000) * AUD.el.duration;
      AUD.seeking = false;
    });
    var speedBtn = document.getElementById("plSpeed");
    var paintSpeed = function () { speedBtn.textContent = AUD.rate + "×"; speedBtn.setAttribute("aria-label", "Playback speed " + AUD.rate + " times"); };
    paintSpeed();
    speedBtn.addEventListener("click", function () {
      AUD.rate = RATES[(RATES.indexOf(AUD.rate) + 1) % RATES.length];
      if (AUD.el) { AUD.el.defaultPlaybackRate = AUD.rate; AUD.el.playbackRate = AUD.rate; }
      prefSet(PREF_RATE, AUD.rate);
      paintSpeed();
    });
    var autoBtn = document.getElementById("plAuto");
    var paintAuto = function () { autoBtn.setAttribute("aria-pressed", String(AUD.auto)); };
    paintAuto();
    autoBtn.addEventListener("click", function () { AUD.auto = !AUD.auto; prefSet(PREF_AUTO, AUD.auto ? "1" : "0"); paintAuto(); });
  }
  if (listenAllBtn) {
    listenAllBtn.addEventListener("click", function () {
      var first = stops.filter(function (s) { return audioFor(s); })[0];
      if (!first) return;
      if (!AUD.auto) { AUD.auto = true; prefSet(PREF_AUTO, "1"); document.getElementById("plAuto").setAttribute("aria-pressed", "true"); }
      playStop(first);
      goToStop(first.n);
    });
  }

  if (window.fetch && playerEl) {
    fetch("/audio/manifest.json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (m) {
        if (!m || !m.sections || !Object.keys(m.sections).length) return;
        AUD.manifest = m;
        decorateStopsWithListen();
        if (listenAllBtn) listenAllBtn.hidden = false;
      })
      .catch(function () { /* no narration yet */ });
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */

  buildJourney(startIdx);
  renderStory();
  applyTheme();
  if (hasGL) {
    if (window.ResizeObserver) new ResizeObserver(resize).observe(stageEl);
    window.addEventListener("resize", resize);
    resize();
    applyCamera();
  } else {
    drawProfile();
    window.addEventListener("resize", drawProfile);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measureLabels(); });
  requestAnimationFrame(frame);

})();
