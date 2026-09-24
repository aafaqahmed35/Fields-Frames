import { cinemaStories } from "@/app/cinema/cinema-stories";
import { essayStories } from "@/app/essays/essay-stories";
import { fieldStories } from "@/app/football/field-stories";

import { getAuthor, type Author, type AuthorName } from "./authors";
import { deriveReadingMinutes, formatPublicationDate } from "./editorial-utils";
import type {
  ArticleSummary,
  EditorialSection,
  StoryImage,
  StorySummary,
} from "./story";
import { sectionRoutes } from "./story";

export type ArticleMode = "STANDARD" | "FEATURE" | "ESSAY";

export type EditorialBodyBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "pullQuote"; text: string; attribution?: string }
  | { type: "figure"; image: StoryImage }
  | { type: "list"; style: "ordered" | "unordered"; items: readonly string[] }
  | { type: "divider" }
  | { type: "note"; label?: string; text: string };

export type ArticleReference = {
  section: EditorialSection;
  slug: string;
};

export type Article = StorySummary & {
  section: EditorialSection;
  mode: ArticleMode;
  readingMinutes: number;
  authorDetails: Author;
  kicker?: string;
  opening?: string;
  body: readonly EditorialBodyBlock[];
  related: readonly ArticleReference[];
  relatedArticles: readonly ArticleSummary[];
  seo?: {
    title?: string;
    description?: string;
    socialImage?: StoryImage;
  };
};

type ArticleDetails = Omit<
  Article,
  | keyof StorySummary
  | "section"
  | "authorDetails"
  | "readingMinutes"
  | "relatedArticles"
>;

function defineArticle(
  section: EditorialSection,
  story: StorySummary,
  details: ArticleDetails,
): Article {
  return {
    ...story,
    section,
    ...details,
    authorDetails: getAuthor(story.author as AuthorName),
    dateLabel: formatPublicationDate(story.date),
    readingMinutes: deriveReadingMinutes(details.body, details.opening),
    relatedArticles: [],
  };
}

function storyBySlug(stories: readonly StorySummary[], slug: string) {
  const story = stories.find((candidate) => candidate.slug === slug);

  if (!story) {
    throw new Error(`Article references an unknown story summary: ${slug}`);
  }

  return story;
}

function storyImage(
  stories: readonly StorySummary[],
  slug: string,
  caption: string,
): StoryImage {
  const image = storyBySlug(stories, slug).image;

  if (!image) {
    throw new Error(`Article figure references a story without an image: ${slug}`);
  }

  return { ...image, caption };
}

export const articles: readonly Article[] = [
  defineArticle(
    "FIELD",
    storyBySlug(fieldStories, "what-the-floodlights-remember"),
    {
      mode: "FEATURE",
      kicker: "Grounds and belonging",
      opening:
        "Long after the players leave, a football ground continues to hold the evening: rain in the goalmouth, voices in the stand, and light falling on an empty rectangle.",
      body: [
        {
          type: "paragraph",
          text: "The floodlights come on before anyone needs them. At first they are pale interruptions in the late afternoon, four faint grids above the roofs. The groundsman switches them on while the sky is still blue and the ball can still be followed without help. Their work begins as rehearsal. By kick-off, the day has withdrawn and the pitch has become the brightest thing for several streets.",
        },
        {
          type: "paragraph",
          text: "From outside the ground, light is the first evidence that something is happening. It rises behind the supermarket, catches the low cloud, and puts a silver edge around the plane trees. People approaching from the station do not need a map for the final turn. They walk toward the glow, joining other small groups until a crowd has assembled almost by accident.",
        },
        {
          type: "heading",
          level: 2,
          text: "A light made for looking together",
        },
        {
          type: "paragraph",
          text: "A floodlight is practical equipment, but its effect is theatrical. It removes the surrounding town and leaves the field intact. The ring road continues beyond the fence; a bus exhales at the stop; kitchens are cleared after dinner. Inside, every white line appears newly painted. The ordinary patch of ground on which dogs were walked that morning has become a place with an edge, a centre, and a common object of attention.",
        },
        {
          type: "paragraph",
          text: "That attention has its own weather. A clearance climbs into the brightness and briefly disappears. Rain becomes visible as thousands of diagonal strokes. Steam lifts from a huddle. On cold nights, the crowd can see its own breath while the players run in short sleeves below. The lights do not merely illuminate the match; they show the air through which the match is moving.",
        },
        {
          type: "pullQuote",
          text: "The ground remembers in layers: a repaired seat, a name scratched into paint, a route the feet can complete without instruction.",
        },
        {
          type: "paragraph",
          text: "Memory at a football ground is rarely stored in a single grand object. It accumulates in habits. A family stands two barriers along from the place they used to stand. Someone still looks toward a stairwell when the teams emerge because that is where a friend once waited. The tea hatch has moved, but the old queue forms for several weeks in front of the blank wall. Bodies remember layouts after buildings have forgotten them.",
        },
        {
          type: "heading",
          level: 2,
          text: "After the whistle",
        },
        {
          type: "paragraph",
          text: "The final whistle does not end the evening at once. Players shake hands in separate, private disappointments. A substitute collects cones. The last argument continues near the tunnel, already losing detail as it becomes a story. In the stand, rows reveal themselves as people leave. What had seemed like a single voice becomes scarves, paper cups, dropped gloves, and the patient upward movement toward the exits.",
        },
        {
          type: "paragraph",
          text: "Then the ground changes scale. Without spectators, the pitch looks both larger and less important. The goals are equipment again. One bank of lights goes dark, then another, and the town returns around the edges: warehouse signs, upstairs windows, the red sequence of cars at the junction. Darkness is not restored evenly. For a few minutes one corner remains intensely lit, a stage after the company has gone.",
        },
        {
          type: "paragraph",
          text: "This is when the place seems most full of what has happened there. Not because a ground possesses memory in any mystical sense, but because it has been shaped by repeated human arrival. Paint has worn where hands rest. Steps have shallow centres. A gate closes with a sound that generations have heard while thinking about victory, defeat, dinner, the last bus, or nothing in particular.",
        },
        {
          type: "paragraph",
          text: "Maintenance becomes a form of continuity. Nets are replaced, bulbs changed, railings repainted, and each repair makes the ground less original but more itself. The place survives because somebody keeps arriving on a weekday morning to address what Saturday wore down. Memory here depends on renewal: not preserving every surface, but preserving the possibility that people can return and recognize the arrangement.",
        },
        {
          type: "paragraph",
          text: "A stadium on television is designed to disappear behind the game. A local ground cannot. Its roof leaks into the story. Its neighbouring houses retrieve the ball. Its floodlights tell people walking home that play continues somewhere behind the wall. Years later, the score may be unrecoverable, but the angle of that light can return entire evenings: who stood beside us, how the rain smelled, and the brief belief that this patch of earth was the centre of everything.",
        },
      ],
      related: [
        { section: "FIELD", slug: "the-geometry-of-the-second-ball" },
        { section: "CINEMA", slug: "the-room-before-the-picture-begins" },
        { section: "ESSAYS", slug: "the-case-for-looking-out-of-the-window" },
      ],
    },
  ),
  defineArticle(
    "FIELD",
    storyBySlug(fieldStories, "the-geometry-of-the-second-ball"),
    {
      mode: "STANDARD",
      kicker: "Reading the shape",
      opening:
        "The first duel attracts the eye. The second ball reveals the team: its distances, its expectations, and whether eleven players have read the same possibility.",
      body: [
        {
          type: "paragraph",
          text: "A goalkeeper sends the ball long. Two players jump beneath it, arms raised for balance, while the camera and the crowd follow the collision. Yet the decisive action is often already forming five metres away. A midfielder slows instead of charging forward. A full-back narrows. A forward steps onto the far side of an opponent. They are not waiting for a pass. They are arranging themselves for an uncertainty.",
        },
        {
          type: "paragraph",
          text: "The second ball is not literally always the second touch. It is the next playable moment after an unstable contest: a header without a target, a tackle that jars possession loose, a clearance that hangs, a blocked pass that changes direction. Because nobody controls its origin, control must be built around where it may land.",
        },
        {
          type: "heading",
          level: 2,
          text: "Three distances to watch",
        },
        {
          type: "list",
          style: "ordered",
          items: [
            "The distance beneath the duel: close enough to collect a downward touch, far enough to see its direction.",
            "The distance behind the collector: protection if the first pass is rushed, support if possession can be secured.",
            "The distance to the far side: the space opened when both teams lean toward the original contest.",
          ],
        },
        {
          type: "paragraph",
          text: "Good second-ball teams seem fortunate because the loose ball repeatedly finds them. Usually the sequence runs the other way. Their positions make several outcomes useful. If the header drops short, one player is underneath it. If it travels, another can contest. If the opponent wins cleanly, a third is placed to interrupt the next action. Luck has not vanished; it has been given fewer places to cause damage.",
        },
        {
          type: "note",
          label: "Viewing note",
          text: "When the ball goes long, resist following its full flight. Look once at the landing zone, then at the ring of players forming around it.",
        },
        {
          type: "heading",
          level: 2,
          text: "The shape after contact",
        },
        {
          type: "paragraph",
          text: "The most revealing instant comes after contact. One team expands toward the loose ball; the other breaks into individual reactions. A compact midfield can become a row of backs if everyone retreats. An aggressive press can dissolve if the nearest player attacks while the next line hesitates. For a second, the formation displayed before kick-off is irrelevant. What matters is the geometry created by shared anticipation.",
        },
        {
          type: "paragraph",
          text: "This is why winning the aerial duel and winning the situation are different achievements. A centre-forward may make perfect contact and still head into an empty patch owned by the opposition. Another may barely glance the ball, yet the touch is valuable because teammates have crowded the probable exit. The duel supplies force. The structure gives that force a destination.",
        },
        {
          type: "paragraph",
          text: "There is also a social quality to the second ball. It rewards players who act on trust. The midfielder moves before knowing the striker will compete. The defender holds a higher line because the player in front is expected to delay. Each position is a small wager on somebody else's action. When the wagers agree, the team looks alert. When they do not, the same players look slow.",
        },
        {
          type: "divider",
        },
        {
          type: "paragraph",
          text: "Broadcast football naturally privileges possession. The ball is the easiest thing to frame and the clearest thing to name. Second-ball football asks for a wider kind of looking. The important movement may belong to the player who never receives it: the one who closes the escape, occupies the counter-pass, or stands where a hurried clearance is likely to fall.",
        },
        {
          type: "paragraph",
          text: "Once noticed, these small arrangements change the match. A sequence previously described as scrappy acquires intention. Territory is not only gained by passes but by preparing for imperfect ones. The first contest still makes the noise. Around it, quieter decisions determine who is ready for what comes next.",
        },
      ],
      related: [
        { section: "FIELD", slug: "what-the-floodlights-remember" },
        { section: "CINEMA", slug: "cutting-on-the-breath" },
      ],
    },
  ),
  defineArticle(
    "CINEMA",
    storyBySlug(cinemaStories, "the-room-before-the-picture-begins"),
    {
      mode: "FEATURE",
      kicker: "The audience",
      opening:
        "Before the projector makes its first image, the cinema is already at work: adjusting our eyes, gathering strangers, and making waiting feel like part of the film.",
      body: [
        {
          type: "paragraph",
          text: "The screen is grey before it is white. In an empty auditorium it reflects the exit signs, the aisle lights, and whatever brightness follows through the open door. It is not yet a window or a face or a landscape. It is a surface waiting to acquire distance.",
        },
        {
          type: "paragraph",
          text: "People enter as silhouettes and become neighbours by degrees. Coats are folded. A bag moves from a seat to the floor. Two friends continue a conversation in the lower register demanded by the room. Each new arrival pauses to read the numbers, but also to read the audience: who has come alone, where the empty stretches are, how close anyone wishes to sit to a stranger.",
        },
        {
          type: "heading",
          level: 2,
          text: "The architecture of anticipation",
        },
        {
          type: "paragraph",
          text: "Cinemas make waiting visible. In a living room, the interval before a film is filled with menus, messages, and errands to the kitchen. Here there is only the appointed direction. The seats face one wall. The curtains, when there are curtains, frame an absence. Even conversation accepts that it will soon be interrupted.",
        },
        {
          type: "paragraph",
          text: "The room performs a gradual subtraction. The lobby's surfaces are bright and various, built for choosing. The auditorium narrows that field. Advertisements may arrive, music may play, but the body has already understood the arrangement: remain seated, look forward, let the edges recede. Darkness is not merely a condition for seeing the picture. It is the means by which everything competing with the picture is gently removed.",
        },
        {
          type: "pullQuote",
          text: "A blank screen is a promise made collectively: soon, everyone in the room will look at the same light and see it privately.",
        },
        {
          type: "paragraph",
          text: "This collective privacy is the cinema's lasting strangeness. We agree to share attention without sharing a response. Laughter crosses the room and briefly makes the audience legible. Silence can do the same, especially after a scene has ended more abruptly than expected. But most reactions remain unannounced: a held breath, a remembered place, a line stored for later.",
        },
        {
          type: "paragraph",
          text: "The strangers matter even when they make no sound. Their presence sets a boundary around distraction. A phone lighting several rows ahead feels intrusive not only because it is bright, but because it breaks an agreement nobody had to state. We lend one another the discipline of staying. The room holds attention partly because attention is being held all around us.",
        },
        {
          type: "heading",
          level: 2,
          text: "When the house lights fall",
        },
        {
          type: "paragraph",
          text: "There is usually no single instant at which waiting becomes watching. The lights descend in stages. The last conversations reduce to fragments. A logo appears, perhaps followed by another, and the screen tests its scales: text, darkness, a field of colour, then the first image that belongs to the film. We have crossed the threshold before we can point to it.",
        },
        {
          type: "paragraph",
          text: "The first shot inherits everything that preceded it. A quiet opening can use the attention accumulated by the room. A loud one spends it immediately. A face shown without introduction feels enormous partly because we have been prepared to receive enormity. For several minutes our eyes have adjusted not only to darkness but to significance.",
        },
        {
          type: "paragraph",
          text: "This is why arriving late feels like missing more than plot. The corridor door opens onto an image already in progress, but also onto a concentration already formed. The latecomer must find a seat, remove a coat, and enter the film while everyone else has completed those actions in advance. The room has begun without them.",
        },
        {
          type: "paragraph",
          text: "Different cinemas teach this transition differently. In a small room the projector may be audible, giving the image a mechanical source. In an old auditorium curtains can still make the screen seem discovered rather than switched on. A multipurpose hall asks folding chairs and temporary darkness to do the same work. Grandeur is optional. What matters is the deliberate redirection of a room toward an image.",
        },
        {
          type: "paragraph",
          text: "After the credits, the process reverses badly. Light returns too quickly. Faces appear where an audience had been. People collect their belongings with the faint embarrassment of waking in public, then step into the lobby speaking either too loudly or not at all. The screen remains behind them, blank again but altered by what it held.",
        },
        {
          type: "paragraph",
          text: "A cinema before the picture begins is therefore not empty time around the real event. It is one of the forms through which the event becomes possible. The waiting gives the image an address. It turns a wall into a destination and a group of ticket holders into an audience, ready to be alone together when the light arrives.",
        },
      ],
      related: [
        { section: "CINEMA", slug: "cutting-on-the-breath" },
        { section: "FIELD", slug: "what-the-floodlights-remember" },
        { section: "ESSAYS", slug: "the-case-for-looking-out-of-the-window" },
      ],
    },
  ),
  defineArticle(
    "CINEMA",
    storyBySlug(cinemaStories, "cutting-on-the-breath"),
    {
      mode: "STANDARD",
      kicker: "Craft / Editing",
      opening:
        "Some cuts announce a new fact. Others arrive at the instant a body has finished thinking, using breath to turn separate images into one continuous attention.",
      body: [
        {
          type: "paragraph",
          text: "Watch a person listening and the scene will often reveal its edit before the image changes. The shoulders settle. The mouth opens and decides against speech. A breath that had been held is released. Somewhere inside that small physical conclusion, the editor finds permission to leave.",
        },
        {
          type: "paragraph",
          text: "Cutting on breath does not mean matching every inhale to a new shot. Used that literally, it would become a metronome. Breath matters because it marks pressure and release. It tells us when a thought has entered the body, when a line has cost something, or when a silence has reached the limit of what it can contain.",
        },
        {
          type: "figure",
          image: storyImage(
            cinemaStories,
            "cutting-on-the-breath",
            "The edit is built in replay: looking for the instant movement becomes meaning.",
          ),
        },
        {
          type: "heading",
          level: 2,
          text: "Rhythm before explanation",
        },
        {
          type: "paragraph",
          text: "Dialogue offers obvious cutting points. A question ends; the reverse shot supplies an answer. But the cleanest exchange is not always the truest one. Staying a fraction longer on the speaker may show regret arriving after confidence. Cutting early to the listener may reveal that the answer has been understood before it is completed. The breath helps measure these fractions without making them feel calculated.",
        },
        {
          type: "paragraph",
          text: "Editors speak of pace, but pace is not simply the number of cuts in a minute. It is the relation between the duration of a shot and the amount of feeling or information moving through it. A long take can feel hurried when everyone in it is withholding air. A series of short shots can feel calm if each arrives after a completed gesture.",
        },
        {
          type: "pullQuote",
          text: "The invisible cut is not one we fail to see. It is one whose reason we feel before we have time to name it.",
        },
        {
          type: "heading",
          level: 2,
          text: "Listening to the room",
        },
        {
          type: "paragraph",
          text: "Sound carries the join across images. Room tone persists while the angle changes. A sleeve moves in one shot and finishes rustling in the next. Most importantly, a breath can begin on a face and end over the person being watched. The body remains continuous even when the camera's position does not.",
        },
        {
          type: "paragraph",
          text: "This continuity creates intimacy without requiring a close-up. We hear how near one person is to another, or how alone someone feels within a crowded frame. A shallow inhale can make a wide shot private. An exhale laid over an empty room can leave a character present after they have walked away.",
        },
        {
          type: "note",
          label: "At the timeline",
          text: "Try the cut three ways: before the breath resolves, exactly on the release, and after the room has heard it. The image may be identical; the character will not be.",
        },
        {
          type: "paragraph",
          text: "The temptation in editing is to solve a scene. Make the intention clear, remove the pause, bring the reaction forward. Breath resists that efficiency. It preserves the time required for an emotion to become physical. The pause may not advance the argument, but it tells us whether the person making it can bear the next sentence.",
        },
        {
          type: "paragraph",
          text: "A cut can therefore feel instinctive while being the result of many precise revisions. Frames are added and removed; sound is extended; the sequence is watched until technique gives way to recognition. The right moment is the one at which leaving the shot no longer feels like interruption. One image has breathed out. The next is ready to breathe in.",
        },
      ],
      related: [
        { section: "CINEMA", slug: "the-room-before-the-picture-begins" },
        { section: "FIELD", slug: "the-geometry-of-the-second-ball" },
      ],
    },
  ),
  defineArticle(
    "ESSAYS",
    storyBySlug(essayStories, "the-case-for-looking-out-of-the-window"),
    {
      mode: "ESSAY",
      kicker: "On attention",
      opening:
        "The window asks very little of us. It offers weather, repetition, an unknown person crossing the street—and, if we stay long enough, the slow return of our attention.",
      body: [
        {
          type: "paragraph",
          text: "On the bus, almost every seat contains the same posture: chin lowered, one hand holding a phone, the other arranged around the minor difficulties of travel. Bags are balanced. Sleeves are pulled back from wrists. Screens show different rooms but cast the same patient light on every face.",
        },
        {
          type: "paragraph",
          text: "The window runs beside all this activity like an unused second screen. It has no menu and remembers no preference. The view arrives without introduction: loading bays, gardens backing onto railway lines, a man setting three chairs outside a café though rain is expected. Nothing asks to be saved. Most of it cannot be found again.",
        },
        {
          type: "paragraph",
          text: "Looking out of the window is often described as doing nothing. That is part of its value. We have become skilled at turning intervals into containers for small completions. A message can be answered between stops. A headline can be absorbed before the doors open. An empty minute appears wasteful because it makes no record of having been used.",
        },
        {
          type: "heading",
          level: 2,
          text: "A view without a demand",
        },
        {
          type: "paragraph",
          text: "A window offers attention without assignment. We do not have to understand the warehouse yard or decide whether the clouds are useful. The eye can move from near reflections to distant roofs, changing focus without changing subject. This freedom is modest, but it is increasingly rare. Much of what we look at now has already decided what should follow.",
        },
        {
          type: "figure",
          image: storyImage(
            essayStories,
            "the-case-for-looking-out-of-the-window",
            "A journey can remain a journey, rather than becoming a corridor between tasks.",
          ),
        },
        {
          type: "paragraph",
          text: "The moving view also returns us to proportion. Streets do not unfold at the speed of a feed. A brick wall occupies twenty seconds because that is how long the bus takes to pass it. A cyclist disappears behind us. A lit room on the third floor is visible for less than a second, complete enough to suggest a life and too brief to support a story about it.",
        },
        {
          type: "pullQuote",
          text: "Boredom is sometimes the moment before the world becomes specific again.",
        },
        {
          type: "heading",
          level: 2,
          text: "The scale of a passing thing",
        },
        {
          type: "paragraph",
          text: "Children understand this form of looking easily. They count red cars, search upstairs windows, and announce horses with a seriousness adults reserve for delays. Their attention is not purer; it is simply less embarrassed by repetition. The tenth bridge can still be a bridge worth seeing.",
        },
        {
          type: "paragraph",
          text: "Adults often require a justification. We look out to rest our eyes, gather material, calm down, avoid conversation. Yet the best moments arrive when the justification lapses. The mind loosens its grip on the next obligation. An unfinished thought reappears, not demanding a solution, merely asking to be carried a little differently.",
        },
        {
          type: "paragraph",
          text: "Sometimes no thought arrives. This matters too. Attention can rest on the repeated rise and fall of telephone wires or the brief alignment of two streets. We need not turn the view into an exercise in creativity. The habit of extracting insight from every pause can become another refusal of pause. A window is allowed to remain only a window.",
        },
        {
          type: "paragraph",
          text: "This is not an argument against phones, nor a fantasy that every commute should become contemplation. Journeys can be long, lonely, and necessary; a screen can offer company, direction, relief. The case for the window is smaller. It is a case for leaving some portion of experience unselected.",
        },
        {
          type: "paragraph",
          text: "Outside, the city has not composed itself for us. Deliveries block lanes. Trees appear between buildings and are gone. Weather changes the same surfaces without making them new. To watch is to accept that attention need not always lead to possession. We can notice something and let it pass.",
        },
        {
          type: "paragraph",
          text: "The practice continues at home. A kitchen window frames almost the same view each day, yet repetition makes small changes available: which neighbour opens the curtains first, when a particular branch begins to bud, how winter afternoon reaches one wall and then no longer does. Familiarity does not exhaust a scene. It gives variation somewhere to appear.",
        },
        {
          type: "divider",
        },
        {
          type: "paragraph",
          text: "Near the end of the route, people begin to gather their belongings. The shared posture breaks. Coats close, headphones disappear, feet find the aisle. The window becomes practical again: a way to recognize the stop. For a moment the street outside and the life inside align, and each passenger steps from observation back into consequence.",
        },
        {
          type: "paragraph",
          text: "What remains from the journey is rarely a useful fact. It may be the colour of rain on a playground, a fox beside a fence, or the sight of someone upstairs watering a plant. These details are not important, which is why they can restore something importance wears away: the sense that the world exceeds what we have asked it to provide.",
        },
      ],
      related: [
        { section: "ESSAYS", slug: "the-taste-you-did-not-choose" },
        { section: "CINEMA", slug: "the-room-before-the-picture-begins" },
        { section: "FIELD", slug: "what-the-floodlights-remember" },
      ],
    },
  ),
  defineArticle(
    "ESSAYS",
    storyBySlug(essayStories, "the-taste-you-did-not-choose"),
    {
      mode: "ESSAY",
      kicker: "Systems, lived",
      opening:
        "Recommendation systems promise to learn what we like. The quieter question is what happens while we learn to like what they keep placing near us.",
      body: [
        {
          type: "paragraph",
          text: "Taste once left more evidence of its accidents. A borrowed album remained in the wrong case. A book was chosen because the one beside it had been removed. A film began halfway through on television and became important before its title was known. Preference grew from decisions, certainly, but also from shortages, misunderstandings, gifts, and the limits of a shelf.",
        },
        {
          type: "paragraph",
          text: "Now the shelf rearranges itself as we approach. It notes what we completed, what we abandoned, where we paused, what people with adjacent habits chose next. The result feels generous: an abundance relieved of some of its burden. We are not told what to want. We are offered a room in which the wanted things are easier to reach.",
        },
        {
          type: "heading",
          level: 2,
          text: "Prediction becomes atmosphere",
        },
        {
          type: "paragraph",
          text: "A recommendation is easy to understand as a single suggestion. This song resembles another; this essay follows a subject; this restaurant is near the place booked last month. The deeper effect comes through repetition. Similar suggestions begin to define the visible field. What is absent does not feel forbidden. It simply stops presenting itself as an available next step.",
        },
        {
          type: "paragraph",
          text: "Over time, prediction becomes atmosphere. A listener who chooses quiet music for work is offered more quiet music until an afternoon genre becomes an identity. A reader who pauses over one kind of headline finds the world returning in that shape. The system may have observed correctly. Accuracy is not the same as neutrality.",
        },
        {
          type: "pullQuote",
          text: "The most effective influence does not feel like persuasion. It feels like the convenient arrangement of what was already ours.",
        },
        {
          type: "paragraph",
          text: "Taste has never been autonomous. Families, friends, class, language, geography, and money furnish the first room. Editors and shopkeepers have always decided what enters the window. The difference is not that mediation has appeared, but that it can now be continuous, private, and responsive. The display changes for each visitor, then uses the visitor's response to change again.",
        },
        {
          type: "heading",
          level: 2,
          text: "The useful interruption",
        },
        {
          type: "paragraph",
          text: "Older forms of discovery were not inherently better. They could be narrow, exclusionary, and dependent on knowing the right person or living near the right place. Recommendation can open doors that accident never did. It can return forgotten work to circulation and connect a curious person with a subject for which they lacked the vocabulary.",
        },
        {
          type: "paragraph",
          text: "The problem is not relevance. It is relevance without interruption. A world perfectly arranged around prior behaviour has no reason to include the difficult, the unfashionable, or the simply unrelated. Yet those encounters are how preference acquires edges. We learn what we value partly by meeting what does not immediately resemble us.",
        },
        {
          type: "list",
          style: "unordered",
          items: [
            "Choose from a whole list occasionally, not only from its first screen.",
            "Let another person select without first explaining your preferences.",
            "Return to something abandoned and ask whether timing, not taste, made the decision.",
          ],
        },
        {
          type: "paragraph",
          text: "These are not acts of resistance so much as ways of restoring texture. Surprise cannot be scheduled, but conditions can be made in which it is allowed to occur. A library aisle, a community programme, a friend's unqualified enthusiasm: each introduces a logic that has not been optimized around our previous response.",
        },
        {
          type: "paragraph",
          text: "There is value, too, in encountering a common culture rather than a private sequence. Reading the same local listing, hearing the music chosen for a room, or watching whatever a small festival could afford places preference in negotiation with circumstance. The choice may be less precise, but it becomes discussable. We can ask not only whether the work suited us, but what it did among people who had not been sorted into the same prediction.",
        },
        {
          type: "paragraph",
          text: "We should also permit ourselves to like the obvious recommendation. Suspicion can become another performance, a demand that taste prove its independence by choosing difficulty. Pleasure does not become counterfeit because a system predicted it. The important thing is to notice the room as well as the object placed within it.",
        },
        {
          type: "paragraph",
          text: "Taste is not a fixed interior fact waiting to be measured. It is a practice: repeated exposure, social permission, changing circumstance, attention given at the right hour. Any system that predicts it also participates in it. The question is not whether our choices are influenced. They always are. The question is whether enough doors remain visible for us to become someone our history could not yet describe.",
        },
      ],
      related: [
        { section: "ESSAYS", slug: "the-case-for-looking-out-of-the-window" },
        { section: "CINEMA", slug: "cutting-on-the-breath" },
      ],
    },
  ),
];

export function getArticle(section: EditorialSection, slug: string) {
  const article = articles.find(
    (article) => article.section === section && article.slug === slug,
  );

  return article
    ? { ...article, relatedArticles: getRelatedArticles(article).map(toArticleSummary) }
    : undefined;
}

export function getSectionArticles(section: EditorialSection) {
  return articles.filter((article) => article.section === section);
}

export function getArticleHref(section: EditorialSection, slug: string) {
  return getArticle(section, slug)
    ? `${sectionRoutes[section]}/${slug}`
    : undefined;
}

export function getRelatedArticles(article: Article) {
  return article.related.map((reference) => {
    const related = articles.find(
      (candidate) =>
        candidate.section === reference.section &&
        candidate.slug === reference.slug,
    );

    if (!related) {
      throw new Error(
        `Missing related article: ${reference.section}/${reference.slug}`,
      );
    }

    return related;
  });
}

function toArticleSummary(article: Article): ArticleSummary {
  return {
    author: article.author,
    category: article.category,
    date: article.date,
    dateLabel: article.dateLabel,
    dek: article.dek,
    image: article.image,
    section: article.section,
    slug: article.slug,
    title: article.title,
  };
}
